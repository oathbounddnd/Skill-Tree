// sw.js – cache-first PWA for Netlify (v3)
const CACHE_NAME = 'dnd-skill-trees-v3';
const CORE = [
  './', './index.html',
  './Background.png',
  './star.webm',
  './Explosion_Particles_1_Flash_Shattert_COLOR_1_1200x1200.webm',
  './Impact_Hit_2_Flash_1_COLOR_3_1200x1200.webm',
  './perk.ogg',
  './manifest.webmanifest'
  // Add your other local assets here, e.g. './trees/expert.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        return resp;
      }).catch(() => {
        if (req.destination === 'document') return caches.match('./index.html');
      })
    })
  );
});