
const cacheName = 'cache-v5';
const precacheResources = ['/','/home.html','/repba.js','/iframe.html'];

self.addEventListener('install', (event) => 
{
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => 
{
    console.log('Service worker activate event!');
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

*/
