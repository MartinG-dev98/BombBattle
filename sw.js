/* Bomb Battle service worker
   - Precaches the app shell so the game launches offline.
   - Navigations: network-first (so updates arrive), cache fallback.
   - Same-origin assets: stale-while-revalidate.
   - Fonts + PeerJS library (cross-origin): cached after first load.
   - PeerJS signalling / WebRTC traffic is never touched.
   Bump VERSION whenever you ship a new index.html. */
const VERSION = 'v2';
const CACHE = 'bomb-battle-' + VERSION;
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const CDN = ['https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'];
const CROSS_OK = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    // best effort: don't fail the install if the CDN is unreachable
    await Promise.all(CDN.map(u => c.add(new Request(u, { mode: 'cors' })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('bomb-battle-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (!same && !CROSS_OK.includes(url.hostname)) return;   // leave PeerJS signalling etc. alone

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const c = await caches.open(CACHE);
        c.put('./index.html', fresh.clone());
        return fresh;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req);
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
      return res;
    }).catch(() => hit);
    return hit || net;
  })());
});
