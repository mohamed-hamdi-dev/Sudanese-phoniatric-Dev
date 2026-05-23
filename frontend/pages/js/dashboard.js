(function() {
  const languageSwitcher = document.querySelector('[data-language-switcher]');
  const languageToggle = languageSwitcher?.querySelector('[data-language-toggle]');
  const languageMenu = languageSwitcher?.querySelector('[data-language-menu]');
  const languageCurrent = languageSwitcher?.querySelector('[data-language-current]');
  const languageOptions = Array.from(languageSwitcher?.querySelectorAll('[data-language-option]') || []);
  const languageLabels = {
    ar: 'AR',
    en: 'EN'
  };
  const LANGUAGE_STORAGE_KEY = 'dashboard-language';

  const chartPalette = ['#50B4E6', '#6EDAB8', '#65719B', '#9AA4E5', '#5A4B47', '#FFB20F'];
  const dashboardChartsData = {
    'skill-acquisition': {
      title: 'إكساب مهارة',
      type: 'line',
      periods: {
        day: {
          dateFrom: '22 مايو 2026',
          dateTo: '22 مايو 2026',
          labels: ['22 مايو'],
          series: [
            { name: 'خط الأساس', values: [1] },
            { name: 'تدخل', values: [0] },
            { name: 'متقن', values: [0] }
          ]
        },
        week: {
          dateFrom: '12 مايو 2026',
          dateTo: '18 مايو 2026',
          labels: ['12 مايو', '14 مايو', '16 مايو', '18 مايو'],
          series: [
            { name: 'خط الأساس', values: [1, 1, 2, 2] },
            { name: 'تدخل', values: [0, 1, 1, 2] },
            { name: 'متقن', values: [0, 0, 1, 1] }
          ]
        },
        month: {
          dateFrom: '22 أبريل 2026',
          dateTo: '22 مايو 2026',
          labels: ['18 أبريل', '25 أبريل', '2 مايو', '9 مايو', '16 مايو', '18 مايو'],
          series: [
            { name: 'خط الأساس', values: [1, 2, 2, 3, 4, 4] },
            { name: 'تدخل', values: [0, 1, 1, 2, 3, 4] },
            { name: 'متقن', values: [0, 0, 1, 1, 2, 3] },
            { name: 'إغلاق', values: [0, 0, 0, 1, 1, 2] },
            { name: 'تعميم', values: [0, 0, 0, 0, 1, 1] },
            { name: 'متابعة', values: [0, 0, 0, 0, 0, 1] }
          ]
        },
        year: {
          dateFrom: '18 مايو 2025',
          dateTo: '18 مايو 2026',
          labels: ['يونيو', 'أغسطس', 'أكتوبر', 'ديسمبر', 'فبراير', 'أبريل'],
          series: [
            { name: 'خط الأساس', values: [1, 2, 2, 3, 4, 5] },
            { name: 'تدخل', values: [0, 1, 2, 2, 3, 4] },
            { name: 'متقن', values: [0, 0, 1, 1, 2, 3] }
          ]
        }
      }
    },
    'behavior-reduction': {
      title: 'خفض سلوك',
      type: 'line',
      periods: {
        day: {
          dateFrom: '22 مايو 2026',
          dateTo: '22 مايو 2026',
          labels: ['22 مايو'],
          series: [
            { name: 'خط الأساس', values: [1] },
            { name: 'تدخل', values: [0] },
            { name: 'متقن', values: [0] }
          ]
        },
        week: {
          dateFrom: '12 مايو 2026',
          dateTo: '18 مايو 2026',
          labels: [],
          series: []
        },
        month: {
          dateFrom: '22 أبريل 2026',
          dateTo: '22 مايو 2026',
          labels: [],
          series: []
        },
        year: {
          dateFrom: '18 مايو 2025',
          dateTo: '18 مايو 2026',
          labels: [],
          series: []
        }
      }
    },
    'teaching-opportunities': {
      title: 'الفرص التعليمية مقابل الحدث',
      type: 'line',
      periods: {
        day: {
          dateFrom: '22 مايو 2026',
          dateTo: '22 مايو 2026',
          labels: ['22 مايو'],
          series: [
            { name: 'خط الأساس', values: [1] },
            { name: 'تدخل', values: [0] },
            { name: 'متقن', values: [0] }
          ]
        },
        week: {
          dateFrom: '12 مايو 2026',
          dateTo: '18 مايو 2026',
          labels: [],
          series: []
        },
        month: {
          dateFrom: '22 أبريل 2026',
          dateTo: '22 مايو 2026',
          labels: [],
          series: []
        },
        year: {
          dateFrom: '18 مايو 2025',
          dateTo: '18 مايو 2026',
          labels: [],
          series: []
        }
      }
    },
    diagnoses: {
      title: 'التشخيصات',
      type: 'pie',
      periods: {
        day: {
          dateFrom: '22 مايو 2026',
          dateTo: '22 مايو 2026',
          values: [
            { name: 'اضطراب طيف التوحد', value: 1 }
          ]
        },
        week: {
          dateFrom: '12 مايو 2026',
          dateTo: '18 مايو 2026',
          values: [
            { name: 'اضطراب طيف التوحد', value: 1 },
            { name: 'صعوبات التعلم', value: 1 },
            { name: 'اضطراب النطق', value: 1 },
            { name: 'غير محدد', value: 3 }
          ]
        },
        month: {
          dateFrom: '22 أبريل 2026',
          dateTo: '22 مايو 2026',
          values: [
            { name: 'اضطراب طيف التوحد', value: 1 },
            { name: 'صعوبات التعلم', value: 1 },
            { name: 'اضطراب النطق', value: 1 },
            { name: 'غير محدد', value: 3 }
          ]
        },
        year: {
          dateFrom: '18 مايو 2025',
          dateTo: '18 مايو 2026',
          values: [
            { name: 'اضطراب طيف التوحد', value: 4 },
            { name: 'صعوبات التعلم', value: 3 },
            { name: 'اضطراب النطق', value: 2 },
            { name: 'متلازمة داون', value: 1 },
            { name: 'غير محدد', value: 6 }
          ]
        }
      }
    }
  };

  const chartTitles = {
    'skill-acquisition': 'إكساب مهارة',
    'behavior-reduction': 'خفض سلوك',
    'teaching-opportunities': 'الفرص التعليمية مقابل الحدث',
    diagnoses: 'التشخيصات'
  };

  const chartState = {};
  const chartInstances = new Map();

  function setLanguageMenuOpen(shouldOpen) {
    if (!languageSwitcher || !languageToggle || !languageMenu) return;

    languageSwitcher.classList.toggle('is-open', shouldOpen);
    languageToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    languageMenu.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  }

  function applyLanguage(language) {
    const nextLanguage = Object.prototype.hasOwnProperty.call(languageLabels, language) ? language : 'ar';

    if (languageCurrent) {
      languageCurrent.textContent = languageLabels[nextLanguage];
    }

    document.documentElement.lang = nextLanguage;
    document.documentElement.dataset.language = nextLanguage;

    languageOptions.forEach((option) => {
      const isActive = option.dataset.languageOption === nextLanguage;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      // Ignore storage issues so the switcher still works for the current session.
    }
  }

  function getInitialLanguage() {
    try {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && Object.prototype.hasOwnProperty.call(languageLabels, storedLanguage)) {
        return storedLanguage;
      }
    } catch (error) {
      // Fall back to Arabic when storage is unavailable.
    }

    return 'ar';
  }

  function hasLineData(dataset) {
    return !!dataset?.labels?.length && !!dataset?.series?.some((seriesItem) =>
      Array.isArray(seriesItem.values) && seriesItem.values.some((value) => Number(value) > 0)
    );
  }

  function hasPieData(dataset) {
    return !!dataset?.values?.some((item) => Number(item.value) > 0);
  }

  function buildLineOption(dataset) {
    return {
      color: chartPalette,
      animationDuration: 450,
      grid: {
        left: 54,
        right: 18,
        top: 22,
        bottom: 52,
        containLabel: true
      },
      tooltip: {
        show: false
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#667597',
          fontFamily: 'Cairo, sans-serif',
          fontSize: 11
        }
      },
      xAxis: {
        type: 'category',
        data: dataset.labels,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#d8e0ea' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#8b94a2',
          fontFamily: 'Cairo, sans-serif',
          rotate: dataset.labels.length > 5 ? 35 : 0
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#edf2f7' } },
        axisLabel: {
          color: '#8b94a2',
          fontFamily: 'Cairo, sans-serif'
        },
        name: 'عدد',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
          color: '#9aa4b5',
          fontFamily: 'Cairo, sans-serif'
        }
      },
      series: dataset.series.map((seriesItem) => ({
        name: seriesItem.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: seriesItem.values,
        lineStyle: { width: 3 },
        emphasis: { focus: 'series' }
      }))
    };
  }

  function buildPieOption(dataset) {
    return {
      color: chartPalette,
      animationDuration: 450,
      tooltip: {
        show: false
      },
      series: [
        {
          name: 'التشخيصات',
          type: 'pie',
          radius: ['0%', '72%'],
          center: ['50%', '56%'],
          avoidLabelOverlap: true,
          minAngle: 8,
          label: {
            show: true,
            formatter: '{b}: {d}%',
            color: '#55627f',
            fontFamily: 'Cairo, sans-serif',
            fontSize: 12
          },
          labelLine: {
            lineStyle: {
              color: '#9aa4e5'
            }
          },
          data: dataset.values
        }
      ]
    };
  }

  function getOrCreateChart(root) {
    if (!window.echarts || !root) return null;
    if (!chartInstances.has(root)) {
      chartInstances.set(root, window.echarts.init(root, null, { renderer: 'canvas' }));
    }
    return chartInstances.get(root);
  }

  function createTrackingCardMarkup(chartKey) {
    const title = chartTitles[chartKey] || '';
    const pieClass = chartKey === 'diagnoses' ? ' dashboard-chart-surface--pie' : '';

    return `
      <h3>${title}</h3>
      <div class="dashboard-tracking-toolbar">
        <div class="dashboard-periods" data-period-group="${chartKey}">
          <button class="period-pill" type="button" data-period="year">1س</button>
          <button class="period-pill period-pill--active" type="button" data-period="month">1ش</button>
          <button class="period-pill" type="button" data-period="day">1ي</button>
        </div>
        <button type="button" class="tracking-date-range" data-tracking-range="${chartKey}" aria-label="نطاق التاريخ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span data-date-from></span>
          <span class="tracking-date-sep">-</span>
          <span data-date-to></span>
        </button>
      </div>
      <div class="dashboard-empty-panel" data-empty-state hidden><span>لا يوجد بيانات</span><span class="request-empty-icon">i</span></div>
      <div class="dashboard-chart-surface${pieClass}" data-chart-root></div>
    `;
  }

  function hydrateTrackingCards() {
    const cards = Array.from(document.querySelectorAll('.dashboard-tracking-grid .dashboard-tracking-card'));
    const chartKeys = Object.keys(chartTitles);

    cards.forEach((card, index) => {
      const chartKey = chartKeys[index];
      if (!chartKey) return;
      card.dataset.chartCard = chartKey;
      card.innerHTML = createTrackingCardMarkup(chartKey);
      chartState[chartKey] = 'month';
    });
  }

  function renderChartCard(chartKey) {
    const card = document.querySelector(`[data-chart-card="${chartKey}"]`);
    const chartConfig = dashboardChartsData[chartKey];
    if (!card || !chartConfig) return;

    const period = chartState[chartKey] || 'month';
    const periodData = chartConfig.periods[period];
    const isPie = chartConfig.type === 'pie';
    const hasData = isPie ? hasPieData(periodData) : hasLineData(periodData);
    const emptyState = card.querySelector('[data-empty-state]');
    const root = card.querySelector('[data-chart-root]');
    const dateFrom = card.querySelector('[data-date-from]');
    const dateTo = card.querySelector('[data-date-to]');

    if (dateFrom) dateFrom.textContent = periodData?.dateFrom || '';
    if (dateTo) dateTo.textContent = periodData?.dateTo || '';

    card.classList.toggle('is-empty', !hasData);
    if (emptyState) emptyState.hidden = hasData;

    card.querySelectorAll('[data-period]').forEach((button) => {
      const isActive = button.dataset.period === period;
      button.classList.toggle('period-pill--active', isActive);
    });

    const chart = getOrCreateChart(root);
    if (!chart) return;

    if (!hasData) {
      chart.clear();
      chart.resize();
      return;
    }

    const option = isPie ? buildPieOption(periodData) : buildLineOption(periodData);
    chart.setOption(option, true);
    chart.resize();
  }

  const trackingRangeState = {};

  function initTrackingRangePickers() {
    if (!window.ArDatePicker) return;

    document.querySelectorAll('[data-tracking-range]').forEach((trigger) => {
      const chartKey = trigger.dataset.trackingRange;
      if (!chartKey) return;

      trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const period = chartState[chartKey] || 'month';
        const fallbackRange = trackingRangeState[chartKey]
          || window.ArDatePicker.getPeriodRange(period);

        window.ArDatePicker.open({
          anchor: trigger,
          mode: 'range',
          rangeStart: trackingRangeState[chartKey]?.start || fallbackRange.start,
          rangeEnd: trackingRangeState[chartKey]?.end || fallbackRange.end,
          onRangeSelect: ({ start, end }) => {
            trackingRangeState[chartKey] = { start, end };
            const dateFrom = trigger.querySelector('[data-date-from]');
            const dateTo = trigger.querySelector('[data-date-to]');
            if (dateFrom) dateFrom.textContent = window.ArDatePicker.formatArabicDate(start);
            if (dateTo) dateTo.textContent = window.ArDatePicker.formatArabicDate(end);
          }
        });
      });
    });
  }

  function initStatsPeriodFilters() {
    const periodGroup = document.querySelector('[data-stats-period-group]');
    const rangeTrigger = document.querySelector('[data-stats-range-trigger]');
    const rangeLabel = document.querySelector('[data-stats-range-label]');
    if (!periodGroup || !rangeTrigger || !window.ArDatePicker) return;

    let activePeriod = 'day';
    let customRange = null;
    const anchorDate = new Date(2026, 4, 22);

    function syncStatsRangeLabel() {
      if (!rangeLabel) return;
      if (customRange) {
        rangeLabel.textContent = window.ArDatePicker.formatArabicRange(customRange.start, customRange.end);
        return;
      }
      const { start, end } = window.ArDatePicker.getPeriodRange(activePeriod, anchorDate);
      rangeLabel.textContent = window.ArDatePicker.formatArabicRange(start, end);
    }

    function setActivePeriod(period) {
      activePeriod = period;
      customRange = null;
      periodGroup.querySelectorAll('[data-stats-period]').forEach((pill) => {
        pill.classList.toggle('is-active', pill.dataset.statsPeriod === period);
      });
      syncStatsRangeLabel();
    }

    periodGroup.addEventListener('click', (event) => {
      const pill = event.target.closest('[data-stats-period]');
      if (!pill) return;
      setActivePeriod(pill.dataset.statsPeriod || 'day');
    });

    rangeTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const fallback = customRange || window.ArDatePicker.getPeriodRange(activePeriod, anchorDate);
      window.ArDatePicker.open({
        anchor: rangeTrigger,
        mode: 'range',
        rangeStart: fallback.start,
        rangeEnd: fallback.end,
        onRangeSelect: ({ start, end }) => {
          customRange = { start, end };
          periodGroup.querySelectorAll('[data-stats-period]').forEach((pill) => {
            pill.classList.remove('is-active');
          });
          syncStatsRangeLabel();
        }
      });
    });

    setActivePeriod('day');
  }

  function initWeeklySummaryFilter() {
    const rangeTrigger = document.querySelector('[data-weekly-summary-range]');
    const rangeLabel = document.querySelector('[data-weekly-summary-range-label]');
    if (!rangeTrigger || !window.ArDatePicker) return;

    const weeklyRange = {
      start: new Date(2026, 3, 25),
      end: new Date(2026, 4, 1)
    };

    if (rangeLabel) {
      rangeLabel.textContent = window.ArDatePicker.formatArabicRange(weeklyRange.start, weeklyRange.end);
    }

    rangeTrigger.addEventListener('click', (event) => {
      event.stopPropagation();
      window.ArDatePicker.open({
        anchor: rangeTrigger,
        mode: 'range',
        rangeStart: weeklyRange.start,
        rangeEnd: weeklyRange.end,
        onRangeSelect: ({ start, end }) => {
          weeklyRange.start = start;
          weeklyRange.end = end;
          if (rangeLabel) {
            rangeLabel.textContent = window.ArDatePicker.formatArabicRange(start, end);
          }
        }
      });
    });
  }

  function initUsageReportModal() {
    const modal = document.getElementById('usage-report-modal');
    if (!modal || !window.ArDatePicker) return;

    const usageDates = {
      start: new Date(2026, 3, 22),
      end: new Date(2026, 4, 22)
    };

    modal.querySelectorAll('[data-usage-date]').forEach((trigger) => {
      const key = trigger.dataset.usageDate;
      const label = trigger.querySelector(`[data-usage-date-label="${key}"]`);

      trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        window.ArDatePicker.open({
          anchor: trigger,
          mode: 'single',
          defaultDate: usageDates[key],
          onSelect: (date) => {
            usageDates[key] = date;
            if (label) label.textContent = window.ArDatePicker.formatArabicDate(date);
          }
        });
      });
    });

    const submitButton = modal.querySelector('[data-usage-report-submit]');
    const confirmInput = modal.querySelector('.usage-report-confirm input');
    const reportInputs = modal.querySelectorAll('.usage-report-option input');

    submitButton?.addEventListener('click', () => {
      const hasType = Array.from(reportInputs).some((input) => input.checked);
      const hasConfirm = !!confirmInput?.checked;

      if (!hasType) {
        window.alert('رجاء اختيار نوع التقرير.');
        return;
      }

      if (!hasConfirm) {
        window.alert('رجاء الموافقة على تحمل مسؤولية تنزيل البيانات.');
        return;
      }

      if (usageDates.end < usageDates.start) {
        window.alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية.');
        return;
      }

      modal.classList.remove('is-open');
    });
  }

  function initDashboardCharts() {
    hydrateTrackingCards();

    Object.keys(dashboardChartsData).forEach((chartKey) => {
      renderChartCard(chartKey);
    });

    document.querySelectorAll('[data-period-group]').forEach((group) => {
      group.addEventListener('click', (event) => {
        const button = event.target.closest('[data-period]');
        if (!button) return;
        const chartKey = group.dataset.periodGroup;
        chartState[chartKey] = button.dataset.period || 'month';
        delete trackingRangeState[chartKey];
        renderChartCard(chartKey);
      });
    });

    initTrackingRangePickers();

    window.addEventListener('resize', () => {
      chartInstances.forEach((chart) => chart.resize());
    });
  }


  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('is-open');
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('is-open');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) overlay.classList.remove('is-open');
    });
  });

  languageToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    setLanguageMenuOpen(!languageSwitcher.classList.contains('is-open'));
  });

  languageOptions.forEach((option) => {
    option.addEventListener('click', () => {
      applyLanguage(option.dataset.languageOption || 'ar');
      setLanguageMenuOpen(false);
    });
  });

  document.addEventListener('click', (event) => {
    if (!languageSwitcher || languageSwitcher.contains(event.target)) return;
    setLanguageMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach((modal) => {
        modal.classList.remove('is-open');
      });
      setLanguageMenuOpen(false);
    }
  });

  applyLanguage(getInitialLanguage());
  initDashboardCharts();
  initStatsPeriodFilters();
  initWeeklySummaryFilter();
  initUsageReportModal();
})();

