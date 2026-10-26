/* Chuyển động toàn site: chuyển trang, hiện dần khi cuộn, skeleton ảnh, nút lên đầu trang, tải trước trang.
   Nạp sau app.js và trước script của từng trang để bắt được lần render đầu tiên. */
const Motion = (() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Các khối hiện dần khi cuộn tới (không gồm bộ lọc, header: những phần render lại liên tục) */
  const REVEAL = [
    '.section-head', '.three-col > .card', '.role-card', '.cat-feature', '.cat-block .s-card', '.p-card',
    '.prov-card', '.step', '.market-stage', '.market-list .country-card', '.cta-band', '.supplier-row',
    '.pd-main', '.pd-grid .side-box', '.co-card', '.co-layout > *', '.svc-intro', '.reg-card',
    '.dash-main > *', '.stat', '.footer-grid > *', '.plan-card', '.compare-wrap', '.faq'
  ].join(',');

  let instant = false;   // render lại do đổi ngôn ngữ: hiện ngay, không chạy lại hiệu ứng

  /* ---------- Hiện dần khi cuộn ---------- */
  const io = 'IntersectionObserver' in window && !reduce
    ? new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;

  function done(el) {
    el.classList.remove('reveal', 'in');
    el.style.removeProperty('--rd');
  }

  function markReveal() {
    document.querySelectorAll(REVEAL).forEach(el => {
      if (el.dataset.rv) return;
      el.dataset.rv = '1';
      if (!io || instant || el.classList.contains('skel-card')) return;
      const peers = [...el.parentElement.children].filter(c => c.matches(REVEAL));
      el.style.setProperty('--rd', `${Math.min(peers.indexOf(el), 6) * 70}ms`);
      el.classList.add('reveal');
      el.addEventListener('transitionend', ev => { if (ev.propertyName === 'opacity') done(el); }, { once: false });
      io.observe(el);
    });
  }

  /* ---------- Skeleton ảnh: shimmer cho tới khi ảnh tải xong rồi hiện dần ---------- */
  function markImages(scope) {
    scope.querySelectorAll('img:not([data-sk]):not(.flag):not(.big-flag)').forEach(img => {
      img.dataset.sk = '1';
      if (img.complete && img.naturalWidth) return;
      img.classList.add('img-pending');
      img.addEventListener('load', () => { img.classList.remove('img-pending'); img.classList.add('img-loaded'); }, { once: true });
      img.addEventListener('error', () => { img.classList.remove('img-pending'); img.classList.add('img-error'); }, { once: true });
    });
  }

  let queued = false;
  const scan = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; markImages(document); markReveal(); instant = false; });
  };
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });

  /* ---------- Chuyển trang ----------
     Trình duyệt hỗ trợ View Transitions giữa các trang (Chrome, Edge, Safari 18.2+): CSS @view-transition lo.
     Còn lại: làm mờ nội dung trước khi rời trang (lớp .fade-nav đặt sẵn trong <head>). */
  const crossDocVT = 'onpagereveal' in window;
  const internal = a => {
    if (!a || a.target || a.hasAttribute('download') || a.hasAttribute('data-soon')) return null;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return null;
    if (url.pathname === location.pathname && url.search === location.search) return null;   // chỉ đổi #hash
    return url;
  };

  document.addEventListener('click', e => {
    if (crossDocVT || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    const url = internal(a);
    if (!url) return;
    e.preventDefault();
    root.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, 180);
  });
  addEventListener('pageshow', e => { if (e.persisted) root.classList.remove('is-leaving'); });

  /* ---------- Tải trước trang khi rê chuột vào link ---------- */
  if (HTMLScriptElement.supports?.('speculationrules')) {
    const s = document.createElement('script');
    s.type = 'speculationrules';
    s.textContent = JSON.stringify({ prerender: [{ source: 'document', where: { and: [{ href_matches: '/*' }, { not: { selector_matches: '[data-soon]' } }] }, eagerness: 'moderate' }] });
    document.head.appendChild(s);
  } else {
    const seen = new Set();
    document.addEventListener('pointerover', e => {
      const url = internal(e.target.closest?.('a[href]'));
      if (!url || seen.has(url.pathname)) return;
      seen.add(url.pathname);
      const l = document.createElement('link');
      l.rel = 'prefetch';
      l.href = url.pathname;
      document.head.appendChild(l);
    });
  }

  /* ---------- Nút lên đầu trang + vòng tiến độ cuộn ---------- */
  function mountToTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top';
    btn.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="ring-track" cx="24" cy="24" r="21"/><circle class="ring-bar" cx="24" cy="24" r="21" pathLength="100" transform="rotate(-90 24 24)"/><path class="ring-arrow" d="M17 27l7-7 7 7"/></svg>`;
    const label = () => btn.setAttribute('aria-label', App.t('c.toTop'));
    label();
    App.onLang(label);
    btn.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    document.body.appendChild(btn);

    const bar = btn.querySelector('.ring-bar');
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      bar.style.strokeDashoffset = String(100 - p * 100);
      btn.classList.toggle('show', scrollY > 480);
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    mountToTop();
    App.onLang(() => { instant = true; });
  });

  /* Bản đồ thị trường: dừng chấm chạy trên tuyến khi người dùng muốn giảm chuyển động */
  if (reduce) document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('svg.routes').forEach(s => s.pauseAnimations?.()));

  /* Skeleton tạm cho vùng kết quả trong lúc "tải" dữ liệu (danh sách sản phẩm, dịch vụ) */
  const skeletonCards = (n, kind = 'product') => Array.from({ length: n }, () => kind === 'provider'
    ? `<div class="prov-card skel-card" aria-hidden="true"><div class="cover skel"></div><div class="body"><span class="skel line w70"></span><span class="skel line w40"></span><span class="skel line w90"></span><span class="skel line w60"></span></div></div>`
    : kind === 'row'
      ? `<div class="card card-pad skel-card skel-row" aria-hidden="true"><span class="skel skel-logo"></span><div><span class="skel line w40"></span><span class="skel line w70"></span><span class="skel line w90"></span></div></div>`
      : `<div class="p-card skel-card" aria-hidden="true"><div class="img skel"></div><div class="body"><span class="skel line w90"></span><span class="skel line w50"></span><span class="skel line w60"></span><span class="skel line w70"></span></div></div>`).join('');

  return { skeletonCards, get reduce() { return reduce; } };
})();
