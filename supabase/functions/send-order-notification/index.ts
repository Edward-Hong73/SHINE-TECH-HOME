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
    if (!orderData) {
      console.error('에러: payload.record 데이터가 없습니다.');
      return new Response(JSON.stringify({ error: 'No record data found in payload' }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      })
    }

    const eventType: string = payload.type || 'INSERT'
    const tableName = payload.table || '';
    const isRoller = tableName.includes('order_roller_shine')

    const company = orderData.company_name || orderData.company || '알 수 없는 업체';
    const specs = isRoller
      ? `규격: ${orderData.outer_diameter}*${orderData.inner_diameter}*${orderData.sponge_length}*${orderData.total_length}`
      : `제품: ${orderData.type || '클린싱'}`;

    const titlePrefix =
      eventType === 'DELETE' ? '[주문취소]' :
      eventType === 'UPDATE' ? '[주문변경]' :
      '[신규주문]'

    const orderTitle = `${titlePrefix} ${company}`

    let orderBody = `주문 ID: #ORD-${orderData.id}\n${specs}\n수량: ${orderData.quantity}EA`
    if (eventType === 'UPDATE' && payload.old_record) {
      const oldStatus = payload.old_record.status || ''
      const newStatus = orderData.status || ''
      if (oldStatus !== newStatus) {
        orderBody += `\n상태 변경: ${oldStatus} → ${newStatus}`
      }
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. 샤인테크 직원 user_id 목록 조회 (company_name = '샤인테크')
    const { data: adminMembers, error: adminError } = await supabaseClient
      .from('members_shine')
      .select('id')
      .eq('company_name', '샤인테크')
    console.log(`관리자 조회 결과: ${adminMembers?.length ?? 0}명`, adminError ? `에러: ${adminError.message}` : '')

    const adminIds: string[] = (adminMembers || []).map((m: any) => m.id)

    // 2. 주문한 고객의 user_id 조회 (business_number 기준)
    const customerBizNum = orderData.business_number
    let customerIds: string[] = []
    if (customerBizNum) {
      const { data: customerMembers } = await supabaseClient
        .from('members_shine')
        .select('id')
        .eq('business_number', customerBizNum)
      customerIds = (customerMembers || []).map((m: any) => m.id)
    }

    // 3. 대상 user_id 합산 (중복 제거)
    const targetUserIds = Array.from(new Set([...adminIds, ...customerIds]))
    console.log(`알림 대상: 관리자 ${adminIds.length}명, 고객 ${customerIds.length}명, 총 ${targetUserIds.length}명`)

    if (targetUserIds.length === 0) {
      console.log('알림을 보낼 대상이 없습니다.');
      return new Response(JSON.stringify({ message: 'No target users found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. 대상 user_id의 FCM 토큰만 조회
    const { data: tokens, error: tokenError } = await supabaseClient
      .from('fcm_tokens')
      .select('token')
      .in('user_id', targetUserIds)

    if (tokenError || !tokens || tokens.length === 0) {
      console.log('알림을 보낼 토큰이 없습니다.');
      return new Response(JSON.stringify({ message: 'No tokens found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const fcmTokens = tokens.map(t => t.token);
    console.log(`${fcmTokens.length}개의 토큰을 찾았습니다.`);

    const accessToken = await getAccessToken({
      client_email: Deno.env.get('FIREBASE_CLIENT_EMAIL') ?? '',
      private_key: Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n') ?? '',
    })

    const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
    const results = await Promise.all(fcmTokens.map(async (token) => {
      try {
        console.log(`알림 전송 시도 중... (Token: ${token.substring(0, 10)}...)`);
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
                webpush: {
                  headers: { Urgency: 'high' },
                  notification: {
                    title: orderTitle,
                    body: orderBody,
                    icon: '/logo192.png',
                  },
                  fcm_options: {
                    link: 'https://shine-tech-homepage.vercel.app/admin',
                  },
                },
              },
            }),
          }
        )
        const result = await response.json();
        if (response.ok) {
          console.log(`알림 전송 성공! (Token: ${token.substring(0, 10)}...)`);
        } else {
          const errorCode = result?.error?.details?.[0]?.errorCode || result?.error?.status;
          console.error(`알림 전송 실패 [${errorCode}]:`, JSON.stringify(result, null, 2));

          // 만료/무효 토큰은 DB에서 즉시 삭제
          if (errorCode === 'UNREGISTERED' || errorCode === 'INVALID_ARGUMENT') {
            const { error: deleteError } = await supabaseClient
              .from('fcm_tokens')
              .delete()
              .eq('token', token);
            if (deleteError) {
              console.error(`만료 토큰 삭제 실패:`, deleteError.message);
            } else {
              console.log(`만료 토큰 DB 삭제 완료 (Token: ${token.substring(0, 10)}...)`);
            }
          }
        }
        return result;
      } catch (e) {
        console.error(`알림 전송 중 에러 발생 (Token: ${token.substring(0, 10)}...):`, e.message);
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
