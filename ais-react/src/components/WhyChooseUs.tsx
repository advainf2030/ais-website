import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

interface Strength {
  title: string;
  desc: string;
}

const PALETTE = [
  { title: 'text-teal-700 dark:text-emerald-400', numeral: 'from-teal-600 to-teal-600/10 dark:from-emerald-400 dark:to-emerald-400/10', rule: 'bg-teal-500/40 dark:bg-emerald-400/40' },
  { title: 'text-cyan-700 dark:text-cyan-400', numeral: 'from-cyan-600 to-cyan-600/10 dark:from-cyan-400 dark:to-cyan-400/10', rule: 'bg-cyan-500/40 dark:bg-cyan-400/40' },
  { title: 'text-emerald-700 dark:text-teal-400', numeral: 'from-emerald-600 to-emerald-600/10 dark:from-teal-400 dark:to-teal-400/10', rule: 'bg-emerald-500/40 dark:bg-teal-400/40' },
  { title: 'text-sky-700 dark:text-sky-400', numeral: 'from-sky-600 to-sky-600/10 dark:from-sky-400 dark:to-sky-400/10', rule: 'bg-sky-500/40 dark:bg-sky-400/40' },
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

      {/* Strengths — editorial row on a single glass slab (site's established glass theme) */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-300/60 dark:divide-slate-600/30 rtl:divide-x-reverse">
          {strengths.map((s, i) => {
            const accent = PALETTE[i % PALETTE.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                className="relative p-6 md:p-8 group"
              >
                {/* Numeral dateline — gradient-fade numeral + accent rule, fully in-flow (no clipping) */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-5xl md:text-6xl font-display font-extralight leading-none select-none bg-gradient-to-b bg-clip-text text-transparent ${accent.numeral}`}
                  >
                    0{i + 1}
                  </span>
                  <span className={`h-px flex-1 ${accent.rule}`} />
                </div>

                <h4 className={`text-lg font-bold mb-2 ${accent.title}`}>{s.title}</h4>
                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300 font-medium">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
