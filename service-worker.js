var cacheName = "coursesstore-v1";

self.addEventListener("install", () => {
    console.log("[ServiceWorker] Installed");
  });
  
  self.addEventListener("fetch", function (e) {
    if (e.request.url.startsWith("chrome-extension://")) {
      return;
    }
    if (e.request.url.startsWith("http") || e.request.url.startsWith("https")) {
      e.respondWith(
        caches.match(e.request).then(function (cachedFile) {
          if (cachedFile) {
            console.log(
              "[Service Worker] Resource fetched from the cache for: " +
                e.request.url
            );
            return cachedFile;
          } else {
            return fetch(e.request).then(function (response) {
              return caches.open(cacheName).then(function (cache) {
                cache.put(e.request, response.clone());
                console.log(
                  "[Service Worker] Resource fetched and saved in the cache for: " +
                    e.request.url
                );
                return response;
              });
            });
          }
        })
      );
    }
  });
