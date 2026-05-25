(function () {
  const MEMBERS_STORAGE_KEY = 'sp_members';
  const form = document.getElementById('member-form');
  const permissionsPanel = document.querySelector('[data-permissions-panel]');
  const cancelBtn = document.getElementById('cancel-member-form');
  const saveAddNewBtn = document.getElementById('save-add-new');
  const roleSelect = document.querySelector('[data-member-role]');
  const autoPasswordToggle = document.querySelector('[data-auto-password-toggle]');
  const passwordInput = document.querySelector('[data-member-password]');
  const scopeCards = Array.from(document.querySelectorAll('[data-member-scope]'));
  const pageMode = document.body.dataset.memberFormMode || 'add';
  const editMemberId = Number(new URLSearchParams(window.location.search).get('id'));

  if (!form) return;

  window.whenSPPermissionsReady(function initMemberForm() {
  const P = window.SPPermissions;
  const isEditMode = pageMode === 'edit' && Number.isFinite(editMemberId);

  function readMembers() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(MEMBERS_STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeMembers(members) {
    window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  }

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
    const passwordField = passwordInput.closest('[data-password-field]');
    const useAuto = autoPasswordToggle.classList.contains('is-active');
    if (useAuto) {
      if (!passwordInput.value) passwordInput.value = generatePassword();
      passwordInput.readOnly = true;
      passwordField?.classList.add('is-readonly');
    } else {
      passwordInput.readOnly = false;
      passwordField?.classList.remove('is-readonly');
    }
  }

  function getSelectedScope() {
    const active = scopeCards.find((card) => card.classList.contains('is-active'));
    return active?.dataset.memberScope || 'all';
  }

  function setScope(scope) {
    scopeCards.forEach((card) => {
      const isActive = card.dataset.memberScope === scope;
      card.classList.toggle('is-active', isActive);
      const input = card.querySelector('input[type="radio"]');
      if (input) input.checked = isActive;
    });
  }

  function roleLabel(roleKey) {
    if (roleKey === 'owner') return 'مالك الحساب';
    if (roleKey === 'admin') return 'مشرف';
    if (roleKey === 'doctor') return 'دكتور';
    return 'عضو';
  }

  function buildMemberRecord(formData, existing) {
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const roleKey = P.normalizeRole(formData.get('role'));

    return {
      id: existing?.id || Math.floor(100000 + Math.random() * 900000),
      name: [firstName, lastName].filter(Boolean).join(' ') || existing?.name || 'عضو جديد',
      firstName,
      lastName,
      email: String(formData.get('email') || '').trim() || '-',
      phone: String(formData.get('phone') || '').trim() || '-',
      jobTitle: String(formData.get('jobTitle') || '').trim() || '-',
      role: roleLabel(roleKey),
      roleKey,
      password: String(formData.get('password') || '').trim() || existing?.password || '',
      beneficiaryScope: getSelectedScope(),
      permissions: P.collectPermissionsFromPanel(permissionsPanel),
      joinedOn: existing?.joinedOn || new Intl.DateTimeFormat('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date()),
      status: existing?.status || 'active'
    };
  }

  function populateForm(member) {
    form.elements.firstName.value = member.firstName || '';
    form.elements.lastName.value = member.lastName || '';
    form.elements.phone.value = member.phone || '';
    form.elements.jobTitle.value = member.jobTitle || '';
    form.elements.email.value = member.email || '';
    if (passwordInput) passwordInput.value = member.password || generatePassword();
    if (roleSelect) roleSelect.value = member.roleKey || P.normalizeRole(member.role);
    setScope(member.beneficiaryScope || 'all');
    P.applyPermissionsToPanel(permissionsPanel, member.permissions || P.getRolePreset(member.roleKey), {
      role: member.roleKey || 'member'
    });
    syncAutoPassword();
  }

  function handleSave(stayOnPage) {
    if (!form.reportValidity()) return;

    const members = readMembers();
    const formData = new FormData(form);

    if (isEditMode) {
      const index = members.findIndex((item) => Number(item.id) === editMemberId);
      if (index === -1) {
        window.alert('تعذر العثور على العضو.');
        window.location.href = './members.html';
        return;
      }
      members[index] = buildMemberRecord(formData, members[index]);
      writeMembers(members);
      window.location.href = './members.html';
      return;
    }

    members.push(buildMemberRecord(formData));
    writeMembers(members);

    if (stayOnPage) {
      form.reset();
      applyRoleTemplate(roleSelect?.value || 'doctor');
      setScope('all');
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

  if (isEditMode) {
    const member = readMembers().find((item) => Number(item.id) === editMemberId);
    if (!member) {
      window.alert('العضو غير موجود.');
      window.location.href = './members.html';
      return;
    }
    populateForm(member);
    if (saveAddNewBtn) saveAddNewBtn.hidden = true;
  } else {
    applyRoleTemplate('doctor');
    syncAutoPassword();
  }

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

  // Avatar Upload Preview
  const avatarUpload = document.getElementById('member-avatar-upload');
  const dropzone = document.querySelector('.settings-editor-dropzone');
  const dropzoneGraphic = document.querySelector('.settings-editor-dropzone-graphic');
  const trashBtn = document.querySelector('.settings-editor-trash');

  if (avatarUpload && dropzone) {
    avatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        dropzone.style.backgroundImage = `url(${url})`;
        if (dropzoneGraphic) dropzoneGraphic.style.opacity = '0';
        if (trashBtn) trashBtn.hidden = false;
      }
    });
  }

  if (trashBtn && dropzone) {
    trashBtn.addEventListener('click', () => {
      if (avatarUpload) avatarUpload.value = '';
      dropzone.style.backgroundImage = '';
      if (dropzoneGraphic) dropzoneGraphic.style.opacity = '1';
      trashBtn.hidden = true;
    });
  }
  });
})();
