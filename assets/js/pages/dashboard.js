/* Trang quản lý của doanh nghiệp (mẫu: Mekong Fresh Beverage JSC)
   Sản phẩm đăng mới được lưu trong localStorage của trình duyệt. */
(() => {
  const { t, L, esc, img } = App;
  const me = App.company('mekong-fresh');
  const STORE = 'fb_my_products';
  const PANELS = ['overview', 'products', 'add', 'inquiries', 'profile', 'verify'];
  const LANG_NAMES = { vi: 'Tiếng Việt', en: 'English', zh: '中文' };

  /* Sản phẩm mẫu ở các trạng thái khác nhau */
  const SAMPLE = [
    ...App.productsOf(me.id).map((p, i) => ({ id: p.id, name: p.name, img: img(p.imgs[0], 160), cat: p.cat, price: p.price, status: 'approved', views: [1240, 860][i] || 300, updated: '12/10/2026', link: true })),
    { id: 's-passion', name: { vi: 'Nước ép chanh dây 330ml', en: 'Passion Fruit Juice 330ml', zh: '百香果汁 330毫升' }, img: img('photo-1587015990127-424b954e38b5', 160), cat: 'juice', price: '0.42 – 0.50', status: 'pending', views: 0, updated: '20/10/2026' },
    { id: 's-coco-pine', name: { vi: 'Nước dừa hương dứa 1L', en: 'Coconut Water with Pineapple 1L', zh: '菠萝味椰子水 1升' }, img: img('photo-1761576882205-ac0ec9df45c2', 160), cat: 'softdrink', price: '0.95 – 1.20', status: 'rejected', views: 0, updated: '18/10/2026' }
  ];

  const INQUIRIES = [
    { company: 'Harbour Fresh Imports Pty', country: 'AU', product: 'orange-juice-nfc', qty: '2 x 20ft', hours: 2, isNew: true,
      msg: { vi: 'Cần nhãn riêng chai 1L, có HACCP. Báo giá CIF Sydney giúp chúng tôi.', en: 'We need private label 1L bottles with HACCP. Please quote CIF Sydney.', zh: '需要1升瓶贴牌，需HACCP认证。请报CIF悉尼价格。' } },
    { company: 'Shanghai Greenleaf Trading', country: 'CN', product: 'coconut-water', qty: '1 x 40ft', hours: 6, isNew: true,
      msg: { vi: 'Nhà máy đã đăng ký GACC chưa? Cần nhãn phụ tiếng Trung.', en: 'Is your plant GACC-registered? Chinese back labels required.', zh: '贵厂是否已在海关总署注册？需要中文背标。' } },
    { company: 'Melbourne Asian Grocers', country: 'AU', product: 'coconut-water', qty: '500 cartons', hours: 26, isNew: false,
      msg: { vi: 'Đơn thử 500 thùng, giao hàng lẻ LCL được không?', en: 'Trial order of 500 cartons — can you ship LCL?', zh: '试单500箱，可以拼箱发货吗？' } },
    { company: 'Guangzhou Fruitime Co.', country: 'CN', product: 'orange-juice-nfc', qty: '1 x 20ft', hours: 72, isNew: false,
      msg: { vi: 'Xin mẫu 6 chai và bảng thành phần dinh dưỡng.', en: 'Please send 6 sample bottles and the nutrition facts.', zh: '请寄6瓶样品及营养成分表。' } }
  ];

  let panel = PANELS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview';
  let uploads = [];          // ảnh đã chọn trong form đăng sản phẩm (data URL)
  let formLang = 'vi';       // ngôn ngữ đang nhập
  let draft = { name: { vi: '', en: '', zh: '' }, desc: { vi: '', en: '', zh: '' } };

  function mine() {
    try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; }
  }
  function saveMine(list) {
    try { localStorage.setItem(STORE, JSON.stringify(list)); return true; } catch (e) { return false; }
  }
  const allProducts = () => [...mine().slice().reverse(), ...SAMPLE];
  const status = s => `<span class="st-${s}">${t('dash.st.' + s)}</span>`;

  /* ---------- Các panel ---------- */
  function productTable(list) {
    return `
      <div class="table-wrap"><table class="table">
        <thead><tr><th>${t('dash.col.product')}</th><th>${t('dash.col.category')}</th><th>${t('dash.col.status')}</th><th>${t('dash.col.views')}</th><th>${t('dash.col.updated')}</th><th></th></tr></thead>
        <tbody>${list.map(p => `
          <tr>
            <td><div class="prod"><img src="${p.img}" alt=""><div><strong>${esc(L(p.name))}</strong><span class="muted">${p.price ? 'USD ' + esc(p.price) : ''}</span></div></div></td>
            <td>${esc(App.catName(p.cat))}</td>
            <td>${status(p.status)}</td>
            <td>${p.views.toLocaleString()}</td>
            <td class="muted">${p.updated}</td>
            <td><div class="row-actions">${p.link ? `<a href="product.html?id=${p.id}">${t('dash.view')}</a>` : ''}<button data-soon>${t('dash.edit')}</button></div></td>
          </tr>`).join('')}</tbody>
      </table></div>`;
  }

  function inquiryList(list) {
    return list.map(q => {
      const p = App.product(q.product);
      return `
        <div class="inq">
          ${App.flag(q.country)}
          <div class="who">
            <strong>${esc(q.company)}</strong>${q.isNew ? `<span class="sep">·</span><span style="color:var(--blue);font-weight:600">${t('dash.inq.new')}</span>` : ''}
            <div class="muted">${esc(L(p.name))} · ${esc(q.qty)}</div>
            <p class="msg">${esc(L(q.msg))}</p>
          </div>
          <div class="meta">${App.ago(q.hours)}<br><button class="btn btn-outline btn-sm" style="margin-top:8px" data-soon>${t('dash.inq.reply')}</button></div>
        </div>`;
    }).join('');
  }

  function overview() {
    const list = allProducts();
    const stats = [
      [t('dash.stat.views'), '3.482', 18],
      [t('dash.stat.live'), list.filter(p => p.status === 'approved').length, null],
      [t('dash.stat.inq'), INQUIRIES.filter(q => q.isNew).length, 25],
      [t('dash.stat.rate'), '96%', null]
    ];
    return `
      <div class="note-bar">${t('dash.note')}</div>
      <div class="stat-grid">${stats.map(([l, n, d]) => `
        <div class="card stat"><div class="lbl">${l}</div><div class="num">${n}</div>${d ? `<div class="delta">${t('dash.stat.delta', { n: d })}</div>` : ''}</div>`).join('')}
      </div>
      <div class="card card-pad" style="margin-bottom:24px">
        <div style="display:flex;justify-content:space-between"><span class="strong">${t('dash.profileDone')}</span><span class="strong" style="color:var(--blue)">85%</span></div>
        <div class="progress"><div style="width:85%"></div></div>
        <span class="muted">${t('dash.profileTip')}</span>
      </div>
      <div class="card" style="margin-bottom:24px">
        <div class="panel-head"><h3>${t('dash.recentInq')}</h3><a href="#inquiries">${t('c.viewAll')}</a></div>
        ${inquiryList(INQUIRIES.slice(0, 2))}
      </div>
      <div class="card">
        <div class="panel-head"><h3>${t('dash.myProducts')}</h3><a href="#products">${t('c.viewAll')}</a></div>
        ${productTable(list.slice(0, 4))}
      </div>`;
  }

  function langTabs() {
    return `
      <div class="text-tabs">${Object.keys(LANG_NAMES).map(l => `<button type="button" class="text-tab ${formLang === l ? 'active' : ''}" data-flang="${l}">${LANG_NAMES[l]}</button>`).join('')}</div>
      <button type="button" class="btn-link" data-soon>${t('dash.add.translate')}</button>`;
  }

  function addForm() {
    const catOpts = CATEGORIES.map(c => `<optgroup label="${esc(L(c.name))}">${c.children.map(ch => `<option value="${ch.id}">${esc(L(ch.name))}</option>`).join('')}</optgroup>`).join('');
    const certs = ['HACCP', 'ISO 22000', 'BRC', 'FDA', 'Halal', 'Kosher', 'Organic', 'GACC'];
    const f = App.field;
    return `
      <form id="addForm" novalidate>
        <div class="note-bar">${t('dash.add.desc')}</div>
        <div class="card card-pad" style="margin-bottom:20px">
          <h4>${t('dash.add.images')} <span style="color:var(--danger)">*</span></h4>
          <label class="upload-box" id="dropZone">
            <input type="file" id="fileInput" accept="image/*" multiple hidden>
            <strong>+ ${t('dash.add.images')}</strong>
            <p>${t('dash.add.imagesHint')}</p>
          </label>
          <div class="upload-preview" id="previews"></div>
          <p id="imgErr" style="color:var(--danger);display:none;margin:8px 0 0">${t('dash.add.needImg')}</p>
        </div>
        <div class="card card-pad" style="margin-bottom:20px">
          <h4>${t('dash.add.content')}</h4>
          <p class="muted">${t('dash.add.langHint')}</p>
          <div class="lang-tabs" id="langTabs">${langTabs()}</div>
          <div style="display:grid;gap:16px">
            <div class="field" id="nameField"><label>${t('dash.add.name')} (${LANG_NAMES[formLang]}) ${formLang === 'vi' ? '<span class="req">*</span>' : ''}</label><input class="input" id="pName" value="${esc(draft.name[formLang])}"><div class="err"></div></div>
            <div class="field"><label id="descLabel">${t('dash.add.descr')} (${LANG_NAMES[formLang]})</label><textarea id="pDesc">${esc(draft.desc[formLang])}</textarea></div>
          </div>
        </div>
        <div class="card card-pad" style="margin-bottom:20px">
          <h4>${t('dash.add.info')}</h4>
          <div class="form-grid">
            ${f(t('dash.add.category') + ' <span class="req">*</span>', `<select name="cat" required><option value="">${t('dash.add.choose')}</option>${catOpts}</select>`, 'full')}
            ${f(t('dash.add.priceFrom'), `<input class="input" name="pmin" type="number" step="0.01" placeholder="0.80">`)}
            ${f(t('dash.add.priceTo'), `<input class="input" name="pmax" type="number" step="0.01" placeholder="1.10">`)}
            ${f(t('dash.add.unit'), `<input class="input" name="unit" placeholder="${esc(t('dash.add.unitPh'))}">`)}
            ${f(t('dash.add.moq'), `<input class="input" name="moq" placeholder="${esc(t('dash.add.moqPh'))}">`)}
            ${f(t('dash.add.pack'), `<input class="input" name="pack" placeholder="${esc(t('dash.add.packPh'))}">`)}
            ${f(t('dash.add.shelf'), `<input class="input" name="shelf" placeholder="${esc(t('dash.add.shelfPh'))}">`)}
            ${f(t('dash.add.port'), `<input class="input" name="port" placeholder="Cat Lai, HCMC">`, 'full')}
            <div class="full"><span class="field-label">${t('dash.add.certs')}</span>
              <div class="check-grid">${certs.map(c => `<label class="check"><input type="checkbox" name="certs" value="${c}"><span>${c}</span></label>`).join('')}</div></div>
            <label class="check full"><input type="checkbox" name="oem" checked><span>${t('dash.add.oem')}</span></label>
          </div>
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap">
          <button type="button" class="btn btn-outline btn-lg" id="saveDraft">${t('dash.add.draft')}</button>
          <button type="submit" class="btn btn-primary btn-lg">${t('dash.add.submit')}</button>
        </div>
      </form>`;
  }

  function profile() {
    const f = App.field;
    return `
      <div class="card card-pad">
        <p class="muted">${t('dash.profile.desc')}</p>
        <form class="form-grid" id="profileForm" novalidate>
          ${f(t('reg.companyName'), `<input class="input" required value="${esc(me.name)}">`, 'full')}
          ${f(t('reg.tax'), `<input class="input" value="1801234567">`)}
          ${f(t('reg.country'), `<select>${Object.keys(COUNTRIES).map(k => `<option ${k === me.country ? 'selected' : ''}>${esc(L(COUNTRIES[k].name))}</option>`).join('')}</select>`)}
          ${f(t('reg.city'), `<input class="input" value="${esc(L(me.city))}">`)}
          ${f(t('reg.year'), `<input class="input" type="number" value="${me.year}">`)}
          ${f(t('reg.website'), `<input class="input" value="https://mekongfresh.example">`, 'full')}
          ${f(t('reg.about'), `<textarea>${esc(L(me.desc))}</textarea>`, 'full')}
          <div class="full" style="display:flex;gap:12px;justify-content:flex-end">
            <a class="btn btn-outline" href="company.html?id=${me.id}">${t('dash.nav.public')}</a>
            <button class="btn btn-primary" type="submit">${t('dash.profile.save')}</button>
          </div>
        </form>
      </div>`;
  }

  function verify() {
    return `
      <div class="note-bar ok"><span class="strong">${t('c.verified')}</span><span class="sep">·</span>${t('dash.verify.validTo')}<br>${t('dash.verify.desc')}</div>
      <div class="card">
        <div class="table-wrap"><table class="table">
          <tbody>${[1, 2, 3, 4].map(i => `
            <tr><td style="width:100%"><span class="strong">${t('dash.verify.doc' + i)}</span><span class="muted"> · PDF</span></td><td><span class="st-approved">${t('dash.verify.approved')}</span></td></tr>`).join('')}
          </tbody>
        </table></div>
        <div style="padding:18px 20px"><button class="btn btn-outline" data-soon>${t('dash.verify.upload')}</button></div>
      </div>`;
  }

  function panelHtml() {
    switch (panel) {
      case 'products': return `<div class="card">${productTable(allProducts())}</div>`;
      case 'add': return addForm();
      case 'inquiries': return `<div class="card">${inquiryList(INQUIRIES)}</div>`;
      case 'profile': return profile();
      case 'verify': return verify();
      default: return overview();
    }
  }

  function render() {
    const newInq = INQUIRIES.filter(q => q.isNew).length;
    document.getElementById('page').innerHTML = `
      <div class="container dash">
        <aside class="card dash-side">
          <div class="dash-user">${App.logoBox(me)}<div><strong>${esc(me.name)}</strong>${App.verifiedText(me)}</div></div>
          <nav class="dash-nav">
            ${PANELS.map(k => `<a href="#${k}" class="${panel === k ? 'active' : ''}"><span>${t('dash.nav.' + k)}</span>${k === 'inquiries' ? `<span class="count">${newInq}</span>` : ''}</a>`).join('')}
            <a href="company.html?id=${me.id}"><span>${t('dash.nav.public')} ↗</span></a>
          </nav>
        </aside>
        <div style="min-width:0">
          <div class="dash-title">
            <div><span class="muted">${t('dash.hello', { name: 'Nguyễn Văn An' })}</span><h2>${t('dash.nav.' + panel)}</h2></div>
            ${panel !== 'add' ? `<a class="btn btn-teal" href="#add">+ ${t('dash.nav.add')}</a>` : ''}
          </div>
          ${panelHtml()}
        </div>
      </div>`;
    if (panel === 'add') bindAdd();
    document.getElementById('profileForm')?.addEventListener('submit', e => { e.preventDefault(); if (App.validate(e.target)) App.toast(t('toast.saved')); });
  }

  /* ---------- Form đăng sản phẩm ---------- */
  function renderPreviews() {
    const box = document.getElementById('previews');
    box.innerHTML = uploads.map((src, i) => `
      <div class="pv"><img src="${src}" alt="">${i === 0 ? `<span class="main">${t('dash.add.mainImg')}</span>` : ''}<button type="button" data-rm="${i}" aria-label="Remove">×</button></div>`).join('');
    box.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { uploads.splice(+b.dataset.rm, 1); renderPreviews(); }));
  }

  /* Thu nhỏ ảnh về tối đa 480px để lưu gọn trong localStorage */
  function shrink(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const im = new Image();
        im.onload = () => {
          const s = Math.min(1, 480 / Math.max(im.width, im.height));
          const cv = document.createElement('canvas');
          cv.width = Math.round(im.width * s); cv.height = Math.round(im.height * s);
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          resolve(cv.toDataURL('image/jpeg', 0.8));
        };
        im.onerror = () => resolve(null);
        im.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function addFiles(files) {
    for (const file of [...files].filter(f => f.type.startsWith('image/')).slice(0, 8 - uploads.length)) {
      const src = await shrink(file);
      if (src) uploads.push(src);
    }
    document.getElementById('imgErr').style.display = 'none';
    renderPreviews();
  }

  function bindAdd() {
    const form = document.getElementById('addForm');
    const zone = document.getElementById('dropZone');
    const input = document.getElementById('fileInput');
    renderPreviews();
    input.addEventListener('change', () => addFiles(input.files));
    ['dragover', 'dragenter'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag'); }));
    zone.addEventListener('drop', e => addFiles(e.dataTransfer.files));

    const nameIn = document.getElementById('pName');
    const descIn = document.getElementById('pDesc');
    nameIn.addEventListener('input', () => { draft.name[formLang] = nameIn.value; });
    descIn.addEventListener('input', () => { draft.desc[formLang] = descIn.value; });
    document.getElementById('langTabs').addEventListener('click', e => {
      const b = e.target.closest('[data-flang]');
      if (!b) return;
      formLang = b.dataset.flang;
      document.getElementById('langTabs').innerHTML = langTabs();
      document.querySelector('#nameField label').innerHTML = `${t('dash.add.name')} (${LANG_NAMES[formLang]}) ${formLang === 'vi' ? '<span class="req">*</span>' : ''}`;
      document.getElementById('descLabel').textContent = `${t('dash.add.descr')} (${LANG_NAMES[formLang]})`;
      nameIn.value = draft.name[formLang];
      descIn.value = draft.desc[formLang];
      nameIn.focus();
    });

    const build = st => {
      const fd = new FormData(form);
      const price = [fd.get('pmin'), fd.get('pmax')].filter(Boolean).join(' – ');
      return {
        id: 'my-' + Date.now(), name: { ...draft.name }, desc: { ...draft.desc }, img: uploads[0], imgs: uploads.slice(),
        cat: fd.get('cat'), price, status: st, views: 0, updated: new Date().toLocaleDateString('vi-VN')
      };
    };

    const finish = (st, msgKey) => {
      const item = build(st);
      const list = mine();
      list.push(item);
      if (!saveMine(list)) { item.imgs = [item.img]; saveMine(list); }
      App.toast(t(msgKey, { name: L(item.name) }));
      uploads = []; draft = { name: { vi: '', en: '', zh: '' }, desc: { vi: '', en: '', zh: '' } }; formLang = 'vi';
      location.hash = 'products';
    };

    document.getElementById('saveDraft').addEventListener('click', () => {
      if (!draft.name.vi.trim()) { markNameErr(); return; }
      if (!uploads.length) { document.getElementById('imgErr').style.display = 'block'; return; }
      finish('draft', 'dash.add.draftOk');
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = App.validate(form);
      if (!draft.name.vi.trim()) { markNameErr(); ok = false; }
      if (!uploads.length) { document.getElementById('imgErr').style.display = 'block'; ok = false; zone.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      if (ok) finish('pending', 'dash.add.ok');
    });
  }

  function markNameErr() {
    if (formLang !== 'vi') document.querySelector('[data-flang="vi"]').click();
    const f = document.getElementById('nameField');
    f.classList.add('invalid');
    f.querySelector('.err').textContent = t('dash.add.needName');
    f.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  window.addEventListener('hashchange', () => {
    const h = location.hash.slice(1);
    if (PANELS.includes(h)) { panel = h; render(); window.scrollTo({ top: 0 }); }
  });

  App.init({ nav: '', render });
})();
