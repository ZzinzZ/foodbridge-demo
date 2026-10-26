/* Gói thành viên: định dạng giá, gói hiện tại của doanh nghiệp mẫu và luồng thanh toán online.
   Bản demo mô phỏng bước chuyển sang cổng thanh toán; trạng thái gói lưu trong localStorage của trình duyệt.
   Nạp sau app.js, trước script của trang. */
const Membership = (() => {
  const { t, esc } = App;
  const STORE = 'fb_plan';
  const CUR_STORE = 'fb_cur';
  const DAY = 864e5;
  const LOCALE = { vi: 'vi-VN', en: 'en-GB', zh: 'zh-CN' };
  const EMAIL = 'an.nguyen@mekongfresh.example';
  const METHODS = ['card', 'qr', 'atm'];

  const plan = id => PLANS.find(p => p.id === id);
  const name = id => t(`plan.${id}.name`);

  /* ---------- Tiền & ngày ---------- */
  function currency() {
    try {
      const c = localStorage.getItem(CUR_STORE);
      if (c === 'VND' || c === 'USD') return c;
    } catch (e) { /* bỏ qua */ }
    return App.lang === 'vi' ? 'VND' : 'USD';
  }
  function setCurrency(c) {
    try { localStorage.setItem(CUR_STORE, c); } catch (e) { /* bỏ qua */ }
  }
  const money = (n, cur = currency()) => cur === 'VND' ? `${n.toLocaleString('vi-VN')} ₫` : `USD ${n.toLocaleString('en-US')}`;
  /* Giá quy ra mỗi tháng: làm tròn tới nghìn đồng hoặc 1 USD */
  const monthly = (n, cur = currency()) => cur === 'VND' ? Math.round(n / 12 / 1000) * 1000 : Math.round(n / 12);
  const date = d => new Date(d).toLocaleDateString(LOCALE[App.lang], App.lang === 'vi'
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { day: 'numeric', month: App.lang === 'zh' ? 'long' : 'short', year: 'numeric' });
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const shiftYear = (d, n) => { const x = new Date(d); x.setFullYear(x.getFullYear() + n); return x; };
  const txnId = (d, n = Math.floor(1000 + Math.random() * 9000)) => 'FB' + new Date(d).toISOString().slice(2, 10).replace(/-/g, '') + n;

  /* ---------- Gói hiện tại ----------
     Doanh nghiệp mẫu dùng gói Tiêu chuẩn, còn 20 ngày để thấy được nhắc gia hạn */
  function defaults() {
    const end = new Date(today().getTime() + 20 * DAY);
    const start = shiftYear(end, -1);
    const first = shiftYear(end, -2);
    return {
      id: 'standard', start, end, remind: true,
      history: [
        { date: start, plan: 'standard', kind: 'renew', amount: 3900000, cur: 'VND', method: 'card', txn: txnId(start, 4821) },
        { date: first, plan: 'standard', kind: 'new', amount: 3900000, cur: 'VND', method: 'atm', txn: txnId(first, 1376) }
      ]
    };
  }

  function current() {
    let st = null;
    try { st = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { /* bỏ qua */ }
    if (!st || !plan(st.id) || new Date(st.end) < today()) st = defaults();
    st.start = new Date(st.start);
    st.end = new Date(st.end);
    st.history = (st.history || []).map(h => ({ ...h, date: new Date(h.date) }));
    st.daysLeft = Math.ceil((st.end - today()) / DAY);
    return st;
  }

  function save(st) {
    const { daysLeft, ...rest } = st;
    try { localStorage.setItem(STORE, JSON.stringify(rest)); } catch (e) { /* bỏ qua */ }
  }

  function setRemind(on) {
    const st = current();
    st.remind = on;
    save(st);
  }

  /* Mã QR minh họa (không quét được): 3 ô định vị và các ô ngẫu nhiên theo seed */
  function qrSvg(seed) {
    const n = 25;
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const finderZone = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    const finder = (x, y) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
    let d = finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finderZone(x, y) && rnd() > .52) d += `M${x} ${y}h1v1h-1z`;
    return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" aria-hidden="true"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path fill="#012d6f" fill-rule="evenodd" d="${d}"/></svg>`;
  }

  /* ---------- Thanh toán: chọn phương thức → cổng thanh toán → kết quả ---------- */
  function checkout(id, { onDone } = {}) {
    const cur = currency();
    const amount = plan(id).price[cur];
    const st = current();
    const renew = st.id === id;
    const start = renew ? st.end : today();
    const end = shiftYear(start, 1);
    const me = App.company('mekong-fresh');
    let method = 'card';
    let email = EMAIL;

    const box = App.modal('').querySelector('.modal');
    const alive = () => box.isConnected;
    const head = (title, sub) => `<div class="modal-head"><div><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}</div><button class="modal-close" data-close aria-label="${t('c.close')}">✕</button></div>`;

    function form() {
      box.innerHTML = `
        ${head(t(renew ? 'pay.renewTitle' : 'pay.title', { name: esc(name(id)) }), t('pay.desc'))}
        <form class="modal-body" novalidate>
          <div class="pay-sum">
            <div class="kv"><span>${t('pay.plan')}</span><span>${esc(name(id))}</span></div>
            <div class="kv"><span>${t('pay.term')}</span><span>${date(start)} – ${date(end)}</span></div>
            <div class="kv"><span>${t('pay.company')}</span><span>${esc(me.name)}</span></div>
          </div>
          <div style="display:grid;gap:18px">
            <div class="form-grid pay-fields">
              ${App.field(t('pay.email') + ' <span class="req">*</span>', `<input class="input" type="email" name="email" required value="${esc(email)}">`)}
              ${App.field(t('pay.tax'), `<input class="input" name="tax" value="1801234567">`)}
            </div>
            <div>
              <span class="field-label">${t('pay.method')}</span>
              <div class="pay-methods">${METHODS.map(m => `
                <label class="pay-opt ${m === method ? 'active' : ''}">
                  <input type="radio" name="method" value="${m}" ${m === method ? 'checked' : ''}>
                  <span><strong>${t('pay.m.' + m)}</strong><span class="muted">${t('pay.m.' + m + 'Sub')}</span></span>
                </label>`).join('')}
              </div>
            </div>
            <div class="pay-total"><span>${t('pay.total')}</span><strong>${money(amount, cur)}</strong></div>
            <p class="muted" style="margin:0">${t('pay.secure')}</p>
            <button class="btn btn-primary btn-lg btn-block" type="submit">${t('pay.btn', { amount: money(amount, cur) })}</button>
          </div>
        </form>`;
      const f = box.querySelector('form');
      f.addEventListener('change', e => {
        if (e.target.name !== 'method') return;
        method = e.target.value;
        f.querySelectorAll('.pay-opt').forEach(o => o.classList.toggle('active', o.querySelector('input').checked));
      });
      f.addEventListener('submit', e => {
        e.preventDefault();
        if (!App.validate(f)) return;
        email = f.elements.email.value.trim();
        if (method === 'qr') qr(); else wait('pay.redirect');
      });
    }

    /* Bản chính thức chuyển sang trang của cổng thanh toán; demo chờ giây lát rồi báo thành công */
    function wait(key) {
      box.innerHTML = `<div class="modal-body pay-wait"><div class="spinner" aria-hidden="true"></div><h3>${t(key)}</h3><p class="muted" style="margin:0">${t('pay.wait')}</p></div>`;
      setTimeout(() => { if (alive()) done(); }, 1600);
    }

    function qr() {
      let left = 15 * 60;
      box.innerHTML = `
        ${head(t('pay.qrTitle'))}
        <div class="modal-body" style="text-align:center">
          <div class="qr-box">${qrSvg(amount % 9973 + id.length * 131)}</div>
          <div class="pay-total center"><span>${t('pay.total')}</span><strong>${money(amount, cur)}</strong></div>
          <p class="muted">${t('pay.qrSub', { time: '<span class="strong" data-left>15:00</span>' })}</p>
          <div style="display:grid;gap:12px;justify-items:center">
            <button class="btn btn-primary btn-lg btn-block" type="button" data-paid>${t('pay.qrDone')}</button>
            <button class="btn-link" type="button" data-change>${t('pay.change')}</button>
          </div>
        </div>`;
      const out = box.querySelector('[data-left]');
      const timer = setInterval(() => {
        if (!out.isConnected) { clearInterval(timer); return; }
        left = Math.max(0, left - 1);
        out.textContent = `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
      }, 1000);
      box.querySelector('[data-paid]').addEventListener('click', () => wait('pay.checking'));
      box.querySelector('[data-change]').addEventListener('click', form);
    }

    function done() {
      const txn = txnId(new Date());
      const next = current();
      next.history.unshift({ date: today(), plan: id, kind: renew ? 'renew' : 'new', amount, cur, method, txn });
      Object.assign(next, { id, end, start: renew ? next.start : start });
      save(next);
      const onDash = location.pathname.endsWith('dashboard.html');
      box.innerHTML = `
        <div class="modal-body success-box" style="padding:40px 30px">
          <h2>${t('pay.okTitle')}</h2>
          <p class="muted">${t('pay.okDesc', { name: esc(name(id)), date: date(end), email: esc(email) })}</p>
          <div class="pay-sum" style="text-align:left;margin:24px 0">
            <div class="kv"><span>${t('pay.txn')}</span><span>${txn}</span></div>
            <div class="kv"><span>${t('pay.amount')}</span><span>${money(amount, cur)}</span></div>
            <div class="kv"><span>${t('pay.method')}</span><span>${t('pay.m.' + method)}</span></div>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            ${onDash ? '' : `<a class="btn btn-primary" href="dashboard.html#plan">${t('pay.goDash')}</a>`}
            <button class="btn ${onDash ? 'btn-navy' : 'btn-outline'}" type="button" data-close>${t('c.close')}</button>
          </div>
        </div>`;
      if (onDone) onDone();
    }

    form();
  }

  return { plan, name, currency, setCurrency, money, monthly, date, current, setRemind, checkout };
})();
