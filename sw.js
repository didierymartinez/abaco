/*
 * Ábaco – service worker: guarda la app para usarla sin conexión.
 * Al cambiar cualquier archivo de la app, sube VERSION para que se actualice.
 */
const VERSION = 'mi-abaco-v4';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/curriculum.js',
  'js/soroban.js',
  'js/caligrafia.js',
  'js/app.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// La app sale primero de la caché (funciona sin internet) y se refresca en segundo plano.
// Las fuentes de Google se guardan la primera vez que se descargan.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;
  event.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req, { ignoreSearch: sameOrigin }).then(hit => {
        const fresh = fetch(req).then(res => {
          if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
          return res;
        }).catch(() => hit || (req.mode === 'navigate' ? cache.match('index.html') : undefined));
        return hit || fresh;
      })
    )
  );
});
