// Service Worker for Workout Timer Notifications & Offline Caching

const CACHE_NAME = 'workout-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

let timerEndTime = null;
let timerInterval = null;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => clients.claim())
  );
});

// Network-first strategy for navigations, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // HTML navigations: network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Static assets: cache-first, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache successful responses for known asset types
        if (response.ok && (request.url.match(/\.(js|css|png|svg|woff2?)$/))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

self.addEventListener('message', (event) => {
  const { type, duration } = event.data;
  
  if (type === 'START_TIMER') {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    timerEndTime = Date.now() + (duration * 1000);
    
    // Check every second
    timerInterval = setInterval(() => {
      if (Date.now() >= timerEndTime) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerEndTime = null;
        
        // Send notification
        self.registration.showNotification('⏰ Rest Timer', {
          body: 'Tempo scaduto! Via con la prossima serie! 💪',
          icon: '/icon-192.svg',
          badge: '/icon-192.svg',
          vibrate: [200, 100, 200, 100, 200],
          tag: 'timer-notification',
          requireInteraction: true,
        });
        
        // Notify all clients
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'TIMER_COMPLETE' });
          });
        });
      }
    }, 1000);
  }
  
  if (type === 'STOP_TIMER') {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerEndTime = null;
  }
  
  if (type === 'GET_REMAINING') {
    const remaining = timerEndTime ? Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000)) : 0;
    event.source.postMessage({ type: 'REMAINING_TIME', remaining });
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Focus existing window or open new one
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
