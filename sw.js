// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

const VERSION = "v19"
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
    event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(precacheResources)));
});

const deleteCache = async key => 
{
    await caches.delete(key)
}

const deleteOldCaches = async () => 
{
   const cacheKeepList = [VERSION];
   const keyList = await caches.keys()
   const cachesToDelete = keyList.filter(key => !cacheKeepList.includes(key))
   await Promise.all(cachesToDelete.map(deleteCache));
}

self.addEventListener('activate', (event) => 
{
    event.waitUntil(deleteOldCaches());
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

