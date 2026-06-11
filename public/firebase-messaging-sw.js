// v2
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 새 서비스 워커 즉시 활성화 (캐시 강제 갱신)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

firebase.initializeApp({
  apiKey: "AIzaSyCZTj7QKK07GlbxOcbRmllVR8ToG8RSms8",
  authDomain: "shinetech-88274.firebaseapp.com",
  projectId: "shinetech-88274",
  storageBucket: "shinetech-88274.appspot.com",
  messagingSenderId: "358070557084",
  appId: "1:358070557084:web:3bc107cc9a9dda0cf3d059"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 배경 메시지 수신:', payload);

  const title = payload.notification?.title || '샤인테크 알림';
  const body = payload.notification?.body || '';
  const link = payload.fcmOptions?.link || payload.data?.link || 'https://shine-tech-homepage.vercel.app/admin';

  self.registration.showNotification(title, {
    body: body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: { url: link },
  });
});

// 알림 클릭 시 해당 링크로 이동
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || 'https://shine-tech-homepage.vercel.app/admin';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
