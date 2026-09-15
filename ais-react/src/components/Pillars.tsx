import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PILLARS } from '../data';
import ScrollReveal from './ScrollReveal';

interface PillarText {
  title: string;
  sub: string;
  desc: string;
}

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

const GLOW_BG: Record<string, string> = {
  emerald: 'bg-emerald-500/12',
  cyan: 'bg-cyan-500/12',
  sky: 'bg-sky-500/12',
  amber: 'bg-amber-500/12',
};

const ICON_BG: Record<string, string> = {
  emerald: 'bg-emerald-50 text-[#006c49] border-emerald-100',
  cyan: 'bg-cyan-50 text-[#00687a] border-cyan-100',
  sky: 'bg-sky-50 text-[#0284C7] border-sky-100',
  amber: 'bg-amber-50 text-[#855300] border-amber-100',
};

const ACTIVE_GLOW: Record<string, string> = {
  emerald: 'from-emerald-400/30 to-emerald-500/5',
  cyan: 'from-cyan-400/30 to-cyan-500/5',
  sky: 'from-sky-400/30 to-sky-500/5',
  amber: 'from-amber-400/30 to-amber-500/5',
};

const TITLE_ACCENT: Record<string, string> = {
  emerald: 'text-[#006c49]',
  cyan: 'text-[#00687a]',
  sky: 'text-[#0284C7]',
  amber: 'text-[#855300]',
};

export default function Pillars() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  // Mobile accordion: -1 means none open, otherwise the index
  const [mobileOpen, setMobileOpen] = useState(-1);
  const texts = t('pillars.cards', { returnObjects: true }) as unknown as PillarText[];
  const badges = t('pillars.badge', { returnObjects: true }) as unknown as string[];

  const toggleMobile = (i: number) => {
    setMobileOpen(mobileOpen === i ? -1 : i);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 scroll-mt-28" id="why-choose-us">
      {/* Header */}
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-teal-700 font-bold mb-3">
          <span className="w-6 h-[2px] rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
          {t('pillars.eyebrow')}
          <span className="w-6 h-[2px] rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
        </div>
        <h2 className="font-display text-4xl md:text-[44px] md:leading-[52px] font-bold text-slate-900 tracking-tight">
          {t('pillars.title')}
        </h2>
        <p className="text-lg leading-8 text-slate-500 mt-5 max-w-2xl mx-auto">
          {t('pillars.desc')}
        </p>
      </ScrollReveal>

      {/* ─── Desktop: Horizontal accordion (md+) ─── */}
      <div className="hidden md:block">
        {/* Active pillar indicator */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <div className="flex items-center gap-2">
            {PILLARS.map((_, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${i === active
                    ? 'w-8 h-2 bg-gradient-to-r from-teal-500 to-cyan-500'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto my-6">
          <div
            className="flex flex-row h-[440px] gap-4 w-full"
            id="pillar-accordion"
          >
            {PILLARS.map((p, i) => {
              const txt = texts[i];
              const Icon = p.icon;
              const isActive = i === active;
              return (
                <motion.div
                  key={p.theme}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  data-pillar={i}
                  className={`pillar-card pillar-${p.theme} ${isActive ? 'is-active' : ''} bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl overflow-hidden relative cursor-pointer flex flex-col justify-between p-8 shadow-lg hover:shadow-xl transition-shadow`}
                >
                  {/* Active pulse glow orb */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className={`absolute -right-12 -top-12 w-52 h-52 rounded-full blur-3xl bg-gradient-radial ${ACTIVE_GLOW[p.theme]} pointer-events-none pillar-active-pulse`}
                      />
                    )}
                  </AnimatePresence>

                  {/* Standard glow orb */}
                  <div
                    className={`absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl pillar-glow ${p.glowClass} ${GLOW_BG[p.theme]} pointer-events-none transition-all duration-500`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="pillar-top flex items-center justify-between mb-6">
                      <div
                        className={`pillar-icon w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm transition-all duration-300 ${ICON_BG[p.theme]}`}
                      >
                        <Icon size={24} />
                      </div>
                      <span
                        className={`text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl font-bold border backdrop-blur-md ${p.badgeClass}`}
                      >
                        {badges[i]}
                      </span>
                    </div>

                    <h4 className="pillar-title font-display text-xl leading-7 font-bold text-slate-900 mb-2 transition-colors duration-300 whitespace-nowrap">
                      {txt.title}
                    </h4>
                    <p className="pillar-subtitle-md text-xs text-slate-500 font-medium">
                      {txt.sub}
                    </p>
                  </div>

                  {/* Expandable content */}
                  <div className="relative z-10 pillar-expandable">
                    <p className="text-[13px] leading-6 text-slate-600">{txt.desc}</p>
                    <div
                      className={`mt-5 pt-3 border-t border-white/50 flex items-center justify-between text-xs font-bold ${p.linkClass}`}
                    >
                      <span className="flex items-center gap-1.5 group/link hover:gap-2.5 transition-all duration-300">
                        {t('pillars.explore')} <ArrowRight size={16} className="group-hover/link:translate-x-0.5 transition-transform" />
                      </span>
                      <span className={`${p.countClass} font-mono text-[11px] opacity-60`}>
                        0{i + 1} / 04
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Mobile: Sleek editorial accordion (< md) ─── */}
      <div className="md:hidden max-w-lg mx-auto">
        {PILLARS.map((p, i) => {
          const txt = texts[i];
          const isOpen = mobileOpen === i;
          return (
            <motion.div
              key={p.theme}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className={`border-b border-black/[0.08] ${i === 0 ? 'border-t' : ''}`}
            >
              {/* Title row */}
              <button
                type="button"
                onClick={() => toggleMobile(i)}
                className="w-full flex items-center justify-between py-6 gap-4 text-start group"
              >
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] tracking-[0.2em] uppercase font-semibold ${isOpen ? TITLE_ACCENT[p.theme] : 'text-slate-400'} transition-colors duration-300`}>
                    0{i + 1}
                  </span>
                  <h4 className={`font-display text-xl font-semibold mt-1 transition-colors duration-300 ${isOpen ? TITLE_ACCENT[p.theme] : 'text-slate-900'}`}>
                    {txt.title}
                  </h4>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors"
                >
                  <ChevronDown size={20} />
                </motion.span>
              </button>

              {/* Expandable description */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key={`mobile-desc-${p.theme}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {txt.desc}
                      </p>
                      <p className="text-xs text-slate-400 mt-3 font-medium">
                        {txt.sub}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
