const CACHE = 'che-plast-v1';
const SHELL = [
  '/che-plast/',
  '/che-plast/index.html',
  '/che-plast/manifest.json',
  '/che-plast/icons/icon-192.png',
  '/che-plast/icons/icon-512.png',
  '/che-plast/icons/apple-touch-icon.png',
  '/che-plast/icons/favicon-32.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Only cache same-origin shell; pass through everything else
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
