export interface Product {
  id: string;
  category: 'Industrial' | 'Cosmetic';
  name: { en: string; ko: string };
  description: { en: string; ko: string };
  image: string;
  specs: {
    outerDiameter: string;
    innerDiameter: string;
    hardness: string;
    poreSize: string;
  };
  features: { en: string[]; ko: string[] };
  datasheetUrl: string;
}

export const products: Product[] = [
  {
    id: 'ind-01',
    category: 'Industrial',
    name: { en: 'High-Precision Roller (P-Series)', ko: '고정밀 롤러 (P-시리즈)' },
    description: { 
      en: 'Designed for semiconductor and PCB cleaning processes with ultra-fine pore structure.',
      ko: '초미세 기공 구조를 갖춘 반도체 및 PCB 세정 공정용 설계.'
    },
    image: 'https://picsum.photos/seed/pva-roller/800/600',
    specs: {
      outerDiameter: '50mm - 200mm',
      innerDiameter: '20mm - 100mm',
      hardness: '30 - 70 (Asker C)',
      poreSize: '0.1um - 0.5um'
    },
    features: {
      en: ['Ultra-low particle generation', 'Superior chemical resistance', 'High water absorption'],
      ko: ['초저입자 발생', '우수한 내화학성', '높은 흡수율']
    },
    datasheetUrl: '#'
  },
  {
    id: 'ind-02',
    category: 'Industrial',
    name: { en: 'Industrial Sheet (S-Series)', ko: '산업용 시트 (S-시리즈)' },
    description: { 
      en: 'Versatile PVA sheets for wiping and drying in cleanroom environments.',
      ko: '클린룸 환경에서의 닦기 및 건조를 위한 다목적 PVA 시트.'
    },
    image: 'https://picsum.photos/seed/pva-sheet/800/600',
    specs: {
      outerDiameter: 'N/A',
      innerDiameter: 'N/A',
      hardness: '20 - 50 (Asker C)',
      poreSize: '0.2um - 1.0um'
    },
    features: {
      en: ['Scratch-free surface', 'Lint-free material', 'Eco-friendly biodegradable'],
      ko: ['스크래치 없는 표면', '보풀 없는 소재', '친환경 생분해성']
    },
    datasheetUrl: '#'
  },
  {
    id: 'cos-01',
    category: 'Cosmetic',
    name: { en: 'Soft Touch Facial Sponge', ko: '소프트 터치 페이셜 스펀지' },
    description: { 
      en: 'Premium cosmetic sponge for gentle exfoliation and makeup removal.',
      ko: '부드러운 각질 제거 및 메이크업 클렌징을 위한 프리미엄 코스메틱 스펀지.'
    },
    image: 'https://picsum.photos/seed/cosmetic-sponge/800/600',
    specs: {
      outerDiameter: '80mm',
      innerDiameter: 'N/A',
      hardness: '10 - 20 (Asker C)',
      poreSize: '0.05um - 0.2um'
    },
    features: {
      en: ['Hypoallergenic', 'Velvety texture', 'Durable and reusable'],
      ko: ['저자극성', '벨벳 같은 질감', '내구성 및 재사용 가능']
    },
    datasheetUrl: '#'
  }
];

