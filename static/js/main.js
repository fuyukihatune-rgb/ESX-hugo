document.addEventListener('DOMContentLoaded', () => {
  // --- Dark Mode Toggle Functionality --- 
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    const body = document.body;
    const moonIcon = darkModeToggle.querySelector('.moon-icon');
    const sunIcon = darkModeToggle.querySelector('.sun-icon');

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        body.classList.add('dark-mode');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'inline-block';
      } else {
        body.classList.remove('dark-mode');
        if (moonIcon) moonIcon.style.display = 'inline-block';
        if (sunIcon) sunIcon.style.display = 'none';
      }
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let currentTheme = 'light';
    if (savedTheme) {
      currentTheme = savedTheme;
    } else if (prefersDark) {
      currentTheme = 'dark';
    }
    applyTheme(currentTheme);

    darkModeToggle.addEventListener('click', () => {
      if (body.classList.contains('dark-mode')) {
        applyTheme('light');
        localStorage.setItem('theme', 'light');
      } else {
        applyTheme('dark');
        localStorage.setItem('theme', 'dark');
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
      }
    });
  } else {
    console.warn('Dark mode toggle button not found.');
  }

  // --- Search Form Functionality (Active only on /posts/ page) --- 
  if (window.location.pathname === '/posts' || window.location.pathname === '/posts/') {
    const searchInput = document.getElementById('search-input');
    const postGrid = document.querySelector('.post-card-grid');
    const searchResultsContainer = document.getElementById('search-results-container');
    const pagination = document.querySelector('.pagination');
    let fuse;

    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        const options = {
          keys: ['title', 'content', 'tags'],
          includeScore: true,
          threshold: 0.4,
          minMatchCharLength: 2,
        };
        fuse = new Fuse(data, options);
      })
      .catch(error => console.error('Error fetching search index:', error));

    if (searchInput && postGrid && searchResultsContainer) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query.length < 2) {
          searchResultsContainer.innerHTML = '';
          searchResultsContainer.style.display = 'none'; 
          postGrid.style.display = 'grid';
          if (pagination) pagination.style.display = 'flex';
          return;
        }

        if (fuse) {
          const results = fuse.search(query);
          displayResults(results);
          postGrid.style.display = 'none'; 
          if (pagination) pagination.style.display = 'none';
          searchResultsContainer.style.display = 'grid';
        }
      });
    }

    function displayResults(results) {
      searchResultsContainer.innerHTML = '';
      if (results.length > 0) {
        results.slice(0, 10).forEach(result => {
          const post = result.item;
          const cardHTML = `
            <a href="${post.permalink}" class="post-card">
              <article>
                <h3>${post.title}</h3>
                <p>${post.summary.substring(0, 100)}</p>
                <div class="post-meta">
                  <time datetime="${post.date}">${new Date(post.date).toLocaleDateString('ja-JP')}</time>
                  <span>&middot;</span>
                  <span>約${post.readingTime}分</span>
                </div>
              </article>
            </a>
          `;
          searchResultsContainer.innerHTML += cardHTML;
        });
      } else {
        searchResultsContainer.innerHTML = '<p class="no-results">一致する記事はありませんでした。</p>';
      }
    }
  }

  // --- Copy to Clipboard Functionality (Crypto Addresses) --- 
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
      const addrCode = this.previousElementSibling;
      const textToCopy = addrCode.textContent;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = this.textContent;
        this.textContent = 'コピーしました！';
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  });

  // --- Copy to Clipboard Functionality (Post Share Link) --- 
  // Assuming there might be a .copy-link-btn for sharing post links
  document.querySelectorAll('.copy-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const originalTitle = btn.title;
        const originalContent = btn.innerHTML;
        btn.title = 'コピーしました！';
        btn.innerHTML = 'コピー完了!'; // Or change icon
        setTimeout(() => {
          btn.title = originalTitle;
          btn.innerHTML = originalContent;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy URL: ', err);
        alert("リンクのコピーに失敗しました。");
      });
    });
  });

  // --- Contribution Form Validation ---
  document.querySelectorAll('form.contact-form').forEach(form => {
    const fileInput = form.querySelector('input[type="file"]');
    if (!fileInput) {
      return;
    }

    const errorEl = form.querySelector('[data-role="file-error"]');
    const allowedExt = (form.dataset.allowedExt || '').split(',').map(ext => ext.trim().toLowerCase()).filter(Boolean);
    const maxSize = parseInt(form.dataset.maxSize || '0', 10);

    const formatBytes = bytes => {
      if (!bytes) return '';
      if (bytes < 1024) return `${bytes}B`;
      if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
      return `${Math.round((bytes / (1024 * 1024)) * 10) / 10}MB`;
    };

    const showError = message => {
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
      } else {
        alert(message);
      }
    };

    const clearError = () => {
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
      }
    };

    const validateFile = file => {
      if (!file) {
        showError('ファイルを選択してください。');
        return false;
      }

      const extension = file.name.split('.').pop().toLowerCase();
      if (allowedExt.length && !allowedExt.includes(extension)) {
        showError(`対応していないファイル形式です。利用可能: .${allowedExt.join(', .')}`);
        return false;
      }

      if (maxSize > 0 && file.size > maxSize) {
        showError(`ファイルサイズは ${formatBytes(maxSize)} 以内にしてください。現在: ${formatBytes(file.size)}`);
        return false;
      }

      clearError();
      return true;
    };

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        validateFile(fileInput.files[0]);
      } else {
        clearError();
      }
    });

    form.addEventListener('submit', event => {
      const file = fileInput.files && fileInput.files[0];
      if (!validateFile(file)) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  });

  // --- Hamburger Menu Functionality --- 
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked (optional, but good for UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
});

// --- Generic Share Functionality ---
window.sharePage = async (url, title) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        url: url,
      });
      console.log('Page shared successfully');
    } catch (error) {
      console.error('Error sharing page:', error);
    }
  } else {
    // Fallback for browsers that do not support Web Share API
    // Reuse the copy to clipboard logic
    navigator.clipboard.writeText(url).then(() => {
      alert('リンクをコピーしました！');
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
      alert('リンクのコピーに失敗しました。');
    });
  }
};
