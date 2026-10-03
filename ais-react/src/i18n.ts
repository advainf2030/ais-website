import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const LANG_KEY = 'ais-lang';

const resources = {
  en: {
    translation: {
      meta: {
        title: 'AIS Contracting | Software, Cyber Security & Telecom in Saudi Arabia',
        description:
          'Since 1998, Advanced Information Systems Company delivers custom software, cyber security, managed IT services, telecom infrastructure and power solutions across Saudi Arabia.',
      },
      nav: {
        about: 'About',
        close: 'Close menu',
        back: 'Back',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        language: 'Language:',
        software: 'Software Solutions',
        power: 'Power Solutions',
        telecom: 'Telecom & ICT',
        cta: 'Contact Us',
      },
      hero: {
        eyebrow: 'EST. 1998 • OWNED BY CITY BANDIT LIMITED',
        titleA: 'Your digital future.',
        titleB: 'Revitalized.',
        subtitle:
          'Owned by City Bandit Limited and established in 1998, Advanced Information Systems Company is a progressive technology organization specializing in telecommunications, information technology, and custom software development.',
        explore: 'Explore Solutions',
        scrollCue: 'Scroll to our services',
        contact: 'Contact Us',
      },
      services: {
        cards: [
          {
            tag: 'SOFTWARE SOLUTIONS',
            title: 'Software Solutions',
            desc: 'We specialize in designing and developing tailor-made software solutions that address the unique challenges and requirements of each client.',
            chips: ['Software Development', 'Cyber Security', 'Managed IT Services'],
            groups: [
              {
                title: 'Software Development',
                image: 'images/software-development.webp',
                items: [
                  {
                    title: 'Custom Software Development',
                    desc: 'We focus on creating custom software solutions, carefully designed and developed to meet the specific needs and challenges of every client.',
                  },
                  {
                    title: 'Testing & Inspection',
                    desc: 'We deliver comprehensive verification, testing, and inspection services to ensure the reliability and performance of systems and digital software.',
                  },
                  {
                    title: 'Quality Engineering',
                    desc: 'Quality is integrated into every phase of our development lifecycle as we support organizations throughout their digital transformation journey.',
                  },
                  {
                    title: 'Code Testing',
                    desc: 'We analyze, test, and verify software code to ensure it is robust, easy to maintain, and capable of scaling effectively.',
                  },
                ],
              },
              {
                title: 'Cyber Security',
                image: 'images/cyber-security.webp',
                items: [
                  {
                    title: 'Implementation & Deployment',
                    desc: 'We deliver complete implementation and deployment of cybersecurity solutions across enterprise-level infrastructures.',
                  },
                  {
                    title: 'Customization & Development',
                    desc: 'We deliver personalized cybersecurity solutions designed to address the specific challenges and goals of each client.',
                  },
                  {
                    title: 'Cyber Security Services',
                    desc: 'We provide comprehensive cybersecurity services, including designing, implementing, and managing security solutions.',
                  },
                  {
                    title: 'Planning & Execution',
                    desc: 'We help clients create customized incident response plans that align with their organization\'s specific risk profile.',
                  },
                  {
                    title: 'Professional Consulting',
                    desc: 'We provide expert consulting to help clients define secure, scalable technology strategies aligned with their business goals.',
                  },
                  {
                    title: 'Performance Engineering',
                    desc: 'We optimize systems and applications for speed, scalability, and reliability under real-world operating conditions.',
                  },
                  {
                    title: 'Automation Engineering',
                    desc: 'We design and implement automation solutions that streamline operations, reduce manual effort, and improve consistency.',
                  },
                  {
                    title: 'IT Outsourcing',
                    desc: 'We provide dedicated IT outsourcing services, giving clients access to skilled technical teams without the overhead of an in-house department.',
                  },
                ],
              },
              {
                title: 'Managed IT Services',
                image: 'images/managed-it.webp',
                items: [
                  {
                    title: 'Managed Services',
                    desc: 'We offer a wide array of managed IT services tailored to address the varied needs of clients across multiple industries.',
                  },
                  {
                    title: 'Integrated Managed Services',
                    desc: 'We provide fully integrated managed services solutions that seamlessly blend IT management, cybersecurity, and cloud services.',
                  },
                  {
                    title: 'Proactive Solutions',
                    desc: 'Proactive IT solutions emphasize detecting and resolving potential issues before they disrupt operations, using preventive strategies to maintain seamless performance.',
                  },
                  {
                    title: 'Securing Access',
                    desc: 'We enable our clients with innovative solutions that adapt to their evolving needs, offering secure access to cutting-edge technologies.',
                  },
                  {
                    title: 'Improving IT Performance',
                    desc: 'We actively enhance the long-term performance of internal and external devices, systems, and networks through continuous optimization.',
                  },
                  {
                    title: 'Hyperconverged Infrastructure',
                    desc: 'We focus on implementing HCI solutions that unify computing, storage, and networking resources into a single, efficient system.',
                  },
                  {
                    title: 'Operation & Maintenance',
                    desc: 'We offer clients technical expertise to support system management and maintenance, ensuring seamless and reliable IT operations.',
                  },
                ],
              },
            ],
          },
          {
            tag: 'POWER SOLUTIONS',
            title: 'Power Solutions',
            desc: 'We offer complete Power Solutions for both Medium and Low Voltage systems, encompassing engineering, design, supply, installation, testing, and commissioning.',
            chips: ['Low Voltage Services', 'Backup Power Systems', 'Medium Voltage Solutions'],
            subservices: [
              {
                title: 'Low Voltage Services',
                desc: 'Expert design, installation, and maintenance of low-voltage systems for commercial, residential, and industrial applications.',
                image: 'images/low-voltage.webp',
              },
              {
                title: 'Backup Power Systems (UPS)',
                desc: 'UPS and backup power systems safeguard business continuity through intelligent energy monitoring and management.',
                image: 'images/backup-power.webp',
              },
              {
                title: 'Medium Voltage Solutions',
                desc: 'Improving network reliability and stability with advanced medium-voltage power solutions.',
                image: 'images/medium-voltage.webp',
              },
            ],
          },
          {
            tag: 'TELECOM & ICT SOLUTIONS',
            title: 'Telecom & ICT Solutions',
            desc: 'We provide end-to-end technology solutions, covering connectivity, fiber optics (OSP & FTTX), data centers, network security, core ISP networks, infrastructure, and storage.',
            chips: ['Connectivity Solutions', 'Data Center Solutions', 'Core Network-ISP', 'Safe City - CCTV', 'Network Security', 'Storage Solutions', 'Network Infrastructure', 'OSP & FTTX Solutions'],
            subservices: [
              {
                title: 'Connectivity Solutions',
                desc: 'This encompasses the design and deployment of wired and wireless networks, structured cabling, and unified communications systems.',
                image: 'images/connectivity-solutions.webp',
              },
              {
                title: 'Data Center Solutions',
                desc: 'Ensures reliable connectivity and fast data transfer through comprehensive data center infrastructure planning and maintenance.',
                image: 'images/data-center.webp',
              },
              {
                title: 'Core Network - ISP',
                desc: 'Enterprise-grade routing, switching, and MPLS backbone infrastructure built to core ISP network standards.',
                image: 'images/core-network.webp',
              },
              {
                title: 'Safe City - CCTV',
                desc: 'We deliver complete CCTV and surveillance solutions for Safe City initiatives, ensuring efficient and high-quality monitoring.',
                image: 'images/safe-city-cctv.webp',
              },
              {
                title: 'Network Security',
                desc: 'We deliver comprehensive network security solutions to safeguard critical systems, data, and communications against unauthorized access.',
                image: 'images/cyber-security.webp',
              },
              {
                title: 'Storage Solutions',
                desc: 'We offer scalable and dependable storage solutions designed to support the expanding data requirements of modern organizations.',
                image: 'images/storage-solutions.webp',
              },
              {
                title: 'Network Infrastructure',
                desc: 'We deliver complete network infrastructure solutions tailored to address the evolving demands of modern organizations.',
                image: 'images/network-infrastructure.webp',
              },
              {
                title: 'OSP & FTTX Solutions',
                desc: 'We offer complete OSP (Outside Plant) and FTTx solutions, including planning, design, implementation, and testing.',
                image: 'images/osp-fttx.webp',
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
        overview: [
          'Owned by City Bandit Limited and established in 1998, Advanced Information Systems Company is a progressive technology organization specializing in telecommunications, information technology, and custom software development. Over the years, the company has earned a strong reputation for delivering reliable, scalable, and future-ready digital solutions that help organizations adapt to rapidly evolving technological landscapes.',
          'Leveraging decades of industry experience, the company combines advanced technologies, modern infrastructure, and best practices to design and implement solutions that enhance operational efficiency, strengthen security, and accelerate digital transformation. Its multidisciplinary expertise allows it to serve a broad range of sectors, providing customized services aligned with each client\'s strategic objectives and long-term growth plans.',
          'Focusing primarily on the Middle East, especially Saudi Arabia, Advanced Information Systems Company actively contributes to regional modernization and innovation initiatives. By partnering with both public and private sector organizations, the company delivers high-quality systems that support sustainable development and economic diversification.',
        ],
        visionTitle: 'Our Vision',
        vision: 'To be among the leading companies in information technology, cybersecurity, artificial intelligence, electricity, telecommunications, and general contracting, through continuous innovation and leveraging artificial intelligence to enhance trust and efficiency for clients in both the public and private sectors.',
        missionTitle: 'Our Mission',
        mission: 'Advanced Information Systems Company strives to provide diverse and reliable services with high quality and cost-effectiveness, combining modernity and innovation to meet client needs and exceed expectations efficiently and professionally, while contributing to the achievement of Saudi Arabia\'s Vision 2030.',
        strengths: [
          { title: 'Industry Expertise', desc: 'With decades of experience across diverse sectors, we provide valuable insights and time-tested strategies.' },
          { title: 'Tailored Solutions', desc: 'Delivering tailored, flexible strategies crafted to tackle each client\'s unique challenges.' },
          { title: 'Cutting-Edge Technology', desc: 'Harnessing cutting-edge innovations such as AI, automation, and data analytics.' },
          { title: 'Proven Track Record', desc: 'A proven track record of successful projects, satisfied clients, and strategic partnerships that strengthen our reputation.' },
        ],
      },
      whyChooseUs: {
        eyebrow: 'WHY CHOOSE US',
        title: 'Core Strengths & Advantages',
        desc: 'Our dedication to excellence guarantees consistently exceptional results, enabling businesses to maintain a competitive edge.',
      },
      contactChannels: {
        title: 'Communication Channels & Location',
        desc: 'Get in touch with us through any of the following channels.',
      },
      partners: {
        title: 'Our Partners & Customers',
        desc: 'A selection of our government and private-sector clients and partners.',
      },
      contact: {
        badge: 'Open for New Projects',
        title: "Let's Work Together!",
        desc: 'Get in touch with our team to discuss your project or request a consultation.',
        hq: 'Headquarters:',
        hqValue: 'Building 7022, Al Aqeeq Dist, Riyadh, Postal Code 13515, Kingdom of Saudi Arabia.',
        phone: 'Phone:',
        email: 'Email:',
        entity: 'Entity Name / Government Agency',
        entityPh: 'e.g. Ministry Directorate, Enterprise Corp',
        entityError: 'Please enter a valid name (letters and numbers only)',
        workEmail: 'Work Email',
        emailError: 'Please enter a valid email address',
        phoneLabel: 'Phone',
        phoneError: 'Please enter a valid phone number',
        scope: 'Scope of Inquiry',
        scopeOptions: [
          'Software Solutions',
          'Cyber Security',
          'Power Solutions',
          'Telecom & ICT Solutions',
          'General Inquiry / Tender',
        ],
        brief: 'Brief Description',
        briefPh: 'Outline procurement specifications, timelines, or NDA requirements...',
        rateLimitError: 'Too many submissions from this browser — please wait a bit before trying again.',
        submit: 'Submit Inquiry',
        success: 'Your inquiry has been received. Our team will respond shortly.',
      },
      footer: {
        tagline:
          'Advanced Information Systems & Contracting (AIS Contracting). Owned by City Bandit Limited.',
        rights:
          'Copyright Advanced Information Systems & Contracting (AIS Contracting). Owned by City Bandit Limited. Riyadh, KSA. All rights reserved.',
        address: 'Building 7022, Al Aqeeq Dist, Riyadh 13515, KSA',
        phone: '+966 53 086 7489',
        email: 'info@advaninfo.com',
      },
    },
  },
  ar: {
    translation: {
      meta: {
        title: 'شركة أنظمة المعلومات المتقدمة | البرمجيات والأمن السيبراني والاتصالات في السعودية',
        description:
          'منذ 1998، تقدم شركة أنظمة المعلومات المتقدمة حلول تطوير البرمجيات والأمن السيبراني وخدمات تقنية المعلومات المُدارة والبنية التحتية للاتصالات وحلول الطاقة في المملكة العربية السعودية.',
      },
      nav: {
        about: 'من نحن',
        close: 'إغلاق القائمة',
        back: 'رجوع',
        lightMode: 'الوضع الفاتح',
        darkMode: 'الوضع الداكن',
        language: 'اللغة:',
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
          'شركة أنظمة المعلومات المتقدمة، المملوكة لشركة City Bandit Limited والمؤسسة عام 1998، مؤسسة تقنية متطورة متخصصة في الاتصالات وتقنية المعلومات وتطوير البرمجيات المخصصة.',
        explore: 'تعرّف على خدماتنا',
        scrollCue: 'انتقل إلى خدماتنا',
        contact: 'تواصل معنا',
      },
      services: {
        cards: [
          {
            tag: 'تطوير برمجيات',
            title: 'الحلول البرمجية',
            desc: 'نتخصص في تصميم وتطوير حلول برمجية مخصصة تلبي التحديات والمتطلبات الخاصة بكل عميل.',
            chips: ['تطوير البرمجيات', 'الأمن السيبراني', 'الخدمات المُدارة'],
            groups: [
              {
                title: 'تطوير البرمجيات',
                image: 'images/software-development.webp',
                items: [
                  {
                    title: 'تطوير برمجيات مخصصة',
                    desc: 'نركز على تصميم وتطوير أنظمة برمجية مخصصة تلبي الاحتياجات والتحديات الخاصة بكل عميل.',
                  },
                  {
                    title: 'اختبار وفحص',
                    desc: 'نقدم خدمات تحقق واختبار وفحص شاملة لضمان موثوقية وأداء الأنظمة والبرمجيات الرقمية.',
                  },
                  {
                    title: 'ضمان الجودة',
                    desc: 'الجودة جزء أساسي من كل مرحلة في دورة التطوير لدينا، وندعم المؤسسات طوال رحلة تحولها الرقمي.',
                  },
                  {
                    title: 'فحص الأكواد',
                    desc: 'نحلل ونختبر ونتحقق من الأكواد البرمجية لضمان أنها متينة وسهلة الصيانة وقابلة للتوسع بكفاءة.',
                  },
                ],
              },
              {
                title: 'الأمن السيبراني',
                image: 'images/cyber-security.webp',
                items: [
                  {
                    title: 'التنفيذ والتشغيل',
                    desc: 'نقدم تنفيذاً وتشغيلاً متكاملاً لحلول الأمن السيبراني عبر البنى التحتية على مستوى المؤسسات.',
                  },
                  {
                    title: 'تطوير وتخصيص',
                    desc: 'نقدم حلول أمن سيبراني مخصصة تعالج التحديات والأهداف الخاصة بكل عميل.',
                  },
                  {
                    title: 'خدمات الأمن السيبراني',
                    desc: 'نقدم خدمات أمن سيبراني شاملة تشمل تصميم وتنفيذ وإدارة الحلول الأمنية.',
                  },
                  {
                    title: 'تخطيط وتنفيذ',
                    desc: 'نساعد العملاء على إعداد خطط استجابة مخصصة للحوادث تتوافق مع طبيعة المخاطر الخاصة بمنشأتهم.',
                  },
                  {
                    title: 'استشارات احترافية',
                    desc: 'نقدم استشارات متخصصة تساعد العملاء على وضع استراتيجيات تقنية آمنة وقابلة للتوسع تتماشى مع أهداف أعمالهم.',
                  },
                  {
                    title: 'هندسة الأداء',
                    desc: 'نعمل على تحسين أداء الأنظمة والتطبيقات من حيث السرعة والتوسع والموثوقية في ظروف التشغيل الفعلية.',
                  },
                  {
                    title: 'هندسة الأتمتة',
                    desc: 'نصمم وننفذ حلول أتمتة تبسّط العمليات وتقلل الجهد اليدوي وتحسّن اتساق الأداء.',
                  },
                  {
                    title: 'التعهيد التقني',
                    desc: 'نقدم خدمات تعهيد تقني متخصصة، تمنح العملاء وصولاً لفرق تقنية ماهرة دون أعباء تكوين قسم تقني داخلي.',
                  },
                ],
              },
              {
                title: 'الخدمات المُدارة',
                image: 'images/managed-it.webp',
                items: [
                  {
                    title: 'الخدمات المُدارة',
                    desc: 'نقدم مجموعة واسعة من الخدمات التقنية المُدارة المصممة لتلبية احتياجات العملاء المختلفة عبر قطاعات متعددة.',
                  },
                  {
                    title: 'الخدمات المُدارة المتكاملة',
                    desc: 'نقدم حلول خدمات مُدارة متكاملة تجمع بسلاسة بين إدارة تقنية المعلومات والأمن السيبراني والخدمات السحابية.',
                  },
                  {
                    title: 'الحلول الاستباقية',
                    desc: 'تركّز الحلول التقنية الاستباقية على اكتشاف ومعالجة المشكلات المحتملة قبل أن تؤثر على التشغيل، باستخدام استراتيجيات وقائية للحفاظ على الأداء المستمر.',
                  },
                  {
                    title: 'تأمين الوصول',
                    desc: 'نمكّن عملاءنا بحلول مبتكرة تواكب احتياجاتهم المتطورة، مع وصول آمن لأحدث التقنيات.',
                  },
                  {
                    title: 'تحسين أداء الأنظمة التقنية',
                    desc: 'نعمل باستمرار على رفع كفاءة الأجهزة والأنظمة والشبكات الداخلية والخارجية من خلال التحسين المستمر.',
                  },
                  {
                    title: 'البنية التحتية المتقاربة (HCI)',
                    desc: 'نركّز على تنفيذ حلول HCI التي توحّد موارد الحوسبة والتخزين والشبكات في نظام واحد عالي الكفاءة.',
                  },
                  {
                    title: 'التشغيل والصيانة',
                    desc: 'نقدم للعملاء الخبرة التقنية اللازمة لدعم إدارة وصيانة الأنظمة، لضمان تشغيل تقني مستمر وموثوق.',
                  },
                ],
              },
            ],
          },
          {
            tag: 'طاقة واستمرارية',
            title: 'حلول الطاقة',
            desc: 'نقدم حلول طاقة متكاملة للجهدين المتوسط والمنخفض، تشمل الهندسة والتصميم والتوريد والتركيب والاختبار والتشغيل.',
            chips: ['أنظمة الجهد المنخفض', 'أنظمة الطاقة الاحتياطية (UPS)', 'حلول الجهد المتوسط'],
            subservices: [
              {
                title: 'أنظمة الجهد المنخفض',
                desc: 'تصميم وتركيب وصيانة احترافية لأنظمة الجهد المنخفض للتطبيقات التجارية والسكنية والصناعية.',
                image: 'images/low-voltage.webp',
              },
              {
                title: 'أنظمة الطاقة الاحتياطية (UPS)',
                desc: 'أنظمة UPS والطاقة الاحتياطية تحافظ على استمرارية الأعمال من خلال المراقبة والإدارة الذكية للطاقة.',
                image: 'images/backup-power.webp',
              },
              {
                title: 'حلول الجهد المتوسط',
                desc: 'تحسين موثوقية واستقرار الشبكة من خلال حلول متقدمة للجهد المتوسط.',
                image: 'images/medium-voltage.webp',
              },
            ],
          },
          {
            tag: 'اتصالات وبنية تحتية',
            title: 'حلول الاتصالات وتقنية المعلومات',
            desc: 'نقدم حلولاً تقنية متكاملة تشمل الاتصال والألياف الضوئية (OSP وFTTX) ومراكز البيانات وأمن الشبكات وشبكات النواة لمزودي الخدمة والبنية التحتية والتخزين.',
            chips: ['حلول الربط والاتصال', 'مراكز البيانات', 'شبكات النواة (ISP)', 'أنظمة المراقبة والمدن الذكية', 'أمن الشبكات', 'حلول التخزين', 'البنية التحتية للشبكات', 'حلول الألياف الضوئية (FTTX)'],
            subservices: [
              {
                title: 'حلول الربط والاتصال',
                desc: 'يشمل ذلك تصميم ونشر الشبكات السلكية واللاسلكية، والتمديدات الهيكلية، وأنظمة الاتصالات الموحدة.',
                image: 'images/connectivity-solutions.webp',
              },
              {
                title: 'مراكز البيانات',
                desc: 'ضمان اتصال موثوق ونقل بيانات سريع من خلال التخطيط والصيانة الشاملة للبنية التحتية لمراكز البيانات.',
                image: 'images/data-center.webp',
              },
              {
                title: 'شبكات النواة (ISP)',
                desc: 'بنية تحتية للتوجيه والتبديل وشبكات MPLS الأساسية بمستوى معايير شبكات النواة لمزودي خدمة الإنترنت.',
                image: 'images/core-network.webp',
              },
              {
                title: 'أنظمة المراقبة والمدن الذكية',
                desc: 'نقدم حلول كاميرات مراقبة متكاملة لمبادرات المدن الآمنة، لضمان مراقبة عالية الكفاءة والجودة.',
                image: 'images/safe-city-cctv.webp',
              },
              {
                title: 'أمن الشبكات',
                desc: 'نقدم حلول أمن شبكات شاملة لحماية الأنظمة الحساسة والبيانات والاتصالات من الوصول غير المصرح به.',
                image: 'images/cyber-security.webp',
              },
              {
                title: 'حلول التخزين',
                desc: 'نقدم حلول تخزين قابلة للتوسع وموثوقة، مصممة لتلبية احتياجات البيانات المتنامية لدى المؤسسات الحديثة.',
                image: 'images/storage-solutions.webp',
              },
              {
                title: 'البنية التحتية للشبكات',
                desc: 'نقدم حلول بنية تحتية متكاملة للشبكات، مصممة خصيصاً لتلبية المتطلبات المتطورة للمؤسسات الحديثة.',
                image: 'images/network-infrastructure.webp',
              },
              {
                title: 'حلول الألياف الضوئية (FTTX)',
                desc: 'نقدم حلول OSP وFTTx متكاملة، تشمل التخطيط والتصميم والتنفيذ والاختبار.',
                image: 'images/osp-fttx.webp',
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
        title: 'تعرّف علينا',
        overview: [
          'شركة أنظمة المعلومات المتقدمة، المملوكة لشركة City Bandit Limited والمؤسسة عام 1998، مؤسسة تقنية متطورة متخصصة في الاتصالات وتقنية المعلومات وتطوير البرمجيات المخصصة. وعلى مدى السنوات، بنت الشركة سمعة قوية في تقديم حلول رقمية موثوقة وقابلة للتوسع ومواكبة للمستقبل، تساعد المؤسسات على التكيف مع التطورات التقنية المتسارعة.',
          'وبالاستفادة من عقود من الخبرة في هذا المجال، تجمع الشركة بين أحدث التقنيات والبنية التحتية الحديثة وأفضل الممارسات لتصميم وتنفيذ حلول ترفع الكفاءة التشغيلية وتعزز الأمن وتسرّع التحول الرقمي. وتتيح لها خبرتها متعددة التخصصات خدمة قطاعات واسعة، بتقديم خدمات مخصصة تتوافق مع الأهداف الاستراتيجية وخطط النمو طويلة المدى لكل عميل.',
          'وبتركيزها الأساسي على الشرق الأوسط، وتحديداً المملكة العربية السعودية، تساهم شركة أنظمة المعلومات المتقدمة بفاعلية في مبادرات التحديث والابتكار الإقليمية. ومن خلال الشراكة مع جهات القطاعين العام والخاص، تقدم الشركة أنظمة عالية الجودة تدعم التنمية المستدامة والتنويع الاقتصادي.',
        ],
        visionTitle: 'رؤيتنا',
        vision: 'أن نكون من بين الشركات الرائدة في تقنية المعلومات، والأمن السيبراني، والذكاء الاصطناعي، والكهرباء، والاتصالات، والمقاولات العامة، من خلال الابتكار المستمر وتسخير الذكاء الاصطناعي لتعزيز الثقة والكفاءة للعملاء في القطاعين العام والخاص.',
        missionTitle: 'رسالتنا',
        mission: 'تسعى شركة أنظمة المعلومات المتقدمة إلى تقديم خدمات متنوعة وموثوقة بجودة عالية وبتكلفة مناسبة، تجمع بين الحداثة والابتكار لتلبية احتياجات العملاء وتجاوز توقعاتهم بكفاءة واحترافية، مع الإسهام في تحقيق رؤية المملكة العربية السعودية 2030.',
        strengths: [
          { title: 'خبرة طويلة', desc: 'بخبرة تمتد لعقود عبر قطاعات متنوعة، نقدم رؤى قيّمة واستراتيجيات مثبتة الفعالية.' },
          { title: 'حلول مخصصة', desc: 'نقدم استراتيجيات مرنة ومصممة خصيصاً لمواجهة التحديات الفريدة لكل عميل.' },
          { title: 'أحدث التقنيات', desc: 'نوظّف أحدث الابتكارات مثل الذكاء الاصطناعي والأتمتة وتحليل البيانات.' },
          { title: 'إنجازات مثبتة', desc: 'سجل حافل من المشاريع الناجحة والعملاء الراضين والشراكات الاستراتيجية التي تعزز سمعتنا.' },
        ],
      },
      whyChooseUs: {
        eyebrow: 'لماذا نحن',
        title: 'نقاط القوة والركائز',
        desc: 'التزامنا بالتميز يضمن نتائج استثنائية باستمرار، تمكّن الأعمال من الحفاظ على تفوقها التنافسي.',
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
        badge: 'نستقبل مشاريع جديدة',
        title: 'لنعمل معاً!',
        desc: 'فريقنا جاهز لمناقشة متطلباتك والرد على استفساراتك. تواصل معنا مباشرة أو عبئ النموذج.',
        hq: 'المقر الرئيسي:',
        hqValue: 'مبنى 7022، حي العقيق، الرياض 13515، المملكة العربية السعودية.',
        phone: 'الجوال:',
        email: 'البريد الإلكتروني:',
        entity: 'اسم الجهة أو الشركة',
        entityPh: 'مثال: وزارة، شركة، مؤسسة',
        entityError: 'الرجاء إدخال اسم صحيح (حروف وأرقام فقط)',
        workEmail: 'البريد الإلكتروني',
        emailError: 'الرجاء إدخال بريد إلكتروني صحيح',
        phoneLabel: 'رقم الجوال',
        phoneError: 'الرجاء إدخال رقم جوال صحيح',
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
        rateLimitError: 'عدد المحاولات من هذا المتصفح كبير — الرجاء الانتظار قليلاً قبل المحاولة مرة أخرى.',
        submit: 'إرسال الطلب',
        success: 'تم استلام طلبك بنجاح. فريقنا سيتواصل معك في أقرب وقت.',
      },
      footer: {
        tagline:
          'شركة أنظمة المعلومات المتقدمة والمقاولات (AIS Contracting) — مملوكة لشركة City Bandit Limited.',
        rights:
          'جميع الحقوق محفوظة © شركة أنظمة المعلومات المتقدمة والمقاولات. الرياض، المملكة العربية السعودية.',
        address: 'مبنى 7022، حي العقيق، الرياض 13515، المملكة العربية السعودية',
        phone: '+966 53 086 7489',
        email: 'info@advaninfo.com',
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
    supportedLngs: ['en', 'ar'],
    // Device locales like "ar-SA" / "en-GB" resolve to "ar" / "en".
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    // Device language by default. Only an explicit toggle is remembered
    // (see rememberLanguage) — never auto-cache the detected value, or a
    // visitor gets stuck on it even after changing their device language.
    // `?lang=ar` / `?lang=en` (the hreflang URLs) wins for that visit.
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: LANG_KEY,
      caches: [],
    },
  });

export function rememberLanguage(lng: 'en' | 'ar') {
  try {
    localStorage.setItem(LANG_KEY, lng);
  } catch {
    // Storage blocked (private mode) — the switch still applies for this visit.
  }
  void i18n.changeLanguage(lng);
}

export default i18n;
