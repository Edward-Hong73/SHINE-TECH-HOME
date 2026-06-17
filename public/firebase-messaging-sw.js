// v9 - DEBUG: raw push payload 그대로 알림에 표시
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  const rawText = event.data ? event.data.text() : 'NO DATA';
  event.waitUntil(
    self.registration.showNotification('DEBUG RAW PUSH', {
      body: rawText.substring(0, 250),
    })
  );
});
