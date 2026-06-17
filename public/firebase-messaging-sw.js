// v5 - debug: payload 내용을 알림 본문에 표시
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

messaging.onBackgroundMessage((payload) => {
  // payload 전체를 알림에 표시 (원인 파악용)
  const debugBody = JSON.stringify(payload);
  self.registration.showNotification('[DEBUG] payload 확인', {
    body: debugBody,
    icon: '/logo192.png',
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
