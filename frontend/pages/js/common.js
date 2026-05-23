// ===== Common Layout JS (Sidebar, Topbar, Mobile Menu, Account Dropdown) =====

(function() {
  const routeTable = {
    dashboard: { clean: '/dashboard', page: 'dashboard.html', root: './dashboard.html' },
    library: { clean: '/library', page: 'library.html' },
    evaluations: { clean: '/evaluations', page: 'evaluations.html' },
    beneficiaries: { clean: '/beneficiaries', page: 'beneficiaries.html' },
    members: { clean: '/members', page: 'members.html' },
    families: { clean: '/families', page: 'families.html' },
    requests: { clean: '/requests', page: 'requests.html' },
    attendance: { clean: '/attendance', page: 'attendance.html' },
    settings: { clean: '/settings', page: 'settings.html' },
    login: { clean: '/login', page: 'register-login.html' },
    register: { clean: '/register', page: 'index.html' }
  };

  const routeKeys = new Set(Object.keys(routeTable));

  function getNavigationMode() {
    const path = window.location.pathname.replace(/\\/g, '/');

    if (window.location.protocol === 'file:') {
      return path.includes('/frontend/pages/') ? 'pages-dir' : 'frontend-root';
    }

    if (path.includes('/frontend/pages/')) {
      return 'pages-dir';
    }

    if (path.includes('/frontend/') && path.endsWith('.html')) {
      return 'frontend-root';
    }

    return 'clean';
  }

  function getRouteKey(href) {
    if (!href) return null;

    const value = href.trim();
    if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('javascript:')) {
      return null;
    }

    if (value === '/') return 'login';

    const cleanValue = value.split('#')[0].split('?')[0].replace(/\\/g, '/');

    if (cleanValue.startsWith('/')) {
      const key = cleanValue.slice(1);
      return routeKeys.has(key) ? key : null;
    }

    const pageMatch = cleanValue.match(/(?:^|\/)(?:pages\/)?([a-z-]+)\.html$/i);
    if (!pageMatch) return null;

    const key = pageMatch[1].toLowerCase();
    return routeKeys.has(key) ? key : null;
  }

  function buildRouteHref(routeKey, mode) {
    const route = routeTable[routeKey];
    if (!route) return null;

    if (mode === 'clean') {
      return route.clean;
    }

    if (mode === 'frontend-root') {
      return route.root || `./pages/${route.page}`;
    }

    return `./${route.page}`;
  }

  const navigationMode = getNavigationMode();

  function fixAppLinks(root = document) {
    root.querySelectorAll('a[href]').forEach((link) => {
      const routeKey = getRouteKey(link.getAttribute('href'));
      if (!routeKey) return;

      const nextHref = buildRouteHref(routeKey, navigationMode);
      if (nextHref) {
        link.setAttribute('href', nextHref);
      }
    });
  }

  fixAppLinks();
  document.addEventListener('sp:navigation-ready', () => fixAppLinks());
})();

