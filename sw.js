/**
 * MagnificatEdu - Progressive Web App Service Worker
 * Version: 2026.10.16-v1
 */

const CACHE_NAME = 'magnificatedu-cache-v31';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './class_emulation.css',
  './class_emulation.js',
  './activities_flipbook.css',
  './activities_data.js',
  './activities_flipbook.js',
  './catechism_games.css',
  './catechism_games.js',
  './bible_data.js',
  './anh/games/thumb_noah_ark.jpg',
  './anh/games/thumb_head_tilt.jpg',
  './anh/games/thumb_shepherd_rescue.jpg',
  './anh/games/thumb_bible_memory.jpg',
  './anh/games/thumb_angel_wheel.jpg',
  './anh/games/thumb_bible_millionaire.jpg',
  './anh/games/thumb_covenant_boxes.jpg',
  './anh/games/thumb_faith_tugofwar.jpg',
  './anh/games/thumb_holy_picture_flip.jpg',
  './anh/games/thumb_temple_builder.jpg',
  './app_v2.js',
  './pwa.js',
  './manifest.json',
  './brand_logo.jpg',
  './admin_avatar.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './catholic_pastoral_bg_mobile.jpg'
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some assets could not be cached immediately:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network-first for dynamic & API; Cache-first for local static assets
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching for Supabase, chrome-extension, or non-GET requests
  if (
    event.request.method !== 'GET' ||
    requestUrl.origin.includes('supabase.co') ||
    requestUrl.protocol === 'chrome-extension:'
  ) {
    return;
  }

  // Network first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses for same-origin or CDN resources
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If offline and requesting navigation, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
