const CACHE_NAME = "hilton-cache-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json", "/logo.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  // For CSV fetches we prefer network (so data stays fresh).
  // Use cache fallback for static assets.
  const req = event.request;
  if (req.destination === "document" || req.url.endsWith(".png") || req.url.endsWith(".json") || req.url.endsWith(".css") || req.url.endsWith(".js")) {
    event.respondWith(
      caches.match(req).then((resp) => resp || fetch(req).then((res) => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      }).catch(() => caches.match("/index.html")))
    );
  } else {
    // Default: try network then fallback to cache
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
  }
});
