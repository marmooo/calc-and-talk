var CACHE_NAME = "2023-06-24 10:16";
var urlsToCache = [
  "/calc-and-talk/",
  "/calc-and-talk/kohacu.webp",
  "/calc-and-talk/index.js",
  "/calc-and-talk/mp3/end.mp3",
  "/calc-and-talk/mp3/cat.mp3",
  "/calc-and-talk/mp3/correct3.mp3",
  "/calc-and-talk/favicon/favicon.svg",
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
