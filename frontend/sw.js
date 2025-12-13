// Service Worker for Sayansi Yathu PWA
const CACHE_NAME = 'sayansi-yathu-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/css/style.css',
    '/css/dashboard.css',
    '/js/main.js',
    '/js/dashboard.js',
    '/assets/logo.png'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Update Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
