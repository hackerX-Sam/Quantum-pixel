// Service Worker for Quantum Pixel
// Intercepts requests for missing JS/CSS/JSON files and proxies them from peachweb.io

const PEACH_ORIGIN = 'https://peachweb.io';
const CACHE_NAME = 'qp-assets-v1';

// Extensions of files we should try to proxy
const PROXY_EXTENSIONS = ['.js', '.css', '.json', '.wasm', '.glb', '.gltf', '.webp', '.png', '.jpg', '.svg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only intercept same-origin requests (i.e., requests to our own Vercel domain)
  if (url.origin !== self.location.origin) return;

  // Only proxy extensions we care about (skip index.html etc.)
  const shouldProxy = PROXY_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
  if (!shouldProxy) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try cache first
      const cached = await cache.match(event.request);
      if (cached) return cached;

      // Try fetching from our own origin
      try {
        const localRes = await fetch(event.request);
        if (localRes.ok) {
          cache.put(event.request, localRes.clone());
          return localRes;
        }
      } catch (e) {
        // Local fetch failed, fall through to proxy
      }

      // Fallback: proxy from peachweb.io
      const proxyUrl = `${PEACH_ORIGIN}${url.pathname}${url.search}`;
      try {
        const proxyRes = await fetch(proxyUrl, {
          headers: {
            'Accept': event.request.headers.get('Accept') || '*/*',
          }
        });
        if (proxyRes.ok) {
          cache.put(event.request, proxyRes.clone());
          return proxyRes;
        }
        return proxyRes;
      } catch (e) {
        return new Response('Asset not found', { status: 404 });
      }
    })
  );
});
