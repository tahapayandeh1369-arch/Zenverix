// ============================================================
// SERVICE WORKER - PWA
// ============================================================

const CACHE_NAME = 'zenverix-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/Csses/style.css',
    '/script.js',
    '/favicon.ico',
    '/image/zenverix-logo-transparent.png',
    '/image/Image.png'
];

// نصب سرویس ورکر و کش کردن فایل‌ها
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// درخواست‌ها - ابتدا از کش، سپس شبکه
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // اگر در کش بود، برگردون
                if (response) {
                    return response;
                }
                // وگرنه از شبکه بگیر
                return fetch(event.request)
                    .then(function(response) {
                        // اگر پاسخ ناموفق نبود، در کش ذخیره کن
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
});

// آپدیت کردن کش
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});