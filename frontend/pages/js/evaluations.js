(function(){
  let currentView = 'list';
  let activeTab = 'active';
  let activeStructureTab = 'answers';
  let activeEvalId = EvalStorage.getActiveEvaluationId();
  let diagnosisPicker, beneficiaryPicker, startBeneficiaryPicker, editDiagnosisPicker;
  let activeSideId = null;
  let expandedSideId = null;
  const NO_EXPANDED_SIDE = '__none__';
  const NO_OPEN_GOAL_NODE = '__none__';
  const activeItemTabs = new Map();
  let showAddSideForm = false;
  let showAddItemForm = false;
  let activeSideMenuId = null;
  let currentPage = 1;
  let pageSize = 10;
  const sectionInput = document.querySelector('[name="section_title"]');
  const sectionInlineForm = document.querySelector('[data-add-section-form]');
  const sectionsRoot = document.querySelector('[data-sections-root]');
  const structureEmptyNote = document.querySelector('.structure-empty-note');
  const addItemForm = document.querySelector('[data-add-item-form]');
  const addItemModal = document.getElementById('add-item-modal');
  const activeSideNameNode = document.querySelector('[data-active-side-name]');
  const optionsRoot = document.querySelector('[data-options-root]');
  const itemOptionsField = document.querySelector('[data-item-options-field]');
  const startEvaluationTitle = document.querySelector('[data-start-eval-title]');
  const startBeneficiarySelect = document.querySelector('[data-start-beneficiary-select]');
  const editSideEvalTitleInput = document.querySelector('[name="edit_side_eval_title"]');
  const editSideTitleInput = document.querySelector('[name="edit_side_title"]');
  const suggestedGoalsState = {
    activeRow: null,
    openAspectId: null,
    openLongGoalId: null
  };

  const views = Array.from(document.querySelectorAll('[data-view]'));
  const listRoot = document.querySelector('[data-evaluations-list]');
  const archivedRoot = document.querySelector('[data-archived-list]');
  const searchInput = document.querySelector('[data-evals-search]');
  const evaluationsPager = document.querySelector('[data-evaluations-pager]');

  function updatePager(totalItems){
    if (!evaluationsPager) return;

    const currentNode = evaluationsPager.querySelector('.evaluations-pagination-current');
    const resultsNode = evaluationsPager.querySelector('.evaluations-results');
    const prevButton = evaluationsPager.querySelector('.evaluations-pagination-btn[aria-label="السابق"]');
    const nextButton = evaluationsPager.querySelector('.evaluations-pagination-btn[aria-label="التالي"]');
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    evaluationsPager.hidden = totalItems <= pageSize;

    const start = totalItems ? ((currentPage - 1) * pageSize) + 1 : 0;
    const end = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

    if (currentNode) {
      currentNode.textContent = String(currentPage);
    }

    if (resultsNode) {
      resultsNode.textContent = `عرض ${start} إلى ${end} من أصل ${totalItems} مدخلات`;
    }

    if (prevButton) {
      prevButton.disabled = currentPage <= 1;
      prevButton.setAttribute('aria-disabled', currentPage <= 1 ? 'true' : 'false');
      prevButton.hidden = totalPages <= 1;
    }

    if (nextButton) {
      nextButton.disabled = currentPage >= totalPages;
      nextButton.setAttribute('aria-disabled', currentPage >= totalPages ? 'true' : 'false');
      nextButton.hidden = totalPages <= 1;
    }

    if (currentNode) {
      currentNode.hidden = totalPages <= 1;
    }
  }

  function closeAllCardMenus(){
    document.querySelectorAll('[data-card-menu]').forEach((m)=>{
      m.hidden = true;
      m.classList.remove('open-upward');
    });
    document.querySelectorAll('[data-card-menu-toggle]').forEach((b)=>b.setAttribute('aria-expanded', 'false'));
  }

  function openStructureFor(id){
    activeEvalId = id;
    EvalStorage.setActiveEvaluationId(activeEvalId);
    setView('structure');
  }

  function openViewFor(id){
    activeEvalId = id;
    EvalStorage.setActiveEvaluationId(activeEvalId);
    setView('view');
  }

  function openStartEvaluationModal(id){
    const evaluation = EvalStorage.getEvaluation(id);
    if (!evaluation) return;
    activeEvalId = id;
    EvalStorage.setActiveEvaluationId(activeEvalId);
    if (startEvaluationTitle) {
      startEvaluationTitle.textContent = evaluation.title || 'ج3';
    }
    if (startBeneficiaryPicker) {
      const currentBeneficiary = evaluation.beneficiaries?.[0] || '';
      startBeneficiaryPicker.selected = new Set(currentBeneficiary ? [currentBeneficiary] : []);
      startBeneficiaryPicker.search.value = '';
      startBeneficiaryPicker.drawList('');
      startBeneficiaryPicker.refreshTags();
      startBeneficiaryPicker.root.classList.remove('is-open');
      startBeneficiaryPicker.panel.hidden = true;
    }
    FlowModal.open('start-evaluation-modal');
  }

  function openAssignBeneficiariesModal(id){
    const evaluation = EvalStorage.getEvaluation(id);
    if (!evaluation || !beneficiaryPicker) return;
    activeEvalId = id;
    EvalStorage.setActiveEvaluationId(activeEvalId);
    beneficiaryPicker.selected = new Set(evaluation.beneficiaries || []);
    beneficiaryPicker.search.value = '';
    beneficiaryPicker.drawList('');
    beneficiaryPicker.refreshTags();
    beneficiaryPicker.root.classList.remove('is-open');
    beneficiaryPicker.panel.hidden = true;
    FlowModal.open('assign-beneficiaries-modal');
  }

  function toggleArchiveFor(id){
    const ev = EvalStorage.getEvaluation(id);
    if (!ev) return;
    const nextArchivedState = !ev.archived;
    EvalStorage.archiveEvaluation(ev.id, nextArchivedState);
    activeTab = nextArchivedState ? 'archived' : 'active';
    FlowModal.toast('تم تحديث الحالة');
    renderList();
  }

  function deleteEvaluationById(id){
    EvalStorage.deleteEvaluation(id);
    FlowModal.toast('تم الحذف');
    renderList();
  }

  function bindCardActions(root){
    if (!root) return;

    root.querySelectorAll('[data-card-menu-toggle]').forEach((btn)=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.cardMenuToggle;
        const menu = root.querySelector(`[data-card-menu="${id}"]`) || document.querySelector(`[data-card-menu="${id}"]`);
        if (!menu) return;
        const willOpen = menu.hidden;
        closeAllCardMenus();
        menu.hidden = !willOpen;
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (willOpen) {
          menu.classList.remove('open-upward');
          const rect = menu.getBoundingClientRect();
          const overflowBottom = rect.bottom > (window.innerHeight - 12);
          if (overflowBottom) {
            menu.classList.add('open-upward');
          }
        }
      });
    });

    root.querySelectorAll('[data-edit-id]').forEach((btn)=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        closeAllCardMenus();
        openStructureFor(btn.dataset.editId);
      });
    });

    root.querySelectorAll('[data-assign-id]').forEach((btn)=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        closeAllCardMenus();
        openAssignBeneficiariesModal(btn.dataset.assignId);
      });
    });

    root.querySelectorAll('[data-start-id]').forEach((btn)=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        closeAllCardMenus();
        openStartEvaluationModal(btn.dataset.startId);
      });
    });

    root.querySelectorAll('[data-archive-id]').forEach((btn)=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        closeAllCardMenus();
        toggleArchiveFor(btn.dataset.archiveId);
      });
    });

    root.querySelectorAll('[data-delete-id]').forEach((btn)=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        closeAllCardMenus();
        deleteEvaluationById(btn.dataset.deleteId);
      });
    });
  }

  function escapeHtml(value){
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getSuggestedGoalsTree(){
    const defaultTree = [
      {
        id: 'default-curriculum',
        title: 'منهج التعليم - تعليم خاص',
        aspects: [
          {
            id: 'communication-skills',
            title: 'المهارات المعرفية',
            longGoals: [
              {
                id: 'visual-awareness',
                title: 'تنمية قدرة الإدراك البصري لدى الطفل',
                shortGoals: [
                  'أن يطابق الطفل بين أشكال الأشياء والكلمات المساعدة',
                  'أن يطابق الطفل بين أشكال الحروف أو الأرقام المساعدة',
                  'أن يطابق الطفل ثنائية عناصر أو أكثر بصورة مصغرة مع نموذج الصورة المرسومة في اللوح',
                  'أن يطابق الطفل بين مجموعتين من الأشكال الهندسية المتماثلة'
                ]
              }
            ]
          },
          {
            id: 'social-skills',
            title: 'التكيف الاجتماعي',
            longGoals: [
              {
                id: 'daily-interaction',
                title: 'زيادة التفاعل الاجتماعي داخل المواقف اليومية',
                shortGoals: [
                  'أن ينتظر الطفل دوره أثناء النشاط الجماعي',
                  'أن يشارك الطفل الأدوات مع الزملاء عند الطلب'
                ]
              }
            ]
          },
          {
            id: 'language-skills',
            title: 'المهارات اللغوية',
            longGoals: [
              {
                id: 'expressive-language',
                title: 'تنمية مهارات اللغة التعبيرية',
                shortGoals: (window.MockData?.goals || []).slice(0, 4)
              }
            ]
          }
        ]
      }
    ];

    return defaultTree.map((curriculum)=>({
      ...curriculum,
      aspects: (curriculum.aspects || []).map((aspect)=>({
        ...aspect,
        longGoals: (aspect.longGoals || []).map((longGoal)=>({
          ...longGoal,
          shortGoals: (longGoal.shortGoals || []).map((goal, index)=>(
            typeof goal === 'string'
              ? {
                id: `${longGoal.id || 'long'}-short-${index}`,
                title: goal,
                collectionType: 'المساعدات',
                curriculumTitle: curriculum.title,
                aspectTitle: aspect.title,
                longGoalTitle: longGoal.title
              }
              : {
                id: goal.id || `${longGoal.id || 'long'}-short-${index}`,
                title: goal.title || goal.name || '',
                collectionType: goal.collectionType || 'المساعدات',
                curriculumTitle: curriculum.title,
                aspectTitle: aspect.title,
                longGoalTitle: longGoal.title
              }
          ))
        }))
      }))
    }));
  }

  function readOptionGoals(row){
    try {
      return JSON.parse(row?.dataset.selectedGoals || '[]');
    } catch (_) {
      return [];
    }
  }

  function writeOptionGoals(row, goals){
    if (!row) return;
    row.dataset.selectedGoals = JSON.stringify(goals || []);
    const button = row.querySelector('[data-open-goals-picker]');
    const countNode = button?.querySelector('[data-goals-count]');
    if (countNode) {
      const count = (goals || []).length;
      countNode.textContent = count ? String(count) : '';
      countNode.hidden = !count;
    }
  }

  function closeSuggestedGoalsPanels(){
    document.querySelectorAll('[data-suggested-goals-modal]').forEach((panel)=>panel.remove());
    suggestedGoalsState.activeRow = null;
  }

  function renderSuggestedGoalsPanel(row){
    if (!row) return;
    closeSuggestedGoalsPanels();
    suggestedGoalsState.activeRow = row;
    const tree = getSuggestedGoalsTree();
    const selected = readOptionGoals(row);
    const selectedIds = new Set(selected.map((goal)=>goal.id));
    const firstAspect = tree[0]?.aspects?.[0];
    const firstLongGoal = firstAspect?.longGoals?.[0];
    if (suggestedGoalsState.openAspectId === null) suggestedGoalsState.openAspectId = firstAspect?.id || NO_OPEN_GOAL_NODE;
    if (suggestedGoalsState.openLongGoalId === null) suggestedGoalsState.openLongGoalId = firstLongGoal?.id || NO_OPEN_GOAL_NODE;

    const panel = document.createElement('div');
    panel.className = 'suggested-goals-modal';
    panel.dataset.suggestedGoalsModal = 'true';
    panel.innerHTML = `<div class="suggested-goals-dialog" role="dialog" aria-modal="true" aria-label="اقتراح من المكتبة">
      <button class="suggested-goals-close" type="button" data-close-goals-modal aria-label="إغلاق">×</button>
      <div class="suggested-goals-layout">
        <aside class="suggested-goals-selected">
          <div class="suggested-goals-side-title">الأهداف المحددة</div>
          ${selected.length ? `<div class="suggested-goals-selected-list">
            ${selected.map((goal)=>`<div class="suggested-goals-selected-row">
              <button class="suggested-goals-selected-kebab" type="button" aria-label="خيارات الهدف">
                <span></span><span></span><span></span>
              </button>
              <div class="suggested-goals-selected-text">${escapeHtml(goal.title)}</div>
              <button class="suggested-goals-selected-chevron" type="button" aria-label="فتح الهدف">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>`).join('')}
            <div class="suggested-goals-selected-actions">
              <button class="suggested-goals-add-btn" type="button" data-close-goals-modal>إضافة</button>
              <button class="suggested-goals-cancel-btn" type="button" data-close-goals-modal>إلغاء</button>
            </div>
          </div>` : `<div class="suggested-goals-selected-card">
            <span>${selected.length ? `${selected.length} أهداف محددة` : 'لا يوجد أهداف محددة'}</span>
            <span class="suggested-goals-selected-icon">i</span>
          </div>`}
        </aside>
        <section class="suggested-goals-library">
          <h2>اقتراح من المكتبة</h2>
          <label class="suggested-goals-search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input type="search" placeholder="ابحث الأهداف بالعنوان">
          </label>
          <div class="suggested-goals-tree">
            ${tree.map((curriculum)=>`
              <div class="suggested-goals-curriculum">
                <div class="suggested-goals-curriculum-head">
                  <span>${escapeHtml(curriculum.title)}</span>
                  <span>${(curriculum.aspects || []).length} الجوانب</span>
                </div>
                <div class="suggested-goals-tab-title">الجوانب</div>
                ${(curriculum.aspects || []).map((aspect)=>{
                  const isAspectOpen = suggestedGoalsState.openAspectId === aspect.id;
                  const longGoalsCount = (aspect.longGoals || []).length;
                  const shortGoalsCount = (aspect.longGoals || []).reduce((total, goal)=>total + (goal.shortGoals || []).length, 0);
                  return `<div class="suggested-goals-aspect ${isAspectOpen ? 'is-open' : ''}">
                    <div class="suggested-goals-row suggested-goals-row--aspect">
                      <button class="suggested-goals-toggle ${isAspectOpen ? 'is-open' : ''}" type="button" data-goals-toggle-aspect="${escapeHtml(aspect.id)}" aria-label="فتح أو غلق الجانب">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </button>
                      <span class="suggested-goals-row-title">${escapeHtml(aspect.title)}</span>
                      <span class="suggested-goals-icon" aria-hidden="true">▣</span>
                      <span class="suggested-goals-count">${shortGoalsCount} الأهداف الطويلة</span>
                    </div>
                    ${isAspectOpen ? `<div class="suggested-goals-children">
                      <div class="suggested-goals-section-title">${longGoalsCount} الأهداف الطويلة</div>
                      ${(aspect.longGoals || []).map((longGoal)=>{
                        const isLongOpen = suggestedGoalsState.openLongGoalId === longGoal.id;
                        return `<div class="suggested-goals-long ${isLongOpen ? 'is-open' : ''}">
                          <div class="suggested-goals-row suggested-goals-row--long">
                            <button class="suggested-goals-toggle ${isLongOpen ? 'is-open' : ''}" type="button" data-goals-toggle-long="${escapeHtml(longGoal.id)}" aria-label="فتح أو غلق الهدف الطويل">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </button>
                            <span class="suggested-goals-row-title">${escapeHtml(longGoal.title)}</span>
                            <span class="suggested-goals-icon" aria-hidden="true">▣</span>
                            <span class="suggested-goals-count">${(longGoal.shortGoals || []).length} الأهداف القصيرة</span>
                          </div>
                          ${isLongOpen ? `<div class="suggested-goals-short-list">
                            <div class="suggested-goals-section-title">الأهداف القصيرة</div>
                            ${(longGoal.shortGoals || []).map((goal)=>`
                              <label class="suggested-goals-short">
                                <input type="checkbox" data-suggested-goal="${escapeHtml(goal.id)}" ${selectedIds.has(goal.id) ? 'checked' : ''}>
                                <span>${escapeHtml(goal.title)}</span>
                                <small>${escapeHtml(goal.collectionType)}</small>
                              </label>
                            `).join('')}
                          </div>` : ''}
                        </div>`;
                      }).join('')}
                    </div>` : ''}
                  </div>`;
                }).join('')}
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    </div>`;
    document.body.appendChild(panel);
  }

  function toggleSuggestedGoal(row, goalId, checked){
    const allGoals = getSuggestedGoalsTree()
      .flatMap((curriculum)=>curriculum.aspects || [])
      .flatMap((aspect)=>aspect.longGoals || [])
      .flatMap((longGoal)=>longGoal.shortGoals || []);
    const goal = allGoals.find((item)=>item.id === goalId);
    if (!goal) return;
    const current = readOptionGoals(row).filter((item)=>item.id !== goalId);
    writeOptionGoals(row, checked ? [...current, goal] : current);
    renderSuggestedGoalsPanel(row);
  }

  function buildOptionRow(){
    return `<div class="answer-row-wrapper" data-option-row>
      <div class="answer-inputs-flex">
        <div class="custom-field-box flex-grow">
          <span class="field-label">الاسم <span class="req">*</span></span>
          <input type="text" class="field-input" name="option_label">
        </div>
        <div class="custom-field-box width-fixed">
          <span class="field-label">الوزن <span class="req">*</span></span>
          <input type="number" class="field-input center-text" name="option_score" value="0">
        </div>
        <button class="delete-btn-box" type="button" data-delete-option aria-label="حذف الخيار">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <button class="badge-proposed-goals" type="button" data-open-goals-picker>
        الأهداف المقترحة
        <span data-goals-count hidden></span>
      </button>
    </div>`;
  }

  function resetAddItemForm(){
    addItemForm?.reset();
    if (optionsRoot) {
      optionsRoot.innerHTML = buildOptionRow();
    }
    syncItemTypeFields();
  }

  function syncItemTypeFields(){
    const selectedType = document.querySelector('[name="item_type"]:checked')?.value || 'multiple';
    document.querySelectorAll('.method-card').forEach((card)=>{
      const radio = card.querySelector('[name="item_type"]');
      card.classList.toggle('active', radio?.checked);
    });
    if (itemOptionsField) {
      itemOptionsField.hidden = selectedType !== 'multiple';
    }
  }

  function closeAddItemForm(){
    showAddItemForm = false;
    activeSideNameNode && (activeSideNameNode.textContent = 'غير محدد');
    resetAddItemForm();
    FlowModal.close('add-item-modal');
    renderStructure();
  }

  function resetAddItemModalScroll(){
    window.scrollTo({ top: 0, behavior: 'auto' });
    addItemModal?.scrollTo({ top: 0, behavior: 'auto' });
    addItemModal?.querySelector('.flow-modal-dialog')?.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openAddItemForm(sideId){
    const evaluation = getActiveEval();
    const side = evaluation?.sections.find((section)=>section.id === sideId);
    if (!side) return;
    activeSideId = sideId;
    expandedSideId = sideId;
    showAddItemForm = true;
    activeSideNameNode && (activeSideNameNode.textContent = side.title);
    resetAddItemForm();
    FlowModal.open('add-item-modal');
    resetAddItemModalScroll();
    requestAnimationFrame(resetAddItemModalScroll);
    setTimeout(resetAddItemModalScroll, 80);
    renderStructure();
  }

  function setAddSideFormVisibility(visible){
    showAddSideForm = visible;
    if (sectionInlineForm) {
      sectionInlineForm.hidden = !visible;
      sectionInlineForm.classList.remove('is-invalid');
    }
    if (!visible && sectionInput) {
      sectionInput.value = '';
    }
  }

  function setView(view){
    currentView = view;
    if (view === 'structure') {
      showAddSideForm = false;
      const evaluation = getActiveEval();
      const hasSections = !!evaluation?.sections?.some((section)=>
        section &&
        typeof section.title === 'string' &&
        section.title.trim()
      );
      if (!hasSections) {
        expandedSideId = null;
        activeSideId = null;
      }
    }
    views.forEach((v)=>v.hidden = v.dataset.view !== view);
    if (view === 'structure') renderStructure();
    if (view === 'view') renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function fmtDate(iso){ const d = new Date(iso); return `${d.getDate()} مايو ${d.getFullYear()}`; }

  function syncTabs(){
    document.querySelectorAll('[data-tab]').forEach((b)=>{
      const isActive = b.dataset.tab === activeTab;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    document.querySelector('[data-pane="active"]').hidden = activeTab !== 'active';
    document.querySelector('[data-pane="archived"]').hidden = activeTab !== 'archived';
  }

  function renderList(){
    const q = (searchInput?.value || '').trim();
    const all = EvalStorage.getEvaluations().filter((e)=>e.title.includes(q));
    const active = all.filter((e)=>!e.archived);
    const archived = all.filter((e)=>e.archived);
    const card = (e)=>`<article class="report-card evaluations-report-card">
      <div class="report-card-head">
        <span>${fmtDate(e.createdAt)}</span>
        <button class="card-kebab" type="button" data-card-menu-toggle="${e.id}" aria-expanded="false" aria-label="خيارات التقييم"><span></span><span></span><span></span></button>
        <div class="eval-card-menu" data-card-menu="${e.id}" hidden>
          <button type="button" data-edit-id="${e.id}" class="is-edit">
            <span>تعديل</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m12 6 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button type="button" data-archive-id="${e.id}" class="is-archive">
            <span>${e.archived ? 'إلغاء الأرشفة' : 'أرشفة'}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4h10l1 3H6l1-3Zm0 5h10v9H7V9Zm3 3h4m-4 3h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" data-delete-id="${e.id}" class="is-danger">
            <span>حذف</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </div>
      </div>
      <h3>${e.title}</h3>
      <div class="evaluations-report-badge" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.5 7v-.7A3.8 3.8 0 0 1 11.3 15h1.4a3.8 3.8 0 0 1 3.8 3.8v.7" stroke="#7C87AF" stroke-width="1.6" stroke-linecap="round"/></svg>
      </div>
      <div class="report-card-author">
        <span>${e.owner}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-4.5 7v-.7A3.8 3.8 0 0 1 11.3 15h1.4a3.8 3.8 0 0 1 3.8 3.8v.7" stroke="#C3CAD8" stroke-width="1.6" stroke-linecap="round"/></svg>
      </div>
      <div class="report-card-actions">
        <button class="outline-btn outline-btn--purple" data-assign-id="${e.id}" type="button">تعيين</button>
        <button class="solid-btn green solid-btn--sm" data-start-id="${e.id}" type="button">ابدأ</button>
      </div>
    </article>`;
    const addCard = `<button class="add-card evaluations-add-card" type="button" data-open-view="create">
      <div class="add-card-inner">
        <div class="plus-ring">+</div>
        <div>إنشاء تقييم أو استشارة جديدة</div>
      </div>
    </button>`;

    const activeSource = activeTab === 'active' ? active : archived;
    const totalItems = activeSource.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const pageItems = activeSource.slice(startIndex, startIndex + pageSize);

    listRoot.innerHTML = activeTab === 'active'
      ? (pageItems.length ? `${pageItems.map(card).join('')}${addCard}` : addCard)
      : '';
    archivedRoot.innerHTML = activeTab === 'archived'
      ? (pageItems.length ? pageItems.map(card).join('') : '<div class="empty-note">لا يوجد تقييمات أو استشارات مؤرشفة حتى الآن</div>')
      : '<div class="empty-note">لا يوجد تقييمات أو استشارات مؤرشفة حتى الآن</div>';

    updatePager(totalItems);
    bindCardActions(listRoot);
    bindCardActions(archivedRoot);
    syncTabs();
  }

  function initEvaluationsPager(){
    const pageSizeButton = evaluationsPager?.querySelector('.evaluations-page-size');
    if (!pageSizeButton) return;

    const pageSizeValueNode = pageSizeButton.querySelector('span');
    const pageSizeOptions = ['10', '12', '20', '50', '100'];
    const menu = document.createElement('div');
    menu.className = 'evaluations-page-size-menu';
    menu.setAttribute('aria-hidden', 'true');
    document.body.appendChild(menu);

    const currentValue = (pageSizeValueNode?.textContent || '10').trim();
    pageSizeOptions.forEach((size) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'evaluations-page-size-option';
      option.textContent = size;
      if (size === currentValue) {
        option.classList.add('is-active');
      }

      option.addEventListener('click', (event) => {
        event.preventDefault();
        if (pageSizeValueNode) {
          pageSizeValueNode.textContent = size;
        }
        pageSize = Number(size);
        currentPage = 1;

        menu.querySelectorAll('.evaluations-page-size-option').forEach((btn) => {
          btn.classList.toggle('is-active', btn === option);
        });

        pageSizeButton.classList.remove('is-open');
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        pageSizeButton.setAttribute('aria-expanded', 'false');

        renderList();
      });

      menu.appendChild(option);
    });

    pageSizeButton.setAttribute('aria-haspopup', 'listbox');
    pageSizeButton.setAttribute('aria-expanded', 'false');

    function positionMenu() {
      const rect = pageSizeButton.getBoundingClientRect();
      const menuWidth = 84;
      const gap = 8;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const left = Math.min(
        viewportWidth - menuWidth - 12,
        Math.max(12, rect.right - menuWidth)
      );
      const top = Math.min(rect.bottom + gap, viewportHeight - 12);

      menu.style.position = 'fixed';
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
      menu.style.maxHeight = `${Math.max(120, viewportHeight - top - 12)}px`;
    }

    function closeMenu() {
      pageSizeButton.classList.remove('is-open');
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      pageSizeButton.setAttribute('aria-expanded', 'false');
      menu.style.top = '';
      menu.style.left = '';
      menu.style.maxHeight = '';
    }

    pageSizeButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const willOpen = !menu.classList.contains('is-open');
      closeMenu();
      if (willOpen) {
        positionMenu();
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

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (menu.classList.contains('is-open')) {
        positionMenu();
      }
    });

    window.addEventListener('scroll', () => {
      if (menu.classList.contains('is-open')) {
        positionMenu();
      }
    }, { passive: true });

    const prevButton = evaluationsPager.querySelector('.evaluations-pagination-btn[aria-label="السابق"]');
    const nextButton = evaluationsPager.querySelector('.evaluations-pagination-btn[aria-label="التالي"]');

    prevButton?.addEventListener('click', () => {
      if (currentPage <= 1) return;
      currentPage -= 1;
      renderList();
    });

    nextButton?.addEventListener('click', () => {
      const q = (searchInput?.value || '').trim();
      const totalItems = EvalStorage.getEvaluations()
        .filter((e)=>e.title.includes(q))
        .filter((e)=> activeTab === 'active' ? !e.archived : e.archived).length;
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      if (currentPage >= totalPages) return;
      currentPage += 1;
      renderList();
    });
  }

  function getActiveEval(){ return EvalStorage.getEvaluation(activeEvalId || EvalStorage.getActiveEvaluationId()); }

  function renderStructure(){
    const evaluation = getActiveEval(); if (!evaluation) return setView('list');
    const validSections = (evaluation.sections || []).filter((section)=>
      section &&
      typeof section.title === 'string' &&
      section.title.trim()
    );

    document.querySelector('[data-eval-title]').textContent = evaluation.title || 'ج3';
    document.querySelector('[data-eval-diagnosis]').textContent = evaluation.diagnosis[0] || 'اضطراب النطق';
    document.querySelector('[data-eval-beneficiary]').textContent = evaluation.beneficiaries[0] || 'MRS AMA SIDDIQ';

    document.querySelectorAll('[data-structure-tab]').forEach((btn)=>{
      const isActive = btn.dataset.structureTab === activeStructureTab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    document.querySelectorAll('[data-structure-pane]').forEach((pane)=>{
      pane.hidden = pane.dataset.structurePane !== activeStructureTab;
    });

    if (sectionInlineForm) {
      sectionInlineForm.hidden = !showAddSideForm || activeStructureTab !== 'answers';
      sectionInlineForm.classList.toggle('is-invalid', false);
    }

    if (structureEmptyNote) {
      structureEmptyNote.hidden = activeStructureTab !== 'answers' || validSections.length > 0;
    }

    const isAnswersTab = activeStructureTab === 'answers';
    if (isAnswersTab && validSections.length > 0) {
      const hasValidExpanded = validSections.some((section)=>section.id === expandedSideId);
      if (!hasValidExpanded && expandedSideId !== NO_EXPANDED_SIDE) {
        expandedSideId = validSections[0].id;
      }
    } else {
      expandedSideId = null;
    }
    sectionsRoot.hidden = !isAnswersTab || validSections.length === 0;
    sectionsRoot.innerHTML = validSections.map((section)=>{
      const isExpanded = expandedSideId === section.id;
      const isItemFormOpen = showAddItemForm && activeSideId === section.id;
      const hasItems = section.items.length > 0;
      const activeItemTab = activeItemTabs.get(section.id) || 'items';

      return `<article class="structure-row-block${isExpanded ? ' is-expanded' : ''}">
        <div class="aspect-row-container">
          <div class="${isExpanded ? 'aspect-dark-bar' : 'aspect-light-bar'}">
            <div class="aspect-info-right">
              <div class="aspect-icon-circle" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="6" y="4" width="12" height="16" rx="2"></rect>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                </svg>
              </div>
              <span class="aspect-title-text">${section.title}</span>
            </div>
            <button class="aspect-actions-left" type="button" data-side-menu-toggle="${section.id}" aria-label="خيارات الجانب" aria-expanded="${activeSideMenuId === section.id ? 'true' : 'false'}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="5" r="1.5" fill="currentColor"></circle>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"></circle>
                <circle cx="12" cy="19" r="1.5" fill="currentColor"></circle>
              </svg>
            </button>
            <div class="side-actions-menu${activeSideMenuId === section.id ? ' is-open' : ''}" data-side-menu="${section.id}">
              <button type="button" data-side-archive="${section.id}">
                <span>أرشفة</span>
              </button>
              <button type="button" data-side-edit="${section.id}">
                <span>تعديل الجانب</span>
              </button>
              <button type="button" data-delete-section="${section.id}" class="is-danger">
                <span>حذف</span>
              </button>
              <button type="button" data-add-item="${section.id}" class="is-add-item">
                <span>بند جديد</span>
              </button>
            </div>
          </div>
          <button class="toggle-collapse-btn${isExpanded ? '' : ' closed'}" type="button" data-toggle-side="${section.id}" aria-label="${isExpanded ? 'طي الجانب' : 'فتح الجانب'}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="${isExpanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline>
            </svg>
          </button>
        </div>
        ${isExpanded ? `<div class="aspect-details-area">
          <div class="tabs-header-row aspect-inner-tabs">
            <div class="tabs-group">
              <button class="tab-button ${activeItemTab === 'items' ? 'active' : ''}" type="button" data-item-tab="${section.id}:items">البنود</button>
              <button class="tab-button ${activeItemTab === 'archived' ? 'active' : ''}" type="button" data-item-tab="${section.id}:archived">مؤرشف</button>
            </div>
            <button class="btn-green-rounded" type="button" data-add-item="${section.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              أضف بند جديد
            </button>
          </div>
          ${activeItemTab === 'archived' ? `<div class="warning-empty-state warning-empty-state--archived">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>لا يوجد بنود مؤرشفة</span>
          </div>` : (hasItems ? `<div class="items-list">${section.items.map((item)=>`<article class="item-row"><strong>${item.title}</strong><span>${item.type === 'multiple' ? 'اختيار متعدد' : 'مفتوح'}</span><button class="outline-btn" type="button" data-delete-item="${section.id}:${item.id}">حذف</button></article>`).join('')}</div>` : (!isItemFormOpen ? `<div class="warning-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>أنشئ بند جديد</span>
          </div>` : ''))}
        </div>` : ''}
      </article>`;
    }).join('');

    document.querySelector('[name="edit_title"]').value = evaluation.title || '';
    document.querySelector('[name="edit_description"]').value = evaluation.description || '';
  }

  function renderView(){
    const evaluation = getActiveEval(); if (!evaluation) return setView('list');
    const beneficiary = evaluation.beneficiaries[0] || 'MRS AMA SIDDIG';
    const responses = EvalStorage.getResponses(evaluation.id, beneficiary);
    document.querySelector('[data-view-title]').textContent = evaluation.title;
    document.querySelector('[data-view-diagnosis]').textContent = evaluation.diagnosis[0] || 'بدون تشخيص';
    document.querySelector('[data-view-beneficiary]').textContent = beneficiary;
    const root = document.querySelector('[data-view-sections]');
    root.innerHTML = evaluation.sections.map((s)=>`<section class="flow-card"><h3>${s.title}</h3>${s.items.map((item)=>item.type==='multiple'?`<div class="view-item"><h4>${item.title}</h4>${(item.options||[]).map((opt)=>`<label class="choice"><input type="radio" name="${item.id}" value="${opt.label}" ${responses[item.id]===opt.label?'checked':''}> <span>${opt.label}</span></label>`).join('')}</div>`:`<div class="view-item"><h4>${item.title}</h4><textarea class="evaluations-textarea" data-open-answer="${item.id}">${responses[item.id]||''}</textarea></div>`).join('')}</section>`).join('') || '<div class="empty-warning">لا يوجد بنود</div>';

    const allItems = evaluation.sections.flatMap((s)=>s.items);
    const answered = allItems.filter((i)=>responses[i.id]).length;
    document.querySelector('[data-progress]').textContent = allItems.length ? `${Math.round((answered/allItems.length)*100)}%` : '0%';
  }

  document.addEventListener('click', (e)=>{
    if (e.target.closest('[data-close-goals-modal]') || e.target.matches('[data-suggested-goals-modal]')) {
      closeSuggestedGoalsPanels();
      return;
    }

    const aspectGoalsToggle = e.target.closest('[data-goals-toggle-aspect]');
    if (aspectGoalsToggle) {
      suggestedGoalsState.openAspectId = suggestedGoalsState.openAspectId === aspectGoalsToggle.dataset.goalsToggleAspect
        ? NO_OPEN_GOAL_NODE
        : aspectGoalsToggle.dataset.goalsToggleAspect;
      suggestedGoalsState.openLongGoalId = NO_OPEN_GOAL_NODE;
      renderSuggestedGoalsPanel(suggestedGoalsState.activeRow);
      return;
    }

    const longGoalsToggle = e.target.closest('[data-goals-toggle-long]');
    if (longGoalsToggle) {
      suggestedGoalsState.openLongGoalId = suggestedGoalsState.openLongGoalId === longGoalsToggle.dataset.goalsToggleLong
        ? NO_OPEN_GOAL_NODE
        : longGoalsToggle.dataset.goalsToggleLong;
      renderSuggestedGoalsPanel(suggestedGoalsState.activeRow);
      return;
    }

    if (!e.target.closest('[data-side-menu]') && !e.target.closest('[data-side-menu-toggle]')) {
      activeSideMenuId = null;
    }
    if (!e.target.closest('[data-card-menu]')) {
      closeAllCardMenus();
    }

    const openView = e.target.closest('[data-open-view]');
    if (openView) { setView(openView.dataset.openView); return; }

    const stTab = e.target.closest('[data-structure-tab]');
    if (stTab) { activeStructureTab = stTab.dataset.structureTab; renderStructure(); return; }

    const showInline = e.target.closest('[data-show-add-section]');
    if (showInline) {
      setAddSideFormVisibility(true);
      sectionInput?.focus();
      return;
    }
    if (e.target.closest('[data-cancel-add-section]')) {
      setAddSideFormVisibility(false);
      renderStructure();
      return;
    }

    const toggleSide = e.target.closest('[data-toggle-side]');
    if (toggleSide) {
      const sideId = toggleSide.dataset.toggleSide;
      const wasExpanded = expandedSideId === sideId;
      expandedSideId = wasExpanded ? NO_EXPANDED_SIDE : sideId;
      activeSideMenuId = null;
      if (wasExpanded && activeSideId === sideId && showAddItemForm) {
        closeAddItemForm();
        return;
      }
      renderStructure();
      return;
    }

    const itemTab = e.target.closest('[data-item-tab]');
    if (itemTab) {
      const [sideId, tab] = itemTab.dataset.itemTab.split(':');
      activeItemTabs.set(sideId, tab === 'archived' ? 'archived' : 'items');
      renderStructure();
      return;
    }

    const toggleSideMenu = e.target.closest('[data-side-menu-toggle]');
    if (toggleSideMenu) {
      const sideId = toggleSideMenu.dataset.sideMenuToggle;
      activeSideMenuId = activeSideMenuId === sideId ? null : sideId;
      renderStructure();
      return;
    }

    const archiveSide = e.target.closest('[data-side-archive]');
    if (archiveSide) {
      activeSideMenuId = null;
      FlowModal.toast('تمت الأرشفة');
      renderStructure();
      return;
    }

    const editSide = e.target.closest('[data-side-edit]');
    if (editSide) {
      const sideId = editSide.dataset.sideEdit;
      const evaluation = getActiveEval();
      const side = evaluation?.sections?.find((section) => section.id === sideId);
      if (!evaluation || !side) return;
      activeSideId = sideId;
      if (editSideEvalTitleInput) editSideEvalTitleInput.value = evaluation.title || '';
      if (editSideTitleInput) editSideTitleInput.value = side.title || '';
      activeSideMenuId = null;
      FlowModal.open('edit-side-modal');
      renderStructure();
      return;
    }

    const addItem = e.target.closest('[data-add-item]');
    if (addItem) {
      activeSideMenuId = null;
      openAddItemForm(addItem.dataset.addItem);
      return;
    }

    if (e.target.closest('[data-close-modal="add-item-modal"]')) {
      closeAddItemForm();
      return;
    }

    if (e.target.closest('[data-close-modal="start-evaluation-modal"]')) {
      FlowModal.close('start-evaluation-modal');
      return;
    }

    const modalBackdrop = e.target.closest('#add-item-modal.flow-modal');
    if (modalBackdrop && e.target === modalBackdrop) {
      closeAddItemForm();
      return;
    }

    const startModalBackdrop = e.target.closest('#start-evaluation-modal.flow-modal');
    if (startModalBackdrop && e.target === startModalBackdrop) {
      FlowModal.close('start-evaluation-modal');
      return;
    }

    const delSec = e.target.closest('[data-delete-section]');
    if (delSec) {
      const sideId = delSec.dataset.deleteSection;
      EvalStorage.deleteSection(activeEvalId, sideId);
      if (expandedSideId === sideId) expandedSideId = null;
      if (activeSideId === sideId) {
        activeSideId = null;
        showAddItemForm = false;
      }
      activeSideMenuId = null;
      renderStructure();
      return;
    }
    const delItem = e.target.closest('[data-delete-item]');
    if (delItem) {
      const [s,i]=delItem.dataset.deleteItem.split(':');
      EvalStorage.deleteItem(activeEvalId,s,i);
      renderStructure();
      return;
    }
  });

  document.addEventListener('change', (e)=>{
    const suggestedGoal = e.target.closest('[data-suggested-goal]');
    if (suggestedGoal) {
      toggleSuggestedGoal(suggestedGoalsState.activeRow, suggestedGoal.dataset.suggestedGoal, suggestedGoal.checked);
    }
  });

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && document.querySelector('[data-suggested-goals-modal]')) {
      closeSuggestedGoalsPanels();
      return;
    }
    if (e.key === 'Escape' && showAddItemForm && addItemModal && !addItemModal.hidden) {
      closeAddItemForm();
    }
  });

  document.querySelectorAll('[data-tab]').forEach((btn)=>btn.addEventListener('click', ()=>{
    activeTab = btn.dataset.tab;
    currentPage = 1;
    renderList();
  }));
  searchInput?.addEventListener('input', ()=>{
    currentPage = 1;
    renderList();
  });

  diagnosisPicker = new MultiSelect(document.querySelector('[data-diagnosis-select]'), { options: MockData.diagnoses, placeholder: 'اختيار' });

  document.querySelector('[data-create-form]')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const title = document.querySelector('[name="title"]').value.trim();
    if (!title) return FlowModal.toast('اسم التقييم مطلوب');
    const created = EvalStorage.createEvaluation({ title, diagnosis: diagnosisPicker.getValue(), description: document.querySelector('[name="description"]').value });
    activeEvalId = created.id; setView('structure'); renderList();
  });

  sectionInput?.addEventListener('input', ()=>{ if (sectionInput.value.trim()) sectionInlineForm?.classList.remove('is-invalid'); });

  function createSide(keepOpen){
    const title = sectionInput?.value.trim() || '';
    if (!title) {
      sectionInlineForm?.classList.add('is-invalid');
      sectionInput?.focus();
      return;
    }
    const createdSection = EvalStorage.addSection(activeEvalId, title);
    if (createdSection?.id) {
      expandedSideId = createdSection.id;
    }
    sectionInlineForm?.classList.remove('is-invalid');
    showAddItemForm = false;
    activeSideId = null;
    if (sectionInput) sectionInput.value = '';
    if (!keepOpen) {
      setAddSideFormVisibility(false);
    }
    renderStructure();
    if (keepOpen) {
      sectionInput?.focus();
    }
  }

  document.querySelector('[data-create-section]')?.addEventListener('click', ()=>createSide(false));
  document.querySelector('[data-create-more-section]')?.addEventListener('click', ()=>createSide(true));

  document.querySelector('[data-add-option]')?.addEventListener('click', ()=>{
    const holder = document.createElement('div');
    holder.innerHTML = buildOptionRow();
    optionsRoot?.appendChild(holder.firstChild);
  });

  addItemForm?.addEventListener('change', (e)=>{
    if (e.target.name === 'item_type') {
      syncItemTypeFields();
      return;
    }

    const suggestedGoal = e.target.closest('[data-suggested-goal]');
    if (suggestedGoal) {
      const row = suggestedGoal.closest('[data-option-row]');
      toggleSuggestedGoal(row, suggestedGoal.dataset.suggestedGoal, suggestedGoal.checked);
    }
  });

  addItemForm?.addEventListener('click', (e)=>{
    const goalsButton = e.target.closest('[data-open-goals-picker]');
    if (goalsButton) {
      const row = goalsButton.closest('[data-option-row]');
      const hasOpenPanel = !!document.querySelector('[data-suggested-goals-modal]') && suggestedGoalsState.activeRow === row;
      if (hasOpenPanel) {
        closeSuggestedGoalsPanels();
      } else {
        renderSuggestedGoalsPanel(row);
      }
      return;
    }

    const aspectToggle = e.target.closest('[data-goals-toggle-aspect]');
    if (aspectToggle) {
      suggestedGoalsState.openAspectId = suggestedGoalsState.openAspectId === aspectToggle.dataset.goalsToggleAspect
        ? NO_OPEN_GOAL_NODE
        : aspectToggle.dataset.goalsToggleAspect;
      suggestedGoalsState.openLongGoalId = NO_OPEN_GOAL_NODE;
      renderSuggestedGoalsPanel(aspectToggle.closest('[data-option-row]'));
      return;
    }

    const longToggle = e.target.closest('[data-goals-toggle-long]');
    if (longToggle) {
      suggestedGoalsState.openLongGoalId = suggestedGoalsState.openLongGoalId === longToggle.dataset.goalsToggleLong
        ? NO_OPEN_GOAL_NODE
        : longToggle.dataset.goalsToggleLong;
      renderSuggestedGoalsPanel(longToggle.closest('[data-option-row]'));
      return;
    }

    const methodCard = e.target.closest('.method-card');
    if (methodCard) {
      const radio = methodCard.querySelector('[name="item_type"]');
      if (radio) {
        radio.checked = true;
        syncItemTypeFields();
      }
      return;
    }

    const deleteOption = e.target.closest('[data-delete-option]');
    if (deleteOption) {
      const rows = addItemForm.querySelectorAll('[data-option-row]');
      if (rows.length > 1) {
        deleteOption.closest('[data-option-row]')?.remove();
      }
    }
  });

  function saveItem(keepOpen){
    const title = document.querySelector('[name="item_title"]').value.trim();
    if (!title || !activeSideId) return;

    const type = document.querySelector('[name="item_type"]:checked').value;
    const options = type === 'multiple'
      ? Array.from(document.querySelectorAll('[data-option-row]')).map((row)=>({
          label: row.querySelector('[name="option_label"]').value.trim(),
          score: Number(row.querySelector('[name="option_score"]').value || 0),
          goals: readOptionGoals(row)
        })).filter((x)=>x.label)
      : [];

    EvalStorage.addItem(activeEvalId, activeSideId, {
      title,
      type,
      options,
      notes: document.querySelector('[name="item_notes"]').value
    });

    expandedSideId = activeSideId;
    if (keepOpen) {
      resetAddItemForm();
      renderStructure();
      return;
    }
    closeAddItemForm();
  }

  document.querySelector('[data-add-item-submit]')?.addEventListener('click', ()=>saveItem(false));
  document.querySelector('[data-add-item-submit-more]')?.addEventListener('click', ()=>saveItem(true));

  beneficiaryPicker = new MultiSelect(document.querySelector('[data-beneficiary-select]'), { options: MockData.beneficiaries, placeholder: 'إضافة مستفيدين' });
  startBeneficiaryPicker = new MultiSelect(startBeneficiarySelect, {
    options: MockData.beneficiaries,
    placeholder: 'إضافة مستفيدين',
    onChange(values){
      if (values.length > 1) {
        const lastValue = values[values.length - 1];
        startBeneficiaryPicker.selected = new Set([lastValue]);
        startBeneficiaryPicker.drawList(startBeneficiaryPicker.search.value);
        startBeneficiaryPicker.refreshTags();
      }
    }
  });
  document.querySelector('[data-submit-beneficiaries]')?.addEventListener('click', ()=>{ EvalStorage.setBeneficiaries(activeEvalId, beneficiaryPicker.getValue()); FlowModal.close('assign-beneficiaries-modal'); renderStructure(); });
  document.querySelector('[data-submit-start-evaluation]')?.addEventListener('click', ()=>{
    const ev = getActiveEval();
    if (!ev) return;
    const selectedBeneficiary = startBeneficiaryPicker?.getValue()?.[0] || ev.beneficiaries?.[0] || '';
    if (!selectedBeneficiary) {
      FlowModal.toast('اختر مستفيدًا أولًا');
      return;
    }
    EvalStorage.setBeneficiaries(activeEvalId, [selectedBeneficiary]);
    FlowModal.close('start-evaluation-modal');
    openViewFor(activeEvalId);
  });

  editDiagnosisPicker = new MultiSelect(document.querySelector('[data-edit-diagnosis-select]'), { options: MockData.diagnoses, placeholder: 'اختيار' });
  document.querySelector('[data-save-edit-eval]')?.addEventListener('click', ()=>{ const ev = getActiveEval(); if(!ev) return; ev.title = document.querySelector('[name="edit_title"]').value.trim() || ev.title; ev.diagnosis = editDiagnosisPicker.getValue(); ev.description = document.querySelector('[name="edit_description"]').value; EvalStorage.saveEvaluation(ev); FlowModal.close('edit-evaluation-modal'); renderList(); renderStructure(); });
  document.querySelector('[data-save-side-edit]')?.addEventListener('click', ()=>{
    const ev = getActiveEval();
    if (!ev || !activeSideId) return;
    const nextTitle = String(editSideTitleInput?.value || '').trim();
    if (!nextTitle) return FlowModal.toast('اسم الجانب مطلوب');
    const side = ev.sections?.find((section) => section.id === activeSideId);
    if (!side) return;
    side.title = nextTitle;
    EvalStorage.saveEvaluation(ev);
    FlowModal.close('edit-side-modal');
    renderStructure();
    FlowModal.toast('تم التعديل');
  });

  document.querySelector('[data-view-sections]')?.addEventListener('change', (e)=>{ const ev = getActiveEval(); if(!ev) return; const b = ev.beneficiaries[0] || 'MRS AMA SIDDIG'; const rs = EvalStorage.getResponses(ev.id,b); if(e.target.type==='radio'){ rs[e.target.name]=e.target.value; EvalStorage.saveResponses(ev.id,b,rs); renderView(); } });
  document.querySelector('[data-view-sections]')?.addEventListener('input', (e)=>{ const t=e.target.closest('[data-open-answer]'); if(!t) return; const ev=getActiveEval(); const b = ev.beneficiaries[0] || 'MRS AMA SIDDIG'; const rs=EvalStorage.getResponses(ev.id,b); rs[t.dataset.openAnswer]=t.value; EvalStorage.saveResponses(ev.id,b,rs); renderView(); });
  document.querySelector('[data-save-responses]')?.addEventListener('click', ()=>{ const ev=getActiveEval(); const b=ev.beneficiaries[0]||'MRS AMA SIDDIG'; const rs=EvalStorage.getResponses(ev.id,b); EvalStorage.saveResponses(ev.id,b,rs); FlowModal.toast('تم الحفظ'); });
  document.querySelector('[data-finish-eval]')?.addEventListener('click', ()=>{ setView('list'); FlowModal.toast('تم إنهاء التقييم'); });

  syncItemTypeFields();
  initEvaluationsPager();
  renderList();
  setView(currentView);
})();
