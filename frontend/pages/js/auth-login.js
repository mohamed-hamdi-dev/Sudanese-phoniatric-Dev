(function () {
  const LOGIN_JSON_URL = 'data/login-accounts.json';

  const form = document.querySelector('.register-form');
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const submitBtn = form.querySelector('.btn-create');

  let loginAccounts = [];

  function showError(message) {
    window.alert(message);
  }

  function formatDemoHint(accounts) {
    return accounts
      .map((item) => `- ${item.email} / ${item.password}`)
      .join('\n');
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
      showError(`بيانات الدخول غير صحيحة.\n\nتجربة:\n${formatDemoHint(loginAccounts)}`);
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
