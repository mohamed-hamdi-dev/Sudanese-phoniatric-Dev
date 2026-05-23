(function () {
  const MEMBERS_STORAGE_KEY = 'sp_members';
  const DEFAULT_MEMBER = {
    id: 476800,
    name: 'MRS AMA SIDDIQ',
    email: 'sudanesemedia2026@gmail.com',
    role: 'مالك الحساب',
    roleKey: 'owner',
    joinedOn: '2 مايو 2024',
    status: 'active',
    beneficiaryScope: 'all'
  };

  const page = document.querySelector('.members-page');
  const grid = document.querySelector('[data-members-grid]');
  const templateCard = document.querySelector('[data-member-card-template]');
  const addCard = document.querySelector('.add-card[data-add-member-trigger]');
  const searchInput = document.querySelector('[data-members-search]');
  const resultsNode = document.querySelector('[data-members-results]');
  const paginationBar = document.querySelector('[data-members-pagination]');
  const pageSizeButton = document.querySelector('[data-members-page-size]');
  const emptyState = document.querySelector('[data-members-empty]');

  if (!page || !grid || !templateCard || !addCard) return;

  const state = {
    search: '',
    sort: 'any',
    status: 'any',
    page: 1,
    pageSize: 12
  };

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function normalizeAny(value) {
    const text = normalizeText(value);
    if (!text || text === 'أي' || text === 'أيّ') return 'any';
    return text;
  }

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

  function ensureSeedMember() {
    const members = readMembers();
    if (!members.length) {
      writeMembers([DEFAULT_MEMBER]);
      return [DEFAULT_MEMBER];
    }
    return members.map((member) => ({
      status: member.status || 'active',
      ...member
    }));
  }

  function getFilterValue(labelText) {
    const box = Array.from(page.querySelectorAll('.filter-box')).find((node) => {
      return normalizeText(node.querySelector('.filter-label')?.textContent) === labelText;
    });
    return normalizeText(box?.querySelector('.filter-value')?.textContent);
  }

  function readFiltersFromUi() {
    state.search = normalizeText(searchInput?.value || '').toLowerCase();
    state.sort = normalizeAny(getFilterValue('الدور'));
    state.status = normalizeAny(getFilterValue('الحالة'));
  }

  function sortMembers(list) {
    const copy = list.slice();
    if (state.sort === 'أ - ي') {
      copy.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name), 'ar'));
    } else if (state.sort === 'ي - أ') {
      copy.sort((a, b) => normalizeText(b.name).localeCompare(normalizeText(a.name), 'ar'));
    }
    return copy;
  }

  function filterMembers(members) {
    return members.filter((member) => {
      const haystack = [
        member.name,
        member.email,
        member.role,
        String(member.id)
      ]
        .join(' ')
        .toLowerCase();

      if (state.search && !haystack.includes(state.search)) {
        return false;
      }

      const memberStatus = member.status === 'inactive' ? 'inactive' : 'active';
      if (state.status === 'مفعل' || state.status === 'مفعلّ') {
        return memberStatus === 'active';
      }
      if (state.status === 'غير مفعل' || state.status === 'غير مفعلّ') {
        return memberStatus === 'inactive';
      }

      return true;
    });
  }

  function paginateMembers(members) {
    const total = members.length;
    const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;
    if (state.page < 1) state.page = 1;

    const startIndex = (state.page - 1) * state.pageSize;
    const endIndex = Math.min(startIndex + state.pageSize, total);

    return {
      total,
      totalPages,
      startIndex,
      endIndex,
      items: members.slice(startIndex, endIndex)
    };
  }

  function updateResultsText(meta) {
    if (!resultsNode) return;
    if (!meta.total) {
      resultsNode.textContent = 'عرض 0 إلى 0 من أصل 0 مدخلات';
      return;
    }
    resultsNode.textContent = `عرض ${meta.startIndex + 1} إلى ${meta.endIndex} من أصل ${meta.total} مدخلات`;
  }

  function renderPagination(meta) {
    if (!paginationBar) return;
    paginationBar.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'members-pagination-btn';
    prevBtn.setAttribute('aria-label', 'السابق');
    prevBtn.disabled = state.page <= 1;
    prevBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="m10.5 4.5-4.5 4.5 4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    prevBtn.addEventListener('click', () => {
      state.page -= 1;
      renderMembers();
    });

    const current = document.createElement('span');
    current.className = 'members-pagination-current';
    current.textContent = String(state.page);

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'members-pagination-btn';
    nextBtn.setAttribute('aria-label', 'التالي');
    nextBtn.disabled = state.page >= meta.totalPages;
    nextBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="m7.5 4.5 4.5 4.5-4.5 4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    nextBtn.addEventListener('click', () => {
      state.page += 1;
      renderMembers();
    });

    paginationBar.append(prevBtn, current, nextBtn);
  }

  function createMemberCard(memberData) {
    const nextCard = templateCard.cloneNode(true);
    nextCard.removeAttribute('data-member-card-template');
    nextCard.hidden = false;
    nextCard.setAttribute('role', 'link');
    nextCard.setAttribute('tabindex', '0');
    nextCard.dataset.memberId = String(memberData.id);
    nextCard.dataset.memberStatus = memberData.status === 'inactive' ? 'inactive' : 'active';

    const idNode = nextCard.querySelector('.entity-id-muted');
    const dateNode = nextCard.querySelector('[data-member-date]');
    const nameNode = nextCard.querySelector('h3');
    const emailNode = nextCard.querySelector('.entity-meta--ltr');
    const roleNode = nextCard.querySelector('.entity-role-pill');
    const footerBtn = nextCard.querySelector('[data-member-beneficiaries]');

    if (idNode) idNode.textContent = '#' + memberData.id;
    if (dateNode) {
      dateNode.textContent = memberData.joinedOn.startsWith('من')
        ? memberData.joinedOn
        : 'منذ ' + memberData.joinedOn;
    }
    if (nameNode) nameNode.textContent = memberData.name;
    if (emailNode) emailNode.textContent = memberData.email;
    if (roleNode) roleNode.textContent = memberData.role;

    const starNode = nextCard.querySelector('.entity-avatar-star');
    if (starNode) {
      starNode.hidden = memberData.roleKey !== 'owner';
    }

    if (footerBtn) {
      footerBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        window.location.href = './beneficiaries.html';
      });
    }

    const kebab = nextCard.querySelector('.card-kebab');
    if (kebab) {
      kebab.addEventListener('click', (event) => event.stopPropagation());
    }

    nextCard.addEventListener('click', () => {
      window.location.href = './edit-member.html?id=' + encodeURIComponent(memberData.id);
    });
    nextCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.location.href = './edit-member.html?id=' + encodeURIComponent(memberData.id);
      }
    });

    return nextCard;
  }

  function clearMemberCards() {
    grid.querySelectorAll('[data-member-id]').forEach((card) => card.remove());
  }

  function renderMembers() {
    readFiltersFromUi();
    const allMembers = sortMembers(filterMembers(ensureSeedMember()));
    const meta = paginateMembers(allMembers);

    clearMemberCards();

    if (emptyState) {
      emptyState.hidden = meta.total > 0;
    }

    meta.items.forEach((member) => {
      grid.insertBefore(createMemberCard(member), addCard);
    });

    updateResultsText(meta);
    renderPagination(meta);
  }

  function bindSearch() {
    searchInput?.addEventListener('input', () => {
      state.page = 1;
      renderMembers();
    });
  }

  function bindFilters() {
    page.querySelectorAll('.filter-dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        window.setTimeout(() => {
          state.page = 1;
          renderMembers();
        }, 0);
      });
    });
  }

  function bindAddTriggers() {
    document.querySelectorAll('[data-add-member-trigger]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        window.location.href = './add-member.html';
      });
    });
  }

  function bindPageSize() {
    if (!pageSizeButton) return;

    const pageSizeValueNode = pageSizeButton.querySelector('span');
    const pageSizeOptions = ['10', '12', '20', '50'];
    const menu = document.createElement('div');
    menu.className = 'filter-dropdown members-page-size-menu';
    menu.setAttribute('aria-hidden', 'true');

    pageSizeOptions.forEach((size) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'filter-dropdown-item';
      option.textContent = size;
      if (size === String(state.pageSize)) option.classList.add('is-active');

      option.addEventListener('click', (event) => {
        event.preventDefault();
        state.pageSize = Number(size);
        state.page = 1;
        if (pageSizeValueNode) pageSizeValueNode.textContent = size;
        menu.querySelectorAll('.filter-dropdown-item').forEach((btn) => {
          btn.classList.toggle('is-active', btn === option);
        });
        closeMenu();
        renderMembers();
      });

      menu.appendChild(option);
    });

    pageSizeButton.parentElement?.appendChild(menu);

    function closeMenu() {
      pageSizeButton.classList.remove('is-open');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      pageSizeButton.setAttribute('aria-expanded', 'false');
    }

    pageSizeButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !menu.classList.contains('is-open');
      closeMenu();
      if (willOpen) {
        pageSizeButton.classList.add('is-open');
        menu.classList.add('is-open');
        menu.setAttribute('aria-hidden', 'false');
        pageSizeButton.setAttribute('aria-expanded', 'true');
      }
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !pageSizeButton.contains(event.target)) {
        closeMenu();
      }
    });
  }

  templateCard.hidden = true;
  bindSearch();
  bindFilters();
  bindAddTriggers();
  bindPageSize();
  renderMembers();
})();
