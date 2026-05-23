(function () {
  const treeRoot = document.querySelector("[data-library-tree]");
  const searchInput = document.querySelector("[data-library-search]");
  const keywordsRoot = document.querySelector("[data-library-keywords]");
  const rootTabs = Array.from(document.querySelectorAll("[data-library-root-tab]"));
  const addCurriculumBtn = document.querySelector("[data-library-add-btn]");
  const createScreen = document.querySelector("[data-library-create-screen]");
  const createBody = document.querySelector("[data-library-create-body]");
  const catalogSection = document.querySelector(".library-course-list");
  const libraryHero = document.querySelector(".library-hero");
  const libraryPage = document.querySelector(".library-page");
  let treeLines = null;
  let treeLinesFrame = 0;

  if (!treeRoot) return;

  /*
    Data relationship:
    curriculum -> aspects -> long goals -> short goals

    Archived content can exist at:
    1. curriculum level (root archived tab)
    2. aspect level (archived aspects)
    3. long-goal level (archived long goals)
  */
  const libraryData = {
    active: [
      {
        id: "language-skills",
        title: "المهارات اللغوية",
        status: "مهيكل",
        keywords: ["اللغة", "التواصل", "التعبير"],
        aspects: [
          {
            id: "aspect-lang-1",
            title: "اللغة التعبيرية والاستقبالية",
            longGoals: [
              {
                id: "lg-lang-1",
                title: "زيادة الحصيلة اللغوية والتعبير الشفهي",
                shortGoals: [
                  {
                    id: "sg-lang-rich",
                    name: "أن يستخدم التلميذ المفردات الأساسية ذات الصلة بالمجتمع المحلي والمعطاة له في جمل مفيدة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-lang-2",
                    name: "أن يربط التلميذ الكلمة بالصورة المناسبة لها.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-lang-3",
                    name: "أن يصف التلميذ نشاطاً يومياً بجملة مفيدة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          }
        ],
        archivedAspects: []
      },
      {
        id: "science-skills",
        title: "العلوم والأنشطة العملية",
        status: "مهيكل",
        keywords: ["العلوم", "العملي", "التجارب"],
        aspects: [
          {
            id: "aspect-sci-1",
            title: "الملاحظة والتصنيف",
            longGoals: [
              {
                id: "lg-sci-1",
                title: "تصنيف الكائنات الحية والمواد الطبيعية",
                shortGoals: [
                  {
                    id: "sg-sci-1",
                    name: "أن يحدد التلميذ الفرق بين الكائنات الحية وغير الحية.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-sci-2",
                    name: "أن يصنف المواد إلى صلبة وسائلة وغازية.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          }
        ],
        archivedAspects: []
      },
      {
        id: "recreational-activities",
        title: "الأنشطة الترويحية",
        status: "مهيكل",
        keywords: ["الترويح", "اللعب", "النشاط"],
        aspects: [
          {
            id: "aspect-rec-1",
            title: "الألعاب الجماعية والتعاون",
            longGoals: [
              {
                id: "lg-rec-1",
                title: "المشاركة والتفاعل الإيجابي مع الأقران",
                shortGoals: [
                  {
                    id: "sg-rec-1",
                    name: "أن ينتظر دوره في اللعبة الجماعية بصدر رحب.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-rec-2",
                    name: "أن يشارك الأدوات الرياضية مع زملائه.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          }
        ],
        archivedAspects: []
      },
      {
        id: "islamic-education",
        title: "التربية الإسلامية",
        status: "مهيكل",
        keywords: ["الدين", "التربية", "الأخلاق"],
        aspects: [
          {
            id: "aspect-isl-1",
            title: "العبادات والآداب",
            longGoals: [
              {
                id: "lg-isl-1",
                title: "تعلم خطوات الوضوء والصلاة الصحيحة",
                shortGoals: [
                  {
                    id: "sg-isl-1",
                    name: "أن يطبق التلميذ خطوات الوضوء بالترتيب.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-isl-2",
                    name: "أن يؤدي حركات الصلاة الأساسية بطمأنينة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          }
        ],
        archivedAspects: []
      },
      {
        id: "special-education",
        title: "منهج التعليم الخاص",
        status: "مهيكل",
        keywords: ["التواصل", "التكيف", "المعرفي"],
        aspects: [
          {
            id: "communication",
            title: "مهارات التواصل",
            longGoals: [
              {
                id: "verbal-initiation",
                title: "المبادرة اللفظية في المواقف اليومية",
                shortGoals: [
                  {
                    id: "sg-se-comm-vi-1",
                    name: "يستخدم كلمات وظيفية لطلب الاحتياجات الأساسية.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-comm-vi-2",
                    name: "يبدأ الحديث مع المعلم أو الزميل بجملة مفهومة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-comm-vi-3",
                    name: "يعبر عن الموافقة أو الرفض لفظيًا دون تردد.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              },
              {
                id: "sentence-expansion",
                title: "توسيع الجملة من كلمتين إلى أربع كلمات",
                shortGoals: [
                  {
                    id: "sg-se-comm-se-1",
                    name: "يبني جملة من كلمتين لوصف صورة مألوفة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-comm-se-2",
                    name: "يضيف صفة أو ظرفًا إلى الجملة عند التوجيه.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-comm-se-3",
                    name: "يصف نشاطه اليومي بجملة من أربع كلمات.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: [
              {
                id: "visual-prompts",
                title: "استخدام الإشارات البصرية لدعم الفهم",
                shortGoals: [
                  {
                    id: "sg-se-comm-vp-1",
                    name: "يشير إلى الصورة المناسبة عند سماع المفردة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-comm-vp-2",
                    name: "يتبع تعليمات من خطوتين بالاعتماد على الصور.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ]
          },
          {
            id: "social-adaptation",
            title: "التكيف الاجتماعي",
            longGoals: [
              {
                id: "turn-taking",
                title: "المشاركة والتناوب أثناء اللعب الجماعي",
                shortGoals: [
                  {
                    id: "sg-se-sa-tt-1",
                    name: "ينتظر دوره لمدة 30 ثانية دون انسحاب.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-sa-tt-2",
                    name: "يسلم الأداة للزميل بعد انتهاء دوره.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-sa-tt-3",
                    name: "يطلب دوره بعبارة مهذبة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              },
              {
                id: "classroom-routines",
                title: "اتباع الروتين الصفي اليومي باستقلالية",
                shortGoals: [
                  {
                    id: "sg-se-sa-cr-1",
                    name: "ينتقل بين المحطات دون تذكير مباشر.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-sa-cr-2",
                    name: "يرتب أدواته بعد انتهاء النشاط.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          },
          {
            id: "cognitive-skills",
            title: "المهارات المعرفية",
            longGoals: [
              {
                id: "sorting",
                title: "تصنيف العناصر حسب الفئة والوظيفة",
                shortGoals: [
                  {
                    id: "sg-se-cs-s-1",
                    name: "يصنف الصور إلى طعام وملابس وأدوات.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-se-cs-s-2",
                    name: "يشرح سبب التصنيف بكلمة أو كلمتين.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: [
              {
                id: "matching",
                title: "مطابقة الشكل بالصورة المماثلة",
                shortGoals: [
                  {
                    id: "sg-se-cs-m-1",
                    name: "يطابق ثلاث بطاقات متشابهة بصريًا.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ]
          }
        ],
        archivedAspects: [
          {
            id: "archived-reading",
            title: "مهارات القراءة المبكرة",
            longGoals: [
              {
                id: "sound-awareness",
                title: "تمييز الأصوات الأولية في الكلمات",
                shortGoals: [
                  {
                    id: "sg-se-ar-sa-1",
                    name: "يحدد الصوت الأول في ثلاث كلمات مصورة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          }
        ]
      },
      {
        id: "language-program",
        title: "المنهج اللغوي المكثف",
        status: "مهيكل",
        keywords: ["اللغة", "السرد", "الفهم"],
        aspects: [
          {
            id: "receptive-language",
            title: "اللغة الاستقبالية",
            longGoals: [
              {
                id: "follow-directions",
                title: "فهم التعليمات متعددة الخطوات",
                shortGoals: [
                  {
                    id: "sg-lp-rl-fd-1",
                    name: "ينفذ تعليمات من خطوتين متتاليتين.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-lp-rl-fd-2",
                    name: "يميز بين فوق وتحت وأمام وخلف داخل النشاط.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          },
          {
            id: "expressive-language",
            title: "اللغة التعبيرية",
            longGoals: [
              {
                id: "story-retell",
                title: "إعادة سرد أحداث قصيرة بترتيب واضح",
                shortGoals: [
                  {
                    id: "sg-lp-el-sr-1",
                    name: "يذكر بداية الحدث ونهايته في جملة قصيرة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-lp-el-sr-2",
                    name: "يستخدم أدوات الربط البسيطة أثناء السرد.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: [
              {
                id: "naming-objects",
                title: "تسمية الأشياء المألوفة",
                shortGoals: [
                  {
                    id: "sg-lp-el-no-1",
                    name: "يسمي 10 أدوات صفية دون مساعدة.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ]
          }
        ],
        archivedAspects: []
      },
      {
        id: "functional-skills",
        title: "منهج المهارات الوظيفية",
        status: "مهيكل",
        keywords: ["المهارات", "الاستقلالية", "الحياة اليومية"],
        aspects: [
          {
            id: "daily-living",
            title: "مهارات الحياة اليومية",
            longGoals: [
              {
                id: "self-care",
                title: "إدارة خطوات العناية الذاتية باستقلالية",
                shortGoals: [
                  {
                    id: "sg-fs-dl-sc-1",
                    name: "يغسل يديه باتباع التسلسل الصحيح.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  },
                  {
                    id: "sg-fs-dl-sc-2",
                    name: "يرتب أدواته الشخصية بعد الانتهاء.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          }
        ],
        archivedAspects: []
      }
    ],
    archived: [
      {
        id: "foundation-program",
        title: "المنهج التأسيسي المؤرشف",
        status: "مهيكل",
        keywords: ["الانتقال", "التأسيس", "التمييز"],
        aspects: [
          {
            id: "pre-academics",
            title: "ما قبل الأكاديمي",
            longGoals: [
              {
                id: "visual-discrimination",
                title: "التمييز البصري بين الأشكال الأساسية",
                shortGoals: [
                  {
                    id: "sg-fpa-vd-1",
                    name: "يختار الشكل المطابق من بين ثلاثة خيارات.",
                    collectionType: "المساعدات",
                    options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
                    masteryMode: "إتقان يدوي",
                    attempts: 5
                  }
                ],
                archivedShortGoals: []
              }
            ],
            archivedLongGoals: []
          }
        ],
        archivedAspects: []
      }
    ]
  };

  const state = {
    rootTab: "active",
    search: "",
    menuOpenId: null,
    openIds: new Set(),
    panelTabs: {
      "curriculum:special-education": "active",
      "curriculum:language-program": "active",
      "curriculum:functional-skills": "active",
      "curriculum:foundation-program": "active",
      "aspect:communication": "active",
      "aspect:social-adaptation": "active",
      "aspect:cognitive-skills": "active",
      "aspect:expressive-language": "active",
      "aspect:pre-academics": "active"
    },
    createStep: "type-selection",
    createMode: "",
    createTitle: "",
    shortGoalsDraft: [],
    shortGoalForm: null,
    shortAdvancedOpen: false,
    pendingShortGoalScroll: "",
    inlineAspectAddingCurriculumId: null,
    inlineAspectName: "",
    inlineAspectError: "",
    inlineAspectTouched: false,
    inlineLongGoalAddingAspectId: null,
    inlineLongGoalName: "",
    inlineLongGoalError: "",
    inlineLongGoalTouched: false,
    inlineShortGoalAddingLongGoalId: null,
    inlineShortGoalName: "",
    inlineShortGoalError: "",
    inlineShortGoalTouched: false,
    editingShortGoalId: null,
    addingShortGoalToTreeLongGoalId: null,
    get curriculums() {
      return [...(libraryData.active || []), ...(libraryData.archived || [])];
    }
  };

  const quickKeywords = ["التواصل", "اللغة", "المهارات", "الانتقال", "التكيف"];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function createCurriculumId() {
    return `curriculum-${Date.now()}`;
  }

  function findCurriculumById(id) {
    const activeIndex = libraryData.active.findIndex((item) => item.id === id);
    if (activeIndex !== -1) return { list: "active", index: activeIndex };
    const archivedIndex = libraryData.archived.findIndex((item) => item.id === id);
    if (archivedIndex !== -1) return { list: "archived", index: archivedIndex };
    return null;
  }

  function findAspectById(id) {
    for (const list of ["active", "archived"]) {
      for (const curr of libraryData[list]) {
        const asp = [...(curr.aspects || []), ...(curr.archivedAspects || [])].find((a) => a.id === id);
        if (asp) return asp;
      }
    }
    return null;
  }

  function findAspectParent(aspectId) {
    for (const listName of ["active", "archived"]) {
      for (const curriculum of libraryData[listName]) {
        let idx = (curriculum.aspects || []).findIndex(a => a.id === aspectId);
        if (idx !== -1) {
          return { curriculum, list: listName, aspectsList: curriculum.aspects, index: idx };
        }
        idx = (curriculum.archivedAspects || []).findIndex(a => a.id === aspectId);
        if (idx !== -1) {
          return { curriculum, list: listName, aspectsList: curriculum.archivedAspects, index: idx };
        }
      }
    }
    return null;
  }

  function findLongGoalParent(longGoalId) {
    for (const listName of ["active", "archived"]) {
      for (const curriculum of libraryData[listName]) {
        for (const aspect of [...(curriculum.aspects || []), ...(curriculum.archivedAspects || [])]) {
          let idx = (aspect.longGoals || []).findIndex(lg => lg.id === longGoalId);
          if (idx !== -1) {
            return { aspect, longGoalsList: aspect.longGoals, index: idx };
          }
          idx = (aspect.archivedLongGoals || []).findIndex(lg => lg.id === longGoalId);
          if (idx !== -1) {
            return { aspect, longGoalsList: aspect.archivedLongGoals, index: idx };
          }
        }
      }
    }
    return null;
  }

  function findShortGoalParent(shortGoalId) {
    for (const listName of ["active", "archived"]) {
      for (const curriculum of libraryData[listName]) {
        for (const aspect of [...(curriculum.aspects || []), ...(curriculum.archivedAspects || [])]) {
          for (const lg of [...(aspect.longGoals || []), ...(aspect.archivedLongGoals || [])]) {
            let idx = (lg.shortGoals || []).findIndex(sg => sg.id === shortGoalId);
            if (idx !== -1) {
              return { longGoal: lg, shortGoalsList: lg.shortGoals, index: idx };
            }
            idx = (lg.archivedShortGoals || []).findIndex(sg => sg.id === shortGoalId);
            if (idx !== -1) {
              return { longGoal: lg, shortGoalsList: lg.archivedShortGoals, index: idx };
            }
          }
        }
      }
    }
    return null;
  }

  function addCurriculum(title, mode) {
    let aspects = [];
    
    if (mode === "structured" && state.structuredAspectsDraft) {
      aspects = state.structuredAspectsDraft.map((a, i) => ({
        id: `aspect-${Date.now()}-${i}`,
        title: a.name,
        longGoals: [],
        archivedLongGoals: []
      }));
    } else if (mode === "simple" && state.shortGoalsDraft) {
      const shortGoals = state.shortGoalsDraft.map((g, i) => {
        const form = g.form;
        
        // Match collectionType with its Arabic label
        const collectionTypeObj = collectionTypes.find(c => c.id === form.collectionType);
        const collectionTypeLabel = collectionTypeObj ? collectionTypeObj.label : form.collectionType;
        
        // Mastery mode Arabic label
        const masteryModeLabel = form.masteryMode === "auto" ? "إتقان تلقائي" : "إتقان يدوي";
        
        // Build option list depending on collectionType
        let options = [];
        if (form.collectionType === "assistances") {
          options = Array.isArray(form.assistanceOptions) ? form.assistanceOptions.slice() : [];
        } else if (form.collectionType === "task-analysis") {
          options = Array.isArray(form.taskAnalysisItems) ? form.taskAnalysisItems.slice() : [];
        } else if (form.collectionType === "rate") {
          options = [`الهدف: ${form.rateGoal || 0}`, `الزمن: ${form.rateMinutes || 1} دقيقة`];
        } else if (form.collectionType === "duration") {
          options = [`دقائق: ${form.durationMinutes || 1}`, `ثواني: ${form.durationSeconds || 0}`];
        } else if (form.collectionType === "frequency") {
          options = ["سلوك قابل للتكرار"];
        } else if (form.collectionType === "descriptive") {
          options = ["ملاحظات وصفية للأداء"];
        } else if (form.collectionType === "likert") {
          options = ["مقياس ليكرت المتدرج"];
        }

        return {
          id: `sg-${Date.now()}-${i}`,
          name: form.name.trim(),
          collectionType: collectionTypeLabel,
          options: options,
          masteryMode: masteryModeLabel,
          attempts: form.attemptsPerSession || 1,
          instructions: form.instructions || "",
          objectives: form.objectives || "",
          materials: form.materials || "",
          activities: form.activities || ""
        };
      });

      aspects.push({
        id: `aspect-${Date.now()}-default`,
        title: "عام",
        longGoals: [
          {
            id: `lg-${Date.now()}-default`,
            title: "الأهداف العامة",
            shortGoals: shortGoals,
            archivedShortGoals: []
          }
        ],
        archivedLongGoals: []
      });
    }
      
    const newItem = {
      id: createCurriculumId(),
      title: title.trim(),
      status: mode === "simple" ? "مبسط" : "مهيكل",
      keywords: [],
      aspects: aspects,
      archivedAspects: []
    };
    libraryData.active.unshift(newItem);
    state.rootTab = "active";
    state.search = "";
    state.menuOpenId = null;
    renderTree();
    return newItem;
  }


  const collectionTypes = [
    { id: "assistances", label: "المساعدات", icon: "globe" },
    { id: "rate", label: "المعدل", icon: "list-checks" },
    { id: "duration", label: "المدة الزمنية", icon: "timer" },
    { id: "frequency", label: "التكرار", icon: "rotate-ccw" },
    { id: "descriptive", label: "الوصفية", icon: "file-text" },
    { id: "task-analysis", label: "تحليل المهام", icon: "scroll-text" },
    { id: "likert", label: "مقياس ليكرت", icon: "square-pen" }
  ];

  const shortGoalExitUrl = "./evaluation-structure.html";

  function getDefaultShortGoalForm() {
    const defaultAssistanceOptions = [
      "بمفرده",
      "خاطئة",
      "مساعدة إيمائية",
      "مساعدة لفظية",
      "نموذج",
      "مساعدة جسدية جزئية",
      "مساعدة جسدية كاملة"
    ];
    return {
      collectionType: "assistances",
      name: "",
      instructions: "",
      objectives: "",
      materials: "",
      activities: "",
      rateGoal: 0,
      rateMinutes: 1,
      durationMinutes: 1,
      durationSeconds: 0,
      assistanceType: "fixed",
      selectedAssistanceOption: 0,
      assistanceOptions: defaultAssistanceOptions,
      masteryMode: "auto",
      masteryAttempts: 1,
      masteryPeriods: 1,
      masteryPercent: 50,
      attemptsPerSession: 1,
      taskAnalysisItems: [""],
      advancedAssistance: {}
    };
  }

  function resetShortGoalForm() {
    state.shortGoalForm = getDefaultShortGoalForm();
    state.shortAdvancedOpen = false;
    state.pendingShortGoalScroll = "";
  }

  function getShortGoalForm() {
    if (!state.shortGoalForm) {
      resetShortGoalForm();
    }
    return state.shortGoalForm;
  }

  function showToast(message) {
    if (window.FlowModal && typeof window.FlowModal.toast === "function") {
      window.FlowModal.toast(message);
      return;
    }

    const existing = document.querySelector(".app-toast");
    existing?.remove();

    const el = document.createElement("div");
    el.className = "app-toast";
    el.textContent = message;
    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add("is-show"));
    window.setTimeout(() => {
      el.classList.remove("is-show");
      window.setTimeout(() => el.remove(), 220);
    }, 1800);
  }

  function openSimpleModeNoticeModal(onContinue) {
    const existingModal = document.querySelector(".library-flow-modal--notice");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "modal-overlay is-open library-flow-modal library-flow-modal--notice";
    modal.innerHTML = `
      <div class="modal-dialog library-flow-dialog library-flow-dialog--notice">
        <button class="modal-close library-flow-close" type="button" aria-label="إغلاق">×</button>
        <div class="library-flow-note-icon" aria-hidden="true">✋</div>
        <h3>يرجى الملاحظة</h3>
        <p>لقد قمت باختيار مبسط، ولا يمكن تغيير هذا الاختيار في المستقبل.</p>
        <div class="library-flow-actions">
          <button type="button" class="btn-cancel" data-flow-cancel>إلغاء</button>
          <button type="button" class="btn-save-secondary" data-flow-continue>استمرار</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector(".library-flow-close")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    modal.querySelector("[data-flow-cancel]")?.addEventListener("click", close);
    modal.querySelector("[data-flow-continue]")?.addEventListener("click", () => {
      close();
      if (typeof onContinue === "function") onContinue();
    });
  }

  function openQuickEditModal(curriculum, onSave) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay is-open library-flow-modal";
    modal.innerHTML = `
      <div class="modal-dialog library-flow-dialog library-flow-dialog--edit">
        <button class="modal-close library-flow-close" type="button" aria-label="إغلاق">×</button>
        <h2 class="modal-title">تعديل المناهج</h2>

        <label class="modal-field has-value">
          <span class="modal-field-label">اسم المنهج <em>*</em></span>
          <input type="text" data-edit-title value="${escapeHtml(curriculum.title)}">
        </label>

        <div class="library-flow-actions">
          <button type="button" class="btn-cancel" data-edit-cancel>إلغاء</button>
          <button type="button" class="btn-save" data-edit-save>تعديل</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector(".library-flow-close")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    modal.querySelector("[data-edit-cancel]")?.addEventListener("click", close);
    modal.querySelector("[data-edit-save]")?.addEventListener("click", () => {
      const input = modal.querySelector("[data-edit-title]");
      const nextTitle = (input?.value || "").trim();
      if (!nextTitle) return;
      onSave(nextTitle);
      close();
    });
  }

  function openDeleteConfirmModal(curriculumTitle, onConfirm) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay is-open library-flow-modal";
    modal.innerHTML = `
      <div class="modal-dialog library-flow-dialog library-flow-dialog--delete">
        <button class="modal-close library-flow-close" type="button" aria-label="إغلاق">×</button>
        <i class="library-delete-icon" data-lucide="octagon-x" aria-hidden="true"></i>
        <h3>أنت على وشك أن تحذف ${escapeHtml(curriculumTitle)}</h3>
        <p>هل أنت متأكد أنك تريد المتابعة؟</p>
        <div class="library-delete-actions">
          <button type="button" class="library-delete-cancel" data-delete-cancel>إلغاء</button>
          <button type="button" class="library-delete-confirm" data-delete-confirm>حذف</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    renderLucideIcons();

    const close = () => modal.remove();
    modal.querySelector(".library-flow-close")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    modal.querySelector("[data-delete-cancel]")?.addEventListener("click", close);
    modal.querySelector("[data-delete-confirm]")?.addEventListener("click", () => {
      onConfirm();
      close();
    });
  }

  function openQuickEditItemModal(title, label, currentValue, onSave) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay is-open library-flow-modal";
    modal.innerHTML = `
      <div class="modal-dialog library-flow-dialog library-flow-dialog--edit">
        <button class="modal-close library-flow-close" type="button" aria-label="إغلاق">×</button>
        <h2 class="modal-title">${escapeHtml(title)}</h2>
        <label class="modal-field has-value">
          <span class="modal-field-label">${escapeHtml(label)} <em>*</em></span>
          <input type="text" data-edit-title value="${escapeHtml(currentValue)}">
        </label>
        <div class="library-flow-actions">
          <button type="button" class="btn-cancel" data-edit-cancel>إلغاء</button>
          <button type="button" class="btn-save" data-edit-save>تعديل</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector(".library-flow-close")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    modal.querySelector("[data-edit-cancel]")?.addEventListener("click", close);
    modal.querySelector("[data-edit-save]")?.addEventListener("click", () => {
      const input = modal.querySelector("[data-edit-title]");
      const nextVal = (input?.value || "").trim();
      if (!nextVal) return;
      onSave(nextVal);
      close();
    });
  }

  /* --- بيانات المستفيدين (Mock) --- */
  const beneficiariesList = [
    { id: "b-1", name: "ابراهيم السيد", activeGoals: 5 },
    { id: "b-2", name: "ادم", activeGoals: 5 },
    { id: "b-3", name: "محمود تمام", activeGoals: 4 },
    { id: "b-4", name: "محمد علي", activeGoals: 5 },
    { id: "b-5", name: "دنيا", activeGoals: 5 }
  ];

  function openCopyToModal(shortGoal, onCopy) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay is-open library-flow-modal";
    
    const styles = `
      <style>
        .copy-beneficiary-item { transition: background-color 0.2s; }
        .copy-beneficiary-item:hover { background-color: #f0fdf4 !important; }
      </style>
    `;

    modal.innerHTML = styles + `
      <div class="modal-dialog library-flow-dialog library-flow-dialog--copy" style="width: min(92vw, 550px); max-height: 90vh; overflow: visible !important; padding: 40px; border-radius: 8px; position: relative; background: #fff;" dir="rtl">
        <button class="modal-close library-flow-close" type="button" aria-label="إغلاق" style="position: absolute; top: 24px; right: 24px; font-size: 24px; color: #9ca3af; background: none; border: none; cursor: pointer;">×</button>
        
        <h2 class="modal-title" style="margin-bottom: 40px; font-weight: 800; font-size: 1.6rem; color: #2f3651; text-align: center;">نسخ من البرنامج الفردي للمستفيد</h2>
        
        <div class="copy-beneficiary-field" style="margin-bottom: 20px;">
          <span style="display: block; font-size: 1.05rem; font-weight: 600; color: #1e293b; margin-bottom: 12px; text-align: right;">اسم المستفيد <em style="color: #ef4444; font-style: normal;">*</em></span>
          
          <div class="copy-beneficiary-select-wrap" style="position: relative;">
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 6px; background: #f3f4f6; min-height: 52px; position: relative;">
              <!-- Container for tags -->
              <div data-copy-tags-root style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-right: 6px;"></div>
              
              <!-- Input first (Right side in RTL) -->
              <input type="text" data-copy-beneficiary-search placeholder="اسم المستفيد" style="flex: 1; min-width: 60px; border: none; background: transparent; font-size: 1.05rem; color: #1e293b; outline: none; padding-right: 6px; font-family: inherit;" dir="rtl">
              
              <!-- Button second (Left side in RTL) -->
              <button type="button" data-copy-beneficiary-trigger style="width: 40px; height: 40px; border-radius: 6px; background: #1e9e58; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; margin-right: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </div>
            
            <div class="copy-beneficiary-dropdown" data-copy-beneficiary-dropdown style="display: none; position: absolute; top: calc(100% + 8px); right: 0; left: 0; background: #fff; border: 1px solid #f1f5f9; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,.08); z-index: 100; max-height: 280px; overflow-y: auto;">
              
              <div class="copy-beneficiary-item" style="display: flex; align-items: center; justify-content: flex-start; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; position: relative;" data-select-all>
                
                <!-- Checkbox (Far Right) -->
                <div class="copy-checkbox" data-toggle-all style="width: 24px; height: 24px; border-radius: 6px; border: 2px solid #cbd5e1; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; flex-shrink: 0; margin-left: 16px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                
                <span style="font-size: 1.05rem; font-weight: 500; color: #475569;">تحديد الكل</span>
              </div>
              
              ${beneficiariesList.map((b, index) => `
                <div class="copy-beneficiary-item" style="display: flex; align-items: center; justify-content: flex-start; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; position: relative; ${index === 0 ? 'background-color: #f0fdf4;' : ''}" data-beneficiary-id="${b.id}">
                  
                  <!-- Checkbox (Far Right) -->
                  <div class="copy-checkbox" data-toggle-beneficiary="${b.id}" style="width: 24px; height: 24px; border-radius: 6px; border: 2px solid #cbd5e1; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .2s; flex-shrink: 0; margin-left: 20px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  
                  <!-- User Icon (Middle Right) -->
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin-left: 12px; flex-shrink: 0;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  
                  <!-- Name (Middle) -->
                  <span style="font-size: 1.05rem; font-weight: 500; color: #1e293b; margin-left: 16px; white-space: nowrap;">${escapeHtml(b.name)}</span>
                  
                  <!-- Goals (Middle Left) -->
                  <span style="font-size: 0.95rem; font-weight: 500; color: #6d48a8; white-space: nowrap;">${b.activeGoals} الأهداف النشطة</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="library-flow-actions" style="margin-top: 40px; display: flex; justify-content: flex-end; gap: 16px;">
          <!-- Since flex-end in RTL pushes to left side, we put the primary button first in HTML to appear on right visually -->
          <button type="button" class="btn-save" data-copy-confirm style="min-width: 100px; padding: 10px 24px; font-size: 1.1rem; border-radius: 6px; background: #1e9e58; border: none; color: #fff; cursor: pointer; font-weight: 700;">نسخ</button>
          <button type="button" class="btn-cancel" data-copy-cancel style="min-width: 100px; padding: 10px 24px; font-size: 1.1rem; border: 1.5px solid #6d48a8; border-radius: 6px; background: #fff; color: #6d48a8; cursor: pointer; font-weight: 600;">إلغاء</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const trigger = modal.querySelector("[data-copy-beneficiary-trigger]");
    const dropdown = modal.querySelector("[data-copy-beneficiary-dropdown]");
    const searchInput = modal.querySelector("[data-copy-beneficiary-search]");
    const confirmBtn = modal.querySelector("[data-copy-confirm]");
    const selectedSet = new Set();

    function renderSelectedTags() {
      const tagsRoot = modal.querySelector("[data-copy-tags-root]");
      if (!tagsRoot) return;
      tagsRoot.innerHTML = beneficiariesList.filter(b => selectedSet.has(b.id)).map(b => `
        <div class="copy-tag-pill" style="display: flex; align-items: center; background: #e6f4ea; border: 1px solid #cbd5e1; border-radius: 20px; padding: 2px 8px; gap: 6px; height: 32px; box-sizing: border-box; direction: rtl;">
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span style="font-size: 0.95rem; font-weight: 600; color: #137333; white-space: nowrap;">${escapeHtml(b.name)}</span>
          <button type="button" data-remove-tag="${b.id}" style="border: none; background: none; color: #137333; font-size: 16px; cursor: pointer; font-weight: 700; display: flex; align-items: center; justify-content: center; padding: 0 2px; line-height: 1;">×</button>
        </div>
      `).join("");

      tagsRoot.querySelectorAll("[data-remove-tag]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const id = btn.getAttribute("data-remove-tag");
          selectedSet.delete(id);
          setToggleState(modal.querySelector(`[data-toggle-beneficiary="${id}"]`), false);
          updateSelectAllToggle();
          renderSelectedTags();
          updateInputPlaceholder();
        });
      });
    }

    function updateInputPlaceholder() {
      if (selectedSet.size > 0) {
        searchInput.placeholder = "";
      } else {
        searchInput.placeholder = "اسم المستفيد";
      }
    }

    function setToggleState(checkboxEl, active) {
      if (!checkboxEl) return;
      const svg = checkboxEl.querySelector("svg");
      if (active) {
        checkboxEl.style.background = "#1e9e58"; // Green color
        checkboxEl.style.borderColor = "#1e9e58";
        if (svg) svg.style.display = "block";
      } else {
        checkboxEl.style.background = "#fff";
        checkboxEl.style.borderColor = "#cbd5e1";
        if (svg) svg.style.display = "none";
      }
    }

    function updateSelectAllToggle() {
      const allToggle = modal.querySelector("[data-toggle-all]");
      setToggleState(allToggle, selectedSet.size === beneficiariesList.length && beneficiariesList.length > 0);
    }

    // Toggle dropdown
    const toggleDropdown = (e) => {
      e?.stopPropagation();
      const isOpen = dropdown.style.display !== "none";
      dropdown.style.display = isOpen ? "none" : "block";
    };

    trigger.addEventListener("click", toggleDropdown);
    searchInput.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display = "block";
    });

    searchInput.addEventListener("input", (e) => {
        dropdown.style.display = "block";
        const val = e.target.value.toLowerCase().trim();
        beneficiariesList.forEach(b => {
            const item = modal.querySelector(`[data-beneficiary-id="${b.id}"]`);
            if (item) {
                if (val === "" || b.name.toLowerCase().includes(val)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            }
        });
    });

    // Select All
    modal.querySelector("[data-select-all]")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (selectedSet.size === beneficiariesList.length) {
        selectedSet.clear();
        beneficiariesList.forEach(b => {
          setToggleState(modal.querySelector(`[data-toggle-beneficiary="${b.id}"]`), false);
        });
      } else {
        beneficiariesList.forEach(b => {
          selectedSet.add(b.id);
          setToggleState(modal.querySelector(`[data-toggle-beneficiary="${b.id}"]`), true);
        });
      }
      updateSelectAllToggle();
      renderSelectedTags();
      updateInputPlaceholder();
    });

    // Individual toggles
    beneficiariesList.forEach(b => {
      const item = modal.querySelector(`[data-beneficiary-id="${b.id}"]`);
      if (item) {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          if (selectedSet.has(b.id)) {
            selectedSet.delete(b.id);
          } else {
            selectedSet.add(b.id);
          }
          setToggleState(modal.querySelector(`[data-toggle-beneficiary="${b.id}"]`), selectedSet.has(b.id));
          updateSelectAllToggle();
          renderSelectedTags();
          updateInputPlaceholder();
        });
      }
    });

    // Close dropdown on outside click
    modal.addEventListener("click", (e) => {
      if (!e.target.closest(".copy-beneficiary-select-wrap")) {
        dropdown.style.display = "none";
      }
    });

    const close = () => modal.remove();
    modal.querySelector(".library-flow-close")?.addEventListener("click", close);
    modal.querySelector("[data-copy-cancel]")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    
    confirmBtn.addEventListener("click", () => {
      if (selectedSet.size === 0) {
        showToast("يرجى اختيار مستفيد واحد على الأقل");
        return;
      }
      const selectedNames = beneficiariesList.filter(b => selectedSet.has(b.id)).map(b => b.name).join("، ");
      showToast(`تم نسخ الهدف القصير إلى: ${selectedNames}`);
      close();
      onCopy(null, shortGoal.name);
    });
  }

  function toggleAspectArchive(aspectId) {
    const parent = findAspectParent(aspectId);
    if (!parent) return;
    const isArchived = parent.aspectsList === parent.curriculum.archivedAspects;
    const aspect = parent.aspectsList[parent.index];
    parent.aspectsList.splice(parent.index, 1);
    if (isArchived) {
      parent.curriculum.aspects = parent.curriculum.aspects || [];
      parent.curriculum.aspects.unshift(aspect);
      showToast("تم إلغاء أرشفة الجانب بنجاح");
    } else {
      parent.curriculum.archivedAspects = parent.curriculum.archivedAspects || [];
      parent.curriculum.archivedAspects.unshift(aspect);
      showToast("تم أرشفة الجانب بنجاح");
    }
    renderTree();
  }

  function toggleLongGoalArchive(longGoalId) {
    const parent = findLongGoalParent(longGoalId);
    if (!parent) return;
    const isArchived = parent.longGoalsList === parent.aspect.archivedLongGoals;
    const longGoal = parent.longGoalsList[parent.index];
    parent.longGoalsList.splice(parent.index, 1);
    if (isArchived) {
      parent.aspect.longGoals = parent.aspect.longGoals || [];
      parent.aspect.longGoals.unshift(longGoal);
      showToast("تم إلغاء أرشفة الهدف الطويل بنجاح");
    } else {
      parent.aspect.archivedLongGoals = parent.aspect.archivedLongGoals || [];
      parent.aspect.archivedLongGoals.unshift(longGoal);
      showToast("تم أرشفة الهدف الطويل بنجاح");
    }
    renderTree();
  }

  function toggleShortGoalArchive(shortGoalId) {
    const parent = findShortGoalParent(shortGoalId);
    if (!parent) return;
    const isArchived = parent.shortGoalsList === parent.longGoal.archivedShortGoals;
    const shortGoal = parent.shortGoalsList[parent.index];
    parent.shortGoalsList.splice(parent.index, 1);
    if (isArchived) {
      parent.longGoal.shortGoals = parent.longGoal.shortGoals || [];
      parent.longGoal.shortGoals.unshift(shortGoal);
      showToast("تم إلغاء أرشفة الهدف القصير بنجاح");
    } else {
      parent.longGoal.archivedShortGoals = parent.longGoal.archivedShortGoals || [];
      parent.longGoal.archivedShortGoals.unshift(shortGoal);
      showToast("تم أرشفة الهدف القصير بنجاح");
    }
    renderTree();
  }

  function loadShortGoalIntoForm(goal) {
    const form = getDefaultShortGoalForm();
    form.name = goal.name || "";
    const typeLabel = goal.collectionType || "المساعدات";
    const typeObj = collectionTypes.find(c => c.label === typeLabel);
    form.collectionType = typeObj ? typeObj.id : "assistances";
    form.masteryMode = goal.masteryMode === "إتقان تلقائي" ? "auto" : "manual";
    form.attemptsPerSession = goal.attempts || 1;
    form.instructions = goal.instructions || "";
    form.objectives = goal.objectives || "";
    form.materials = goal.materials || "";
    form.activities = goal.activities || "";

    if (form.collectionType === "assistances") {
      form.assistanceOptions = Array.isArray(goal.options) ? goal.options.slice() : form.assistanceOptions;
    } else if (form.collectionType === "task-analysis") {
      form.taskAnalysisItems = Array.isArray(goal.options) ? goal.options.slice() : [""];
    } else if (form.collectionType === "rate") {
      const gMatch = (goal.options?.[0] || "").match(/\d+/);
      const mMatch = (goal.options?.[1] || "").match(/\d+/);
      form.rateGoal = gMatch ? Number(gMatch[0]) : 0;
      form.rateMinutes = mMatch ? Number(mMatch[0]) : 1;
    } else if (form.collectionType === "duration") {
      const mMatch = (goal.options?.[0] || "").match(/\d+/);
      const sMatch = (goal.options?.[1] || "").match(/\d+/);
      form.durationMinutes = mMatch ? Number(mMatch[0]) : 1;
      form.durationSeconds = sMatch ? Number(sMatch[0]) : 0;
    }
    
    if (goal.rawForm) {
      Object.assign(form, JSON.parse(JSON.stringify(goal.rawForm)));
    }
    state.shortGoalForm = form;
    state.shortAdvancedOpen = !!(form.instructions || form.objectives || form.materials || form.activities || form.masteryAttempts > 1 || form.masteryPercent > 50 || form.masteryPeriods > 1);
  }

  function setCreateScreenOpen(isOpen) {
    if (!createScreen || !createBody) return;

    // Keep the create panel anchored directly under the library hero.
    if (libraryHero && createScreen.previousElementSibling !== libraryHero) {
      libraryHero.insertAdjacentElement("afterend", createScreen);
    }

    // Show catalog hero in normal mode, hide it while create flow is open.
    if (libraryHero) {
      libraryHero.hidden = isOpen;
      libraryHero.style.display = isOpen ? "none" : "flex";
    }
    if (catalogSection) {
      catalogSection.hidden = isOpen;
    }

    createScreen.hidden = !isOpen;
    libraryPage?.classList.toggle("is-create-mode", isOpen);
    createScreen.classList.toggle("is-open", isOpen);
    if (!isOpen) {
      document.body.classList.remove("library-short-goal-open");
      document.querySelector("[data-short-goal-modal]")?.remove();
      scheduleTreeLines();
    } else {
      clearTreeLines();
    }
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function resetCreateScreen() {
    state.createStep = "type-selection";
    state.createMode = "";
    state.createTitle = "";
    state.shortGoalsDraft = [];
    state.structuredAspectsDraft = [];
    state.isAddingStructuredAspect = false;
    resetShortGoalForm();
  }

  function openCreateCurriculumInline() {
    resetCreateScreen();
    setCreateScreenOpen(true);
    renderCreateFlow();
  }

  function closeCreateCurriculumInline() {
    setCreateScreenOpen(false);
  }

  function renderLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function clearTreeLines() {
    document.querySelectorAll(".leader-line, .leader-line-area").forEach((line) => {
      try {
        line.remove();
      } catch (_) {
        // Ignore stale connector nodes injected by older builds.
      }
    });

    if (!treeLines) {
      treeRoot.classList.remove("is-leader-lines");
      return;
    }

    try {
      treeLines.remove();
    } catch (_) {
      treeLines.node?.remove?.();
    }

    treeLines = null;
    treeRoot.classList.remove("is-leader-lines");
  }

  function closeShortGoalOverlay() {
    state.addingShortGoalToTreeLongGoalId = null;
    state.editingShortGoalId = null;
    document.body.classList.remove("library-short-goal-open");
    document.querySelector("[data-short-goal-modal]")?.remove();
  }

  function getTreePoint(row, rootRect) {
    const rect = row.getBoundingClientRect();
    return {
      right: rect.right - rootRect.left + treeRoot.scrollLeft,
      centerY: rect.top - rootRect.top + rect.height / 2 + treeRoot.scrollTop
    };
  }

  function drawSvgConnector(draw, points, rootWidth, highlightChildren) {
    if (!points.length) return;

    const parent = points[0].parent;
    const children = points.map((point) => point.child);
    const mobileTimelineGap = window.matchMedia("(max-width: 768px)").matches ? 30 : 18;
    const lineX = Math.max(...children.map((child) => child.right)) + mobileTimelineGap;
    const dash = { color: "#c4cad6", width: 2, dasharray: "5 4", linecap: "round", linejoin: "round" };

    draw
      .path(`M ${parent.right} ${parent.centerY} H ${lineX} V ${children[children.length - 1].centerY}`)
      .fill("none")
      .stroke(dash);

    if (highlightChildren) {
      draw
        .circle(18)
        .center(lineX, parent.centerY)
        .fill("none")
        .stroke({ color: "rgba(30, 158, 88, 0.22)", width: 4 });

      draw
        .circle(8)
        .center(lineX, parent.centerY)
        .fill("#1e9e58")
        .stroke({ color: "#1e9e58", width: 2 });
    }

    children.forEach((child) => {
      draw
        .path(`M ${lineX} ${child.centerY} H ${child.right}`)
        .fill("none")
        .stroke(dash);

      // On mobile, an open row is both a child and a parent, so drawing both markers creates duplicate dots.
      if (child.isOpen && window.matchMedia("(max-width: 768px)").matches) {
        return;
      }

      draw
        .circle(8)
        .center(lineX, child.centerY)
        .fill(highlightChildren ? "#1e9e58" : "#fff")
        .stroke({ color: highlightChildren ? "#1e9e58" : "#c4cad6", width: 2 });
    });
  }

  function drawTreeLines() {
    if (!treeRoot || createScreen?.classList.contains("is-open")) {
      clearTreeLines();
      return;
    }

    clearTreeLines();

    if (!window.SVG) return;

    const rootRect = treeRoot.getBoundingClientRect();
    const rootWidth = treeRoot.scrollWidth;
    const rootHeight = treeRoot.scrollHeight;
    const draw = SVG()
      .addTo(treeRoot)
      .size(rootWidth, rootHeight)
      .addClass("library-tree-svg-lines");

    const openItems = treeRoot.querySelectorAll(".library-tree-item.is-open");
    openItems.forEach((item) => {
      const parentRow = item.querySelector(":scope > .library-tree-row");
      const childRows = Array.from(item.querySelectorAll(":scope > .library-tree-panel > .library-tree-children > .library-tree-item > .library-tree-row"));
      if (!parentRow || !childRows.length) return;

      const parent = getTreePoint(parentRow, rootRect);
      const points = childRows.map((childRow) => ({
        parent,
        child: {
          ...getTreePoint(childRow, rootRect),
          isOpen: childRow.closest(".library-tree-item")?.classList.contains("is-open")
        }
      }));

      const isSmallLevel = !item.classList.contains("library-tree-item--curriculum");
      drawSvgConnector(draw, points, rootWidth, isSmallLevel);
    });

    treeLines = draw;
    treeRoot.classList.add("is-leader-lines");
  }

  function positionTreeLines() {
    scheduleTreeLines();
  }

  function scheduleTreeLines() {
    if (treeLinesFrame) {
      window.cancelAnimationFrame(treeLinesFrame);
    }

    treeLinesFrame = window.requestAnimationFrame(() => {
      treeLinesFrame = window.requestAnimationFrame(() => {
        treeLinesFrame = 0;
        drawTreeLines();
      });
    });
  }

  function scheduleTreeLinePosition() {
    if (treeLinesFrame) return;

    treeLinesFrame = window.requestAnimationFrame(() => {
      treeLinesFrame = 0;
      positionTreeLines();
    });
  }

  function refreshShortGoalFormUi() {
    if (document.querySelector("[data-short-goal-modal]")) {
      renderShortGoalForm();
      return;
    }
    renderCreateFlow();
  }

  function renderCreateFlow() {
    if (!createBody) return;
    if (!createScreen?.classList.contains("is-open")) {
      if (state.addingShortGoalToTreeLongGoalId || state.editingShortGoalId) {
        renderShortGoalForm();
        renderLucideIcons();
        return;
      }
      closeShortGoalOverlay();
      return;
    }
    if (state.createStep === "type-selection") {
      renderTypeSelection();
    } else if (state.createStep === "simple-goals") {
      renderSimpleGoals();
    } else if (state.createStep === "structured-aspects") {
      renderStructuredAspects();
    } else {
      renderShortGoalForm();
    }
    renderLucideIcons();
    syncMasteryRangeFill();

    if (state.pendingShortGoalScroll && createScreen && !createScreen.hidden) {
      const target = state.createStep === "short-goal-form"
        ? document.querySelector(`[data-scroll-target="${state.pendingShortGoalScroll}"]`)
        : createBody.querySelector(`[data-scroll-target="${state.pendingShortGoalScroll}"]`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      state.pendingShortGoalScroll = "";
    }
  }

  function updateTypeSelectionInteractivity() {
    if (!createScreen || state.createStep !== "type-selection") return;
    const hasTitle = Boolean((state.createTitle || "").trim());

    createScreen.querySelectorAll("[data-create-mode]").forEach((button) => {
      button.toggleAttribute("disabled", !hasTitle);
      button.classList.toggle("is-disabled", !hasTitle);
    });

    const submitButton = createScreen.querySelector("[data-create-submit]");
    if (submitButton) {
      submitButton.toggleAttribute("disabled", !hasTitle);
    }
  }

  function renderTypeSelection() {
    document.body.classList.remove("library-short-goal-open");
    document.querySelector("[data-short-goal-modal]")?.remove();
    createBody.innerHTML = `
      <div class="library-create-header">
        <h2>إضافة منهج جديد</h2>
        <p>الأعضاء أدناه هم الذين لديهم الصلاحية للإضافة، فضلًا الانتقال لصفحة الصلاحيات في الإعدادات لمعرفة المزيد</p>
      </div>
      <div class="library-create-field-wrap">
        <label class="library-create-field-label" for="library-create-title">اسم المنهج <em>*</em></label>
        <input id="library-create-title" class="library-create-field-input" type="text" value="${escapeHtml(state.createTitle)}">
      </div>
      <h3 class="library-create-section-title">هيكلة المنهج <em>*</em></h3>
      <div class="library-create-modes">
        <button type="button" class="library-create-mode ${state.createMode === "structured" ? "is-active" : ""}" data-create-mode="structured">
          <span class="library-create-mode-help" data-lucide="circle-help"></span>
          <span class="library-create-mode-icon" data-lucide="network"></span>
          <span class="library-create-mode-copy">
            <strong>هيكلة</strong>
            <span>يجب إضافة هيكل المنهج (جانب / هدف طويل / هدف قصير)</span>
          </span>
        </button>
        <button type="button" class="library-create-mode ${state.createMode === "simple" ? "is-active" : ""}" data-create-mode="simple">
          <span class="library-create-mode-help" data-lucide="circle-help"></span>
          <span class="library-create-mode-icon" data-lucide="workflow"></span>
          <span class="library-create-mode-copy">
            <strong>مبسط</strong>
            <span>يمكنك من إضافة أهداف بطريقة مبسطة</span>
          </span>
        </button>
      </div>
      <p class="library-flow-error ${state.createMode ? "is-hidden" : ""}" data-create-error>اختر نوع المنهج أولًا.</p>
      <div class="library-create-actions">
        <button type="button" class="btn-cancel" data-create-cancel>إلغاء</button>
        <button type="button" class="btn-save" data-create-submit>إنشاء</button>
      </div>
    `;
    createBody.querySelector("[data-create-error]")?.classList.toggle("is-hidden", !!state.createMode);
    updateTypeSelectionInteractivity();
  }

  function renderSimpleGoals() {
    document.body.classList.remove("library-short-goal-open");
    document.querySelector("[data-short-goal-modal]")?.remove();
    const goalsMarkup = state.shortGoalsDraft.length
      ? state.shortGoalsDraft.map((goal) => `<div class="library-short-goal-item">${escapeHtml(goal.name)}</div>`).join("")
      : `
        <div class="library-short-goals-empty">
          <span>إنشاء هدف قصير</span>
          <i data-lucide="alert-circle" aria-hidden="true"></i>
        </div>
      `;

    createBody.innerHTML = `
      <div class="library-simple-screen">
        <div class="library-create-header">
          <h2>إضافة منهج جديد</h2>
          <p>الأعضاء أدناه هم الذين لديهم الصلاحية للإضافة، فضلًا الانتقال لصفحة الصلاحيات في الإعدادات لمعرفة المزيد</p>
        </div>
        <div class="library-short-heading">
          <div class="library-short-heading-main">
            <h3>لابي المحتوى</h3>
            <div class="library-short-tabs"><button class="library-short-tab is-active" type="button">الأهداف القصيرة</button></div>
          </div>
          <button type="button" class="library-short-add-btn" data-add-short-goal>
            <i data-lucide="plus-circle"></i>
            إضافة هدف قصير
          </button>
        </div>
        <div class="library-simple-divider"></div>
        <div class="library-short-goals-list">${goalsMarkup}</div>
        <div class="library-create-actions library-create-actions--simple">
          <button type="button" class="btn-save" data-simple-done>تم</button>
        </div>
      </div>
    </div>
  `;
  }

  function renderStructuredAspects() {
    document.body.classList.remove("library-short-goal-open");
    document.querySelector("[data-short-goal-modal]")?.remove();
    
    const hasDrafts = state.structuredAspectsDraft && state.structuredAspectsDraft.length > 0;
    const isAdding = state.isAddingStructuredAspect;
    
    const aspectsMarkup = hasDrafts
      ? state.structuredAspectsDraft.map((aspect) => `<div class="library-short-goal-item">${escapeHtml(aspect.name)}</div>`).join("")
      : "";

    createBody.innerHTML = `
      <div class="library-simple-screen">
        <div class="library-create-header">
          <h2>إضافة منهج جديد</h2>
          <p>الأعضاء أدناه هم الذين لديهم الصلاحية للإضافة، فضلًا الانتقال لصفحة الصلاحيات في الإعدادات لمعرفة المزيد</p>
        </div>
        <div class="library-short-heading">
          <div class="library-short-heading-main">
            <h3>لابي المحتوى</h3>
            <div class="library-short-tabs"><button class="library-short-tab is-active" type="button">الجوانب</button></div>
          </div>
          ${!isAdding ? `
          <button type="button" class="library-short-add-btn" data-add-structured-aspect>
            <i data-lucide="plus-circle"></i>
            إضافة جانب جديد
          </button>
          ` : `
          <button type="button" class="library-short-add-btn" disabled>
            <i data-lucide="plus-circle"></i>
            إضافة جانب جديد
          </button>
          `}
        </div>
        <div class="library-simple-divider"></div>
        
        ${!hasDrafts ? `
        <div class="library-short-goals-empty structure-empty-note-exact library-structured-empty-note">
          <span>انشاء جانب جديد</span>
          <i data-lucide="alert-circle" aria-hidden="true"></i>
        </div>
        ` : ""}
        
        ${isAdding ? `
        <article class="library-tree-item library-tree-item--inline-form library-structured-inline-form">
          <input type="text" placeholder="إسم الجانب" data-structured-aspect-input class="library-structured-inline-input">
          <div class="inline-aspect-actions library-structured-inline-actions">
            <button type="button" data-structured-aspect-create style="background: #20ba90; color: #fff; border: 1px solid #20ba90; padding: 8px 24px; border-radius: 4px; font-family: inherit; font-size: 14px; cursor: pointer;">انشاء</button>
            <button type="button" data-structured-aspect-create-more style="background: #fff; color: #20ba90; border: 1px solid #20ba90; padding: 8px 16px; border-radius: 4px; font-family: inherit; font-size: 14px; cursor: pointer;">انشاء وأضف جانب آخر</button>
            <button type="button" data-structured-aspect-cancel style="background: #fff; color: #6e45b1; border: 1px solid #6e45b1; padding: 8px 24px; border-radius: 4px; font-family: inherit; font-size: 14px; cursor: pointer;">إلغاء</button>
          </div>
        </article>
        ` : ""}
        
        <div class="library-short-goals-list">${aspectsMarkup}</div>
        <div class="library-create-actions library-create-actions--simple">
          <button type="button" class="btn-save" data-structured-done>تم</button>
        </div>
      </div>
    `;
    
    if (isAdding) {
      setTimeout(() => {
        const input = createBody.querySelector("[data-structured-aspect-input]");
        if (input) input.focus();
      }, 50);
    }
  }

  function addAspectToCurriculum(curriculum, aspectName) {
    const nextName = (aspectName || "").trim();
    if (!nextName) return false;
    curriculum.aspects = curriculum.aspects || [];
    curriculum.aspects.push({
      id: `aspect-${Date.now()}`,
      title: nextName,
      longGoals: [],
      archivedLongGoals: []
    });
    state.openIds.add(`curriculum:${curriculum.id}`);
    return true;
  }

  function openAddAspectModal(curriculum, onCreated) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay is-open library-flow-modal";
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog--group library-flow-dialog">
        <button class="modal-close modal-close--icon" type="button" aria-label="إغلاق">×</button>
        <h2 class="modal-title">إضافة جانب جديد</h2>
        <label class="modal-field">
          <span class="modal-field-label">اسم الجانب <em>*</em></span>
          <input type="text" data-aspect-name autocomplete="off">
        </label>
        <div class="modal-actions modal-actions--group">
          <button type="button" class="btn-save" data-aspect-create>إنشاء</button>
          <button type="button" class="btn-cancel btn-cancel--green" data-aspect-create-more>إنشاء وإضافة جانب آخر</button>
          <button type="button" class="btn-cancel" data-aspect-cancel>إلغاء</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const input = modal.querySelector("[data-aspect-name]");
    input?.focus();

    const close = () => modal.remove();
    const submit = (keepOpen) => {
      const name = (input?.value || "").trim();
      if (!name) return;
      if (addAspectToCurriculum(curriculum, name)) {
        if (typeof onCreated === "function") onCreated();
        if (keepOpen && input) {
          input.value = "";
          input.focus();
        } else {
          close();
        }
      }
    };

    modal.querySelector("[data-aspect-cancel]")?.addEventListener("click", close);
    modal.querySelector(".modal-close")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    modal.querySelector("[data-aspect-create]")?.addEventListener("click", () => submit(false));
    modal.querySelector("[data-aspect-create-more]")?.addEventListener("click", () => submit(true));
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit(false);
      }
    });
  }

  function addLongGoalToAspect(aspect, longGoalTitle) {
    const nextTitle = (longGoalTitle || "").trim();
    if (!nextTitle) return false;
    aspect.longGoals = aspect.longGoals || [];
    aspect.longGoals.push({
      id: `lg-${Date.now()}`,
      title: nextTitle,
      shortGoals: [],
      archivedShortGoals: []
    });
    state.openIds.add(`aspect:${aspect.id}`);
    return true;
  }

  function findLongGoalById(id) {
    for (const list of ["active", "archived"]) {
      for (const curr of libraryData[list]) {
        for (const asp of [...(curr.aspects || []), ...(curr.archivedAspects || [])]) {
          const lg = [...(asp.longGoals || []), ...(asp.archivedLongGoals || [])].find((g) => g.id === id);
          if (lg) return lg;
        }
      }
    }
    return null;
  }

  function addShortGoalToLongGoal(longGoal, shortGoalName) {
    const nextName = (shortGoalName || "").trim();
    if (!nextName) return false;
    longGoal.shortGoals = longGoal.shortGoals || [];
    longGoal.shortGoals.push({
      id: `sg-${Date.now()}`,
      name: nextName,
      collectionType: "المساعدات",
      options: ["مساعدة لفظية كلية", "بدون مساعدة", "مساعدة لفظية جزئية"],
      masteryMode: "إتقان يدوي",
      attempts: 5
    });
    state.openIds.add(`goal:${longGoal.id}`);
    return true;
  }

  function openAddLongGoalModal(aspect, onCreated) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay is-open library-flow-modal";
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog--group library-flow-dialog">
        <button class="modal-close modal-close--icon" type="button" aria-label="إغلاق">×</button>
        <h2 class="modal-title">إضافة هدف طويل جديد</h2>
        <label class="modal-field">
          <span class="modal-field-label">اسم الهدف الطويل <em>*</em></span>
          <input type="text" data-long-goal-name autocomplete="off">
        </label>
        <div class="modal-actions modal-actions--group">
          <button type="button" class="btn-save" data-long-goal-create>إنشاء</button>
          <button type="button" class="btn-cancel btn-cancel--green" data-long-goal-create-more>إنشاء وإضافة هدف طويل آخر</button>
          <button type="button" class="btn-cancel" data-long-goal-cancel>إلغاء</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const input = modal.querySelector("[data-long-goal-name]");
    input?.focus();

    const close = () => modal.remove();
    const submit = (keepOpen) => {
      const name = (input?.value || "").trim();
      if (!name) return;
      if (addLongGoalToAspect(aspect, name)) {
        if (typeof onCreated === "function") onCreated();
        if (keepOpen && input) {
          input.value = "";
          input.focus();
        } else {
          close();
        }
      }
    };

    modal.querySelector("[data-long-goal-cancel]")?.addEventListener("click", close);
    modal.querySelector(".modal-close")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    modal.querySelector("[data-long-goal-create]")?.addEventListener("click", () => submit(false));
    modal.querySelector("[data-long-goal-create-more]")?.addEventListener("click", () => submit(true));
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit(false);
      }
    });
  }


  function renderFieldInput(config) {
    const {
      label,
      key,
      value,
      required = false,
      type = "text",
      min = "",
      placeholder = "",
      textarea = false,
      rows = 4,
      path = ""
    } = config;
    const fieldPath = path ? `${path}.${key}` : key;

    if (textarea) {
      return `
        <label class="library-form-field library-form-field--textarea">
          <span class="library-create-field-label">${label}${required ? " <em>*</em>" : ""}</span>
          <textarea class="library-create-field-input library-create-field-input--textarea" rows="${rows}" placeholder="${escapeHtml(placeholder)}" data-form-field="${fieldPath}">${escapeHtml(value)}</textarea>
        </label>
      `;
    }

    return `
      <label class="library-form-field">
        <span class="library-create-field-label">${label}${required ? " <em>*</em>" : ""}</span>
        <input
          class="library-create-field-input"
          type="${type}"
          ${min !== "" ? `min="${min}"` : ""}
          placeholder="${escapeHtml(placeholder)}"
          value="${escapeHtml(value)}"
          data-form-field="${fieldPath}"
        >
      </label>
    `;
  }

  function renderRichField(title, key, value) {
    return `
      <section class="library-form-section">
        <div class="library-form-section__head">
          <h3 class="library-form-section__title">${title}</h3>
        </div>
        <textarea
          class="evaluations-textarea rich-editor-field"
          dir="rtl"
          data-form-field="${key}"
          placeholder="ادخل النص هنا..."
        >${escapeHtml(value)}</textarea>
      </section>
    `;
  }

  function renderAssistanceTypeSection(form) {
    if (form.collectionType !== "assistances") return "";

    return `
      <section class="library-form-section library-assistance-type-section" data-scroll-target="assistance-type">
        <div class="library-form-section__head">
          <h3 class="library-form-section__title">نوع المساعدات</h3>
        </div>
        <div class="library-assistance-type-grid">
          <button type="button" class="library-select-card ${form.assistanceType === "variable" ? "is-active" : ""}" data-assist-type="variable">
            <span class="library-select-card__content">
              <strong>متغير</strong>
            </span>
            <span class="library-radio-indicator" aria-hidden="true"></span>
          </button>
          <button type="button" class="library-select-card ${form.assistanceType === "fixed" ? "is-active" : ""}" data-assist-type="fixed">
            <span class="library-select-card__content">
              <strong>ثابت</strong>
            </span>
            <span class="library-radio-indicator" aria-hidden="true"></span>
          </button>
        </div>
      </section>
    `;
  }

  function renderAdvancedAssistanceSection(form) {
    if (form.collectionType !== "assistances") return "";
    const options = Array.isArray(form.assistanceOptions) ? form.assistanceOptions : [];

    return `
      <section class="library-form-section library-assistance-options-section library-form-section--animated" data-scroll-target="advanced-assistance">
        <div class="library-form-section__head">
          <h3 class="library-form-section__title">خيارات المساعدات</h3>
        </div>
        <div class="library-assistance-options">
          ${options.map((label, index) => `
            <div class="library-assistance-option-row ${form.selectedAssistanceOption === index ? "is-active" : ""}" data-assistance-choice="${index}">
              ${form.assistanceType === "variable" && index > 1
                ? `<button class="library-assistance-row-delete" type="button" data-delete-assistance-option="${index}" aria-label="حذف الخيار"><i data-lucide="trash-2"></i></button>`
                : ``}
              ${form.selectedAssistanceOption === index
                ? `<button class="library-assistance-row-select" type="button" data-assistance-choice="${index}" aria-label="تحديد ${escapeHtml(label || `خيار ${index + 1}`)}"><i data-lucide="check"></i></button>`
                : `<div class="library-assistance-row-placeholder" aria-hidden="true"></div>`}
              <label class="library-assistance-option-field">
                <span><em>*</em>${index + 1}</span>
                <input type="text" value="${escapeHtml(label || "")}" data-assistance-input="${index}">
              </label>
            </div>
          `).join("")}
        </div>
        ${form.assistanceType === "variable" ? `
          <div class="library-assistance-add-wrap">
            <button type="button" class="library-assistance-add-btn" data-add-assistance-option>إضافة خيار</button>
          </div>
        ` : ""}
      </section>
    `;
  }

  function renderMasterySettingsSection(form) {
    if (!state.shortAdvancedOpen) return "";
    const isDurationType = form.collectionType === "duration";
    const isDescriptionType = form.collectionType === "descriptive";
    const isLikertType = form.collectionType === "likert";
    const isFrequencyManual = form.collectionType === "frequency" && form.masteryMode === "manual";
    const isAuto = form.masteryMode === "auto";
    const masteryAttempts = Number(form.masteryAttempts) || 1;
    const attempts = Number(form.attemptsPerSession) || 1;
    const periods = Number(form.masteryPeriods) || 1;
    const percent = Math.max(0, Math.min(100, Number(form.masteryPercent) || 0));

    return `
      <section class="library-form-section library-mastery-section" data-scroll-target="advanced-assistance">
        ${isDescriptionType || isLikertType ? "" : `
        <div class="library-form-section__head">
          <h3 class="library-form-section__title">${isDurationType ? "إعدادات متقدمة للمدة الزمنية" : "هل ترغب بتحديد الفترة المتوقعة لإتقان الهدف؟"}</h3>
        </div>
        `}
        ${isDurationType || isDescriptionType || isLikertType ? "" : `
        <div class="library-assistance-type-grid library-mastery-mode-grid">
          <button type="button" class="library-select-card ${isAuto ? "is-active" : ""}" data-mastery-mode="auto">
            <span class="library-select-card__content"><strong>إتقان تلقائي</strong></span>
            <span class="library-radio-indicator" aria-hidden="true"></span>
          </button>
          <button type="button" class="library-select-card ${!isAuto ? "is-active" : ""}" data-mastery-mode="manual">
            <span class="library-select-card__content"><strong>إتقان يدوي</strong></span>
            <span class="library-radio-indicator" aria-hidden="true"></span>
          </button>
        </div>
        `}

        ${!isDurationType && !isDescriptionType && !isLikertType && isAuto ? `
          <div class="library-mastery-stack">
            <div class="library-mastery-full-row">
              <label class="library-assistance-option-field library-rate-field ${masteryAttempts > 0 ? "library-rate-field--filled" : ""}">
                <div class="library-mastery-stepper">
                  <button type="button" data-stepper-target="masteryAttempts" data-stepper-dir="down">−</button>
                  <button type="button" data-stepper-target="masteryAttempts" data-stepper-dir="up">+</button>
                </div>
                <span><em>*</em>عدد المحاولات</span>
                <input type="number" min="1" value="${masteryAttempts}" data-form-field="masteryAttempts">
              </label>
            </div>

            <div class="library-mastery-auto-layout">
              <div class="library-mastery-percent-layout">
                <div class="library-mastery-percent-title">نسبة<br>الإتقان</div>
                <div class="library-mastery-percent-box" data-mastery-percent-value>${percent}</div>
                <div class="library-mastery-slider-shell">
                  <input class="library-mastery-range" type="range" min="0" max="100" value="${percent}" data-mastery-range>
                </div>
              </div>

              <div class="library-mastery-period-card">
                <label class="library-assistance-option-field library-rate-field ${periods > 0 ? "library-rate-field--filled" : ""}">
                  <div class="library-mastery-stepper">
                    <button type="button" data-stepper-target="masteryPeriods" data-stepper-dir="down">−</button>
                    <button type="button" data-stepper-target="masteryPeriods" data-stepper-dir="up">+</button>
                  </div>
                  <span><em>*</em>فترات الإتقان</span>
                  <input type="number" min="1" value="${periods}" data-form-field="masteryPeriods">
                </label>
              </div>
            </div>
          </div>
        ` : ""}

        ${isFrequencyManual ? "" : `
        <div class="library-mastery-full-row">
          <label class="library-assistance-option-field library-rate-field ${attempts > 0 ? "library-rate-field--filled" : ""}">
            <div class="library-mastery-stepper">
              <button type="button" data-stepper-target="attemptsPerSession" data-stepper-dir="down">−</button>
              <button type="button" data-stepper-target="attemptsPerSession" data-stepper-dir="up">+</button>
            </div>
            <span>عدد المحاولات في الجلسة</span>
            <input type="number" min="1" value="${attempts}" data-form-field="attemptsPerSession">
          </label>
        </div>
        `}
      </section>
    `;
  }

  function renderRateSection(form) {
    if (form.collectionType !== "rate") return "";
    const goal = Math.max(0, Number(form.rateGoal) || 0);
    const minutes = Math.max(1, Number(form.rateMinutes) || 1);

    return `
      <section class="library-form-section library-mastery-section" data-scroll-target="rate-settings">
        <div class="library-rate-layout">
          <div class="library-rate-col">
            <label class="library-assistance-option-field library-rate-field ${goal > 0 ? "library-rate-field--filled" : ""}">
              <div class="library-mastery-stepper">
                <button type="button" data-stepper-target="rateGoal" data-stepper-dir="down" data-stepper-min="0">−</button>
                <button type="button" data-stepper-target="rateGoal" data-stepper-dir="up" data-stepper-min="0">+</button>
              </div>
              <span><em>*</em>هدف</span>
              <input type="number" min="0" value="${goal}" data-form-field="rateGoal">
            </label>
          </div>
          <div class="library-rate-col">
            <label class="library-assistance-option-field library-rate-field ${minutes > 0 ? "library-rate-field--filled" : ""}">
              <div class="library-mastery-stepper">
                <button type="button" data-stepper-target="rateMinutes" data-stepper-dir="down" data-stepper-min="1">−</button>
                <button type="button" data-stepper-target="rateMinutes" data-stepper-dir="up" data-stepper-min="1">+</button>
              </div>
              <span><em>*</em>دقيقة</span>
              <input type="number" min="1" value="${minutes}" data-form-field="rateMinutes">
            </label>
          </div>
        </div>
      </section>
    `;
  }

  function renderDurationSection(form) {
    if (form.collectionType !== "duration") return "";
    const minutes = Math.max(0, Number(form.durationMinutes) || 0);
    const seconds = Math.max(0, Number(form.durationSeconds) || 0);

    return `
      <section class="library-form-section library-mastery-section" data-scroll-target="duration-settings">
        <div class="library-rate-layout">
          <div class="library-rate-col">
            <label class="library-assistance-option-field library-rate-field ${seconds > 0 ? "library-rate-field--filled" : ""}">
              <div class="library-mastery-stepper">
                <button type="button" data-stepper-target="durationSeconds" data-stepper-dir="down" data-stepper-min="0">−</button>
                <button type="button" data-stepper-target="durationSeconds" data-stepper-dir="up" data-stepper-min="0">+</button>
              </div>
              <span><em>*</em>ثوان</span>
              <input type="number" min="0" value="${seconds}" data-form-field="durationSeconds">
            </label>
          </div>
          <div class="library-rate-col">
            <label class="library-assistance-option-field library-rate-field ${minutes > 0 ? "library-rate-field--filled" : ""}">
              <div class="library-mastery-stepper">
                <button type="button" data-stepper-target="durationMinutes" data-stepper-dir="down" data-stepper-min="0">−</button>
                <button type="button" data-stepper-target="durationMinutes" data-stepper-dir="up" data-stepper-min="0">+</button>
              </div>
              <span><em>*</em>دقائق</span>
              <input type="number" min="0" value="${minutes}" data-form-field="durationMinutes">
            </label>
          </div>
        </div>
      </section>
    `;
  }

  function renderTaskAnalysisSection(form) {
    if (form.collectionType !== "task-analysis") return "";
    const items = Array.isArray(form.taskAnalysisItems) && form.taskAnalysisItems.length
      ? form.taskAnalysisItems
      : [""];

    return `
      <section class="library-form-section library-assistance-options-section library-task-analysis-section">
        <div class="library-form-section__head">
          <h3 class="library-form-section__title">تحليل المهام</h3>
        </div>
        <div class="library-assistance-options-list">
          ${items.map((value, index) => `
            <div class="library-assistance-option-row ${index > 0 ? "" : "is-single-field"}">
              ${index > 0 ? `<button class="library-assistance-row-delete" type="button" data-delete-task-item="${index}" aria-label="حذف المهمة"><i data-lucide="trash-2"></i></button>` : ``}
              <label class="library-assistance-option-field">
                <span><em>*</em>${index + 1}</span>
                <input type="text" value="${escapeHtml(value || "")}" data-form-field="taskAnalysisItems.${index}">
              </label>
            </div>
          `).join("")}
        </div>
        <div class="library-assistance-add-wrap">
          <button type="button" class="library-assistance-add-btn" data-add-task-item>إضافة مهمة</button>
        </div>
      </section>
    `;
  }

  function renderCollectionCards(form) {
    const enabledTypes = new Set(["assistances", "rate", "duration", "frequency", "descriptive", "task-analysis", "likert"]);
    return collectionTypes
      .map((item) => `
        <button type="button" class="library-collection-card ${form.collectionType === item.id ? "is-active" : ""} ${enabledTypes.has(item.id) ? "" : "is-disabled"}" data-collection="${item.id}">
          <i data-lucide="${item.icon}"></i>
          <span>${item.label}</span>
          <i class="library-help-icon" data-lucide="circle-help"></i>
        </button>
      `).join("");
  }

  function renderShortGoalForm() {
    // Guard removed to allow opening from tree.

    document.body.classList.add("library-short-goal-open");
    const form = getShortGoalForm();
    document.querySelector("[data-short-goal-modal]")?.remove();
    createBody.innerHTML = "";
    document.body.insertAdjacentHTML("beforeend", `
      <div class="library-short-goal-modal" data-short-goal-modal>
        <button type="button" class="library-short-goal-close" data-cancel-short aria-label="إغلاق">×</button>
        <div class="library-short-goal-dialog">
          <div class="library-short-goal-head">
            <h2>${state.editingShortGoalId ? "تعديل هدف قصير" : "إضافة هدف قصير"}</h2>
            <div class="library-short-goal-breadcrumb">
              ${(function() {
                if (state.addingShortGoalToTreeLongGoalId || state.editingShortGoalId) {
                  const targetId = state.addingShortGoalToTreeLongGoalId ? state.addingShortGoalToTreeLongGoalId : findShortGoalParent(state.editingShortGoalId)?.longGoal?.id;
                  if (targetId) {
                    const parent = findLongGoalParent(targetId);
                    if (parent) {
                      const curriculum = state.curriculums.find(c => c.aspects.some(a => a.id === parent.aspect.id) || c.archivedAspects?.some(a => a.id === parent.aspect.id));
                      return `
                        <div style="display: flex; gap: 16px; font-size: 1.25rem; color: #6b7280; margin-top: 6px;">
                          <div><span style="color: #9ca3af;">المناهج</span><br/><strong style="color: #111827; font-weight: 600;">${curriculum ? curriculum.title : "رئيسي"}</strong></div>
                          <div><span style="color: #9ca3af;">جانب</span><br/><strong style="color: #111827; font-weight: 600;">${parent.aspect.title}</strong></div>
                          <div><span style="color: #9ca3af;">هدف طويل</span><br/><strong style="color: #111827; font-weight: 600;">${parent.longGoalsList[parent.index].title}</strong></div>
                        </div>
                      `;
                    }
                  }
                }
                return `<span>المناهج</span> <strong>رئيسي</strong>`;
              })()}
            </div>
          </div>

          <section class="library-short-goal-first">
            ${renderFieldInput({ label: "اسم الهدف القصير", key: "name", value: form.name, required: true, placeholder: "" })}
          </section>

          <section class="library-form-section library-form-section--collection">
            <div class="library-form-section__head">
              <h3 class="library-form-section__title"><em>*</em> طريقة جمع البيانات</h3>
            </div>
            <div class="library-collection-grid">${renderCollectionCards(form)}</div>
          </section>

          ${renderAssistanceTypeSection(form)}
          ${renderRateSection(form)}
          ${renderDurationSection(form)}
          ${renderTaskAnalysisSection(form)}
          ${renderAdvancedAssistanceSection(form)}

          <label class="library-advanced-toggle">
            <input type="checkbox" data-short-advanced-toggle ${state.shortAdvancedOpen ? "checked" : ""}>
            <span>إعدادات متقدمة</span>
            <i aria-hidden="true"></i>
          </label>

          ${renderMasterySettingsSection(form)}

          ${state.shortAdvancedOpen ? `
          ${renderRichField("التعليمات", "instructions", form.instructions)}
          ${renderRichField("الأهداف", "objectives", form.objectives)}
          ${renderRichField("الوسائل", "materials", form.materials)}
          ${renderRichField("الأنشطة التعليمية", "activities", form.activities)}
          ` : ""}

          <div class="library-create-actions library-create-actions--stacked library-create-actions--final">
            <button type="button" class="btn-save" data-create-short>${state.editingShortGoalId ? "حفظ التعديلات" : "إنشاء"}</button>
            ${state.editingShortGoalId ? "" : `<button type="button" class="btn-cancel btn-cancel--green" data-create-short-and-new>إنشاء وإضافة هدف قصير جديد</button>`}
            <button type="button" class="btn-cancel" data-cancel-short>إلغاء</button>
          </div>
        </div>
      </div>`);

    if (state.shortAdvancedOpen && typeof window.initRichEditors === "function") {
      window.initRichEditors(document.querySelector("[data-short-goal-modal]"));
    }
    renderLucideIcons();
  }

  function syncShortGoalFormFromDom() {
    const modal = document.querySelector("[data-short-goal-modal]");
    if (!modal) return;

    const form = getShortGoalForm();

    modal.querySelectorAll("[data-form-field]").forEach((element) => {
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
        return;
      }

      const fieldPath = element.getAttribute("data-form-field");
      if (!fieldPath) return;

      if (fieldPath.startsWith("taskAnalysisItems.")) {
        const idx = Number(fieldPath.split(".")[1]);
        if (!Number.isInteger(idx) || idx < 0) return;
        if (!Array.isArray(form.taskAnalysisItems)) form.taskAnalysisItems = [""];
        form.taskAnalysisItems[idx] = element.value || "";
        return;
      }

      const segments = fieldPath.split(".");
      let cursor = form;

      for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index];
        if (!cursor[segment] || typeof cursor[segment] !== "object") {
          cursor[segment] = {};
        }
        cursor = cursor[segment];
      }

      const lastKey = segments[segments.length - 1];
      cursor[lastKey] = element.type === "number"
        ? Number(element.value || 0)
        : element.value || "";
    });

    modal.querySelectorAll("[data-assistance-input]").forEach((element) => {
      if (!(element instanceof HTMLInputElement)) return;
      const idx = Number(element.getAttribute("data-assistance-input"));
      if (!Number.isInteger(idx) || idx < 0) return;
      if (!Array.isArray(form.assistanceOptions)) form.assistanceOptions = [];
      form.assistanceOptions[idx] = element.value || "";
    });
  }

  function validateShortGoalForm(form) {
    if (!form.name.trim()) {
      showToast("اسم الهدف القصير مطلوب");
      return false;
    }

    if (form.collectionType === "duration") {
      const minutes = Math.max(0, Number(form.durationMinutes) || 0);
      const seconds = Math.max(0, Number(form.durationSeconds) || 0);
      if (minutes === 0 && seconds === 0) {
        showToast("المدة الزمنية يجب أن تكون أكبر من صفر");
        return false;
      }
    }

    if (state.shortAdvancedOpen) {
      if (Number(form.masteryAttempts) <= 0) {
        showToast("عدد المحاولات يجب أن يكون أكبر من صفر");
        return false;
      }
      if (Number(form.attemptsPerSession) <= 0) {
        showToast("عدد المحاولات في الجلسة يجب أن يكون أكبر من صفر");
        return false;
      }
      if (form.collectionType !== "duration" && form.masteryMode === "auto" && (Number(form.masteryPeriods) <= 0 || Number(form.masteryPercent) < 0 || Number(form.masteryPercent) > 100)) {
        showToast("تحقق من قيم الإتقان التلقائي");
        return false;
      }
    }

    return true;
  }

  function saveShortGoal() {
    syncShortGoalFormFromDom();
    const form = getShortGoalForm();
    if (!validateShortGoalForm(form)) return false;

    const collectionTypeObj = collectionTypes.find(c => c.id === form.collectionType);
    const collectionLabel = collectionTypeObj ? collectionTypeObj.label : form.collectionType;
    const masteryModeVal = form.masteryMode === "auto" ? "إتقان تلقائي" : "إتقان يدوي";
    const attemptsVal = form.attemptsPerSession || 1;

    let options = [];
    if (form.collectionType === "assistances") {
      options = Array.isArray(form.assistanceOptions) ? form.assistanceOptions.slice() : [];
    } else if (form.collectionType === "task-analysis") {
      options = Array.isArray(form.taskAnalysisItems) ? form.taskAnalysisItems.slice() : [];
    } else if (form.collectionType === "rate") {
      options = [`الهدف: ${form.rateGoal || 0}`, `الزمن: ${form.rateMinutes || 1} دقيقة`];
    } else if (form.collectionType === "duration") {
      options = [`دقائق: ${form.durationMinutes || 1}`, `ثواني: ${form.durationSeconds || 0}`];
    } else if (form.collectionType === "frequency") {
      options = ["سلوك قابل للتكرار"];
    } else if (form.collectionType === "descriptive") {
      options = ["ملاحظات وصفية للأداء"];
    } else if (form.collectionType === "likert") {
      options = ["مقياس ليكرت المتدرج"];
    }

    if (state.editingShortGoalId) {
      const parent = findShortGoalParent(state.editingShortGoalId);
      if (parent) {
        const goal = parent.shortGoalsList[parent.index];
        goal.name = form.name.trim();
        goal.collectionType = collectionLabel;
        goal.masteryMode = masteryModeVal;
        goal.attempts = attemptsVal;
        goal.options = options;
        goal.instructions = form.instructions || "";
        goal.objectives = form.objectives || "";
        goal.materials = form.materials || "";
        goal.activities = form.activities || "";
        goal.rawForm = JSON.parse(JSON.stringify(form));
      }
    } else if (state.addingShortGoalToTreeLongGoalId) {
      const parentLongGoal = findLongGoalById(state.addingShortGoalToTreeLongGoalId);
      if (!parentLongGoal) {
        showToast("تعذر العثور على الهدف الطويل");
        return false;
      }
      parentLongGoal.shortGoals = parentLongGoal.shortGoals || [];
      parentLongGoal.shortGoals.push({
        id: `sg-${Date.now()}`,
        name: form.name.trim(),
        collectionType: collectionLabel,
        masteryMode: masteryModeVal,
        attempts: attemptsVal,
        options: options,
        instructions: form.instructions || "",
        objectives: form.objectives || "",
        materials: form.materials || "",
        activities: form.activities || "",
        rawForm: JSON.parse(JSON.stringify(form))
      });
      state.openIds.add(`goal:${parentLongGoal.id}`);
    } else {
      state.shortGoalsDraft.push({
        name: form.name.trim(),
        type: form.collectionType,
        form: JSON.parse(JSON.stringify(form))
      });
    }

    return true;
  }

  function countLabel(count, label) {
    return `${count} ${label}`;
  }

  function getNestedCollections(node, kind) {
    if (kind === "curriculum") {
      return {
        active: node.aspects || [],
        archived: node.archivedAspects || []
      };
    }

    if (kind === "aspect") {
      return {
        active: node.longGoals || [],
        archived: node.archivedLongGoals || []
      };
    }

    if (kind === "long-goal") {
      return {
        active: node.shortGoals || [],
        archived: node.archivedShortGoals || []
      };
    }

    return {
      active: node.shortGoals || [],
      archived: []
    };
  }

  function nodeMatchesSearch(node, kind, term) {
    if (!term) return true;

    if (kind === "short-goal") {
      const title = typeof node === "object" ? (node.name || "") : node;
      return title.toLowerCase().includes(term);
    }

    const searchPool = [
      node.title || "",
      ...(node.keywords || [])
    ].join(" ").toLowerCase();

    if (searchPool.includes(term)) {
      return true;
    }

    const collections = getNestedCollections(node, kind);
    const nextKind = kind === "curriculum" ? "aspect" : kind === "aspect" ? "long-goal" : "short-goal";

    return collections.active.some((child) => nodeMatchesSearch(child, nextKind, term))
      || collections.archived.some((child) => nodeMatchesSearch(child, nextKind, term));
  }

  function filterNode(node, kind, term) {
    if (!nodeMatchesSearch(node, kind, term)) return null;

    if (kind === "short-goal") {
      return node;
    }

    const collections = getNestedCollections(node, kind);
    const nextKind = kind === "curriculum" ? "aspect" : kind === "aspect" ? "long-goal" : "short-goal";

    return {
      ...node,
      ...(kind === "curriculum"
        ? {
            aspects: collections.active.map((child) => filterNode(child, nextKind, term)).filter(Boolean),
            archivedAspects: collections.archived.map((child) => filterNode(child, nextKind, term)).filter(Boolean)
          }
        : kind === "aspect"
          ? {
              longGoals: collections.active.map((child) => filterNode(child, nextKind, term)).filter(Boolean),
              archivedLongGoals: collections.archived.map((child) => filterNode(child, nextKind, term)).filter(Boolean)
            }
          : {
              shortGoals: collections.active.map((child) => filterNode(child, nextKind, term)).filter(Boolean),
              archivedShortGoals: collections.archived.map((child) => filterNode(child, nextKind, term)).filter(Boolean)
            })
    };
  }

  function getCurrentCount(node, kind) {
    if (kind === "curriculum") {
      return (node.aspects || []).length;
    }

    if (kind === "aspect") {
      return (node.longGoals || []).length;
    }

    if (kind === "long-goal") {
      return (node.shortGoals || []).length;
    }

    return (node.shortGoals || []).length;
  }

  function getTotalCount(node, kind) {
    if (kind === "curriculum") {
      return (node.aspects || []).length + (node.archivedAspects || []).length;
    }

    if (kind === "aspect") {
      return (node.longGoals || []).length + (node.archivedLongGoals || []).length;
    }

    if (kind === "long-goal") {
      return (node.shortGoals || []).length + (node.archivedShortGoals || []).length;
    }

    return (node.shortGoals || []).length;
  }

  function getCurriculumLongGoalsCount(curriculum) {
    const allAspects = [...(curriculum.aspects || []), ...(curriculum.archivedAspects || [])];
    return allAspects.reduce(
      (total, aspect) => total + (aspect.longGoals || []).length + (aspect.archivedLongGoals || []).length,
      0
    );
  }

  function getCountText(node, kind) {
    if (kind === "curriculum") {
      return `${countLabel(getTotalCount(node, kind), "الجوانب")} • ${countLabel(getCurriculumLongGoalsCount(node), "الأهداف الطويلة")}`;
    }

    if (kind === "aspect") {
      return countLabel(getTotalCount(node, kind), "الأهداف الطويلة");
    }

    return countLabel(getTotalCount(node, kind), "الأهداف القصيرة");
  }

  function renderKeywords() {
    if (!keywordsRoot) return;

    keywordsRoot.innerHTML = quickKeywords
      .map((keyword) => {
        const isActive = state.search.trim() === keyword;
        return `
          <button class="library-keyword-chip ${isActive ? "is-active" : ""}" type="button" data-keyword="${escapeHtml(keyword)}">
            ${escapeHtml(keyword)}
          </button>
        `;
      })
      .join("");
  }

  function renderTabs(ownerId, labels) {
    const activeTab = state.panelTabs[ownerId] || "active";
    return `
      <div class="library-tree-tabs" role="tablist">
        <button class="library-tree-tab ${activeTab === "active" ? "is-active" : ""}" type="button" data-panel-tab="${ownerId}" data-panel-value="active">
          ${labels.active}
        </button>
        <button class="library-tree-tab ${activeTab === "archived" ? "is-active" : ""}" type="button" data-panel-tab="${ownerId}" data-panel-value="archived">
          ${labels.archived}
        </button>
      </div>
    `;
  }

  function renderShortGoals(shortGoals) {
    if (!shortGoals.length) {
      return '<div class="library-tree-empty">لا توجد أهداف قصيرة في هذا المستوى.</div>';
    }

    return shortGoals
      .map((goal) => {
        if (typeof goal === "object") {
          const itemId = `short-goal:${goal.id}`;
          const isOpen = state.openIds.has(itemId);
          
          return `
            <article class="library-tree-item library-tree-item--short-goal library-tree-item--rich ${isOpen ? "is-open" : ""}">
              <div class="library-tree-row library-tree-row--short-goal-rich">
                <button
                  class="library-tree-toggle-short ${isOpen ? "is-open" : ""}"
                  type="button"
                  data-toggle-short-id="${itemId}"
                  aria-expanded="${isOpen ? "true" : "false"}"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="m5 8 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <div class="library-tree-content">
                  <div class="library-tree-title">${escapeHtml(goal.name)}</div>
                </div>
                <div class="library-short-goal-badges">
                  <span class="library-badge-assistance">${escapeHtml(goal.collectionType)}</span>
                  <div class="library-curriculum-actions">
                    <button class="library-curriculum-kebab" type="button" aria-label="خيارات الهدف القصير" data-short-goal-menu-toggle="${goal.id}">
                      <span></span><span></span><span></span>
                    </button>
                    <div class="library-curriculum-menu ${state.menuOpenId === goal.id ? "is-open" : ""}">
                      <button class="library-curriculum-menu-item" type="button" data-short-goal-action="copy-to" data-short-goal-id="${goal.id}">
                        <span>نسخ إلى</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                      <button class="library-curriculum-menu-item" type="button" data-short-goal-action="quick-edit" data-short-goal-id="${goal.id}">
                        <span>تعديل سريع</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </button>
                      <button style="color: #13b98b !important;" class="library-curriculum-menu-item" type="button" data-short-goal-action="edit" data-short-goal-id="${goal.id}">
                        <span>تعديل</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                      </button>
                      <button class="library-curriculum-menu-item" type="button" data-short-goal-action="duplicate" data-short-goal-id="${goal.id}">
                        <span>تكرار</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                      </button>
                      <button class="library-curriculum-menu-item is-danger" type="button" data-short-goal-action="archive" data-short-goal-id="${goal.id}">
                        <span>${(function() {
                          const p = findShortGoalParent(goal.id);
                          return p && p.shortGoalsList === p.longGoal.archivedShortGoals ? "إلغاء الأرشفة" : "أرشفة";
                        })()}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M6 7v13h12V7M8 4h8l2 3H6l2-3Zm3 7h2"/></svg>
                      </button>
                      <button class="library-curriculum-menu-item is-danger" type="button" data-short-goal-action="delete" data-short-goal-id="${goal.id}">
                        <span>حذف</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M9 6V4h6v2m-8 0 1 14h8l1-14"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              ${isOpen ? `
                <div class="library-short-goal-detail-panel">
                  <button class="library-short-goal-close" type="button" data-close-short-id="${itemId}" aria-label="إغلاق">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  
                  <div class="library-panel-header">
                    <span class="library-panel-tab-title">طريقة جمع البيانات : <span class="highlight">${escapeHtml(goal.collectionType)}</span></span>
                  </div>
                  
                  <div class="library-panel-chips">
                    ${(goal.options || []).map((opt, i) => `
                      <div class="library-panel-chip-group">
                        <span class="library-panel-chip-index">خيار ${i + 1}</span>
                        <span class="library-panel-chip-value">${escapeHtml(opt)}</span>
                      </div>
                    `).join("")}
                  </div>
                  
                  <div class="library-panel-subtabs">
                    <span class="library-panel-subtab active">إعدادات متقدمة</span>
                  </div>
                  
                  <!-- عرض الحقول المتقدمة الغنية إذا كانت تحتوي على نصوص -->
                  ${(goal.instructions || goal.objectives || goal.materials || goal.activities) ? `
                    <div class="library-panel-rich-sections" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 18px 0; padding: 18px; background: #f8fafc; border-radius: 8px; border: 1px solid #edf2f7; text-align: right;" dir="rtl">
                      ${goal.instructions ? `
                        <div class="rich-section-card" style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #edf1f7; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                          <h4 style="font-size: 13.5px; color: #4a5568; margin: 0 0 8px 0; font-weight: bold; border-right: 3px solid #20ba90; padding-right: 8px;">التعليمات</h4>
                          <div class="rich-section-content" style="font-size: 12.5px; color: #4a5568; line-height: 1.6; word-break: break-word;">${goal.instructions}</div>
                        </div>
                      ` : ""}
                      ${goal.objectives ? `
                        <div class="rich-section-card" style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #edf1f7; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                          <h4 style="font-size: 13.5px; color: #4a5568; margin: 0 0 8px 0; font-weight: bold; border-right: 3px solid #6e45b1; padding-right: 8px;">الأهداف</h4>
                          <div class="rich-section-content" style="font-size: 12.5px; color: #4a5568; line-height: 1.6; word-break: break-word;">${goal.objectives}</div>
                        </div>
                      ` : ""}
                      ${goal.materials ? `
                        <div class="rich-section-card" style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #edf1f7; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                          <h4 style="font-size: 13.5px; color: #4a5568; margin: 0 0 8px 0; font-weight: bold; border-right: 3px solid #1e9e58; padding-right: 8px;">الوسائل</h4>
                          <div class="rich-section-content" style="font-size: 12.5px; color: #4a5568; line-height: 1.6; word-break: break-word;">${goal.materials}</div>
                        </div>
                      ` : ""}
                      ${goal.activities ? `
                        <div class="rich-section-card" style="background: #fff; padding: 12px; border-radius: 6px; border: 1px solid #edf1f7; box-shadow: 0 2px 4px rgba(0,0,0,0.01);">
                          <h4 style="font-size: 13.5px; color: #4a5568; margin: 0 0 8px 0; font-weight: bold; border-right: 3px solid #e53e3e; padding-right: 8px;">الأنشطة التعليمية</h4>
                          <div class="rich-section-content" style="font-size: 12.5px; color: #4a5568; line-height: 1.6; word-break: break-word;">${goal.activities}</div>
                        </div>
                      ` : ""}
                    </div>
                  ` : ""}
                  
                  <div class="library-panel-footer">
                    <div class="footer-stat">
                      <span class="stat-label">خيار الإتقان</span>
                      <span class="stat-value">${escapeHtml(goal.masteryMode)}</span>
                    </div>
                    <div class="footer-stat">
                      <span class="stat-label">عدد المحاولات في الجلسة</span>
                      <span class="stat-value">${goal.attempts}</span>
                    </div>
                  </div>
                </div>
              ` : ""}
            </article>
          `;
        }

        return `
          <article class="library-tree-item library-tree-item--short-goal">
            <div class="library-tree-row library-tree-row--short-goal">
              <span class="library-tree-leaf-dot" aria-hidden="true"></span>
              <div class="library-tree-content">
                <div class="library-tree-title">${escapeHtml(goal)}</div>
              </div>
              <div class="library-tree-type-chip">هدف قصير</div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderLongGoal(goal) {
    const itemId = `goal:${goal.id}`;
    const isOpen = state.openIds.has(itemId);
    const collections = getNestedCollections(goal, "long-goal");
    const tabValue = state.panelTabs[itemId] || "active";
    const currentItems = tabValue === "archived" ? collections.archived : collections.active;
    const isAddingInlineShortGoal = state.inlineShortGoalAddingLongGoalId === goal.id;

    return `
      <article class="library-tree-item library-tree-item--long-goal ${isOpen ? "is-open" : ""}">
        <div class="library-tree-row library-tree-row--long-goal">
          <button
            class="library-tree-toggle ${isOpen ? "is-open" : ""}"
            type="button"
            data-toggle-id="${itemId}"
            aria-expanded="${isOpen ? "true" : "false"}"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="library-tree-content">
            <div class="library-tree-title">${escapeHtml(goal.title)}</div>
          </div>
          <div class="library-tree-count">${getCountText(goal, "long-goal")}</div>
          <div class="library-curriculum-actions">
            <button class="library-curriculum-kebab" type="button" aria-label="خيارات الهدف الطويل" data-long-goal-menu-toggle="${goal.id}">
              <span></span><span></span><span></span>
            </button>
            <div class="library-curriculum-menu ${state.menuOpenId === goal.id ? "is-open" : ""}">
              <button class="library-curriculum-menu-item" type="button" data-long-goal-action="quick-edit" data-long-goal-id="${goal.id}">
                <span>تعديل سريع</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="library-curriculum-menu-item is-danger" type="button" data-long-goal-action="archive" data-long-goal-id="${goal.id}">
                <span>${(function() {
                  const p = findLongGoalParent(goal.id);
                  return p && p.longGoalsList === p.aspect.archivedLongGoals ? "إلغاء الأرشفة" : "أرشفة";
                })()}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M6 7v13h12V7M8 4h8l2 3H6l2-3Zm3 7h2"/></svg>
              </button>
              <button class="library-curriculum-menu-item is-danger" type="button" data-long-goal-action="delete" data-long-goal-id="${goal.id}">
                <span>حذف</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M9 6V4h6v2m-8 0 1 14h8l1-14"/></svg>
              </button>
              <button class="library-curriculum-menu-item library-curriculum-menu-primary" type="button" data-long-goal-action="add-short-goal" data-long-goal-id="${goal.id}">+ هدف قصير جديد</button>
            </div>
          </div>
        </div>
        ${isOpen ? `
          <div class="library-tree-panel">
            ${renderTabs(itemId, { active: "الأهداف القصيرة", archived: "الأهداف القصيرة المؤرشفة" })}
            <div class="library-tree-children library-tree-children--short-goal">
              ${isAddingInlineShortGoal && tabValue === "active" ? renderInlineShortGoalForm(goal) : ""}
              ${currentItems.length 
                ? renderShortGoals(currentItems) 
                : tabValue === "archived"
                  ? `
                    <div class="library-tree-empty-alert">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span>لا يوجد أهداف قصيرة مؤرشفة</span>
                    </div>
                  `
                  : (!isAddingInlineShortGoal ? `
                    <div class="library-empty-state-container" style="width: min(100%, 98rem); max-width: calc(100% - 150px); margin-right: 0; margin-left: auto;">
                      <div class="library-empty-alert-card">
                        <span class="library-empty-alert-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </span>
                        <span>انشاء هدف قصير</span>
                      </div>
                      <div class="library-empty-btn-row" style="justify-content: flex-start;">
                        <button type="button" class="btn-empty-add-short-goal" data-action-add-short-goal="${goal.id}">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                          </svg>
                          <span>إضافة هدف قصير</span>
                        </button>
                      </div>
                    </div>
                  ` : "")
              }
            </div>
          </div>
        ` : ""}
      </article>
    `;
  }

  function renderAspect(aspect) {
    const itemId = `aspect:${aspect.id}`;
    const isOpen = state.openIds.has(itemId);
    const collections = getNestedCollections(aspect, "aspect");
    const tabValue = state.panelTabs[itemId] || "active";
    const currentItems = tabValue === "archived" ? collections.archived : collections.active;
    const isAddingInlineLongGoal = state.inlineLongGoalAddingAspectId === aspect.id;

    return `
      <article class="library-tree-item library-tree-item--aspect ${isOpen ? "is-open" : ""}">
        <div class="library-tree-row library-tree-row--aspect">
          <button
            class="library-tree-toggle ${isOpen ? "is-open" : ""}"
            type="button"
            data-toggle-id="${itemId}"
            aria-expanded="${isOpen ? "true" : "false"}"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="library-tree-content">
            <div class="library-tree-title">${escapeHtml(aspect.title)}</div>
          </div>
          <div class="library-tree-count">${getCountText(aspect, "aspect")}</div>
          <div class="library-curriculum-actions">
            <button class="library-curriculum-kebab" type="button" aria-label="خيارات الجانب" data-aspect-menu-toggle="${aspect.id}">
              <span></span><span></span><span></span>
            </button>
            <div class="library-curriculum-menu ${state.menuOpenId === aspect.id ? "is-open" : ""}">
              <button class="library-curriculum-menu-item" type="button" data-aspect-action="quick-edit" data-aspect-id="${aspect.id}">
                <span>تعديل سريع</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="library-curriculum-menu-item is-danger" type="button" data-aspect-action="archive" data-aspect-id="${aspect.id}">
                <span>${(function() {
                  const p = findAspectParent(aspect.id);
                  return p && p.aspectsList === p.curriculum.archivedAspects ? "إلغاء الأرشفة" : "أرشفة";
                })()}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M6 7v13h12V7M8 4h8l2 3H6l2-3Zm3 7h2"/></svg>
              </button>
              <button class="library-curriculum-menu-item is-danger" type="button" data-aspect-action="delete" data-aspect-id="${aspect.id}">
                <span>حذف</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M9 6V4h6v2m-8 0 1 14h8l1-14"/></svg>
              </button>
              <button class="library-curriculum-menu-item library-curriculum-menu-primary" type="button" data-aspect-action="add-long-goal" data-aspect-id="${aspect.id}">+ هدف طويل جديد</button>
            </div>
          </div>
        </div>
        ${isOpen ? `
          <div class="library-tree-panel">
            ${renderTabs(itemId, { active: "الأهداف الطويلة", archived: "الأهداف الطويلة المؤرشفة" })}
            <div class="library-tree-children library-tree-children--long-goal">
              ${isAddingInlineLongGoal && tabValue === "active" ? renderInlineLongGoalForm(aspect) : ""}
              ${currentItems.length 
                ? currentItems.map(renderLongGoal).join("") 
                : tabValue === "archived"
                  ? `
                    <div class="library-tree-empty-alert">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span>لا يوجد أهداف طويلة مؤرشفة</span>
                    </div>
                  `
                  : (!isAddingInlineLongGoal ? `
                    <div class="library-empty-state-container" style="width: min(100%, 106rem); max-width: calc(100% - 104px); margin-right: 0; margin-left: auto;">
                      <div class="library-empty-alert-card">
                        <span class="library-empty-alert-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </span>
                        <span>انشاء هدف طويل جديد</span>
                      </div>
                      <div class="library-empty-btn-row" style="justify-content: flex-start;">
                        <button type="button" class="btn-empty-add-long-goal" data-action-add-long-goal="${aspect.id}">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                          </svg>
                          <span>إضافة هدف طويل جديد</span>
                        </button>
                      </div>
                    </div>
                  ` : "")
              }
            </div>
          </div>
        ` : ""}
      </article>
    `;
  }

  function renderInlineAspectForm(curriculum) {
    const hasError = !!state.inlineAspectError;
    return `
      <article class="library-tree-item library-tree-item--inline-form">
        <div class="library-tree-row library-tree-row--aspect library-tree-row--inline-form">
          <div class="inline-aspect-input-wrapper">
            <input
              type="text"
              class="inline-aspect-input ${hasError ? "has-error" : ""}"
              placeholder="اسم الجانب"
              value="${escapeHtml(state.inlineAspectName || '')}"
              data-inline-aspect-input
              data-curriculum-id="${curriculum.id}"
            />
            ${hasError ? `
              <div class="inline-aspect-error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>${escapeHtml(state.inlineAspectError)}</span>
              </div>
            ` : ""}
          </div>
          <div class="inline-aspect-actions">
            <button type="button" class="btn-inline-save" data-inline-aspect-create data-curriculum-id="${curriculum.id}">انشاء</button>
            <button type="button" class="btn-inline-save-more" data-inline-aspect-create-more data-curriculum-id="${curriculum.id}">انشاء وأضف جانب آخر</button>
            <button type="button" class="btn-inline-cancel" data-inline-aspect-cancel data-curriculum-id="${curriculum.id}">إلغاء</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderInlineLongGoalForm(aspect) {
    const hasError = !!state.inlineLongGoalError;
    return `
      <article class="library-tree-item library-tree-item--inline-form" style="width: min(100%, 106rem); max-width: calc(100% - 104px); margin-right: 0; margin-left: auto;">
        <div class="library-tree-row library-tree-row--long-goal library-tree-row--inline-form">
          <div class="inline-aspect-input-wrapper">
            <input
              type="text"
              class="inline-aspect-input ${hasError ? "has-error" : ""}"
              placeholder="إسم الهدف الطويل"
              value="${escapeHtml(state.inlineLongGoalName || '')}"
              data-inline-long-goal-input
              data-aspect-id="${aspect.id}"
            />
            ${hasError ? `
              <div class="inline-aspect-error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>${escapeHtml(state.inlineLongGoalError)}</span>
              </div>
            ` : ""}
          </div>
          <div class="inline-aspect-actions">
            <button type="button" class="btn-inline-save" data-inline-long-goal-create data-aspect-id="${aspect.id}">انشاء</button>
            <button type="button" class="btn-inline-save-more" data-inline-long-goal-create-more data-aspect-id="${aspect.id}">انشاء وأضف هدف طويل آخر</button>
            <button type="button" class="btn-inline-cancel" data-inline-long-goal-cancel data-aspect-id="${aspect.id}">إلغاء</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderInlineShortGoalForm(longGoal) {
    const hasError = !!state.inlineShortGoalError;
    return `
      <article class="library-tree-item library-tree-item--inline-form" style="width: min(100%, 98rem); max-width: calc(100% - 150px); margin-right: 0; margin-left: auto;">
        <div class="library-tree-row library-tree-row--short-goal library-tree-row--inline-form">
          <div class="inline-aspect-input-wrapper">
            <input
              type="text"
              class="inline-aspect-input ${hasError ? "has-error" : ""}"
              placeholder="اسم الهدف القصير"
              value="${escapeHtml(state.inlineShortGoalName || '')}"
              data-inline-short-goal-input
              data-long-goal-id="${longGoal.id}"
            />
            ${hasError ? `
              <div class="inline-aspect-error-msg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>${escapeHtml(state.inlineShortGoalError)}</span>
              </div>
            ` : ""}
          </div>
          <div class="inline-aspect-actions">
            <button type="button" class="btn-inline-save" data-inline-short-goal-create data-long-goal-id="${longGoal.id}">انشاء</button>
            <button type="button" class="btn-inline-save-more" data-inline-short-goal-create-more data-long-goal-id="${longGoal.id}">انشاء وأضف هدف قصير آخر</button>
            <button type="button" class="btn-inline-cancel" data-inline-short-goal-cancel data-long-goal-id="${longGoal.id}">إلغاء</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCurriculum(curriculum) {
    const itemId = `curriculum:${curriculum.id}`;
    const isOpen = state.openIds.has(itemId);
    const collections = getNestedCollections(curriculum, "curriculum");
    const tabValue = state.panelTabs[itemId] || "active";
    const currentItems = tabValue === "archived" ? collections.archived : collections.active;
    const isAddingInline = state.inlineAspectAddingCurriculumId === curriculum.id;
    const showPanel = isOpen;

    const archiveActionLabel = state.rootTab === "archived" ? "إلغاء الأرشفة" : "أرشفة";

    return `
      <article class="library-tree-item library-tree-item--curriculum ${isOpen ? "is-open" : ""}">
        <div class="library-tree-row library-tree-row--curriculum">
          <button
            class="library-tree-toggle ${isOpen ? "is-open" : ""}"
            type="button"
            data-toggle-id="${itemId}"
            aria-expanded="${isOpen ? "true" : "false"}"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="library-tree-content library-tree-content--curriculum">
            <div class="library-tree-title">${escapeHtml(curriculum.title)}</div>
            <span class="library-tree-badge">${escapeHtml(curriculum.status)}</span>
          </div>
          <div class="library-tree-count">${getCountText(curriculum, "curriculum")}</div>
          <div class="library-curriculum-actions">
            <button class="library-curriculum-kebab" type="button" aria-label="خيارات المنهج" data-curriculum-menu-toggle="${curriculum.id}">
              <span></span><span></span><span></span>
            </button>
            <div class="library-curriculum-menu ${state.menuOpenId === curriculum.id ? "is-open" : ""}">
              <button style="color: #13b98b !important;" class="library-curriculum-menu-item" type="button" data-curriculum-action="edit" data-curriculum-id="${curriculum.id}">
                <span>تعديل سريع</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>
              </button>
              <button class="library-curriculum-menu-item is-danger" type="button" data-curriculum-action="delete" data-curriculum-id="${curriculum.id}">
                <span>حذف</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18M9 6V4h6v2m-8 0 1 14h8l1-14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="library-curriculum-menu-item is-danger" type="button" data-curriculum-action="archive" data-curriculum-id="${curriculum.id}">
                <span>${archiveActionLabel}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M6 7v13h12V7M8 4h8l2 3H6l2-3Zm3 7h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="library-curriculum-menu-item library-curriculum-menu-primary" type="button" data-curriculum-action="add-aspect" data-curriculum-id="${curriculum.id}">جانب جديد</button>
            </div>
          </div>
        </div>
        ${showPanel ? `
          <div class="library-tree-panel">
            ${renderTabs(itemId, { active: "الجوانب", archived: "الجوانب المؤرشفة" })}
            <div class="library-tree-children library-tree-children--aspect">
              ${isAddingInline && tabValue === "active" ? renderInlineAspectForm(curriculum) : ""}
              ${currentItems.length 
                ? currentItems.map(renderAspect).join("") 
                : (tabValue === "archived"
                  ? `
                    <div class="library-tree-empty-alert">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span>لا يوجد جوانب مؤرشفة</span>
                    </div>
                  `
                  : (!isAddingInline ? `
                    <div class="library-empty-state-container" style="width: min(100%, 114rem); max-width: calc(100% - 58px); margin-right: 0; margin-left: auto;">
                      <div class="library-empty-alert-card">
                        <span class="library-empty-alert-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </span>
                        <span>انشاء جانب جديد</span>
                      </div>
                      <div class="library-empty-btn-row" style="justify-content: flex-start;">
                        <button type="button" class="btn-empty-add-aspect" data-action-add-aspect="${curriculum.id}">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                          </svg>
                          <span>إضافة جانب جديد</span>
                        </button>
                      </div>
                    </div>
                  ` : ""))
              }
            </div>
          </div>
        ` : ""}
      </article>
    `;
  }

  function renderTree() {
    const searchTerm = state.search.trim().toLowerCase();
    const source = libraryData[state.rootTab] || [];
    const items = searchTerm
      ? source.map((item) => filterNode(item, "curriculum", searchTerm)).filter(Boolean)
      : source;

    rootTabs.forEach((tab) => {
      const isActive = tab.dataset.libraryRootTab === state.rootTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-pressed", isActive ? "true" : "false");
      tab.classList.toggle("tab-pill", isActive);
      tab.classList.toggle("line-tab", !isActive);
    });

    if (searchInput && searchInput.value !== state.search) {
      searchInput.value = state.search;
    }

    if (!items.length) {
      treeRoot.innerHTML = `
        <div class="library-tree-empty-state">
          <h3>لا توجد نتائج مطابقة</h3>
          <p>جرّب كلمة بحث أخرى أو انتقل إلى تبويب مختلف من تبويبات المناهج.</p>
        </div>
      `;
      renderKeywords();
      scheduleTreeLines();
      return;
    }

    treeRoot.innerHTML = items.map(renderCurriculum).join("");
    renderKeywords();
    scheduleTreeLines();
  }

  function closeNestedOpenIds(itemId) {
    const prefixes = itemId.startsWith("curriculum:")
      ? ["aspect:", "goal:"]
      : itemId.startsWith("aspect:")
        ? ["goal:"]
        : [];

    if (!prefixes.length) return;

    Array.from(state.openIds).forEach((openId) => {
      if (prefixes.some((prefix) => openId.startsWith(prefix))) {
        state.openIds.delete(openId);
      }
    });
  }

  rootTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextTab = tab.dataset.libraryRootTab;
      if (!nextTab || nextTab === state.rootTab) return;
      closeShortGoalOverlay();
      state.rootTab = nextTab;
      renderTree();
    });
  });

  searchInput?.addEventListener("input", (event) => {
    state.search = event.target.value || "";
    renderTree();
  });

  keywordsRoot?.addEventListener("click", (event) => {
    const keywordButton = event.target.closest("[data-keyword]");
    if (!keywordButton) return;

    const keyword = keywordButton.getAttribute("data-keyword") || "";
    state.search = state.search.trim() === keyword ? "" : keyword;
    renderTree();
  });

  treeRoot.addEventListener("click", (event) => {
    // Empty state purple button clicks
    const actionAddAspect = event.target.closest("[data-action-add-aspect]");
    if (actionAddAspect) {
      const curriculumId = actionAddAspect.getAttribute("data-action-add-aspect");
      const found = findCurriculumById(curriculumId);
      if (found) {
        const curriculum = libraryData[found.list][found.index];
        state.inlineAspectAddingCurriculumId = curriculum.id;
        state.inlineAspectName = "";
        state.inlineAspectError = "";
        state.inlineAspectTouched = false;

        state.openIds.add(`curriculum:${curriculum.id}`);
        state.panelTabs[`curriculum:${curriculum.id}`] = "active";

        renderTree();

        setTimeout(() => {
          const input = document.querySelector("[data-inline-aspect-input]");
          if (input) {
            input.focus();
          }
        }, 50);
      }
      return;
    }

    const actionAddLongGoal = event.target.closest("[data-action-add-long-goal]");
    if (actionAddLongGoal) {
      const aspectId = actionAddLongGoal.getAttribute("data-action-add-long-goal");
      const foundAspect = findAspectById(aspectId);

      if (foundAspect) {
        state.inlineLongGoalAddingAspectId = foundAspect.id;
        state.inlineLongGoalName = "";
        state.inlineLongGoalError = "";
        state.inlineLongGoalTouched = false;
        state.openIds.add(`aspect:${foundAspect.id}`);
        renderTree();
        setTimeout(() => {
          const input = document.querySelector(`[data-inline-long-goal-input][data-aspect-id="${foundAspect.id}"]`);
          if (input) {
            input.focus();
          }
        }, 50);
      }
      return;
    }

    // Inline aspect actions
    const inlineAspectCreate = event.target.closest("[data-inline-aspect-create]");
    if (inlineAspectCreate) {
      const curriculumId = inlineAspectCreate.getAttribute("data-curriculum-id");
      const found = findCurriculumById(curriculumId);
      if (found) {
        const curriculum = libraryData[found.list][found.index];
        state.inlineAspectTouched = true;
        const name = (state.inlineAspectName || "").trim();
        if (name.length < 2) {
          state.inlineAspectError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector("[data-inline-aspect-input]");
            input?.focus();
          }, 50);
        } else {
          if (addAspectToCurriculum(curriculum, name)) {
            state.inlineAspectAddingCurriculumId = null;
            state.inlineAspectName = "";
            state.inlineAspectError = "";
            state.inlineAspectTouched = false;
            renderTree();
          }
        }
      }
      return;
    }

    const inlineAspectCreateMore = event.target.closest("[data-inline-aspect-create-more]");
    if (inlineAspectCreateMore) {
      const curriculumId = inlineAspectCreateMore.getAttribute("data-curriculum-id");
      const found = findCurriculumById(curriculumId);
      if (found) {
        const curriculum = libraryData[found.list][found.index];
        state.inlineAspectTouched = true;
        const name = (state.inlineAspectName || "").trim();
        if (name.length < 2) {
          state.inlineAspectError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector("[data-inline-aspect-input]");
            input?.focus();
          }, 50);
        } else {
          if (addAspectToCurriculum(curriculum, name)) {
            state.inlineAspectName = "";
            state.inlineAspectError = "";
            state.inlineAspectTouched = false;
            renderTree();
            setTimeout(() => {
              const input = document.querySelector("[data-inline-aspect-input]");
              input?.focus();
            }, 50);
          }
        }
      }
      return;
    }

    const inlineAspectCancel = event.target.closest("[data-inline-aspect-cancel]");
    if (inlineAspectCancel) {
      state.inlineAspectAddingCurriculumId = null;
      state.inlineAspectName = "";
      state.inlineAspectError = "";
      state.inlineAspectTouched = false;
      renderTree();
      return;
    }

    const inlineLongGoalCreate = event.target.closest("[data-inline-long-goal-create]");
    if (inlineLongGoalCreate) {
      const aspectId = inlineLongGoalCreate.getAttribute("data-aspect-id");
      const foundAspect = findAspectById(aspectId);
      if (foundAspect) {
        state.inlineLongGoalTouched = true;
        const name = (state.inlineLongGoalName || "").trim();
        if (name.length < 2) {
          state.inlineLongGoalError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector(`[data-inline-long-goal-input][data-aspect-id="${aspectId}"]`);
            input?.focus();
          }, 50);
        } else {
          if (addLongGoalToAspect(foundAspect, name)) {
            state.inlineLongGoalAddingAspectId = null;
            state.inlineLongGoalName = "";
            state.inlineLongGoalError = "";
            state.inlineLongGoalTouched = false;
            renderTree();
          }
        }
      }
      return;
    }

    const inlineLongGoalCreateMore = event.target.closest("[data-inline-long-goal-create-more]");
    if (inlineLongGoalCreateMore) {
      const aspectId = inlineLongGoalCreateMore.getAttribute("data-aspect-id");
      const foundAspect = findAspectById(aspectId);
      if (foundAspect) {
        state.inlineLongGoalTouched = true;
        const name = (state.inlineLongGoalName || "").trim();
        if (name.length < 2) {
          state.inlineLongGoalError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector(`[data-inline-long-goal-input][data-aspect-id="${aspectId}"]`);
            input?.focus();
          }, 50);
        } else {
          if (addLongGoalToAspect(foundAspect, name)) {
            state.inlineLongGoalName = "";
            state.inlineLongGoalError = "";
            state.inlineLongGoalTouched = false;
            renderTree();
            setTimeout(() => {
              const input = document.querySelector(`[data-inline-long-goal-input][data-aspect-id="${aspectId}"]`);
              input?.focus();
            }, 50);
          }
        }
      }
      return;
    }

    const inlineLongGoalCancel = event.target.closest("[data-inline-long-goal-cancel]");
    if (inlineLongGoalCancel) {
      state.inlineLongGoalAddingAspectId = null;
      state.inlineLongGoalName = "";
      state.inlineLongGoalError = "";
      state.inlineLongGoalTouched = false;
      renderTree();
      return;
    }

    const actionAddShortGoal = event.target.closest("[data-action-add-short-goal]");
    if (actionAddShortGoal) {
      const longGoalId = actionAddShortGoal.getAttribute("data-action-add-short-goal");
      const foundLongGoal = findLongGoalById(longGoalId);

      if (foundLongGoal) {
        state.addingShortGoalToTreeLongGoalId = foundLongGoal.id;
        state.editingShortGoalId = null;
        resetShortGoalForm();
        renderShortGoalForm();
      }
      return;
    }

    const inlineShortGoalCreate = event.target.closest("[data-inline-short-goal-create]");
    if (inlineShortGoalCreate) {
      const longGoalId = inlineShortGoalCreate.getAttribute("data-long-goal-id");
      const foundLongGoal = findLongGoalById(longGoalId);
      if (foundLongGoal) {
        state.inlineShortGoalTouched = true;
        const name = (state.inlineShortGoalName || "").trim();
        if (name.length < 2) {
          state.inlineShortGoalError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector(`[data-inline-short-goal-input][data-long-goal-id="${longGoalId}"]`);
            input?.focus();
          }, 50);
        } else {
          if (addShortGoalToLongGoal(foundLongGoal, name)) {
            state.inlineShortGoalAddingLongGoalId = null;
            state.inlineShortGoalName = "";
            state.inlineShortGoalError = "";
            state.inlineShortGoalTouched = false;
            renderTree();
          }
        }
      }
      return;
    }

    const inlineShortGoalCreateMore = event.target.closest("[data-inline-short-goal-create-more]");
    if (inlineShortGoalCreateMore) {
      const longGoalId = inlineShortGoalCreateMore.getAttribute("data-long-goal-id");
      const foundLongGoal = findLongGoalById(longGoalId);
      if (foundLongGoal) {
        state.inlineShortGoalTouched = true;
        const name = (state.inlineShortGoalName || "").trim();
        if (name.length < 2) {
          state.inlineShortGoalError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector(`[data-inline-short-goal-input][data-long-goal-id="${longGoalId}"]`);
            input?.focus();
          }, 50);
        } else {
          if (addShortGoalToLongGoal(foundLongGoal, name)) {
            state.inlineShortGoalName = "";
            state.inlineShortGoalError = "";
            state.inlineShortGoalTouched = false;
            renderTree();
            setTimeout(() => {
              const input = document.querySelector(`[data-inline-short-goal-input][data-long-goal-id="${longGoalId}"]`);
              input?.focus();
            }, 50);
          }
        }
      }
      return;
    }

    const inlineShortGoalCancel = event.target.closest("[data-inline-short-goal-cancel]");
    if (inlineShortGoalCancel) {
      state.inlineShortGoalAddingLongGoalId = null;
      state.inlineShortGoalName = "";
      state.inlineShortGoalError = "";
      state.inlineShortGoalTouched = false;
      renderTree();
      return;
    }

    const menuToggle = event.target.closest("[data-curriculum-menu-toggle]");
    if (menuToggle) {
      const curriculumId = menuToggle.getAttribute("data-curriculum-menu-toggle");
      if (!curriculumId) return;
      state.menuOpenId = state.menuOpenId === curriculumId ? null : curriculumId;
      renderTree();
      return;
    }

    const aspectMenuToggle = event.target.closest("[data-aspect-menu-toggle]");
    if (aspectMenuToggle) {
      const aspectId = aspectMenuToggle.getAttribute("data-aspect-menu-toggle");
      if (!aspectId) return;
      state.menuOpenId = state.menuOpenId === aspectId ? null : aspectId;
      renderTree();
      return;
    }

    const longGoalMenuToggle = event.target.closest("[data-long-goal-menu-toggle]");
    if (longGoalMenuToggle) {
      const longGoalId = longGoalMenuToggle.getAttribute("data-long-goal-menu-toggle");
      if (!longGoalId) return;
      state.menuOpenId = state.menuOpenId === longGoalId ? null : longGoalId;
      renderTree();
      return;
    }

    const shortGoalMenuToggle = event.target.closest("[data-short-goal-menu-toggle]");
    if (shortGoalMenuToggle) {
      const shortGoalId = shortGoalMenuToggle.getAttribute("data-short-goal-menu-toggle");
      if (!shortGoalId) return;
      state.menuOpenId = state.menuOpenId === shortGoalId ? null : shortGoalId;
      renderTree();
      return;
    }

    const aspectAction = event.target.closest("[data-aspect-action]");
    if (aspectAction) {
      const action = aspectAction.getAttribute("data-aspect-action");
      const aspectId = aspectAction.getAttribute("data-aspect-id");
      if (!action || !aspectId) return;

      const parent = findAspectParent(aspectId);
      if (!parent) return;
      const aspect = parent.aspectsList[parent.index];

      if (action === "quick-edit") {
        openQuickEditItemModal("تعديل الجانب", "اسم الجانب", aspect.title, (nextVal) => {
          aspect.title = nextVal;
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "delete") {
        openDeleteConfirmModal(aspect.title, () => {
          parent.aspectsList.splice(parent.index, 1);
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "archive") {
        toggleAspectArchive(aspectId);
      } else if (action === "add-long-goal") {
        state.inlineLongGoalAddingAspectId = aspect.id;
        state.inlineLongGoalName = "";
        state.inlineLongGoalError = "";
        state.inlineLongGoalTouched = false;
        state.openIds.add(`aspect:${aspect.id}`);
        state.panelTabs[`aspect:${aspect.id}`] = "active";

        state.menuOpenId = null;
        renderTree();

        setTimeout(() => {
          const input = document.querySelector(`[data-inline-long-goal-input][data-aspect-id="${aspect.id}"]`);
          if (input) {
            input.focus();
          }
        }, 50);
        return;
      }

      state.menuOpenId = null;
      renderTree();
      return;
    }

    const longGoalAction = event.target.closest("[data-long-goal-action]");
    if (longGoalAction) {
      const action = longGoalAction.getAttribute("data-long-goal-action");
      const longGoalId = longGoalAction.getAttribute("data-long-goal-id");
      if (!action || !longGoalId) return;

      const parent = findLongGoalParent(longGoalId);
      if (!parent) return;
      const longGoal = parent.longGoalsList[parent.index];

      if (action === "quick-edit") {
        openQuickEditItemModal("تعديل الهدف الطويل", "اسم الهدف الطويل", longGoal.title, (nextVal) => {
          longGoal.title = nextVal;
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "delete") {
        openDeleteConfirmModal(longGoal.title, () => {
          parent.longGoalsList.splice(parent.index, 1);
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "archive") {
        toggleLongGoalArchive(longGoalId);
      } else if (action === "add-short-goal") {
        state.addingShortGoalToTreeLongGoalId = longGoal.id;
        state.editingShortGoalId = null;
        resetShortGoalForm();
        renderShortGoalForm();
        state.menuOpenId = null;
        renderTree();
        return;
      }

      state.menuOpenId = null;
      renderTree();
      return;
    }

    const shortGoalAction = event.target.closest("[data-short-goal-action]");
    if (shortGoalAction) {
      const action = shortGoalAction.getAttribute("data-short-goal-action");
      const shortGoalId = shortGoalAction.getAttribute("data-short-goal-id");
      if (!action || !shortGoalId) return;

      const parent = findShortGoalParent(shortGoalId);
      if (!parent) return;
      const shortGoal = parent.shortGoalsList[parent.index];

      if (action === "quick-edit") {
        openQuickEditItemModal("تعديل الهدف القصير", "اسم الهدف القصير", shortGoal.name, (nextVal) => {
          shortGoal.name = nextVal;
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "delete") {
        openDeleteConfirmModal(shortGoal.name, () => {
          parent.shortGoalsList.splice(parent.index, 1);
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "archive") {
        toggleShortGoalArchive(shortGoalId);
      } else if (action === "duplicate") {
        const cloned = JSON.parse(JSON.stringify(shortGoal));
        cloned.id = `sg-${Date.now()}`;
        cloned.name = `نسخة - ${cloned.name}`;
        parent.shortGoalsList.splice(parent.index + 1, 0, cloned);
        showToast("تم تكرار الهدف القصير بنجاح");
      } else if (action === "copy-to") {
        openCopyToModal(shortGoal, (targetLg, nextName) => {
          const cloned = JSON.parse(JSON.stringify(shortGoal));
          cloned.id = `sg-${Date.now()}`;
          cloned.name = nextName;
          targetLg.shortGoals = targetLg.shortGoals || [];
          targetLg.shortGoals.unshift(cloned);
          state.openIds.add(`goal:${targetLg.id}`);
          showToast("تم نسخ الهدف القصير بنجاح");
          renderTree();
        });
      } else if (action === "edit") {
        loadShortGoalIntoForm(shortGoal);
        state.editingShortGoalId = shortGoal.id;
        state.createStep = "short-goal-form";
        setCreateScreenOpen(true);
        renderCreateFlow();
      }

      state.menuOpenId = null;
      renderTree();
      return;
    }

    const menuAction = event.target.closest("[data-curriculum-action]");
    if (menuAction) {
      const action = menuAction.getAttribute("data-curriculum-action");
      const curriculumId = menuAction.getAttribute("data-curriculum-id");
      if (!action || !curriculumId) return;

      const found = findCurriculumById(curriculumId);
      if (!found) return;

      const curriculum = libraryData[found.list][found.index];

      if (action === "edit") {
        openQuickEditModal(curriculum, (nextTitle) => {
          curriculum.title = nextTitle;
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "delete") {
        openDeleteConfirmModal(curriculum.title, () => {
          libraryData[found.list].splice(found.index, 1);
          state.menuOpenId = null;
          renderTree();
        });
        return;
      } else if (action === "archive") {
        libraryData[found.list].splice(found.index, 1);
        if (found.list === "active") {
          libraryData.archived.unshift(curriculum);
        } else {
          libraryData.active.unshift(curriculum);
        }
      } else if (action === "add-aspect") {
        state.inlineAspectAddingCurriculumId = curriculum.id;
        state.inlineAspectName = "";
        state.inlineAspectError = "";
        state.inlineAspectTouched = false;

        state.openIds.add(`curriculum:${curriculum.id}`);
        state.panelTabs[`curriculum:${curriculum.id}`] = "active";

        state.menuOpenId = null;
        renderTree();

        setTimeout(() => {
          const input = document.querySelector("[data-inline-aspect-input]");
          if (input) {
            input.focus();
            const val = input.value;
            input.value = "";
            input.value = val;
          }
        }, 50);
        return;
      }

      state.menuOpenId = null;
      renderTree();
      return;
    }

    const toggleShort = event.target.closest("[data-toggle-short-id]");
    if (toggleShort) {
      const itemId = toggleShort.dataset.toggleShortId;
      if (!itemId) return;

      if (state.openIds.has(itemId)) {
        state.openIds.delete(itemId);
      } else {
        state.openIds.add(itemId);
      }

      renderTree();
      return;
    }

    const closeShort = event.target.closest("[data-close-short-id]");
    if (closeShort) {
      const itemId = closeShort.dataset.closeShortId;
      if (!itemId) return;

      state.openIds.delete(itemId);
      renderTree();
      return;
    }

    const toggle = event.target.closest("[data-toggle-id]");
    if (toggle) {
      const itemId = toggle.dataset.toggleId;
      if (!itemId || toggle.disabled) return;
      closeShortGoalOverlay();

      if (state.openIds.has(itemId)) {
        state.openIds.delete(itemId);
        closeNestedOpenIds(itemId);
      } else {
        closeNestedOpenIds(itemId);
        state.openIds.add(itemId);
      }

      renderTree();
      return;
    }

    const tab = event.target.closest("[data-panel-tab]");
    if (tab) {
      const ownerId = tab.dataset.panelTab;
      const nextValue = tab.dataset.panelValue;
      if (!ownerId || !nextValue) return;
      closeShortGoalOverlay();
      state.panelTabs[ownerId] = nextValue;
      renderTree();
    }
  });

  treeRoot.addEventListener("input", (event) => {
    if (event.target.matches("[data-inline-aspect-input]")) {
      const value = event.target.value;
      state.inlineAspectName = value;

      const trimmed = value.trim();
      const inputEl = event.target;
      const wrapperEl = inputEl.closest(".inline-aspect-input-wrapper");

      let error = "";
      if (state.inlineAspectTouched || trimmed.length > 0) {
        if (trimmed.length < 2) {
          error = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
        }
      }

      state.inlineAspectError = error;

      if (error) {
        inputEl.classList.add("has-error");
        let errorEl = wrapperEl.querySelector(".inline-aspect-error-msg");
        if (!errorEl) {
          errorEl = document.createElement("div");
          errorEl.className = "inline-aspect-error-msg";
          wrapperEl.appendChild(errorEl);
        }
        errorEl.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>${escapeHtml(error)}</span>
        `;
      } else {
        inputEl.classList.remove("has-error");
        const errorEl = wrapperEl.querySelector(".inline-aspect-error-msg");
        if (errorEl) {
          errorEl.remove();
        }
      }
    }

    if (event.target.matches("[data-inline-long-goal-input]")) {
      const value = event.target.value;
      state.inlineLongGoalName = value;

      const trimmed = value.trim();
      const inputEl = event.target;
      const wrapperEl = inputEl.closest(".inline-aspect-input-wrapper");

      let error = "";
      if (state.inlineLongGoalTouched || trimmed.length > 0) {
        if (trimmed.length < 2) {
          error = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
        }
      }

      state.inlineLongGoalError = error;

      if (error) {
        inputEl.classList.add("has-error");
        let errorEl = wrapperEl.querySelector(".inline-aspect-error-msg");
        if (!errorEl) {
          errorEl = document.createElement("div");
          errorEl.className = "inline-aspect-error-msg";
          wrapperEl.appendChild(errorEl);
        }
        errorEl.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>${escapeHtml(error)}</span>
        `;
      } else {
        inputEl.classList.remove("has-error");
        const errorEl = wrapperEl.querySelector(".inline-aspect-error-msg");
        if (errorEl) {
          errorEl.remove();
        }
      }
    }

    if (event.target.matches("[data-inline-short-goal-input]")) {
      const value = event.target.value;
      state.inlineShortGoalName = value;

      const trimmed = value.trim();
      const inputEl = event.target;
      const wrapperEl = inputEl.closest(".inline-aspect-input-wrapper");

      let error = "";
      if (state.inlineShortGoalTouched || trimmed.length > 0) {
        if (trimmed.length < 2) {
          error = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
        }
      }

      state.inlineShortGoalError = error;

      if (error) {
        inputEl.classList.add("has-error");
        let errorEl = wrapperEl.querySelector(".inline-aspect-error-msg");
        if (!errorEl) {
          errorEl = document.createElement("div");
          errorEl.className = "inline-aspect-error-msg";
          wrapperEl.appendChild(errorEl);
        }
        errorEl.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>${escapeHtml(error)}</span>
        `;
      } else {
        inputEl.classList.remove("has-error");
        const errorEl = wrapperEl.querySelector(".inline-aspect-error-msg");
        if (errorEl) {
          errorEl.remove();
        }
      }
    }
  });

  treeRoot.addEventListener("keydown", (event) => {
    if (event.target.matches("[data-inline-aspect-input]") && event.key === "Enter") {
      event.preventDefault();
      const curriculumId = event.target.getAttribute("data-curriculum-id");
      const found = findCurriculumById(curriculumId);
      if (found) {
        const curriculum = libraryData[found.list][found.index];
        state.inlineAspectTouched = true;
        const name = (state.inlineAspectName || "").trim();
        if (name.length < 2) {
          state.inlineAspectError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector("[data-inline-aspect-input]");
            input?.focus();
          }, 50);
        } else {
          if (addAspectToCurriculum(curriculum, name)) {
            state.inlineAspectAddingCurriculumId = null;
            state.inlineAspectName = "";
            state.inlineAspectError = "";
            state.inlineAspectTouched = false;
            renderTree();
          }
        }
      }
    }

    if (event.target.matches("[data-inline-long-goal-input]") && event.key === "Enter") {
      event.preventDefault();
      const aspectId = event.target.getAttribute("data-aspect-id");
      const foundAspect = findAspectById(aspectId);
      if (foundAspect) {
        state.inlineLongGoalTouched = true;
        const name = (state.inlineLongGoalName || "").trim();
        if (name.length < 2) {
          state.inlineLongGoalError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector(`[data-inline-long-goal-input][data-aspect-id="${aspectId}"]`);
            input?.focus();
          }, 50);
        } else {
          if (addLongGoalToAspect(foundAspect, name)) {
            state.inlineLongGoalAddingAspectId = null;
            state.inlineLongGoalName = "";
            state.inlineLongGoalError = "";
            state.inlineLongGoalTouched = false;
            renderTree();
          }
        }
      }
    }

    if (event.target.matches("[data-inline-short-goal-input]") && event.key === "Enter") {
      event.preventDefault();
      const longGoalId = event.target.getAttribute("data-long-goal-id");
      const foundLongGoal = findLongGoalById(longGoalId);
      if (foundLongGoal) {
        state.inlineShortGoalTouched = true;
        const name = (state.inlineShortGoalName || "").trim();
        if (name.length < 2) {
          state.inlineShortGoalError = "هذه الخانة يجب أن تحتوي على الأقل 2 حرف/رمز";
          renderTree();
          setTimeout(() => {
            const input = document.querySelector(`[data-inline-short-goal-input][data-long-goal-id="${longGoalId}"]`);
            input?.focus();
          }, 50);
        } else {
          if (addShortGoalToLongGoal(foundLongGoal, name)) {
            state.inlineShortGoalAddingLongGoalId = null;
            state.inlineShortGoalName = "";
            state.inlineShortGoalError = "";
            state.inlineShortGoalTouched = false;
            renderTree();
          }
        }
      }
    }
  });

  document.addEventListener("click", (event) => {
    const isCurriculumMenuClick = event.target.closest(".library-curriculum-actions");
    if (!isCurriculumMenuClick && state.menuOpenId) {
      state.menuOpenId = null;
      renderTree();
    }
  });

  addCurriculumBtn?.addEventListener("click", () => {
    openCreateCurriculumInline();
  });

  createScreen?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("#library-create-title")) {
      state.createTitle = target.value || "";
      updateTypeSelectionInteractivity();
      return;
    }
    if (target.matches("[data-form-field]")) {
      const fieldPath = target.getAttribute("data-form-field");
      if (!fieldPath) return;

      const form = getShortGoalForm();
      const segments = fieldPath.split(".");
      let cursor = form;

      for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index];
        if (!cursor[segment] || typeof cursor[segment] !== "object") {
          cursor[segment] = {};
        }
        cursor = cursor[segment];
      }

      const lastKey = segments[segments.length - 1];
      const nextValue = target instanceof HTMLInputElement && target.type === "number"
        ? Number(target.value || 0)
        : target.value || "";

      cursor[lastKey] = nextValue;
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.closest("[data-short-goal-modal]")) return;
    if (target.matches("[data-assistance-input]")) {
      const form = getShortGoalForm();
      const idx = Number(target.getAttribute("data-assistance-input"));
      if (!Number.isInteger(idx) || idx < 0) return;
      if (!Array.isArray(form.assistanceOptions)) form.assistanceOptions = [];
      form.assistanceOptions[idx] = target.value || "";
      return;
    }
    if (!target.matches("[data-form-field]")) return;

    const fieldPath = target.getAttribute("data-form-field");
    if (!fieldPath) return;

    const form = getShortGoalForm();
    const segments = fieldPath.split(".");
    let cursor = form;

    for (let index = 0; index < segments.length - 1; index += 1) {
      const segment = segments[index];
      if (!cursor[segment] || typeof cursor[segment] !== "object") {
        cursor[segment] = {};
      }
      cursor = cursor[segment];
    }

    const lastKey = segments[segments.length - 1];
    const nextValue = target instanceof HTMLInputElement && target.type === "number"
      ? Number(target.value || 0)
      : target.value || "";

    cursor[lastKey] = nextValue;
    if (fieldPath === "masteryPercent") {
      const bounded = Math.max(0, Math.min(100, Number(nextValue) || 0));
      form.masteryPercent = bounded;
      const range = document.querySelector("[data-mastery-range]");
      if (range instanceof HTMLInputElement) {
        range.value = String(bounded);
        updateMasteryRangeFill(range, bounded);
      }
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.matches("[data-short-advanced-toggle]")) {
      state.shortAdvancedOpen = target.checked;
      refreshShortGoalFormUi();
      return;
    }
    if (target.matches("[data-mastery-range]")) {
      const form = getShortGoalForm();
      const bounded = Math.max(0, Math.min(100, Number(target.value || 0)));
      form.masteryPercent = bounded;
      updateMasteryRangeFill(target, bounded);
      return;
    }
  });

  function updateMasteryRangeFill(rangeInput, value) {
    if (!(rangeInput instanceof HTMLInputElement)) return;
    const bounded = Math.max(0, Math.min(100, Number(value) || 0));
    rangeInput.style.background = `linear-gradient(to left, #0bb79e 0%, #0bb79e ${bounded}%, #e5e7eb ${bounded}%, #e5e7eb 100%)`;
    const percentNode = document.querySelector("[data-mastery-percent-value]");
    if (percentNode) {
      percentNode.textContent = String(bounded);
    }
  }

  function syncMasteryRangeFill() {
    const range = document.querySelector("[data-mastery-range]");
    if (!(range instanceof HTMLInputElement)) return;
    const bounded = Math.max(0, Math.min(100, Number(range.value || 0)));
    updateMasteryRangeFill(range, bounded);
  }

  createScreen?.addEventListener("click", (event) => {
    const actionBtn = event.target.closest("[data-create-mode], [data-create-submit], [data-create-cancel], [data-simple-done], [data-add-short-goal], [data-collection], [data-assist-type], [data-assistance-choice], [data-add-assistance-option], [data-delete-assistance-option], [data-add-task-item], [data-delete-task-item], [data-mastery-mode], [data-stepper-target], [data-create-short], [data-create-short-and-new], [data-cancel-short], [data-add-structured-aspect], [data-structured-aspect-cancel], [data-structured-aspect-create], [data-structured-aspect-create-more], [data-structured-done]");
    if (!actionBtn) return;

    if (actionBtn.hasAttribute("data-create-mode")) {
      if (!(state.createTitle || "").trim()) return;
      state.createMode = actionBtn.getAttribute("data-create-mode") || "";
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-create-cancel")) {
      closeCreateCurriculumInline();
      return;
    }

    if (actionBtn.hasAttribute("data-create-submit")) {
      if (!(state.createTitle || "").trim()) return;
      const title = (state.createTitle || "").trim() || "منهج جديد";
      if (!state.createMode) {
        renderCreateFlow();
        return;
      }
      state.createTitle = title;
      if (state.createMode === "structured") {
        state.createStep = "structured-aspects";
        renderCreateFlow();
      } else {
        openSimpleModeNoticeModal(() => {
          state.createStep = "simple-goals";
          renderCreateFlow();
        });
      }
      return;
    }

    if (actionBtn.hasAttribute("data-simple-done")) {
      addCurriculum(state.createTitle || "منهج جديد", "simple");
      closeCreateCurriculumInline();
      return;
    }

    if (actionBtn.hasAttribute("data-structured-done")) {
      addCurriculum(state.createTitle || "منهج جديد", "structured");
      closeCreateCurriculumInline();
      return;
    }

    if (actionBtn.hasAttribute("data-add-structured-aspect")) {
      state.isAddingStructuredAspect = true;
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-structured-aspect-cancel")) {
      state.isAddingStructuredAspect = false;
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-structured-aspect-create") || actionBtn.hasAttribute("data-structured-aspect-create-more")) {
      const input = createBody.querySelector("[data-structured-aspect-input]");
      const val = input ? input.value.trim() : "";
      if (val) {
        state.structuredAspectsDraft.push({ name: val });
      }
      
      if (actionBtn.hasAttribute("data-structured-aspect-create")) {
        state.isAddingStructuredAspect = false;
      }
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-add-short-goal")) {
      state.createStep = "short-goal-form";
      resetShortGoalForm();
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-collection")) {
      const form = getShortGoalForm();
      const nextType = actionBtn.getAttribute("data-collection") || "assistances";
      if (!["assistances", "rate", "duration", "frequency", "descriptive", "task-analysis", "likert"].includes(nextType)) return;
      form.collectionType = nextType;
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-add-task-item")) {
      const form = getShortGoalForm();
      if (!Array.isArray(form.taskAnalysisItems) || !form.taskAnalysisItems.length) {
        form.taskAnalysisItems = [""];
      }
      form.taskAnalysisItems.push("");
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-delete-task-item")) {
      const form = getShortGoalForm();
      const idx = Number(actionBtn.getAttribute("data-delete-task-item"));
      if (!Array.isArray(form.taskAnalysisItems)) form.taskAnalysisItems = [""];
      if (!Number.isInteger(idx) || idx <= 0 || idx >= form.taskAnalysisItems.length) return;
      form.taskAnalysisItems.splice(idx, 1);
      if (!form.taskAnalysisItems.length) form.taskAnalysisItems = [""];
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-assist-type")) {
      const form = getShortGoalForm();
      const nextType = actionBtn.getAttribute("data-assist-type") || "fixed";
      form.assistanceType = nextType;
      if (nextType === "fixed") {
        form.assistanceOptions = getDefaultShortGoalForm().assistanceOptions.slice();
        form.selectedAssistanceOption = 0;
      } else if (nextType === "variable") {
        form.assistanceOptions = ["بمفرده", "خاطئة"];
        form.selectedAssistanceOption = 0;
      }
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-add-assistance-option")) {
      const form = getShortGoalForm();
      if (!Array.isArray(form.assistanceOptions)) form.assistanceOptions = [];
      form.assistanceOptions.push("");
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-delete-assistance-option")) {
      const form = getShortGoalForm();
      const idx = Number(actionBtn.getAttribute("data-delete-assistance-option"));
      if (!Number.isInteger(idx) || idx <= 1) return;
      if (!Array.isArray(form.assistanceOptions) || form.assistanceOptions.length <= 1) return;
      form.assistanceOptions.splice(idx, 1);
      if (form.selectedAssistanceOption >= form.assistanceOptions.length) {
        form.selectedAssistanceOption = form.assistanceOptions.length - 1;
      }
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-assistance-choice")) {
      if (event.target.tagName === "INPUT" || event.target.closest("[data-assistance-input]")) {
        return;
      }
      const form = getShortGoalForm();
      form.selectedAssistanceOption = Number(actionBtn.getAttribute("data-assistance-choice") || 0);
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-mastery-mode")) {
      const form = getShortGoalForm();
      form.masteryMode = actionBtn.getAttribute("data-mastery-mode") === "manual" ? "manual" : "auto";
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-stepper-target")) {
      const form = getShortGoalForm();
      const targetField = actionBtn.getAttribute("data-stepper-target");
      const direction = actionBtn.getAttribute("data-stepper-dir") === "down" ? -1 : 1;
      const minValue = Number(actionBtn.getAttribute("data-stepper-min"));
      const boundedMin = Number.isFinite(minValue) ? minValue : 1;
      if (!targetField) return;
      const nextValue = Math.max(boundedMin, (Number(form[targetField]) || boundedMin) + direction);
      form[targetField] = nextValue;
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-cancel-short")) {
      if (state.editingShortGoalId || state.addingShortGoalToTreeLongGoalId) {
        state.editingShortGoalId = null;
        state.addingShortGoalToTreeLongGoalId = null;
        closeShortGoalOverlay();
        renderTree();
      } else {
        state.createStep = "simple-goals";
        renderCreateFlow();
      }
      return;
    }

    if (actionBtn.hasAttribute("data-create-short")) {
      const isEditing = !!state.editingShortGoalId;
      const isAddingToTree = !!state.addingShortGoalToTreeLongGoalId;
      if (!saveShortGoal()) return;
      showToast(isEditing ? "تم حفظ التعديلات بنجاح" : "تم إنشاء الهدف القصير بنجاح");
      
      if (isEditing || isAddingToTree) {
        state.editingShortGoalId = null;
        state.addingShortGoalToTreeLongGoalId = null;
        closeShortGoalOverlay();
        renderTree();
      } else {
        state.createStep = "simple-goals";
        renderCreateFlow();
      }
      return;
    }

    if (actionBtn.hasAttribute("data-create-short-and-new")) {
      const isAddingToTree = !!state.addingShortGoalToTreeLongGoalId;
      if (!saveShortGoal()) return;
      showToast("تم حفظ الهدف وفتح نموذج جديد");
      const keepLongGoalId = state.addingShortGoalToTreeLongGoalId;
      resetShortGoalForm();
      if (isAddingToTree) {
        state.addingShortGoalToTreeLongGoalId = keepLongGoalId;
        renderTree();
        renderShortGoalForm();
      } else {
        renderCreateFlow();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!target.closest("[data-short-goal-modal]")) return;

    const actionBtn = target.closest("[data-collection], [data-assist-type], [data-assistance-choice], [data-add-assistance-option], [data-delete-assistance-option], [data-add-task-item], [data-delete-task-item], [data-mastery-mode], [data-stepper-target], [data-create-short], [data-create-short-and-new], [data-cancel-short]");
    if (!actionBtn) return;

    if (actionBtn.hasAttribute("data-collection")) {
      const form = getShortGoalForm();
      const nextType = actionBtn.getAttribute("data-collection") || "assistances";
      if (!["assistances", "rate", "duration", "frequency", "descriptive", "task-analysis", "likert"].includes(nextType)) return;
      form.collectionType = nextType;
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-add-task-item")) {
      const form = getShortGoalForm();
      if (!Array.isArray(form.taskAnalysisItems) || !form.taskAnalysisItems.length) {
        form.taskAnalysisItems = [""];
      }
      form.taskAnalysisItems.push("");
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-delete-task-item")) {
      const form = getShortGoalForm();
      const idx = Number(actionBtn.getAttribute("data-delete-task-item"));
      if (!Array.isArray(form.taskAnalysisItems)) form.taskAnalysisItems = [""];
      if (!Number.isInteger(idx) || idx <= 0 || idx >= form.taskAnalysisItems.length) return;
      form.taskAnalysisItems.splice(idx, 1);
      if (!form.taskAnalysisItems.length) form.taskAnalysisItems = [""];
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-assist-type")) {
      const form = getShortGoalForm();
      const nextType = actionBtn.getAttribute("data-assist-type") || "fixed";
      form.assistanceType = nextType;
      if (nextType === "fixed") {
        form.assistanceOptions = getDefaultShortGoalForm().assistanceOptions.slice();
        form.selectedAssistanceOption = 0;
      } else if (nextType === "variable") {
        form.assistanceOptions = ["بمفرده", "خاطئة"];
        form.selectedAssistanceOption = 0;
      }
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-add-assistance-option")) {
      const form = getShortGoalForm();
      if (!Array.isArray(form.assistanceOptions)) form.assistanceOptions = [];
      form.assistanceOptions.push("");
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-delete-assistance-option")) {
      const form = getShortGoalForm();
      const idx = Number(actionBtn.getAttribute("data-delete-assistance-option"));
      if (!Number.isInteger(idx) || idx <= 1) return;
      if (!Array.isArray(form.assistanceOptions) || form.assistanceOptions.length <= 1) return;
      form.assistanceOptions.splice(idx, 1);
      if (form.selectedAssistanceOption >= form.assistanceOptions.length) {
        form.selectedAssistanceOption = form.assistanceOptions.length - 1;
      }
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-assistance-choice")) {
      if (event.target.tagName === "INPUT" || event.target.closest("[data-assistance-input]")) {
        return;
      }
      const form = getShortGoalForm();
      form.selectedAssistanceOption = Number(actionBtn.getAttribute("data-assistance-choice") || 0);
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-mastery-mode")) {
      const form = getShortGoalForm();
      form.masteryMode = actionBtn.getAttribute("data-mastery-mode") === "manual" ? "manual" : "auto";
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-stepper-target")) {
      const form = getShortGoalForm();
      const targetField = actionBtn.getAttribute("data-stepper-target");
      const direction = actionBtn.getAttribute("data-stepper-dir") === "down" ? -1 : 1;
      const minValue = Number(actionBtn.getAttribute("data-stepper-min"));
      const boundedMin = Number.isFinite(minValue) ? minValue : 1;
      if (!targetField) return;
      const nextValue = Math.max(boundedMin, (Number(form[targetField]) || boundedMin) + direction);
      form[targetField] = nextValue;
      refreshShortGoalFormUi();
      return;
    }

    if (actionBtn.hasAttribute("data-cancel-short")) {
      if (state.editingShortGoalId || state.addingShortGoalToTreeLongGoalId) {
        state.editingShortGoalId = null;
        state.addingShortGoalToTreeLongGoalId = null;
        closeShortGoalOverlay();
        renderTree();
        return;
      }
      state.createStep = "simple-goals";
      renderCreateFlow();
      return;
    }

    if (actionBtn.hasAttribute("data-create-short")) {
      const isEditing = !!state.editingShortGoalId;
      const isAddingToTree = !!state.addingShortGoalToTreeLongGoalId;
      if (!saveShortGoal()) return;
      showToast(isEditing ? "تم حفظ التعديلات بنجاح" : "تم إنشاء الهدف القصير بنجاح");

      if (isEditing || isAddingToTree) {
        state.editingShortGoalId = null;
        state.addingShortGoalToTreeLongGoalId = null;
        closeShortGoalOverlay();
        renderTree();
      } else {
        state.createStep = "simple-goals";
        renderCreateFlow();
      }
      return;
    }

    if (actionBtn.hasAttribute("data-create-short-and-new")) {
      const isAddingToTree = !!state.addingShortGoalToTreeLongGoalId;
      if (!saveShortGoal()) return;
      showToast("تم حفظ الهدف وفتح نموذج جديد");
      const keepTreeContext = isAddingToTree;
      const keepLongGoalId = state.addingShortGoalToTreeLongGoalId;
      resetShortGoalForm();
      if (keepTreeContext) {
        state.addingShortGoalToTreeLongGoalId = keepLongGoalId;
        renderTree();
        renderShortGoalForm();
      } else {
        renderCreateFlow();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  window.addEventListener("resize", scheduleTreeLines, { passive: true });
  window.addEventListener("orientationchange", scheduleTreeLines, { passive: true });
  window.addEventListener("scroll", scheduleTreeLinePosition, { passive: true });
  document.addEventListener("scroll", scheduleTreeLinePosition, { passive: true, capture: true });

  renderTree();
})();
