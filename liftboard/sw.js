// Outlift service worker: shows push notifications and opens the right screen when one is tapped.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch { d = { title: 'Outlift', body: e.data ? e.data.text() : '' }; }
  e.waitUntil((async () => {
    // The open app already shows an in-app toast, so skip the system popup when it's on screen.
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (wins.some(w => w.focused && w.visibilityState === 'visible')) return;
    await self.registration.showNotification(d.title || 'Outlift', {
      body: d.body || '',
      icon: 'icon-192.png',
      badge: 'badge-96.png',
      tag: d.tag,
      renotify: !!d.tag,
      vibrate: d.kind === 'loss' || d.kind === 'last' ? [300, 100, 300] : [100, 50, 100],
      data: { link: d.link || '#/' },
    });
  })());
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const link = (e.notification.data && e.notification.data.link) || '#/';
  const url = new URL(self.registration.scope);
  url.hash = link.startsWith('#') ? link.slice(1) : '/';
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if (w.url.startsWith(self.registration.scope)) {
        await w.focus();
        w.postMessage({ link });
        return;
      }
    }
    await self.clients.openWindow(url.href);
  })());
});