export const faqs = [
  {
    question: { en: 'What is the Minimum Order Quantity (MOQ)?', ko: '최소 주문 수량(MOQ)은 얼마인가요?' },
    answer: { 
      en: 'MOQ varies by product line. For standard industrial rollers, it starts at 50 units. For cosmetic sponges, it starts at 1,000 units.',
      ko: 'MOQ는 제품 라인에 따라 다릅니다. 표준 산업용 롤러는 50개부터, 코스메틱 스펀지는 1,000개부터 시작합니다.'
    }
  },
  {
    question: { en: 'Do you provide samples for testing?', ko: '테스트용 샘플을 제공하나요?' },
    answer: { 
      en: 'Yes, we provide technical samples for R&D evaluation. Please contact our support team with your specific requirements.',
      ko: '네, R&D 평가를 위한 기술 샘플을 제공합니다. 구체적인 요구 사항을 지원 팀에 문의해 주세요.'
    }
  },
  {
    question: { en: 'Are your materials REACH compliant?', ko: '소재가 REACH 규정을 준수하나요?' },
    answer: { 
      en: 'All our PVA materials are fully REACH and RoHS compliant, ensuring safety and environmental standards.',
      ko: '당사의 모든 PVA 소재는 REACH 및 RoHS를 완벽하게 준수하여 안전 및 환경 표준을 보장합니다.'
    }
  }
];

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      products: 'Products',
      tech: 'Tech & Quality',
      contact: 'Contact',
      back: 'Back'
    },
    hero: {
      badge: 'Next-Gen PVA Technology',
      title: 'Precision Engineering',
      titleAccent: 'Beyond Limits',
      desc: 'Global B2B leader in high-performance PVA sponge solutions. Delivering 0.1um precision for the world\'s most demanding industries.',
      ctaExplore: 'Explore Products',
      ctaQuote: 'Request Quote & Order'
    },
    home: {
      industrialTitle: 'Industrial Solutions',
      industrialDesc: 'High-durability rollers and sheets for semiconductor, PCB, and hard disk cleaning.',
      cosmeticTitle: 'Cosmetic Excellence',
      cosmeticDesc: 'Ultra-soft, hypoallergenic sponges designed for premium skincare and beauty brands.',
      viewCatalog: 'View Catalog',
      techTitle: 'Quantifiable Technical Superiority',
      techDesc: 'Our proprietary manufacturing process allows for unprecedented control over material properties.',
      feature1Title: '0.1um Pore Control',
      feature1Desc: 'Micro-pore management system ensuring uniform absorption and zero-scratch performance.',
      feature2Title: '99.9% Purity',
      feature2Desc: 'Cleanroom-processed materials meeting the strictest semiconductor industry standards.',
      feature3Title: 'Eco-Friendly',
      feature3Desc: 'Biodegradable PVA materials and sustainable production cycles for a greener future.'
    },
    products: {
      title: 'Product Catalog',
      desc: 'Explore our comprehensive range of high-performance PVA solutions tailored for specific industrial and cosmetic needs.',
      filterAll: 'All',
      filterIndustrial: 'Industrial',
      filterCosmetic: 'Cosmetic',
      searchPlaceholder: 'Search products...',
      dataSheet: 'Data Sheet',
      specs: {
        od: 'Outer Diameter',
        id: 'Inner Diameter',
        hardness: 'Hardness',
        pore: 'Pore Size'
      },
      noResults: 'No products found matching your criteria.'
    },
    about: {
      heroTitle: 'Pioneering PVA Excellence',
      heroDesc: 'Since 1998, we have been at the forefront of micro-porous material science.',
      rdBadge: 'Innovation First',
      rdTitle: 'Advanced R&D Center',
      rdDesc: 'Our state-of-the-art research facility is dedicated to pushing the boundaries of PVA technology. We specialize in custom pore architecture, chemical resistance testing, and high-speed absorption analytics.',
      rdFeature1: 'Micro-Analysis',
      rdFeature1Desc: 'SEM imaging and pore size distribution testing.',
      rdFeature2: 'Custom Synthesis',
      rdFeature2Desc: 'Tailored material properties for specific applications.',
      globalTitle: 'Global Network',
      globalDesc: 'Exporting to over 45 countries worldwide. With regional offices in Germany, USA, and Japan, we provide localized technical support.',
      stat1: 'Export Countries',
      stat2: 'Global Partners',
      stat3: 'Patents Held',
      stat4: 'Years Experience'
    },
    tech: {
      title: 'Production Excellence',
      desc: 'Our fully automated production lines ensure consistent quality and high-volume capacity.',
      step1: 'Raw Material Blending',
      step1Desc: 'Proprietary PVA polymer synthesis with precision additive control.',
      step2: 'Foaming & Molding',
      step2Desc: 'Controlled pore formation using high-pressure micro-injection.',
      step3: 'Automated Drying',
      step3Desc: 'Multi-stage thermal processing to ensure dimensional stability.',
      step4: 'Precision Machining',
      step4Desc: 'CNC-controlled grinding and cutting for 0.05mm tolerance.',
      qualityTitle: 'Quality Assurance & Certifications',
      qualityDesc: 'We maintain the highest standards of quality control throughout our manufacturing process. Our facilities are regularly audited and certified by international bodies.',
      cert1: 'ISO 9001:2015 Quality Management System',
      cert2: 'ISO 14001:2015 Environmental Management',
      cert3: 'REACH & RoHS Compliance Certified',
      cert4: 'Semiconductor Grade Purity Certification',
      certificate: 'Certificate'
    },
    contact: {
      title: 'Get in Touch',
      desc: 'Have a technical inquiry or need a custom solution? Our global support team is ready to assist you.',
      hq: 'Global Headquarters',
      phone: 'Phone Support',
      email: 'Email Inquiries',
      faqTitle: 'Frequently Asked Questions',
      formGeneral: 'General Inquiry',
      formQuote: 'Custom Quote',
      labelName: 'Full Name',
      labelEmail: 'Company Email',
      labelCompany: 'Company Name',
      labelCategory: 'Product Category',
      labelQuantity: 'Estimated Quantity',
      labelPore: 'Target Pore Size (um)',
      labelMessage: 'Message',
      placeholderName: 'John Doe',
      placeholderEmail: 'john@company.com',
      placeholderCompany: 'Tech Solutions Inc.',
      placeholderMessage: 'Tell us about your project...',
      btnSend: 'Send Inquiry'
    },
    footer: {
      desc: 'Global leader in high-performance PVA sponge technology. Precision engineering for industrial and cosmetic excellence.',
      solutions: 'Solutions',
      company: 'Company',
      contact: 'Contact',
      rights: 'All rights reserved.',
      industrialRollers: 'Industrial Rollers',
      cosmeticSponges: 'Cosmetic Sponges',
      cleanroomSheets: 'Cleanroom Sheets',
      customRD: 'Custom R&D',
      globalNetwork: 'Global Network',
      careers: 'Careers',
      address: '123 Tech Park, Innovation District, Seoul, KR',
      phoneHours: '+82 2-1234-5678 (Mon-Fri, 9AM-6PM KST)',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      cookieSettings: 'Cookie Settings'
    }
  },
  ko: {
    nav: {
      home: '홈',
      about: '회사 소개',
      products: '제품 정보',
      tech: '기술 및 품질',
      contact: '고객 지원',
      back: '뒤로 가기'
    },
    hero: {
      badge: '차세대 PVA 기술',
      title: '한계를 넘어서는',
      titleAccent: '정밀 엔지니어링',
      desc: '고성능 PVA 스펀지 솔루션의 글로벌 B2B 리더. 세계에서 가장 까다로운 산업을 위한 0.1um 정밀도를 제공합니다.',
      ctaExplore: '제품 둘러보기',
      ctaQuote: '견적요청 및 주문하기'
    },
    home: {
      industrialTitle: '산업용 솔루션',
      industrialDesc: '반도체, PCB 및 하드디스크 세정을 위한 고내구성 롤러 및 시트.',
      cosmeticTitle: '코스메틱 엑설런스',
      cosmeticDesc: '프리미엄 스킨케어 및 뷰티 브랜드를 위해 설계된 초부드러운 저자극성 스펀지.',
      viewCatalog: '카탈로그 보기',
      techTitle: '수치로 증명된 기술적 우위',
      techDesc: '당사만의 독자적인 제조 공정으로 소재 특성을 전례 없는 수준으로 제어합니다.',
      feature1Title: '0.1um 기공 제어',
      feature1Desc: '균일한 흡수와 스크래치 방지 성능을 보장하는 미세 기공 관리 시스템.',
      feature2Title: '99.9% 순도',
      feature2Desc: '가장 엄격한 반도체 산업 표준을 충족하는 클린룸 공정 소재.',
      feature3Title: '친환경 소재',
      feature3Desc: '더 푸른 미래를 위한 생분해성 PVA 소재 및 지속 가능한 생산 사이클.'
    },
    products: {
      title: '제품 카탈로그',
      desc: '특정 산업 및 코스메틱 요구 사항에 맞춘 고성능 PVA 솔루션의 포괄적인 범위를 살펴보세요.',
      filterAll: '전체',
      filterIndustrial: '산업용',
      filterCosmetic: '코스메틱',
      searchPlaceholder: '제품 검색...',
      dataSheet: '데이터 시트',
      specs: {
        od: '외경',
        id: '내경',
        hardness: '경도',
        pore: '기공 크기'
      },
      noResults: '검색 조건에 맞는 제품이 없습니다.'
    },
    about: {
      heroTitle: 'PVA 기술의 선구자',
      heroDesc: '1998년부터 미세 다공성 소재 과학의 최전선에 서 왔습니다.',
      rdBadge: '혁신 우선',
      rdTitle: '첨단 R&D 센터',
      rdDesc: '당사의 최첨단 연구 시설은 PVA 기술의 한계를 넓히는 데 전념하고 있습니다. 맞춤형 기공 구조, 내화학성 테스트 및 고속 흡수 분석을 전문으로 합니다.',
      rdFeature1: '미세 분석',
      rdFeature1Desc: 'SEM 이미징 및 기공 크기 분포 테스트.',
      rdFeature2: '맞춤형 합성',
      rdFeature2Desc: '특정 용도에 맞춘 소재 특성 최적화.',
      globalTitle: '글로벌 네트워크',
      globalDesc: '전 세계 45개국 이상으로 수출하고 있습니다. 독일, 미국, 일본의 지역 사무소를 통해 현지 기술 지원을 제공합니다.',
      stat1: '수출 국가',
      stat2: '글로벌 파트너',
      stat3: '보유 특허',
      stat4: '업력'
    },
    tech: {
      title: '생산 우수성',
      desc: '완전 자동화된 생산 라인을 통해 일관된 품질과 대량 생산 능력을 보장합니다.',
      step1: '원료 배합',
      step1Desc: '정밀 첨가제 제어를 통한 독자적인 PVA 폴리머 합성.',
      step2: '발포 및 성형',
      step2Desc: '고압 마이크로 인젝션을 이용한 제어된 기공 형성.',
      step3: '자동 건조',
      step3Desc: '치수 안정성 확보를 위한 다단계 열처리 공정.',
      step4: '정밀 가공',
      step4Desc: '0.05mm 오차 범위를 위한 CNC 제어 연마 및 절단.',
      qualityTitle: '품질 보증 및 인증',
      qualityDesc: '제조 공정 전반에 걸쳐 최고 수준의 품질 관리를 유지합니다. 당사 시설은 국제 기구로부터 정기적인 감사 및 인증을 받습니다.',
      cert1: 'ISO 9001:2015 품질 경영 시스템',
      cert2: 'ISO 14001:2015 환경 경영 시스템',
      cert3: 'REACH 및 RoHS 준수 인증',
      cert4: '반도체 등급 순도 인증',
      certificate: '인증서'
    },
    contact: {
      title: '문의하기',
      desc: '기술 문의나 맞춤형 솔루션이 필요하신가요? 당사의 글로벌 지원 팀이 도와드릴 준비가 되어 있습니다.',
      hq: '글로벌 본사',
      phone: '전화 지원',
      email: '이메일 문의',
      faqTitle: '자주 묻는 질문',
      formGeneral: '일반 문의',
      formQuote: '맞춤 견적',
      labelName: '성함',
      labelEmail: '회사 이메일',
      labelCompany: '회사명',
      labelCategory: '제품 카테고리',
      labelQuantity: '예상 수량',
      labelPore: '목표 기공 크기 (um)',
      labelMessage: '메시지',
      placeholderName: '홍길동',
      placeholderEmail: 'john@company.com',
      placeholderCompany: '테크 솔루션즈',
      placeholderMessage: '프로젝트에 대해 알려주세요...',
      btnSend: '문의 보내기'
    },
    footer: {
      desc: '고성능 PVA 스펀지 기술의 글로벌 리더. 산업 및 코스메틱 우수성을 위한 정밀 엔지니어링.',
      solutions: '솔루션',
      company: '회사 정보',
      contact: '고객 지원',
      rights: '모든 권리 보유.',
      industrialRollers: '산업용 롤러',
      cosmeticSponges: '코스메틱 스펀지',
      cleanroomSheets: '클린룸 시트',
      customRD: '맞춤형 R&D',
      globalNetwork: '글로벌 네트워크',
      careers: '채용 정보',
      address: '서울특별시 혁신 지구 테크 파크 123',
      phoneHours: '+82 2-1234-5678 (월-금, 오전 9시-오후 6시 KST)',
      privacyPolicy: '개인정보 처리방침',
      termsOfService: '이용 약관',
      cookieSettings: '쿠키 설정'
    }
  }
};
