import { useState, useRef, useEffect, useCallback } from 'react';
import { BeamScene, RevealImage, ZoomScene } from './AboutScenes';
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
  0: 'images/software-solutions.webp', // Software — digital engineering and code workstation
  1: 'images/medium-voltage.webp', // Power — industrial medium-voltage switchgear substation
  2: 'images/telecom-tower.webp', // Telecom — 5G cellular communication tower and antennas
};

/* Curated technical architectural imagery for the About section (100% human-free) */
const ABOUT_IMAGE_1 = 'images/about-building.webp';
const ABOUT_IMAGE_2 = 'images/about-tower.webp';
const ABOUT_IMAGE_2_SRCSET = 'images/about-tower-640.webp 640w, images/about-tower.webp 1200w';

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
// One type scale for the three scene headings and their text
const SCENE_TITLE = 'text-4xl sm:text-5xl lg:text-6xl';
const SCENE_TEXT = 'text-lg md:text-xl leading-8 md:leading-9 text-slate-800 dark:text-slate-300 font-medium max-w-3xl';

function AboutContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-14">
      {/* Section 1: About the Company */}
      <div className="space-y-8">
        <BeamScene
          id="about-overview"
          title={t('tabs.about')}
          subtitle={t('about.title')}
          paragraphs={t('about.overview', { returnObjects: true }) as unknown as string[]}
          titleClassName={SCENE_TITLE}
          subtitleClassName="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4"
          paragraphClassName={SCENE_TEXT}
        />
        {/* Image after overview */}
        <RevealImage
          id="about-image-1"
          className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-800"
          src={ABOUT_IMAGE_1}
          alt="AIS Company Office"
          width={1200}
          height={730}
          loading="eager"
          fetchPriority="low"
          decoding="async"
          imgClassName="w-full h-56 md:h-72 object-cover"
        />
      </div>

      {/* Section 2: Vision & Mission */}
      <div className="space-y-8">
        <div className="space-y-8">
          <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6">
            <ZoomScene
              id="about-vision"
              title={t('about.visionTitle')}
              text={t('about.vision')}
              titleClassName={`${SCENE_TITLE} mb-4`}
              paragraphClassName={SCENE_TEXT}
            />
          </div>
          <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6">
            <ZoomScene
              id="about-mission"
              title={t('about.missionTitle')}
              text={t('about.mission')}
              titleClassName={`${SCENE_TITLE} mb-4`}
              paragraphClassName={SCENE_TEXT}
            />
          </div>
        </div>
        {/* Image after Vision & Mission */}
        <RevealImage
          id="about-image-2"
          className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-800"
          src={ABOUT_IMAGE_2}
          srcSet={ABOUT_IMAGE_2_SRCSET}
          sizes="(min-width: 768px) 1100px, 100vw"
          alt="AIS Vision 2030"
          width={1200}
          height={800}
          loading="eager"
          fetchPriority="low"
          decoding="async"
          imgClassName="w-full h-56 md:h-72 object-cover"
        />
      </div>
    </div>
  );
}

/* Visual order of row i in the two-column grid (md+). An item opened in the
   second column swaps places with its neighbour in the first, so its
   description opens directly beneath it — otherwise it read as belonging to
   the item opposite. Closing puts both back. DOM order never changes. */
function gridOrder(i: number, open: number | null) {
  const swap = open !== null && open % 2 === 1;
  let header = i * 10;
  if (swap && i === open) header = (open - 1) * 10;
  if (swap && i === open - 1) header = open * 10;
  return { header, panel: i * 10 + 5 };
}

