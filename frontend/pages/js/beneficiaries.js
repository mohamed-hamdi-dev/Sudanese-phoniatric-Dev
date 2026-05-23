// ===== Beneficiaries Page JS & State Management =====

(function() {
  // 1. Initial State Definition
  const state = {
    activeTab: 'active', // 'active', 'disabled', 'groups'
    searchQuery: '',
    filters: {
      sort: 'أي',
      diagnosis: 'أي',
      age: 'أي',
      group: 'أي'
    },
    // Mock groups as displayed in the screenshot
    groups: [
      { id: 'group_down', name: 'متلازمة داون', beneficiaries: ['adam', 'mahmoud_tammam'] },
      { id: 'group_delay', name: 'تأخر الكلام والنطق عند الاطفال', beneficiaries: ['dunia'] },
      { id: 'group_other', name: '32131321313', beneficiaries: ['mohamed_ali'] }
    ],
    // Mock beneficiaries matching the visual screenshots
    beneficiaries: [
      {
        id: 'ibrahim_alsayed',
        name: 'ابراهيم السيد',
        diagnosis: 'صعوبات التعلم',
        ageText: '10 أعوام و3 أيام',
        avatarText: 'ابراهيم',
        activeGoals: 0,
        masteredGoals: 0,
        isActive: true,
        groupName: 'مجموعة 1'
      },
      {
        id: 'adam',
        name: 'ادم',
        diagnosis: 'متلازمة داون',
        ageText: '8 أعوام و5 أشهر',
        avatarText: 'ادم',
        activeGoals: 0,
        masteredGoals: 0,
        isActive: true,
        groupName: 'متلازمة داون'
      },
      {
        id: 'mahmoud_tammam',
        name: 'محمود تمام',
        diagnosis: 'صعوبات التعلم',
        ageText: '9 أعوام وشهرين',
        avatarText: 'محمود',
        activeGoals: 1,
        masteredGoals: 0,
        isActive: true,
        groupName: 'متلازمة داون'
      },
      {
        id: 'mohamed_ali',
        name: 'محمد علي',
        diagnosis: 'اضطراب طيف التوحد',
        ageText: '11 عاماً و10 أيام',
        avatarText: 'محمد',
        activeGoals: 0,
        masteredGoals: 0,
        isActive: true,
        groupName: '32131321313'
      },
      {
        id: 'dunia',
        name: 'دنيا',
        diagnosis: 'اضطراب النطق',
        ageText: '7 أعوام و9 أشهر',
        avatarText: 'دنيا',
        activeGoals: 0,
        masteredGoals: 0,
        isActive: true,
        groupName: 'تأخر الكلام والنطق عند الاطفال'
      },
      {
        id: 'mahmoud_gadallah',
        name: 'محمود تمام جادالرب',
        diagnosis: 'تأخر الكلام والنطق عند الاطفال',
        ageText: '6 أعوام و12 يوماً',
        avatarText: 'محمود',
        activeGoals: 0,
        masteredGoals: 0,
        isActive: true,
        groupName: 'مجموعة 2'
      }
    ],
    // Temp group modal selection state
    selectedBeneficiariesInGroupModal: new Set()
  };

  // 2. DOM Node Elements Cache
  const tabsContainer = document.getElementById('beneficiaries-tablist');
  const canvasContainer = document.querySelector('.beneficiaries-canvas');
  const paginationCurrent = document.querySelector('.beneficiaries-pagination-current');
  const resultsInfo = document.querySelector('.beneficiaries-results');
  const searchInput = document.getElementById('beneficiary-search-input');
  
  // Group selection popover elements
  const groupSelectTrigger = document.getElementById('group-beneficiaries-select-trigger');
  const groupSelectValue = document.getElementById('group-beneficiaries-select-value');
  const groupSelectDropdown = document.getElementById('group-beneficiaries-dropdown');
  
  // Beneficiary modal group dropdown elements
  const benefGroupTrigger = document.getElementById('beneficiary-group-select-trigger');
  const benefGroupValue = document.getElementById('beneficiary-group-select-value');
  const benefGroupDropdown = document.getElementById('beneficiary-group-dropdown');
  const saveBenefBtn = document.getElementById('save-beneficiary-btn');
  const benefNameInput = document.getElementById('beneficiary-name-input');
  
  const saveGroupBtn = document.getElementById('save-group-btn');
  const groupNameInput = document.getElementById('group-name-input');

  // 3. Helper Functions
  const syncBodyModalState = () => {
    const hasOpenModal = document.querySelector('.modal-overlay.is-open');
    document.body.classList.toggle('modal-open', Boolean(hasOpenModal));
  };

  // Open modal buttons
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('is-open');
        syncBodyModalState();
        if (modalId === 'group-modal') {
          // Reset selection state
          state.selectedBeneficiariesInGroupModal.clear();
          renderGroupModalDropdown();
        } else if (modalId === 'beneficiary-modal') {
          renderBenefGroupDropdown();
        }
      }
    });
  });

  // Close modal buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('is-open');
        syncBodyModalState();
      }
    });
  });

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('is-open');
        syncBodyModalState();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach(m => m.classList.remove('is-open'));
      syncBodyModalState();
      groupSelectDropdown.style.display = 'none';
      benefGroupDropdown.style.display = 'none';
    }
  });

  // Float label on input focus
  document.querySelectorAll('.modal-field input').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.closest('.modal-field').classList.add('has-value');
      } else {
        input.closest('.modal-field').classList.remove('has-value');
      }
    });
  });

  // 4. Custom Multiselect Group Modal Dropdown logic
  const renderGroupModalDropdown = () => {
    if (!groupSelectDropdown) return;
    
    groupSelectDropdown.innerHTML = state.beneficiaries
      .map(benef => {
        const isSelected = state.selectedBeneficiariesInGroupModal.has(benef.id);
        return `
          <div class="modal-select-dropdown-item ${isSelected ? 'is-selected' : ''}" data-id="${benef.id}">
            <div class="modal-select-dropdown-item-right">
              <span class="modal-select-dropdown-item-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
              </span>
              <span class="modal-select-dropdown-item-name">${benef.name}</span>
            </div>
            <div class="modal-select-dropdown-item-checkbox">
              ${isSelected ? `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 12 4 4L19 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

    // Toggle trigger values
    if (state.selectedBeneficiariesInGroupModal.size === 0) {
      groupSelectValue.textContent = 'اختيار';
      groupSelectValue.style.color = '#9ca3af';
    } else {
      const selectedNames = state.beneficiaries
        .filter(b => state.selectedBeneficiariesInGroupModal.has(b.id))
        .map(b => b.name)
        .join('، ');
      groupSelectValue.textContent = selectedNames;
      groupSelectValue.style.color = '#2f2d3d';
    }
  };

  if (groupSelectTrigger) {
    groupSelectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = groupSelectDropdown.style.display === 'block';
      groupSelectDropdown.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (groupSelectDropdown) {
    groupSelectDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.modal-select-dropdown-item');
      if (!item) return;

      const id = item.getAttribute('data-id');
      if (state.selectedBeneficiariesInGroupModal.has(id)) {
        state.selectedBeneficiariesInGroupModal.delete(id);
      } else {
        state.selectedBeneficiariesInGroupModal.add(id);
      }

      renderGroupModalDropdown();
    });
  }

  // 5. Custom Group dropdown selector inside "Add beneficiary" modal
  let selectedGroupInBenefModal = '';
  const renderBenefGroupDropdown = () => {
    if (!benefGroupDropdown) return;

    benefGroupDropdown.innerHTML = `
      <div class="modal-select-dropdown-item ${selectedGroupInBenefModal === '' ? 'is-selected' : ''}" data-value="">
        <div class="modal-select-dropdown-item-right">
          <span class="modal-select-dropdown-item-name">بدون مجموعة</span>
        </div>
      </div>
    ` + state.groups.map(grp => {
      const isSelected = selectedGroupInBenefModal === grp.id;
      return `
        <div class="modal-select-dropdown-item ${isSelected ? 'is-selected' : ''}" data-value="${grp.id}">
          <div class="modal-select-dropdown-item-right">
            <span class="modal-select-dropdown-item-name">${grp.name}</span>
          </div>
        </div>
      `;
    }).join('');

    // Toggle trigger values
    if (!selectedGroupInBenefModal) {
      benefGroupValue.textContent = 'مجموعة المستفيدين';
      benefGroupValue.style.color = '#9ca3af';
    } else {
      const activeGrp = state.groups.find(g => g.id === selectedGroupInBenefModal);
      benefGroupValue.textContent = activeGrp ? activeGrp.name : 'مجموعة المستفيدين';
      benefGroupValue.style.color = '#2f2d3d';
    }
  };

  if (benefGroupTrigger) {
    benefGroupTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = benefGroupDropdown.style.display === 'block';
      benefGroupDropdown.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (benefGroupDropdown) {
    benefGroupDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.modal-select-dropdown-item');
      if (!item) return;

      selectedGroupInBenefModal = item.getAttribute('data-value');
      renderBenefGroupDropdown();
      benefGroupDropdown.style.display = 'none';
    });
  }

  // Save new beneficiary
  if (saveBenefBtn) {
    saveBenefBtn.addEventListener('click', () => {
      const name = benefNameInput.value.trim();
      if (!name) return;

      const groupObj = state.groups.find(g => g.id === selectedGroupInBenefModal);
      const newBenef = {
        id: 'benef_' + Date.now(),
        name: name,
        diagnosis: 'صعوبات التعلم',
        ageText: '8 أعوام',
        avatarText: name.substring(0, 5),
        activeGoals: 0,
        masteredGoals: 0,
        isActive: true,
        groupName: groupObj ? groupObj.name : 'أي'
      };

      state.beneficiaries.unshift(newBenef);
      benefNameInput.value = '';
      benefNameInput.closest('.modal-field').classList.remove('has-value');
      selectedGroupInBenefModal = '';
      
      const modal = document.getElementById('beneficiary-modal');
      modal.classList.remove('is-open');
      syncBodyModalState();
      renderPage();
    });
  }

  // Save new group
  if (saveGroupBtn) {
    saveGroupBtn.addEventListener('click', () => {
      const name = groupNameInput.value.trim();
      if (!name) return;

      const newGrp = {
        id: 'grp_' + Date.now(),
        name: name,
        beneficiaries: Array.from(state.selectedBeneficiariesInGroupModal)
      };

      state.groups.push(newGrp);
      
      // Update each selected beneficiary groupName
      state.beneficiaries.forEach(benef => {
        if (state.selectedBeneficiariesInGroupModal.has(benef.id)) {
          benef.groupName = name;
        }
      });

      groupNameInput.value = '';
      groupNameInput.closest('.modal-field').classList.remove('has-value');
      state.selectedBeneficiariesInGroupModal.clear();

      const modal = document.getElementById('group-modal');
      modal.classList.remove('is-open');
      syncBodyModalState();
      renderPage();
    });
  }

  // Close dropdowns on document click
  document.addEventListener('click', () => {
    if (groupSelectDropdown) groupSelectDropdown.style.display = 'none';
    if (benefGroupDropdown) benefGroupDropdown.style.display = 'none';
  });

  // 6. Interactive Dropdown filters (Diagnosis, Age, Group, Sort)
  document.querySelectorAll('.filter-box').forEach(box => {
    const trigger = box.querySelector('.filter-trigger');
    const dropdown = box.querySelector('.filter-dropdown');
    const valueNode = box.querySelector('.filter-value');
    const filterKey = box.getAttribute('data-filter');

    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close other dropdowns first
        document.querySelectorAll('.filter-dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('is-open');
        });
        box.parentElement.querySelectorAll('.filter-box').forEach(b => {
          if (b !== box) b.classList.remove('is-open');
        });

        const isOpen = dropdown.classList.contains('is-open');
        dropdown.classList.toggle('is-open', !isOpen);
        box.classList.toggle('is-open', !isOpen);
      });
    }

    if (dropdown) {
      dropdown.addEventListener('click', (e) => {
        const item = e.target.closest('.filter-dropdown-item');
        if (!item) return;

        const val = item.getAttribute('data-value') || item.textContent.trim();
        valueNode.textContent = val;
        state.filters[filterKey] = val;

        dropdown.querySelectorAll('.filter-dropdown-item').forEach(btn => {
          btn.classList.toggle('is-active', btn === item);
        });

        dropdown.classList.remove('is-open');
        box.classList.remove('is-open');
        
        renderPage();
      });
    }
  });

  // Close filter dropdowns on clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-box')) {
      document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('is-open'));
      document.querySelectorAll('.filter-box').forEach(b => b.classList.remove('is-open'));
    }
  });

  // 7. Dynamic tab switching
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const tabButton = e.target.closest('[data-tab]');
      if (!tabButton) return;

      tabsContainer.querySelectorAll('[data-tab]').forEach(btn => {
        btn.className = 'tab-plain';
      });
      tabButton.className = 'tab-pill is-active';

      state.activeTab = tabButton.getAttribute('data-tab');
      renderPage();
    });
  }

  // 8. Search input filter handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderPage();
    });
  }

  // 9. Main rendering engine
  const renderPage = () => {
    let list = [];

    if (state.activeTab === 'groups') {
      // Hide search and filter row for groups tab
      document.querySelector('.search-row').style.display = 'none';
      document.querySelector('.beneficiaries-filters').style.display = 'none';

      // Render group items in a clean table/list row view matching screenshot
      const rowsHtml = state.groups.map(grp => {
        const count = grp.beneficiaries.length;
        return `
          <div class="group-list-row">
            <div class="group-row-name">${grp.name}</div>
            <div class="group-row-left">
              <span class="group-row-count">${count}</span>
              <button class="group-row-kebab" data-kebab-id="${grp.id}" type="button">⋮</button>
            </div>
          </div>
        `;
      }).join('');

      canvasContainer.innerHTML = `
        <div class="groups-list-container">
          <div class="groups-header-row">
            <div class="groups-header-title">اسم المجموعة</div>
            <div class="groups-header-count">المستفيدين</div>
          </div>
          ${rowsHtml}
        </div>
      `;

      if (resultsInfo) resultsInfo.textContent = `عرض 1 إلى ${state.groups.length} من أصل ${state.groups.length} مجموعات`;
      return;
    }

    // Show search and filters for Active/Disabled tabs
    document.querySelector('.search-row').style.display = 'block';
    document.querySelector('.beneficiaries-filters').style.display = 'grid';

    // Filter beneficiaries by Active/Disabled state
    list = state.beneficiaries.filter(b => {
      const isTabMatch = state.activeTab === 'active' ? b.isActive : !b.isActive;
      
      // Search matches
      const isSearchMatch = !state.searchQuery || 
        b.name.toLowerCase().includes(state.searchQuery) ||
        b.diagnosis.toLowerCase().includes(state.searchQuery);

      // Filter matches
      const isDiagMatch = state.filters.diagnosis === 'أي' || b.diagnosis === state.filters.diagnosis;
      const isGroupMatch = state.filters.group === 'أي' || b.groupName === state.filters.group;
      
      // Age category matches
      let isAgeMatch = true;
      if (state.filters.age !== 'أي') {
        const numAge = parseInt(b.ageText);
        if (state.filters.age === 'أقل من 6 سنوات') isAgeMatch = numAge < 6;
        else if (state.filters.age === '6 - 12 سنة') isAgeMatch = numAge >= 6 && numAge <= 12;
        else if (state.filters.age === 'أكبر من 12 سنة') isAgeMatch = numAge > 12;
      }

      return isTabMatch && isSearchMatch && isDiagMatch && isGroupMatch && isAgeMatch;
    });

    // Handle Sort
    if (state.filters.sort === 'أ - ي') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    } else if (state.filters.sort === 'ي - أ') {
      list.sort((a, b) => b.name.localeCompare(a.name, 'ar'));
    }

    // Generate beneficiary cards first
    let html = list.map(benef => {
      return `
        <article class="entity-card entity-card--beneficiary">
          <div class="entity-card-head">
            <div class="card-kebab" data-kebab-id="${benef.id}"><span></span><span></span><span></span></div>
            <div class="entity-chip">${benef.groupName || 'أي'}</div>
          </div>
          <div class="entity-card-body">
            <div class="entity-profile entity-profile--beneficiary">
              <div class="entity-copy">
                <h3>${benef.name}</h3>
                <p class="entity-accent">${benef.diagnosis}</p>
                <p class="entity-meta">${benef.ageText}</p>
              </div>
              <div class="entity-avatar">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke="#7C87AF" stroke-width="1.6" stroke-linecap="round"/></svg>
              </div>
            </div>
            <p class="entity-section-label">الأعضاء</p>
            <div class="entity-members">
              <button class="entity-add-mini" type="button">+</button>
              <div class="entity-mini-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1" stroke="#7C87AF" stroke-width="1.6" stroke-linecap="round"/></svg>
              </div>
            </div>
          </div>
          <div class="entity-card-footer">
            <div><strong>${benef.activeGoals}</strong><span>الأهداف النشطة</span></div>
            <div><strong>${benef.masteredGoals}</strong><span>الأهداف المتقنة</span></div>
          </div>
        </article>
      `;
    }).join('');

    // Append the dotted "Add Beneficiary" card at the end of the list
    html += `
      <article class="add-card add-card--beneficiary" data-open-modal="beneficiary-modal">
        <div class="add-card-inner">
          <div class="plus-ring">+</div>
          <div>اضافة مستفيد جديد</div>
        </div>
      </article>
    `;

    canvasContainer.innerHTML = html;

    // Hook newly generated modal togglers
    canvasContainer.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-open-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('is-open');
          syncBodyModalState();
        }
      });
    });

    if (resultsInfo) {
      resultsInfo.textContent = `عرض 1 إلى ${list.length} من أصل ${list.length} مدخلات`;
    }
  };

  // 10. Kickoff first load
  renderPage();
})();
