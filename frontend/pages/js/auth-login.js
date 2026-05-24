(function () {
  const LOGIN_JSON_URL = 'data/login-accounts.json';

  const form = document.querySelector('.register-form');
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const submitBtn = form.querySelector('.btn-create');

  let loginAccounts = [];

  function showError(message) {
    // Inject styles if they don't exist
    if (!document.getElementById('custom-alert-styles')) {
      const style = document.createElement('style');
      style.id = 'custom-alert-styles';
      style.innerHTML = `
        .custom-alert-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.4);
            display: flex; align-items: center; justify-content: center;
            z-index: 9999; backdrop-filter: blur(3px);
            animation: alertFadeIn 0.2s ease;
        }
        .custom-alert-modal {
            background: #fff; padding: 30px; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            text-align: center; max-width: 400px; width: 90%;
            animation: alertSlideUp 0.3s ease;
        }
        .custom-alert-icon { font-size: 50px; color: #e74c3c; margin-bottom: 15px; }
        .custom-alert-title {
            font-family: 'Cairo', sans-serif; font-size: 22px;
            font-weight: 700; color: #333; margin-bottom: 10px;
        }
        .custom-alert-message {
            font-family: 'Cairo', sans-serif; font-size: 15px;
            color: #666; line-height: 1.6; margin-bottom: 25px;
            direction: rtl; text-align: right;
            background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee;
        }
        .custom-alert-btn {
            background: #15b389; color: #fff; border: none;
            padding: 12px 30px; border-radius: 8px;
            font-family: 'Cairo', sans-serif; font-size: 16px; font-weight: 700;
            cursor: pointer; transition: background 0.2s; width: 100%;
        }
        .custom-alert-btn:hover { background: #129c77; }
        @keyframes alertFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes alertSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `;
      document.head.appendChild(style);
    }

    // Create modal elements
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    const formattedMessage = message.replace(/\n/g, '<br>');
    
    overlay.innerHTML = `
      <div class="custom-alert-modal">
        <div class="custom-alert-icon"><i class="fa-solid fa-circle-exclamation"></i></div>
        <div class="custom-alert-title">تنبيه</div>
        <div class="custom-alert-message">${formattedMessage}</div>
        <button class="custom-alert-btn">حسناً، فهمت</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close modal on click
    const btn = overlay.querySelector('.custom-alert-btn');
    btn.addEventListener('click', () => {
      overlay.remove();
    });
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
