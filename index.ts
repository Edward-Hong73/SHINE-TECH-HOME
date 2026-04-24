// supabase/functions/send-order-notification/index.ts
// 사장님, 이 전체 코드를 복사해서 Supabase Edge Function에 붙여넣으시면 됩니다.

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

    const eventType = payload.type
    const record = payload.record
    const oldRecord = payload.old_record
    
    // 데이터 추출 (삭제 시에는 old_record 사용)
    const orderData = eventType === 'DELETE' ? oldRecord : record
    
    if (!orderData) {
      return new Response(JSON.stringify({ message: 'No data to process' }), { headers: corsHeaders })
    }

    const tableName = payload.table || ''
    const isRoller = tableName.includes('order_roller_shine')
    
    // 1. 제품 정보 및 규격 설정 (*를 일관되게 사용)
    let specs = '';
    if (isRoller) {
      specs = `[규격: ${orderData.outer_diameter}*${orderData.inner_diameter}*${orderData.sponge_length}*${orderData.total_length}]`;
    } else {
      // 클린싱의 경우 타입에 따라 규격 구성
      const dim = orderData.type === '원형' 
        ? `${orderData.diameter}*${orderData.thickness}` 
        : `${orderData.width}*${orderData.height}*${orderData.thickness}`;
      specs = `[규격: ${dim}] (${orderData.type}/${orderData.color})`;
    }

    // 2. 상황별 제목 및 내용 구성
    let actionTitle = '[신규주문]'
    let orderBody = `ID: #ORD-${orderData.id}\n${specs}\n수량: ${orderData.quantity}EA`

    if (eventType === 'UPDATE') {
      actionTitle = '[주문변경]'
      if (oldRecord && oldRecord.status !== record.status) {
        orderBody = `주문하신 ${specs}의 '주문 상태'가 '${record.status}'로 업데이트 되었습니다.\n(ID: #ORD-${orderData.id})`
      } else {
        orderBody = `주문하신 ${specs}의 상세 내역이 수정되었습니다.\n(ID: #ORD-${orderData.id})`
      }
    } else if (eventType === 'DELETE') {
      actionTitle = '[주문취소]'
      orderBody = `주문하신 ${specs}의 주문이 취소되었습니다.\n(ID: #ORD-${orderData.id})`
    }

    // 3. 업체명 설정 (제목용)
    const company = orderData.company_name || orderData.company || '알 수 없는 업체'
    const orderTitle = `${actionTitle} ${company}`

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // --- 수신자 토큰 필터링 로직 ---
    
    const { data: adminUsers } = await supabaseClient
      .from('members_shine')
      .select('id')
      .eq('role', 'admin')
    
    const adminIds = (adminUsers || []).map(u => u.id)
    const targetUserIds = [...adminIds]
    if (orderData.user_id) {
      targetUserIds.push(orderData.user_id)
    }

    const { data: tokens, error: tokenError } = await supabaseClient
      .from('fcm_tokens')
      .select('token')
      .in('user_id', targetUserIds)

    if (tokenError || !tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No target tokens' }), { headers: corsHeaders })
    }

    const fcmTokens = Array.from(new Set(tokens.map(t => t.token)))

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
                    link: 'https://shine-tech-homepage.vercel.app/quote'
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

// --- Helper Functions ---

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
  return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
