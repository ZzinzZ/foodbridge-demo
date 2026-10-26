/* Chatbot FAQ (bản demo): trả lời theo bộ câu hỏi soạn sẵn + gợi ý sản phẩm theo từ khóa.
   Bản chính thức có thể nối với AI/LLM và dữ liệu thật của sàn. */
const Chatbot = (() => {
  const UI = {
    fab:      { vi: 'Chat với chúng tôi', en: 'Chat with us', zh: '在线咨询' },
    title:    { vi: 'Trợ lý FoodBridge', en: 'FoodBridge Assistant', zh: 'FoodBridge 助手' },
    status:   { vi: 'Trả lời tự động 24/7', en: 'Automated replies 24/7', zh: '24小时自动回复' },
    hello:    { vi: 'Xin chào! Tôi có thể giúp bạn tìm sản phẩm, nhà cung cấp hoặc hướng dẫn sử dụng sàn. Bạn cần hỗ trợ gì?', en: 'Hello! I can help you find products, suppliers or explain how the platform works. How can I help?', zh: '您好！我可以帮您查找产品、供应商，或介绍平台的使用方法。请问需要什么帮助？' },
    ph:       { vi: 'Nhập câu hỏi hoặc tên sản phẩm…', en: 'Type a question or product name…', zh: '输入问题或产品名称…' },
    send:     { vi: 'Gửi', en: 'Send', zh: '发送' },
    found:    { vi: 'Tôi tìm thấy các sản phẩm phù hợp:', en: 'Here are matching products:', zh: '为您找到以下相关产品：' },
    more:     { vi: 'Xem tất cả kết quả', en: 'See all results', zh: '查看全部结果' },
    fallback: { vi: 'Tôi chưa hiểu rõ câu hỏi. Bạn có thể chọn một chủ đề bên dưới, hoặc để lại email để nhân viên hỗ trợ liên hệ.', en: 'I\'m not sure I understood. Pick a topic below, or leave your email and our staff will contact you.', zh: '抱歉，我没有完全理解。您可以选择下方的主题，或留下邮箱，客服会与您联系。' },
    close:    { vi: 'Đóng', en: 'Close', zh: '关闭' }
  };

  /* Bộ câu hỏi thường gặp. `k`: từ khóa (không dấu, chữ thường) cho cả 3 ngôn ngữ */
  const FAQ = [
    {
      q: { vi: 'Làm sao để đăng ký doanh nghiệp?', en: 'How do I register my business?', zh: '如何注册企业？' },
      k: ['dang ky', 'tao tai khoan', 'register', 'sign up', 'account', '注册', '账户'],
      a: {
        vi: 'Bấm <a href="register.html">Đăng ký doanh nghiệp</a>, chọn loại hình (xuất nhập khẩu, logistics, tư vấn hoặc bảo hiểm), điền thông tin công ty và tài khoản. Chỉ mất khoảng 3 phút.',
        en: 'Click <a href="register.html">Register business</a>, choose your type (importer/exporter, logistics, consulting or insurance), then fill in company and account details. It takes about 3 minutes.',
        zh: '点击<a href="register.html">企业注册</a>，选择企业类型（进出口商、物流、咨询或保险），填写公司和账户信息即可，约需3分钟。'
      }
    },
    {
      q: { vi: 'Làm sao để được xác minh doanh nghiệp?', en: 'How do I get verified?', zh: '如何获得企业认证？' },
      k: ['xac minh', 'verified', 'verify', 'giay phep', 'licence', 'license', '认证', '营业执照'],
      a: {
        vi: 'Sau khi đăng ký, vào <a href="dashboard.html#verify">Xác minh doanh nghiệp</a> và tải lên giấy phép kinh doanh, chứng nhận chất lượng, ảnh nhà máy. Quản trị viên duyệt trong 1–2 ngày làm việc, sau đó hồ sơ hiển thị "Đã xác minh".',
        en: 'After registering, open <a href="dashboard.html#verify">Verification</a> and upload your business licence, quality certificates and factory photos. Admins review within 1–2 business days, then your profile shows "Verified".',
        zh: '注册后进入<a href="dashboard.html#verify">企业认证</a>，上传营业执照、质量证书和工厂照片。管理员将在1–2个工作日内审核，通过后主页显示"已认证"。'
      }
    },
    {
      q: { vi: 'Làm sao để đăng sản phẩm?', en: 'How do I post a product?', zh: '如何发布产品？' },
      k: ['dang san pham', 'dang ban', 'post', 'upload', 'listing', '发布', '上传'],
      a: {
        vi: 'Vào <a href="dashboard.html#add">Đăng sản phẩm mới</a>, tải ảnh của bạn, nhập tên và mô tả bằng tiếng Việt (có thể thêm tiếng Anh, tiếng Trung), điền MOQ, quy cách, chứng nhận rồi gửi duyệt.',
        en: 'Go to <a href="dashboard.html#add">Post new product</a>, upload your images, enter the name and description (Vietnamese, English, Chinese), add MOQ, packaging and certificates, then submit for review.',
        zh: '进入<a href="dashboard.html#add">发布新产品</a>，上传图片，填写名称和描述（越南语、英语、中文），补充起订量、包装和认证后提交审核。'
      }
    },
    {
      q: { vi: 'Tìm nhà cung cấp như thế nào?', en: 'How do I find suppliers?', zh: '如何寻找供应商？' },
      k: ['nha cung cap', 'tim nguon', 'supplier', 'source', 'sourcing', '供应商', '货源'],
      a: {
        vi: 'Dùng ô tìm kiếm hoặc vào <a href="products.html?view=suppliers">Nhà cung cấp</a>, lọc theo ngành hàng, quốc gia và chứng nhận. Bấm "Liên hệ" hoặc "Gửi yêu cầu báo giá" để trao đổi trực tiếp.',
        en: 'Use the search bar or open <a href="products.html?view=suppliers">Suppliers</a>, then filter by category, country and certification. Click "Contact" or "Request a quote" to talk directly.',
        zh: '使用搜索框或进入<a href="products.html?view=suppliers">供应商</a>，按品类、国家和认证筛选，点击"联系"或"发送询价"即可直接沟通。'
      }
    },
    {
      q: { vi: 'Tìm đơn vị vận chuyển, bảo hiểm?', en: 'Find shipping or insurance?', zh: '寻找物流或保险？' },
      k: ['van chuyen', 'logistics', 'shipping', 'freight', 'bao hiem', 'insurance', 'tu van', 'consult', '物流', '运输', '保险', '咨询'],
      a: {
        vi: 'Xem mục <a href="services.html?tab=logistics">Logistics</a>, <a href="services.html?tab=consulting">Tư vấn</a> và <a href="services.html?tab=insurance">Bảo hiểm</a>. Trên mỗi trang sản phẩm cũng có gợi ý đối tác phù hợp với lô hàng.',
        en: 'See <a href="services.html?tab=logistics">Logistics</a>, <a href="services.html?tab=consulting">Consulting</a> and <a href="services.html?tab=insurance">Insurance</a>. Each product page also suggests matching partners for the shipment.',
        zh: '请查看<a href="services.html?tab=logistics">物流</a>、<a href="services.html?tab=consulting">咨询</a>和<a href="services.html?tab=insurance">保险</a>。每个产品页面也会推荐适合该批货物的合作伙伴。'
      }
    },
    {
      q: { vi: 'Phí tham gia sàn là bao nhiêu?', en: 'How much does it cost?', zh: '平台收费吗？' },
      k: ['phi', 'gia goi', 'goi thanh vien', 'bang gia', 'chi phi', 'thanh toan', 'fee', 'pricing', 'plans', 'cost', 'membership', 'payment', '费用', '收费', '会员', '套餐', '支付'],
      a: {
        vi: 'Đăng ký và đăng tối đa 10 sản phẩm miễn phí. Gói Tiêu chuẩn và Cao cấp có thêm tin đăng, ưu tiên hiển thị và quyền xem liên hệ đối tác, thanh toán online theo năm. Xem chi tiết tại <a href="pricing.html">Gói thành viên</a>.',
        en: 'Registration and up to 10 listings are free. Standard and Premium add more listings, priority placement and partner contact details, paid online yearly. See <a href="pricing.html">Membership plans</a>.',
        zh: '注册及发布最多10个产品免费。标准版和高级版提供更多发布数量、优先展示和合作伙伴联系方式查看，按年在线支付。详见<a href="pricing.html">会员套餐</a>。'
      }
    },
    {
      q: { vi: 'Sàn hỗ trợ những ngôn ngữ nào?', en: 'Which languages are supported?', zh: '支持哪些语言？' },
      k: ['ngon ngu', 'tieng', 'language', 'chinese', 'english', '语言', '中文', '英文'],
      a: {
        vi: 'Sàn hỗ trợ tiếng Việt, tiếng Anh và tiếng Trung. Đổi ngôn ngữ ở góc trên bên phải.',
        en: 'The platform supports Vietnamese, English and Chinese. Switch language at the top right.',
        zh: '平台支持越南语、英语和中文，可在右上角切换语言。'
      }
    }
  ];

  const L = o => App.L(o);
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  let mounted = false;

  function bubble(html, who = 'bot') {
    const body = document.getElementById('chatBody');
    const el = document.createElement('div');
    el.className = who === 'bot' ? 'msg-bot' : 'msg-user';
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function quickReplies() {
    const body = document.getElementById('chatBody');
    const box = document.createElement('div');
    box.className = 'quick';
    box.innerHTML = FAQ.slice(0, 5).map((f, i) => `<button type="button" data-faq="${i}">${App.esc(L(f.q))}</button>`).join('');
    body.appendChild(box);
    body.scrollTop = body.scrollHeight;
  }

  /* Tìm câu trả lời: ưu tiên FAQ, sau đó tìm sản phẩm theo tên/danh mục */
  function answer(text) {
    const q = norm(text);
    const faq = FAQ.find(f => f.k.some(k => q.includes(k)));
    if (faq) return L(faq.a);

    const words = q.split(/\s+/).filter(w => w.length > 1);
    const hits = PRODUCTS.filter(p => {
      const hay = norm(Object.values(p.name).join(' ') + ' ' + Object.values(App.cat(p.cat).name).join(' '));
      return words.length && (hay.includes(q) || words.filter(w => hay.includes(w)).length >= Math.min(2, words.length));
    }).slice(0, 3);
    if (hits.length) {
      return `${L(UI.found)}<ul>${hits.map(p => `<li><a href="product.html?id=${p.id}">${App.esc(L(p.name))}</a></li>`).join('')}</ul>
        <a href="products.html?q=${encodeURIComponent(text)}">${L(UI.more)} →</a>`;
    }
    return null;
  }

  function ask(text, fromFaq) {
    bubble(App.esc(text), 'user');
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.textContent = '…';
    document.getElementById('chatBody').appendChild(typing);
    setTimeout(() => {
      typing.remove();
      const a = fromFaq != null ? L(FAQ[fromFaq].a) : answer(text);
      if (a) bubble(a);
      else { bubble(L(UI.fallback)); quickReplies(); }
    }, 500);
  }

  function render() {
    let root = document.getElementById('chatRoot');
    if (!root) { root = document.createElement('div'); root.id = 'chatRoot'; document.body.appendChild(root); }
    root.innerHTML = `
      <button class="chat-fab" type="button" id="chatFab"><i class="bi bi-chat-dots-fill"></i><span class="lbl">${L(UI.fab)}</span></button>
      <section class="chat-panel" aria-label="${App.esc(L(UI.title))}">
        <div class="chat-head">
          <div><strong>${L(UI.title)}</strong><span>${L(UI.status)}</span></div>
          <button type="button" id="chatClose" aria-label="${L(UI.close)}">×</button>
        </div>
        <div class="chat-body" id="chatBody"></div>
        <form class="chat-input" id="chatForm">
          <input id="chatInput" autocomplete="off" placeholder="${App.esc(L(UI.ph))}">
          <button type="submit">${L(UI.send)}</button>
        </form>
      </section>`;

    bubble(L(UI.hello));
    quickReplies();

    root.querySelector('#chatFab').addEventListener('click', () => {
      document.body.classList.add('chat-open');
      setTimeout(() => document.getElementById('chatInput').focus(), 50);
    });
    root.querySelector('#chatClose').addEventListener('click', () => document.body.classList.remove('chat-open'));
    root.querySelector('#chatForm').addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('chatInput');
      const v = input.value.trim();
      if (!v) return;
      input.value = '';
      ask(v);
    });
    root.querySelector('#chatBody').addEventListener('click', e => {
      const b = e.target.closest('[data-faq]');
      if (b) ask(b.textContent, +b.dataset.faq);
    });
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    render();
    App.onLang(render);   // đổi ngôn ngữ thì làm mới hội thoại theo ngôn ngữ mới
  }

  return { mount };
})();
