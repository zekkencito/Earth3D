const CACHE_NAME = 'tierra-3d-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './scene.glb',
  './manifest.json',
  // CDN resources
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
  'https://assets.mixkit.co/active_storage/sfx/2375/2375-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
];

// Instalar Service Worker y cachear recursos
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('❌ Error al cachear:', err);
      })
  );
  self.skipWaiting();
});

// Activar Service Worker y limpiar cachés antiguos
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Interceptar peticiones y servir desde caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - devolver respuesta del caché
        if (response) {
          console.log('📂 Sirviendo desde caché:', event.request.url);
          return response;
        }

        // No está en caché - hacer petición a la red
        console.log('🌐 Descargando desde red:', event.request.url);
        return fetch(event.request).then(response => {
          // Verificar que es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar la respuesta
          const responseToCache = response.clone();

          // Agregar al caché
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(err => {
        console.error('❌ Error en fetch:', err);
        // Aquí podrías devolver una página de error personalizada
      })
  );
});

// Escuchar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
