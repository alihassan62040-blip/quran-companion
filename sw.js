"use strict";

const CACHE_NAME = "quran-companion-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

self.addEventListener("install", function(event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_FILES);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") {
    return;
  }

  /*
    API requests ko cache nahi karna.
    Quran, Urdu, Tafseer aur audio fresh
    server se aayenge.
  */
  const url = new URL(event.request.url);

  if (
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("alquran.cloud") ||
    url.hostname.includes("quran.com") ||
    url.hostname.includes("islamic.network")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  /*
    App files ke liye network first.
    Agar internet na ho to cached version.
  */
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, copy);
          });
        }

        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
