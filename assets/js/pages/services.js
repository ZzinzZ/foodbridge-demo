/* Danh bạ dịch vụ: Logistics / Tư vấn / Bảo hiểm */
(() => {
  const { t, L, esc, img } = App;
  const TABS = ['logistics', 'consulting', 'insurance'];
  const state = {
    tab: TABS.includes(App.param('tab')) ? App.param('tab') : 'logistics',
    country: App.param('country') || '',
    q: App.param('q') || ''
  };
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const textOf = o => typeof o === 'string' ? o : Object.values(o || {}).flat().join(' ');

  function providers() {
    const q = norm(state.q);
    return COMPANIES.filter(c => c.role === state.tab
      && (!state.country || c.country === state.country)
      && (!q || norm(c.name + ' ' + textOf(c.desc) + ' ' + textOf(c.tags) + ' ' + c.services.map(s => textOf(s.name)).join(' ')).includes(q)));
  }

  function syncUrl() {
    const p = new URLSearchParams({ tab: state.tab });
    if (state.country) p.set('country', state.country);
    if (state.q) p.set('q', state.q);
    history.replaceState(null, '', 'services.html?' + p);
  }

  let pending = 0;   // chỉ lần render mới nhất được đổ kết quả vào sau skeleton

  function render() {
    const list = providers();
    const k = state.tab;
    document.getElementById('page').innerHTML = `
      <section class="page-head">
        <div class="container">
          ${App.crumbs([['index.html', t('c.home')], [null, t('nav.' + k)]])}
          <h1>${t('svc.title')}</h1>
          <p>${t('svc.desc')}</p>
          <div class="text-tabs">
            ${TABS.map(x => `<button class="text-tab ${x === k ? 'active' : ''}" data-tab="${x}">${esc(L(ROLES[x].name))}</button>`).join('')}
          </div>
        </div>
      </section>
      <div class="container">
        <div class="card svc-intro">
          <div>
            <span class="eyebrow">${esc(L(ROLES[k].name))}<span class="sep">·</span>${t('svc.' + k + '.sub')}</span>
            <h2>${t('svc.' + k + '.title')}</h2>
            <p class="muted">${t('svc.' + k + '.desc')}</p>
            <ul>${[1, 2, 3, 4].map(i => `<li>${t(`svc.${k}.b${i}`)}</li>`).join('')}</ul>
          </div>
          <img src="${img(SERVICE_INTRO[k].img, 1000)}" alt="" loading="lazy">
        </div>

        <div class="svc-filter">
          <span class="muted">${t('svc.country')}</span>
          <div class="text-tabs" style="border:0">
            <button class="text-tab ${!state.country ? 'active' : ''}" data-country="">${t('c.all')}</button>
            ${Object.keys(COUNTRIES).map(cc => `<button class="text-tab ${state.country === cc ? 'active' : ''}" data-country="${cc}">${App.flag(cc)} ${esc(L(COUNTRIES[cc].name))}</button>`).join('')}
          </div>
          ${state.q ? `<div class="active-filters" style="margin:0"><button data-clear-q>“${esc(state.q)}”</button></div>` : ''}
          <span class="strong" style="margin-left:auto">${t('svc.count', { n: list.length })}</span>
        </div>

        <div id="results" aria-live="polite">${list.length ? `<div class="prov-grid">${Motion.skeletonCards(list.length, 'provider')}</div>` : ''}</div>
      </div>`;

    const token = ++pending;
    setTimeout(() => {
      const box = document.getElementById('results');
      if (token !== pending || !box) return;
      box.innerHTML = list.length
        ? `<div class="prov-grid">${list.map(App.providerCard).join('')}</div>`
        : `<div class="card empty">${t('list.empty')}</div>`;
    }, Motion.reduce ? 0 : 320);

    const page = document.getElementById('page');
    page.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', () => {
      if (state.tab === el.dataset.tab) return;
      state.tab = el.dataset.tab; syncUrl(); location.reload();
    }));
    page.querySelectorAll('[data-country]').forEach(el => el.addEventListener('click', () => { state.country = el.dataset.country; syncUrl(); render(); }));
    page.querySelector('[data-clear-q]')?.addEventListener('click', () => { state.q = ''; syncUrl(); location.reload(); });
  }

  App.init({ nav: state.tab, render });
})();
