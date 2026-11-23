/* Backstage Brawl – Push-Nachrichten (Service Worker nur für Benachrichtigungen, kein Offline-Cache) */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  // Der App-Name steht auf dem Handy schon über der Nachricht – darum nie „Backstage Brawl“ als Titel.
  // Ohne Titel wird der Text selbst zur Überschrift.
  const title = d.title || d.body || 'Neuigkeiten', body = d.title ? (d.body || '') : '';
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'brawl', data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus();
    return self.clients.openWindow(url);
  }));
});
