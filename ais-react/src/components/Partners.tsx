import { useTranslation } from 'react-i18next';
import { PARTNERS } from '../data';
import type { Partner } from '../data';
import ScrollReveal from './ScrollReveal';

function LogoItem({ partner, hidden }: { partner: Partner; hidden?: boolean }) {
  const baseClass =
    'flex items-center justify-center w-40 h-16 shrink-0 mx-4 opacity-85 hover:opacity-100 hover:scale-[1.08] transition-all duration-300 rounded-xl hover:bg-white/40 hover:shadow-md hover:backdrop-blur-sm';

  if (partner.name === 'Dynatrace') {
    return (
      <span className={baseClass} aria-hidden={hidden || undefined}>
        <img
          alt="Dynatrace"
          className="h-6 w-6 object-contain"
          src={partner.src}
          loading="lazy"
          draggable={false}
        />
        <span className="ms-2 text-lg font-bold text-slate-700 lowercase tracking-tight">
          dynatrace
        </span>
      </span>
    );
  }

  if (partner.name === 'Katalon') {
    return (
      <span className={baseClass} aria-hidden={hidden || undefined}>
        <img
          alt="Katalon"
          className="h-7 w-7 object-contain"
          src={partner.src}
          loading="lazy"
          draggable={false}
        />
        <span className="ms-2 text-xl font-extrabold text-slate-900 tracking-tight">
          Katalon
        </span>
      </span>
    );
  }

  const extra = partner.name === 'neoleap' ? ' px-2' : '';

  return (
    <span className={baseClass} aria-hidden={hidden || undefined}>
      <img
        alt={partner.name}
        className={`max-w-full max-h-full w-auto h-auto object-contain${extra}`}
        src={partner.src}
        loading="lazy"
        draggable={false}
      />
    </span>
  );
}

export default function Partners() {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 scroll-mt-28" id="partners">
      <ScrollReveal className="text-center mb-12">
        <h3 className="font-display text-2xl leading-8 font-bold text-slate-900 tracking-tight">
          {t('partners.title')}
        </h3>
        <p className="text-sm leading-6 text-slate-500 mt-2 max-w-lg mx-auto">
          {t('partners.desc')}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div
          className="relative w-full overflow-hidden rounded-3xl glass-card py-10 shadow-sm"
          dir="ltr"
          style={{ direction: 'ltr' }}
        >
          {/* Gradient edge masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white/90 via-white/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white/90 via-white/50 to-transparent z-10 pointer-events-none" />

          {/* Scrolling logos — dual-track seamless infinite marquee that never disappears */}
          <div className="marquee-track" dir="ltr">
            <div className="marquee-group">
              {PARTNERS.map((p) => (
                <LogoItem key={`p1-${p.name}`} partner={p} />
              ))}
            </div>
            <div className="marquee-group" aria-hidden="true">
              {PARTNERS.map((p) => (
                <LogoItem key={`p2-${p.name}`} partner={p} hidden />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
