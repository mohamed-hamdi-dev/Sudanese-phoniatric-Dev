(function(){
  const evalId = EvalStorage.getActiveEvaluationId();
  const evaluation = EvalStorage.getEvaluation(evalId);
  if (!evaluation) {
    window.location.href = './evaluations.html';
    return;
  }

  const beneficiary = evaluation.beneficiaries[0] || 'MRS AMA SIDDIG';
  const responseState = EvalStorage.getResponses(evalId, beneficiary);
  const root = document.querySelector('[data-view-sections]');
  const progress = document.querySelector('[data-progress]');
  const title = document.querySelector('[data-view-title]');
  const diag = document.querySelector('[data-view-diagnosis]');
  const ben = document.querySelector('[data-view-beneficiary]');

  title.textContent = evaluation.title;
  diag.textContent = evaluation.diagnosis[0] || 'بدون تشخيص';
  ben.textContent = beneficiary;

  const allItems = evaluation.sections.flatMap((s)=>s.items.map((i)=>({ ...i, sectionTitle: s.title })));

  function render(){
    root.innerHTML = evaluation.sections.map((section)=>`<section class="flow-card"><h3>${section.title}</h3>${section.items.map((item)=>{
      if (item.type === 'multiple') {
        return `<div class="view-item"><h4>${item.title}</h4>${item.options.map((opt)=>`<label class="choice"><input type="radio" name="${item.id}" value="${opt.label}" ${responseState[item.id]===opt.label ? 'checked' : ''}> <span>${opt.label}</span></label>`).join('')}</div>`;
      }
      return `<div class="view-item"><h4>${item.title}</h4><textarea data-open-answer="${item.id}" class="evaluations-textarea">${responseState[item.id] || ''}</textarea></div>`;
    }).join('') || '<div class="empty-warning">لا يوجد بنود</div>'}</section>`).join('');

    const answered = allItems.filter((item)=>Boolean(responseState[item.id])).length;
    const pct = allItems.length ? Math.round((answered / allItems.length) * 100) : 0;
    progress.textContent = `${pct}%`;
  }

  root.addEventListener('change', (e)=>{
    const radio = e.target;
    if (radio.type === 'radio') {
      responseState[radio.name] = radio.value;
      EvalStorage.saveResponses(evalId, beneficiary, responseState);
      render();
    }
  });

  root.addEventListener('input', (e)=>{
    const txt = e.target.closest('[data-open-answer]');
    if (!txt) return;
    responseState[txt.dataset.openAnswer] = txt.value;
    EvalStorage.saveResponses(evalId, beneficiary, responseState);
    render();
  });

  document.querySelector('[data-save-responses]')?.addEventListener('click', ()=>{
    EvalStorage.saveResponses(evalId, beneficiary, responseState);
    FlowModal.toast('تم الحفظ');
  });

  document.querySelector('[data-finish-eval]')?.addEventListener('click', ()=>{
    EvalStorage.saveResponses(evalId, beneficiary, responseState);
    FlowModal.toast('تم إنهاء التقييم');
    window.location.href = './evaluations.html';
  });

  render();
})();
