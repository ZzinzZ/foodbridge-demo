/* Hồ sơ doanh nghiệp — dùng chung cho nhà XNK, logistics, tư vấn, bảo hiểm */
(() => {
  const { t, L, esc, img, flag } = App;
  const c = App.company(App.param('id')) || COMPANIES[0];
  const isExporter = c.role === 'exporter';
  let tab = 'overview';

  function stats() {
    const last = isExporter
      ? [t('co.stat.markets'), (c.markets || []).map(m => flag(m)).join(' ')]
      : [t('co.stat.routes'), c.routes ? c.routes.length : (c.tags[App.lang] || c.tags.vi).length];
    return [[t('co.stat.year'), c.year], [t('co.stat.staff'), c.staff], [t('co.stat.response'), c.response], last]
      .map(([k, v]) => `<div><strong>${v}</strong><span>${k}</span></div>`).join('');
  }

  function servicesHtml() {
    return `<div class="svc-list">${c.services.map(s => `
      <div class="svc-item">
        <div style="flex:1"><h4 style="margin:0 0 2px">${esc(L(s.name))}</h4><p>${esc(L(s.desc))}</p></div>
        <button class="btn btn-outline btn-sm" data-quote-svc="${c.id}">${t('svc.quote')}</button>
      </div>`).join('')}</div>`;
  }

  function certsHtml() {
    return `<div class="cert-grid">${c.certs.map(x => `<div class="cert-card"><strong>${esc(x)}</strong><span>${t('co.certNote')}</span></div>`).join('')}</div>`;
  }

  function productsHtml(limit) {
    const prods = App.productsOf(c.id);
    if (!prods.length) return `<p class="muted">${t('co.noProducts')}</p>`;
    return `<div class="product-grid">${prods.slice(0, limit || prods.length).map(App.productCard).join('')}</div>`;
  }

  function tabContent() {
    if (tab === 'products') return productsHtml();
    if (tab === 'services') return servicesHtml();
    if (tab === 'certs') return certsHtml();
    const cats = [...new Set(App.productsOf(c.id).map(p => App.catName(p.cat)))];
    const tags = isExporter ? cats : (c.tags[App.lang] || c.tags.vi);
    return `
      <h3>${t('co.about')}</h3>
      <p>${esc(L(c.desc))}</p>
      ${tags.length ? `<p class="muted" style="margin-bottom:28px">${App.joinText(tags)}</p>` : ''}
      <h3>${t(isExporter ? 'co.tab.products' : 'co.tab.services')}</h3>
      ${isExporter ? productsHtml(3) : servicesHtml()}`;
  }

  function render() {
    const tabs = ['overview', isExporter ? 'products' : 'services', 'certs'];
    document.title = `${c.name} — FoodBridge`;
    document.getElementById('page').innerHTML = `
      <div class="co-cover"><img src="${img(c.cover, 1920)}" alt=""></div>
      <div class="container">
        <div class="card co-card">
          <div class="co-head">
            ${App.logoBox(c)}
            <div class="info">
              <h1>${esc(c.name)}${App.verifiedIcon(c)}</h1>
              <div class="co-meta">${esc(L(ROLES[c.role].name))}<span class="sep">·</span>${flag(c.country)} ${esc(L(c.city))}, ${esc(L(COUNTRIES[c.country].name))}<span class="sep">·</span>${t('c.since', { n: c.year })}<span class="sep">·</span>${App.verifiedText(c)}</div>
            </div>
            <div class="co-actions">
              <button class="btn btn-primary" data-quote-svc="${c.id}">${t(isExporter ? 'c.sendInquiry' : 'svc.quote')}</button>
              <button class="btn btn-outline" data-soon>${t('pd.chat')}</button>
            </div>
          </div>
          <div class="co-stats">${stats()}</div>
          <div class="tabs" style="border-top:1px solid var(--border);border-bottom:0">
            ${tabs.map(k => `<button class="tab ${tab === k ? 'active' : ''}" data-tab="${k}">${t('co.tab.' + k)}</button>`).join('')}
          </div>
        </div>

        <div class="co-layout">
          <div class="card card-pad" style="min-width:0">${tabContent()}</div>
          <aside style="display:grid;gap:20px">
            ${c.verified
              ? `<div class="card side-box verify-box" style="margin:0">
                   <h4>${t('co.verify.title')}</h4>
                   <ul class="verify-list">${[1, 2, 3, 4].map(i => `<li>${t('co.verify.v' + i)}</li>`).join('')}</ul>
                   <p class="muted" style="margin:10px 0 0">${t('co.verify.date')}</p>
                 </div>`
              : `<div class="note-bar warn" style="margin:0"><strong>${t('co.unverified.title')}.</strong> ${t('co.unverified.desc')}</div>`}
            <div class="card side-box" style="margin:0">
              <h4>${t('co.info')}</h4>
              <div class="kv"><span>${t('co.type')}</span><span>${esc(L(ROLES[c.role].name))}</span></div>
              <div class="kv"><span>${t('co.country')}</span><span>${esc(L(COUNTRIES[c.country].name))}</span></div>
              <div class="kv"><span>${t('co.location')}</span><span>${esc(L(c.city))}</span></div>
              <div class="kv"><span>${t('co.stat.year')}</span><span>${c.year}</span></div>
              <div class="kv"><span>${t('co.stat.staff')}</span><span>${c.staff}</span></div>
              ${c.revenue ? `<div class="kv"><span>${t('co.revenue')}</span><span>${c.revenue}</span></div>` : ''}
              ${c.routes ? `<div class="kv"><span>${t('co.stat.routes')}</span><span>${c.routes.join(', ')}</span></div>` : ''}
            </div>
            <div class="card side-box" style="margin:0">
              <h4>${t('co.contactTitle')}</h4>
              <div class="kv"><span>${t('co.contactPerson')}</span><span class="muted">${t('co.hidden')}</span></div>
              <div class="kv"><span>${t('co.phone')}</span><span class="muted">${t('co.hidden')}</span></div>
              <div class="kv"><span>Email</span><span class="muted">${t('co.hidden')}</span></div>
              <a class="btn btn-teal btn-block" style="margin-top:16px" href="dashboard.html">${t('top.login')}</a>
            </div>
          </aside>
        </div>
      </div>`;

    document.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', () => { tab = el.dataset.tab; render(); }));
  }

  App.init({ nav: isExporter ? 'suppliers' : c.role, render });
})();
