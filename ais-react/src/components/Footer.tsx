import { MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl border-t border-white/60 dark:border-slate-800/80 shadow-[0_-20px_50px_-10px_rgba(15,23,42,0.04)] relative z-20">
      {/* Shimmer line */}
      <div className="footer-shimmer-line" />

      <div className="max-w-5xl mx-auto px-6 py-10 md:py-12">
        {/* Logo + contact details. (No "Let's work together" call-to-action here:
            the contact section right above already carries it.) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <img
            alt="AIS — Advanced Information Systems"
            width={987}
            height={221}
            loading="lazy"
            decoding="async"
            className="h-14 w-auto shrink-0 dark:hidden"
            src="logos/ais-logo-ar.svg"
          />
          <img
            alt="AIS — Advanced Information Systems"
            width={987}
            height={221}
            loading="lazy"
            decoding="async"
            className="h-14 w-auto shrink-0 hidden dark:block"
            src="logos/ais-logo-ar-dark.svg"
          />

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-x-6 gap-y-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <a
              href="https://maps.google.com/?q=Building+7022+Al+Aqeeq+Dist+Riyadh+13515+KSA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-teal-700 dark:hover:text-emerald-400 transition-colors"
            >
              <MapPin size={13} className="text-teal-600 dark:text-emerald-400 shrink-0" />
              <span>{t('footer.address')}</span>
            </a>
            <a
              href={`tel:${t('footer.phone').replace(/\s/g, '')}`}
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-teal-700 dark:hover:text-emerald-400 transition-colors"
            >
              <Phone size={13} className="text-teal-600 dark:text-emerald-400 shrink-0" />
              <span dir="ltr">{t('footer.phone')}</span>
            </a>
            <a
              href={`mailto:${t('footer.email')}`}
              className="flex items-center gap-1.5 whitespace-nowrap hover:text-teal-700 dark:hover:text-emerald-400 transition-colors"
            >
              <Mail size={13} className="text-teal-600 dark:text-emerald-400 shrink-0" />
              <span>{t('footer.email')}</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800 text-[11px] leading-5 text-slate-500 dark:text-slate-400 font-medium">
          © {year} {t('footer.tagline')}
        </p>
      </div>
    </footer>
  );
}
