/*
 * Ábaco – service worker: permite usar la app sin conexión.
 *
 * Con internet siempre se pide la versión actual de cada archivo (y se guarda
 * una copia); sin internet se usa la copia. Así nunca se mezclan archivos de
 * versiones distintas.
 *
 * Al publicar cambios: sube ASSETS en index.html (los ?v= de css y js) y aquí,
 * y sube VERSION.
 */
const VERSION = 'mi-abaco-v7';
const ASSETS = '7';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  `css/app.css?v=${ASSETS}`,
  `js/curriculum.js?v=${ASSETS}`,
  `js/soroban.js?v=${ASSETS}`,
  `js/caligrafia.js?v=${ASSETS}`,
  `js/app.js?v=${ASSETS}`,
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

// cache: 'reload' evita que la instalación tome copias viejas de la memoria del navegador.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(SHELL.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

// Al actualizar desde una versión anterior se borran sus copias y se recargan
// las pantallas abiertas, para que muestren la versión nueva completa.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const old = (await caches.keys()).filter(k => k !== VERSION);
    await Promise.all(old.map(k => caches.delete(k)));
    await self.clients.claim();
    if (old.length) {
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach(client => client.navigate(client.url).catch(() => {}));
    }
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fuentes de Google: no cambian, se usan desde la copia si ya existe.
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    event.respondWith(caches.open(VERSION).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }))));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Archivos de la app: primero la red (revalidando), y la copia solo sin conexión.
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (e) {
      const hit = await cache.match(req);
      if (hit) return hit;
      if (req.mode === 'navigate') return cache.match('index.html');
      throw e;
    }
  })());
});
