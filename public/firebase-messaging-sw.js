// v7 - data-only: Android OS 자동 표시 차단, onBackgroundMessage에서만 1개 표시
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

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

// data-only 수신 → onBackgroundMessage에서만 showNotification (이중 표시 없음)
messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || '샤인테크 알림';
  const body = payload.data?.body || '';
  const link = payload.data?.link || 'https://shine-tech-homepage.vercel.app/admin';

  self.registration.showNotification(title, {
    body: body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: { url: link },
  });
});

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
