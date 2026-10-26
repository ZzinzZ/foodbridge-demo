/* Gói thành viên: bảng giá, so sánh quyền lợi, thanh toán online, câu hỏi thường gặp */
(() => {
  const { t, esc } = App;
  const M = Membership;

  /* Bảng so sánh: true/false = có/không, số hiển thị nguyên, chuỗi là khóa dịch, hàm trả về nội dung */
  const ROWS = [
    ['products', 10, 100, 'plan.unlimited'],
    ['profile', true, true, true],
    ['inquiries', true, true, true],
    ['verify', 'plan.v.verifyStd', 'plan.v.verifyFast', 'plan.v.verifyFast'],
    ['contacts', false, () => t('plan.perMonth', { n: 50 }), 'plan.unlimited'],
    ['rank', 'plan.v.rankStd', 'plan.v.rankPrio', 'plan.v.rankTop'],
    ['featured', false, false, true],
    ['stats', false, true, true],
    ['support', 'plan.v.email', 'plan.v.emailZalo', 'plan.v.manager']
  ];

  const mark = v => v === true ? `<span class="yes" role="img" aria-label="${esc(t('plan.yes'))}"></span>`
    : v === false ? `<span class="no" role="img" aria-label="${esc(t('plan.no'))}">—</span>`
    : typeof v === 'function' ? v() : typeof v === 'number' ? v : t(v);

  function cost(p) {
    const cur = M.currency();
    const n = p.price[cur];
    return n
      ? `<div class="plan-price">${M.money(n, cur)}</div><p class="plan-sub">${t('plan.perYearEq', { price: M.money(M.monthly(n, cur), cur) })}</p>`
      : `<div class="plan-price">${M.money(0, cur)}</div><p class="plan-sub">${t('plan.freeForever')}</p>`;
  }

  /* Nút hành động và dòng ghi chú dưới nút (gói đang dùng thì hiện ngày hết hạn) */
  function action(p, st) {
    if (p.id === st.id && p.id !== 'free') return `
      <button class="btn btn-teal btn-lg btn-block" type="button" data-buy="${p.id}">${t('dash.plan.renew')}</button>
      <p class="plan-note">${t('plan.yours', { date: M.date(st.end) })}</p>`;
    if (p.id !== 'free' && PLANS.indexOf(p) < PLANS.findIndex(x => x.id === st.id)) return `
      <button class="btn btn-outline btn-lg btn-block" type="button" disabled>${t('plan.included', { name: esc(M.name(st.id)) })}</button>
      <p class="plan-note" aria-hidden="true">&nbsp;</p>`;
    if (p.id === 'free') return `
      <a class="btn btn-outline btn-lg btn-block" href="register.html">${t('plan.cta.free')}</a>
      <p class="plan-note">${t('plan.note.free')}</p>`;
    return `
      <button class="btn ${p.popular ? 'btn-teal' : 'btn-primary'} btn-lg btn-block" type="button" data-buy="${p.id}">${t('plan.cta.buy', { name: esc(M.name(p.id)) })}</button>
      <p class="plan-note">${t('plan.note.paid')}</p>`;
  }

  const card = (p, st) => `
    <div class="card plan-card ${p.popular ? 'featured' : ''}" data-plan="${p.id}">
      <span class="plan-tag ${p.popular ? '' : 'blank'}" ${p.popular ? '' : 'aria-hidden="true"'}>${p.popular ? t('plan.popular') : '&nbsp;'}</span>
      <h3>${esc(M.name(p.id))}</h3>
      <p class="plan-desc">${t(`plan.${p.id}.desc`)}</p>
      <div class="plan-cost">${cost(p)}</div>
      <div class="plan-act">${action(p, st)}</div>
      <ul class="plan-feats">${Array.from({ length: p.feats }, (_, i) => `<li>${t(`plan.${p.id}.f${i + 1}`)}</li>`).join('')}</ul>
    </div>`;

  function render() {
    const st = M.current();
    const cur = M.currency();
    document.getElementById('page').innerHTML = `
      <section class="page-head">
        <div class="container">
          ${App.crumbs([['index.html', t('c.home')], [null, t('plan.title')]])}
          <h1>${t('plan.title')}</h1>
          <p>${t('plan.desc')}</p>
        </div>
      </section>
      <div class="container">
        <div class="plan-bar">
          <h2>${t('plan.choose')}</h2>
          <div class="cur-switch" role="group" aria-label="${esc(t('plan.currency'))}">
            <span class="muted">${t('plan.currency')}</span>
            ${['VND', 'USD'].map(c => `<button type="button" class="text-tab ${c === cur ? 'active' : ''}" data-cur="${c}">${c === 'VND' ? 'VNĐ' : 'USD'}</button>`).join('')}
          </div>
        </div>
        <div class="plan-grid">${PLANS.map(p => card(p, st)).join('')}</div>

        <section class="plan-section">
          <div class="section-head"><div><h2>${t('plan.compare')}</h2><p>${t('plan.compareDesc')}</p></div></div>
          <div class="card compare-wrap"><div class="table-wrap"><table class="table compare">
            <thead><tr><th></th>${PLANS.map(p => `<th class="${p.popular ? 'hl' : ''}">${esc(M.name(p.id))}</th>`).join('')}</tr></thead>
            <tbody>${ROWS.map(([k, ...vals]) => `
              <tr><td>${t('plan.row.' + k)}</td>${vals.map((v, i) => `<td class="${PLANS[i].popular ? 'hl' : ''}">${mark(v)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table></div></div>
        </section>

        <section class="plan-section">
          <div class="section-head"><div><h2>${t('plan.pay.title')}</h2></div></div>
          <div class="three-col">${[1, 2, 3].map(i => `
            <div class="card card-pad"><h4>${t(`plan.pay${i}.t`)}</h4><p class="muted" style="margin:0">${t(`plan.pay${i}.d`)}</p></div>`).join('')}
          </div>
        </section>

        <section class="plan-section">
          <div class="section-head"><div><h2>${t('plan.faq')}</h2></div></div>
          <div class="card faq">${[1, 2, 3, 4].map(i => `
            <details><summary>${t(`plan.q${i}`)}</summary><p>${t(`plan.a${i}`)}</p></details>`).join('')}
          </div>
        </section>
      </div>`;
  }

  /* Đổi tiền tệ hoặc thanh toán xong: chỉ vẽ lại phần giá và nút, không chạy lại hiệu ứng của cả trang */
  function paintCosts() {
    const cur = M.currency();
    document.querySelectorAll('[data-cur]').forEach(b => b.classList.toggle('active', b.dataset.cur === cur));
    PLANS.forEach(p => { document.querySelector(`[data-plan="${p.id}"] .plan-cost`).innerHTML = cost(p); });
  }
  function paintActions() {
    const st = M.current();
    PLANS.forEach(p => { document.querySelector(`[data-plan="${p.id}"] .plan-act`).innerHTML = action(p, st); });
  }

  document.getElementById('page').addEventListener('click', e => {
    const c = e.target.closest('[data-cur]');
    if (c) { M.setCurrency(c.dataset.cur); paintCosts(); return; }
    const b = e.target.closest('[data-buy]');
    if (b) M.checkout(b.dataset.buy, { onDone: paintActions });
  });

  App.init({ nav: 'pricing', render });
})();