(function() {
  // Mobile menu
  const menuBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const overlay = document.querySelector('[data-mobile-overlay]');
  const accountMenus = Array.from(document.querySelectorAll('[data-account-menu], .topbar-account'));
  const notificationMenus = [];

  function buildNotificationDropdown(title) {
    const dropdown = document.createElement('div');
    dropdown.className = 'notification-dropdown';
    dropdown.innerHTML = `
      <div class="notification-dropdown-header">
        <h3>${title}</h3>
        <button class="notification-close" type="button" aria-label="Close notifications"></button>
      </div>
      <div class="notification-dropdown-body">
        <p>No notifications yet.</p>
      </div>
    `;
    return dropdown;
  }

  const closeNotificationMenus = (exceptMenu = null) => {
    notificationMenus.forEach(({ wrapper, trigger, isMobile }) => {
      if (exceptMenu && wrapper === exceptMenu) return;
      wrapper.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      if (isMobile) {
        document.body.classList.remove('has-notification-panel-open');
      }
    });
  };

  const closeAccountMenus = (exceptMenu = null) => {
    accountMenus.forEach((menu) => {
      if (exceptMenu && menu === exceptMenu) return;
      menu.classList.remove('is-open');
      const toggle = menu.querySelector('[data-account-toggle], .mini-switcher');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  };

  function setupMobileAccountTrigger() {
    const trigger = document.querySelector('.mobile-topline-start .ghost-avatar--plain');
    if (!trigger || trigger.closest('.topbar-account--mobile')) return;

    const desktopDropdown = document.querySelector('.topbar-account .account-dropdown');
    const dropdown = desktopDropdown?.cloneNode(true) || document.createElement('div');
    dropdown.className = 'account-dropdown';
    if (!dropdown.children.length) {
      dropdown.innerHTML = `
        <a href="./settings.html" class="account-dropdown-item">ملف التعريف</a>
        <a href="./settings.html" class="account-dropdown-item">تغيير كلمة المرور</a>
        <a href="register-login.html" class="account-dropdown-item">تسجيل الخروج</a>
      `;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'topbar-account topbar-account--mobile';
    trigger.parentNode.insertBefore(wrapper, trigger);
    wrapper.appendChild(trigger);
    wrapper.appendChild(dropdown);

    trigger.classList.add('mobile-account-trigger');
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('data-account-toggle', '');

    const syncTooltip = () => {
      const accountName = document.querySelector('.account-card .account-name, .mobile-account-name')?.textContent?.trim();
      const tooltip = document.querySelector('.account-card[data-tooltip]')?.getAttribute('data-tooltip');
      trigger.setAttribute('data-tooltip', tooltip || accountName || 'sudanesephoniatric');
    };

    syncTooltip();
    document.addEventListener('sp:navigation-ready', syncTooltip);

    accountMenus.push(wrapper);
  }

  function setupNotificationTrigger(trigger) {
    const isMobile = trigger.classList.contains('mobile-bell');

    if (isMobile) {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
    }

    let wrapper = trigger.closest('.topbar-notifications');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = isMobile ? 'topbar-notifications topbar-notifications--mobile' : 'topbar-notifications';
      trigger.parentNode.insertBefore(wrapper, trigger);
      wrapper.appendChild(trigger);
    } else if (isMobile) {
      wrapper.classList.add('topbar-notifications--mobile');
    }

    let dropdown = wrapper.querySelector('.notification-dropdown');
    if (!dropdown) {
      const panelTitle = trigger.getAttribute('aria-label') || 'Notifications';
      dropdown = buildNotificationDropdown(panelTitle);
      wrapper.appendChild(dropdown);
    }

    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    const toggleMenu = (event) => {
      event?.preventDefault();
      event?.stopPropagation();
      const willOpen = !wrapper.classList.contains('is-open');
      closeAccountMenus();
      closeNotificationMenus(wrapper);
      wrapper.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      if (isMobile) {
        document.body.classList.toggle('has-notification-panel-open', willOpen);
      }
    };

    trigger.addEventListener('click', toggleMenu);
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        toggleMenu(event);
      }
    });

    const closeButton = dropdown.querySelector('.notification-close');
    closeButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeNotificationMenus();
    });

    notificationMenus.push({ wrapper, trigger, isMobile });
  }

  document.querySelectorAll('.topbar-bell, .mobile-bell').forEach(setupNotificationTrigger);
  setupMobileAccountTrigger();

  const menuIconPath = menuBtn?.querySelector('svg path');
  const menuIconOpen = 'M5 8h14M5 12h14M5 16h14';
  const menuIconClose = 'M6 6l12 12M18 6 6 18';

  function setMobileMenuState(isOpen) {
    if (!overlay) return;
    overlay.classList.toggle('is-open', isOpen);
    menuBtn?.classList.toggle('is-open', isOpen);
    menuBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (menuIconPath) {
      menuIconPath.setAttribute('d', isOpen ? menuIconClose : menuIconOpen);
    }
  }

  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn?.addEventListener('click', () => {
    const isOpen = overlay?.classList.contains('is-open');
    setMobileMenuState(!isOpen);
  });
  closeBtn?.addEventListener('click', () => setMobileMenuState(false));
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      setMobileMenuState(false);
    }
  });

  // Account dropdown (works consistently across all pages)
  accountMenus.forEach((menu, index) => {
    const toggle = menu.querySelector('[data-account-toggle], .mini-switcher');
    const dropdown = menu.querySelector('.account-dropdown');
    if (!toggle) return;

    if (dropdown && !dropdown.id) {
      dropdown.id = `account-dropdown-${index + 1}`;
    }

    if (dropdown) {
      toggle.setAttribute('aria-controls', dropdown.id);
    }
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const willOpen = !menu.classList.contains('is-open');
      closeNotificationMenus();
      closeAccountMenus(menu);
      menu.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

  document.addEventListener('click', (e) => {
    const clickedInsideAccountMenu = accountMenus.some((menu) => menu.contains(e.target));
    const clickedInsideNotificationMenu = notificationMenus.some(({ wrapper }) => wrapper.contains(e.target));
    if (clickedInsideAccountMenu || clickedInsideNotificationMenu) return;
    closeAccountMenus();
    closeNotificationMenus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAccountMenus();
      closeNotificationMenus();
    }
  });
})();

