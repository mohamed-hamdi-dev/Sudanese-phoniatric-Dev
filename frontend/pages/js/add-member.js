(function () {
  const MEMBERS_STORAGE_KEY = 'sp_members';
  const form = document.getElementById('add-member-form');
  const permissionsPanel = document.querySelector('[data-permissions-panel]');
  const cancelBtn = document.getElementById('cancel-add-member');
  const saveAddNewBtn = document.getElementById('save-add-new');
  const roleSelect = document.querySelector('[data-member-role]');
  const autoPasswordToggle = document.querySelector('[data-auto-password-toggle]');
  const passwordInput = document.querySelector('[data-member-password]');
  const scopeCards = Array.from(document.querySelectorAll('[data-member-scope]'));

  if (!form) return;

  window.whenSPPermissionsReady(function initAddMember() {
  const P = window.SPPermissions;

  function generatePassword() {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$';
    let value = '';
    for (let index = 0; index < 10; index += 1) {
      value += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return value;
  }

  function syncAutoPassword() {
    if (!passwordInput || !autoPasswordToggle) return;
    const useAuto = autoPasswordToggle.classList.contains('is-active');
    if (useAuto) {
      passwordInput.value = generatePassword();
      passwordInput.readOnly = true;
      passwordInput.classList.add('is-readonly');
    } else {
      passwordInput.readOnly = false;
      passwordInput.classList.remove('is-readonly');
    }
  }

  function getSelectedScope() {
    const active = scopeCards.find((card) => card.classList.contains('is-active'));
    return active?.dataset.memberScope || 'all';
  }

  function buildMemberRecord(formData) {
    const now = new Date();
    const joinedOn = new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(now);

    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'عضو جديد';
    const role = P.normalizeRole(formData.get('role'));

    return {
      id: Math.floor(100000 + Math.random() * 900000),
      name: fullName,
      firstName,
      lastName,
      email: String(formData.get('email') || '').trim() || '-',
      phone: String(formData.get('phone') || '').trim() || '-',
      jobTitle: String(formData.get('jobTitle') || '').trim() || '-',
      role: role === 'owner' ? 'مالك الحساب' : role === 'admin' ? 'مشرف' : role === 'doctor' ? 'دكتور' : 'عضو',
      roleKey: role,
      beneficiaryScope: getSelectedScope(),
      permissions: P.collectPermissionsFromPanel(permissionsPanel),
      joinedOn
    };
  }

  function saveMember(memberRecord) {
    let members = [];
    try {
      const parsed = JSON.parse(window.localStorage.getItem(MEMBERS_STORAGE_KEY) || '[]');
      if (Array.isArray(parsed)) members = parsed;
    } catch (error) {
      members = [];
    }
    members.push(memberRecord);
    window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  }

  function handleSave(stayOnPage) {
    if (!form.reportValidity()) return;
    const memberRecord = buildMemberRecord(new FormData(form));
    saveMember(memberRecord);
    if (stayOnPage) {
      form.reset();
      applyRoleTemplate(roleSelect?.value || 'doctor');
      syncAutoPassword();
      return;
    }
    window.location.href = './members.html';
  }

  function applyRoleTemplate(role) {
    const normalized = P.normalizeRole(role);
    P.applyPermissionsToPanel(permissionsPanel, P.getRolePreset(normalized), { role: normalized });
  }

  P.renderPermissionsPanel(permissionsPanel, { role: 'doctor' });
  P.bindPermissionsPanel(permissionsPanel);

  roleSelect?.addEventListener('change', () => {
    applyRoleTemplate(roleSelect.value);
  });

  autoPasswordToggle?.addEventListener('click', () => {
    autoPasswordToggle.classList.toggle('is-active');
    autoPasswordToggle.setAttribute(
      'aria-pressed',
      autoPasswordToggle.classList.contains('is-active') ? 'true' : 'false'
    );
    syncAutoPassword();
  });

  scopeCards.forEach((card) => {
    card.addEventListener('click', () => {
      scopeCards.forEach((item) => item.classList.remove('is-active'));
      card.classList.add('is-active');
      const input = card.querySelector('input[type="radio"]');
      if (input) input.checked = true;
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSave(false);
  });

  saveAddNewBtn?.addEventListener('click', () => {
    handleSave(true);
  });

  cancelBtn?.addEventListener('click', () => {
    window.location.href = './members.html';
  });

  applyRoleTemplate('doctor');
  syncAutoPassword();
  });
})();
