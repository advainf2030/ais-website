import { MapPin, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

const NAV_LINKS = [
  { href: '#solutions', key: 'nav.software' },
  { href: '#cyber-security', key: 'nav.cyber' },
  { href: '#power', key: 'nav.power' },
  { href: '#telecom', key: 'nav.telecom' },
  { href: '#contact', key: 'hero.contact' },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-white/50 backdrop-blur-3xl border-t border-white/60 shadow-[0_-20px_50px_-10px_rgba(15,23,42,0.04)] relative z-20">
      {/* Animated shimmer separator */}
      <div className="footer-shimmer-line" />

      <div className="w-full px-6 py-14 md:px-12 lg:px-16 max-w-7xl mx-auto flex flex-col gap-10">
        {/* Top row */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-slate-200/60">
            <div className="flex flex-col gap-3">
              <a href="#" className="inline-block group">
                <img
                  alt="AIS Contracting"
                  className="h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                  src="logos/ais-logo.png"
                />
              </a>
              <p className="text-sm text-slate-800 font-medium max-w-lg leading-6 mt-1">
                {t('footer.tagline')}
              </p>
            </div>

            <nav className="flex flex-wrap gap-x-1 gap-y-1">
              {NAV_LINKS.map((l, i) => (
                <a
                  key={l.href}
                  className={`link-slide-underline text-xs font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 ${
                    i === 0
                      ? 'text-teal-700 font-bold bg-teal-50/80 hover:bg-teal-100/80'
                      : 'text-slate-800 hover:text-teal-700 hover:bg-slate-100/70'
                  }`}
                  href={l.href}
                >
                  {t(l.key)}
                </a>
              ))}
            </nav>
          </div>
        </ScrollReveal>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-5 text-xs text-slate-700 font-medium">
          <div className="text-center sm:text-start leading-5">
            © {year} {t('footer.rights')}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <MapPin size={14} className="text-teal-600" />
              {t('footer.location')}
            </div>
            <a
              href="#"
              className="flex items-center gap-1 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
