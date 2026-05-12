const CACHE_NAME = "memoir-travel-cache-v1";
const APP_SHELL = ["/", "/manifest.webmanifest", "/icon.svg", "/apple-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;
  if (!request.url.startsWith(self.location.origin)) return;

  // 開発環境や Next.js の内部チャンクはキャッシュしない
  const isNextInternal = request.url.includes("/_next/");
  const isLocalhost = self.location.hostname === "localhost" || self.location.hostname === "127.0.0.1";

  if (isNextInternal || isLocalhost) {
    return; // ブラウザの通常処理に任せる
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
