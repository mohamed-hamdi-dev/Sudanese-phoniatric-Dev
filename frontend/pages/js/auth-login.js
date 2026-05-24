(function () {
  const LOGIN_JSON_URL = 'data/login-accounts.json';

  const form = document.querySelector('.register-form');
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const submitBtn = form.querySelector('.btn-create');

  let loginAccounts = [];

  function showError(message) {
    if (!document.getElementById('custom-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-toast-styles';
      style.innerHTML = `
        .custom-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffebee;
            color: #c62828;
            padding: 12px 25px;
            border-radius: 6px;
            border-right: 4px solid #c62828;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-family: 'Cairo', sans-serif;
            font-size: 15px;
            font-weight: 600;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: toastSlideDown 0.3s ease, toastFadeOut 0.3s ease 2.7s forwards;
            direction: rtl;
        }
        @keyframes toastSlideDown { from { top: -50px; opacity: 0; } to { top: 20px; opacity: 1; } }
        @keyframes toastFadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }
      `;
      document.head.appendChild(style);
    }

    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${message}</span>`;
    
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  function handleLogin(event) {
    event.preventDefault();

    if (!window.SPPermissions) {
      showError('جاري تحميل الصلاحيات، حاول مرة أخرى بعد لحظة.');
      return;
    }

    const email = String(emailInput?.value || '').trim().toLowerCase();
    const password = String(passwordInput?.value || '').trim();

    if (!email || !password) {
      showError('رجاء إدخال البريد وكلمة المرور.');
      return;
    }

    const account = loginAccounts.find(
      (item) => item.email === email && item.password === password
    );

    if (!account) {
      showError('بيانات الدخول غير صحيحة.');
      return;
    }

    const user = {
      ...account.user,
      email,
      permissions: window.SPPermissions.getRolePreset(account.user.role)
    };

    window.SPPermissions.setCurrentUser(user);
    window.location.href = 'dashboard.html';
  }

  async function loadLoginAccounts() {
    const data = {
  "accounts": [
    {
      "email": "owner@phoniatric.com",
      "password": "owner123",
      "user": {
        "id": "owner-1",
        "role": "owner",
        "name": "sudanesephoniatric"
      }
    },
    {
      "email": "admin@phoniatric.com",
      "password": "admin123",
      "user": {
        "id": "admin-1",
        "role": "admin",
        "name": "مسؤول المركز"
      }
    },
    {
      "email": "doctor@phoniatric.com",
      "password": "doctor123",
      "user": {
        "id": "doctor-1",
        "role": "doctor",
        "name": "د. أحمد صالح"
      }
    }
  ]
};
    loginAccounts = Array.isArray(data.accounts) ? data.accounts : [];
  }

  function bindLoginForm() {
    submitBtn?.addEventListener('click', handleLogin);
    form.addEventListener('submit', handleLogin);
  }

  Promise.all([
    loadLoginAccounts(),
    window.SPPermissionsReady
  ])
    .then(bindLoginForm)
    .catch((error) => {
      console.error('[auth-login] failed to load login-accounts.json', error);
    });
})();
