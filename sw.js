const CACHE='escaner90-v1';
const APP_FILES=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const LIBRARY='https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(APP_FILES);
    try { await cache.add(LIBRARY); } catch(e) { /* Si no se puede guardar la biblioteca, el escaneo requerirá Internet. */ }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin){
    event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{return await fetch(req);}catch(e){return caches.match('./index.html');}})());
  } else if(req.url===LIBRARY){
    event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;return fetch(req);})());
  }
});