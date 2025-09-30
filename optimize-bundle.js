#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create optimized Three.js imports
const createOptimizedImports = () => {
    const optimizedImports = {
        // Core Three.js (minimal)
        "three": "./build/three.module.js",
        
        // Only the specific modules we use
        "three/addons/libs/lil-gui.module.min.js": "./jsm/libs/lil-gui.module.min.js",
        "three/addons/loaders/UltraHDRLoader.js": "./jsm/loaders/UltraHDRLoader.js",
        "three/addons/loaders/GLTFLoader.js": "./jsm/loaders/GLTFLoader.js",
        "three/addons/controls/OrbitControls.js": "./jsm/controls/OrbitControls.js"
    };

    return JSON.stringify(optimizedImports, null, 2);
};

// Create service worker for caching
const createServiceWorker = () => {
    return `
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
`;
};

// Generate optimized files
const generateOptimizedFiles = () => {
    console.log('🔧 Creating optimized bundle configuration...');
    
    // Create optimized import map
    const importMap = createOptimizedImports();
    fs.writeFileSync(path.join(__dirname, 'optimized-imports.json'), importMap);
    
    // Create service worker
    const serviceWorker = createServiceWorker();
    fs.writeFileSync(path.join(__dirname, 'sw.js'), serviceWorker);
    
    console.log('✅ Optimized files created:');
    console.log('   - optimized-imports.json (minimal Three.js imports)');
    console.log('   - sw.js (service worker for caching)');
    
    console.log('\n📊 Bundle optimization benefits:');
    console.log('   - Reduced initial bundle size');
    console.log('   - Faster loading with service worker caching');
    console.log('   - Better offline experience');
    console.log('   - Improved texture loading performance');
};

// Run optimization
generateOptimizedFiles();
