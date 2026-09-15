import { motion } from 'framer-motion';
import { ArrowUpRight, MessagesSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <section
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
        <span className="hidden md:block w-10 h-[1px] bg-slate-300" />
        <span className="text-[10px] md:text-xs tracking-[0.25em] font-semibold uppercase text-slate-500">
          {t('hero.eyebrow')}
        </span>
        <span className="hidden md:block w-10 h-[1px] bg-slate-300" />
      </motion.div>

      {/* Main headline — staggered word reveal */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="text-slate-900 font-display font-black tracking-tight max-w-4xl mx-auto text-[2.75rem] leading-[1.15] md:text-[4.5rem] md:leading-[1.1] mb-7 overflow-visible relative z-10"
      >
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
          {t('hero.titleA')}
        </motion.span>{' '}
        <span className="relative inline-block overflow-visible py-1 px-1">
          <motion.span
            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            {t('hero.titleB')}
          </motion.span>
          {/* Underline decoration */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
            className="absolute -bottom-0.5 left-1 right-1 h-[3px] bg-gradient-to-r from-emerald-500/50 via-teal-400/50 to-cyan-500/50 rounded-full origin-left"
          />
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="text-lg md:text-xl leading-8 text-slate-500 max-w-3xl mx-auto mb-12 font-normal relative z-10"
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
          className="btn-shimmer group w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white text-sm font-semibold shadow-xl shadow-slate-900/15 hover:shadow-2xl hover:shadow-slate-900/25 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
          href="#solutions"
        >
          {t('hero.explore')}
          <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
        <a
          className="group w-full sm:w-auto px-9 py-4 rounded-2xl bg-white/50 backdrop-blur-2xl border border-white/80 text-slate-800 text-sm font-semibold hover:bg-white/70 shadow-lg shadow-slate-900/5 hover:shadow-xl active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2"
          href="#contact"
        >
          {t('hero.contact')}
          <MessagesSquare size={18} className="group-hover:scale-110 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
