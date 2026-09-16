import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

const TAB_KEYS = ['about', 'software', 'telecom', 'power'] as const;
type TabKey = (typeof TAB_KEYS)[number];

const TAB_ANCHORS: Record<TabKey, string> = {
  about: 'about',
  software: 'solutions',
  telecom: 'telecom',
  power: 'power',
};

/* Unsplash images for the About section */
const ABOUT_IMAGE_1 = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
const ABOUT_IMAGE_2 = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

interface SubServiceItem {
  title: string;
  desc: string;
  image: string;
}

interface ServiceText {
  tag: string;
  title: string;
  desc: string;
  chips: string[];
  subservices?: SubServiceItem[];
}

/* ── About Tab Content ── */
function AboutContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-14">
      {/* Section 1: About the Company */}
      <div className="space-y-8">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('about.title')}
          </h3>
          <p className="text-[15px] md:text-base leading-7 text-slate-800 dark:text-slate-300 font-medium max-w-3xl">
            {t('about.overview')}
          </p>
        </div>
        {/* Image after overview */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-800">
          <img
            src={ABOUT_IMAGE_1}
            alt="AIS Company Office"
            className="w-full h-56 md:h-72 object-cover"
          />
        </div>
      </div>

      {/* Section 2: Vision & Mission */}
      <div className="space-y-8">
        <div className="space-y-8">
          <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6">
            <h4 className="text-xs tracking-[0.2em] uppercase text-teal-700 dark:text-emerald-400 font-extrabold mb-3">
              {t('about.visionTitle')}
            </h4>
            <p className="text-[15px] leading-7 text-slate-800 dark:text-slate-300 font-medium max-w-3xl">
              {t('about.vision')}
            </p>
          </div>
          <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6">
            <h4 className="text-xs tracking-[0.2em] uppercase text-teal-700 dark:text-emerald-400 font-extrabold mb-3">
              {t('about.missionTitle')}
            </h4>
            <p className="text-[15px] leading-7 text-slate-800 dark:text-slate-300 font-medium max-w-3xl">
              {t('about.mission')}
            </p>
          </div>
        </div>
        {/* Image after Vision & Mission */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-800">
          <img
            src={ABOUT_IMAGE_2}
            alt="AIS Vision 2030"
            className="w-full h-56 md:h-72 object-cover"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Accordion Row ── */
function AccordionRow({
  title,
  desc,
  isOpen,
  onToggle,
  index,
}: {
  title: string;
  desc: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className={`border-b border-slate-200/70 dark:border-slate-800/80 transition-colors duration-300 ${
        isOpen
          ? 'bg-white/30 dark:bg-slate-800/50'
          : 'hover:bg-white/20 dark:hover:bg-slate-800/30'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-4 md:px-6 gap-4 text-start group cursor-pointer"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-[11px] tracking-[0.15em] text-slate-400 dark:text-slate-500 font-bold shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h4
            className={`text-[15px] md:text-base font-semibold transition-colors duration-300 ${
              isOpen
                ? 'text-teal-700 dark:text-emerald-400'
                : 'text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-emerald-400'
            }`}
          >
            {title}
          </h4>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-emerald-400 transition-colors"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-6 pb-5 ps-[calc(1rem+2.75rem)] md:ps-[calc(1.5rem+2.75rem)]">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Service Tab Content (Split Layout + Accordion) ── */
function ServiceContent({ serviceIndex }: { serviceIndex: number }) {
  const { t } = useTranslation();
  const texts = t('services.cards', { returnObjects: true }) as unknown as ServiceText[];
  const text = texts[serviceIndex];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!text) return null;

  const heroImage = text.subservices?.[0]?.image ?? '';

  const toggleAccordion = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="space-y-8">
      {/* Service overview text */}
      <p className="text-[15px] md:text-base leading-7 text-slate-800 dark:text-slate-300 font-medium max-w-3xl">
        {text.desc}
      </p>

      {/* Split layout: image left, accordion right */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left — image */}
        <div className="lg:w-[40%] shrink-0">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-800 h-full min-h-[320px] lg:min-h-[400px] relative">
            <img
              src={heroImage}
              alt={text.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            {/* Tag badge */}
            <div className="absolute bottom-4 start-4 z-10">
              <span className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-bold text-white bg-white/20 backdrop-blur-md rounded-lg border border-white/30">
                {text.tag}
              </span>
            </div>
          </div>
        </div>

        {/* Right — accordion */}
        <div className="lg:w-[60%] flex flex-col">
          <div className="glass-card rounded-2xl overflow-hidden flex-1">
            <div className="border-b border-slate-200/70 dark:border-slate-800 px-4 md:px-6 py-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {text.title}
              </h3>
            </div>
            {text.subservices?.map((sub, i) => (
              <AccordionRow
                key={i}
                title={sub.title}
                desc={sub.desc}
                isOpen={openIndex === i}
                onToggle={() => toggleAccordion(i)}
                index={i}
              />
            ))}
          </div>
        </div>
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

  // Listen to navigation events from Navbar & URL hash changes
  useEffect(() => {
    const handleSwitch = (e: Event) => {
      const custom = e as CustomEvent<TabKey>;
      if (TAB_KEYS.includes(custom.detail)) {
        selectTab(custom.detail);
      }
    };
    const handleHash = () => {
      const h = window.location.hash.replace('#', '') as TabKey;
      if (TAB_KEYS.includes(h)) {
        selectTab(h);
      }
    };
    window.addEventListener('ais:switch-tab', handleSwitch);
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => {
      window.removeEventListener('ais:switch-tab', handleSwitch);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const setTabRef = (key: TabKey) => (el: HTMLButtonElement | null) => {
    if (el) tabRefs.current.set(key, el);
  };

  // Map tab key to service card index:
  // services.cards[0] = Software Solutions
  // services.cards[1] = Power Solutions
  // services.cards[2] = Telecom & ICT
  const serviceIndexMap: Record<string, number> = {
    software: 0,
    power: 1,
    telecom: 2,
  };

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-20 scroll-mt-28" id="solutions">
      <ScrollReveal>
        {/* Tab bar */}
        <div
          ref={containerRef}
          className="relative flex items-center md:justify-center border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-0 scroll-smooth pb-0"
        >
          {TAB_KEYS.map((key) => {
            const isSelected = active === key;
            return (
              <button
                key={key}
                ref={setTabRef(key)}
                type="button"
                onClick={() => selectTab(key)}
                className={`relative shrink-0 px-4 sm:px-5 md:px-6 py-4 text-[13px] md:text-sm transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'text-slate-950 dark:text-emerald-400 font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold'
                }`}
              >
                {t(`tabs.${key}`)}
                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-2 right-2 h-[3px] bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 rounded-full"
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
