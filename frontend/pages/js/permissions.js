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
      // Inject modal styles if they don't exist
      if (!document.getElementById('custom-upgrade-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'custom-upgrade-modal-styles';
        style.innerHTML = `
          .upgrade-modal-overlay {
              position: fixed; top: 0; left: 0; width: 100%; height: 100%;
              background: rgba(0, 0, 0, 0.6);
              display: flex; align-items: center; justify-content: center;
              z-index: 99999; backdrop-filter: blur(4px);
              animation: modalFadeIn 0.2s ease;
          }
          .upgrade-modal-box {
              background: #fff; padding: 40px; border-radius: 16px;
              box-shadow: 0 20px 50px rgba(0,0,0,0.2);
              text-align: center; max-width: 500px; width: 90%;
              animation: modalPopUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              border-top: 6px solid var(--scrollbar-thumb, #16a34a);
          }
          .upgrade-modal-icon {
              font-size: 60px; color: var(--scrollbar-thumb, #16a34a); margin-bottom: 20px;
          }
          .upgrade-modal-title {
              font-family: 'Cairo', sans-serif; font-size: 26px;
              font-weight: 800; color: #1f2937; margin-bottom: 15px;
          }
          .upgrade-modal-text {
              font-family: 'Cairo', sans-serif; font-size: 18px;
              color: #4b5563; line-height: 1.7; margin-bottom: 30px;
              direction: rtl;
          }
          .upgrade-modal-btn {
              background: var(--scrollbar-thumb, #16a34a); color: #fff; border: none;
              padding: 14px 40px; border-radius: 8px;
              font-family: 'Cairo', sans-serif; font-size: 18px; font-weight: 700;
              cursor: pointer; transition: all 0.2s;
          }
          .upgrade-modal-btn:hover { background: var(--scrollbar-thumb-hover, #15803d); transform: translateY(-2px); }
          @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes modalPopUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `;
        document.head.appendChild(style);
      }

      const overlay = document.createElement('div');
      overlay.className = 'upgrade-modal-overlay';
      overlay.innerHTML = \`
        <div class="upgrade-modal-box">
          <div class="upgrade-modal-icon"><i class="fa-solid fa-gift"></i></div>
          <div class="upgrade-modal-title">مشروع غير ربحي</div>
          <div class="upgrade-modal-text">الصلاحيات مفتوحة بالكامل للمسؤولين دون الحاجة لترقية الباقة.</div>
          <button class="upgrade-modal-btn">شكراً لكم</button>
        </div>
      \`;

      document.body.appendChild(overlay);

      overlay.querySelector('.upgrade-modal-btn').addEventListener('click', () => overlay.remove());
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
    return {
  "nonprofitMode": true,
  "rolePresets": {
    "admin": {
      "account_manage": true,
      "subscription_manage": true,
      "notifications_manage": true,
      "kpi_view": true,
      "users_table": false,
      "library_create": true,
      "library_delete": true,
      "library_edit": true,
      "beneficiaries_create": true,
      "beneficiaries_delete": true,
      "beneficiaries_edit": true,
      "beneficiaries_tables": false,
      "plan_eval_form": true,
      "plan_delete_content": true,
      "plan_mobile_view": true,
      "eval_delete": true,
      "storage_manage": false,
      "app_login": true,
      "portal_login": true,
      "credentials_edit": false,
      "social_assessment": false,
      "social_attendance": false,
      "report": false
    },
    "doctor": {
      "account_manage": false,
      "subscription_manage": false,
      "notifications_manage": false,
      "kpi_view": true,
      "users_table": false,
      "library_create": true,
      "library_delete": false,
      "library_edit": true,
      "beneficiaries_create": false,
      "beneficiaries_delete": false,
      "beneficiaries_edit": true,
      "beneficiaries_tables": false,
      "plan_eval_form": true,
      "plan_delete_content": false,
      "plan_mobile_view": true,
      "eval_delete": false,
      "storage_manage": false,
      "app_login": true,
      "portal_login": true,
      "credentials_edit": false,
      "social_assessment": false,
      "social_attendance": true,
      "report": false
    },
    "member": {
      "account_manage": false,
      "subscription_manage": false,
      "notifications_manage": false,
      "kpi_view": false,
      "users_table": false,
      "library_create": false,
      "library_delete": false,
      "library_edit": false,
      "beneficiaries_create": false,
      "beneficiaries_delete": false,
      "beneficiaries_edit": true,
      "beneficiaries_tables": false,
      "plan_eval_form": false,
      "plan_delete_content": false,
      "plan_mobile_view": false,
      "eval_delete": false,
      "storage_manage": false,
      "app_login": true,
      "portal_login": false,
      "credentials_edit": false,
      "social_assessment": false,
      "social_attendance": false,
      "report": false
    }
  },
  "ownerOverrides": {
    "users_table": true,
    "storage_manage": true,
    "report": true
  },
  "permissionSections": [
    {
      "title": "إدارة الحساب",
      "items": [
        { "key": "account_manage", "label": "إدارة الحساب" },
        { "key": "subscription_manage", "label": "إدارة الاشتراك" },
        { "key": "notifications_manage", "label": "إدارة الإشعارات" }
      ]
    },
    {
      "title": "إدارة الأعضاء",
      "items": [
        { "key": "kpi_view", "label": "استعراض مؤشرات قياس الأداء" },
        { "key": "users_table", "label": "جدول المستخدمين" }
      ]
    },
    {
      "title": "إدارة المكتبة",
      "items": [
        { "key": "library_create", "label": "إنشاء" },
        { "key": "library_delete", "label": "حذف" },
        { "key": "library_edit", "label": "تعديل" },
        { "key": "library_stop_edit", "label": "وقف التعديل في المكتبة", "adminOnly": true }
      ]
    },
    {
      "title": "إدارة المستفيدين",
      "items": [
        { "key": "beneficiaries_create", "label": "إنشاء" },
        { "key": "beneficiaries_delete", "label": "حذف" },
        { "key": "beneficiaries_edit", "label": "تعديل" },
        { "key": "beneficiaries_tables", "label": "الجداول" }
      ]
    },
    {
      "title": "إدارة الخطة الفردية",
      "items": [
        { "key": "plan_eval_form", "label": "تعيين/إبداء تقييم أو استمارة" },
        { "key": "plan_delete_content", "label": "حذف المحتوى" },
        { "key": "plan_mobile_view", "label": "عرض الخطة العامة على الجوال" }
      ]
    },
    {
      "title": "إدارة التقييم أو الاستمارة",
      "items": [
        { "key": "eval_delete", "label": "حذف" }
      ]
    },
    {
      "title": "إدارة مساحة تخزين المركز",
      "items": [
        { "key": "storage_manage", "label": "إدارة الحذف واستعادة الملفات" }
      ]
    },
    {
      "title": "تسجيل الدخول",
      "items": [
        { "key": "app_login", "label": "الدخول للتطبيق" },
        { "key": "portal_login", "label": "الدخول للبوابة" }
      ]
    },
    {
      "title": "بيانات تسجيل دخول المستخدمين",
      "items": [
        { "key": "credentials_edit", "label": "تعديل بيانات تسجيل الدخول" }
      ]
    },
    {
      "title": "إمكانيات الأخصائي الاجتماعي",
      "items": [
        { "key": "social_assessment", "label": "التقييمات أو الاستمارات الاجتماعية" },
        { "key": "social_attendance", "label": "الحضور / الغياب" }
      ]
    },
    {
      "title": "لوحة التحكم",
      "items": [
        { "key": "report", "label": "إصدار تقرير" }
      ]
    }
  ]
};
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
