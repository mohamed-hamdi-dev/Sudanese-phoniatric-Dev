(function () {
  const libraryPage = document.querySelector('.library-page');
  const lockControl = document.querySelector('[data-library-lock-control]');
  const lockToggle = document.querySelector('[data-library-lock-toggle]');
  const addBtn = document.querySelector('[data-library-add-btn]');

  if (!libraryPage) return;

  window.whenSPPermissionsReady(function initLibraryAccess() {
  const P = window.SPPermissions;

  function showBlockedMessage() {
    if (P.isLibraryLocked() && !P.canManagePermissions()) {
      window.alert('التعديل متوقف في المكتبة حالياً. تواصل مع المسؤول.');
      return;
    }
    window.alert('ليس لديك صلاحية لهذا الإجراء في المكتبة.');
  }

  function syncLibraryAccessState() {
    const locked = P.isLibraryEditBlocked();
    libraryPage.classList.toggle('is-edit-locked', locked);

    if (addBtn) {
      addBtn.disabled = !P.canLibraryCreate();
      addBtn.setAttribute('aria-disabled', addBtn.disabled ? 'true' : 'false');
    }

    if (lockControl) {
      lockControl.hidden = !P.canManagePermissions();
    }

    if (lockToggle) {
      lockToggle.classList.toggle('is-active', P.isLibraryLocked());
      lockToggle.setAttribute('aria-pressed', P.isLibraryLocked() ? 'true' : 'false');
    }
  }

  lockToggle?.addEventListener('click', () => {
    P.setLibraryLocked(!P.isLibraryLocked());
    syncLibraryAccessState();
  });

  const shortGoalSaveSelector = '[data-create-short],[data-create-short-and-new]';

  const editSelector = [
    '[data-curriculum-action="edit"]',
    '[data-short-goal-action="edit"]',
    '[data-short-goal-action="quick-edit"]',
    '[data-long-goal-action="quick-edit"]',
    '[data-aspect-action="quick-edit"]',
    '[data-edit-save]',
    '[data-inline-aspect-create]',
    '[data-inline-long-goal-create]',
    '[data-create-submit]'
  ].join(',');

  document.addEventListener(
    'click',
    (event) => {
      if (event.target.closest('[data-library-lock-toggle]')) return;

      if (event.target.closest('[data-library-add-btn]')) {
        if (!P.canLibraryCreate()) {
          event.preventDefault();
          event.stopPropagation();
          showBlockedMessage();
        }
        return;
      }

      if (event.target.closest(shortGoalSaveSelector)) {
        if (!P.canLibrarySaveShortGoal()) {
          event.preventDefault();
          event.stopPropagation();
          showBlockedMessage();
        }
        return;
      }

      if (!event.target.closest(editSelector)) return;
      if (!P.isLibraryEditBlocked()) return;

      event.preventDefault();
      event.stopPropagation();
      showBlockedMessage();
    },
    true
  );

  global.addEventListener('sp:permissions-changed', syncLibraryAccessState);
  global.addEventListener('sp:library-lock-changed', syncLibraryAccessState);
  syncLibraryAccessState();
  });
})();
