(function(window){
  const diagnoses = [
    'صعوبات التعلم',
    'اضطراب فرط الحركة وتشتت الانتباه',
    'اضطراب طيف التوحد',
    'الاضطرابات الانفعالية',
    'اضطراب النطق',
    'بطء تعلم',
    'شلل دماغي',
    'إعاقة متعددة',
    'متلازمة داون',
    'أخرى'
  ];

  const beneficiaries = ['آدم', 'محمود تمام', 'محمد علي', 'دنيا', 'محمود تمام حدادريس'];

  const goals = [
    'تحسين التواصل البصري',
    'زيادة الانتباه أثناء التعليمات',
    'تقليل السلوك الاندفاعي',
    'تنمية مهارات التفاعل الاجتماعي',
    'تحسين مخارج الحروف',
    'تنمية المهارات اللغوية التعبيرية'
  ];

  const seedEvaluations = [
    {
      id: 'eval_1',
      title: 'اهلا بيك في المكتبة',
      diagnosis: ['اضطراب طيف التوحد'],
      description: '<p>سيناريو توضيحي</p>',
      beneficiaries: ['MRS AMA SIDDIG'],
      createdAt: '2026-05-02',
      owner: 'Ynmo Data Super Admin',
      archived: false,
      sections: [
        {
          id: 'sec_1',
          title: 'المهارات الاجتماعية',
          items: [
            {
              id: 'item_1',
              title: 'يتواصل بصرياً',
              type: 'multiple',
              notes: '',
              options: [
                { id: 'opt_1', label: 'دائماً', score: 3, goals: [] },
                { id: 'opt_2', label: 'أحياناً', score: 2, goals: [] },
                { id: 'opt_3', label: 'نادراً', score: 1, goals: [] }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'eval_2',
      title: 'تقييم التعليم الخاص',
      diagnosis: ['صعوبات التعلم'],
      description: '<p>وصف مبدئي</p>',
      beneficiaries: [],
      createdAt: '2026-05-02',
      owner: 'Ynmo Data Super Admin',
      archived: false,
      sections: []
    }
  ];

  window.MockData = {
    diagnoses,
    beneficiaries,
    goals,
    seedEvaluations
  };
})(window);
