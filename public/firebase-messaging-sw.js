// v11 - webpush.data: Android 네이티브 자동표시 없음, SW에서만 1개 표시
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = {};
  }

  const title = payload.data?.title || payload.notification?.title || '샤인테크 알림';
  const body = payload.data?.body || payload.notification?.body || '';
  const link = payload.data?.link || 'https://shine-tech-homepage.vercel.app/admin';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      data: { url: link },
    })
  );
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
