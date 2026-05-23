(function(){
  const form = document.querySelector('[data-create-form]');
  const nameInput = document.querySelector('[name="title"]');
  const descInput = document.querySelector('[name="description"]');
  let diagnosisPicker;

  const mount = document.querySelector('[data-diagnosis-select]');
  if (mount) {
    diagnosisPicker = new MultiSelect(mount, {
      options: MockData.diagnoses,
      placeholder: 'اختيار'
    });
  }

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!nameInput.value.trim()) {
      nameInput.focus();
      FlowModal.toast('اسم التقييم مطلوب');
      return;
    }

    const created = EvalStorage.createEvaluation({
      title: nameInput.value.trim(),
      diagnosis: diagnosisPicker ? diagnosisPicker.getValue() : [],
      description: descInput.value || ''
    });

    FlowModal.toast('تم الحفظ');
    EvalStorage.setActiveEvaluationId(created.id);
    window.location.href = './evaluation-structure.html';
  });
})();
