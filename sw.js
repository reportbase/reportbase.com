// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const cacheName = 'v12';
const precacheResources = 
[
    '/',
    '/index.html',
    '/repba.js',
    '/data/GAMP.0000.webp',
    '/data/GAMP.0001.webp',
    '/data/GAMP.0002.webp',
    '/data/GAMP.0003.webp',
    '/data/GAMP.0004.webp',
    '/data/GAMP.0005.webp',
    '/data/GAMP.0006.webp',
];

self.addEventListener('install', (event) => 
{
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => 
{
    console.log('Delete old caches');
});

self.addEventListener("fetch", function(e) 
{ 
    e.respondWith(
        caches.match(e.request).then(function(response) 
        {
            return response || fetch(e.request)
        })
    )
})

