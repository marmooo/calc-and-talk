var CACHE_NAME="2022-11-26 12:58",urlsToCache=["/calc-and-talk/","/calc-and-talk/kohacu.webp","/calc-and-talk/index.js","/calc-and-talk/mp3/incorrect1.mp3","/calc-and-talk/mp3/end.mp3","/calc-and-talk/mp3/cat.mp3","/calc-and-talk/mp3/correct3.mp3","/calc-and-talk/favicon/favicon.svg","https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})