// supabase/functions/send-order-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Webhook 수신 전체 데이터:', JSON.stringify(payload, null, 2))

    const orderData = payload.record
    const tableName = payload.table || '';
    const isRoller = tableName.includes('order_roller_shine')
    
    const company = orderData.company_name || orderData.company || '알 수 없는 업체';
    const specs = isRoller 
      ? `규격: ${orderData.outer_diameter}*${orderData.inner_diameter}*${orderData.sponge_length}*${orderData.total_length}`
      : `제품: ${orderData.type || '클린싱'}`;
    
    const orderTitle = `[신규주문] ${company}`
    const orderBody = `주문 ID: #ORD-${orderData.id}\n${specs}\n수량: ${orderData.quantity}EA`

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: tokens, error: tokenError } = await supabaseClient
      .from('fcm_tokens')
      .select('token')

    if (tokenError || !tokens || tokens.length === 0) {
      console.log('알림을 보낼 토큰이 없습니다.');
      return new Response(JSON.stringify({ message: 'No tokens found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const fcmTokens = tokens.map(t => t.token);
    const accessToken = await getAccessToken({
      client_email: Deno.env.get('FIREBASE_CLIENT_EMAIL') ?? '',
      private_key: Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n') ?? '',
    })

    const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
    const results = await Promise.all(fcmTokens.map(async (token) => {
      try {
        const response = await fetch(
          `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              message: {
                token: token,
                notification: {
                  title: orderTitle,
                  body: orderBody,
                },
                webpush: {
                  fcm_options: {
                    link: 'https://shine-tech-homepage.vercel.app/admin'
                  }
                }
              },
            }),
          }
        )
        return await response.json();
      } catch (e) {
        return { error: e.message };
      }
    }))

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('에러 발생:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function getAccessToken({ client_email, private_key }: { client_email: string, private_key: string }) {
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  }

  const encodedHeader = b64(JSON.stringify(header))
  const encodedClaim = b64(JSON.stringify(claim))
  const signatureInput = `${encodedHeader}.${encodedClaim}`
  const signature = await sign(signatureInput, private_key)
  const jwt = `${signatureInput}.${signature}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  })

  const result = await response.json()
  return result.access_token
}

function b64(str: string) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function sign(input: string, key: string) {
  const pemHeader = "-----BEGIN PRIVATE KEY-----"
  const pemFooter = "-----END PRIVATE KEY-----"
  const pemContents = key.substring(pemHeader.length, key.length - pemFooter.length).replace(/\s/g, "")
  const binaryDerString = atob(pemContents)
  const binaryDer = new Uint8Array(binaryDerString.length)
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i)
  }

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(input)
  )

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
