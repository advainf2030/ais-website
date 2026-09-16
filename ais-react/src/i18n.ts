import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        about: 'About',
        software: 'Software Solutions',
        power: 'Power Solutions',
        telecom: 'Telecom & ICT',
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
        cards: [
          {
            tag: 'Enterprise Engineering',
            title: 'Software Solutions',
            desc: 'End-to-end custom systems architecture, rigorous code assurance, and automation engineering engineered to meet state and commercial mandates.',
            chips: [
              'Custom Software Development',
              'Quality Engineering',
              'Testing & Inspection',
              'Code Testing & Review',
              'Implementation & Deployment',
              'Security Customization',
              'Professional Consulting',
              'Planning & Execution',
            ],
            subservices: [
              {
                title: 'Custom Software Development',
                desc: 'Bespoke software engineering aligned with enterprise architecture, cloud-native frameworks, and specific business workflows.',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Quality Engineering',
                desc: 'Comprehensive QA pipelines ensuring software resilience, performance scalability, and adherence to international standards.',
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Testing & Inspection',
                desc: 'Rigorous functional, regression, and unit testing protocols to eliminate vulnerabilities and ensure seamless deployment.',
                image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Code Testing & Review',
                desc: 'Deep static and dynamic code analysis to enforce architectural integrity, security compliance, and maintainability.',
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Cyber Security — Implementation & Deployment',
                desc: 'End-to-end rollout of defense-in-depth security architectures, firewalls, and zero-trust controls.',
                image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Cyber Security — Customization & Development',
                desc: 'Tailored security tools, policy orchestration, and automated remediation scripts for unique operational postures.',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Cyber Security — Professional Consulting',
                desc: 'Strategic security roadmaps and threat posture assessment aligned with NCA and SAMA frameworks.',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Cyber Security — Planning & Execution',
                desc: 'Comprehensive disaster recovery planning, incident response rehearsals, and security operations governance.',
                image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80',
              },
            ],
          },
          {
            tag: 'High Availability',
            title: 'Power Solutions',
            desc: 'Engineered electrical resilience, power conversion systems, and mission-critical emergency fallback matrices for non-stop operations.',
            chips: ['Low Voltage Services', 'Backup Power Systems', 'Medium Voltage Solutions'],
            subservices: [
              {
                title: 'Low Voltage Services',
                desc: 'Precision electrical distribution, control panels, circuit protection, cabling infrastructure, and intelligent energy management.',
                image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Backup Power Systems (UPS)',
                desc: 'Industrial-grade uninterruptible power supply (UPS) systems ensuring non-stop uptime for mission-critical infrastructure.',
                image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Medium Voltage Solutions',
                desc: 'High-capacity substations, transformer installations, switchgear maintenance, and robust medium-voltage distribution networks.',
                image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
              },
            ],
          },
          {
            tag: 'National Scale',
            title: 'Telecom & ICT Solutions',
            desc: 'Turnkey telecommunications contracting, optical backbones, smart city surveillance arrays, and high-density hyperscale data center infrastructure.',
            chips: ['Connectivity Solutions', 'Data Center Solutions', 'Core Network-ISP', 'Safe City - CCTV', 'Network Security', 'OSP & FTTX Solutions'],
            subservices: [
              {
                title: 'Connectivity Solutions',
                desc: 'High-throughput WAN/LAN interconnections, dedicated fiber-optic links, and point-to-point microwave carrier communication.',
                image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Data Center Solutions',
                desc: 'Tier-standard data center design, structured cabling, cooling management, precision power, and rack containment.',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Core Network - ISP',
                desc: 'Enterprise routing, switching fabric, MPLS backbones, and telecom operator grade core infrastructure.',
                image: 'https://images.unsplash.com/photo-1520869562399-e772f312f722?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Safe City - CCTV',
                desc: 'Integrated CCTV camera networks, AI-powered video analytics, command and control center solutions.',
                image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'Network Security',
                desc: 'Carrier-grade firewalls, DDoS mitigation appliances, and encrypted point-to-point communication tunnels.',
                image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'OSP & FTTX Solutions',
                desc: 'Turnkey outside plant excavation, optical fiber civil works, ducting, splicing, and last-mile FTTX deployment.',
                image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
              },
            ],
          },
        ],
      },
      tabs: {
        about: 'About',
        software: 'Software Solutions',
        power: 'Power Solutions',
        telecom: 'Telecom & ICT',
      },
      about: {
        title: 'Who We Are',
        overview: 'Advanced Information Systems & Contracting (AIS) is a progressive technology organization established in 1998, owned by City Bandit Limited. We specialize in telecommunications, information technology, and custom software development across the Middle East, aligned with Saudi Vision 2030.',
        visionTitle: 'Our Vision',
        vision: 'To be among the leading companies in information technology, cybersecurity, artificial intelligence, electricity, telecommunications, and general contracting, through continuous innovation and leveraging artificial intelligence to enhance trust and efficiency for clients in both the public and private sectors.',
        missionTitle: 'Our Mission',
        mission: 'Advanced Information Systems Company strives to provide diverse and reliable services with high quality and cost-effectiveness, combining modernity and innovation to meet client needs and exceed expectations efficiently and professionally, while contributing to the achievement of Saudi Arabia\'s Vision 2030.',
        strengths: [
          { title: 'Industry Expertise', desc: 'Over 25 years of experience across diverse sectors since 1998, delivering insights and time-tested strategies.' },
          { title: 'Tailored Solutions', desc: 'Flexible strategies crafted for each client\'s unique challenges — no one-size-fits-all.' },
          { title: 'Cutting-Edge Tech', desc: 'Leveraging AI, automation, and data analytics to drive measurable outcomes.' },
          { title: 'Proven Track Record', desc: 'Successful projects with government bodies and major enterprises across the region.' },
        ],
      },
      whyChooseUs: {
        eyebrow: 'WHY CHOOSE US',
        title: 'Core Strengths & Advantages',
        desc: 'What sets us apart — decades of expertise, tailored solutions, and a proven commitment to excellence.',
      },
      contactChannels: {
        title: 'Communication Channels & Location',
        desc: 'Get in touch with us through any of the following channels.',
      },
      partners: {
        title: 'Trusted by Sovereign Pioneers & Customers',
        desc: 'Powering vital infrastructure for industry authorities and leading regional enterprises.',
      },
      contact: {
        badge: 'Operational & Available for Tenders',
        title: "Let's Work Together!",
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
          'Advanced Information Systems & Contracting (AIS Contracting). Owned by City Bandit Limited.',
        rights:
          'Copyright Advanced Information Systems & Contracting (AIS Contracting). Owned by City Bandit Limited. Riyadh, KSA. All rights reserved.',
        location: 'Riyadh, Kingdom of Saudi Arabia',
        address: 'Building 7022, Al Aqeeq Dist, Riyadh 13515, KSA',
        phone: '+966 53 086 7489',
        email: 'info@advaninfo.com',
        workTogether: "Let's Work Together!",
        workTogetherDesc: 'Ready to start your next project? We\'d love to hear from you.',
      },
    },
  },
  ar: {
    translation: {
      nav: {
        about: 'من نحن',
        software: 'الحلول البرمجية',
        power: 'حلول الطاقة',
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
        cards: [
          {
            tag: 'تطوير برمجيات',
            title: 'الحلول البرمجية',
            desc: 'نصمم ونطور أنظمة برمجية مخصصة حسب احتياج عملائنا، مع ضمان الجودة والاختبار الشامل لجميع المشاريع.',
            chips: [
              'تطوير برمجيات مخصصة',
              'ضمان الجودة',
              'اختبار وفحص',
              'فحص الأكواد',
              'التنفيذ والتشغيل',
              'تطوير وتخصيص أمني',
              'استشارات أمنية',
              'تخطيط وتنفيذ',
            ],
            subservices: [
              {
                title: 'تطوير برمجيات مخصصة',
                desc: 'تصميم وتطوير أنظمة وتطبيقات برمجية مخصصة تلبي احتياجات أعمالك بدقة وتواكب متطلبات التحول الرقمي.',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'ضمان الجودة',
                desc: 'تطبيق أعلى معايير الجودة العالمية لضمان كفاءة الأنظمة البرمجية واستقرارها تحت مختلف ظروف التشغيل.',
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'اختبار وفحص',
                desc: 'فحوصات وظيفية وشاملة لاكتشاف الثغرات والتأكد من مطابقة النظام لكافة متطلبات التشغيل.',
                image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'فحص الأكواد',
                desc: 'تحليل هيكلي معمق للأكواد البرمجية للتحقق من أمانها وقابليتها للتوسع وسهولة صيانتها.',
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'الأمن السيبراني — التنفيذ والتشغيل',
                desc: 'تركيب وتشغيل حلول أمنية متكاملة تشمل جدران الحماية المتقدمة وأنظمة الثقة الصفرية Zero Trust.',
                image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'الأمن السيبراني — تطوير وتخصيص',
                desc: 'تطوير وتخصيص أدوات أمنية وسياسات حماية مؤتمتة تناسب بيئة العمل بدقة.',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'الأمن السيبراني — استشارات أمنية',
                desc: 'استشارات متخصصة لتقييم المخاطر السيبرانية ومواءمة الأنظمة مع الضوابط الوطنية للجهات الحكومية والخاصة.',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'الأمن السيبراني — تخطيط وتنفيذ',
                desc: 'وضع وتنفيذ خطط استباقية لإدارة الطوارئ السيبرانية واستمرارية الأعمال تحت أي هجوم أو تهديد.',
                image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80',
              },
            ],
          },
          {
            tag: 'طاقة واستمرارية',
            title: 'حلول الطاقة',
            desc: 'نوفر أنظمة طاقة احتياطية وحلول كهربائية تضمن استمرارية التشغيل على مدار الساعة.',
            chips: ['أنظمة الجهد المنخفض', 'أنظمة الطاقة الاحتياطية (UPS)', 'حلول الجهد المتوسط'],
            subservices: [
              {
                title: 'أنظمة الجهد المنخفض',
                desc: 'تصميم وتوريد وتركيب لوحات التوزيع وأنظمة التحكم وحماية الدوائر الكهربائية وإدارة الطاقة الذكية.',
                image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'أنظمة الطاقة الاحتياطية (UPS)',
                desc: 'توريد وتركيب أنظمة UPS متطورة تضمن استمرارية الطاقة للمعدات الحساسة ومراكز البيانات دون أي انقطاع.',
                image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'حلول الجهد المتوسط',
                desc: 'إنشاء وتجهيز المحطات الفرعية والمحولات الكهربائية وشبكات التوزيع للجهد المتوسط للمشاريع الكبرى.',
                image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
              },
            ],
          },
          {
            tag: 'اتصالات وبنية تحتية',
            title: 'حلول الاتصالات وتقنية المعلومات',
            desc: 'نقدم حلول اتصالات متكاملة تشمل شبكات الألياف الضوئية ومراكز البيانات وأنظمة المراقبة والمدن الذكية.',
            chips: ['حلول الربط والاتصال', 'مراكز البيانات', 'شبكات ISP', 'أنظمة المراقبة والمدن الذكية', 'أمن الشبكات', 'حلول الألياف الضوئية (FTTX)'],
            subservices: [
              {
                title: 'حلول الربط والاتصال',
                desc: 'شبكات الربط البيني للألياف الضوئية والشبكات المحلية والواسعة بسرعات عالية وموثوقية فائقة.',
                image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'مراكز البيانات',
                desc: 'تصميم وتجهيز مراكز البيانات وفق أعلى المعايير مع التمديدات الهيكلية وأنظمة التبريد الدقيق.',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'شبكات ISP',
                desc: 'بنية تحتية متطورة للتوجيه والتبديل وشبكات النواة المصممة لمزودي خدمات الاتصالات.',
                image: 'https://images.unsplash.com/photo-1520869562399-e772f312f722?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'أنظمة المراقبة والمدن الذكية',
                desc: 'منظومات مراقبة بالفيديو وتحليلات ذكية بالذكاء الاصطناعي وغرف تحكم وسيطرة مركزية للمدن الذكية.',
                image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'أمن الشبكات',
                desc: 'حماية الشبكات بجدران حماية متقدمة ومصدات لهجمات حجب الخدمة DDoS وتشفير القنوات.',
                image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80',
              },
              {
                title: 'حلول الألياف الضوئية (FTTX)',
                desc: 'أعمال التمديد والحفر وشبكات الألياف الخارجية وربط الميل الأخير للعملاء والمنشآت FTTX.',
                image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
              },
            ],
          },
        ],
      },
      tabs: {
        about: 'من نحن',
        software: 'الحلول البرمجية',
        power: 'حلول الطاقة',
        telecom: 'الاتصالات',
      },
      about: {
        title: 'من نحن',
        overview: 'شركة أنظمة المعلومات المتقدمة والمقاولات (AIS) تأسست عام 1998، مملوكة لشركة City Bandit Limited. نتخصص في الاتصالات وتقنية المعلومات وتطوير البرمجيات في المملكة العربية السعودية والشرق الأوسط، بما يتوافق مع رؤية 2030.',
        visionTitle: 'رؤيتنا',
        vision: 'أن نكون من بين الشركات الرائدة في تقنية المعلومات، والأمن السيبراني، والذكاء الاصطناعي، والكهرباء، والاتصالات، والمقاولات العامة، من خلال الابتكار المستمر وتسخير الذكاء الاصطناعي لتعزيز الثقة والكفاءة للعملاء في القطاعين العام والخاص.',
        missionTitle: 'رسالتنا',
        mission: 'تسعى شركة أنظمة المعلومات المتقدمة إلى تقديم خدمات متنوعة وموثوقة بجودة عالية وبتكلفة مناسبة، تجمع بين الحداثة والابتكار لتلبية احتياجات العملاء وتجاوز توقعاتهم بكفاءة واحترافية، مع الإسهام في تحقيق رؤية المملكة العربية السعودية 2030.',
        strengths: [
          { title: 'خبرة طويلة', desc: 'أكثر من 25 سنة من العمل في قطاعات متعددة، نفهم السوق واحتياجات العملاء.' },
          { title: 'حلول مخصصة', desc: 'كل مشروع مختلف — نصمم حلولنا حسب متطلبات كل عميل وليس بقالب جاهز.' },
          { title: 'أحدث التقنيات', desc: 'نستخدم أحدث التقنيات في الذكاء الاصطناعي والأتمتة وتحليل البيانات.' },
          { title: 'إنجازات مثبتة', desc: 'سجل حافل من المشاريع الناجحة مع جهات حكومية وشركات كبرى.' },
        ],
      },
      whyChooseUs: {
        eyebrow: 'لماذا نحن',
        title: 'نقاط القوة والركائز',
        desc: 'ما يميزنا — خبرة عقود، حلول مصممة خصيصاً، والتزام ثابت بالتميز.',
      },
      contactChannels: {
        title: 'قنوات الاتصال والموقع',
        desc: 'تواصل معنا من خلال أي من القنوات التالية.',
      },
      partners: {
        title: 'عملاؤنا وشركاؤنا',
        desc: 'نفتخر بثقة عملائنا من الجهات الحكومية والشركات الرائدة في المنطقة.',
      },
      contact: {
        badge: 'نستقبل طلباتكم والمناقصات',
        title: 'لنعمل معاً!',
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
          'شركة أنظمة المعلومات المتقدمة والمقاولات (AIS Contracting) — مملوكة لشركة City Bandit Limited.',
        rights:
          'جميع الحقوق محفوظة © شركة أنظمة المعلومات المتقدمة والمقاولات. الرياض، المملكة العربية السعودية.',
        location: 'الرياض، المملكة العربية السعودية',
        address: 'مبنى 7022، حي العقيق، الرياض 13515، المملكة العربية السعودية',
        phone: '+966 53 086 7489',
        email: 'info@advaninfo.com',
        workTogether: 'لنعمل معاً!',
        workTogetherDesc: 'جاهز لبدء مشروعك القادم؟ نسعد بالتواصل معك.',
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
