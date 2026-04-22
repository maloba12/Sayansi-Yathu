const CACHE_NAME = 'sayansi-yathu-cache-v1';
const OFFLINE_URL = '/index.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logo.png',
  // Vite injects hashed assets into DOM automatically, 
  // so we will also dynamically cache them.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network First, fallback to cache for API requests. Cache First for static assets.
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // If it's an API request and GET, try network then fallback to cache
  if (requestUrl.pathname.startsWith('/api') && event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Standard caching for static app assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) return cachedResponse;

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Cache new dynamically loaded assets
        if (event.request.method === 'GET' && !requestUrl.pathname.startsWith('/api')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
