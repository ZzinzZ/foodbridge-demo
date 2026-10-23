/* Đăng ký doanh nghiệp — form nhiều bước, trường thay đổi theo loại hình */
(() => {
  const { t, L, esc, img } = App;
  const state = { step: 1, role: ROLES[App.param('role')] ? App.param('role') : '', data: {} };

  const val = n => state.data[n] ?? '';
  const arr = n => state.data[n] || [];

  function input(name, label, { req = true, type = 'text', ph = '', cls = '', hint = '' } = {}) {
    return `<div class="field ${cls}"><label>${label}${req ? ' <span class="req">*</span>' : ''}</label>
      <input class="input" name="${name}" type="${type}" value="${esc(val(name))}" placeholder="${esc(ph)}" ${req ? 'required' : ''}>
      ${hint ? `<div class="hint">${hint}</div>` : ''}<div class="err"></div></div>`;
  }

  function checks(name, label, options) {
    return `<div class="full"><span class="field-label">${label}</span>
      <div class="check-grid">${options.map(([v, l]) => `<label class="check"><input type="checkbox" name="${name}" value="${esc(v)}" ${arr(name).includes(v) ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>`;
  }

  const countryOpts = () => Object.keys(COUNTRIES).map(k => `<option value="${k}" ${val('country') === k ? 'selected' : ''}>${esc(L(COUNTRIES[k].name))}</option>`).join('');
  const marketOpts = () => Object.keys(COUNTRIES).map(k => [k, `${App.flag(k)} ${esc(L(COUNTRIES[k].name))}`]);

  /* Trường riêng theo loại hình doanh nghiệp */
  function roleFields() {
    switch (state.role) {
      case 'exporter':
        return checks('trade', t('reg.tradeDir'), [['export', t('reg.export')], ['import', t('reg.import')]])
          + checks('cats', t('reg.cats'), App.allCats().map(c => [c.id, esc(L(c.name))]))
          + checks('markets', t('reg.markets'), marketOpts());
      case 'logistics':
        return checks('modes', t('reg.modes'), ['sea', 'air', 'road', 'cold', 'customs'].map(m => [m, t('reg.mode.' + m)]))
          + checks('routes', t('reg.routes'), [['VN', 'CN'], ['VN', 'AU'], ['CN', 'AU']].map(([a, b]) => [`${a}-${b}`, `${esc(L(COUNTRIES[a].name))} – ${esc(L(COUNTRIES[b].name))}`]));
      case 'consulting':
        return checks('fields', t('reg.fields'), ['procedure', 'registration', 'label', 'market', 'legal'].map(f => [f, t('reg.field.' + f)]))
          + checks('markets', t('reg.markets'), marketOpts());
      case 'insurance':
        return checks('ins', t('reg.insProducts'), ['cargo', 'credit', 'liability', 'recall'].map(f => [f, t('reg.ins.' + f)]))
          + checks('markets', t('reg.markets'), marketOpts());
      default: return '';
    }
  }

  function stepBody() {
    if (state.step === 1) return `
      <h2>${t('reg.s1.title')}</h2><p class="lead">${t('reg.s1.desc')}</p>
      <div class="role-options">
        ${Object.entries(ROLES).map(([k, r]) => `
          <div class="role-option ${state.role === k ? 'active' : ''}" data-role="${k}" tabindex="0" role="button" aria-pressed="${state.role === k}">
            <img src="${img(r.img, 300)}" alt="">
            <div class="txt"><h4>${esc(L(r.name))}</h4><p>${t('reg.role.' + k)}</p></div>
          </div>`).join('')}
      </div>
      <p id="roleErr" style="color:var(--danger);margin:12px 0 0;display:none">${t('reg.s1.err')}</p>`;

    if (state.step === 2) return `
      <h2>${t('reg.s2.title')}</h2><p class="lead">${t('reg.s2.desc')}</p>
      <div class="form-grid">
        ${input('company', t('reg.companyName'), { cls: 'full', ph: t('reg.companyNamePh') })}
        ${input('tax', t('reg.tax'))}
        <div class="field"><label>${t('reg.country')} <span class="req">*</span></label><select name="country" required><option value="">${t('reg.chooseCountry')}</option>${countryOpts()}</select><div class="err"></div></div>
        ${input('city', t('reg.city'))}
        ${input('year', t('reg.year'), { req: false, type: 'number', ph: '2015' })}
        ${input('website', t('reg.website'), { req: false, cls: 'full', ph: 'https://' })}
        ${roleFields()}
        <div class="field full"><label>${t('reg.about')}</label><textarea name="about" placeholder="${esc(t('reg.aboutPh'))}">${esc(val('about'))}</textarea></div>
      </div>`;

    if (state.step === 3) return `
      <h2>${t('reg.s3.title')}</h2><p class="lead">${t('reg.s3.desc')}</p>
      <div class="form-grid">
        ${input('name', t('reg.contactName'))}
        ${input('position', t('reg.position'), { req: false })}
        ${input('email', t('reg.email'), { type: 'email', ph: 'name@company.com' })}
        ${input('phone', t('reg.phone'), { type: 'tel', ph: '+84 …' })}
        ${input('pw', t('reg.password'), { type: 'password', hint: t('reg.passwordHint') })}
        ${input('pw2', t('reg.password2'), { type: 'password' })}
        <div class="field full"><label class="check" style="font-weight:400;color:var(--body)"><input type="checkbox" name="agree" ${val('agree') ? 'checked' : ''}><span>${t('reg.agree')}</span></label><div class="err"></div></div>
      </div>`;

    return `
      <div class="success-box">
        <h2>${t('reg.ok.title')}</h2>
        <p class="muted" style="max-width:620px;margin:0 auto">${t('reg.ok.desc', { company: `<span class="strong">${esc(val('company'))}</span>` })}</p>
        <div class="timeline">
          <div class="ti done"><strong>1. ${t('reg.t1')}</strong><span>${t('reg.t1d')}</span></div>
          <div class="ti now"><strong>2. ${t('reg.t2')}</strong><span>${t('reg.t2d', { email: esc(val('email')) })}</span></div>
          <div class="ti"><strong>3. ${t('reg.t3')}</strong><span>${t('reg.t3d')}</span></div>
          <div class="ti"><strong>4. ${t('reg.t4')}</strong><span>${t('reg.t4d')}</span></div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a class="btn btn-primary btn-lg" href="dashboard.html">${t('reg.goDash')}</a>
          <a class="btn btn-outline btn-lg" href="index.html">${t('reg.goHome')}</a>
        </div>
      </div>`;
  }

  function render() {
    document.getElementById('page').innerHTML = `
      <section class="page-head">
        <div class="container">
          ${App.crumbs([['index.html', t('c.home')], [null, t('reg.title')]])}
          <h1>${t('reg.title')}</h1><p>${t('reg.desc')}</p>
        </div>
      </section>
      <div class="container reg-wrap">
        <div class="stepper">
          ${[1, 2, 3, 4].map(i => `<div class="st ${i === state.step ? 'active' : ''} ${i < state.step ? 'done' : ''}"><span class="n">0${i}</span><span class="lbl">${t('reg.step' + i)}</span></div>`).join('')}
        </div>
        <form class="card reg-card" id="regForm" novalidate>
          ${stepBody()}
          ${state.step < 4 ? `
            <div class="reg-nav">
              ${state.step > 1 ? `<button type="button" class="btn btn-outline btn-lg" data-back>← ${t('reg.back')}</button>` : '<span></span>'}
              <button type="submit" class="btn btn-primary btn-lg">${t(state.step === 3 ? 'reg.submit' : 'reg.next')} →</button>
            </div>` : ''}
        </form>
      </div>`;
    bind();
  }

  /* Lưu giá trị đang nhập vào state để không mất khi đổi ngôn ngữ hoặc quay lại bước trước */
  function collect(form) {
    form.querySelectorAll('input, select, textarea').forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox' && el.name !== 'agree') {
        state.data[el.name] = [...form.querySelectorAll(`input[name="${el.name}"]:checked`)].map(x => x.value);
      } else if (el.name === 'agree') state.data.agree = el.checked;
      else state.data[el.name] = el.value;
    });
  }

  function setErr(name, msg) {
    const f = document.querySelector(`[name="${name}"]`)?.closest('.field');
    if (!f) return;
    f.classList.add('invalid');
    f.querySelector('.err').textContent = msg;
  }

  function bind() {
    const form = document.getElementById('regForm');
    form.addEventListener('input', () => collect(form));
    form.addEventListener('change', () => collect(form));
    form.querySelectorAll('[data-role]').forEach(el => {
      const pick = () => { state.role = el.dataset.role; render(); };
      el.addEventListener('click', pick);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
    form.querySelector('[data-back]')?.addEventListener('click', () => { collect(form); state.step--; render(); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      collect(form);
      if (state.step === 1) {
        if (!state.role) { document.getElementById('roleErr').style.display = 'block'; return; }
      } else if (state.step === 2) {
        if (!App.validate(form)) return;
      } else if (state.step === 3) {
        let ok = App.validate(form);
        if (ok && val('pw').length < 8) { setErr('pw', t('reg.pwShort')); ok = false; }
        if (ok && val('pw') !== val('pw2')) { setErr('pw2', t('reg.pwMismatch')); ok = false; }
        if (ok && !val('agree')) { setErr('agree', t('reg.agreeErr')); ok = false; }
        if (!ok) return;
        delete state.data.pw; delete state.data.pw2;
      }
      state.step++;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  App.init({ nav: '', render });
})();
