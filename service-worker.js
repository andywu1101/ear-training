const CACHE_NAME = 'ear-training-shell-v8'; // 升級為 v8（四部和聲：修正 N6 接 V、解答頁雙譜表對照）
const APP_SHELL = [
  './',
  './index.html',
  './chord-trainer.html',
  './interval-trainer.html',
  './rhythm-trainer.html',
  './melody-trainer.html',
  './two-part-trainer.html',
  './four-part-trainer.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // 發現新版本時，跳過等待，立刻強制安裝
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', event => {
  self.clients.claim(); // 立刻接管所有開啟的網頁
  // 刪除舊版 (v1 到 v5) 的快取垃圾
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// 核心修改：網路優先 (Network First)
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).then(response => {
      // 1. 只要有網路，就去抓最新代碼，並偷偷更新到快取裡
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
      return response;
    }).catch(() => {
      // 2. 如果沒網路 (飛航模式或斷線)，才從快取拿備用檔案
      return caches.match(event.request);
    })
  );
});