const CACHE_NAME = "2025-07-31 00:00";
const urlsToCache = [
  "/calc-and-talk/",
  "/calc-and-talk/kohacu.webp",
  "/calc-and-talk/index.js",
  "/calc-and-talk/mp3/end.mp3",
  "/calc-and-talk/mp3/cat.mp3",
  "/calc-and-talk/mp3/correct3.mp3",
  "/calc-and-talk/favicon/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
