(function (global) {
  const CURRENT_USER_KEY = 'sp_current_user';
  const LIBRARY_LOCK_KEY = 'sp_library_edit_locked';
  const PERMISSIONS_JSON_URL = 'data/permissions.json';

  let NONPROFIT_MODE = true;
  let ROLE_PRESETS = {};
  let PERMISSION_SECTIONS = [];

  function readJson(key, fallback) {
    try {
      const raw = global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    global.localStorage.setItem(key, JSON.stringify(value));
  }

  function buildRolePresets(config) {
    const presets = { ...(config.rolePresets || {}) };
    const admin = presets.admin || presets.member || {};
    presets.owner = { ...admin, ...(config.ownerOverrides || {}) };
    return presets;
  }

  function normalizeRole(role) {
    const value = String(role || '').trim().toLowerCase();
    if (value === 'admin' || value === 'مشرف' || value === 'مالك' || value === 'مالك الحساب') {
      if (value === 'مالك' || value === 'مالك الحساب') return 'owner';
      if (value === 'مشرف') return 'admin';
      return value;
    }
    if (value === 'doctor' || value === 'دكتور' || value === 'طبيب') return 'doctor';
    return 'member';
  }

  function getDefaultUser() {
    return {
      id: 'owner-1',
      role: 'owner',
      name: 'sudanesephoniatric',
      permissions: { ...ROLE_PRESETS.owner }
    };
  }

  function getCurrentUser() {
    const stored = readJson(CURRENT_USER_KEY, null);
    if (!stored) {
      const user = getDefaultUser();
      setCurrentUser(user);
      return user;
    }
    if (!stored.permissions) {
      stored.permissions = { ...(ROLE_PRESETS[normalizeRole(stored.role)] || ROLE_PRESETS.member) };
    }
    stored.role = normalizeRole(stored.role);
    return stored;
  }

  function setCurrentUser(user) {
    writeJson(CURRENT_USER_KEY, user);
    global.dispatchEvent(new CustomEvent('sp:permissions-changed'));
  }

  function isLibraryLocked() {
    return global.localStorage.getItem(LIBRARY_LOCK_KEY) === '1';
  }

  function setLibraryLocked(locked) {
    global.localStorage.setItem(LIBRARY_LOCK_KEY, locked ? '1' : '0');
    global.dispatchEvent(new CustomEvent('sp:library-lock-changed', { detail: { locked: !!locked } }));
  }

  function hasPermission(key) {
    const user = getCurrentUser();
    if (key === 'library_stop_edit') {
      return user.role === 'owner' || user.role === 'admin';
    }
    if (user.role === 'owner') return true;
    return !!user.permissions?.[key];
  }

  function canManagePermissions() {
    const role = getCurrentUser().role;
    return role === 'owner' || role === 'admin';
  }

  function isLibraryEditBlocked() {
    const user = getCurrentUser();
    if (isLibraryLocked() && user.role !== 'owner' && user.role !== 'admin') return true;
    return !hasPermission('library_edit');
  }

  function canLibraryCreate() {
    return hasPermission('library_create') && !isLibraryLocked();
  }

  function canLibrarySaveShortGoal() {
    const user = getCurrentUser();
    if (isLibraryLocked() && user.role !== 'owner' && user.role !== 'admin') {
      return false;
    }
    return hasPermission('library_create') || hasPermission('library_edit');
  }

  function canLibraryDelete() {
    return hasPermission('library_delete');
  }

  function getRolePreset(role) {
    const normalized = normalizeRole(role);
    return { ...(ROLE_PRESETS[normalized] || ROLE_PRESETS.member) };
  }

  function collectPermissionsFromPanel(root) {
    const permissions = getRolePreset('member');
    root?.querySelectorAll('[data-permission-toggle]').forEach((toggle) => {
      const key = toggle.dataset.permissionToggle;
      if (!key || key === 'library_stop_edit') return;
      permissions[key] = toggle.classList.contains('is-active');
    });
    return permissions;
  }

  function applyPermissionsToPanel(root, permissions, options = {}) {
    const { role = 'member', readonly = false } = options;
    const preset = permissions || getRolePreset(role);

    root?.querySelectorAll('[data-permission-toggle]').forEach((toggle) => {
      const key = toggle.dataset.permissionToggle;
      if (!key) return;

      if (key === 'library_stop_edit') {
        toggle.classList.toggle('is-active', isLibraryLocked());
        toggle.disabled = readonly || !canManagePermissions();
        return;
      }

      toggle.classList.toggle('is-active', !!preset[key]);
      toggle.disabled = readonly || !canManagePermissions();
      toggle.setAttribute('aria-pressed', toggle.classList.contains('is-active') ? 'true' : 'false');
    });

    const upgrade = root?.querySelector('[data-permissions-upgrade]');
    if (upgrade) {
      upgrade.hidden = NONPROFIT_MODE || canManagePermissions();
    }
  }

  function renderPermissionsPanel(container, options = {}) {
    if (!container) return;
    const { role = 'member', readonly = false } = options;
    const preset = getRolePreset(role);
    const canEdit = canManagePermissions() && !readonly;

    container.innerHTML = `
      <div class="permissions-panel__title-card settings-surface-card">
        <h2 class="permissions-panel__heading">الصلاحيات</h2>
      </div>
      ${PERMISSION_SECTIONS.map((section) => `
        <section class="permissions-card settings-surface-card">
          <h3 class="permissions-card__title">${section.title}</h3>
          <div class="permissions-card__rows">
            ${section.items.map((item) => `
              <div class="permissions-row ${item.adminOnly ? 'permissions-row--admin-only' : ''}">
                <span class="permissions-row__label">${item.label}</span>
                <button
                  type="button"
                  class="modal-toggle ${preset[item.key] || (item.key === 'library_stop_edit' && isLibraryLocked()) ? 'is-active' : ''}"
                  data-permission-toggle="${item.key}"
                  aria-pressed="${preset[item.key] ? 'true' : 'false'}"
                  ${canEdit ? '' : 'disabled'}
                ></button>
              </div>
            `).join('')}
          </div>
        </section>
      `).join('')}
      <div class="permissions-upgrade" data-permissions-upgrade ${NONPROFIT_MODE || canManagePermissions() ? 'hidden' : ''}>
        <p>لإدارة الصلاحيات يجب ترقية الباقة</p>
        <button type="button" class="permissions-upgrade__btn">ترقية</button>
      </div>
    `;

    applyPermissionsToPanel(container, preset, { role, readonly });
  }

  function bindPermissionsPanel(container) {
    if (!container) return;

    container.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-permission-toggle]');
      if (!toggle || toggle.disabled) return;

      const key = toggle.dataset.permissionToggle;
      if (key === 'library_stop_edit') {
        setLibraryLocked(!isLibraryLocked());
        toggle.classList.toggle('is-active', isLibraryLocked());
        return;
      }

      toggle.classList.toggle('is-active');
      toggle.setAttribute('aria-pressed', toggle.classList.contains('is-active') ? 'true' : 'false');
    });

    const upgradeBtn = container.querySelector('.permissions-upgrade__btn');
    upgradeBtn?.addEventListener('click', () => {
      global.alert('مشروعكم غير ربحي — الصلاحيات مفتوحة للمسؤولين دون ترقية باقة.');
    });
  }

  function publishApi() {
    global.SPPermissions = {
      NONPROFIT_MODE,
      PERMISSION_SECTIONS,
      ROLE_PRESETS,
      getCurrentUser,
      setCurrentUser,
      normalizeRole,
      getRolePreset,
      hasPermission,
      canManagePermissions,
      isLibraryLocked,
      setLibraryLocked,
      isLibraryEditBlocked,
      canLibraryCreate,
      canLibrarySaveShortGoal,
      canLibraryDelete,
      collectPermissionsFromPanel,
      applyPermissionsToPanel,
      renderPermissionsPanel,
      bindPermissionsPanel
    };
    global.dispatchEvent(new CustomEvent('sp:permissions-ready'));
  }

  function applyConfig(config) {
    ROLE_PRESETS = buildRolePresets(config);
    PERMISSION_SECTIONS = Array.isArray(config.permissionSections) ? config.permissionSections : [];
    NONPROFIT_MODE = config.nonprofitMode !== false;
    publishApi();
  }

  async function loadPermissionsConfig() {
    const response = await fetch(PERMISSIONS_JSON_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  global.whenSPPermissionsReady = function whenSPPermissionsReady(callback) {
    if (global.SPPermissions) {
      callback(global.SPPermissions);
      return;
    }
    global.SPPermissionsReady.then(() => callback(global.SPPermissions));
  };

  global.SPPermissionsReady = loadPermissionsConfig()
    .then(applyConfig)
    .catch((error) => {
      console.error('[SPPermissions] تعذر تحميل data/permissions.json', error);
      throw error;
    });
})(window);
