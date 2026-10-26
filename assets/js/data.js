/* Dữ liệu mẫu cho bản demo — toàn bộ là dữ liệu minh họa.
   Ảnh: Unsplash (miễn phí). Trong hệ thống thật, doanh nghiệp tự đăng ảnh của mình. */

const COUNTRIES = {
  VN: { code: 'vn', name: { vi: 'Việt Nam', en: 'Vietnam', zh: '越南' } },
  CN: { code: 'cn', name: { vi: 'Trung Quốc', en: 'China', zh: '中国' } },
  AU: { code: 'au', name: { vi: 'Úc', en: 'Australia', zh: '澳大利亚' } }
};

const ROLES = {
  exporter:   { img: 'photo-1551884170-09fb70a3a2ed',        name: { vi: 'Nhà xuất nhập khẩu', en: 'Importer / Exporter', zh: '进出口商' } },
  logistics:  { img: 'photo-1605745341112-85968b19335b',           name: { vi: 'Logistics',          en: 'Logistics',           zh: '物流' } },
  consulting: { img: 'photo-1517048676732-d65bc937f952',       name: { vi: 'Tư vấn',             en: 'Consulting',          zh: '咨询' } },
  insurance:  { img: 'photo-1450101499163-c8848c66ca85',    name: { vi: 'Bảo hiểm',           en: 'Insurance',           zh: '保险' } }
};

const CATEGORIES = [
  {
    id: 'beverage', icon: 'bi-cup-straw',
    name: { vi: 'Đồ uống', en: 'Beverages', zh: '饮料' },
    img: 'photo-1550234699-2ebb2d96dfa7',
    desc: {
      vi: 'Nước ép, rượu vang, cà phê, trà và nước giải khát từ Việt Nam, Trung Quốc và Úc.',
      en: 'Juices, wine, coffee, tea and soft drinks from Vietnam, China and Australia.',
      zh: '来自越南、中国和澳大利亚的果汁、葡萄酒、咖啡、茶和软饮料。'
    },
    children: [
      { id: 'juice',     name: { vi: 'Nước ép trái cây', en: 'Fruit juices', zh: '果汁' } },
      { id: 'wine',      name: { vi: 'Rượu vang',        en: 'Wine',         zh: '葡萄酒' } },
      { id: 'coffee-tea',name: { vi: 'Cà phê & Trà',     en: 'Coffee & Tea', zh: '咖啡与茶' } },
      { id: 'softdrink', name: { vi: 'Nước giải khát',   en: 'Soft drinks',  zh: '软饮料' } }
    ]
  },
  {
    id: 'food', icon: 'bi-basket2',
    name: { vi: 'Thực phẩm', en: 'Food', zh: '食品' },
    img: 'photo-1710857397974-f0617001c39e',
    desc: {
      vi: 'Snack, trái cây sấy, các loại hạt, gạo, thực phẩm khô và thủy sản đông lạnh.',
      en: 'Snacks, dried fruit, nuts, rice, dry food and frozen seafood.',
      zh: '零食、果干、坚果、大米、干货及冷冻海鲜。'
    },
    children: [
      { id: 'snack',      name: { vi: 'Snack & bánh kẹo',     en: 'Snacks & confectionery', zh: '零食与糖果' } },
      { id: 'dried-fruit',name: { vi: 'Trái cây sấy',         en: 'Dried fruit',            zh: '果干' } },
      { id: 'nuts',       name: { vi: 'Các loại hạt',         en: 'Nuts',                   zh: '坚果' } },
      { id: 'rice',       name: { vi: 'Gạo & ngũ cốc',        en: 'Rice & grains',          zh: '大米与谷物' } },
      { id: 'dry-food',   name: { vi: 'Mì & thực phẩm khô',   en: 'Noodles & dry food',     zh: '面条与干货' } },
      { id: 'seafood',    name: { vi: 'Thủy sản đông lạnh',   en: 'Frozen seafood',         zh: '冷冻海鲜' } },
      { id: 'honey',      name: { vi: 'Mật ong & đặc sản',    en: 'Honey & specialties',    zh: '蜂蜜与特产' } }
    ]
  }
];

