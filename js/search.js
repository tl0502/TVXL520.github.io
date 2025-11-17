/*!
 * Search Functionality for TVXL Blog
 * Client-side search for Jekyll posts
 */

(function() {
  'use strict';

  // Search index - will be populated from posts
  let searchIndex = [];
  let searchModal = null;
  let searchInput = null;
  let searchResults = null;
  let searchCloseBtn = null;
  let searchIcon = null;

  // Initialize search functionality
  function initSearch() {
    searchModal = document.getElementById('search-modal');
    searchInput = document.getElementById('search-input');
    searchResults = document.getElementById('search-results');
    searchCloseBtn = document.querySelector('.search-modal-close');
    // Get all search icons (both in header and navbar)
    var searchIcons = document.querySelectorAll('.search-icon');

    if (!searchModal || !searchInput || !searchResults) {
      return;
    }

    // Build search index from posts
    buildSearchIndex();

    // Event listeners for all search icons
    searchIcons.forEach((icon) => {
      icon.addEventListener('click', openSearch);
    });

    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', closeSearch);
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });

    // Close on background click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    // Search on input
    searchInput.addEventListener('input', function() {
      performSearch(this.value.trim());
    });

    // Prevent modal content clicks from closing
    const modalContent = document.querySelector('.search-modal-content');
    if (modalContent) {
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  // Build search index from posts
  function buildSearchIndex() {
    // Get all post previews from the page
    const postPreviews = document.querySelectorAll('.post-preview');

    postPreviews.forEach((preview) => {
      const link = preview.querySelector('a');
      if (!link) return;

      let title = '';
      let subtitle = '';
      let content = '';
      const url = link.getAttribute('href') || '';

      // Get title
      const titleEl = preview.querySelector('.post-title');
      if (titleEl) {
        title = titleEl.textContent.trim();
      }

      // Get subtitle
      const subtitleEl = preview.querySelector('.post-subtitle');
      if (subtitleEl) {
        subtitle = subtitleEl.textContent.trim();
      }

      // Get content preview
      const contentEl = preview.querySelector('.post-content-preview');
      if (contentEl) {
        content = contentEl.textContent.trim();
      }

      if (title || content) {
        searchIndex.push({
          title: title,
          subtitle: subtitle,
          content: content,
          url: url
        });
      }
    });

    // Also try to get posts from JSON if available (for better search)
    // This would require generating a search.json file via Jekyll
    fetchSearchJSON();
  }

  // Try to fetch search.json for better search results
  function fetchSearchJSON() {
    // search.json should be at site root
    fetch('/search.json')
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Search index not found');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          searchIndex = data;
        }
      })
      .catch((error) => {
        // Fallback to DOM-based search
        // console.log('Using DOM-based search');
      });
  }

  // Open search modal
  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus input after animation
      setTimeout(() => {
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  // Close search modal
  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Clear search
      if (searchInput) {
        searchInput.value = '';
      }
      if (searchResults) {
        searchResults.innerHTML = '';
      }
    }
  }

  // Perform search
  function performSearch(query) {
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    const results = searchIndex.filter((item) => {
      const searchText = (item.title + ' ' + item.subtitle + ' ' + item.content).toLowerCase();
      return searchText.indexOf(query.toLowerCase()) !== -1;
    });

    displayResults(results, query);
  }

  // Display search results
  function displayResults(results, query) {
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">未找到相关结果</div>';
      return;
    }

    let html = '<div class="search-results-list">';

    results.forEach((item) => {
      const title = highlightText(item.title, query);
      const subtitle = item.subtitle ? '<div class="search-result-subtitle">' + highlightText(item.subtitle, query) + '</div>' : '';
      const content = item.content ? '<div class="search-result-content">' + highlightText(item.content.substring(0, 150), query) + '...</div>' : '';
      const url = escapeHtml(item.url || '#');

      html += '<a href="' + url + '" class="search-result-item">';
      html += '<div class="search-result-title">' + title + '</div>';
      html += subtitle;
      html += content;
      html += '</a>';
    });

    html += '</div>';
    searchResults.innerHTML = html;

    // Close modal when clicking a result
    const resultItems = searchResults.querySelectorAll('.search-result-item');
    resultItems.forEach((item) => {
      item.addEventListener('click', () => {
        closeSearch();
      });
    });
  }

  // Highlight search query in text
  function highlightText(text, query) {
    if (!text || !query) return text;

    const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Escape special regex characters
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Escape HTML entities to prevent XSS
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();

