// Schickt eine Push-Nachricht an alle Backstage-Brawl-Spieler, die Benachrichtigungen erlaubt haben.
// Start: GitHub → Actions → „Backstage Brawl – Push senden“ (Titel + Text). Abgelaufene Anmeldungen werden aufgeräumt.
const webpush = require('web-push');
const PUBLIC_KEY = 'BJlv1FU_VGh9h0LU7qafNUYJcX1agAdF8u71xrDi1h865gu8vYxDTBimpIX9kuskBjxDVX7mOvciDYMjigRalvA';
const BASE = process.env.FS_BASE || 'https://firestore.googleapis.com/v1/projects/posmaster-1fb94/databases/(default)/documents/sync/';
const KEY = 'key=AIzaSyDmYVHhpwJ13MAD28G8BEcIX_M0HEXFme0', DOC = 'brawlpushes1';
async function load() {
  const r = await fetch(BASE + DOC + '?' + KEY);
  if (r.status === 404) return { list: [], ut: null };
  if (!r.ok) throw new Error('Firestore ' + r.status);
  const d = await r.json(); return { list: (JSON.parse(d.fields.data.stringValue).s || []), ut: d.updateTime };
}
async function removeDead(dead) {
  for (let i = 0; i < 4; i++) {
    const { list, ut } = await load();
    const next = list.filter(s => !dead.has(s.e));
    const r = await fetch(BASE + DOC + '?' + KEY + '&currentDocument.updateTime=' + encodeURIComponent(ut), { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { data: { stringValue: JSON.stringify({ s: next }) } } }) });
    if (r.ok) return next.length;
  }
  return -1;
}
(async () => {
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!priv) throw new Error('Secret BRAWL_VAPID_PRIVATE_KEY fehlt');
  webpush.setVapidDetails('https://elitepole92.github.io/PosMaster/buehnen-brawl/', PUBLIC_KEY, priv);
  const title = (process.env.PUSH_TITLE || 'Backstage Brawl').slice(0, 60), body = (process.env.PUSH_BODY || '').slice(0, 200);
  if (!body) throw new Error('Kein Text angegeben');
  const { list } = await load();
  const payload = JSON.stringify({ title, body, url: './' });
  const dead = new Set(); let ok = 0, fail = 0;
  await Promise.all(list.map(s => webpush.sendNotification({ endpoint: s.e, keys: s.k }, payload, { TTL: 86400 })
    .then(() => ok++).catch(e => { if (e.statusCode === 404 || e.statusCode === 410) dead.add(s.e); else { fail++; console.log('Fehler', e.statusCode || '', (e.body || e.message || '').toString().slice(0, 120)); } })));
  console.log(`Gesendet: ${ok} von ${list.length}  ·  abgelaufen: ${dead.size}  ·  Fehler: ${fail}`);
  if (dead.size) console.log('Aufgeräumt, übrig:', await removeDead(dead));
})().catch(e => { console.error(e.message); process.exit(1); });