const COMPANIES = [
  /* ---------- Nhà xuất nhập khẩu ---------- */
  {
    id: 'mekong-fresh', role: 'exporter', country: 'VN', verified: true, color: '#f08a24', initials: 'MF',
    name: 'Mekong Fresh Beverage JSC',
    city: { vi: 'Cần Thơ', en: 'Can Tho', zh: '芹苴' },
    cover: 'photo-1537191072641-5e19cc173c6a', year: 2009, staff: '200–500', revenue: 'USD 10–20M', response: '< 12h',
    markets: ['AU', 'CN'], certs: ['HACCP', 'ISO 22000', 'FDA', 'Halal'],
    desc: {
      vi: 'Nhà sản xuất nước ép trái cây và nước dừa đóng chai tại Đồng bằng sông Cửu Long. Vùng nguyên liệu 1.200 ha, dây chuyền chiết rót vô trùng, xuất khẩu đi 14 thị trường, nhận gia công OEM/ODM nhãn riêng.',
      en: 'Producer of bottled fruit juices and coconut water in the Mekong Delta. 1,200 ha of raw material area, aseptic filling lines, exporting to 14 markets, OEM/ODM private label available.',
      zh: '位于湄公河三角洲的瓶装果汁和椰子水生产商。拥有1,200公顷原料基地和无菌灌装线，出口14个市场，可提供OEM/ODM贴牌服务。'
    }
  },
  {
    id: 'saigon-crispy', role: 'exporter', country: 'VN', verified: true, color: '#d6455d', initials: 'SC',
    name: 'Saigon Crispy Foods Co., Ltd',
    city: { vi: 'TP. Hồ Chí Minh', en: 'Ho Chi Minh City', zh: '胡志明市' },
    cover: 'photo-1551884170-09fb70a3a2ed', year: 2014, staff: '100–200', revenue: 'USD 5–10M', response: '< 24h',
    markets: ['CN', 'AU'], certs: ['HACCP', 'BRC', 'ISO 22000'],
    desc: {
      vi: 'Chuyên sản xuất snack khoai tây, chuối sấy giòn và các loại snack từ nông sản Việt Nam. Công suất 30 tấn/tháng, đóng gói theo yêu cầu thị trường Trung Quốc và Úc.',
      en: 'Manufacturer of potato chips, banana chips and snacks made from Vietnamese produce. Capacity 30 tons/month, packaging customised for the Chinese and Australian markets.',
      zh: '专业生产薯片、香蕉脆片及越南农产品零食。月产能30吨，可按中国和澳大利亚市场要求定制包装。'
    }
  },
  {
    id: 'dalat-harvest', role: 'exporter', country: 'VN', verified: true, color: '#7a4fd8', initials: 'DH',
    name: 'Dalat Harvest Dried Fruits',
    city: { vi: 'Lâm Đồng', en: 'Lam Dong', zh: '林同省' },
    cover: 'photo-1641291361624-38b69b86b1cf', year: 2016, staff: '50–100', revenue: 'USD 2–5M', response: '< 24h',
    markets: ['AU', 'CN'], certs: ['HACCP', 'USDA Organic', 'ISO 22000'],
    desc: {
      vi: 'Sản xuất trái cây sấy dẻo và sấy lạnh không đường: xoài, mít, chuối, dâu tây Đà Lạt. Có chứng nhận hữu cơ, nhận đóng gói nhãn riêng cho nhà nhập khẩu.',
      en: 'Producer of soft-dried and freeze-dried fruit with no added sugar: mango, jackfruit, banana and Dalat strawberries. Organic certified, private label packing for importers.',
      zh: '生产无添加糖的软果干和冻干水果：芒果、菠萝蜜、香蕉和大叻草莓。拥有有机认证，可为进口商提供贴牌包装。'
    }
  },
  {
    id: 'binhphuoc-cashew', role: 'exporter', country: 'VN', verified: true, color: '#b07a2a', initials: 'BC',
    name: 'Binh Phuoc Golden Cashew JSC',
    city: { vi: 'Bình Phước', en: 'Binh Phuoc', zh: '平福省' },
    cover: 'photo-1723466998040-78d7e2ef6d72', year: 2005, staff: '500+', revenue: 'USD 20–50M', response: '< 12h',
    markets: ['CN', 'AU'], certs: ['BRC', 'HACCP', 'Kosher'],
    desc: {
      vi: 'Nhà chế biến hạt điều nhân xuất khẩu hàng đầu Bình Phước. Cung cấp W180, W240, W320, WS, LP; đóng thùng carton hút chân không 22,68 kg.',
      en: 'Leading cashew kernel processor in Binh Phuoc. Supplying W180, W240, W320, WS and LP grades in 22.68 kg vacuum-packed cartons.',
      zh: '平福省领先的腰果仁加工出口商。供应W180、W240、W320、WS、LP等级，22.68公斤真空纸箱包装。'
    }
  },
  {
    id: 'highland-coffee', role: 'exporter', country: 'VN', verified: true, color: '#5b3a29', initials: 'TN',
    name: 'Tay Nguyen Highland Coffee Export',
    city: { vi: 'Đắk Lắk', en: 'Dak Lak', zh: '多乐省' },
    cover: 'photo-1447933601403-0c6688de566e', year: 2011, staff: '100–200', revenue: 'USD 10–20M', response: '< 24h',
    markets: ['CN', 'AU'], certs: ['Rainforest Alliance', '4C', 'ISO 9001'],
    desc: {
      vi: 'Thu mua, sơ chế và xuất khẩu cà phê Robusta nhân xanh và rang xay từ vùng Buôn Ma Thuột. Cung cấp S16, S18, hàng chế biến ướt và honey.',
      en: 'Sourcing, processing and exporting green and roasted Robusta from Buon Ma Thuot. Grades S16, S18, wet-polished and honey process.',
      zh: '在邦美蜀地区收购、加工并出口罗布斯塔生豆及烘焙咖啡。供应S16、S18、湿法抛光及蜜处理咖啡。'
    }
  },
  {
    id: 'mekong-rice', role: 'exporter', country: 'VN', verified: false, color: '#3f8f3a', initials: 'MR',
    name: 'Mekong Delta Rice Corp.',
    city: { vi: 'Sóc Trăng', en: 'Soc Trang', zh: '朔庄' },
    cover: 'photo-1728895604559-a4e16081504e', year: 2018, staff: '50–100', revenue: 'USD 5–10M', response: '< 48h',
    markets: ['CN'], certs: ['ISO 22000'],
    desc: {
      vi: 'Doanh nghiệp xay xát và xuất khẩu gạo thơm ST24, ST25, Jasmine. Đang hoàn thiện hồ sơ xác minh trên sàn.',
      en: 'Milling and exporting fragrant rice ST24, ST25 and Jasmine. Verification documents are being completed on the platform.',
      zh: '碾磨并出口ST24、ST25及茉莉香米。平台认证资料正在完善中。'
    }
  },
  {
    id: 'camau-seafood', role: 'exporter', country: 'VN', verified: true, color: '#1d8fb8', initials: 'CM',
    name: 'Ca Mau Ocean Seafood',
    city: { vi: 'Cà Mau', en: 'Ca Mau', zh: '金瓯' },
    cover: 'photo-1779517935494-2fa87fd7178c', year: 2007, staff: '500+', revenue: 'USD 20–50M', response: '< 12h',
    markets: ['CN', 'AU'], certs: ['BAP', 'ASC', 'HACCP', 'GACC'],
    desc: {
      vi: 'Chế biến tôm sú, tôm thẻ đông lạnh xuất khẩu. Nhà máy đã đăng ký GACC (Trung Quốc), đáp ứng yêu cầu kiểm dịch của Úc.',
      en: 'Processor of frozen black tiger and whiteleg shrimp for export. GACC-registered plant (China), compliant with Australian biosecurity requirements.',
      zh: '加工出口冷冻黑虎虾和白虾。工厂已在中国海关总署（GACC）注册，符合澳大利亚检疫要求。'
    }
  },
  {
    id: 'shandong-orchard', role: 'exporter', country: 'CN', verified: true, color: '#c0392b', initials: 'SO',
    name: 'Shandong Orchard Juice Co., Ltd',
    city: { vi: 'Yên Đài, Sơn Đông', en: 'Yantai, Shandong', zh: '山东烟台' },
    cover: 'photo-1716834092653-bf887f1f29d6', year: 2003, staff: '500+', revenue: 'USD 50M+', response: '< 12h',
    markets: ['VN', 'AU'], certs: ['ISO 22000', 'FSSC 22000', 'Kosher', 'Halal'],
    desc: {
      vi: 'Nhà sản xuất nước táo cô đặc và nước ép táo NFC tại Yên Đài – vùng táo lớn nhất Trung Quốc. Cung cấp phuy vô trùng 220L và chai bán lẻ.',
      en: 'Producer of apple juice concentrate and NFC apple juice in Yantai, China\'s largest apple region. Supplied in 220L aseptic drums and retail bottles.',
      zh: '位于中国最大苹果产区烟台的浓缩苹果汁及NFC苹果汁生产商。提供220升无菌桶装和零售瓶装。'
    }
  },
  {
    id: 'fujian-mingshan', role: 'exporter', country: 'CN', verified: true, color: '#2e7d5b', initials: 'FM',
    name: 'Fujian Mingshan Tea & Foods',
    city: { vi: 'Phúc Châu, Phúc Kiến', en: 'Fuzhou, Fujian', zh: '福建福州' },
    cover: 'photo-1766185387603-f03cb6d658fa', year: 2010, staff: '200–500', revenue: 'USD 10–20M', response: '< 24h',
    markets: ['VN', 'AU'], certs: ['ISO 22000', 'HACCP', 'EU Organic'],
    desc: {
      vi: 'Sản xuất trà ô long, trà xanh và mì ăn liền xuất khẩu. Có kho ngoại quan tại Hạ Môn, giao hàng nhanh sang Việt Nam và Úc.',
      en: 'Producer of oolong tea, green tea and instant noodles for export. Bonded warehouse in Xiamen for fast delivery to Vietnam and Australia.',
      zh: '生产乌龙茶、绿茶及方便面出口。在厦门设有保税仓，可快速发货至越南和澳大利亚。'
    }
  },
  {
    id: 'barossa-ridge', role: 'exporter', country: 'AU', verified: true, color: '#7b1e3a', initials: 'BR',
    name: 'Barossa Ridge Wines Pty Ltd',
    city: { vi: 'Nam Úc', en: 'South Australia', zh: '南澳大利亚州' },
    cover: 'photo-1563514227147-6d2ff665a6a0', year: 1998, staff: '50–100', revenue: 'USD 10–20M', response: '< 24h',
    markets: ['VN', 'CN'], certs: ['Sustainable Winegrowing AU', 'ISO 9001'],
    desc: {
      vi: 'Nhà vang gia đình tại thung lũng Barossa, nổi tiếng với Shiraz và Chardonnay. Đang tìm nhà nhập khẩu, nhà phân phối độc quyền tại Việt Nam và Trung Quốc.',
      en: 'Family winery in the Barossa Valley, known for Shiraz and Chardonnay. Seeking importers and exclusive distributors in Vietnam and China.',
      zh: '巴罗萨谷家族酒庄，以西拉和霞多丽闻名。正在寻找越南和中国的进口商及独家经销商。'
    }
  },
  {
    id: 'qld-nut-honey', role: 'exporter', country: 'AU', verified: true, color: '#c98a12', initials: 'QN',
    name: 'Queensland Nut & Honey Co.',
    city: { vi: 'Bundaberg, Queensland', en: 'Bundaberg, Queensland', zh: '昆士兰州班达伯格' },
    cover: 'photo-1622852492653-39aae5ddf429', year: 2001, staff: '100–200', revenue: 'USD 10–20M', response: '< 24h',
    markets: ['VN', 'CN'], certs: ['HACCP', 'SQF', 'Australian Certified Organic'],
    desc: {
      vi: 'Trồng và chế biến hạt mắc ca, mật ong nguyên chất Úc. Hàng có chứng nhận hữu cơ, truy xuất nguồn gốc theo từng lô.',
      en: 'Grower and processor of macadamia nuts and pure Australian honey. Organic certified with batch-level traceability.',
      zh: '种植并加工澳洲坚果和纯正澳大利亚蜂蜜。拥有有机认证，可按批次溯源。'
    }
  },

  /* ---------- Logistics ---------- */
  {
    id: 'vietlink-cold', role: 'logistics', country: 'VN', verified: true, color: '#1244b9', initials: 'VL',
    name: 'VietLink Cold Chain Logistics',
    city: { vi: 'TP. Hồ Chí Minh', en: 'Ho Chi Minh City', zh: '胡志明市' },
    cover: 'photo-1605745341112-85968b19335b', year: 2012, staff: '200–500', response: '< 4h',
    certs: ['FIATA', 'VLA', 'ISO 9001'],
    routes: ['VN → AU', 'VN → CN'],
    tags: { vi: ['FCL / LCL', 'Container lạnh', 'Thủ tục hải quan', 'Hun trùng'], en: ['FCL / LCL', 'Reefer container', 'Customs clearance', 'Fumigation'], zh: ['整箱/拼箱', '冷藏集装箱', '报关', '熏蒸'] },
    desc: {
      vi: 'Vận chuyển đường biển hàng thực phẩm, đặc biệt container lạnh tuyến Cát Lái – Sydney/Melbourne và Hải Phòng – Thượng Hải. Trọn gói thủ tục hải quan, kiểm dịch.',
      en: 'Ocean freight for food cargo, specialising in reefer containers on Cat Lai – Sydney/Melbourne and Hai Phong – Shanghai lanes. Full customs and quarantine handling.',
      zh: '食品海运，专注于吉莱—悉尼/墨尔本及海防—上海航线的冷藏集装箱。提供一站式报关和检疫服务。'
    },
    services: [
      { icon: 'bi-water', name: { vi: 'Vận tải biển FCL/LCL', en: 'Ocean freight FCL/LCL', zh: '海运整箱/拼箱' }, desc: { vi: 'Lịch tàu hàng tuần đi Sydney, Melbourne, Thượng Hải, Ninh Ba.', en: 'Weekly sailings to Sydney, Melbourne, Shanghai and Ningbo.', zh: '每周有船期发往悉尼、墨尔本、上海和宁波。' } },
      { icon: 'bi-snow', name: { vi: 'Container lạnh (Reefer)', en: 'Reefer containers', zh: '冷藏集装箱' }, desc: { vi: 'Kiểm soát nhiệt độ -25°C đến +25°C, theo dõi nhiệt độ thời gian thực.', en: 'Temperature control from -25°C to +25°C with real-time monitoring.', zh: '温度控制范围-25°C至+25°C，实时监控。' } },
      { icon: 'bi-file-earmark-check', name: { vi: 'Thủ tục hải quan & C/O', en: 'Customs & C/O', zh: '报关与原产地证' }, desc: { vi: 'Khai báo hải quan, xin C/O form E, AANZ, kiểm dịch thực vật.', en: 'Customs declaration, C/O form E and AANZ, phytosanitary certificates.', zh: '报关、办理E表和AANZ原产地证、植物检疫证书。' } }
    ]
  },
  {
    id: 'pacific-bridge', role: 'logistics', country: 'CN', verified: true, color: '#0b8c84', initials: 'PB',
    name: 'Pacific Bridge Freight (Shenzhen)',
    city: { vi: 'Thâm Quyến', en: 'Shenzhen', zh: '深圳' },
    cover: 'photo-1436491865332-7a61a109cc05', year: 2008, staff: '200–500', response: '< 6h',
    certs: ['FIATA', 'IATA', 'WCA'],
    routes: ['CN → VN', 'CN → AU'],
    tags: { vi: ['Hàng không', 'Đường bộ biên giới', 'Kho ngoại quan'], en: ['Air freight', 'Cross-border trucking', 'Bonded warehouse'], zh: ['空运', '跨境陆运', '保税仓'] },
    desc: {
      vi: 'Vận chuyển hàng không và đường bộ xuyên biên giới Trung Quốc – Việt Nam qua cửa khẩu Hữu Nghị, Móng Cái. Kho ngoại quan tại Thâm Quyến và Bằng Tường.',
      en: 'Air freight and cross-border trucking between China and Vietnam via Huu Nghi and Mong Cai border gates. Bonded warehouses in Shenzhen and Pingxiang.',
      zh: '提供中越之间经友谊关、芒街口岸的空运和跨境陆运服务。在深圳和凭祥设有保税仓。'
    },
    services: [
      { icon: 'bi-airplane', name: { vi: 'Vận tải hàng không', en: 'Air freight', zh: '空运' }, desc: { vi: 'Hàng mẫu, hàng tươi cần giao gấp đi Hà Nội, TP.HCM, Sydney.', en: 'Samples and urgent fresh cargo to Hanoi, HCMC and Sydney.', zh: '样品及紧急生鲜货物发往河内、胡志明市、悉尼。' } },
      { icon: 'bi-truck', name: { vi: 'Đường bộ Trung – Việt', en: 'China–Vietnam trucking', zh: '中越陆运' }, desc: { vi: 'Xe lạnh qua cửa khẩu, thông quan 2 đầu.', en: 'Refrigerated trucks across the border, clearance on both sides.', zh: '冷藏车跨境运输，两端清关。' } },
      { icon: 'bi-building', name: { vi: 'Kho ngoại quan', en: 'Bonded warehousing', zh: '保税仓储' }, desc: { vi: 'Lưu kho, dán nhãn phụ tiếng Trung, gom hàng.', en: 'Storage, Chinese back-labelling and consolidation.', zh: '仓储、中文背标粘贴、集货。' } }
    ]
  },
  {
    id: 'southern-cross', role: 'logistics', country: 'AU', verified: true, color: '#e0662a', initials: 'SX',
    name: 'Southern Cross Freight Pty',
    city: { vi: 'Sydney', en: 'Sydney', zh: '悉尼' },
    cover: 'photo-1601467995997-ac1ae9a8fff4', year: 2006, staff: '100–200', response: '< 8h',
    certs: ['CBFCA', 'AEO Trusted Trader'],
    routes: ['VN → AU', 'CN → AU', 'AU → VN'],
    tags: { vi: ['Thông quan nhập khẩu Úc', 'Kiểm dịch (Biosecurity)', 'Giao hàng nội địa'], en: ['AU import clearance', 'Biosecurity', 'Domestic delivery'], zh: ['澳洲进口清关', '生物安全检疫', '国内配送'] },
    desc: {
      vi: 'Đại lý hải quan và vận chuyển tại Úc: thông quan nhập khẩu, xử lý kiểm dịch Biosecurity cho thực phẩm, giao hàng đến kho nhà phân phối.',
      en: 'Customs broker and freight forwarder in Australia: import clearance, biosecurity handling for food and delivery to distributor warehouses.',
      zh: '澳大利亚报关行和货代：进口清关、食品生物安全检疫处理及配送至经销商仓库。'
    },
    services: [
      { icon: 'bi-clipboard-check', name: { vi: 'Thông quan nhập khẩu', en: 'Import clearance', zh: '进口清关' }, desc: { vi: 'Khai báo ICS, tính thuế GST, xin giấy phép BICON.', en: 'ICS declarations, GST calculation and BICON permits.', zh: 'ICS申报、GST税计算及BICON许可。' } },
      { icon: 'bi-bug', name: { vi: 'Kiểm dịch Biosecurity', en: 'Biosecurity inspection', zh: '生物安全检疫' }, desc: { vi: 'Đặt lịch kiểm tra, xử lý hàng bị giữ.', en: 'Inspection booking and handling of held cargo.', zh: '预约查验、处理被扣货物。' } },
      { icon: 'bi-geo-alt', name: { vi: 'Giao hàng nội địa', en: 'Domestic delivery', zh: '国内配送' }, desc: { vi: 'Xe lạnh giao toàn bang NSW, VIC, QLD.', en: 'Refrigerated delivery across NSW, VIC and QLD.', zh: '冷藏车配送覆盖新州、维州、昆州。' } }
    ]
  },

  /* ---------- Tư vấn ---------- */
  {
    id: 'vinatrade-advisory', role: 'consulting', country: 'VN', verified: true, color: '#6b4fd8', initials: 'VA',
    name: 'VinaTrade Advisory',
    city: { vi: 'Hà Nội', en: 'Hanoi', zh: '河内' },
    cover: 'photo-1517048676732-d65bc937f952', year: 2015, staff: '20–50', response: '< 24h',
    certs: ['VCCI Member'],
    tags: { vi: ['Thủ tục XNK', 'Công bố thực phẩm', 'Nghiên cứu thị trường'], en: ['Import/export procedures', 'Food registration', 'Market research'], zh: ['进出口手续', '食品备案', '市场调研'] },
    desc: {
      vi: 'Tư vấn thủ tục xuất nhập khẩu thực phẩm, công bố sản phẩm, xin giấy phép nhập khẩu rượu và nghiên cứu thị trường Trung Quốc, Úc cho doanh nghiệp Việt.',
      en: 'Advisory on food import/export procedures, product registration, wine import licences and market research on China and Australia for Vietnamese companies.',
      zh: '为越南企业提供食品进出口手续、产品备案、葡萄酒进口许可及中澳市场调研咨询。'
    },
    services: [
      { icon: 'bi-journal-check', name: { vi: 'Công bố & đăng ký sản phẩm', en: 'Product registration', zh: '产品备案注册' }, desc: { vi: 'Hồ sơ công bố thực phẩm nhập khẩu tại Việt Nam.', en: 'Imported food registration dossiers in Vietnam.', zh: '越南进口食品备案资料。' } },
      { icon: 'bi-graph-up', name: { vi: 'Nghiên cứu thị trường', en: 'Market research', zh: '市场调研' }, desc: { vi: 'Báo cáo giá, đối thủ, kênh phân phối theo ngành hàng.', en: 'Price, competitor and channel reports by category.', zh: '按品类提供价格、竞品和渠道报告。' } },
      { icon: 'bi-people', name: { vi: 'Kết nối nhà phân phối', en: 'Distributor matching', zh: '经销商对接' }, desc: { vi: 'Sắp xếp gặp gỡ, khảo sát đối tác tại Việt Nam.', en: 'Arranging meetings and partner checks in Vietnam.', zh: '在越南安排会面并核查合作伙伴。' } }
    ]
  },
  {
    id: 'sinogate', role: 'consulting', country: 'CN', verified: true, color: '#b3261e', initials: 'SG',
    name: 'SinoGate Market Entry Consulting',
    city: { vi: 'Thượng Hải', en: 'Shanghai', zh: '上海' },
    cover: 'photo-1758691737543-09a1b2b715fa', year: 2013, staff: '20–50', response: '< 24h',
    certs: ['AmCham Member'],
    tags: { vi: ['Đăng ký GACC', 'Nhãn tiếng Trung', 'Gia nhập thị trường TQ'], en: ['GACC registration', 'Chinese labelling', 'China market entry'], zh: ['海关总署注册', '中文标签', '进入中国市场'] },
    desc: {
      vi: 'Hỗ trợ doanh nghiệp nước ngoài đăng ký nhà máy với GACC, thiết kế nhãn tiếng Trung đúng quy định và tìm nhà phân phối tại Trung Quốc.',
      en: 'Helps foreign companies register facilities with GACC, design compliant Chinese labels and find distributors in China.',
      zh: '协助外国企业完成海关总署工厂注册、设计合规中文标签并寻找中国经销商。'
    },
    services: [
      { icon: 'bi-building-check', name: { vi: 'Đăng ký GACC', en: 'GACC registration', zh: '海关总署注册' }, desc: { vi: 'Đăng ký cơ sở sản xuất thực phẩm xuất khẩu vào Trung Quốc.', en: 'Registration of overseas food facilities exporting to China.', zh: '境外输华食品生产企业注册。' } },
      { icon: 'bi-tag', name: { vi: 'Nhãn tiếng Trung', en: 'Chinese labelling', zh: '中文标签' }, desc: { vi: 'Rà soát và thiết kế nhãn theo GB 7718.', en: 'Label review and design under GB 7718.', zh: '按GB 7718审核并设计标签。' } },
      { icon: 'bi-shop', name: { vi: 'Tìm nhà phân phối', en: 'Distributor search', zh: '寻找经销商' }, desc: { vi: 'Kết nối nhà phân phối, sàn TMĐT, chuỗi siêu thị.', en: 'Connecting with distributors, e-commerce and retail chains.', zh: '对接经销商、电商平台和连锁超市。' } }
    ]
  },
  {
    id: 'ausfood-compliance', role: 'consulting', country: 'AU', verified: true, color: '#0f6e8c', initials: 'AF',
    name: 'AusFood Compliance Partners',
    city: { vi: 'Melbourne', en: 'Melbourne', zh: '墨尔本' },
    cover: 'photo-1606836591695-4d58a73eba1e', year: 2012, staff: '10–20', response: '< 24h',
    certs: ['AIFST Member'],
    tags: { vi: ['Nhãn FSANZ', 'Giấy phép BICON', 'Gia nhập thị trường Úc'], en: ['FSANZ labelling', 'BICON permits', 'Australia market entry'], zh: ['FSANZ标签', 'BICON许可', '进入澳洲市场'] },
    desc: {
      vi: 'Tư vấn tuân thủ thực phẩm nhập khẩu vào Úc: nhãn FSANZ, giấy phép nhập khẩu BICON, kiểm tra Imported Food Inspection Scheme.',
      en: 'Compliance advice for food imported into Australia: FSANZ labelling, BICON import permits and the Imported Food Inspection Scheme.',
      zh: '为进口至澳大利亚的食品提供合规咨询：FSANZ标签、BICON进口许可及进口食品检验计划。'
    },
    services: [
      { icon: 'bi-card-checklist', name: { vi: 'Rà soát nhãn FSANZ', en: 'FSANZ label review', zh: 'FSANZ标签审核' }, desc: { vi: 'Đảm bảo nhãn, thành phần, dinh dưỡng đúng chuẩn Úc.', en: 'Ensuring labels, ingredients and nutrition panels meet AU standards.', zh: '确保标签、配料及营养成分表符合澳洲标准。' } },
      { icon: 'bi-shield-lock', name: { vi: 'Giấy phép nhập khẩu', en: 'Import permits', zh: '进口许可' }, desc: { vi: 'Hồ sơ BICON cho hạt, trái cây sấy, thủy sản.', en: 'BICON applications for nuts, dried fruit and seafood.', zh: '坚果、果干和海鲜的BICON申请。' } },
      { icon: 'bi-compass', name: { vi: 'Chiến lược gia nhập', en: 'Market entry strategy', zh: '市场进入策略' }, desc: { vi: 'Định giá, kênh bán lẻ Coles, Woolworths, chợ châu Á.', en: 'Pricing, retail channels such as Coles, Woolworths and Asian grocers.', zh: '定价及Coles、Woolworths和亚洲超市等零售渠道。' } }
    ]
  },

  /* ---------- Bảo hiểm ---------- */
  {
    id: 'saigon-marine', role: 'insurance', country: 'VN', verified: true, color: '#0a3a85', initials: 'SM',
    name: 'Saigon Marine Cargo Insurance',
    city: { vi: 'TP. Hồ Chí Minh', en: 'Ho Chi Minh City', zh: '胡志明市' },
    cover: 'photo-1494412519320-aa613dfb7738', year: 2004, staff: '200–500', response: '< 4h',
    certs: ['IAV Member'],
    tags: { vi: ['Bảo hiểm hàng hóa', 'ICC A/B/C', 'Hàng lạnh'], en: ['Cargo insurance', 'ICC A/B/C', 'Reefer cargo'], zh: ['货物保险', 'ICC A/B/C条款', '冷藏货物'] },
    desc: {
      vi: 'Bảo hiểm hàng hóa xuất nhập khẩu đường biển, hàng không, đường bộ. Có gói riêng cho hàng thực phẩm đông lạnh, rủi ro hỏng máy lạnh container.',
      en: 'Marine, air and road cargo insurance for imports and exports. Dedicated cover for frozen food and reefer machinery breakdown.',
      zh: '为进出口海运、空运和陆运货物提供保险。针对冷冻食品及冷藏箱机械故障提供专项保障。'
    },
    services: [
      { icon: 'bi-shield-check', name: { vi: 'Bảo hiểm hàng hóa ICC', en: 'ICC cargo cover', zh: 'ICC货物保险' }, desc: { vi: 'Điều kiện A, B, C theo từng lô hoặc hợp đồng bao.', en: 'Clauses A, B, C per shipment or open cover.', zh: 'A、B、C条款，按单票或预约保险。' } },
      { icon: 'bi-thermometer-snow', name: { vi: 'Rủi ro hàng lạnh', en: 'Reefer risk cover', zh: '冷藏风险保障' }, desc: { vi: 'Bồi thường hư hỏng do sự cố nhiệt độ.', en: 'Compensation for temperature-related spoilage.', zh: '赔偿温度故障导致的货损。' } },
      { icon: 'bi-lightning', name: { vi: 'Cấp đơn trong ngày', en: 'Same-day policy', zh: '当日出单' }, desc: { vi: 'Cấp chứng thư bảo hiểm điện tử cho bộ chứng từ CIF.', en: 'Electronic insurance certificates for CIF documents.', zh: '为CIF单据出具电子保险凭证。' } }
    ]
  },
  {
    id: 'dragon-gate', role: 'insurance', country: 'CN', verified: true, color: '#a8201a', initials: 'DG',
    name: 'Dragon Gate Cargo Insurance',
    city: { vi: 'Quảng Châu', en: 'Guangzhou', zh: '广州' },
    cover: 'photo-1562892302-97faedd66f1c', year: 2009, staff: '100–200', response: '< 6h',
    certs: ['CIRC Licensed'],
    tags: { vi: ['Bảo hiểm CIF', 'Đường bộ biên giới', 'Giám định tổn thất'], en: ['CIF insurance', 'Cross-border road', 'Loss survey'], zh: ['CIF保险', '跨境陆运', '损失查勘'] },
    desc: {
      vi: 'Bảo hiểm hàng hóa cho doanh nghiệp xuất khẩu từ Trung Quốc, đặc biệt tuyến đường bộ sang Việt Nam. Mạng lưới giám định tổn thất tại cửa khẩu.',
      en: 'Cargo insurance for exporters in China, especially overland to Vietnam. Loss survey network at border gates.',
      zh: '为中国出口企业提供货物保险，尤其是发往越南的陆运线路。在口岸设有损失查勘网络。'
    },
    services: [
      { icon: 'bi-file-earmark-text', name: { vi: 'Chứng thư CIF', en: 'CIF certificates', zh: 'CIF保险凭证' }, desc: { vi: 'Cấp chứng thư bảo hiểm cho L/C.', en: 'Insurance certificates for L/C.', zh: '为信用证出具保险凭证。' } },
      { icon: 'bi-truck', name: { vi: 'Bảo hiểm đường bộ', en: 'Road cargo cover', zh: '陆运货物保险' }, desc: { vi: 'Tuyến Bằng Tường – Lạng Sơn, Đông Hưng – Móng Cái.', en: 'Pingxiang – Lang Son and Dongxing – Mong Cai lanes.', zh: '凭祥—谅山、东兴—芒街线路。' } },
      { icon: 'bi-search', name: { vi: 'Giám định tổn thất', en: 'Loss survey', zh: '损失查勘' }, desc: { vi: 'Giám định viên có mặt trong 24h.', en: 'Surveyor on site within 24h.', zh: '查勘员24小时内到场。' } }
    ]
  },
  {
    id: 'harbour-shield', role: 'insurance', country: 'AU', verified: true, color: '#155e75', initials: 'HS',
    name: 'Harbour Shield Trade Insurance',
    city: { vi: 'Brisbane', en: 'Brisbane', zh: '布里斯班' },
    cover: 'photo-1450101499163-c8848c66ca85', year: 2010, staff: '50–100', response: '< 8h',
    certs: ['APRA Regulated'],
    tags: { vi: ['Bảo hiểm tín dụng thương mại', 'Trách nhiệm sản phẩm', 'Hàng hóa'], en: ['Trade credit insurance', 'Product liability', 'Cargo'], zh: ['贸易信用保险', '产品责任险', '货物险'] },
    desc: {
      vi: 'Bảo hiểm tín dụng thương mại (rủi ro người mua không thanh toán), bảo hiểm trách nhiệm sản phẩm thực phẩm khi bán tại Úc.',
      en: 'Trade credit insurance (buyer non-payment risk) and food product liability insurance for sales in Australia.',
      zh: '提供贸易信用保险（买方拒付风险）及在澳销售食品的产品责任险。'
    },
    services: [
      { icon: 'bi-cash-coin', name: { vi: 'Tín dụng thương mại', en: 'Trade credit', zh: '贸易信用' }, desc: { vi: 'Bảo vệ khoản phải thu khi bán trả chậm.', en: 'Protects receivables on credit terms.', zh: '保障赊销应收账款。' } },
      { icon: 'bi-clipboard2-pulse', name: { vi: 'Trách nhiệm sản phẩm', en: 'Product liability', zh: '产品责任' }, desc: { vi: 'Bắt buộc với nhiều chuỗi bán lẻ tại Úc.', en: 'Required by many Australian retail chains.', zh: '澳洲多家零售连锁的必备要求。' } },
      { icon: 'bi-arrow-repeat', name: { vi: 'Thu hồi sản phẩm', en: 'Product recall', zh: '产品召回' }, desc: { vi: 'Chi phí thu hồi và xử lý khủng hoảng.', en: 'Recall costs and crisis management.', zh: '召回费用及危机处理。' } }
    ]
  }
];

