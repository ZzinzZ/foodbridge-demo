/* Danh sách sản phẩm / nhà cung cấp với bộ lọc chạy trên dữ liệu mẫu */
(() => {
  const { t, L, esc } = App;
  const CERTS = ['HACCP', 'ISO 22000', 'BRC', 'Halal', 'Kosher', 'Organic'];
  const listParam = k => (App.param(k) || '').split(',').filter(Boolean);

  const state = {
    view: App.param('view') === 'suppliers' ? 'suppliers' : 'products',
    q: App.param('q') || '',
    cats: listParam('cat'),
    countries: listParam('country'),
    certs: listParam('cert'),
    verified: App.param('verified') === '1',
    oem: App.param('oem') === '1',
    sort: App.param('sort') || 'featured'
  };

  /* Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu */
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  const textOf = obj => typeof obj === 'string' ? obj : Object.values(obj || {}).join(' ');
  const hasCert = (list, cert) => cert === 'Organic' ? list.some(x => /organic/i.test(x)) : list.includes(cert);

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.view === 'suppliers') p.set('view', 'suppliers');
    if (state.q) p.set('q', state.q);
    if (state.cats.length) p.set('cat', state.cats.join(','));
    if (state.countries.length) p.set('country', state.countries.join(','));
    if (state.certs.length) p.set('cert', state.certs.join(','));
    if (state.verified) p.set('verified', '1');
    if (state.oem) p.set('oem', '1');
    if (state.sort !== 'featured') p.set('sort', state.sort);
    history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
  }

  /* Lọc sản phẩm; `skip` để tính số lượng cho từng nhóm bộ lọc */
  function filterProducts(skip) {
    const q = norm(state.q);
    return PRODUCTS.filter(p => {
      const c = App.company(p.company);
      if (q && !norm(textOf(p.name) + ' ' + textOf(p.desc) + ' ' + c.name + ' ' + textOf(App.cat(p.cat).name)).includes(q)) return false;
      if (skip !== 'cat' && state.cats.length && !state.cats.includes(p.cat)) return false;
      if (skip !== 'country' && state.countries.length && !state.countries.includes(c.country)) return false;
      if (skip !== 'cert' && state.certs.length && !state.certs.some(x => hasCert(p.certs, x))) return false;
      if (state.verified && !c.verified) return false;
      if (state.oem && !p.oem) return false;
      return true;
    });
  }

  function filterSuppliers(skip) {
    const q = norm(state.q);
    return COMPANIES.filter(c => {
      if (c.role !== 'exporter') return false;
      const prods = App.productsOf(c.id);
      if (q && !norm(c.name + ' ' + textOf(c.desc) + ' ' + prods.map(p => textOf(p.name)).join(' ')).includes(q)) return false;
      if (skip !== 'cat' && state.cats.length && !prods.some(p => state.cats.includes(p.cat))) return false;
      if (skip !== 'country' && state.countries.length && !state.countries.includes(c.country)) return false;
      if (skip !== 'cert' && state.certs.length && !state.certs.some(x => hasCert(c.certs, x))) return false;
      if (state.verified && !c.verified) return false;
      if (state.oem && !prods.some(p => p.oem)) return false;
      return true;
    });
  }

  const filtered = skip => state.view === 'products' ? filterProducts(skip) : filterSuppliers(skip);

  function counts() {
    const isP = state.view === 'products';
    const byCat = filtered('cat'), byCountry = filtered('country'), byCert = filtered('cert');
    return {
      cat: id => isP ? byCat.filter(p => p.cat === id).length : byCat.filter(c => App.productsOf(c.id).some(p => p.cat === id)).length,
      country: cc => isP ? byCountry.filter(p => App.company(p.company).country === cc).length : byCountry.filter(c => c.country === cc).length,
      cert: x => isP ? byCert.filter(p => hasCert(p.certs, x)).length : byCert.filter(c => hasCert(c.certs, x)).length
    };
  }

  function sorted(items) {
    const arr = [...items];
    const nameOf = x => state.view === 'products' ? L(x.name) : x.name;
    if (state.sort === 'name') arr.sort((a, b) => nameOf(a).localeCompare(nameOf(b), App.lang));
    else if (state.sort === 'newest') arr.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || (b.year || 0) - (a.year || 0));
    else arr.sort((a, b) => (b.featured || b.verified ? 1 : 0) - (a.featured || a.verified ? 1 : 0));
    return arr;
  }

  const check = (group, value, label, n, checked) =>
    `<label class="check"><input type="checkbox" data-f="${group}" value="${esc(value)}" ${checked ? 'checked' : ''}><span>${label}</span>${n != null ? `<span class="count">${n}</span>` : ''}</label>`;

  function filtersHtml() {
    const n = counts();
    return `
      <aside class="card filters" aria-label="${t('filter.title')}">
        <div class="filter-group" style="display:flex;justify-content:space-between;align-items:center">
          <h5 style="margin:0">${t('filter.title')}</h5>
          <button class="btn-link" data-clear>${t('filter.clear')}</button>
        </div>
        <div class="filter-group">
          <h5>${t('filter.category')}</h5>
          ${CATEGORIES.map(c => `
            <div class="group-label">${esc(L(c.name))}</div>
            ${c.children.map(ch => check('cat', ch.id, esc(L(ch.name)), n.cat(ch.id), state.cats.includes(ch.id))).join('')}`).join('')}
        </div>
        <div class="filter-group">
          <h5>${t('filter.country')}</h5>
          ${Object.keys(COUNTRIES).map(cc => check('country', cc, `${App.flag(cc)} ${esc(L(COUNTRIES[cc].name))}`, n.country(cc), state.countries.includes(cc))).join('')}
        </div>
        <div class="filter-group">
          <h5>${t('filter.cert')}</h5>
          ${CERTS.map(x => check('cert', x, x, n.cert(x), state.certs.includes(x))).join('')}
        </div>
        <div class="filter-group">
          <h5>${t('filter.other')}</h5>
          <label class="check"><input type="checkbox" data-f="verified" ${state.verified ? 'checked' : ''}><span>${t('filter.verified')}</span></label>
          <label class="check"><input type="checkbox" data-f="oem" ${state.oem ? 'checked' : ''}><span>${t('filter.oem')}</span></label>
        </div>
      </aside>`;
  }

  function activeFilters() {
    const items = [
      ...state.cats.map(v => ['cat', v, App.catName(v)]),
      ...state.countries.map(v => ['country', v, L(COUNTRIES[v].name)]),
      ...state.certs.map(v => ['cert', v, v]),
      ...(state.verified ? [['verified', '', t('filter.verified')]] : []),
      ...(state.oem ? [['oem', '', t('filter.oem')]] : []),
      ...(state.q ? [['q', '', `“${state.q}”`]] : [])
    ];
    if (!items.length) return '';
    return `<div class="active-filters">${items.map(([g, v, l]) => `<button data-remove="${g}" data-v="${esc(v)}">${esc(l)}</button>`).join('')}</div>`;
  }

  function supplierRow(c) {
    const prods = App.productsOf(c.id);
    return `
      <div class="card card-pad supplier-row">
        <div style="display:flex;gap:18px;min-width:0">
          ${App.logoBox(c)}
          <div style="min-width:0">
            <a href="company.html?id=${c.id}" class="strong">${esc(c.name)}${App.verifiedIcon(c)}</a>
            <div class="muted" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${App.flag(c.country)} ${esc(L(c.city))}<span class="sep">·</span>${t('c.since', { n: c.year })}<span class="sep">·</span>${App.verifiedText(c)}</div>
            <p class="clamp-2" style="margin:6px 0">${esc(L(c.desc))}</p>
            <div class="muted">${App.joinText(c.certs)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;min-width:200px">
          <div class="thumbs-mini">${prods.slice(0, 3).map(p => `<a href="product.html?id=${p.id}" title="${esc(L(p.name))}"><img src="${App.img(p.imgs[0], 160)}" alt="" loading="lazy"></a>`).join('')}</div>
          <a class="btn btn-outline btn-sm" href="company.html?id=${c.id}">${t('c.viewProfile')}</a>
          <button class="btn btn-teal btn-sm" data-quote-svc="${c.id}">${t('c.contact')}</button>
        </div>
      </div>`;
  }

  function render() {
    const items = sorted(filtered());
    const isP = state.view === 'products';
    document.getElementById('page').innerHTML = `
      <section class="page-head">
        <div class="container">
          ${App.crumbs([['index.html', t('c.home')], [null, t(isP ? 'nav.products' : 'nav.suppliers')]])}
          <h1>${t(isP ? 'list.title' : 'list.titleSup')}</h1>
          <p>${t('list.desc')}</p>
          <div class="text-tabs">
            <button class="text-tab ${isP ? 'active' : ''}" data-view="products">${t('list.tabProducts')}</button>
            <button class="text-tab ${!isP ? 'active' : ''}" data-view="suppliers">${t('list.tabSuppliers')}</button>
          </div>
        </div>
      </section>
      <div class="container listing">
        ${filtersHtml()}
        <div>
          <div class="toolbar">
            <div style="display:flex;gap:12px;align-items:center">
              <button class="btn btn-outline btn-sm filter-toggle" data-open-filters>${t('filter.show')}</button>
              <span><span class="strong">${t('list.count', { n: items.length })}</span> ${state.q ? t('list.for', { q: esc(state.q) }) : ''}</span>
            </div>
            <label class="muted" style="display:flex;gap:10px;align-items:center">${t('sort.label')}
              <select class="select" id="sortSel">
                ${['featured', 'newest', 'name'].map(s => `<option value="${s}" ${state.sort === s ? 'selected' : ''}>${t('sort.' + s)}</option>`).join('')}
              </select>
            </label>
          </div>
          ${activeFilters()}
          ${items.length === 0
            ? `<div class="card empty">${t('list.empty')}</div>`
            : isP
              ? `<div class="product-grid">${items.map(App.productCard).join('')}</div>`
              : `<div style="display:grid;gap:16px">${items.map(supplierRow).join('')}</div>`}
        </div>
      </div>`;
    bind();
  }

  function toggle(arr, v) { const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); }

  function update() { syncUrl(); render(); }

  function bind() {
    const page = document.getElementById('page');
    page.querySelectorAll('[data-f]').forEach(el => el.addEventListener('change', () => {
      const g = el.dataset.f;
      if (g === 'cat') toggle(state.cats, el.value);
      if (g === 'country') toggle(state.countries, el.value);
      if (g === 'cert') toggle(state.certs, el.value);
      if (g === 'verified') state.verified = el.checked;
      if (g === 'oem') state.oem = el.checked;
      update();
    }));
    page.querySelectorAll('[data-remove]').forEach(el => el.addEventListener('click', () => {
      const g = el.dataset.remove, v = el.dataset.v;
      if (g === 'cat') toggle(state.cats, v);
      if (g === 'country') toggle(state.countries, v);
      if (g === 'cert') toggle(state.certs, v);
      if (g === 'verified') state.verified = false;
      if (g === 'oem') state.oem = false;
      if (g === 'q') { state.q = ''; const inp = document.querySelector('#searchForm input[name=q]'); if (inp) inp.value = ''; }
      update();
    }));
    page.querySelector('[data-clear]').addEventListener('click', () => {
      Object.assign(state, { cats: [], countries: [], certs: [], verified: false, oem: false });
      update();
    });
    page.querySelector('#sortSel').addEventListener('change', e => { state.sort = e.target.value; update(); });
    page.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => {
      if (state.view === el.dataset.view) return;
      state.view = el.dataset.view;
      syncUrl();
      location.reload();
    }));
    page.querySelector('[data-open-filters]').addEventListener('click', () => document.body.classList.add('filters-open'));
  }

  App.init({ nav: state.view === 'suppliers' ? 'suppliers' : 'products', render });
})();
