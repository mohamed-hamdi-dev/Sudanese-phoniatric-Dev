(function(window){
  const KEY = 'spc_evaluations_state_v1';
  const ACTIVE_KEY = 'spc_active_evaluation_id';
  const RESPONSE_KEY = 'spc_evaluation_responses_v1';

  function clone(v){ return JSON.parse(JSON.stringify(v)); }

  function readState(){
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const initial = { evaluations: clone(window.MockData.seedEvaluations) };
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    try { return JSON.parse(raw); }
    catch (_) {
      const reset = { evaluations: clone(window.MockData.seedEvaluations) };
      localStorage.setItem(KEY, JSON.stringify(reset));
      return reset;
    }
  }

  function writeState(state){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function uid(prefix){ return `${prefix}_${Date.now()}_${Math.floor(Math.random()*1000)}`; }

  const Storage = {
    getEvaluations(){ return readState().evaluations || []; },
    getEvaluation(id){ return this.getEvaluations().find((x)=>x.id===id) || null; },
    saveEvaluation(evalObj){
      const state = readState();
      const idx = state.evaluations.findIndex((x)=>x.id===evalObj.id);
      if (idx === -1) state.evaluations.unshift(evalObj); else state.evaluations[idx] = evalObj;
      writeState(state);
    },
    createEvaluation(payload){
      const next = {
        id: uid('eval'),
        title: payload.title,
        diagnosis: payload.diagnosis || [],
        description: payload.description || '<p></p>',
        beneficiaries: [],
        createdAt: new Date().toISOString().slice(0,10),
        owner: 'Ynmo Data Super Admin',
        archived: false,
        sections: []
      };
      this.saveEvaluation(next);
      this.setActiveEvaluationId(next.id);
      return next;
    },
    setActiveEvaluationId(id){ localStorage.setItem(ACTIVE_KEY, id); },
    getActiveEvaluationId(){ return localStorage.getItem(ACTIVE_KEY); },
    archiveEvaluation(id, archived){
      const evalObj = this.getEvaluation(id); if (!evalObj) return;
      evalObj.archived = !!archived; this.saveEvaluation(evalObj);
    },
    deleteEvaluation(id){
      const state = readState();
      state.evaluations = (state.evaluations || []).filter((x)=>x.id !== id);
      writeState(state);
      if (this.getActiveEvaluationId() === id) {
        localStorage.removeItem(ACTIVE_KEY);
      }
    },
    addSection(evalId, title){
      const evalObj = this.getEvaluation(evalId); if (!evalObj) return null;
      const section = { id: uid('sec'), title, items: [] };
      evalObj.sections.push(section); this.saveEvaluation(evalObj); return section;
    },
    deleteSection(evalId, sectionId){
      const evalObj = this.getEvaluation(evalId); if (!evalObj) return;
      evalObj.sections = evalObj.sections.filter((s)=>s.id!==sectionId); this.saveEvaluation(evalObj);
    },
    addItem(evalId, sectionId, item){
      const evalObj = this.getEvaluation(evalId); if (!evalObj) return;
      const section = evalObj.sections.find((s)=>s.id===sectionId); if (!section) return;
      section.items.push({ ...item, id: uid('item') }); this.saveEvaluation(evalObj);
    },
    deleteItem(evalId, sectionId, itemId){
      const evalObj = this.getEvaluation(evalId); if (!evalObj) return;
      const section = evalObj.sections.find((s)=>s.id===sectionId); if (!section) return;
      section.items = section.items.filter((i)=>i.id!==itemId); this.saveEvaluation(evalObj);
    },
    setBeneficiaries(evalId, beneficiaries){
      const evalObj = this.getEvaluation(evalId); if (!evalObj) return;
      evalObj.beneficiaries = beneficiaries; this.saveEvaluation(evalObj);
    },
    saveResponses(evalId, beneficiary, responses){
      const raw = localStorage.getItem(RESPONSE_KEY);
      const state = raw ? JSON.parse(raw) : {};
      state[`${evalId}:${beneficiary}`] = responses;
      localStorage.setItem(RESPONSE_KEY, JSON.stringify(state));
    },
    getResponses(evalId, beneficiary){
      const raw = localStorage.getItem(RESPONSE_KEY);
      const state = raw ? JSON.parse(raw) : {};
      return state[`${evalId}:${beneficiary}`] || {};
    }
  };

  window.EvalStorage = Storage;
})(window);
