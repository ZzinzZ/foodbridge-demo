/* Trang chủ */
(() => {
  const { t, L, esc, img, flag } = App;
  const parentOf = id => App.cat(id)?.parent;
  const countIn = catId => PRODUCTS.filter(p => p.cat === catId).length;

  function catSide() {
    return `
      <aside class="card cat-side">
        ${CATEGORIES.map(c => `
          <h5>${esc(L(c.name))}</h5>
          ${c.children.map(ch => `<a href="products.html?cat=${ch.id}"><span>${esc(L(ch.name))}</span><span class="count">${countIn(ch.id)}</span></a>`).join('')}
        `).join('')}
        <a class="all" href="products.html">${t('home.cats.all')} →</a>
      </aside>`;
  }

  function heroBanner() {
    const stats = [[3, 'home.stat.countries'], [3, 'home.stat.langs'], [4, 'home.stat.roles'], [App.allCats().length, 'home.stat.cats']];
    return `
      <div class="hero-banner has-video">
        <video class="hero-video" autoplay muted loop playsinline preload="auto" poster="assets/video/hero-poster.jpg" aria-hidden="true">
          <source src="assets/video/hero.mp4" type="video/mp4">
        </video>
        <span class="hero-shade"></span>
        <span class="eyebrow">${t('home.hero.eyebrow')}</span>
        <h1>${t('home.hero.title')}</h1>
        <p>${t('home.hero.desc')}</p>
        <div class="hero-cta">
          <a class="btn btn-teal btn-lg" href="products.html">${t('home.hero.cta1')}</a>
          <a class="btn btn-ghost-white btn-lg" href="register.html">${t('home.hero.cta2')}</a>
        </div>
        <div class="hero-stats">${stats.map(([n, k]) => `<div><strong>${n}</strong><span>${t(k)}</span></div>`).join('')}</div>
      </div>`;
  }

  function threeCols() {
    const newest = PRODUCTS.filter(p => p.isNew).concat(PRODUCTS.filter(p => !p.isNew)).slice(0, 6);
    const verified = COMPANIES.filter(c => c.role === 'exporter' && c.verified).slice(0, 6);
    return `
      <section class="section-sm">
        <div class="container three-col">
          <div class="card">
            <div class="panel-head"><h3>${t('home.col.rfq')}</h3><a href="#" data-soon>${t('c.viewAll')}</a></div>
            ${BUY_REQUESTS.map(r => `
              <a class="list-row" href="#" data-soon>
                ${flag(r.country)}
                <span class="info"><span class="title ellipsis">${esc(L(r.title))}</span><span class="sub">${esc(L(r.city))}<span class="sep">·</span>${App.ago(r.hours)}</span></span>
              </a>`).join('')}
          </div>
          <div class="card">
            <div class="panel-head"><h3>${t('home.col.new')}</h3><a href="products.html?sort=newest">${t('c.viewAll')}</a></div>
            ${newest.map(p => {
              const c = App.company(p.company);
              return `
              <a class="list-row" href="product.html?id=${p.id}">
                <img class="thumb" src="${img(p.imgs[0], 160)}" alt="" loading="lazy">
                <span class="info"><span class="title ellipsis">${esc(L(p.name))}</span><span class="sub">${flag(c.country)}<span class="ellipsis">${esc(c.name)}</span>${App.verifiedIcon(c)}</span></span>
              </a>`;
            }).join('')}
          </div>
          <div class="card">
            <div class="panel-head"><h3>${t('home.col.suppliers')}</h3><a href="products.html?view=suppliers">${t('c.viewAll')}</a></div>
            ${verified.map(c => `
              <a class="list-row" href="company.html?id=${c.id}">
                ${App.logoBox(c, 'thumb')}
                <span class="info"><span class="title ellipsis">${esc(c.name)}${App.verifiedIcon(c)}</span><span class="sub">${flag(c.country)}${esc(L(c.city))}</span></span>
              </a>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function roles() {
    const links = { exporter: 'products.html', logistics: 'services.html?tab=logistics', consulting: 'services.html?tab=consulting', insurance: 'services.html?tab=insurance' };
    return `
      <section class="section section-white wave-top wave-bottom">
        <div class="map-deco right" aria-hidden="true"></div>
        <div class="container">
          <div class="section-head"><div><span class="eyebrow">${t('home.roles.eyebrow')}</span><h2>${t('home.roles.title')}</h2><p>${t('home.roles.desc')}</p></div></div>
          <div class="role-grid">
            ${Object.entries(ROLES).map(([k, r]) => `
              <div class="role-card">
                <img src="${img(r.img, 700)}" alt="" loading="lazy">
                <div class="body">
                  <h3>${esc(L(r.name))}</h3>
                  <p>${t(`role.${k}.desc`)}</p>
                  <ul>${[1, 2, 3].map(i => `<li>${t(`role.${k}.b${i}`)}</li>`).join('')}</ul>
                  <a class="link-arrow" href="${links[k]}">${t(`role.${k}.cta`)}</a>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function catBlocks() {
    return `
      <section class="section">
        <div class="container">
          ${CATEGORIES.map(c => {
            const prods = PRODUCTS.filter(p => parentOf(p.cat) === c.id).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            const sups = [...new Set(prods.map(p => p.company))].map(App.company).filter(x => x.verified).slice(0, 3);
            return `
            <div class="cat-block">
              <div class="cat-feature">
                <img src="${img(c.img, 800)}" alt="" loading="lazy">
                <h3>${esc(L(c.name))}</h3>
                <p>${esc(L(c.desc))}</p>
                <div class="subs">${c.children.map(ch => `<a href="products.html?cat=${ch.id}">${esc(L(ch.name))}</a>`).join('')}</div>
                <a class="btn btn-teal" style="align-self:flex-start" href="products.html?cat=${c.children.map(ch => ch.id).join(',')}">${t('home.block.viewAll')}</a>
              </div>
              <div>
                <p class="block-title">${t('home.block.suppliers')}</p>
                <div class="three-col" style="margin-bottom:28px">${sups.map(s => App.supplierCard(s)).join('')}</div>
                <p class="block-title">${t('home.block.products')}</p>
                <div class="product-grid">${prods.slice(0, 4).map(App.productCard).join('')}</div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>`;
  }

  function services() {
    const picks = ['vietlink-cold', 'vinatrade-advisory', 'saigon-marine'].map(App.company);
    return `
      <section class="section section-white wave-top wave-bottom">
        <div class="map-deco left" aria-hidden="true"></div>
        <div class="container">
          <div class="section-head">
            <div><span class="eyebrow">${t('home.svc.eyebrow')}</span><h2>${t('home.svc.title')}</h2><p>${t('home.svc.desc')}</p></div>
            <a class="btn btn-outline" href="services.html">${t('c.viewAll')}</a>
          </div>
          <div class="prov-grid">${picks.map(App.providerCard).join('')}</div>
        </div>
      </section>`;
  }

  function steps() {
    return `
      <section class="section">
        <div class="container">
          <div class="section-head"><div><span class="eyebrow">${t('home.steps.eyebrow')}</span><h2>${t('home.steps.title')}</h2></div></div>
          <div class="steps">
            ${[1, 2, 3, 4].map(i => `<div class="step"><span class="num">0${i}</span><h4>${t(`home.step${i}.t`)}</h4><p>${t(`home.step${i}.d`)}</p></div>`).join('')}
          </div>
        </div>
      </section>`;
  }

  /* Ba thị trường: bản đồ chấm khu vực Á – Thái Bình Dương (VN, CN, AU tô màu) + tuyến vận chuyển.
     Toạ độ theo khung bản đồ 1200 × 970: x = (kinh độ − 65) × 10, y = (50 − vĩ độ) × 10 */
  const MARKETS = { CN: { x: 390, y: 160 }, VN: { x: 415, y: 345 }, AU: { x: 690, y: 750 } };
  const ROUTES = ['M415 345Q300 260 390 160', 'M415 345Q470 610 690 750', 'M390 160Q900 300 690 750'];

  function marketStage() {
    const pct = (v, total) => `${(v / total * 100).toFixed(2)}%`;
    return `
      <div class="market-stage" aria-hidden="true">
        <div class="dots base"></div><div class="dots hl"></div>
        <svg class="routes" viewBox="0 0 1200 970" preserveAspectRatio="none">
          ${ROUTES.map((d, i) => `<path class="route" d="${d}"/>
          <circle class="ship" r="9"><animateMotion dur="${5 + i}s" begin="${i * 1.3}s" repeatCount="indefinite" path="${d}"/></circle>`).join('')}
        </svg>
        ${Object.entries(MARKETS).map(([cc, m]) => `<span class="marker" data-cc="${cc}" style="left:${pct(m.x, 1200)};top:${pct(m.y, 970)}">${flag(cc)}</span>`).join('')}
      </div>`;
  }

  function countries() {
    return `
      <section class="section markets" style="padding-top:0">
        <div class="container">
          <div class="section-head"><div><span class="eyebrow">${t('home.countries.eyebrow')}</span><h2>${t('home.countries.title')}</h2></div></div>
          <div class="market-wrap">
            ${marketStage()}
            <div class="market-list">
              ${Object.keys(COUNTRIES).map(cc => `
                <a class="country-card" data-cc="${cc}" href="products.html?country=${cc}">
                  ${flag(cc, 'big-flag')}
                  <div><h4 style="margin:0">${esc(L(COUNTRIES[cc].name))}</h4><p>${t(`home.country.${cc}`)}</p>
                  <span class="strong" style="color:var(--blue)">${t('home.country.count', { n: COMPANIES.filter(c => c.country === cc).length })}</span></div>
                </a>`).join('')}
            </div>
          </div>
        </div>
      </section>
      <section class="container">
        <div class="cta-band">
          <div><h2>${t('home.cta.title')}</h2><p>${t('home.cta.desc')}</p></div>
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <a class="btn btn-teal btn-lg" href="register.html">${t('home.cta.btn')}</a>
            <a class="btn btn-ghost-white btn-lg" href="dashboard.html">${t('home.cta.btn2')}</a>
          </div>
        </div>
      </section>`;
  }

  /* Rê chuột vào thẻ quốc gia thì điểm tương ứng trên bản đồ nổi lên */
  function bindMarkets() {
    document.querySelectorAll('.market-list .country-card').forEach(card => {
      const marker = document.querySelector(`.marker[data-cc="${card.dataset.cc}"]`);
      const on = v => { card.classList.toggle('is-active', v); marker?.classList.toggle('is-active', v); };
      card.addEventListener('mouseenter', () => on(true));
      card.addEventListener('mouseleave', () => on(false));
      card.addEventListener('focus', () => on(true));
      card.addEventListener('blur', () => on(false));
    });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelector('svg.routes')?.pauseAnimations();
  }

  function render() {
    document.getElementById('page').innerHTML = `
      <section class="home-hero"><div class="container hero-grid">${catSide()}${heroBanner()}</div></section>
      ${threeCols()}${roles()}${catBlocks()}${services()}${steps()}${countries()}`;
    bindMarkets();
    // Tôn trọng thiết lập giảm chuyển động của người dùng: dừng video ở khung poster
    const video = document.querySelector('.hero-video');
    if (video && matchMedia('(prefers-reduced-motion: reduce)').matches) { video.removeAttribute('autoplay'); video.pause(); }
    // Máy không giải mã được video thì quay về nền tĩnh (gradient + ảnh cảng) thay vì đứng hình
    video?.addEventListener('error', () => {
      video.remove();
      document.querySelector('.hero-banner')?.classList.remove('has-video');
    }, true);
  }

  App.init({ nav: 'home', render });
})();
