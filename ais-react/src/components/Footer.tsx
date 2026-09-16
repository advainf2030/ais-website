import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white/50 dark:bg-slate-950/80 backdrop-blur-3xl border-t border-white/60 dark:border-slate-800/80 shadow-[0_-20px_50px_-10px_rgba(15,23,42,0.04)] relative z-20">
      {/* Shimmer line */}
      <div className="footer-shimmer-line" />

      <div className="max-w-5xl mx-auto px-6 py-10 md:py-12">
        {/* "Let's Work Together" CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t('footer.workTogether')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
              {t('footer.workTogetherDesc')}
            </p>
          </div>
          <a
            className="btn-shimmer shrink-0 flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white px-6 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-teal-600 shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/10"
            href="#contact"
          >
            <span>{t('nav.cta')}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Compact contact info + copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Contact details — compact row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-teal-600 dark:text-emerald-400 shrink-0" />
              <span>{t('footer.address')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-teal-600 dark:text-emerald-400 shrink-0" />
              <span dir="ltr">{t('footer.phone')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-teal-600 dark:text-emerald-400 shrink-0" />
              <span>{t('footer.email')}</span>
            </div>
          </div>

          {/* Logo + copyright */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              alt="AIS"
              className="h-8 w-auto object-contain opacity-70 dark:opacity-90 dark:brightness-125 dark:contrast-110"
              src="logos/ais-logo.png"
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-4 max-w-[200px]">
              © {year} {t('footer.tagline')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