/* ── Accordion Row ── */
function AccordionRow({
  title,
  desc,
  isOpen,
  onToggle,
  panelId,
  headerId,
  order,
  level = 3,
}: {
  title: string;
  desc: string;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
  headerId: string;
  order: { header: number; panel: number };
  level?: 3 | 4;
}) {
  const Heading = level === 4 ? 'h4' : 'h3';
  const panelRef = useRef<HTMLDivElement>(null);
  /* True only while the CURRENT open transition is still expanding — read by
     the motion.div's onAnimationComplete below so a later close (exit
     animation finishing) doesn't also trigger a scroll. A fixed setTimeout
     was tried first but a slow frame or a delayed re-render could leave it
     firing before the row had actually reached its final height. */
  const justOpenedRef = useRef(false);

  const handleClick = () => {
    justOpenedRef.current = !isOpen;
    onToggle();
  };

  /* Header and description are separate grid items: the header keeps its own
     column, and the open description spans the full row beneath it. The parent
     grid uses `grid-flow-row-dense`, so the header's neighbour stays beside it
     instead of the header jumping down a row and leaving an empty cell. */
  return (
    <>
    {/* While open, the header takes the panel's tint and drops its divider, so
        it reads as a tab joined to its description — whichever column it's in. */}
    <motion.div
      layout="position"
      transition={{ layout: { duration: 0.35, ease: EASE } }}
      style={{ '--grid-order': order.header } as React.CSSProperties}
      className={`md:order-(--grid-order) border-b transition-colors duration-300 ${
        isOpen
          ? 'bg-teal-50/40 dark:bg-slate-800/30 border-transparent'
          : 'border-slate-200/70 dark:border-slate-800/80'
      }`}
    >
      <Heading className="m-0">
        <button
          type="button"
          id={headerId}
          onClick={handleClick}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={`w-full flex items-center justify-between py-5 px-4 md:px-6 gap-4 text-start group cursor-pointer transition-colors duration-300 ${
            isOpen ? '' : 'hover:bg-white/20 dark:hover:bg-slate-800/30'
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                isOpen ? 'bg-teal-600 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
              }`}
              aria-hidden="true"
            />
            <span
              className={`text-[15px] md:text-base font-normal transition-colors duration-300 ${
                isOpen
                  ? 'text-teal-700 dark:text-emerald-400'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-emerald-400'
              }`}
            >
              {title}
            </span>
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
      </Heading>
    </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={panelRef}
            key="content"
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onAnimationComplete={() => {
              if (justOpenedRef.current) {
                justOpenedRef.current = false;
                panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
            style={{ '--grid-order': order.panel } as React.CSSProperties}
            className="md:order-(--grid-order) overflow-hidden md:col-span-2 border-b border-slate-200/70 dark:border-slate-800/80 bg-teal-50/40 dark:bg-slate-800/30 scroll-mt-32"
          >
            {/* Full row width so the description reads as ~2 lines of prose.
                Left edge lines up with the title text (past the dot + gap:
                0.375rem dot + 1rem gap = 1.375rem), not the bullet itself. */}
            <div className="ps-[2.375rem] md:ps-[2.875rem] pe-4 md:pe-6 py-4">
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Accordion Group (collapsible category — holds nested AccordionRows) ── */
function AccordionGroup({
  title,
  isOpen,
  onToggle,
  panelId,
  headerId,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
  headerId: string;
  children: React.ReactNode;
}) {
  const groupRef = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(false);

  const handleClick = () => {
    justOpenedRef.current = !isOpen;
    onToggle();
  };

  return (
    <div ref={groupRef} className="border-b border-slate-200/70 dark:border-slate-800/80 scroll-mt-32">
      <h3 className="m-0">
        <button
          type="button"
          id={headerId}
          onClick={handleClick}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={`w-full flex items-center justify-between py-5 px-4 md:px-6 gap-4 text-start group cursor-pointer transition-colors duration-300 ${
            isOpen ? 'bg-teal-50/60 dark:bg-slate-800/60' : 'hover:bg-white/20 dark:hover:bg-slate-800/30'
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                isOpen ? 'bg-teal-600 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
              }`}
              aria-hidden="true"
            />
            <span
              className={`text-[15px] md:text-base font-normal transition-colors duration-300 ${
                isOpen
                  ? 'text-teal-700 dark:text-emerald-400'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-emerald-400'
              }`}
            >
              {title}
            </span>
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
      </h3>

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
            onAnimationComplete={() => {
              if (justOpenedRef.current) {
                justOpenedRef.current = false;
                groupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
            className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/30"
          >
            {/* Two-column grid on desktop — a long service list (e.g. Cyber Security's
                8 items) no longer pushes the last row's content below the fold when
                expanded. `items-start` keeps a shorter neighbor from stretching to
                match a taller expanded cell in the same row. */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense md:items-start">
              {children}
            </div>
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
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/40 dark:border-slate-800 h-full min-h-[224px] sm:min-h-[320px] lg:min-h-[400px] relative">
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

      {/* Split layout: dynamic image left, accordion right.
          `items-start` (not `items-stretch`) lets each column size to its own
          content — the accordion no longer gets force-stretched to the image's
          height, which left a block of dead glass space below a short 2-col grid. */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left — dynamic image panel */}
        <div className="w-full lg:w-[30%] shrink-0 lg:sticky lg:top-28 lg:self-start">
          <DynamicImagePanel
            currentImage={currentImage}
            imageKey={imageKey}
            tag={text.tag}
            activeLabel={activeLabel}
          />
        </div>

        {/* Right — accordion (collapses on click outside only; stays open on mouse-leave) */}
        <div
          ref={accordionRef}
          className="w-full lg:w-[70%] min-w-0 flex flex-col"
        >
          <div className="glass-card rounded-2xl overflow-hidden flex-1">
            <div className="border-b border-slate-200/70 dark:border-slate-800 px-4 md:px-6 py-4">
              <h2 className="font-display text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                {text.title}
              </h2>
            </div>
            {hasGroups
              ? text.groups!.map((g, gi) => (
                  <AccordionGroup
                    key={gi}
                    title={g.title}
                    isOpen={openGroup === gi}
                    onToggle={() => toggleGroup(gi)}
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
                        order={gridOrder(ii, openGroup === gi ? openItem : null)}
                        headerId={`accordion-header-${serviceIndex}-${gi}-${ii}`}
                        panelId={`accordion-panel-${serviceIndex}-${gi}-${ii}`}
                        level={4}
                      />
                    ))}
                  </AccordionGroup>
                ))
              : (
                  <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-row-dense md:items-start">
                    {text.subservices?.map((sub, i) => (
                      <AccordionRow
                        key={i}
                        title={sub.title}
                        desc={sub.desc}
                        isOpen={openIndex === i}
                        onToggle={() => toggleAccordion(i)}
                        order={gridOrder(i, openIndex)}
                        headerId={`accordion-header-${serviceIndex}-${i}`}
                        panelId={`accordion-panel-${serviceIndex}-${i}`}
                      />
                    ))}
                  </div>
                )}
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
    <section className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-2 md:pt-4 pb-10 md:pb-20 scroll-mt-24" id="solutions">
      <ScrollReveal>
        {/* Tab bar — the fixed Navbar's own links (About / Software / Telecom / Power)
            already switch these same tabs from anywhere on the page, so this in-page
            bar is only needed where the Navbar collapses to a hamburger (< lg).
            Showing both at once on desktop read as a duplicate navbar. */}
        <div
          ref={containerRef}
          role="tablist"
          aria-label="Service categories"
          className="lg:hidden relative flex items-center md:justify-center border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-hide px-4 sm:px-6 md:px-0 scroll-smooth pb-0 [mask-image:linear-gradient(to_right,transparent,black_28px,black_calc(100%-28px),transparent)] md:[mask-image:none]"
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
                aria-controls={isSelected ? `tabpanel-${key}` : undefined}
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

        {/* Desktop-only current-section label — the tab bar above is hidden at this
            width (the fixed Navbar's links do the switching instead), so this keeps
            a lightweight, non-interactive hint of which section is showing. */}
        {active !== 'about' && (
          <div className="hidden lg:block mb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-emerald-400">
              {t(`tabs.${active}`)}
            </span>
          </div>
        )}

        {/* Tab content */}
        <div
          className="mt-6 md:mt-10 lg:mt-4 min-h-[300px]"
          role="tabpanel"
          id={`tabpanel-${active}`}
          aria-label={t(`tabs.${active}`)}
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
