import { useEffect, useMemo, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUpRight, MessagesSquare } from 'lucide-react';
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

export default function Hero() {
  const { t, i18n } = useTranslation();
  const wordLevel = (i18n.resolvedLanguage ?? i18n.language) === 'ar';

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const titleA = t('hero.titleA');
  const titleB = t('hero.titleB');
  const totalUnits = useMemo(
    () => splitUnits(titleA, wordLevel).length + splitUnits(titleB, wordLevel).length,
    [titleA, titleB, wordLevel],
  );
  const titleAUnitCount = useMemo(() => splitUnits(titleA, wordLevel).length, [titleA, wordLevel]);

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
      className="max-w-6xl mx-auto px-6 lg:px-8 pt-6 pb-20 text-center flex flex-col items-center relative overflow-hidden"
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
        <span className="text-[11px] md:text-xs tracking-[0.25em] font-bold uppercase text-slate-800 dark:text-slate-300">
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
              text={titleA}
              progress={scrollYProgress}
              startIndex={0}
              totalUnits={totalUnits}
              wordLevel={wordLevel}
            />
          </motion.span>{' '}
          <span className="relative inline-block overflow-visible py-1 px-1">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            >
              <KineticHeadline
                text={titleB}
                progress={scrollYProgress}
                startIndex={titleAUnitCount}
                totalUnits={totalUnits}
                wordLevel={wordLevel}
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
        className="text-lg md:text-xl leading-8 text-slate-800 dark:text-slate-300 max-w-3xl mx-auto mb-12 font-medium relative z-10"
      >
        {t('hero.subtitle')}
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="flex flex-col sm:flex-row items-center gap-4 mb-20 relative z-10"
      >
        <a
          className="btn-shimmer group w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-teal-600 text-white text-sm font-semibold shadow-xl shadow-slate-900/15 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
          href="#solutions"
        >
          {t('hero.explore')}
          <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
        <a
          className="group w-full sm:w-auto px-9 py-4 rounded-2xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/90 dark:border-slate-700/80 text-slate-900 dark:text-white text-sm font-bold hover:bg-white/90 dark:hover:bg-slate-700/80 shadow-lg shadow-slate-900/5 hover:shadow-xl active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2"
          href="#contact"
        >
          {t('hero.contact')}
          <MessagesSquare size={18} className="group-hover:scale-110 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
