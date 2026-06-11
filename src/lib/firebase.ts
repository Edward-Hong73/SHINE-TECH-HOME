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

// 메시징 객체 생성 (브라우저 지원 여부 확인용)
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// 푸시 알림 토큰 받기 함수
export const requestFcmToken = async () => {
  if (!messaging) {
    console.warn('FCM: 이 브라우저는 messaging을 지원하지 않습니다.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('FCM 알림 권한 상태:', permission);
    if (permission !== 'granted') return null;

    // 서비스 워커 명시적 등록 (모바일 대응)
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;
      console.log('FCM: 서비스 워커 등록 완료');
    }

    // 캐시된 기존 토큰 삭제 후 새 토큰 발급
    try { await deleteToken(messaging); } catch (_) {}

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      console.log('FCM 토큰 발급 성공:', token.substring(0, 10) + '...');
    } else {
      console.warn('FCM 토큰이 발급되지 않았습니다.');
    }
    return token || null;

  } catch (error) {
    if ((error as any).code === 'messaging/permission-blocked') {
      console.warn('FCM: 사용자가 알림 권한을 거부했습니다.');
    } else {
      console.error('FCM Token 요청 중 에러:', error);
    }
  }
  return null;
};

export default app;