const PRODUCTS = [
  {
    id: 'orange-juice-nfc', company: 'mekong-fresh', cat: 'juice', featured: true, isNew: true,
    imgs: ['photo-1550234699-2ebb2d96dfa7', 'photo-1621506289937-a8e4df240d0b', 'photo-1587015990127-424b954e38b5'],
    name: { vi: 'Nước ép cam nguyên chất NFC 1L', en: 'NFC Pure Orange Juice 1L', zh: 'NFC纯橙汁 1升' },
    price: '0.85 – 1.10', unit: { vi: 'chai', en: 'bottle', zh: '瓶' },
    moq: { vi: '1 container 20ft (≈ 16.000 chai)', en: '1 x 20ft container (≈ 16,000 bottles)', zh: '1个20尺柜（约16,000瓶）' },
    pack: { vi: 'Chai PET 1L, 12 chai/thùng', en: '1L PET bottle, 12 bottles/carton', zh: '1升PET瓶，每箱12瓶' },
    shelf: { vi: '12 tháng', en: '12 months', zh: '12个月' },
    storage: { vi: 'Nơi khô mát, tránh ánh nắng', en: 'Cool, dry place away from sunlight', zh: '阴凉干燥处，避免阳光直射' },
    port: 'Cat Lai, HCMC', certs: ['HACCP', 'ISO 22000', 'FDA'], oem: true, capacity: { vi: '40 container/tháng', en: '40 containers/month', zh: '每月40柜' },
    desc: {
      vi: 'Nước ép cam 100% ép trực tiếp (Not From Concentrate) từ cam sành và cam xoàn miền Tây, không đường, không chất bảo quản. Thanh trùng nhanh nhiệt độ cao (HTST) giữ hương vị tự nhiên. Nhận in nhãn riêng và tùy chỉnh dung tích 250ml – 1L.',
      en: '100% Not From Concentrate orange juice from Mekong Delta oranges, no added sugar or preservatives. High-temperature short-time pasteurisation preserves the natural taste. Private label and custom sizes from 250ml to 1L available.',
      zh: '100%非浓缩还原橙汁，选用湄公河三角洲柑橙，无添加糖和防腐剂。采用高温短时巴氏杀菌，保留天然风味。可提供贴牌及250毫升至1升定制规格。'
    }
  },
  {
    id: 'coconut-water', company: 'mekong-fresh', cat: 'softdrink', featured: true,
    imgs: ['photo-1537191072641-5e19cc173c6a', 'photo-1761576882205-ac0ec9df45c2'],
    name: { vi: 'Nước dừa xiêm Bến Tre đóng hộp 330ml', en: 'Ben Tre Coconut Water 330ml Can', zh: '槟椥椰子水 330毫升罐装' },
    price: '0.38 – 0.45', unit: { vi: 'lon', en: 'can', zh: '罐' },
    moq: { vi: '1 container 20ft', en: '1 x 20ft container', zh: '1个20尺柜' },
    pack: { vi: 'Lon nhôm 330ml, 24 lon/thùng', en: '330ml aluminium can, 24 cans/carton', zh: '330毫升铝罐，每箱24罐' },
    shelf: { vi: '18 tháng', en: '18 months', zh: '18个月' },
    storage: { vi: 'Nhiệt độ thường', en: 'Ambient temperature', zh: '常温' },
    port: 'Cat Lai, HCMC', certs: ['HACCP', 'Halal'], oem: true, capacity: { vi: '25 container/tháng', en: '25 containers/month', zh: '每月25柜' },
    desc: {
      vi: 'Nước dừa xiêm xanh Bến Tre nguyên chất, vị ngọt thanh tự nhiên, giàu điện giải. Phù hợp kênh siêu thị và cửa hàng tiện lợi tại Úc, Trung Quốc.',
      en: 'Pure green coconut water from Ben Tre with a naturally light sweetness, rich in electrolytes. Suited to supermarkets and convenience stores in Australia and China.',
      zh: '槟椥青椰纯椰子水，天然清甜，富含电解质。适合澳大利亚和中国的超市及便利店渠道。'
    }
  },
  {
    id: 'apple-juice-concentrate', company: 'shandong-orchard', cat: 'juice', featured: true,
    imgs: ['photo-1600434610853-fcf8e079731b', 'photo-1727989815707-1b9e8f376775', 'photo-1716834092653-bf887f1f29d6'],
    name: { vi: 'Nước táo cô đặc 70° Brix', en: 'Apple Juice Concentrate 70° Brix', zh: '浓缩苹果汁 70°白利度' },
    price: '1,150 – 1,300', unit: { vi: 'tấn', en: 'ton', zh: '吨' },
    moq: { vi: '20 tấn', en: '20 tons', zh: '20吨' },
    pack: { vi: 'Phuy vô trùng 220L (≈ 270 kg)', en: '220L aseptic drum (≈ 270 kg)', zh: '220升无菌桶（约270公斤）' },
    shelf: { vi: '24 tháng (bảo quản lạnh)', en: '24 months (chilled)', zh: '24个月（冷藏）' },
    storage: { vi: '0 – 5°C', en: '0 – 5°C', zh: '0 – 5°C' },
    port: 'Qingdao / Yantai', certs: ['FSSC 22000', 'Kosher', 'Halal'], oem: false, capacity: { vi: '3.000 tấn/tháng', en: '3,000 tons/month', zh: '每月3,000吨' },
    desc: {
      vi: 'Nước táo cô đặc trong (clear) 70° Brix từ táo Phú Sĩ Yên Đài, dùng làm nguyên liệu cho nhà máy nước giải khát, sữa chua, bánh kẹo. Có COA từng lô.',
      en: 'Clear apple juice concentrate at 70° Brix from Yantai Fuji apples, used as an ingredient for beverage, yoghurt and confectionery plants. COA provided per batch.',
      zh: '采用烟台富士苹果制成的70°白利度清汁浓缩苹果汁，可作为饮料、酸奶和糖果工厂原料。每批提供COA。'
    }
  },
  {
    id: 'barossa-shiraz', company: 'barossa-ridge', cat: 'wine', featured: true, isNew: true,
    imgs: ['photo-1592808171698-49a9d3990d59', 'photo-1554230561-b04b0394d4ef', 'photo-1563514227147-6d2ff665a6a0'],
    name: { vi: 'Rượu vang đỏ Barossa Shiraz 2022', en: 'Barossa Shiraz Red Wine 2022', zh: '巴罗萨西拉红葡萄酒 2022' },
    price: '6.50 – 9.00', unit: { vi: 'chai', en: 'bottle', zh: '瓶' },
    moq: { vi: '1 pallet (600 chai)', en: '1 pallet (600 bottles)', zh: '1托盘（600瓶）' },
    pack: { vi: 'Chai 750ml, 6 chai/thùng', en: '750ml bottle, 6 bottles/carton', zh: '750毫升瓶，每箱6瓶' },
    shelf: { vi: 'Không giới hạn (bảo quản đúng cách)', en: 'No expiry (if stored properly)', zh: '无保质期（妥善储存）' },
    storage: { vi: '12 – 16°C, nằm ngang', en: '12 – 16°C, stored horizontally', zh: '12 – 16°C，卧放' },
    port: 'Adelaide', certs: ['Sustainable Winegrowing AU'], oem: false, capacity: { vi: '50.000 chai/năm', en: '50,000 bottles/year', zh: '每年50,000瓶' },
    desc: {
      vi: 'Shiraz đậm đà từ vườn nho 40 năm tuổi ở thung lũng Barossa, ủ 14 tháng trong thùng gỗ sồi Pháp. Nồng độ 14,5%. Tìm nhà phân phối độc quyền tại Việt Nam và Trung Quốc.',
      en: 'Full-bodied Shiraz from 40-year-old Barossa Valley vines, aged 14 months in French oak. 14.5% ABV. Seeking exclusive distributors in Vietnam and China.',
      zh: '来自巴罗萨谷40年树龄葡萄园的浓郁西拉，在法国橡木桶中陈酿14个月。酒精度14.5%。寻找越南和中国独家经销商。'
    }
  },
  {
    id: 'barossa-chardonnay', company: 'barossa-ridge', cat: 'wine',
    imgs: ['photo-1647879223616-38e66866f129', 'photo-1504279577054-acfeccf8fc52'],
    name: { vi: 'Rượu vang trắng Chardonnay 2023', en: 'Chardonnay White Wine 2023', zh: '霞多丽白葡萄酒 2023' },
    price: '5.80 – 7.50', unit: { vi: 'chai', en: 'bottle', zh: '瓶' },
    moq: { vi: '1 pallet (600 chai)', en: '1 pallet (600 bottles)', zh: '1托盘（600瓶）' },
    pack: { vi: 'Chai 750ml, 6 chai/thùng', en: '750ml bottle, 6 bottles/carton', zh: '750毫升瓶，每箱6瓶' },
    shelf: { vi: 'Không giới hạn (bảo quản đúng cách)', en: 'No expiry (if stored properly)', zh: '无保质期（妥善储存）' },
    storage: { vi: '10 – 14°C', en: '10 – 14°C', zh: '10 – 14°C' },
    port: 'Adelaide', certs: ['Sustainable Winegrowing AU'], oem: false, capacity: { vi: '30.000 chai/năm', en: '30,000 bottles/year', zh: '每年30,000瓶' },
    desc: {
      vi: 'Chardonnay tươi mát, hương đào và cam chanh, phù hợp ẩm thực châu Á. Nồng độ 13%.',
      en: 'Fresh Chardonnay with peach and citrus notes, pairs well with Asian cuisine. 13% ABV.',
      zh: '清新的霞多丽，带有桃子和柑橘香气，适合搭配亚洲美食。酒精度13%。'
    }
  },
  {
    id: 'robusta-s18', company: 'highland-coffee', cat: 'coffee-tea', featured: true,
    imgs: ['photo-1447933601403-0c6688de566e', 'photo-1773894480003-955c58ddf4af'],
    name: { vi: 'Cà phê Robusta nhân xanh S18', en: 'Green Robusta Coffee Beans S18', zh: '罗布斯塔咖啡生豆 S18' },
    price: '4,200 – 4,600', unit: { vi: 'tấn', en: 'ton', zh: '吨' },
    moq: { vi: '19,2 tấn (1 container 20ft)', en: '19.2 tons (1 x 20ft container)', zh: '19.2吨（1个20尺柜）' },
    pack: { vi: 'Bao đay 60 kg', en: '60 kg jute bags', zh: '60公斤麻袋' },
    shelf: { vi: '12 tháng', en: '12 months', zh: '12个月' },
    storage: { vi: 'Kho khô, độ ẩm < 12,5%', en: 'Dry warehouse, moisture < 12.5%', zh: '干燥仓库，含水率<12.5%' },
    port: 'Cat Lai, HCMC', certs: ['Rainforest Alliance', '4C'], oem: false, capacity: { vi: '500 tấn/tháng', en: '500 tons/month', zh: '每月500吨' },
    desc: {
      vi: 'Robusta sàng 18, độ ẩm tối đa 12,5%, tạp chất tối đa 0,1%, hạt đen vỡ tối đa 2%. Hàng mùa vụ 2025/26 từ Buôn Ma Thuột.',
      en: 'Robusta screen 18, max moisture 12.5%, max foreign matter 0.1%, max black & broken 2%. 2025/26 crop from Buon Ma Thuot.',
      zh: '18目罗布斯塔，最大含水率12.5%，杂质≤0.1%，黑豆碎豆≤2%。2025/26产季，产自邦美蜀。'
    }
  },
  {
    id: 'oolong-tea', company: 'fujian-mingshan', cat: 'coffee-tea',
    imgs: ['photo-1777188001652-6dbc3703f457', 'photo-1571934811356-5cc061b6821f'],
    name: { vi: 'Trà ô long Thiết Quan Âm', en: 'Tieguanyin Oolong Tea', zh: '铁观音乌龙茶' },
    price: '18 – 35', unit: { vi: 'kg', en: 'kg', zh: '公斤' },
    moq: { vi: '200 kg', en: '200 kg', zh: '200公斤' },
    pack: { vi: 'Túi hút chân không 250g / thùng 20 kg', en: '250g vacuum bags / 20 kg cartons', zh: '250克真空袋 / 20公斤箱' },
    shelf: { vi: '24 tháng', en: '24 months', zh: '24个月' },
    storage: { vi: 'Nơi khô ráo, kín khí', en: 'Dry, airtight storage', zh: '干燥密封保存' },
    port: 'Xiamen', certs: ['EU Organic', 'ISO 22000'], oem: true, capacity: { vi: '20 tấn/tháng', en: '20 tons/month', zh: '每月20吨' },
    desc: {
      vi: 'Trà ô long Thiết Quan Âm An Khê, hương lan tự nhiên, nhiều cấp độ rang. Có thể đóng túi lọc hoặc hộp quà nhãn riêng.',
      en: 'Anxi Tieguanyin oolong with natural orchid aroma, available in several roast levels. Tea bags or private label gift boxes available.',
      zh: '安溪铁观音乌龙茶，天然兰花香，多种烘焙程度可选。可提供袋泡茶或贴牌礼盒。'
    }
  },
  {
    id: 'potato-chips', company: 'saigon-crispy', cat: 'snack', featured: true, isNew: true,
    imgs: ['photo-1760997707695-f0b5527e5de9', 'photo-1783332488482-8df54e4fc24c'],
    name: { vi: 'Snack khoai tây vị muối biển 60g', en: 'Sea Salt Potato Chips 60g', zh: '海盐薯片 60克' },
    price: '0.32 – 0.40', unit: { vi: 'gói', en: 'pack', zh: '包' },
    moq: { vi: '500 thùng', en: '500 cartons', zh: '500箱' },
    pack: { vi: 'Gói 60g, 40 gói/thùng', en: '60g pack, 40 packs/carton', zh: '60克/包，每箱40包' },
    shelf: { vi: '9 tháng', en: '9 months', zh: '9个月' },
    storage: { vi: 'Nơi khô mát', en: 'Cool, dry place', zh: '阴凉干燥处' },
    port: 'Cat Lai, HCMC', certs: ['HACCP', 'BRC'], oem: true, capacity: { vi: '30 tấn/tháng', en: '30 tons/month', zh: '每月30吨' },
    desc: {
      vi: 'Snack khoai tây cắt lát mỏng, chiên dầu hướng dương, vị muối biển. Nhận phát triển hương vị riêng (rong biển, phô mai, cay Tứ Xuyên) cho thị trường Trung Quốc.',
      en: 'Thin-cut potato chips fried in sunflower oil with sea salt. Custom flavours (seaweed, cheese, Sichuan spicy) can be developed for the Chinese market.',
      zh: '薄切薯片，葵花籽油炸制，海盐口味。可为中国市场开发定制口味（海苔、芝士、川味麻辣）。'
    }
  },
  {
    id: 'mixed-dried-fruit', company: 'dalat-harvest', cat: 'dried-fruit', featured: true,
    imgs: ['photo-1710857397974-f0617001c39e', 'photo-1641291361624-38b69b86b1cf'],
    name: { vi: 'Trái cây sấy dẻo thập cẩm không đường', en: 'Mixed Soft-Dried Fruit, No Added Sugar', zh: '无添加糖综合软果干' },
    price: '6.20 – 7.80', unit: { vi: 'kg', en: 'kg', zh: '公斤' },
    moq: { vi: '1 tấn', en: '1 ton', zh: '1吨' },
    pack: { vi: 'Túi zip 200g hoặc thùng 10 kg', en: '200g zip bags or 10 kg cartons', zh: '200克自封袋或10公斤箱' },
    shelf: { vi: '12 tháng', en: '12 months', zh: '12个月' },
    storage: { vi: 'Nơi khô mát', en: 'Cool, dry place', zh: '阴凉干燥处' },
    port: 'Cat Lai, HCMC', certs: ['USDA Organic', 'HACCP'], oem: true, capacity: { vi: '15 tấn/tháng', en: '15 tons/month', zh: '每月15吨' },
    desc: {
      vi: 'Hỗn hợp xoài, mít, chuối, khoai lang và dâu tây sấy dẻo, không thêm đường, không chất bảo quản. Phù hợp kênh siêu thị và cửa hàng thực phẩm lành mạnh.',
      en: 'A mix of soft-dried mango, jackfruit, banana, sweet potato and strawberry with no added sugar or preservatives. Suited to supermarkets and health food stores.',
      zh: '芒果、菠萝蜜、香蕉、红薯和草莓软果干混合装，无添加糖和防腐剂。适合超市和健康食品店。'
    }
  },
  {
    id: 'cashew-w320', company: 'binhphuoc-cashew', cat: 'nuts', featured: true,
    imgs: ['photo-1726771517475-e7acdd34cd8a', 'photo-1723466998040-78d7e2ef6d72'],
    name: { vi: 'Hạt điều nhân trắng W320', en: 'White Whole Cashew Kernels W320', zh: '白色整粒腰果仁 W320' },
    price: '6,400 – 6,900', unit: { vi: 'tấn', en: 'ton', zh: '吨' },
    moq: { vi: '15,87 tấn (1 container 20ft)', en: '15.87 tons (1 x 20ft container)', zh: '15.87吨（1个20尺柜）' },
    pack: { vi: 'Thùng carton 22,68 kg (50 lbs), hút chân không', en: '22.68 kg (50 lbs) vacuum-packed cartons', zh: '22.68公斤（50磅）真空纸箱' },
    shelf: { vi: '12 tháng', en: '12 months', zh: '12个月' },
    storage: { vi: 'Kho mát, tránh ẩm', en: 'Cool storage, keep dry', zh: '阴凉防潮' },
    port: 'Cat Lai, HCMC', certs: ['BRC', 'Kosher', 'HACCP'], oem: false, capacity: { vi: '800 tấn/tháng', en: '800 tons/month', zh: '每月800吨' },
    desc: {
      vi: 'Hạt điều nhân trắng nguyên hạt cỡ W320 (300–320 hạt/pound), độ ẩm tối đa 5%. Kiểm tra aflatoxin từng lô, hỗ trợ kiểm định SGS khi giao hàng.',
      en: 'Whole white cashew kernels grade W320 (300–320 kernels/lb), max moisture 5%. Aflatoxin tested per batch, SGS inspection available on shipment.',
      zh: 'W320等级白色整粒腰果仁（每磅300–320粒），最大含水率5%。每批检测黄曲霉毒素，出货可安排SGS检验。'
    }
  },
  {
    id: 'macadamia-inshell', company: 'qld-nut-honey', cat: 'nuts', isNew: true,
    imgs: ['photo-1620620769486-e9b698c949f6', 'photo-1622852492653-39aae5ddf429'],
    name: { vi: 'Hạt mắc ca Úc nứt vỏ sấy chín', en: 'Australian Roasted Cracked Macadamia', zh: '澳洲开口烘烤夏威夷果' },
    price: '11.50 – 13.00', unit: { vi: 'kg', en: 'kg', zh: '公斤' },
    moq: { vi: '2 tấn', en: '2 tons', zh: '2吨' },
    pack: { vi: 'Bao 25 kg hoặc túi bán lẻ 500g', en: '25 kg bags or 500g retail bags', zh: '25公斤袋或500克零售袋' },
    shelf: { vi: '12 tháng', en: '12 months', zh: '12个月' },
    storage: { vi: 'Nơi khô mát', en: 'Cool, dry place', zh: '阴凉干燥处' },
    port: 'Brisbane', certs: ['SQF', 'Australian Certified Organic'], oem: true, capacity: { vi: '100 tấn/tháng', en: '100 tons/month', zh: '每月100吨' },
    desc: {
      vi: 'Mắc ca Queensland cỡ hạt 22–25 mm, nứt vỏ sẵn, sấy chín vị muối nhẹ. Kèm dụng cụ mở hạt cho túi bán lẻ. Rất được ưa chuộng tại thị trường Trung Quốc.',
      en: 'Queensland macadamias, 22–25 mm, pre-cracked and lightly salted roasted. Retail bags include an opener. Highly popular in China.',
      zh: '昆士兰夏威夷果，粒径22–25毫米，已开口，淡盐烘烤。零售袋附开果器，在中国市场极受欢迎。'
    }
  },
  {
    id: 'pure-honey', company: 'qld-nut-honey', cat: 'honey',
    imgs: ['photo-1587049352851-8d4e89133924', 'photo-1761416351532-ede97c29fab8'],
    name: { vi: 'Mật ong hoa bạch đàn nguyên chất', en: 'Pure Eucalyptus Honey', zh: '纯桉树蜂蜜' },
    price: '7.20 – 8.50', unit: { vi: 'kg', en: 'kg', zh: '公斤' },
    moq: { vi: '1 tấn', en: '1 ton', zh: '1吨' },
    pack: { vi: 'Hũ thủy tinh 500g hoặc phuy 300 kg', en: '500g glass jars or 300 kg drums', zh: '500克玻璃瓶或300公斤桶' },
    shelf: { vi: '36 tháng', en: '36 months', zh: '36个月' },
    storage: { vi: 'Nhiệt độ thường', en: 'Ambient temperature', zh: '常温' },
    port: 'Brisbane', certs: ['HACCP', 'Australian Certified Organic'], oem: true, capacity: { vi: '40 tấn/tháng', en: '40 tons/month', zh: '每月40吨' },
    desc: {
      vi: 'Mật ong nguyên chất từ hoa bạch đàn vùng Queensland, kiểm nghiệm NMR chống pha trộn. Phù hợp phân khúc cao cấp.',
      en: 'Pure honey from Queensland eucalyptus blossoms, NMR tested against adulteration. Suited to the premium segment.',
      zh: '来自昆士兰桉树花的纯蜂蜜，经NMR检测防掺假。适合高端市场。'
    }
  },
  {
    id: 'st25-rice', company: 'mekong-rice', cat: 'rice',
    imgs: ['photo-1586201375761-83865001e31c', 'photo-1728895604559-a4e16081504e'],
    name: { vi: 'Gạo thơm ST25', en: 'ST25 Fragrant Rice', zh: 'ST25香米' },
    price: '820 – 900', unit: { vi: 'tấn', en: 'ton', zh: '吨' },
    moq: { vi: '25 tấn', en: '25 tons', zh: '25吨' },
    pack: { vi: 'Bao PP 25 kg hoặc túi 5 kg', en: '25 kg PP bags or 5 kg bags', zh: '25公斤PP袋或5公斤袋' },
    shelf: { vi: '12 tháng', en: '12 months', zh: '12个月' },
    storage: { vi: 'Kho khô thoáng', en: 'Dry, ventilated warehouse', zh: '干燥通风仓库' },
    port: 'Can Tho', certs: ['ISO 22000'], oem: true, capacity: { vi: '2.000 tấn/tháng', en: '2,000 tons/month', zh: '每月2,000吨' },
    desc: {
      vi: 'Gạo ST25 – giống gạo đạt giải gạo ngon nhất thế giới, hạt dài, thơm lá dứa. Tấm tối đa 5%, độ ẩm tối đa 14%.',
      en: 'ST25 – an award-winning "world\'s best rice" variety with long grains and pandan aroma. Max broken 5%, max moisture 14%.',
      zh: 'ST25——曾获"世界最佳大米"称号的品种，长粒、带香兰叶香气。碎米率≤5%，含水率≤14%。'
    }
  },
  {
    id: 'instant-noodles', company: 'fujian-mingshan', cat: 'dry-food',
    imgs: ['photo-1788519036479-4745805551e2', 'photo-1612927601601-6638404737ce'],
    name: { vi: 'Mì ăn liền vị bò hầm', en: 'Braised Beef Instant Noodles', zh: '红烧牛肉方便面' },
    price: '0.22 – 0.28', unit: { vi: 'gói', en: 'pack', zh: '包' },
    moq: { vi: '1.000 thùng', en: '1,000 cartons', zh: '1,000箱' },
    pack: { vi: 'Gói 85g, 30 gói/thùng', en: '85g pack, 30 packs/carton', zh: '85克/包，每箱30包' },
    shelf: { vi: '8 tháng', en: '8 months', zh: '8个月' },
    storage: { vi: 'Nơi khô mát', en: 'Cool, dry place', zh: '阴凉干燥处' },
    port: 'Xiamen', certs: ['HACCP', 'ISO 22000'], oem: true, capacity: { vi: '60 container/tháng', en: '60 containers/month', zh: '每月60柜' },
    desc: {
      vi: 'Mì ăn liền vị bò hầm kiểu Phúc Kiến, sợi chiên. Nhận OEM nhãn riêng với MOQ thấp cho nhà nhập khẩu Việt Nam và Úc.',
      en: 'Fujian-style braised beef instant noodles, fried noodles. OEM private label with low MOQ for Vietnamese and Australian importers.',
      zh: '福建风味红烧牛肉方便面，油炸面饼。可为越南和澳大利亚进口商提供低起订量的OEM贴牌。'
    }
  },
  {
    id: 'frozen-shrimp', company: 'camau-seafood', cat: 'seafood', isNew: true,
    imgs: ['photo-1615141982883-c7ad0e69fd62', 'photo-1779517935494-2fa87fd7178c'],
    name: { vi: 'Tôm thẻ bóc vỏ đông lạnh IQF', en: 'Frozen IQF Peeled Whiteleg Shrimp', zh: 'IQF冷冻去壳白虾' },
    price: '7.80 – 9.20', unit: { vi: 'kg', en: 'kg', zh: '公斤' },
    moq: { vi: '1 container 40ft lạnh', en: '1 x 40ft reefer container', zh: '1个40尺冷藏柜' },
    pack: { vi: 'Túi 1 kg, 10 túi/thùng', en: '1 kg bags, 10 bags/carton', zh: '1公斤/袋，每箱10袋' },
    shelf: { vi: '24 tháng', en: '24 months', zh: '24个月' },
    storage: { vi: '-18°C hoặc thấp hơn', en: '-18°C or below', zh: '-18°C或以下' },
    port: 'Cat Lai, HCMC', certs: ['BAP', 'ASC', 'GACC'], oem: true, capacity: { vi: '30 container/tháng', en: '30 containers/month', zh: '每月30柜' },
    desc: {
      vi: 'Tôm thẻ chân trắng bóc vỏ chừa đuôi (PTO), cấp đông nhanh IQF, mạ băng 10%. Size 26/30 – 71/90. Nhà máy đã đăng ký GACC.',
      en: 'Peeled tail-on (PTO) whiteleg shrimp, IQF frozen, 10% glazing. Sizes 26/30 – 71/90. GACC-registered plant.',
      zh: '去壳留尾（PTO）白虾，IQF单冻，镀冰10%。规格26/30–71/90。工厂已在海关总署注册。'
    }
  }
];

