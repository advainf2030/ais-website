import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../data';
import ScrollReveal from './ScrollReveal';

interface ServiceText {
  tag: string;
  title: string;
  desc: string;
  chips: string[];
}

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.12, ease: EASE },
  }),
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 20,
      delay: 0.3 + i * 0.06,
    },
  }),
};

/** Apply subtle 3D tilt + glow-follow on mouse move */
function useCardTilt() {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

    // Move the glow-follow pseudo-element via CSS custom properties
    const glowEl = el.querySelector<HTMLElement>('.glow-spot');
    if (glowEl) {
      glowEl.style.left = `${x}px`;
      glowEl.style.top = `${y}px`;
      glowEl.style.opacity = '1';
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    const glowEl = el.querySelector<HTMLElement>('.glow-spot');
    if (glowEl) {
      glowEl.style.opacity = '0';
    }
  }, []);

  return { cardRef, onMouseMove, onMouseLeave };
}

function ServiceCard({ service, text, index }: { service: typeof SERVICES[number]; text: ServiceText; index: number }) {
  const { cardRef, onMouseMove, onMouseLeave } = useCardTilt();
  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      id={service.id}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      custom={index}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`${service.span} glass-card glass-card-hover rounded-3xl transition-all duration-500 group overflow-hidden relative flex flex-col justify-between min-h-[380px]`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Glow spot that follows cursor */}
      <div
        className="glow-spot absolute w-[300px] h-[300px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[2] opacity-0 transition-opacity duration-400"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Background image */}
      <img
        alt={text.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[800ms] ease-out"
        src={service.image}
        loading="lazy"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.97] via-white/85 to-white/30 group-hover:from-white/[0.98] group-hover:via-white/90 transition-all duration-500" />
      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8">
        <div>
          {/* Icon + Tag */}
          <div className="flex items-center justify-between mb-7">
            <div
              className={`w-13 h-13 rounded-2xl bg-white/90 border border-white flex items-center justify-center ${service.iconClass} shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}
            >
              <Icon size={26} />
            </div>
            <span
              className={`text-[10px] uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-xl font-bold border backdrop-blur-md ${service.tagClass}`}
            >
              {text.tag}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-display text-[26px] md:text-[30px] leading-[36px] font-bold text-slate-900 mb-3 transition-colors duration-300 ${service.hoverClass}`}
          >
            {text.title}
          </h3>

          {/* Description */}
          <p className="text-[14px] leading-6 text-slate-700 font-medium max-w-xl mb-6">
            {text.desc}
          </p>

          {/* Chips — staggered spring animation */}
          <div className="flex flex-wrap gap-2">
            {text.chips.map((c, ci) => (
              <motion.span
                key={c}
                variants={chipVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={ci}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md text-slate-700 border border-white/90 shadow-sm font-medium hover:bg-white hover:shadow-md transition-all duration-200"
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Explore link */}
        <div className="mt-6 pt-4 border-t border-white/50">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${service.iconClass} opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}
          >
            Learn more <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { t } = useTranslation();
  const texts = t('services.cards', { returnObjects: true }) as unknown as ServiceText[];

  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-8 py-20 scroll-mt-28" id="solutions">
      {/* Header */}
      <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-teal-700 font-bold mb-3 flex items-center gap-2.5">
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
            {t('services.eyebrow')}
          </div>
          <h2 className="font-display text-4xl md:text-[44px] md:leading-[52px] font-bold text-slate-900 tracking-tight">
            {t('services.title')}
          </h2>
        </div>
        <p className="text-[15px] leading-7 text-slate-500 max-w-md">{t('services.desc')}</p>
      </ScrollReveal>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.id} service={s} text={texts[i]} index={i} />
        ))}
      </div>
    </section>
  );
}
