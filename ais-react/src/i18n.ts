import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        about: 'About',
        software: 'Software',
        cyber: 'Cyber Security',
        power: 'Power',
        telecom: 'Telecom',
        cta: 'Initiate Brief',
      },
      hero: {
        eyebrow: 'EST. 1998 • OWNED BY CITY BANDIT LIMITED',
        titleA: 'Your digital future.',
        titleB: 'Revitalized.',
        subtitle:
          'Advanced Information Systems Company is a progressive technology organization specializing in telecommunications, information technology, and custom software development across the Middle East, aligned with Saudi Vision 2030.',
        explore: 'Explore Solutions',
        contact: 'Contact Us',
        statEstablished: 'YEAR ESTABLISHED',
        statAlignment: 'STRATEGIC ALIGNMENT',
        statFocus: 'SOVEREIGN FOCUS',
      },
      services: {
        eyebrow: 'CORE CAPABILITIES & ARCHITECTURE',
        title: 'Future-Ready Sovereign Systems',
        desc: 'Precision-engineered digital backbones, sovereign defense standards, and deep technical execution across the Kingdom.',
        cards: [
          {
            tag: 'Enterprise Engineering',
            title: 'Software Solutions',
            desc: 'End-to-end custom systems architecture, rigorous code assurance, and automation engineering engineered to meet state and commercial mandates.',
            chips: ['Custom Software Development', 'Testing & Inspection', 'Quality Engineering', 'Code Testing'],
          },
          {
            tag: 'Defense Grade',
            title: 'Cyber Security',
            desc: 'Robust sovereign defense mechanisms, proactive incident posture, and fully managed threat-mitigation frameworks.',
            chips: ['Implementation & Deployment', 'Customization & Development', 'Professional Consulting', 'Planning & Execution'],
          },
          {
            tag: 'High Availability',
            title: 'Power Solutions',
            desc: 'Engineered electrical resilience, power conversion systems, and mission-critical emergency fallback matrices for non-stop operations.',
            chips: ['Low Voltage Services', 'Backup Power Systems', 'Medium Voltage Solutions'],
          },
          {
            tag: 'National Scale',
            title: 'Telecom & ICT Solutions',
            desc: 'Turnkey telecommunications contracting, optical backbones, smart city surveillance arrays, and high-density hyperscale data center infrastructure.',
            chips: ['Connectivity Solutions', 'Data Center Solutions', 'Core Network-ISP', 'Safe City - CCTV', 'Network Security', 'OSP & FTTX Solutions'],
          },
        ],
      },
      tabs: {
        about: 'About',
        software: 'Software Solutions',
        cyber: 'Cyber Security',
        power: 'Power Solutions',
        telecom: 'Telecom & ICT',
      },
      about: {
        title: 'Who We Are',
        overview: 'Advanced Information Systems & Contracting (AIS) is a progressive technology organization established in 1998, owned by City Bandit Limited. We specialize in telecommunications, information technology, and custom software development across the Middle East, aligned with Saudi Vision 2030.',
        vision: 'To be among the leading companies in information technology, cybersecurity, artificial intelligence, electricity, telecommunications, and general contracting, through continuous innovation and leveraging artificial intelligence to enhance trust and efficiency for clients in both the public and private sectors.',
        mission: 'Advanced Information Systems Company strives to provide diverse and reliable services with high quality and cost-effectiveness, combining modernity and innovation to meet client needs and exceed expectations efficiently and professionally, while contributing to the achievement of Saudi Arabia\'s Vision 2030.',
        strengths: [
          { title: 'Industry Expertise', desc: 'Over 25 years of experience across diverse sectors since 1998, delivering insights and time-tested strategies.' },
          { title: 'Tailored Solutions', desc: 'Flexible strategies crafted for each client\'s unique challenges — no one-size-fits-all.' },
          { title: 'Cutting-Edge Tech', desc: 'Leveraging AI, automation, and data analytics to drive measurable outcomes.' },
          { title: 'Proven Track Record', desc: 'Successful projects with government bodies and major enterprises across the region.' },
        ],
      },
      partners: {
        title: 'Trusted by Sovereign Pioneers & Customers',
        desc: 'Powering vital infrastructure for industry authorities and leading regional enterprises.',
      },
      contact: {
        badge: 'Operational & Available for Tenders',
        title: 'Start a dialogue.',
        desc: 'Connect with our enterprise directors, systems architects, and sovereign engineering leads to initiate your tender or consultation.',
        hq: 'Headquarters:',
        hqValue: 'Building 7022, Al Aqeeq Dist, Riyadh, Postal Code 13515, Kingdom of Saudi Arabia.',
        phone: 'Phone:',
        email: 'Email:',
        entity: 'Entity Name / Government Agency',
        entityPh: 'e.g. Ministry Directorate, Enterprise Corp',
        workEmail: 'Work Email',
        phoneLabel: 'Phone',
        scope: 'Scope of Inquiry',
        scopeOptions: [
          'Software Solutions & Custom Engineering',
          'Cyber Security Architecture & ECC',
          'Power Solutions & Backup Systems (UPS)',
          'Telecom & ICT Solutions (OSP/FTTX, Data Centers)',
          'Comprehensive Sovereign Tender',
        ],
        brief: 'Brief Description',
        briefPh: 'Outline procurement specifications, timelines, or NDA requirements...',
        submit: 'Transmit Formal Inquiry',
        success: 'Inquiry transmitted to Advanced Information Systems & Contracting. Our team will respond shortly.',
      },
      footer: {
        tagline:
          'Advanced Information Systems & Contracting (AIS Contracting). Owned by City Bandit Limited. Delivering telecom engineering, cybersecurity, power, and software systems.',
        rights:
          'Copyright Advanced Information Systems & Contracting (AIS Contracting). Owned by City Bandit Limited. Riyadh, KSA. All rights reserved.',
        location: 'Riyadh, Kingdom of Saudi Arabia',
      },
    },
  },
  ar: {
    translation: {
      nav: {
        about: 'من نحن',
        software: 'البرمجيات',
        cyber: 'الأمن السيبراني',
        power: 'الطاقة',
        telecom: 'الاتصالات',
        cta: 'تواصل معنا',
      },
      hero: {
        eyebrow: 'تأسست عام 1998 • مملوكة لشركة City Bandit Limited',
        titleA: 'مستقبلك الرقمي.',
        titleB: 'نبنيه اليوم.',
        subtitle:
          'شركة أنظمة المعلومات المتقدمة والمقاولات — شريكك التقني في الاتصالات وتقنية المعلومات وتطوير البرمجيات. نعمل في المملكة العربية السعودية والشرق الأوسط بما يتوافق مع رؤية 2030.',
        explore: 'تعرّف على خدماتنا',
        contact: 'تواصل معنا',
        statEstablished: 'سنة التأسيس',
        statAlignment: 'متوافقون مع رؤية 2030',
        statFocus: 'نخدم المملكة',
      },
      services: {
        eyebrow: 'خدماتنا الرئيسية',
        title: 'حلول تقنية متكاملة',
        desc: 'نقدم خدمات تقنية شاملة من تطوير البرمجيات والأمن السيبراني إلى حلول الطاقة والاتصالات.',
        cards: [
          {
            tag: 'تطوير برمجيات',
            title: 'الحلول البرمجية',
            desc: 'نصمم ونطور أنظمة برمجية مخصصة حسب احتياج عملائنا، مع ضمان الجودة والاختبار الشامل لجميع المشاريع.',
            chips: ['تطوير برمجيات مخصصة', 'اختبار وفحص', 'ضمان الجودة', 'فحص الأكواد'],
          },
          {
            tag: 'حماية وأمان',
            title: 'الأمن السيبراني',
            desc: 'نوفر حلول حماية متقدمة تشمل تقييم المخاطر والاستجابة للحوادث وتطبيق أعلى معايير الأمان.',
            chips: ['التنفيذ والتشغيل', 'تطوير وتخصيص', 'استشارات أمنية', 'تخطيط وتنفيذ'],
          },
          {
            tag: 'طاقة واستمرارية',
            title: 'حلول الطاقة',
            desc: 'نوفر أنظمة طاقة احتياطية وحلول كهربائية تضمن استمرارية التشغيل على مدار الساعة.',
            chips: ['أنظمة الجهد المنخفض', 'أنظمة الطاقة الاحتياطية (UPS)', 'حلول الجهد المتوسط'],
          },
          {
            tag: 'اتصالات وبنية تحتية',
            title: 'حلول الاتصالات وتقنية المعلومات',
            desc: 'نقدم حلول اتصالات متكاملة تشمل شبكات الألياف الضوئية ومراكز البيانات وأنظمة المراقبة والمدن الذكية.',
            chips: ['حلول الربط والاتصال', 'مراكز البيانات', 'شبكات ISP', 'أنظمة المراقبة والمدن الذكية', 'أمن الشبكات', 'حلول الألياف الضوئية (FTTX)'],
          },
        ],
      },
      tabs: {
        about: 'من نحن',
        software: 'الحلول البرمجية',
        cyber: 'الأمن السيبراني',
        power: 'حلول الطاقة',
        telecom: 'الاتصالات',
      },
      about: {
        title: 'من نحن',
        overview: 'شركة أنظمة المعلومات المتقدمة والمقاولات (AIS) تأسست عام 1998، مملوكة لشركة City Bandit Limited. نتخصص في الاتصالات وتقنية المعلومات وتطوير البرمجيات في المملكة العربية السعودية والشرق الأوسط، بما يتوافق مع رؤية 2030.',
        vision: 'أن نكون من بين الشركات الرائدة في تقنية المعلومات، والأمن السيبراني، والذكاء الاصطناعي، والكهرباء، والاتصالات، والمقاولات العامة، من خلال الابتكار المستمر وتسخير الذكاء الاصطناعي لتعزيز الثقة والكفاءة للعملاء في القطاعين العام والخاص.',
        mission: 'تسعى شركة أنظمة المعلومات المتقدمة إلى تقديم خدمات متنوعة وموثوقة بجودة عالية وبتكلفة مناسبة، تجمع بين الحداثة والابتكار لتلبية احتياجات العملاء وتجاوز توقعاتهم بكفاءة واحترافية، مع الإسهام في تحقيق رؤية المملكة العربية السعودية 2030.',
        strengths: [
          { title: 'خبرة طويلة', desc: 'أكثر من 25 سنة من العمل في قطاعات متعددة، نفهم السوق واحتياجات العملاء.' },
          { title: 'حلول مخصصة', desc: 'كل مشروع مختلف — نصمم حلولنا حسب متطلبات كل عميل وليس بقالب جاهز.' },
          { title: 'أحدث التقنيات', desc: 'نستخدم أحدث التقنيات في الذكاء الاصطناعي والأتمتة وتحليل البيانات.' },
          { title: 'إنجازات مثبتة', desc: 'سجل حافل من المشاريع الناجحة مع جهات حكومية وشركات كبرى.' },
        ],
      },
      partners: {
        title: 'عملاؤنا وشركاؤنا',
        desc: 'نفتخر بثقة عملائنا من الجهات الحكومية والشركات الرائدة في المنطقة.',
      },
      contact: {
        badge: 'نستقبل طلباتكم والمناقصات',
        title: 'تواصل معنا',
        desc: 'فريقنا جاهز لمناقشة متطلباتك والرد على استفساراتك. تواصل معنا مباشرة أو عبئ النموذج.',
        hq: 'المقر الرئيسي:',
        hqValue: 'مبنى 7022، حي العقيق، الرياض 13515، المملكة العربية السعودية.',
        phone: 'الجوال:',
        email: 'البريد الإلكتروني:',
        entity: 'اسم الجهة أو الشركة',
        entityPh: 'مثال: وزارة، شركة، مؤسسة',
        workEmail: 'البريد الإلكتروني',
        phoneLabel: 'رقم الجوال',
        scope: 'نوع الخدمة المطلوبة',
        scopeOptions: [
          'تطوير برمجيات مخصصة',
          'الأمن السيبراني',
          'حلول الطاقة وأنظمة UPS',
          'الاتصالات والبنية التحتية',
          'طلب شامل / مناقصة',
        ],
        brief: 'تفاصيل إضافية',
        briefPh: 'اكتب تفاصيل طلبك أو المواصفات المطلوبة...',
        submit: 'إرسال الطلب',
        success: 'تم استلام طلبك بنجاح. فريقنا سيتواصل معك في أقرب وقت.',
      },
      footer: {
        tagline:
          'شركة أنظمة المعلومات المتقدمة والمقاولات (AIS Contracting) — مملوكة لشركة City Bandit Limited. متخصصون في الاتصالات والأمن السيبراني والطاقة وتطوير البرمجيات.',
        rights:
          'جميع الحقوق محفوظة © شركة أنظمة المعلومات المتقدمة والمقاولات. الرياض، المملكة العربية السعودية.',
        location: 'الرياض، المملكة العربية السعودية',
      },
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  });

export default i18n;
