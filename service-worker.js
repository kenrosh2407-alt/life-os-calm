// LifeOS Service Worker
// Cache version – bump this when you want to force a refresh
const CACHE = 'lifeos-v2';

// Files to precache
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/splash.svg'
];

// Install SW and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// Activate and clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== CACHE) return caches.delete(k);
      }))
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', event => {
  const req = event.request;

  // Don’t try to cache non-GET requests (like POST)
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cachedRes => {
      if (cachedRes) return cachedRes;

      return fetch(req).then(networkRes => {
        // Cache new responses for next time
        return caches.open(CACHE).then(cache => {
          cache.put(req, networkRes.clone());
          return networkRes;
        });
      }).catch(() => cachedRes);
    })
  );
});