(function() {
  const filterBoxes = Array.from(document.querySelectorAll('.filter-box'));
  if (!filterBoxes.length) return;

  const fallbackOptionsByLabel = {
    '\u0627\u0644\u062d\u0627\u0644\u0629': ['\u0623\u064a\u0651', '\u0645\u0641\u0639\u0651\u0644', '\u063a\u064a\u0631 \u0645\u0641\u0639\u0651\u0644'],
    '\u0627\u0644\u062f\u0648\u0631': ['\u0623\u064a', '\u0623 - \u064a', '\u064a - \u0623'],
    '\u0641\u0631\u0632': ['\u0623\u064a\u0651', '\u0623 - \u064a', '\u064a - \u0623'],
    '\u0627\u0644\u062a\u0634\u062e\u064a\u0635': ['\u0623\u064a\u0651', '\u0627\u0636\u0637\u0631\u0627\u0628 \u0637\u064a\u0641 \u0627\u0644\u062a\u0648\u062d\u0651\u062f', '\u062a\u0623\u062e\u0631 \u0644\u063a\u0648\u064a', '\u0635\u0639\u0648\u0628\u0627\u062a \u0646\u0637\u0642'],
    '\u0627\u0644\u0641\u0626\u0629 \u0627\u0644\u0639\u0645\u0631\u064a\u0629': ['\u0623\u064a\u0651', '0 - 5', '6 - 10', '11 - 16'],
    '\u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629': ['\u0623\u064a\u0651', '\u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629 \u0623', '\u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629 \u0628', '\u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629 \u062c']
  };

  function normalizeValue(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function buildFallbackDropdown(box) {
    const labelNode = box.querySelector('.filter-label');
    const valueNode = box.querySelector('.filter-value');
    const label = normalizeValue(labelNode?.textContent || '');
    const options = fallbackOptionsByLabel[label];

    if (!options || !options.length) return null;

    const dropdown = document.createElement('div');
    dropdown.className = 'filter-dropdown';
    dropdown.setAttribute('aria-hidden', 'true');

    const currentValue = normalizeValue(valueNode?.textContent || options[0]);

    options.forEach((option) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'filter-dropdown-item';
      if (normalizeValue(option) === currentValue) {
        item.classList.add('is-active');
      }
      item.textContent = option;
      dropdown.appendChild(item);
    });

    box.appendChild(dropdown);
    return dropdown;
  }

  const managedFilters = filterBoxes
    .map((box, index) => {
      const trigger = box.querySelector('.filter-trigger');
      const dropdown = box.querySelector('.filter-dropdown') || buildFallbackDropdown(box);
      if (!trigger || !dropdown) return null;

      if (!dropdown.id) {
        dropdown.id = `filter-dropdown-${index + 1}`;
      }

      trigger.setAttribute('aria-controls', dropdown.id);
      trigger.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
      dropdown.classList.remove('is-open');

      return { box, trigger, dropdown };
    })
    .filter(Boolean);

  if (!managedFilters.length) return;

  function closeFilters(exceptBox = null) {
    managedFilters.forEach(({ box, trigger, dropdown }) => {
      if (exceptBox && box === exceptBox) return;
      box.classList.remove('is-open');
      dropdown.classList.remove('is-open');
      dropdown.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  managedFilters.forEach(({ box, trigger, dropdown }) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !dropdown.classList.contains('is-open');
      closeFilters(box);
      box.classList.toggle('is-open', willOpen);
      dropdown.classList.toggle('is-open', willOpen);
      dropdown.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    dropdown.querySelectorAll('.filter-dropdown-item').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const valueNode = box.querySelector('.filter-value');
        if (valueNode) {
          valueNode.textContent = item.textContent.trim();
        }

        dropdown.querySelectorAll('.filter-dropdown-item').forEach((btn) => {
          btn.classList.toggle('is-active', btn === item);
        });

        closeFilters();
      });
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideFilter = managedFilters.some(({ box }) => box.contains(event.target));
    if (!clickedInsideFilter) {
      closeFilters();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeFilters();
    }
  });
})();

(function() {
  const footerTemplate = `
    <div class="footer-bar__inner">
      <p class="footer-bar__copyright">\u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629 \u0644\u064a\u0646\u0645\u0648 \u00a9 2026</p>
      <nav class="footer-bar__links" aria-label="\u0631\u0648\u0627\u0628\u0637 \u0627\u0644\u062a\u0630\u064a\u064a\u0644">
        <a class="footer-bar__link" href="#">\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629</a>
        <a class="footer-bar__link" href="#">\u0645\u0644\u0641\u0627\u062a \u0627\u0644\u0627\u0631\u062a\u0628\u0627\u0637</a>
        <a class="footer-bar__link" href="#">\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062d\u0643\u0627\u0645</a>
      </nav>
    </div>
  `;

  document.querySelectorAll('.footer-bar').forEach((footer) => {
    footer.innerHTML = footerTemplate;
  });

  document.querySelectorAll('.footer-bar__link[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });
})();

(function() {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('dashboard.html') || path.endsWith('/dashboard')) return;

  const host = document.querySelector('.topbar-left');
  if (!host || host.querySelector('.lang-pill-toggle')) return;

  const STORAGE_KEY = 'dashboard-language';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'lang-pill-toggle';
  button.setAttribute('aria-label', 'Toggle language');

  function getLanguage() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === 'en' ? 'en' : 'ar';
    } catch (error) {
      return 'ar';
    }
  }

  function setLanguage(language) {
    const nextLanguage = language === 'en' ? 'en' : 'ar';
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = 'rtl';
    button.textContent = nextLanguage === 'en' ? 'EN | AR' : 'AR | EN';

    try {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  button.addEventListener('click', () => {
    const nextLanguage = document.documentElement.lang === 'en' ? 'ar' : 'en';
    setLanguage(nextLanguage);
  });

  host.prepend(button);
  setLanguage(getLanguage());
})();

(function () {
  if (!document.querySelector('.app-shell')) return;

  const script = document.createElement('script');
  script.src = 'js/app-navigation.js';
  script.async = true;
  document.body.appendChild(script);
})();
