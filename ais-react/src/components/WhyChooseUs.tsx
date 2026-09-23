import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import ScrollReveal from './ScrollReveal';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];
const MAX_TILT_DEG = 3.5;

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

  const panelRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* Spatial glass depth — cursor-driven tilt + specular sheen + differential numeral parallax.
     Desktop, fine-pointer only; respects prefers-reduced-motion. */
  useEffect(() => {
    const panel = panelRef.current;
    const sheen = sheenRef.current;
    if (!panel || !sheen) return;

    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canTilt || reduceMotion) return;

    const state = { rx: 0, ry: 0, sx: 50, sy: 50, glow: 0 };
    const apply = () => {
      panel.style.transform = `perspective(1400px) rotateX(${state.rx}deg) rotateY(${state.ry}deg)`;
      sheen.style.setProperty('--sheen-x', `${state.sx}%`);
      sheen.style.setProperty('--sheen-y', `${state.sy}%`);
      sheen.style.opacity = String(state.glow);
      numeralRefs.current.forEach((el) => {
        if (!el) return;
        el.style.transform = `translate3d(${state.ry * 2.2}px, ${state.rx * -2.2}px, 0)`;
      });
    };

    const setRx = gsap.quickTo(state, 'rx', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
    const setRy = gsap.quickTo(state, 'ry', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
    const setSx = gsap.quickTo(state, 'sx', { duration: 0.35, ease: 'power3.out', onUpdate: apply });
    const setSy = gsap.quickTo(state, 'sy', { duration: 0.35, ease: 'power3.out', onUpdate: apply });
    const setGlow = gsap.quickTo(state, 'glow', { duration: 0.4, ease: 'power2.out', onUpdate: apply });

    const handleMove = (e: MouseEvent) => {
      const rect = panel.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      setRx((py - 0.5) * -2 * MAX_TILT_DEG);
      setRy((px - 0.5) * 2 * MAX_TILT_DEG);
      setSx(px * 100);
      setSy(py * 100);
      setGlow(1);
    };
    const handleLeave = () => {
      setRx(0);
      setRy(0);
      setGlow(0);
    };

    panel.addEventListener('mousemove', handleMove);
    panel.addEventListener('mouseleave', handleLeave);
    return () => {
      panel.removeEventListener('mousemove', handleMove);
      panel.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

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

      {/* Strengths — editorial row on a single glass slab with cursor-driven spatial depth */}
      <div
        ref={panelRef}
        className="glass-card rounded-3xl overflow-hidden relative will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Specular sheen — travels with the cursor, sells the "real glass" read */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          className="glass-sheen absolute inset-0 z-20 pointer-events-none opacity-0"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-300/60 dark:divide-slate-600/30 rtl:divide-x-reverse relative z-10">
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
                    ref={(el) => {
                      numeralRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className={`shrink-0 text-5xl md:text-6xl font-display font-extralight leading-none select-none bg-gradient-to-b bg-clip-text text-transparent will-change-transform ${accent.numeral}`}
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
