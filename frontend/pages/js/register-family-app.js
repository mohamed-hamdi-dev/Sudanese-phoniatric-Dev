(function () {
  const CONFIG_URL = 'data/family-app.json';

  const defaults = {
    qrUrl: 'https://ynmo.app/download',
    qrImage: '',
    title: 'قم بفحص الكود بكاميرا الجوال الخاص بك لتحميل تطبيق ينمو',
    description:
      'اذا كنت ولي أمر مستفيد من ذوي الإعاقة، يمكنك الاستفادة من خدماتنا من خلال مدرسة/مركز مستفيدك، أو أطلب من المدرسة/المركز التسجيل من خلال موقعنا اذا لم يكن مشتركين',
    homeHref: 'index.html'
  };

  function buildQrSrc(url) {
    const encoded = encodeURIComponent(url || defaults.qrUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encoded}&color=15b389&bgcolor=ffffff`;
  }

  function applyConfig(config) {
    const panel = document.querySelector('[data-family-qr-panel]');
    if (!panel) return;

    const qrImage = panel.querySelector('[data-family-qr-image]');
    const title = panel.querySelector('[data-family-qr-title]');
    const desc = panel.querySelector('[data-family-qr-desc]');
    const homeBtn = document.querySelector('.family-app-home-btn');

    const qrTarget = config.qrUrl || defaults.qrUrl;
    if (qrImage) {
      qrImage.src = config.qrImage || buildQrSrc(qrTarget);
      qrImage.alt = 'رمز QR لتحميل تطبيق ينمو';
    }
    if (title) title.textContent = config.title || defaults.title;
    if (desc) desc.textContent = config.description || defaults.description;
    if (homeBtn && config.homeHref) homeBtn.setAttribute('href', config.homeHref);
  }

  fetch(CONFIG_URL, { cache: 'no-cache' })
    .then((response) => (response.ok ? response.json() : defaults))
    .then(applyConfig)
    .catch(() => applyConfig(defaults));
})();
