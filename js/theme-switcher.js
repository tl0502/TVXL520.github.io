/*!
 * Theme Switcher Script for TVXL Blog
 * Handles dark/light mode switching with system preference detection
 */

(function() {
  'use strict';

  const THEME_KEY = 'tvxl-blog-theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';
  const THEME_AUTO = 'auto';

  // Get user's saved preference or default to auto
  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || THEME_AUTO;
    } catch (e) {
      return THEME_AUTO;
    }
  }

  // Save theme preference
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme preference');
    }
  }

  // Get system preference
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEME_DARK;
    }
    return THEME_LIGHT;
  }

  // Update Giscus comment theme
  function updateGiscusTheme(theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (iframe) {
      const giscusTheme = theme === THEME_DARK ? 'dark' : 'light';
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme } } },
        'https://giscus.app'
      );
    }
  }

  // Apply theme to document
  function applyTheme(theme) {
    let actualTheme = theme;

    if (theme === THEME_AUTO) {
      actualTheme = getSystemTheme();
    }

    if (actualTheme === THEME_DARK) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Update Giscus theme if it exists (with a small delay to ensure iframe is ready)
    setTimeout(function() {
      updateGiscusTheme(actualTheme);
    }, 100);
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = getSavedTheme();
    let newTheme;

    if (currentTheme === THEME_AUTO) {
      // Auto -> Light (or Dark if system is light)
      newTheme = getSystemTheme() === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    } else if (currentTheme === THEME_LIGHT) {
      // Light -> Dark
      newTheme = THEME_DARK;
    } else {
      // Dark -> Light
      newTheme = THEME_LIGHT;
    }

    saveTheme(newTheme);
    applyTheme(newTheme);
  }

  // Initialize theme on page load (as early as possible to prevent flash)
  function initTheme() {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
  }

  // Listen for system theme changes
  function watchSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', function(e) {
          const savedTheme = getSavedTheme();
          if (savedTheme === THEME_AUTO) {
            applyTheme(THEME_AUTO);
          }
        });
      }
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(function(e) {
          const savedTheme = getSavedTheme();
          if (savedTheme === THEME_AUTO) {
            applyTheme(THEME_AUTO);
          }
        });
      }
    }
  }

  // Initialize immediately
  initTheme();

  // Setup event listeners when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setupThemeToggle();
      watchSystemTheme();
      watchGiscusLoad();
    });
  } else {
    setupThemeToggle();
    watchSystemTheme();
    watchGiscusLoad();
  }

  function setupThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }
  }

  // Watch for Giscus iframe to load and apply theme
  function watchGiscusLoad() {
    // Watch for iframe additions
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) {
            // Give iframe time to fully load, then sync theme
            setTimeout(function() {
              const savedTheme = getSavedTheme();
              const actualTheme = savedTheme === THEME_AUTO ? getSystemTheme() : savedTheme;
              updateGiscusTheme(actualTheme);
            }, 1000);
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Expose to window for debugging
  window.themeManager = {
    toggle: toggleTheme,
    get: getSavedTheme,
    set: function(theme) {
      saveTheme(theme);
      applyTheme(theme);
    }
  };
})();
