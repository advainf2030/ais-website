import { useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, MessagesSquare, ScanSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import KineticHeadline, { splitUnits } from './KineticHeadline';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { y: 32, opacity: 0 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.75, delay: 0.12 * i, ease: EASE },
  }),
};

/* Particle positions — spread around the hero area */
const PARTICLE_POSITIONS = [
  { top: '10%', left: '15%' },
  { top: '20%', right: '20%' },
  { top: '35%', left: '8%' },
  { top: '15%', right: '10%' },
  { top: '45%', right: '25%' },
  { top: '30%', left: '25%' },
];

export default function Hero({ ready = true }: { ready?: boolean }) {
  const { t, i18n } = useTranslation();
  const wordLevel = (i18n.resolvedLanguage ?? i18n.language) === 'ar';
  // Waits for the splash screen so it isn't played behind it.
  const scanReveal = ready;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const titleA = t('hero.titleA');
  const titleB = t('hero.titleB');
  // Split once and reuse — each string no longer gets re-split per render
  // (previously once for the count, once for the total, and again inside
  // KineticHeadline itself).
  const titleAUnits = useMemo(() => splitUnits(titleA, wordLevel), [titleA, wordLevel]);
  const titleBUnits = useMemo(() => splitUnits(titleB, wordLevel), [titleB, wordLevel]);
  const totalUnits = titleAUnits.length + titleBUnits.length;

  // Same imperative-opacity approach as KineticHeadline (see its comment):
  // a style-prop-bound opacity on an element that also has initial/animate
  // props does not clamp correctly once scroll passes its range.
  const underlineRef = useRef<HTMLSpanElement>(null);
  const applyUnderlineOpacity = (v: number) => {
    if (!underlineRef.current) return;
    underlineRef.current.style.opacity = String(1 - Math.min(Math.max(v / 0.2, 0), 1));
  };
  useMotionValueEvent(scrollYProgress, 'change', applyUnderlineOpacity);
  useEffect(() => applyUnderlineOpacity(scrollYProgress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      className="max-w-6xl mx-auto px-6 lg:px-8 pt-8 md:pt-[6vh] pb-20 min-h-[calc(100svh-7rem)] md:min-h-[calc(100svh-8rem)] text-center flex flex-col items-center justify-start relative overflow-hidden"
      id="about"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {PARTICLE_POSITIONS.map((pos, i) => (
          <span
            key={i}
            className="hero-particle"
            style={pos}
          />
        ))}
      </div>

      {/* Eyebrow — editorial minimalism */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="flex items-center gap-4 justify-center mb-10 relative z-10"
      >
        <span className="hidden md:block w-10 h-[1px] bg-slate-400/60 dark:bg-slate-600" />
        <span className="text-[11px] md:text-xs tracking-[0.25em] rtl:tracking-normal font-bold uppercase text-slate-900 dark:text-slate-100 hero-text-halo">
          {t('hero.eyebrow')}
        </span>
        <span className="hidden md:block w-10 h-[1px] bg-slate-400/60 dark:bg-slate-600" />
      </motion.div>

      {/* Main headline — staggered entrance reveal, then kinetic scroll-dissolve */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="text-slate-900 dark:text-white font-display font-black tracking-tight max-w-4xl mx-auto text-[2.75rem] leading-[1.15] md:text-[4.5rem] md:leading-[1.1] mb-7 overflow-visible relative z-10"
      >
        {/* Full text stays available to assistive tech; the per-unit spans below are decorative */}
        <span className="sr-only">
          {titleA} {titleB}
        </span>
        <span aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <KineticHeadline
              units={titleAUnits}
              progress={scrollYProgress}
              startIndex={0}
              totalUnits={totalUnits}
            />
          </motion.span>{' '}
          <span className="relative inline-block overflow-visible py-1 px-1">
            {scanReveal && <span className="scan-reveal-beam" />}
            <motion.span
              className={`inline-block ${scanReveal ? 'scan-reveal-text' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            >
              <KineticHeadline
                units={titleBUnits}
                progress={scrollYProgress}
                startIndex={titleAUnits.length}
                totalUnits={totalUnits}
                className="text-teal-800 dark:text-transparent dark:bg-gradient-to-r dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 dark:bg-clip-text inline-block pb-1"
              />
            </motion.span>
            {/* Underline decoration */}
            <motion.span
              ref={underlineRef}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
              className="absolute -bottom-1.5 md:-bottom-2 left-1 right-1 h-[3px] bg-gradient-to-r from-teal-600/60 via-emerald-500/60 to-teal-600/60 dark:from-teal-400/60 dark:via-emerald-400/60 dark:to-cyan-400/60 rounded-full origin-left"
            />
          </span>
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="text-lg md:text-xl leading-8 text-slate-900 dark:text-slate-100 max-w-3xl mx-auto mb-12 font-medium relative z-10"
      >
        {t('hero.subtitle')}
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="flex flex-col sm:flex-row items-center gap-4 relative z-10"
      >
        <a
          className="btn-shimmer group w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-teal-600 text-white text-sm font-semibold shadow-xl shadow-slate-900/15 hover:shadow-[0_0_0_3px_rgba(0,174,239,0.3),0_14px_30px_-8px_rgba(0,174,239,0.35)] hover:border-emerald-400/60 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5 border border-white/10"
          href="#solutions"
        >
          {t('hero.explore')}
          <span className="relative flex w-[18px] h-[18px] overflow-hidden" aria-hidden="true">
            <ScanSearch size={18} className="text-emerald-300/80 group-hover:text-emerald-300 transition-colors duration-300" />
            <span className="bio-scan-line [--scan-travel:18px]" />
          </span>
        </a>
        <a
          className="group w-full sm:w-auto px-9 py-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm font-bold hover:bg-white/90 dark:hover:bg-slate-700/80 hover:border-teal-500/50 dark:hover:border-emerald-400/50 shadow-lg shadow-slate-900/5 hover:shadow-xl active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2.5"
          href="#contact"
        >
          {t('hero.contact')}
          <span className="relative flex items-center justify-center w-[18px] h-[18px]" aria-hidden="true">
            <span className="signal-ring" />
            <span className="signal-ring [animation-delay:0.6s]" />
            <MessagesSquare size={18} className="relative text-teal-700 dark:text-emerald-400" />
          </span>
        </a>
      </motion.div>

      {/* Scroll cue — the hero fills the screen, so point to what's below */}
      <motion.a
        href="#solutions"
        aria-label={t('hero.scrollCue')}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.6, delay: ready ? 1.2 : 0 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 p-2 text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-emerald-400 transition-colors"
      >
        <ChevronDown size={28} strokeWidth={1.5} className="scroll-chevron" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
