import { useTranslation } from 'react-i18next';
import { PARTNERS } from '../data';
import type { Partner } from '../data';
import ScrollReveal from './ScrollReveal';

function LogoItem({ partner, hidden }: { partner: Partner; hidden?: boolean }) {
  const baseClass =
    'flex items-center justify-center w-32 md:w-40 h-14 md:h-16 shrink-0 mx-3 md:mx-4 opacity-85 hover:opacity-100 hover:scale-[1.08] transition-all duration-300 rounded-xl hover:bg-white/40 dark:hover:bg-white hover:shadow-md hover:backdrop-blur-sm dark:bg-white/90 px-2.5';

  if (partner.name === 'Dynatrace') {
    return (
      <span className={baseClass} aria-hidden={hidden || undefined}>
        <img
          alt="Dynatrace"
          width={24}
          height={24}
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
          width={28}
          height={28}
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
        width={160}
        height={64}
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
        <h2 className="font-display text-2xl leading-8 font-bold text-slate-900 dark:text-white tracking-tight">
          {t('partners.title')}
        </h2>
        <p className="text-sm leading-6 text-slate-800 dark:text-slate-300 font-medium mt-2 max-w-lg mx-auto">
          {t('partners.desc')}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div
          className="relative w-full overflow-hidden rounded-3xl glass-card py-8 md:py-10 shadow-sm"
          dir="ltr"
          style={{ direction: 'ltr' }}
        >
          {/* Gradient edge masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white/90 via-white/50 to-transparent dark:from-[#0b1120] dark:via-[#0b1120]/60 dark:to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white/90 via-white/50 to-transparent dark:from-[#0b1120] dark:via-[#0b1120]/60 dark:to-transparent z-10 pointer-events-none" />

          {/* Triple-track seamless infinite marquee — tripled logos ensure no gaps even on wide screens */}
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
            <div className="marquee-group" aria-hidden="true">
              {PARTNERS.map((p) => (
                <LogoItem key={`p3-${p.name}`} partner={p} hidden />
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
