(function(){
  const evalId = EvalStorage.getActiveEvaluationId();
  let evaluation = EvalStorage.getEvaluation(evalId);
  if (!evaluation) {
    window.location.href = './evaluations.html';
    return;
  }

  const titleNode = document.querySelector('[data-eval-title]');
  const diagNode = document.querySelector('[data-eval-diagnosis]');
  const benNode = document.querySelector('[data-eval-beneficiary]');
  const sectionsRoot = document.querySelector('[data-sections-root]');
  const inlineForm = document.querySelector('[data-add-section-form]');
  const sectionInput = document.querySelector('[name="section_title"]');
  let beneficiarySelect;
  let editDiagnosisSelect;
  let currentSectionId = null;
  let plumbRefreshTimer = null;
  const treeState = {
    sections: new Set(),
    items: new Set()
  };

  function refreshJsPlumb(){
    if (!window.jsPlumb) return;
    if (plumbRefreshTimer) {
      window.clearTimeout(plumbRefreshTimer);
    }
    plumbRefreshTimer = window.setTimeout(() => {
      try {
        if (typeof window.jsPlumb.revalidate === 'function') {
          sectionsRoot.querySelectorAll('[id]').forEach((node) => window.jsPlumb.revalidate(node));
        }
        if (typeof window.jsPlumb.repaintEverything === 'function') {
          window.jsPlumb.repaintEverything();
        }
      } catch (_) {
        // Keep page functional even if jsPlumb instance is not ready yet.
      }
    }, 0);
  }

  function initJsPlumbSync(){
    if (!window.jsPlumb || !sectionsRoot) return;
    const eventNames = ['resize', 'scroll', 'orientationchange'];
    eventNames.forEach((evt) => window.addEventListener(evt, refreshJsPlumb, { passive: true }));

    document.addEventListener('transitionend', refreshJsPlumb, true);
    document.addEventListener('click', () => {
      window.requestAnimationFrame(refreshJsPlumb);
    }, true);

    const observer = new MutationObserver(refreshJsPlumb);
    observer.observe(sectionsRoot, { childList: true, subtree: true, attributes: true });
    refreshJsPlumb();
  }

  function updateEmptyState(isFormOpen) {
    const emptyNote = document.querySelector('.structure-empty-note-exact');
    if (!emptyNote) return;
    if (isFormOpen || evaluation.sections.length > 0) {
      emptyNote.style.display = 'none';
    } else {
      emptyNote.style.display = 'flex';
    }
  }

  function refresh(){
    evaluation = EvalStorage.getEvaluation(evalId);
    titleNode.textContent = evaluation.title;
    diagNode.textContent = evaluation.diagnosis[0] || 'بدون تشخيص';
    benNode.textContent = evaluation.beneficiaries[0] || 'غير معين';

    const helperText = evaluation.sections.length
      ? 'أضف بنودًا داخل الجوانب التي أنشأتها'
      : ''; // Removed the duplicate 'أنشئ الجانب الأول' inside treeRoot

    const treeHtml = evaluation.sections.map((sec) => {
      const sectionOpen = treeState.sections.has(sec.id);
      const sectionToggleClass = sectionOpen ? 'is-open' : '';
      return `<article class="structure-tree-node structure-tree-node--root">
        <div class="structure-tree-row">
          <div class="structure-tree-main">
            <button class="structure-tree-toggle ${sectionToggleClass}" type="button" data-tree-toggle="section" data-tree-id="${sec.id}" ${sec.items.length ? '' : 'disabled'}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <strong class="structure-tree-title">${sec.title}</strong>
          </div>
          <div class="structure-tree-actions">
            <span class="structure-tree-count">${sec.items.length} البنود</span>
            <button class="solid-btn green solid-btn--sm" data-add-item="${sec.id}">إضافة بند</button>
            <button class="outline-btn" data-delete-section="${sec.id}">حذف الجانب</button>
          </div>
        </div>
        <div class="structure-tree-children" ${sectionOpen ? '' : 'hidden'}>
          ${sec.items.length ? sec.items.map((item) => {
            const itemKey = `${sec.id}:${item.id}`;
            const itemOpen = treeState.items.has(itemKey);
            const itemToggleClass = itemOpen ? 'is-open' : '';
            return `<article class="structure-tree-node">
              <div class="structure-tree-row structure-tree-row--item">
                <div class="structure-tree-main">
                  <button class="structure-tree-toggle ${itemToggleClass}" type="button" data-tree-toggle="item" data-tree-id="${itemKey}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                  <span class="structure-tree-title structure-tree-title--item">${item.title}</span>
                </div>
                <div class="structure-tree-actions">
                  <span class="structure-tree-type">${item.type === 'multiple' ? 'اختيار متعدد' : 'مفتوح'}</span>
                  <button class="outline-btn" data-delete-item="${sec.id}:${item.id}">حذف</button>
                </div>
              </div>
              <div class="structure-tree-leaf" ${itemOpen ? '' : 'hidden'}>
                <div class="structure-tree-leaf-box">
                  <div><strong>ملاحظات:</strong> ${item.notes?.trim() ? item.notes : 'لا توجد ملاحظات'}</div>
                  <div><strong>عدد الخيارات:</strong> ${Array.isArray(item.options) ? item.options.length : 0}</div>
                </div>
              </div>
            </article>`;
          }).join('') : '<div class="empty-warning">لا توجد بنود بعد</div>'}
        </div>
      </article>`;
    }).join('');

    sectionsRoot.innerHTML = helperText ? `<div class="empty-warning" style="margin-bottom: 20px;">${helperText}</div><section class="structure-tree">${treeHtml}</section>` : `<section class="structure-tree">${treeHtml}</section>`;
    updateEmptyState(inlineForm && !inlineForm.hidden);
    refreshJsPlumb();
  }

  function setupBeneficiary(){
    beneficiarySelect = new MultiSelect(document.querySelector('[data-beneficiary-select]'), {
      options: MockData.beneficiaries,
      placeholder: 'إضافة مستفيدين',
      value: evaluation.beneficiaries
    });

    editDiagnosisSelect = new MultiSelect(document.querySelector('[data-edit-diagnosis-select]'), {
      options: MockData.diagnoses,
      placeholder: 'اختيار',
      value: evaluation.diagnosis
    });
  }

  document.querySelector('[data-show-add-section]')?.addEventListener('click', (e)=>{
    inlineForm.hidden = false;
    sectionInput.focus();
    e.currentTarget.disabled = true;
    updateEmptyState(true);
  });

  document.querySelector('[data-cancel-add-section]')?.addEventListener('click', ()=>{
    inlineForm.hidden = true;
    sectionInput.value = '';
    const addBtn = document.querySelector('[data-show-add-section]');
    if (addBtn) addBtn.disabled = false;
    updateEmptyState(false);
  });

  function createSection(keepOpen){
    const title = sectionInput.value.trim();
    if (!title) return;
    EvalStorage.addSection(evalId, title);
    FlowModal.toast('تم إنشاء الجانب');
    if (!keepOpen) {
      inlineForm.hidden = true;
      sectionInput.value = '';
      const addBtn = document.querySelector('[data-show-add-section]');
      if (addBtn) addBtn.disabled = false;
    } else {
      sectionInput.value = '';
      sectionInput.focus();
    }
    refresh();
  }

  document.querySelector('[data-create-section]')?.addEventListener('click', ()=>createSection(false));
  document.querySelector('[data-create-more-section]')?.addEventListener('click', ()=>createSection(true));

  document.addEventListener('click', (e)=>{
    const toggleBtn = e.target.closest('[data-tree-toggle]');
    if (toggleBtn) {
      const type = toggleBtn.dataset.treeToggle;
      const id = toggleBtn.dataset.treeId;
      const targetSet = type === 'section' ? treeState.sections : treeState.items;
      if (targetSet.has(id)) targetSet.delete(id);
      else targetSet.add(id);
      refresh();
      return;
    }

    const delSec = e.target.closest('[data-delete-section]');
    if (delSec) {
      EvalStorage.deleteSection(evalId, delSec.dataset.deleteSection);
      FlowModal.toast('تم حذف الجانب');
      refresh();
      return;
    }

    const addItem = e.target.closest('[data-add-item]');
    if (addItem) {
      currentSectionId = addItem.dataset.addItem;
      FlowModal.open('add-item-modal');
      return;
    }

    const delItem = e.target.closest('[data-delete-item]');
    if (delItem) {
      const [secId, itemId] = delItem.dataset.deleteItem.split(':');
      EvalStorage.deleteItem(evalId, secId, itemId);
      FlowModal.toast('تم حذف البند');
      refresh();
    }
  });

  document.querySelector('[data-submit-beneficiaries]')?.addEventListener('click', ()=>{
    EvalStorage.setBeneficiaries(evalId, beneficiarySelect.getValue());
    FlowModal.close('assign-beneficiaries-modal');
    FlowModal.toast('تم التعيين');
    refresh();
  });

  document.querySelector('[data-open-goals]')?.addEventListener('click', ()=>FlowModal.open('goals-modal'));

  document.querySelector('[data-add-item-submit]')?.addEventListener('click', ()=>{
    const title = document.querySelector('[name="item_title"]').value.trim();
    const type = document.querySelector('[name="item_type"]:checked')?.value || 'multiple';
    if (!title || !currentSectionId) return;

    const options = type === 'multiple'
      ? Array.from(document.querySelectorAll('[data-option-row]')).map((row)=>({
          label: row.querySelector('[name="option_label"]').value.trim(),
          score: Number(row.querySelector('[name="option_score"]').value || 0),
          goals: []
        })).filter((x)=>x.label)
      : [];

    EvalStorage.addItem(evalId, currentSectionId, { title, type, options, notes: document.querySelector('[name="item_notes"]').value });
    FlowModal.close('add-item-modal');
    FlowModal.toast('تم إنشاء البند');
    document.querySelector('[data-add-item-form]').reset();
    refresh();
  });

  document.querySelector('[data-add-option]')?.addEventListener('click', ()=>{
    const root = document.querySelector('[data-options-root]');
    const row = document.createElement('div');
    row.className = 'option-row';
    row.setAttribute('data-option-row', '');
    row.innerHTML = '<input class="evaluations-input" name="option_label" placeholder="الاسم"><input class="evaluations-input" name="option_score" type="number" value="0">';
    root.appendChild(row);
  });

  document.querySelector('[data-save-edit-eval]')?.addEventListener('click', ()=>{
    evaluation.title = document.querySelector('[name="edit_title"]').value.trim() || evaluation.title;
    evaluation.diagnosis = editDiagnosisSelect.getValue();
    evaluation.description = document.querySelector('[name="edit_description"]').value;
    EvalStorage.saveEvaluation(evaluation);
    FlowModal.close('edit-evaluation-modal');
    FlowModal.toast('تم التعديل');
    refresh();
  });

  document.querySelector('[data-go-view]')?.addEventListener('click', ()=>{
    window.location.href = './evaluation-view.html';
  });

  refresh();
  setupBeneficiary();
  initJsPlumbSync();
})();
