/*!
 * Scroll to Top & Reading Progress for TVXL Blog
 * Enhanced user experience features
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    scrollThreshold: 300,        // Show button after scrolling 300px
    scrollDuration: 600,          // Smooth scroll duration in ms
    throttleDelay: 100,           // Throttle scroll events every 100ms
    easing: 'easeInOutCubic'
  };

  let scrollButton = null;
  let progressBar = null;
  let scrollTimeout = null;

  // Easing functions
  const easingFunctions = {
    linear: (t) => t,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  };

  // Smooth scroll to top
  function scrollToTop() {
    const startPosition = window.pageYOffset;
    const startTime = performance.now();

    function animation(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / CONFIG.scrollDuration, 1);
      const easing = easingFunctions[CONFIG.easing] || easingFunctions.linear;
      const position = startPosition * (1 - easing(progress));

      window.scrollTo(0, position);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  // Update scroll button visibility
  function updateScrollButton() {
    if (!scrollButton) return;

    const scrolled = window.pageYOffset || document.documentElement.scrollTop;

    if (scrolled > CONFIG.scrollThreshold) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  }

  // Update reading progress bar
  function updateProgressBar() {
    if (!progressBar) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate progress percentage
    const totalHeight = documentHeight - windowHeight;
    const progress = (scrollTop / totalHeight) * 100;

    progressBar.style.width = Math.min(progress, 100) + '%';
  }

  // Throttled scroll handler
  function handleScroll() {
    if (scrollTimeout) return;

    scrollTimeout = setTimeout(() => {
      updateScrollButton();
      updateProgressBar();
      scrollTimeout = null;
    }, CONFIG.throttleDelay);
  }

  // Create scroll to top button
  function createScrollButton() {
    scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', '返回顶部');
    scrollButton.setAttribute('title', '返回顶部');
    scrollButton.innerHTML = '<i class="fa fa-arrow-up"></i>';

    scrollButton.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTop();
    });

    document.body.appendChild(scrollButton);
  }

  // Create reading progress bar
  function createProgressBar() {
    progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', '阅读进度');

    document.body.appendChild(progressBar);
  }

  // Initialize
  function init() {
    // Create UI elements
    createScrollButton();
    createProgressBar();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial update
    updateScrollButton();
    updateProgressBar();

    console.log('Scroll enhancements initialized');
  }

  // Cleanup
  function cleanup() {
    window.removeEventListener('scroll', handleScroll);
    if (scrollButton && scrollButton.parentNode) {
      scrollButton.parentNode.removeChild(scrollButton);
    }
    if (progressBar && progressBar.parentNode) {
      progressBar.parentNode.removeChild(progressBar);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose cleanup for potential use
  window.scrollEnhancementsCleanup = cleanup;

})();
