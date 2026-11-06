/*
 * Mi Lectura – service worker: permite usar la app sin conexión.
 *
 * Igual que en Mi Ábaco: con internet se pide siempre la versión actual (y se
 * guarda una copia); sin internet se usa la copia. Solo maneja sus propias
 * copias («mi-lectura-…»), para no borrar las de Mi Ábaco.
 *
 * Al publicar cambios: sube ASSETS en index.html (los ?v= de css y js) y aquí,
 * y sube VERSION.
 */
const PREFIX = 'mi-lectura-';
const VERSION = PREFIX + 'v1';
const ASSETS = '1';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  `css/lectura.css?v=${ASSETS}`,
  `js/palabras.js?v=${ASSETS}`,
  `js/textos-n1.js?v=${ASSETS}`,
  `js/textos-n2.js?v=${ASSETS}`,
  `js/textos-adultos.js?v=${ASSETS}`,
  `js/ejercicios.js?v=${ASSETS}`,
  `js/lector.js?v=${ASSETS}`,
  `js/app.js?v=${ASSETS}`,
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(SHELL.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const old = (await caches.keys()).filter(k => k.startsWith(PREFIX) && k !== VERSION);
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

  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    event.respondWith(caches.open(VERSION).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }))));
    return;
  }
  if (url.origin !== self.location.origin) return;

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
