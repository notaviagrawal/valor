
const CACHE_NAME = 'valor-3d-v1';
const STATIC_CACHE_URLS = [
    '/',
    '/webgl_loader_texture_ultrahdr.html',
    '/main.css',
    '/valerlogo.gltf',
    '/build/three.module.js',
    '/jsm/libs/lil-gui.module.min.js',
    '/jsm/loaders/UltraHDRLoader.js',
    '/jsm/loaders/GLTFLoader.js',
    '/jsm/controls/OrbitControls.js'
];

// Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_CACHE_URLS))
    );
});

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

// Clean up old caches
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
});