/* Nhu cầu mua mới nhất (hiển thị trên trang chủ) */
const BUY_REQUESTS = [
  { country: 'AU', hours: 2,  title: { vi: 'Cần mua 2 container nước ép cam NFC', en: 'Buying 2 containers of NFC orange juice', zh: '求购2柜NFC橙汁' }, city: { vi: 'Sydney', en: 'Sydney', zh: '悉尼' } },
  { country: 'CN', hours: 5,  title: { vi: 'Tìm nhà cung cấp hạt điều W240/W320', en: 'Looking for W240/W320 cashew suppliers', zh: '寻找W240/W320腰果供应商' }, city: { vi: 'Thượng Hải', en: 'Shanghai', zh: '上海' } },
  { country: 'VN', hours: 20, title: { vi: 'Nhập khẩu vang đỏ Úc cho chuỗi nhà hàng', en: 'Importing Australian red wine for a restaurant chain', zh: '为连锁餐厅进口澳洲红酒' }, city: { vi: 'TP. Hồ Chí Minh', en: 'HCMC', zh: '胡志明市' } },
  { country: 'AU', hours: 26, title: { vi: 'Cần trái cây sấy không đường, nhãn riêng', en: 'Need no-sugar dried fruit, private label', zh: '求购无糖果干，贴牌' }, city: { vi: 'Melbourne', en: 'Melbourne', zh: '墨尔本' } },
  { country: 'CN', hours: 30, title: { vi: 'Tìm cà phê Robusta S18 giao quý I', en: 'Sourcing Robusta S18 for Q1 delivery', zh: '寻购一季度交货的罗布斯塔S18' }, city: { vi: 'Quảng Châu', en: 'Guangzhou', zh: '广州' } },
  { country: 'VN', hours: 48, title: { vi: 'Cần đơn vị vận chuyển lạnh HCM – Sydney', en: 'Need reefer shipping HCMC – Sydney', zh: '寻找胡志明市—悉尼冷链运输' }, city: { vi: 'Hà Nội', en: 'Hanoi', zh: '河内' } }
];

/* Gói thành viên, thanh toán theo năm (giá minh họa, chủ sàn tự đặt trong trang quản trị) */
const PLANS = [
  { id: 'free',     price: { VND: 0,       USD: 0 },   limits: { products: 10,       contacts: 0 },        feats: 4 },
  { id: 'standard', price: { VND: 3900000, USD: 159 }, limits: { products: 100,      contacts: 50 },       feats: 5, popular: true },
  { id: 'premium',  price: { VND: 9900000, USD: 399 }, limits: { products: Infinity, contacts: Infinity }, feats: 5 }
];

/* Ảnh giới thiệu từng nhóm dịch vụ */
const SERVICE_INTRO = {
  logistics:  { img: 'photo-1494412519320-aa613dfb7738' },
  consulting: { img: 'photo-1517048676732-d65bc937f952' },
  insurance:  { img: 'photo-1450101499163-c8848c66ca85' }
};
