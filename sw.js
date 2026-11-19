/* Bomb Battle — service worker
 *
 * Drop this file at the repo root, next to index.html (scope must be "/").
 *
 * PRECACHE mirrors the <script src> tags in index.html, in the exact same order.
 * If you add or remove a module, change BOTH index.html and this list.
 *
 * Bump CACHE_VERSION on every deploy. activate() deletes every cache that is not
 * the current one, which is what makes returning players pick up the new module
 * instead of the copy they cached last week.
 */

const CACHE_VERSION = 'bombbattle-v7';
const CACHE_NAME = CACHE_VERSION;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',

  /* vendor */
  './js/peerjs.vendor.js',

  /* load order — must match index.html exactly */
  './js/audio.js',
  './js/core.js',
  './js/map.js',
  './js/combat.js',
  './js/character.js',
  './js/enemy.js',
  './js/boss.js',
  './js/fx.js',
  './js/ui.js',
  './js/stats.js',
  './js/multiplayer.js',
  './js/boot.js',
  './js/profile.js',
  './js/readySystem.js',
  './js/mecha.js',
  './js/economy.js',
  './js/characterChampions.js',
  './js/save.js',
];

const SHELL_URL = './index.html';

/* ---------- install: fill the cache, then take over immediately ---------- */

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      /* Fetched one by one on purpose: a single missing file must not abort the
         whole precache and leave the game with no offline shell at all. */
      await Promise.all(
        PRECACHE.map(async (url) => {
          try {
            const request = new Request(url, { cache: 'reload' });
            const response = await fetch(request);
            if (response && (response.ok || response.type === 'opaque')) {
              await cache.put(url, response);
            }
          } catch (err) {
            /* asset unavailable right now — the fetch handler will retry it later */
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});

/* ---------- activate: drop every older cache ---------- */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

/* ---------- fetch: cache-first assets, network-first navigations ---------- */

self.addEventListener('fetch', (event) => {
  const request = event.request;

  /* Never touch writes. */
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* Cross-origin (Google Fonts, PeerJS signalling) goes straight to the network. */
  if (url.origin !== self.location.origin) return;

  /* Documents: try the network so a deploy lands on the next load, fall back to
     the cached shell so the game still boots offline. */
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(SHELL_URL, fresh.clone());
          }
          return fresh;
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          const shell = await cache.match(SHELL_URL);
          if (shell) return shell;
          const root = await cache.match('./');
          if (root) return root;
          return Response.error();
        }
      })()
    );
    return;
  }

  /* Everything else (js, css, icons, manifest): cache-first, refresh in place. */
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;

      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (err) {
        return cached || Response.error();
      }
    })()
  );
});
