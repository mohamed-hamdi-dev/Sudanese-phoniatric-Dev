(function (global) {
  const NAV_JSON_URL = 'data/navigation.json';
  const ICONS = {
    dashboard: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    library: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Zm0 0V19m4-12h6m-6 4h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    evaluations: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8 4h8l4 4v12H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 0v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 12h6M10 16h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    beneficiaries: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1M5.5 12.5A2.5 2.5 0 1 0 5.5 7.5M18.5 12.5A2.5 2.5 0 1 0 18.5 7.5M3 20v-.6A3.4 3.4 0 0 1 6.4 16M21 20v-.6a3.4 3.4 0 0 0-3.4-3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    members: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M13 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-6 8v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M5 8H3m2 5H2m3 5H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    families: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5.5 13.5A2.5 2.5 0 1 0 5.5 8.5m13 5a2.5 2.5 0 1 0 0-5M8 19v-.5A3.5 3.5 0 0 1 11.5 15h1A3.5 3.5 0 0 1 16 18.5v.5M3 19v-.4A2.6 2.6 0 0 1 5.6 16M21 19v-.4a2.6 2.6 0 0 0-2.6-2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    requests: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8.5 4h7a1.5 1.5 0 0 1 1.5 1.5v14h-10V5.5A1.5 1.5 0 0 1 8.5 4Zm1 0v2h5V4M10 14h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    attendance: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Zm3 7 2 2 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    settings: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function getCurrentPageId() {
    const file = (global.location.pathname.split('/').pop() || '').replace('.html', '').toLowerCase();
    if (!file || file === 'index') return null;
    return file;
  }

  function buildNavLink(item, className, activeId, withIcon) {
    const isActive = item.id === activeId;
    const icon = withIcon && ICONS[item.icon] ? ICONS[item.icon] : '';
    return `
      <a href="./${item.href}" class="${className}${isActive ? ' is-active' : ''}" data-nav-id="${item.id}" aria-label="${item.label}">
        ${icon}
        ${withIcon ? `<span>${item.label}</span>` : ''}
      </a>
    `;
  }

  function renderSidebar(navItems, activeId) {
    const rail = document.querySelector('.desktop-sidebar-rail');
    if (!rail) return;

    // If the page already ships with a static desktop sidebar, keep it stable.
    // Rebuilding it asynchronously causes a visible flash on refresh.
    if (rail.querySelector('a.sidebar-item:not(.sidebar-logo):not(.sidebar-spacer)')) {
      return;
    }

    rail.querySelectorAll('a.sidebar-item:not(.sidebar-logo)').forEach((node) => node.remove());

    const spacer = rail.querySelector('.sidebar-spacer');
    const sidebarItems = navItems
      .filter((item) => item.showInSidebar !== false)
      .map((item) => buildNavLink(item, 'sidebar-item', activeId, false))
      .join('');

    if (spacer) {
      spacer.insertAdjacentHTML('beforebegin', sidebarItems);
    } else {
      rail.insertAdjacentHTML('beforeend', sidebarItems);
    }
  }

  function renderMobileOverlay(navItems, activeId) {
    const list = document.querySelector('.mobile-nav-list');
    if (!list) return;

    const flag = list.querySelector('.mobile-nav-flag');
    const overlayItems = navItems
      .filter((item) => item.showInMobileOverlay !== false)
      .map((item) => buildNavLink(item, 'mobile-nav-item', activeId, true))
      .join('');

    list.querySelectorAll('.mobile-nav-item').forEach((node) => node.remove());
    if (flag) {
      flag.insertAdjacentHTML('beforebegin', overlayItems);
    } else {
      list.innerHTML = overlayItems;
    }
  }

  function renderBottomBar(navItems, activeId, config) {
    const shell = document.querySelector('.app-shell');
    if (!shell || !config?.mobileBottomBar?.enabled) return;

    const maxItems = Number(config.mobileBottomBar.maxItems) || 5;
    const bottomItems = navItems
      .filter((item) => item.showInBottomBar)
      .slice(0, maxItems);

    if (!bottomItems.length) return;

    let bar = document.querySelector('[data-app-bottom-nav]');
    if (!bar) {
      bar = document.createElement('nav');
      bar.className = 'app-bottom-nav';
      bar.setAttribute('data-app-bottom-nav', '');
      bar.setAttribute('aria-label', 'التنقل السريع');
      shell.appendChild(bar);
      document.body.classList.add('has-bottom-nav');
    }

    bar.innerHTML = bottomItems
      .map((item) => {
        const isActive = item.id === activeId;
        const icon = ICONS[item.icon] || '';
        return `
          <a href="./${item.href}" class="app-bottom-nav__item${isActive ? ' is-active' : ''}" data-nav-id="${item.id}" aria-label="${item.label}">
            <span class="app-bottom-nav__icon">${icon}</span>
            <span class="app-bottom-nav__label">${item.label}</span>
          </a>
        `;
      })
      .join('');
  }

  function renderAccountMenu(menuItems) {
    document.querySelectorAll('.account-dropdown').forEach((dropdown) => {
      dropdown.innerHTML = menuItems
        .map((item) => `<a href="./${item.href}" class="account-dropdown-item">${item.label}</a>`)
        .join('');
    });
  }

  function syncUserLabels(roleLabels) {
    const applyUser = (user) => {
      if (!user) return;
      const role = user.role || 'member';
      const roleLabel = roleLabels[role] || roleLabels.member || 'عضو';
      const displayName = user.name || user.email || 'مستخدم';

      document.querySelectorAll('.account-name, .mobile-account-name').forEach((node) => {
        node.textContent = displayName;
      });
      document.querySelectorAll('.account-title, .mobile-account-title').forEach((node) => {
        node.textContent = roleLabel;
      });

      const pageTitle = document.querySelector('.page-brand-copy h2');
      if (pageTitle && !pageTitle.dataset.staticTitle) {
        pageTitle.textContent = displayName;
      }
    };

    if (global.SPPermissions) {
      applyUser(global.SPPermissions.getCurrentUser());
      return;
    }

    global.whenSPPermissionsReady?.(() => {
      applyUser(global.SPPermissions.getCurrentUser());
    });
  }

  function applyNavigation(config) {
    const navItems = Array.isArray(config.mainNav) ? config.mainNav : [];
    const activeId = getCurrentPageId();

    renderSidebar(navItems, activeId);
    renderMobileOverlay(navItems, activeId);
    renderBottomBar(navItems, activeId, config);
    renderAccountMenu(Array.isArray(config.accountMenu) ? config.accountMenu : []);
    syncUserLabels(config.roleLabels || {});

    global.SPNavigation = {
      config,
      getCurrentPageId,
      refresh() {
        applyNavigation(config);
      }
    };

    global.dispatchEvent(new CustomEvent('sp:navigation-ready', { detail: config }));
  }

  async function initNavigation() {
    if (!document.querySelector('.app-shell')) return;

    const config = {
  "roleLabels": {
    "owner": "المالك",
    "admin": "مشرف",
    "doctor": "دكتور",
    "member": "عضو"
  },
  "accountMenu": [
    { "label": "ملف التعريف", "href": "settings.html" },
    { "label": "تغيير كلمة المرور", "href": "settings.html" },
    { "label": "تسجيل الخروج", "href": "register-login.html" }
  ],
  "mainNav": [
    {
      "id": "dashboard",
      "label": "لوحة التحكم",
      "href": "dashboard.html",
      "icon": "dashboard",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": true
    },
    {
      "id": "library",
      "label": "المكتبة",
      "href": "library.html",
      "icon": "library",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": true
    },
    {
      "id": "evaluations",
      "label": "التقييم والاستمارة",
      "href": "evaluations.html",
      "icon": "evaluations",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": false
    },
    {
      "id": "beneficiaries",
      "label": "المستفيدين",
      "href": "beneficiaries.html",
      "icon": "beneficiaries",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": true
    },
    {
      "id": "members",
      "label": "الأعضاء",
      "href": "members.html",
      "icon": "members",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": true
    },
    {
      "id": "families",
      "label": "الأسر",
      "href": "families.html",
      "icon": "families",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": false
    },
    {
      "id": "requests",
      "label": "الطلبات",
      "href": "requests.html",
      "icon": "requests",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": false
    },
    {
      "id": "attendance",
      "label": "الحضور و الغياب",
      "href": "attendance.html",
      "icon": "attendance",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": false
    },
    {
      "id": "settings",
      "label": "الإعدادات",
      "href": "settings.html",
      "icon": "settings",
      "showInSidebar": true,
      "showInMobileOverlay": true,
      "showInBottomBar": true
    }
  ],
  "mobileBottomBar": {
    "enabled": false,
    "maxItems": 5
  }
};
    applyNavigation(config);
  }

  global.SPNavigationReady = initNavigation().catch((error) => {
    console.error('[SPNavigation] تعذر تحميل navigation.json', error);
  });
})(window);
