/* Lõi dùng chung cho mọi trang: ngôn ngữ, header/footer, thẻ sản phẩm, modal, toast. */

const App = (() => {
  const LANGS = ['vi', 'en', 'zh'];
  const LANG_LABEL = { vi: 'VI', en: 'EN', zh: '中文' };
  const HTML_LANG = { vi: 'vi', en: 'en', zh: 'zh-CN' };
  const listeners = [];
  let lang = 'vi';
  let pageRender = null;
  let activeNav = '';

  /* ---------- Ngôn ngữ ---------- */
  function readLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl && LANGS.includes(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem('fb_lang');
      if (saved && LANGS.includes(saved)) return saved;
    } catch (e) { /* bỏ qua */ }
    return 'vi';
  }

  function t(key, vars) {
    let s = (I18N[lang] && I18N[lang][key]) ?? I18N.vi[key] ?? key;
    if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  function L(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.vi || '';
  }

  function setLang(l, silent) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    try { localStorage.setItem('fb_lang', l); } catch (e) { /* bỏ qua */ }
    renderAll();
    listeners.forEach(fn => fn(l));
    if (!silent) toast(t('toast.lang'));
  }

  function applyI18n(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  }

  /* ---------- Tiện ích ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const img = (id, w = 800) => id && id.startsWith('data:') ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
  const flag = (cc, cls = 'flag') => `<img class="${cls}" src="https://flagcdn.com/w40/${COUNTRIES[cc].code}.png" alt="${esc(L(COUNTRIES[cc].name))}" loading="lazy">`;
  const param = k => new URLSearchParams(location.search).get(k);
  const company = id => COMPANIES.find(c => c.id === id);
  const product = id => PRODUCTS.find(p => p.id === id);
  const allCats = () => CATEGORIES.flatMap(c => c.children.map(ch => ({ ...ch, parent: c.id })));
  const cat = id => allCats().find(c => c.id === id);
  const catName = id => { const c = cat(id); return c ? L(c.name) : ''; };
  const ago = h => h < 24 ? t('c.hoursAgo', { n: h }) : t('c.daysAgo', { n: Math.round(h / 24) });
  const productsOf = cid => PRODUCTS.filter(p => p.company === cid);
  const joinText = list => list.map(esc).join('<span class="sep">·</span>');
  const crumbs = (items, dark) => `<div class="breadcrumb ${dark ? 'dark' : ''}">${items.map(([href, label]) =>
    href ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`).join('<span class="slash">/</span>')}</div>`;

  /* ---------- Thẻ dùng chung ---------- */
  /* Trạng thái xác minh hiển thị dạng chữ, không dùng badge */
  const verifiedText = c => c.verified
    ? `<span class="ok-text"><i class="bi bi-patch-check-fill"></i>${t('c.verified')}</span>`
    : `<span class="warn-text">${t('c.unverified')}</span>`;

  /* Tích xanh đặt ngay sau tên doanh nghiệp đã xác minh */
  const verifiedIcon = c => c.verified ? `<i class="bi bi-patch-check-fill v-tick" title="${esc(t('c.verified'))}"></i>` : '';

  const logoBox = (c, extra = '') => `<div class="logo-box ${extra}" style="background:${c.color}">${c.initials}</div>`;
  const logoMark = () => '<span class="logo-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>';

  function productCard(p) {
    const c = company(p.company);
    return `
      <a class="p-card" href="product.html?id=${p.id}">
        <div class="img"><img src="${img(p.imgs[0], 600)}" alt="${esc(L(p.name))}" loading="lazy"></div>
        <div class="body">
          <span class="name clamp-2">${esc(L(p.name))}</span>
          <span class="price">USD ${p.price} <span>${t('pd.per', { unit: esc(L(p.unit)) })}</span></span>
          <span class="meta">${t('c.moq')}: ${esc(L(p.moq))}</span>
          <span class="seller">${flag(c.country)}<span class="n">${esc(c.name)}</span>${verifiedIcon(c)}</span>
        </div>
      </a>`;
  }

  function supplierCard(c) {
    return `
      <a class="s-card" href="company.html?id=${c.id}">
        ${logoBox(c)}
        <div style="min-width:0;flex:1">
          <span class="name">${esc(c.name)}${verifiedIcon(c)}</span>
          <span class="sub">${flag(c.country)} ${esc(L(c.city))}</span>
          ${verifiedText(c)}
        </div>
      </a>`;
  }

  function providerCard(c) {
    return `
      <div class="prov-card">
        <div class="cover"><img src="${img(c.cover, 700)}" alt="" loading="lazy">${logoBox(c)}</div>
        <div class="body">
          <a class="name" href="company.html?id=${c.id}">${esc(c.name)}${verifiedIcon(c)}</a>
          <span class="muted" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${flag(c.country)} ${esc(L(c.city))}<span class="sep">·</span>${verifiedText(c)}</span>
          <p class="desc clamp-2">${esc(L(c.desc))}</p>
          <div>${joinText(c.tags[lang] || c.tags.vi)}</div>
          ${c.routes ? `<div class="muted">${t('svc.routes')}: ${c.routes.join(', ')}</div>` : ''}
          <div class="foot">
            <a class="btn btn-outline btn-sm" href="company.html?id=${c.id}">${t('c.viewProfile')}</a>
            <button class="btn btn-teal btn-sm" data-quote-svc="${c.id}">${t('svc.quote')}</button>
          </div>
        </div>
      </div>`;
  }

  /* ---------- Header / Footer ---------- */
  function navLink(href, key, id) {
    return `<a class="nav-link ${activeNav === id ? 'active' : ''}" href="${href}">${t(key)}</a>`;
  }

  function langSwitch() {
    return `<div class="lang-switch" role="group" aria-label="Language">${LANGS.map(l =>
      `<button type="button" data-lang="${l}" class="${l === lang ? 'active' : ''}">${LANG_LABEL[l]}</button>`).join('')}</div>`;
  }

  function megaMenu() {
    return CATEGORIES.map(c => `
      <div>
        <h5>${esc(L(c.name))}</h5>
        ${c.children.map(ch => `<a href="products.html?cat=${ch.id}">${esc(L(ch.name))}</a>`).join('')}
      </div>`).join('');
  }

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    const q = param('q') || '';
    const searchType = ['logistics', 'consulting', 'insurance'].includes(activeNav) ? 'services' : (param('view') === 'suppliers' ? 'suppliers' : 'products');
    el.innerHTML = `
      <div class="topbar">
        <div class="container">
          <div class="topbar-left"><span class="tagline">${t('top.tagline')}</span></div>
          <div class="topbar-right">
            ${langSwitch()}
            <a href="#" class="hide-sm" data-soon>${t('top.help')}</a>
            <a href="dashboard.html" class="hide-sm">${t('top.login')}</a>
          </div>
        </div>
      </div>
      <header class="header">
        <div class="container header-main">
          <button class="menu-toggle" type="button" aria-label="Menu" data-drawer>☰</button>
          <a class="logo" href="index.html">${logoMark()}<span>FoodBridge</span></a>
          <form class="search-bar" id="searchForm" role="search">
            <select name="type" aria-label="Search type">
              <option value="products" ${searchType === 'products' ? 'selected' : ''}>${t('search.products')}</option>
              <option value="suppliers" ${searchType === 'suppliers' ? 'selected' : ''}>${t('search.suppliers')}</option>
              <option value="services" ${searchType === 'services' ? 'selected' : ''}>${t('search.services')}</option>
            </select>
            <input name="q" type="search" value="${esc(q)}" placeholder="${t('search.placeholder')}" aria-label="${t('search.btn')}">
            <button type="submit"><i class="bi bi-search"></i><span class="lbl">${t('search.btn')}</span></button>
          </form>
          <div class="header-actions">
            <a href="#" class="hide-sm hide-md" data-soon>${t('hdr.messages')}</a>
            <a href="dashboard.html" class="hide-sm">${t('hdr.member')}</a>
            <a class="btn btn-teal hide-sm" href="register.html">${t('top.join')}</a>
          </div>
        </div>
        <nav class="navbar">
          <div class="container">
            <div class="nav-cat">
              <button class="nav-cat-btn" type="button">${t('nav.categories')}</button>
              <div class="mega">${megaMenu()}</div>
            </div>
            ${navLink('index.html', 'nav.home', 'home')}
            ${navLink('products.html', 'nav.products', 'products')}
            ${navLink('products.html?view=suppliers', 'nav.suppliers', 'suppliers')}
            ${navLink('services.html?tab=logistics', 'nav.logistics', 'logistics')}
            ${navLink('services.html?tab=consulting', 'nav.consulting', 'consulting')}
            ${navLink('services.html?tab=insurance', 'nav.insurance', 'insurance')}
            ${navLink('pricing.html', 'nav.pricing', 'pricing')}
            <span class="nav-spacer"></span>
            <a class="nav-cta" href="dashboard.html#add">${t('hdr.post')}</a>
          </div>
        </nav>
      </header>
      <div class="drawer-backdrop" data-drawer-close></div>
      <aside class="drawer" aria-label="Menu">
        <a class="logo" href="index.html">${logoMark()}<span>FoodBridge</span></a>
        ${langSwitch()}
        <a href="index.html">${t('nav.home')}</a>
        <a href="products.html">${t('nav.products')}</a>
        <a href="products.html?view=suppliers">${t('nav.suppliers')}</a>
        <a href="services.html?tab=logistics">${t('nav.logistics')}</a>
        <a href="services.html?tab=consulting">${t('nav.consulting')}</a>
        <a href="services.html?tab=insurance">${t('nav.insurance')}</a>
        <a href="pricing.html">${t('nav.pricing')}</a>
        <a href="register.html">${t('nav.register')}</a>
        <a href="dashboard.html">${t('nav.dashboard')}</a>
      </aside>`;

    el.querySelector('#searchForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const qv = encodeURIComponent((f.get('q') || '').trim());
      const type = f.get('type');
      if (type === 'services') location.href = `services.html?q=${qv}`;
      else location.href = `products.html?${type === 'suppliers' ? 'view=suppliers&' : ''}q=${qv}`;
    });
    el.querySelector('.nav-cat-btn').addEventListener('click', e => e.currentTarget.parentElement.classList.toggle('open'));
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    el.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a class="logo" href="index.html">${logoMark()}<span>FoodBridge</span></a>
              <p style="margin-top:16px">${t('footer.about')}</p>
              <div style="display:flex;gap:8px">${['VN', 'CN', 'AU'].map(c => flag(c)).join('')}</div>
            </div>
            <div>
              <h5>${t('footer.buyers')}</h5>
              <a href="products.html">${t('footer.findProducts')}</a>
              <a href="products.html?view=suppliers">${t('footer.findSuppliers')}</a>
              <a href="services.html">${t('footer.findServices')}</a>
            </div>
            <div>
              <h5>${t('footer.sellers')}</h5>
              <a href="register.html">${t('footer.register')}</a>
              <a href="dashboard.html#add">${t('footer.postProduct')}</a>
              <a href="dashboard.html#verify">${t('footer.verify')}</a>
              <a href="pricing.html">${t('nav.pricing')}</a>
            </div>
            <div>
              <h5>${t('footer.support')}</h5>
              <a href="#" data-soon>${t('footer.help')}</a>
              <a href="#" data-soon>${t('footer.terms')}</a>
              <a href="#" data-soon>${t('footer.rules')}</a>
              <a href="#" data-soon>${t('footer.privacy')}</a>
            </div>
          </div>
          <div class="footer-bottom"><span>${t('footer.rights')}</span><span>${t('footer.note')}</span></div>
        </div>
      </footer>`;
  }

  /* ---------- Toast & Modal ---------- */
  function toast(msg) {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function modal(html) {
    closeModal();
    const bd = document.createElement('div');
    bd.className = 'modal-backdrop open';
    bd.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    bd.addEventListener('click', e => { if (e.target === bd || e.target.closest('[data-close]')) closeModal(); });
    document.body.appendChild(bd);
    document.body.style.overflow = 'hidden';
    const first = bd.querySelector('input, select, textarea');
    if (first) setTimeout(() => first.focus(), 50);
    return bd;
  }

  function closeModal() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.remove());
    document.body.style.overflow = '';
  }

  /* Kiểm tra form đơn giản: trường có [required] và [type=email] */
  function validate(form) {
    let ok = true;
    form.querySelectorAll('.field').forEach(f => {
      const input = f.querySelector('input, select, textarea');
      if (!input) return;
      let msg = '';
      if (input.required && !String(input.value).trim()) msg = t('c.required');
      else if (input.type === 'email' && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) msg = t('c.invalidEmail');
      f.classList.toggle('invalid', !!msg);
      const err = f.querySelector('.err');
      if (err) err.textContent = msg;
      if (msg) ok = false;
    });
    const firstBad = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
    if (firstBad) firstBad.focus();
    return ok;
  }

  const field = (label, input, cls = '') => `<div class="field ${cls}"><label>${label}</label>${input}<div class="err"></div></div>`;

  /* Modal gửi yêu cầu báo giá: cho sản phẩm hoặc cho đơn vị dịch vụ */
  function inquiryModal({ productId, companyId }) {
    const p = productId ? product(productId) : null;
    const c = company(p ? p.company : companyId);
    const isSvc = !p && c.role !== 'exporter';
    const countryOpts = Object.keys(COUNTRIES).map(k => `<option value="${k}">${esc(L(COUNTRIES[k].name))}</option>`).join('');
    const head = p
      ? `<div class="modal-prod"><img src="${img(p.imgs[0], 200)}" alt=""><div><strong>${esc(L(p.name))}</strong><span class="muted">${esc(c.name)}</span></div></div>`
      : `<div class="modal-prod">${logoBox(c)}<div><strong>${esc(c.name)}</strong><span class="muted">${esc(L(ROLES[c.role].name))} · ${esc(L(COUNTRIES[c.country].name))}</span></div></div>`;

    const body = isSvc
      ? `${field(t('inq.service') + ' <span class="req">*</span>', `<select required><option value="">—</option>${c.services.map(s => `<option>${esc(L(s.name))}</option>`).join('')}</select>`)}
         ${field(t('inq.route') + ' <span class="req">*</span>', `<input class="input" required placeholder="${esc(t('inq.routePh'))}">`)}`
      : `<div class="form-grid">
           ${field(t('inq.qty') + ' <span class="req">*</span>', `<input class="input" required placeholder="${p ? esc(L(p.moq)) : ''}">`)}
           ${field(t('inq.dest') + ' <span class="req">*</span>', `<select required><option value="">—</option>${countryOpts}</select>`)}
           ${field(t('inq.incoterm'), `<select><option>FOB</option><option>CIF</option><option>CFR</option><option>EXW</option></select>`, 'full')}
         </div>`;

    const bd = modal(`
      <div class="modal-head"><div><h3>${t(isSvc ? 'inq.svcTitle' : 'inq.title')}</h3><p>${t(isSvc ? 'inq.svcDesc' : 'inq.desc')}</p></div><button class="modal-close" data-close aria-label="${t('c.close')}">✕</button></div>
      <form class="modal-body" novalidate>
        ${head}
        <div style="display:grid;gap:16px">
          ${body}
          ${field(t('inq.msg'), `<textarea placeholder="${esc(t('inq.msgPh'))}"></textarea>`)}
          <div class="form-grid">
            ${field(t('inq.company') + ' <span class="req">*</span>', `<input class="input" required>`)}
            ${field(t('inq.email') + ' <span class="req">*</span>', `<input class="input" type="email" required>`)}
          </div>
          <button class="btn btn-primary btn-lg btn-block" type="submit">${t('inq.send')}</button>
        </div>
      </form>`);

    bd.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(e.target)) return;
      bd.querySelector('.modal').innerHTML = `
        <div class="modal-body success-box" style="padding:40px 30px">
          <h2>${t('inq.okTitle')}</h2>
          <p class="muted">${t('inq.okDesc', { company: esc(c.name), time: c.response })}</p>
          <button class="btn btn-navy" data-close>${t('c.close')}</button>
        </div>`;
    });
  }

  /* ---------- Khởi tạo ---------- */
  function renderAll() {
    document.documentElement.lang = HTML_LANG[lang];
    renderHeader();
    renderFooter();
    applyI18n();
    if (pageRender) pageRender();
  }

  function init({ nav = '', render = null } = {}) {
    lang = readLang();
    activeNav = nav;
    pageRender = render;
    renderAll();
    if (typeof Chatbot !== 'undefined') Chatbot.mount();

    document.addEventListener('click', e => {
      const langBtn = e.target.closest('[data-lang]');
      if (langBtn) { setLang(langBtn.dataset.lang); document.body.classList.remove('drawer-open'); return; }
      if (e.target.closest('[data-soon]')) { e.preventDefault(); toast(t('toast.soon')); return; }
      if (e.target.closest('[data-drawer]')) { document.body.classList.add('drawer-open'); return; }
      if (e.target.closest('[data-drawer-close]')) { document.body.classList.remove('drawer-open', 'filters-open'); return; }
      const q = e.target.closest('[data-quote-svc]');
      if (q) { inquiryModal({ companyId: q.dataset.quoteSvc }); return; }
      const qp = e.target.closest('[data-quote-product]');
      if (qp) { inquiryModal({ productId: qp.dataset.quoteProduct }); return; }
      if (!e.target.closest('.nav-cat')) document.querySelectorAll('.nav-cat.open').forEach(n => n.classList.remove('open'));
    });
    const clearErr = e => e.target.closest?.('.field.invalid')?.classList.remove('invalid');
    document.addEventListener('input', clearErr);
    document.addEventListener('change', clearErr);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); document.body.classList.remove('drawer-open', 'filters-open', 'chat-open'); } });
  }

  return {
    init, t, L, esc, img, flag, param, company, product, cat, catName, allCats, ago, productsOf, joinText, crumbs,
    productCard, supplierCard, providerCard, verifiedText, verifiedIcon, logoBox,
    toast, modal, closeModal, validate, field, inquiryModal, applyI18n,
    onLang: fn => listeners.push(fn),
    get lang() { return lang; }
  };
})();
