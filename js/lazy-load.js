/*!
 * Lazy Loading Images for TVXL Blog
 * Uses Intersection Observer API for performance
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    rootMargin: '50px',  // Start loading 50px before entering viewport
    threshold: 0.01,     // Trigger when 1% of image is visible
    loadingClass: 'lazy-loading',
    loadedClass: 'lazy-loaded',
    errorClass: 'lazy-error'
  };

  // Check if browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, loading all images immediately');
    loadAllImages();
    return;
  }

  // Create intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: CONFIG.rootMargin,
    threshold: CONFIG.threshold
  });

  // Load a single image
  function loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (!src && !srcset) return;

    img.classList.add(CONFIG.loadingClass);

    // Create a new image to preload
    const loader = new Image();

    loader.onload = () => {
      // Apply the actual source
      if (srcset) {
        img.srcset = srcset;
      }
      if (src) {
        img.src = src;
      }

      img.classList.remove(CONFIG.loadingClass);
      img.classList.add(CONFIG.loadedClass);
    };

    loader.onerror = () => {
      img.classList.remove(CONFIG.loadingClass);
      img.classList.add(CONFIG.errorClass);
      console.error('Failed to load image:', src);
    };

    // Start loading
    if (src) {
      loader.src = src;
    }
  }

  // Fallback: load all images immediately (for old browsers)
  function loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  }

  // Initialize lazy loading
  function init() {
    // Find all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length === 0) {
      return;
    }

    // Observe each lazy image
    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });

    console.log(`Lazy loading initialized for ${lazyImages.length} images`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize when new content is added (for dynamic content)
  window.reinitLazyLoad = init;

})();
