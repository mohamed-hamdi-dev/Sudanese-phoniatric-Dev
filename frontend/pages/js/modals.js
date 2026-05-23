(function(window){
  function openModal(id){
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = false;
    requestAnimationFrame(()=>modal.classList.add('is-open'));
  }

  function closeModal(id){
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('is-open');
    setTimeout(()=>{ modal.hidden = true; }, 180);
  }

  function toast(message){
    const el = document.createElement('div');
    el.className = 'app-toast';
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('is-show'));
    setTimeout(()=>{ el.classList.remove('is-show'); setTimeout(()=>el.remove(), 200); }, 1800);
  }

  document.addEventListener('click', (e)=>{
    const openTrigger = e.target.closest('[data-open-modal]');
    if (openTrigger) openModal(openTrigger.dataset.openModal);

    const closeTrigger = e.target.closest('[data-close-modal]');
    if (closeTrigger) closeModal(closeTrigger.dataset.closeModal);

    const backdrop = e.target.closest('.flow-modal');
    if (backdrop && e.target === backdrop) closeModal(backdrop.id);
  });

  window.FlowModal = { open: openModal, close: closeModal, toast };
})(window);
