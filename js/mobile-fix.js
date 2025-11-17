/*!
 * Mobile Fix Script for TVXL Blog
 * Disable navbar scroll behavior on mobile devices
 */

(function() {
  'use strict';

  // Constants
  const MOBILE_BREAKPOINT = 768;
  const RESIZE_DEBOUNCE_MS = 250;

  // Cache DOM element
  let navbar = null;

  // Helper function to reset navbar position
  function resetNavbarPosition() {
    if (!navbar) {
      navbar = document.querySelector('.navbar-custom');
    }

    if (navbar) {
      navbar.classList.remove('is-fixed');
      navbar.classList.remove('is-visible');
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
      navbar.style.transform = 'none';
    }
  }

  // Disable navbar scroll behavior on mobile/tablet
  function disableMobileNavbarScroll() {
    // Check if screen width is less than mobile breakpoint
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      resetNavbarPosition();
    }
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableMobileNavbarScroll);
  } else {
    disableMobileNavbarScroll();
  }

  // Run on window resize with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(disableMobileNavbarScroll, RESIZE_DEBOUNCE_MS);
  });

  // Override scroll behavior on mobile
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    window.addEventListener('scroll', () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        resetNavbarPosition();
      }
    });
  }
})();
