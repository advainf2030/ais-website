import { useEffect, useRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { CONTACT } from '../data';
import ScrollReveal from './ScrollReveal';

const MAX_TILT_DEG = 3.5;

export default function ContactInfo() {
  const { t } = useTranslation();

  const panelRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Spatial glass depth — cursor-driven tilt + specular sheen + differential icon parallax.
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
      iconRefs.current.forEach((el) => {
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

  const channels = [
    {
      icon: MapPin,
      label: t('contact.hq'),
      value: t('contact.hqValue'),
      dir: undefined as string | undefined,
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: CONTACT.phone,
      dir: 'ltr',
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: CONTACT.email,
      dir: undefined as string | undefined,
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 scroll-mt-28" id="contact-channels">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t('contactChannels.title')}
        </h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 font-medium mt-3 max-w-lg mx-auto">
          {t('contactChannels.desc')}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div
          ref={panelRef}
          className="glass-card rounded-2xl p-6 md:p-10 relative will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Specular sheen — travels with the cursor, sells the "real glass" read */}
          <div
            ref={sheenRef}
            aria-hidden="true"
            className="glass-sheen absolute inset-0 rounded-2xl z-20 pointer-events-none opacity-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 group"
                >
                  <div
                    ref={(el) => {
                      iconRefs.current[i] = el;
                    }}
                    className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-slate-700 transition-colors duration-300 will-change-transform"
                  >
                    <Icon size={20} className="text-teal-700 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {ch.label}
                    </span>
                    <span
                      className="block text-sm text-slate-700 dark:text-slate-300 leading-6 font-medium break-words"
                      dir={ch.dir}
                    >
                      {ch.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
