var CACHE_NAME = '2021-10-15 20:33';
var urlsToCache = [
  "/calc-and-talk/",
  "/calc-and-talk/kohacu.webp",
  "/calc-and-talk/index.js",
  "/calc-and-talk/mp3/incorrect1.mp3",
  "/calc-and-talk/mp3/end.mp3",
  "/calc-and-talk/mp3/cat.mp3",
  "/calc-and-talk/mp3/correct3.mp3",
  "/calc-and-talk/favicon/original.svg",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
