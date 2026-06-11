import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, deleteToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 메시징 객체 생성 - 브라우저 지원 여부 안전하게 체크
let _messaging: ReturnType<typeof getMessaging> | null = null;
try {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    _messaging = getMessaging(app);
  }
} catch (e) {
  console.warn('FCM: getMessaging 초기화 실패', e);
}
export const messaging = _messaging;

// 푸시 알림 토큰 받기 함수
export const requestFcmToken = async () => {
  console.log('FCM: requestFcmToken 시작');
  console.log('FCM: messaging =', messaging ? 'OK' : 'null');
  console.log('FCM: Notification 지원 =', typeof Notification !== 'undefined' ? 'YES' : 'NO');
  console.log('FCM: serviceWorker 지원 =', 'serviceWorker' in navigator ? 'YES' : 'NO');

  if (!messaging) {
    console.warn('FCM: messaging 객체가 없습니다. 브라우저 미지원.');
    return null;
  }

  if (typeof Notification === 'undefined') {
    console.warn('FCM: Notification API가 없습니다. 브라우저 미지원.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('FCM: 알림 권한 상태 =', permission);
    if (permission !== 'granted') return null;

    // 서비스 워커 명시적 등록 (모바일 필수)
    let swRegistration: ServiceWorkerRegistration | undefined;
    try {
      swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;
      console.log('FCM: 서비스 워커 등록 완료, scope =', swRegistration.scope);
    } catch (swErr) {
      console.error('FCM: 서비스 워커 등록 실패', swErr);
    }

    // 기존 토큰 그대로 사용 (없을 때만 새로 발급)
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      console.log('FCM: 토큰 발급 성공 =', token.substring(0, 15) + '...');
    } else {
      console.warn('FCM: 토큰이 발급되지 않았습니다 (빈 값).');
    }
    return token || null;

  } catch (error: any) {
    console.error('FCM: 토큰 요청 중 에러 =', error?.code, error?.message, error);
  }
  return null;
};

export default app;
