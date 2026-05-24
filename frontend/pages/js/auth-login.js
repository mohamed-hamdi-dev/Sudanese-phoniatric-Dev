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
    const response = await fetch(LOGIN_JSON_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
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
