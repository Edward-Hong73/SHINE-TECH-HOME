// v12 - FINAL DEBUG: raw payload를 알림 제목에 표시
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  const raw = event.data ? event.data.text() : 'NO_DATA';
  event.waitUntil(
    self.registration.showNotification(raw.substring(0, 100), {
      body: raw.substring(100, 300),
    })
  );
});
