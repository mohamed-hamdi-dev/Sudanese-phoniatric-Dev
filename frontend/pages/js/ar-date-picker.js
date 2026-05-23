(function(global) {
  const AR_MONTHS = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const AR_WEEKDAYS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  let activePicker = null;
  let sharedPopup = null;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parseDateKey(key) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  function formatArabicDate(date) {
    return `${date.getDate()} ${AR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatArabicRange(start, end) {
    return `${formatArabicDate(start)} - ${formatArabicDate(end)}`;
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function addMonths(date, months) {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
  }

  function addYears(date, years) {
    const next = new Date(date);
    next.setFullYear(next.getFullYear() + years);
    return next;
  }

  function getPeriodRange(period, anchorDate) {
    const end = startOfDay(anchorDate || new Date());
    let start = end;

    if (period === 'day') {
      start = end;
    } else if (period === 'week') {
      start = addDays(end, -6);
    } else if (period === 'month') {
      start = addMonths(end, -1);
      start = addDays(start, 1);
    } else if (period === 'year') {
      start = addYears(end, -1);
      start = addDays(start, 1);
    }

    return { start, end };
  }

  function compareDates(a, b) {
    return a.getTime() - b.getTime();
  }

  function isSameDay(a, b) {
    return a && b
      && a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function isBetween(date, start, end) {
    if (!start || !end) return false;
    const value = date.getTime();
    return value >= start.getTime() && value <= end.getTime();
  }

  function getPopup() {
    if (sharedPopup) return sharedPopup;

    sharedPopup = document.createElement('div');
    sharedPopup.className = 'ar-picker-popup';
    sharedPopup.innerHTML = `
      <div class="ar-picker-nav">
        <button type="button" class="ar-picker-nav-btn" data-nav="year-prev" aria-label="السنة السابقة">«</button>
        <button type="button" class="ar-picker-nav-btn" data-nav="month-prev" aria-label="الشهر السابق">‹</button>
        <span class="ar-picker-title"></span>
        <button type="button" class="ar-picker-nav-btn" data-nav="month-next" aria-label="الشهر التالي">›</button>
        <button type="button" class="ar-picker-nav-btn" data-nav="year-next" aria-label="السنة التالية">»</button>
      </div>
      <div class="ar-picker-weekdays"></div>
      <div class="ar-picker-grid"></div>
    `;
    document.body.appendChild(sharedPopup);

    sharedPopup.addEventListener('click', (event) => {
      if (!activePicker) return;

      const state = activePicker;
      const { popup, anchor } = state;
      const navButton = event.target.closest('[data-nav]');

      if (navButton) {
        const action = navButton.dataset.nav;
        if (action === 'month-prev') state.viewDate = addMonths(state.viewDate, -1);
        if (action === 'month-next') state.viewDate = addMonths(state.viewDate, 1);
        if (action === 'year-prev') state.viewDate = addYears(state.viewDate, -1);
        if (action === 'year-next') state.viewDate = addYears(state.viewDate, 1);
        renderPicker(state);
        positionPopup(popup, anchor);
        return;
      }

      const dayButton = event.target.closest('[data-date]');
      if (!dayButton) return;

      const pickedDate = parseDateKey(dayButton.dataset.date);

      if (state.mode === 'range') {
        if (!state.rangeDraft) {
          state.rangeDraft = pickedDate;
          state.rangeStart = pickedDate;
          state.rangeEnd = null;
        } else {
          let start = state.rangeDraft;
          let end = pickedDate;
          if (compareDates(end, start) < 0) {
            const swap = start;
            start = end;
            end = swap;
          }
          state.rangeStart = start;
          state.rangeEnd = end;
          state.rangeDraft = null;
          state.onRangeSelect?.({ start, end });
          closeActivePicker();
          return;
        }
        renderPicker(state);
        return;
      }

      state.selected = pickedDate;
      state.onSelect?.(pickedDate);
      closeActivePicker();
    });

    return sharedPopup;
  }

  function positionPopup(popup, anchor) {
    const rect = anchor.getBoundingClientRect();
    const margin = 8;
    let top = rect.bottom + margin;
    let left = rect.left;

    popup.style.visibility = 'hidden';
    popup.classList.add('is-open');
    const popupRect = popup.getBoundingClientRect();

    if (top + popupRect.height > window.innerHeight - margin) {
      top = Math.max(margin, rect.top - popupRect.height - margin);
    }

    if (left + popupRect.width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - popupRect.width - margin);
    }

    popup.style.top = `${top + window.scrollY}px`;
    popup.style.left = `${left + window.scrollX}px`;
    popup.style.visibility = '';
  }

  function closeActivePicker() {
    if (!activePicker) return;
    activePicker.popup.classList.remove('is-open');
    activePicker.anchor?.classList.remove('is-picker-open');
    activePicker = null;
  }

  function renderPicker(state) {
    const { popup, viewDate, selected, rangeStart, rangeEnd, mode } = state;
    const title = popup.querySelector('.ar-picker-title');
    const weekdays = popup.querySelector('.ar-picker-weekdays');
    const grid = popup.querySelector('.ar-picker-grid');

    title.textContent = `${AR_MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    weekdays.innerHTML = AR_WEEKDAYS.map((day) => `<span>${day}</span>`).join('');

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells = [];

    for (let index = 0; index < 42; index += 1) {
      let cellDate;
      let isMuted = false;

      if (index < startOffset) {
        const day = prevMonthDays - startOffset + index + 1;
        cellDate = new Date(year, month - 1, day);
        isMuted = true;
      } else if (index >= startOffset + daysInMonth) {
        const day = index - (startOffset + daysInMonth) + 1;
        cellDate = new Date(year, month + 1, day);
        isMuted = true;
      } else {
        const day = index - startOffset + 1;
        cellDate = new Date(year, month, day);
      }

      const isSelected = selected && isSameDay(cellDate, selected);
      const inRange = mode === 'range' && isBetween(cellDate, rangeStart, rangeEnd);
      const isRangeEdge = mode === 'range'
        && ((rangeStart && isSameDay(cellDate, rangeStart)) || (rangeEnd && isSameDay(cellDate, rangeEnd)));

      const classes = ['ar-picker-day'];
      if (isMuted) classes.push('is-muted');
      if (isSelected || isRangeEdge) classes.push('is-selected');
      else if (inRange) classes.push('is-in-range');

      cells.push(`
        <button
          type="button"
          class="${classes.join(' ')}"
          data-date="${toDateKey(cellDate)}"
        >${cellDate.getDate()}</button>
      `);
    }

    grid.innerHTML = cells.join('');
  }

  function openPicker(options) {
    if (activePicker?.anchor === options.anchor) {
      closeActivePicker();
      return;
    }

    closeActivePicker();

    const popup = getPopup();
    const anchor = options.anchor;
    const mode = options.mode || 'single';

    const state = {
      popup,
      anchor,
      mode,
      viewDate: startOfDay(options.defaultDate || new Date()),
      selected: options.defaultDate ? startOfDay(options.defaultDate) : null,
      rangeStart: options.rangeStart ? startOfDay(options.rangeStart) : null,
      rangeEnd: options.rangeEnd ? startOfDay(options.rangeEnd) : null,
      rangeDraft: null,
      onSelect: options.onSelect,
      onRangeSelect: options.onRangeSelect
    };

    if (state.rangeStart) {
      state.viewDate = new Date(state.rangeStart);
    }

    renderPicker(state);
    positionPopup(popup, anchor);
    anchor.classList.add('is-picker-open');
    activePicker = state;
  }

  document.addEventListener('click', (event) => {
    if (!activePicker) return;
    const { popup, anchor } = activePicker;
    if (popup.contains(event.target) || anchor.contains(event.target)) return;
    closeActivePicker();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeActivePicker();
  });

  window.addEventListener('resize', closeActivePicker);
  window.addEventListener('scroll', closeActivePicker, true);

  global.ArDatePicker = {
    AR_MONTHS,
    formatArabicDate,
    formatArabicRange,
    getPeriodRange,
    open: openPicker,
    close: closeActivePicker
  };
})(window);
