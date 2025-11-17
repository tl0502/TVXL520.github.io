/*!
 * Service Worker Registration for TVXL Blog
 * Registers and manages the service worker lifecycle
 */

(function() {
  'use strict';

  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in this browser');
    return;
  }

  // Register service worker
  function registerServiceWorker() {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('New Service Worker available');

              // Optionally notify user about update
              if (confirm('网站有新版本可用，是否立即更新？')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed');
    });
  }

  // Register when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
  } else {
    registerServiceWorker();
  }

  // Expose utility functions
  window.swUtils = {
    // Unregister service worker
    unregister: () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
          console.log('Service Worker unregistered');
        });
      });
    },

    // Clear all caches
    clearCache: () => {
      navigator.serviceWorker.controller?.postMessage({ type: 'CLEAR_CACHE' });
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('All caches cleared');
        location.reload();
      });
    },

    // Get cache info
    getCacheInfo: async () => {
      const cacheNames = await caches.keys();
      const info = [];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        info.push({
          name: cacheName,
          size: keys.length
        });
      }

      return info;
    }
  };

})();
