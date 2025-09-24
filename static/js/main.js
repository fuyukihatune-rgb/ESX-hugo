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

  // --- Search Form Functionality --- 
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
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

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value;
      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none'; // Hide dropdown if query is too short
        return;
      }

      if (fuse) { // Ensure fuse is initialized
        const results = fuse.search(query);
        displayResults(results);
      }
    });

    // Hide search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.style.display = 'none';
      }
    });

    // Show search results when input is focused and has content
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.length >= 2 && searchResults.innerHTML !== '') {
        searchResults.style.display = 'block';
      }
    });
  }

  function displayResults(results) {
    searchResults.innerHTML = '';
    if (results.length > 0) {
      const resultList = document.createElement('ul');
      results.slice(0, 10).forEach(result => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = result.item.permalink;
        link.textContent = result.item.title;
        item.appendChild(link);
        resultList.appendChild(item);
      });
      searchResults.appendChild(resultList);
      searchResults.style.display = 'block'; // Show dropdown
    } else {
      searchResults.innerHTML = '<p>一致する結果はありませんでした。</p>';
      searchResults.style.display = 'block'; // Show dropdown even if no results
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