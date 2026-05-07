// Minimal Service Worker for Quantum Pixel
// Only caches local static assets - does NOT proxy to external domains
// (external assets like GLBs, WebP etc. are already absolute URLs loaded by the browser directly)

const CACHE_NAME = 'qp-v2';

const LOCAL_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/website-base.css',
  '/ui-state.json',
  '/robots.txt',
  '/peachweb-favico2n.png',
  '/scene-state/7a38b385-c817-4e66-8d96-8cad23a6b0d9.json',
  '/scene-state/a2be68de-75b9-45eb-b89f-cac9fd6cde5c.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(LOCAL_ASSETS).catch((err) => {
        console.warn('SW: Some assets could not be precached:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests
  if (url.origin !== self.location.origin || event.request.method !== 'GET') {
    return;
  }

  // Network-first strategy for JSON files (scene-state, ui-state)
  if (url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for other local static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
