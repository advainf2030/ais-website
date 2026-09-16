import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SERVICES } from '../data';
import ScrollReveal from './ScrollReveal';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

const TAB_KEYS = ['about', 'software', 'cyber', 'power', 'telecom'] as const;
type TabKey = (typeof TAB_KEYS)[number];

const TAB_ANCHORS: Record<TabKey, string> = {
  about: 'about',
  software: 'solutions',
  cyber: 'cyber-security',
  power: 'power',
  telecom: 'telecom',
};

interface ServiceText {
  tag: string;
  title: string;
  desc: string;
  chips: string[];
}

interface Strength {
  title: string;
  desc: string;
}

/* ── About Tab Content ── */
function AboutContent() {
  const { t } = useTranslation();
  const strengths = t('about.strengths', { returnObjects: true }) as unknown as Strength[];

  return (
    <div className="space-y-10">
      {/* Overview */}
      <div>
        <p className="text-[15px] md:text-base leading-7 text-slate-800 font-medium max-w-3xl">
          {t('about.overview')}
        </p>
      </div>

      {/* Vision & Mission — side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-t border-slate-200/80 pt-6">
          <h4 className="text-xs tracking-[0.2em] uppercase text-slate-900 font-extrabold mb-3">Vision</h4>
          <p className="text-[15px] leading-7 text-slate-800 font-medium">{t('about.vision')}</p>
        </div>
        <div className="border-t border-slate-200/80 pt-6">
          <h4 className="text-xs tracking-[0.2em] uppercase text-slate-900 font-extrabold mb-3">Mission</h4>
          <p className="text-[15px] leading-7 text-slate-800 font-medium">{t('about.mission')}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-slate-200/80 pt-8">
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-display font-black tracking-tighter text-slate-900">1998</div>
          <div className="text-[11px] tracking-[0.15em] uppercase text-slate-900 font-bold mt-2">{t('hero.statEstablished')}</div>
        </div>
        <div className="text-center flex flex-col items-center">
          <img alt="Vision 2030" className="h-12 md:h-16 w-auto object-contain" src="logos/vision2030.png" />
          <div className="text-[11px] tracking-[0.15em] uppercase text-slate-900 font-bold mt-2">{t('hero.statAlignment')}</div>
        </div>
        <div className="text-center flex flex-col items-center">
          <img alt="KSA" className="h-12 md:h-16 w-auto object-contain" src="logos/ksa-map.png" />
          <div className="text-[11px] tracking-[0.15em] uppercase text-slate-900 font-bold mt-2">{t('hero.statFocus')}</div>
        </div>
      </div>

      {/* Strengths — editorial list */}
      <div className="border-t border-slate-200/80 pt-8 space-y-0">
        {strengths.map((s, i) => (
          <div key={i} className="flex gap-4 md:gap-6 py-5 border-b border-slate-200/70 last:border-b-0 group">
            <span className="text-[12px] tracking-[0.15em] text-slate-700 font-extrabold mt-1 shrink-0">
              0{i + 1}
            </span>
            <div>
              <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{s.title}</h4>
              <p className="text-[14px] leading-6 text-slate-800 mt-1 font-normal">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Service Tab Content ── */
function ServiceContent({ serviceIndex }: { serviceIndex: number }) {
  const { t } = useTranslation();
  const texts = t('services.cards', { returnObjects: true }) as unknown as ServiceText[];
  const text = texts[serviceIndex];
  const service = SERVICES[serviceIndex];

  if (!text || !service) return null;

  return (
    <div className="space-y-6">
      <p className="text-[15px] md:text-base leading-7 text-slate-800 font-normal max-w-3xl">{text.desc}</p>

      {/* Service items as list */}
      <div className="border-t border-slate-200/80 pt-2">
        {text.chips.map((chip, i) => (
          <div key={chip} className="flex items-center gap-4 py-4 border-b border-slate-200/70 last:border-b-0 group">
            <span className="text-[12px] tracking-[0.15em] text-slate-700 font-extrabold shrink-0">
              0{i + 1}
            </span>
            <span className="text-[15px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {chip}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tab System ── */
export default function TabSystem() {
  const { t } = useTranslation();
  const [active, setActive] = useState<TabKey>('about');
  const tabRefs = useRef<Map<TabKey, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitial = useRef(true);

  const selectTab = (key: TabKey) => {
    setActive(key);
    const btn = tabRefs.current.get(key);
    if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    const btn = tabRefs.current.get(active);
    if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [active]);

  const setTabRef = (key: TabKey) => (el: HTMLButtonElement | null) => {
    if (el) tabRefs.current.set(key, el);
  };

  // Map tab key to content
  const serviceIndexMap: Record<string, number> = {
    software: 0,
    cyber: 1,
    power: 2,
    telecom: 3,
  };

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-20 scroll-mt-28" id="solutions">
      <ScrollReveal>
        {/* Tab bar */}
        <div
          ref={containerRef}
          className="relative flex items-center md:justify-center border-b border-slate-200/80 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-0 scroll-smooth pb-0"
        >
          {TAB_KEYS.map((key) => {
            const isSelected = active === key;
            return (
              <button
                key={key}
                ref={setTabRef(key)}
                type="button"
                onClick={() => selectTab(key)}
                className={`relative shrink-0 px-4 sm:px-5 md:px-6 py-4 text-[13px] md:text-sm transition-all duration-300 whitespace-nowrap ${
                  isSelected
                    ? 'text-slate-950 font-black'
                    : 'text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                {t(`tabs.${key}`)}
                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-2 right-2 h-[3px] bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-10 min-h-[300px]" id={TAB_ANCHORS[active]}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {active === 'about' ? (
                <AboutContent />
              ) : (
                <ServiceContent serviceIndex={serviceIndexMap[active]} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollReveal>
    </section>
  );
}
