/**
 * Nature Flower Grass 天意花坊手作烘焙 — 官方形象與作品展示互動腳本
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 動態更新頁尾年份
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. 毛玻璃導覽列滾動狀態 & 導覽列高亮
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], article[id]');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    // 計算當前閱讀區塊以高亮對應導覽連結
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. 行動版漢堡選單切換
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mainNav.classList.toggle('open', !isExpanded);
    });

    // 點擊導覽連結後自動收合行動版選單
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
      });
    });
  }

  // 4. 平滑滾動漸顯動畫 (Fade-in on Scroll via IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // 降級處理：直接顯示
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 5. 精選作品與服務分類篩選互動
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetFilter = tab.getAttribute('data-filter');

      // 更新按鈕狀態
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // 篩選作品卡片
      portfolioItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = targetFilter === 'all' || itemCategory === targetFilter;

        if (shouldShow) {
          item.classList.remove('hidden');
          // 觸發微動畫
          item.style.opacity = '0';
          item.style.transform = 'translateY(14px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 6. 電話號碼一鍵複製功能與 Toast 通知
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toastEl = document.getElementById('toastNotification');
  let toastTimeout = null;

  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2400);
  };

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const phoneText = btn.getAttribute('data-copy');
      if (!phoneText) return;

      try {
        await navigator.clipboard.writeText(phoneText);
        showToast(`已複製電話號碼：${phoneText}`);
      } catch {
        // 備援複製方式
        const textArea = document.createElement('textarea');
        textArea.value = phoneText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(`已複製電話號碼：${phoneText}`);
      }
    });
  });
});
