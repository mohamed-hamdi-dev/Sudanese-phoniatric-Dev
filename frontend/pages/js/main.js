document.addEventListener('DOMContentLoaded', () => {
    const cardsGrid = document.querySelector('[data-account-types-grid]');
    const btnNext = document.getElementById('btn-next');
    let selectedAccount = null;

    function bindAccountCards(cards) {
        cards.forEach((card) => {
            if (card.classList.contains('is-locked')) {
                card.addEventListener('click', () => {
                    const message = card.getAttribute('data-lock-message') || 'هذا الخيار غير متاح حالياً';
                    window.alert(message);
                });
                return;
            }

            card.addEventListener('click', () => {
                cards.forEach((item) => item.classList.remove('selected'));
                card.classList.add('selected');
                selectedAccount = card.getAttribute('data-type');
                btnNext?.removeAttribute('disabled');
            });
        });
    }

    function renderAccountCards(types) {
        if (!cardsGrid) return;

        cardsGrid.innerHTML = types.map((type) => `
            <div
                class="account-card${type.enabled === false ? ' is-locked' : ''}"
                data-type="${type.id}"
                data-register-href="${type.registerHref || ''}"
                ${type.enabled === false ? `data-lock-message="${type.lockMessage || 'متاح قريباً'}"` : ''}
                ${type.iconColor ? `style="--account-card-icon:${type.iconColor}"` : ''}
            >
                ${type.enabled === false ? '<span class="account-card__lock-badge" aria-hidden="true"><i class="fa-solid fa-lock"></i></span>' : ''}
                <div class="card-icon"><i class="${type.iconClass}"></i></div>
                <div class="card-text">${type.label}</div>
            </div>
        `).join('');

        bindAccountCards(Array.from(cardsGrid.querySelectorAll('.account-card')));
    }

    async function loadAccountTypes() {
        try {
            const response = await fetch('data/account-types.json', { cache: 'no-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data.accountTypes) && data.accountTypes.length) {
                renderAccountCards(data.accountTypes);
                return;
            }
        } catch (error) {
            console.warn('[main] تعذر تحميل account-types.json', error);
        }

        const fallbackCards = document.querySelectorAll('.account-card');
        bindAccountCards(fallbackCards);
        fallbackCards.forEach((card) => {
            if (card.getAttribute('data-type') === 'school' || card.getAttribute('data-type') === 'family') {
                card.classList.add('is-locked');
                card.setAttribute('data-lock-message', 'متاح قريباً');
            }
        });
    }

    loadAccountTypes();

    btnNext?.addEventListener('click', () => {
        if (!selectedAccount) return;

        const selectedCard = cardsGrid?.querySelector(`.account-card[data-type="${selectedAccount}"]`)
            || document.querySelector(`.account-card[data-type="${selectedAccount}"]`);

        if (selectedCard?.classList.contains('is-locked')) {
            window.alert(selectedCard.getAttribute('data-lock-message') || 'هذا الخيار غير متاح حالياً');
            return;
        }

        const href = selectedCard?.getAttribute('data-register-href');
        if (href) {
            window.location.href = href;
            return;
        }

        if (selectedAccount === 'teacher') {
            window.location.href = 'register-teacher.html';
        }
    });

    const passwordToggles = document.querySelectorAll('.password-box .eye-icon');
    passwordToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const box = toggle.closest('.password-box');
            const passwordInput = box ? box.querySelector('input[type="password"], input[type="text"]') : null;
            if (!passwordInput) return;

            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            toggle.classList.toggle('fa-eye', !isHidden);
            toggle.classList.toggle('fa-eye-slash', isHidden);
        });
    });
});

(function() {
    const host = document.querySelector('.form-header');
    if (!host || host.querySelector('.lang-pill-toggle')) return;

    const STORAGE_KEY = 'dashboard-language';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-pill-toggle';
    button.setAttribute('aria-label', 'Toggle language');

    function getLanguage() {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            return saved === 'en' ? 'en' : 'ar';
        } catch (error) {
            return 'ar';
        }
    }

    function setLanguage(language) {
        const nextLanguage = language === 'en' ? 'en' : 'ar';
        document.documentElement.lang = nextLanguage;
        document.documentElement.dir = 'rtl';
        button.textContent = nextLanguage === 'en' ? 'EN | AR' : 'AR | EN';

        try {
            window.localStorage.setItem(STORAGE_KEY, nextLanguage);
        } catch (error) {
            // Ignore storage failures.
        }
    }

    button.addEventListener('click', () => {
        const nextLanguage = document.documentElement.lang === 'en' ? 'ar' : 'en';
        setLanguage(nextLanguage);
    });

    host.appendChild(button);
    setLanguage(getLanguage());
})();
