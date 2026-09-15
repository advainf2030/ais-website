import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

const statReveal = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: 0.1 * i, ease: EASE },
  }),
};

export default function Stats() {
  const { t } = useTranslation();

  return (
    <section
      id="stats"
      className="panel-section max-w-5xl mx-auto w-full px-6 lg:px-8 py-8 relative z-20 overflow-hidden scroll-mt-28"
    >
      <div className="relative w-full overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/70 shadow-2xl p-4 md:p-8">
        {/* Ambient glow blob */}
        <div className="absolute -inset-8 pointer-events-none" aria-hidden="true">
          <motion.div
            className="w-full h-full rounded-[3rem] bg-gradient-to-br from-cyan-200/15 via-emerald-100/15 to-amber-100/10 blur-[50px]"
            animate={{
              scale: [1, 1.05, 0.98, 1.02, 1],
              rotate: [0, 1, -1, 0.5, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/60 rtl:divide-x-reverse items-center relative z-10">
          {/* Year Established */}
          <motion.div
            variants={statReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="flex flex-col items-center justify-center py-6 md:py-6 px-6 group cursor-default"
          >
            <div className="h-[80px] md:h-[90px] flex items-center justify-center">
              <span className="text-6xl md:text-7xl font-display font-extralight tracking-tighter text-slate-800 transition-all duration-500 group-hover:-translate-y-1 stat-glow group-hover:text-gradient-brand">
                1998
              </span>
            </div>
            <div className="text-[10px] md:text-xs tracking-[0.2em] text-slate-500 uppercase mt-4 font-semibold text-center">
              {t('hero.statEstablished')}
            </div>
          </motion.div>

          {/* Vision 2030 */}
          <motion.div
            variants={statReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="flex flex-col items-center justify-center py-6 md:py-6 px-6 group cursor-default"
          >
            <div className="h-[80px] md:h-[90px] flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1 group-hover:drop-shadow-lg">
              <img
                alt="Saudi Vision 2030"
                className="max-h-full w-auto object-contain"
                src="logos/vision2030.png"
              />
            </div>
            <div className="text-[10px] md:text-xs tracking-[0.2em] text-slate-500 uppercase mt-4 font-semibold text-center">
              {t('hero.statAlignment')}
            </div>
          </motion.div>

          {/* KSA Focus */}
          <motion.div
            variants={statReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={2}
            className="flex flex-col items-center justify-center py-6 md:py-6 px-6 group cursor-default"
          >
            <div className="h-[80px] md:h-[90px] flex items-center justify-center transition-all duration-500 group-hover:-translate-y-1 group-hover:drop-shadow-lg">
              <img
                alt="Saudi Arabia"
                className="max-h-full w-auto object-contain"
                src="logos/ksa-map.png"
              />
            </div>
            <div className="text-[10px] md:text-xs tracking-[0.2em] text-slate-500 uppercase mt-4 font-semibold text-center">
              {t('hero.statFocus')}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
