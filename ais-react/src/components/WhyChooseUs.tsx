import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

interface Strength {
  title: string;
  desc: string;
}

const ACCENT_COLORS = [
  'text-teal-700',
  'text-cyan-700',
  'text-emerald-700',
  'text-sky-700',
];

const ACCENT_BG = [
  'bg-teal-50 border-teal-100',
  'bg-cyan-50 border-cyan-100',
  'bg-emerald-50 border-emerald-100',
  'bg-sky-50 border-sky-100',
];

export default function WhyChooseUs() {
  const { t } = useTranslation();
  const strengths = t('about.strengths', { returnObjects: true }) as unknown as Strength[];

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-20 scroll-mt-28" id="why-choose-us">
      {/* Header */}
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-teal-700 dark:text-emerald-400 font-bold mb-3">
          <span className="w-6 h-[2px] rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
          {t('whyChooseUs.eyebrow')}
          <span className="w-6 h-[2px] rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
        </div>
        <h2 className="font-display text-3xl md:text-[40px] md:leading-[48px] font-bold text-slate-900 dark:text-white tracking-tight">
          {t('whyChooseUs.title')}
        </h2>
        <p className="text-base leading-7 text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto font-medium">
          {t('whyChooseUs.desc')}
        </p>
      </ScrollReveal>

      {/* Strengths grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strengths.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
            className="glass-card glass-card-hover rounded-2xl p-7 md:p-8 group relative overflow-hidden transition-all duration-300"
          >
            {/* Number badge */}
            <div
              className={`w-10 h-10 rounded-xl border dark:bg-slate-800/80 dark:border-slate-700 flex items-center justify-center mb-5 ${ACCENT_BG[i % ACCENT_BG.length]} transition-transform duration-300 group-hover:scale-110`}
            >
              <span className={`text-sm font-black dark:text-emerald-400 ${ACCENT_COLORS[i % ACCENT_COLORS.length]}`}>
                0{i + 1}
              </span>
            </div>

            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
              {s.title}
            </h4>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 font-medium">
              {s.desc}
            </p>

            {/* Subtle glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-radial from-teal-100/40 dark:from-emerald-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
