/* Chi tiết sản phẩm */
(() => {
  const { t, L, esc, img, flag } = App;
  const p = App.product(App.param('id')) || PRODUCTS[0];
  let activeImg = 0;
  let activeTab = 'desc';

  /* Gợi ý đối tác dịch vụ: logistics & bảo hiểm cùng nước xuất xứ, tư vấn ở thị trường đích */
  function suggestedServices(origin) {
    const pick = (role, test) => COMPANIES.filter(c => c.role === role && test(c));
    return [
      ...pick('logistics', c => c.country === origin).slice(0, 1),
      ...pick('consulting', c => c.country !== origin).slice(0, 2),
      ...pick('insurance', c => c.country === origin).slice(0, 1)
    ];
  }

  const specRows = rows => `<table class="spec-table">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`;

  function render() {
    const c = App.company(p.company);
    const parent = CATEGORIES.find(x => x.id === App.cat(p.cat).parent);
    const related = PRODUCTS.filter(x => x.id !== p.id && App.cat(x.cat).parent === parent.id && x.company !== p.company).slice(0, 4);
    const more = PRODUCTS.filter(x => x.id !== p.id && x.company === p.company);
    const certs = p.certs.join(', ');
    const origin = `${flag(c.country)} ${esc(L(COUNTRIES[c.country].name))}`;
    document.title = `${L(p.name)} — FoodBridge`;

    document.getElementById('page').innerHTML = `
      <div class="container">
        ${App.crumbs([
          ['index.html', t('c.home')], ['products.html', t('nav.products')],
          [`products.html?cat=${parent.children.map(x => x.id).join(',')}`, L(parent.name)], [`products.html?cat=${p.cat}`, App.catName(p.cat)]
        ], true)}

        <div class="pd-grid">
          <div style="min-width:0">
            <div class="card pd-main">
              <div class="gallery">
                <div class="main-img"><img id="mainImg" src="${img(p.imgs[activeImg], 1000)}" alt="${esc(L(p.name))}"></div>
                <div class="thumbs">${p.imgs.map((id, i) => `<img src="${img(id, 200)}" data-i="${i}" class="${i === activeImg ? 'active' : ''}" alt="">`).join('')}</div>
                <div class="note">${t('c.imgNote')}</div>
              </div>
              <div class="pd-info">
                <h2 style="margin-bottom:6px">${esc(L(p.name))}</h2>
                <div class="meta-line">${esc(c.name)}<span class="sep">·</span>${App.verifiedText(c)}${p.oem ? `<span class="sep">·</span>${t('c.oem')}` : ''}</div>
                <div class="price-box">
                  <div class="muted">${t('pd.price')}</div>
                  <div class="val">${p.price} <span>${t('pd.per', { unit: esc(L(p.unit)) })}</span></div>
                  <div class="muted">${t('pd.priceNote')}</div>
                </div>
                ${specRows([
                  [t('pd.origin'), origin],
                  [t('pd.moq'), esc(L(p.moq))],
                  [t('pd.pack'), esc(L(p.pack))],
                  [t('pd.port'), esc(p.port)],
                  [t('pd.certs'), esc(certs)]
                ])}
                <div class="pd-actions">
                  <button class="btn btn-primary btn-lg" data-quote-product="${p.id}">${t('c.sendInquiry')}</button>
                  <button class="btn btn-outline btn-lg" data-soon>${t('pd.chat')}</button>
                </div>
              </div>
            </div>

            <div class="card" style="margin-top:24px">
              <div class="tabs" role="tablist">
                ${['desc', 'specs', 'shipping'].map(k => `<button class="tab ${activeTab === k ? 'active' : ''}" data-tab="${k}" role="tab">${t('pd.tab.' + k)}</button>`).join('')}
              </div>
              <div class="tab-body">
                <div class="tab-pane ${activeTab === 'desc' ? 'active' : ''}" data-pane="desc">
                  <p>${esc(L(p.desc))}</p>
                  <p class="muted" style="margin:0">${t('pd.certs')}: ${esc(certs)}</p>
                </div>
                <div class="tab-pane ${activeTab === 'specs' ? 'active' : ''}" data-pane="specs">
                  ${specRows([
                    [t('pd.category'), esc(App.catName(p.cat))],
                    [t('pd.origin'), `${origin} · ${esc(L(c.city))}`],
                    [t('pd.moq'), esc(L(p.moq))],
                    [t('pd.pack'), esc(L(p.pack))],
                    [t('pd.shelf'), esc(L(p.shelf))],
                    [t('pd.storage'), esc(L(p.storage))],
                    [t('pd.port'), esc(p.port)],
                    [t('pd.capacity'), esc(L(p.capacity))],
                    [t('pd.certs'), esc(certs)],
                    [t('pd.oem'), p.oem ? t('c.yes') : t('c.no')]
                  ])}
                </div>
                <div class="tab-pane ${activeTab === 'shipping' ? 'active' : ''}" data-pane="shipping">
                  ${specRows([
                    [t('pd.ship.incoterms'), 'FOB, CFR, CIF'],
                    [t('pd.ship.payment'), t('pd.ship.paymentVal')],
                    [t('pd.ship.lead'), t('pd.ship.leadVal')],
                    [t('pd.ship.sample'), t('pd.ship.sampleVal')],
                    [t('pd.ship.docs'), t('pd.ship.docsVal')]
                  ])}
                </div>
              </div>
            </div>

            ${more.length ? `
              <div class="section-head" style="margin:40px 0 18px"><h2>${t('pd.moreFrom')}</h2><a class="link-arrow" href="company.html?id=${c.id}">${t('c.viewProfile')}</a></div>
              <div class="product-grid">${more.slice(0, 3).map(App.productCard).join('')}</div>` : ''}
            ${related.length ? `
              <div class="section-head" style="margin:40px 0 18px"><h2>${t('pd.related')}</h2></div>
              <div class="product-grid">${related.slice(0, 4).map(App.productCard).join('')}</div>` : ''}
          </div>

          <aside>
            <div class="card side-box">
              <h4>${t('pd.supplier')}</h4>
              <div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">
                ${App.logoBox(c)}
                <div style="min-width:0">
                  <a href="company.html?id=${c.id}" class="strong" style="display:block;line-height:1.35">${esc(c.name)}${App.verifiedIcon(c)}</a>
                  <span class="muted" style="display:flex;gap:6px;align-items:center">${flag(c.country)} ${esc(L(c.city))}</span>
                </div>
              </div>
              ${App.verifiedText(c)}
              <div style="margin:14px 0 18px">
                <div class="kv"><span>${t('co.stat.year')}</span><span>${c.year}</span></div>
                <div class="kv"><span>${t('co.stat.staff')}</span><span>${c.staff}</span></div>
                <div class="kv"><span>${t('co.stat.response')}</span><span>${c.response}</span></div>
                <div class="kv"><span>${t('co.stat.markets')}</span><span>${(c.markets || []).map(m => flag(m)).join(' ')}</span></div>
              </div>
              <div style="display:grid;gap:10px">
                <button class="btn btn-teal btn-block" data-quote-product="${p.id}">${t('c.sendInquiry')}</button>
                <a class="btn btn-outline btn-block" href="company.html?id=${c.id}">${t('c.viewProfile')}</a>
              </div>
            </div>

            <div class="card side-box">
              <h4 style="margin-bottom:2px">${t('pd.svc.title')}</h4>
              <p class="muted" style="margin-bottom:6px">${t('pd.svc.desc')}</p>
              ${suggestedServices(c.country).map(s => `
                <div class="svc-suggest">
                  ${App.logoBox(s)}
                  <div style="flex:1;min-width:0">
                    <a class="t" href="company.html?id=${s.id}">${esc(s.name)}${App.verifiedIcon(s)}</a>
                    <span class="s">${esc(L(ROLES[s.role].name))} · ${esc(L(COUNTRIES[s.country].name))}</span>
                  </div>
                  <button class="btn-link" data-quote-svc="${s.id}">${t('svc.quote')}</button>
                </div>`).join('')}
            </div>
          </aside>
        </div>
      </div>`;

    const page = document.getElementById('page');
    page.querySelectorAll('.thumbs img').forEach(el => el.addEventListener('click', () => {
      activeImg = +el.dataset.i;
      page.querySelector('#mainImg').src = img(p.imgs[activeImg], 1000);
      page.querySelectorAll('.thumbs img').forEach(x => x.classList.toggle('active', x === el));
    }));
    page.querySelectorAll('[data-tab]').forEach(el => el.addEventListener('click', () => {
      activeTab = el.dataset.tab;
      page.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('active', x === el));
      page.querySelectorAll('[data-pane]').forEach(x => x.classList.toggle('active', x.dataset.pane === activeTab));
    }));
  }

  App.init({ nav: 'products', render });
})();
