import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

/* Corporate-precise easing — tight, no bounce */
const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

const TAB_KEYS = ['about', 'software', 'telecom', 'power'] as const;
type TabKey = (typeof TAB_KEYS)[number];

/* Default hero images per service category (shown when no sub-row is expanded) */
const CATEGORY_HERO_IMAGES: Record<number, string> = {
  0: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', // Software
  1: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80', // Power — high-voltage transmission towers
  2: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', // Telecom — data center server room
};

/* Unsplash images for the About section */
const ABOUT_IMAGE_1 = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
const ABOUT_IMAGE_2 = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

interface SubServiceItem {
  title: string;
  desc: string;
  image: string;
}

interface GroupItem {
  title: string;
  desc: string;
}

interface ServiceGroup {
  title: string;
  image: string;
  items: GroupItem[];
}

interface ServiceText {
  tag: string;
  title: string;
  desc: string;
  chips: string[];
  subservices?: SubServiceItem[];
  groups?: ServiceGroup[];
}

/* ── About Tab Content ── */
function AboutContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-14">
      {/* Section 1: About the Company */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            {t('about.title')}
          </h3>
          {(t('about.overview', { returnObjects: true }) as unknown as string[]).map((para, i) => (
            <p
              key={i}
              className="text-[15px] md:text-base leading-7 text-slate-800 dark:text-slate-300 font-medium max-w-3xl"
            >
              {para}
            </p>
          ))}
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
  panelId,
  headerId,
}: {
  title: string;
  desc: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  panelId: string;
  headerId: string;
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
        id={headerId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
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
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
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

/* ── Accordion Group (collapsible category — holds nested AccordionRows) ── */
function AccordionGroup({
  title,
  isOpen,
  onToggle,
  index,
  panelId,
  headerId,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  panelId: string;
  headerId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-200/70 dark:border-slate-800/80">
      <button
        type="button"
        id={headerId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`w-full flex items-center justify-between py-5 px-4 md:px-6 gap-4 text-start group cursor-pointer transition-colors duration-300 ${
          isOpen ? 'bg-teal-50/60 dark:bg-slate-800/60' : 'hover:bg-white/20 dark:hover:bg-slate-800/30'
        }`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-[11px] tracking-[0.15em] text-slate-400 dark:text-slate-500 font-bold shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h4
            className={`text-[15px] md:text-base font-bold transition-colors duration-300 ${
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
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Dynamic Image Panel (crossfade on sub-service selection) ── */
function DynamicImagePanel({
  currentImage,
  imageKey,
  tag,
  activeLabel,
}: {
  currentImage: string;
  imageKey: string;
  tag: string;
  activeLabel?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-800 h-full min-h-[320px] lg:min-h-[400px] relative">
      <AnimatePresence mode="wait">
        <motion.img
          key={imageKey}
          src={currentImage}
          alt={activeLabel ?? tag}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </AnimatePresence>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none z-[1]" />
      {/* Tag badge */}
      <div className="absolute bottom-4 start-4 z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={activeLabel ?? tag}
            className="inline-block px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-bold text-white bg-white/20 backdrop-blur-md rounded-lg border border-white/30"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {activeLabel ?? tag}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Service Tab Content (Split Layout + Accordion + Dynamic Image Swap) ── */
function ServiceContent({ serviceIndex }: { serviceIndex: number }) {
  const { t } = useTranslation();
  const texts = t('services.cards', { returnObjects: true }) as unknown as ServiceText[];
  const text = texts[serviceIndex];
  const hasGroups = !!text?.groups?.length;

  /* Flat accordion state (Power / Telecom — no grouping) */
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  /* Grouped accordion state (Software — category, then service within it) */
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [openItem, setOpenItem] = useState<number | null>(null);

  const accordionRef = useRef<HTMLDivElement>(null);

  /* Auto-collapse: close expanded row(s) when clicking outside the accordion */
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        accordionRef.current &&
        !accordionRef.current.contains(e.target as Node)
      ) {
        setOpenIndex(null);
        setOpenGroup(null);
        setOpenItem(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (openIndex !== null || openGroup !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openIndex, openGroup, handleClickOutside]);

  /* Auto-collapse: close expanded row(s) when mouse leaves accordion (desktop only) */
  const handleMouseLeave = useCallback(() => {
    if (openIndex === null && openGroup === null) return;
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setOpenIndex(null);
      setOpenGroup(null);
      setOpenItem(null);
    }
  }, [openIndex, openGroup]);

  if (!text) return null;

  const defaultHero = CATEGORY_HERO_IMAGES[serviceIndex] ?? text.subservices?.[0]?.image ?? '';

  /* Determine which image to show:
     - Grouped cards: the open category's representative image (services within
       it share one image — swapping per-row would just flash between near-
       identical stock photos)
     - Flat cards: the open row's own image, otherwise the category default hero */
  const currentImage = hasGroups
    ? (openGroup !== null ? text.groups![openGroup].image : defaultHero)
    : ((openIndex !== null ? text.subservices?.[openIndex]?.image : undefined) ?? defaultHero);
  const imageKey = hasGroups
    ? (openGroup !== null ? `group-${serviceIndex}-${openGroup}` : `hero-${serviceIndex}`)
    : (openIndex !== null ? `sub-${serviceIndex}-${openIndex}` : `hero-${serviceIndex}`);
  const activeLabel = hasGroups
    ? (openGroup !== null ? text.groups![openGroup].title : undefined)
    : (openIndex !== null ? text.subservices?.[openIndex]?.title : undefined);

  const toggleAccordion = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };
  const toggleGroup = (i: number) => {
    setOpenGroup(openGroup === i ? null : i);
    setOpenItem(null);
  };
  const toggleItem = (i: number) => {
    setOpenItem(openItem === i ? null : i);
  };

  return (
    <div className="space-y-8">
      {/* Service overview text */}
      <p className="text-[15px] md:text-base leading-7 text-slate-800 dark:text-slate-300 font-medium max-w-3xl">
        {text.desc}
      </p>

      {/* Split layout: dynamic image left, accordion right */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left — dynamic image panel */}
        <div className="lg:w-[40%] shrink-0">
          <DynamicImagePanel
            currentImage={currentImage}
            imageKey={imageKey}
            tag={text.tag}
            activeLabel={activeLabel}
          />
        </div>

        {/* Right — accordion (auto-collapses on mouse leave / click outside) */}
        <div
          ref={accordionRef}
          className="lg:w-[60%] flex flex-col"
          onMouseLeave={handleMouseLeave}
        >
          <div className="glass-card rounded-2xl overflow-hidden flex-1">
            <div className="border-b border-slate-200/70 dark:border-slate-800 px-4 md:px-6 py-4">
              <h3 className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {text.title}
              </h3>
            </div>
            {hasGroups
              ? text.groups!.map((g, gi) => (
                  <AccordionGroup
                    key={gi}
                    title={g.title}
                    isOpen={openGroup === gi}
                    onToggle={() => toggleGroup(gi)}
                    index={gi}
                    headerId={`group-header-${serviceIndex}-${gi}`}
                    panelId={`group-panel-${serviceIndex}-${gi}`}
                  >
                    {g.items.map((it, ii) => (
                      <AccordionRow
                        key={ii}
                        title={it.title}
                        desc={it.desc}
                        isOpen={openGroup === gi && openItem === ii}
                        onToggle={() => toggleItem(ii)}
                        index={ii}
                        headerId={`accordion-header-${serviceIndex}-${gi}-${ii}`}
                        panelId={`accordion-panel-${serviceIndex}-${gi}-${ii}`}
                      />
                    ))}
                  </AccordionGroup>
                ))
              : text.subservices?.map((sub, i) => (
                  <AccordionRow
                    key={i}
                    title={sub.title}
                    desc={sub.desc}
                    isOpen={openIndex === i}
                    onToggle={() => toggleAccordion(i)}
                    index={i}
                    headerId={`accordion-header-${serviceIndex}-${i}`}
                    panelId={`accordion-panel-${serviceIndex}-${i}`}
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

  const scrollTabIntoContainer = (key: TabKey) => {
    const btn = tabRefs.current.get(key);
    const container = containerRef.current;
    if (btn && container) {
      const left = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
      container.scrollTo({ left, behavior: 'smooth' });
    }
  };

  const selectTab = (key: TabKey) => {
    setActive(key);
    scrollTabIntoContainer(key);
  };

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    scrollTabIntoContainer(active);
  }, [active]);

  // Listen to navigation events from Navbar
  useEffect(() => {
    const handleSwitch = (e: Event) => {
      const custom = e as CustomEvent<TabKey>;
      if (TAB_KEYS.includes(custom.detail)) {
        selectTab(custom.detail);
      }
    };
    window.addEventListener('ais:switch-tab', handleSwitch);
    return () => {
      window.removeEventListener('ais:switch-tab', handleSwitch);
    };
  }, []);

  const setTabRef = (key: TabKey) => (el: HTMLButtonElement | null) => {
    if (el) tabRefs.current.set(key, el);
  };

  // Keyboard navigation for WAI-ARIA tabs pattern
  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    const isRtl = document.documentElement.dir === 'rtl';
    const idx = TAB_KEYS.indexOf(active);
    let nextIdx = idx;

    switch (e.key) {
      case 'ArrowRight':
        nextIdx = isRtl
          ? (idx - 1 + TAB_KEYS.length) % TAB_KEYS.length
          : (idx + 1) % TAB_KEYS.length;
        break;
      case 'ArrowLeft':
        nextIdx = isRtl
          ? (idx + 1) % TAB_KEYS.length
          : (idx - 1 + TAB_KEYS.length) % TAB_KEYS.length;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = TAB_KEYS.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextKey = TAB_KEYS[nextIdx];
    selectTab(nextKey);
    // Move focus to the newly selected tab
    tabRefs.current.get(nextKey)?.focus();
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
    <section className="relative z-30 max-w-5xl mx-auto px-6 lg:px-8 py-20 scroll-mt-28" id="solutions">
      <ScrollReveal>
        {/* Tab bar */}
        <div
          ref={containerRef}
          role="tablist"
          aria-label="Service categories"
          className="relative flex items-center md:justify-center border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-0 scroll-smooth pb-0"
          onKeyDown={handleTabKeyDown}
        >
          {TAB_KEYS.map((key) => {
            const isSelected = active === key;
            return (
              <button
                key={key}
                ref={setTabRef(key)}
                type="button"
                role="tab"
                id={`tab-${key}`}
                aria-selected={isSelected}
                aria-controls={`tabpanel-${key}`}
                tabIndex={isSelected ? 0 : -1}
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
        <div
          className="mt-10 min-h-[300px]"
          role="tabpanel"
          id={`tabpanel-${active}`}
          aria-labelledby={`tab-${active}`}
          tabIndex={0}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: EASE }}
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
