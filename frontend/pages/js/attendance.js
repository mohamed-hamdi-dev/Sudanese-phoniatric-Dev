(function() {
  const views = Array.from(document.querySelectorAll('[data-attendance-view]'));
  const viewTriggers = Array.from(document.querySelectorAll('[data-attendance-target]'));

  function setView(target) {
    const next = target === 'edit' ? 'edit' : 'list';
    views.forEach((view) => {
      const active = view.dataset.attendanceView === next;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
    });
  }

  viewTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => setView(trigger.dataset.attendanceTarget));
  });

  const toolsToggle = document.querySelector('[data-attendance-tools-toggle]');
  const toolsMenu = document.querySelector('[data-attendance-tools-menu]');
  const calendarToggle = document.querySelector('[data-attendance-calendar-toggle]');
  const calendarPanel = document.querySelector('[data-attendance-calendar-panel]');
  const calendarClose = document.querySelector('.attendance-calendar-close');

  function closeToolsMenu() {
    if (!toolsToggle || !toolsMenu) return;
    toolsMenu.classList.remove('is-open');
    toolsMenu.setAttribute('aria-hidden', 'true');
    toolsToggle.setAttribute('aria-expanded', 'false');
  }

  function closeCalendarPanel() {
    if (!calendarToggle || !calendarPanel) return;
    calendarPanel.classList.remove('is-open');
    calendarPanel.setAttribute('aria-hidden', 'true');
    calendarToggle.setAttribute('aria-expanded', 'false');
  }

  toolsToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = toolsMenu.classList.toggle('is-open');
    toolsMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    toolsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  calendarToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = calendarPanel.classList.toggle('is-open');
    calendarPanel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    calendarToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  calendarClose?.addEventListener('click', (event) => {
    event.preventDefault();
    closeCalendarPanel();
  });

  calendarPanel?.querySelectorAll('.attendance-calendar-grid button').forEach((dayBtn) => {
    dayBtn.addEventListener('click', () => {
      calendarPanel.querySelectorAll('.attendance-calendar-grid button').forEach((btn) => {
        btn.classList.toggle('is-active', btn === dayBtn);
      });
    });
  });

  // Open modal buttons
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-open-modal');
      const modal = modalId ? document.getElementById(modalId) : null;
      if (modal) modal.classList.add('is-open');
    });
  });

  // Close modal buttons
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('is-open');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) overlay.classList.remove('is-open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeToolsMenu();
      closeCalendarPanel();
      document.querySelectorAll('.modal-overlay.is-open').forEach((modal) => {
        modal.classList.remove('is-open');
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (toolsMenu && toolsToggle && !toolsMenu.contains(event.target) && !toolsToggle.contains(event.target)) {
      closeToolsMenu();
    }

    if (calendarPanel && calendarToggle && !calendarPanel.contains(event.target) && !calendarToggle.contains(event.target)) {
      closeCalendarPanel();
    }
  });

  document.querySelectorAll('.modal-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-active');
    });
  });
})();
