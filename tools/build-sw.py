#!/usr/bin/env python3
"""Erzeugt sw.js (Offline-Speicher) mit der Liste aller App-Dateien.

Nach jeder Änderung an App-Dateien ausführen:  python3 tools/build-sw.py
Der Cache-Name enthält einen Hash über alle Dateien, dadurch holen sich
Geräte nach einem Update automatisch die neuen Dateien.
"""
import hashlib, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ["./", "index.html", "data.js", "manifest.webmanifest",
         "img/plan-halle.jpg", "img/plan-vertical.jpg"]
for pattern in ["icons/*.png", "img/pos/*.jpg", "img/docs/*.jpg"]:
    FILES += sorted(str(p.relative_to(ROOT)) for p in ROOT.glob(pattern))

h = hashlib.sha256()
for f in FILES:
    if f != "./":
        h.update(f.encode()); h.update((ROOT / f).read_bytes())
version = h.hexdigest()[:10]

sw = f"""/* PosMaster Offline-Speicher – erzeugt von tools/build-sw.py, nicht von Hand ändern */
const CACHE = "posmaster-{version}";
const FILES = {json.dumps(FILES, indent=0)};
// Diese Dateien zuerst aus dem Netz holen (Updates), bei Funkloch aus dem Speicher.
const NETWORK_FIRST = ["./", "index.html", "data.js", "manifest.webmanifest"];
const SCOPE = new URL("./", self.location).href;

self.addEventListener("install", e => {{
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {{cache: "reload"}})))).then(() => self.skipWaiting()));
}});
self.addEventListener("activate", e => {{
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("posmaster-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
}});
function rel(url) {{ return url.startsWith(SCOPE) ? url.slice(SCOPE.length).split(/[?#]/)[0] : null; }}
function networkFirst(req, key) {{
  return new Promise(resolve => {{
    let done = false;
    const fallback = () => caches.match(key).then(r => {{ if (!done && r) {{ done = true; resolve(r); }} }});
    const timer = setTimeout(fallback, 4000);   // schlechtes Messe-WLAN: nach 4 s gespeicherte Version zeigen
    fetch(req, {{cache: "no-cache"}}).then(res => {{
      clearTimeout(timer);
      if (res.ok) caches.open(CACHE).then(c => c.put(key, res.clone()));
      if (!done) {{ done = true; resolve(res); }}
    }}).catch(() => {{ clearTimeout(timer); fallback().then(() => {{ if (!done) {{ done = true; resolve(Response.error()); }} }}); }});
  }});
}}
self.addEventListener("fetch", e => {{
  const req = e.request;
  if (req.method !== "GET") return;
  const r = rel(req.url);
  if (r === null) return;                                   // fremde Server (z. B. Firebase) nicht anfassen
  const key = (r === "" || r === "index.html") ? "index.html" : r;
  if (NETWORK_FIRST.includes(key)) {{ e.respondWith(networkFirst(req, key)); return; }}
  if (FILES.includes(key)) {{ e.respondWith(caches.match(key).then(c => c || fetch(req))); return; }}
  // alles andere (z. B. andere Apps im Repo) ganz normal laden
}});
"""
(ROOT / "sw.js").write_text(sw)
print(f"sw.js geschrieben: {len(FILES)} Dateien, Cache posmaster-{version}")
