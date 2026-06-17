// v10 - Firebase SDK 없음, webpush.notification 읽기 (1개만 표시)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = {};
  }

  // webpush.notification 필드가 push payload에 직접 포함됨
  const title = payload.notification?.title || '샤인테크 알림';
  const body = payload.notification?.body || '';
  const link = (payload.fcm_options?.link) || 'https://shine-tech-homepage.vercel.app/admin';

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
