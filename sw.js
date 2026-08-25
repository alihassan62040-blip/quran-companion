const CACHE_NAME = "quran-companion-v1";
const SHELL_FILES = ["./index.html", "./app.js", "./style.css", "./manifest.json", "./launchericon-512x512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// App shell: cache-first. Everything else (APIs, audio): network-first, no forced caching.
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isShell = SHELL_FILES.some((f) => url.pathname.endsWith(f.replace("./", "")));
  if (isShell) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
  // else: let it hit the network normally (dynamic Quran/Hadith/prayer data)
});
