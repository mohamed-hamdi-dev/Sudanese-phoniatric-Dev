(function(window){
  function MultiSelect(root, config){
    this.root = root;
    this.config = config;
    this.selected = new Set(config.value || []);
    this.render();
    this.bind();
  }

  MultiSelect.prototype.render = function(){
    this.root.classList.add('ms');
    this.root.innerHTML = `
      <div class="ms-control" tabindex="0">
        <span class="ms-placeholder">${this.config.placeholder || 'اختيار'}</span>
        <div class="ms-tags"></div>
        <span class="ms-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </div>
      <div class="ms-panel" hidden>
        <input class="ms-search" type="text" placeholder="بحث">
        <label class="ms-row ms-row--all"><input type="checkbox" class="ms-all"> <span>تحديد الكل</span></label>
        <div class="ms-list"></div>
      </div>`;

    this.control = this.root.querySelector('.ms-control');
    this.panel = this.root.querySelector('.ms-panel');
    this.search = this.root.querySelector('.ms-search');
    this.list = this.root.querySelector('.ms-list');
    this.all = this.root.querySelector('.ms-all');
    this.tags = this.root.querySelector('.ms-tags');
    this.placeholder = this.root.querySelector('.ms-placeholder');

    this.drawList('');
    this.refreshTags();
  };

  MultiSelect.prototype.drawList = function(query){
    const q = (query || '').trim();
    const options = this.config.options.filter((o)=>o.includes(q));
    this.list.innerHTML = options.map((o)=>`<label class="ms-row"><input type="checkbox" value="${o}" ${this.selected.has(o) ? 'checked' : ''}> <span>${o}</span></label>`).join('');
    this.all.checked = this.selected.size === this.config.options.length;
  };

  MultiSelect.prototype.refreshTags = function(){
    const values = Array.from(this.selected);
    this.tags.innerHTML = values.map((v)=>`<span class="ms-tag">${v}</span>`).join('');
    this.placeholder.style.display = values.length ? 'none' : 'inline';
    if (this.config.onChange) this.config.onChange(values);
  };

  MultiSelect.prototype.bind = function(){
    this.control.addEventListener('click', ()=>{
      const open = this.root.classList.toggle('is-open');
      this.panel.hidden = !open;
    });

    this.search.addEventListener('input', ()=>this.drawList(this.search.value));

    this.all.addEventListener('change', ()=>{
      if (this.all.checked) this.config.options.forEach((o)=>this.selected.add(o));
      else this.selected.clear();
      this.drawList(this.search.value);
      this.refreshTags();
    });

    this.list.addEventListener('change', (e)=>{
      const input = e.target;
      if (input.checked) this.selected.add(input.value); else this.selected.delete(input.value);
      this.drawList(this.search.value);
      this.refreshTags();
    });

    document.addEventListener('click', (e)=>{
      if (!this.root.contains(e.target)) {
        this.root.classList.remove('is-open');
        this.panel.hidden = true;
      }
    });
  };

  MultiSelect.prototype.getValue = function(){ return Array.from(this.selected); };

  window.MultiSelect = MultiSelect;
})(window);
