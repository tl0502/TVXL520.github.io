/*!
 * Mobile Fix Script for TVXL Blog
 * Disable navbar scroll behavior on mobile devices
 */

(function() {
  'use strict';

  // Disable navbar scroll behavior on mobile/tablet
  function disableMobileNavbarScroll() {
    // Check if screen width is less than 768px (mobile/tablet)
    if (window.innerWidth < 768) {
      // Find navbar element
      var navbar = document.querySelector('.navbar-custom');
      if (navbar) {
        // Remove is-fixed and is-visible classes on mobile
        navbar.classList.remove('is-fixed');
        navbar.classList.remove('is-visible');

        // Keep navbar at top without scroll behavior
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.transform = 'none';
      }
    }
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableMobileNavbarScroll);
  } else {
    disableMobileNavbarScroll();
  }

  // Run on window resize
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(disableMobileNavbarScroll, 250);
  });

  // Override scroll behavior on mobile
  if (window.innerWidth < 768) {
    window.addEventListener('scroll', function() {
      var navbar = document.querySelector('.navbar-custom');
      if (navbar && window.innerWidth < 768) {
        navbar.classList.remove('is-fixed');
        navbar.classList.remove('is-visible');
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.transform = 'none';
      }
    });
  }
})();
