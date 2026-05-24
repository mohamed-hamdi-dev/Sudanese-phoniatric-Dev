const fs = require('fs');
const path = require('path');
const dir = 'frontend/pages/js';
const dataDir = 'frontend/pages/data';

function inlineFetch(jsFile, jsonFile, functionTarget) {
  const jsPath = path.join(dir, jsFile);
  const jsonPath = path.join(dataDir, jsonFile);
  if (!fs.existsSync(jsPath) || !fs.existsSync(jsonPath)) return;
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  let newContent = jsContent;
  
  if (functionTarget === 'initNavigation') {
      const oldInitNav = `  async function initNavigation() {
    if (!document.querySelector('.app-shell')) return;

    const response = await fetch(NAV_JSON_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }

    const config = await response.json();
    applyNavigation(config);
  }`;
      const newInitNav = `  async function initNavigation() {
    if (!document.querySelector('.app-shell')) return;
    const config = ${jsonContent.trim()};
    applyNavigation(config);
  }`;
      newContent = newContent.replace(oldInitNav, newInitNav);
  } else if (functionTarget === 'loadPermissionsConfig') {
      const oldLoadPerms = `  async function loadPermissionsConfig() {
    const response = await fetch(PERMISSIONS_JSON_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    return response.json();
  }`;
      const newLoadPerms = `  async function loadPermissionsConfig() {
    return ${jsonContent.trim()};
  }`;
      newContent = newContent.replace(oldLoadPerms, newLoadPerms);
  } else if (functionTarget === 'loadLoginAccounts') {
      const oldLoadLogin = `  async function loadLoginAccounts() {
    const response = await fetch(LOGIN_JSON_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    const data = await response.json();
    loginAccounts = Array.isArray(data.accounts) ? data.accounts : [];
  }`;
      const newLoadLogin = `  async function loadLoginAccounts() {
    const data = ${jsonContent.trim()};
    loginAccounts = Array.isArray(data.accounts) ? data.accounts : [];
  }`;
      newContent = newContent.replace(oldLoadLogin, newLoadLogin);
  }

  fs.writeFileSync(jsPath, newContent, 'utf8');
}

inlineFetch('app-navigation.js', 'navigation.json', 'initNavigation');
inlineFetch('permissions.js', 'permissions.json', 'loadPermissionsConfig');
inlineFetch('auth-login.js', 'login-accounts.json', 'loadLoginAccounts');
console.log('Done');
