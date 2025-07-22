const CACHE_NAME = 'earth-ai-v1.1.0';
const STATIC_CACHE_NAME = 'earth-static-v1.1.0';
const DYNAMIC_CACHE_NAME = 'earth-dynamic-v1.1.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/index.tsx',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/favicon.svg',
  '/offline.html'
];

// Assets to cache on first request
const DYNAMIC_ASSETS = [
  '/components/',
  '/services/',
  '/data/',
  'https://cdn.tailwindcss.com'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external API calls (Gemini, Firebase)
  if (url.origin !== self.location.origin && 
      !url.hostname.includes('googleapis.com') && 
      !url.hostname.includes('firebase') &&
      !url.hostname.includes('tailwindcss.com')) {
    return;
  }
  
  // Special handling for personality data files
  const isPersonalityData = request.url.includes('/data/personalityTemplates') || 
                           request.url.includes('/data/exampleInstructions');
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Determine which cache to use
            let cacheName = STATIC_CACHE_NAME;
            
            // Use dynamic cache for most resources
            if (!STATIC_ASSETS.some(asset => request.url.includes(asset))) {
              cacheName = DYNAMIC_CACHE_NAME;
            }
            
            // Always cache personality data in static cache for offline use
            if (isPersonalityData) {
              cacheName = STATIC_CACHE_NAME;
            }
            
            // Cache the response
            caches.open(cacheName)
              .then((cache) => {
                console.log('Service Worker: Caching new resource', request.url);
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Return empty JSON for personality data if not cached
            if (isPersonalityData) {
              if (request.url.includes('personalityTemplates')) {
                return new Response(JSON.stringify({ personalityTemplates: [], personalityCategories: [] }), {
                  headers: { 'Content-Type': 'application/json' }
                });
              } else if (request.url.includes('exampleInstructions')) {
                return new Response(JSON.stringify({ exampleInstructions: [] }), {
                  headers: { 'Content-Type': 'application/json' }
                });
              }
            }
            
            // Return a generic offline response for other requests
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Background sync for offline message queue
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync-messages') {
    event.waitUntil(
      // Handle offline message queue
      handleOfflineMessages()
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New message from EARTH AI',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('EARTH AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to handle offline messages
async function handleOfflineMessages() {
  try {
    // This would integrate with your app's offline message queue
    console.log('Service Worker: Processing offline messages');
    
    // Implementation would depend on your offline storage strategy
    // For now, this is a placeholder
    
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Error processing offline messages', error);
    return Promise.reject(error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});