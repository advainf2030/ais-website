import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Fingerprint, Menu, Moon, Sun, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeContext';
import { rememberLanguage } from '../i18n';

const LINKS = [
  { href: '#about', tab: 'about', key: 'nav.about' },
  { href: '#software', tab: 'software', key: 'nav.software' },
  { href: '#telecom', tab: 'telecom', key: 'nav.telecom' },
  { href: '#power', tab: 'power', key: 'nav.power' },
] as const;

/* Single theme button: the sun sets and the moon rises (and back) with a
   spring rotate/scale, plus a soft ripple in the new mode's colour. The
   ripple only runs after the first toggle so it doesn't flash on page load. */
function ThemeSwitch({
  dark,
  onToggle,
  label,
  className = '',
}: {
  dark: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  const [toggled, setToggled] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={label}
      onClick={() => {
        setToggled(true);
        onToggle();
      }}
      className={`relative shrink-0 items-center justify-center w-11 h-11 rounded-xl border border-white/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/60 backdrop-blur-sm shadow-xs overflow-hidden cursor-pointer hover:border-teal-500/50 dark:hover:border-emerald-400/50 transition-colors ${className}`}
    >
      {toggled && (
        <motion.span
          key={dark ? 'ripple-dark' : 'ripple-light'}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`absolute inset-0 m-auto w-6 h-6 rounded-full ${dark ? 'bg-emerald-400' : 'bg-amber-400'}`}
          aria-hidden="true"
        />
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ y: 16, rotate: -90, scale: 0.3, opacity: 0 }}
          animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
          exit={{ y: -16, rotate: 90, scale: 0.3, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          className="relative flex"
          aria-hidden="true"
        >
          {dark ? (
            <Moon size={18} strokeWidth={1.75} className="text-cyan-100" />
          ) : (
            <Sun size={18} strokeWidth={1.75} className="text-amber-500" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Focus management: focus first link on open, return to hamburger on close
  const prevOpen = useRef(false);
  useEffect(() => {
    if (mobileOpen && !prevOpen.current) {
      // Just opened — focus first link after animation starts
      requestAnimationFrame(() => firstLinkRef.current?.focus());
    } else if (!mobileOpen && prevOpen.current) {
      // Just closed — return focus to hamburger
      hamburgerRef.current?.focus();
    }
    prevOpen.current = mobileOpen;
  }, [mobileOpen]);

  // Close drawer on Escape, and trap Tab focus inside it while open
  // (required for aria-modal="true" — without this, keyboard users can
  // tab straight through into the inert content behind the overlay).
  const handleDrawerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !drawerRef.current) return;

    const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const setLang = (lng: 'en' | 'ar') => rememberLanguage(lng);

  const handleNavClick = (tab: string, href: string) => {
    window.location.hash = href;
    window.dispatchEvent(new CustomEvent('ais:switch-tab', { detail: tab }));
    const el = document.getElementById('solutions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        // A light blur (12px): the 40px one re-blurred the moving background
        // video every frame and doubled the page's rendering cost
        data-site-nav=""
        className="fixed top-0 left-0 right-0 z-[9999] w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-white/50 dark:border-slate-800/60 shadow-sm transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
          {/* Logo */}
          <a className="flex items-center shrink-0 group" href="#">
            {/* Phones: the AIS mark; wider screens: the primary logo (mark +
                ADVANCED / INFORMATION SYSTEMS / أنظمة المعلومات المتقدمة). Each
                has a light- and a dark-background version. */}
            <img alt="AIS" width={1310} height={600} className="sm:hidden dark:hidden h-10 w-auto shrink-0" src="logos/ais-mark.svg" />
            <img alt="AIS" width={1310} height={600} className="hidden dark:block dark:sm:hidden h-10 w-auto shrink-0" src="logos/ais-mark-dark.svg" />
            <img
              alt="AIS — Advanced Information Systems"
              width={973}
              height={221}
              className="hidden sm:block dark:sm:hidden h-12 lg:h-14 xl:h-16 w-auto shrink-0 transition-transform duration-300 group-hover:scale-[1.03]"
              src="logos/ais-logo-ar.svg"
            />
            <img
              alt="AIS — Advanced Information Systems"
              width={973}
              height={221}
              className="hidden dark:sm:block h-12 lg:h-14 xl:h-16 w-auto shrink-0 transition-transform duration-300 group-hover:scale-[1.03]"
              src="logos/ais-logo-ar-dark.svg"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <a
                key={l.key}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(l.tab, l.href);
                }}
                className="relative text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/50 cursor-pointer"
                href={l.href}
              >
                {t(l.key)}
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme toggle — phones get it inside the menu instead */}
            <ThemeSwitch dark={theme === 'dark'} onToggle={toggleTheme} label={t('nav.darkMode')} className="hidden sm:flex" />

            {/* Language toggle — always in the header */}
            <div className="flex items-center rounded-xl border border-white/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/60 backdrop-blur-sm text-[11px] font-bold overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-11 px-2.5 sm:px-3.5 py-2 flex items-center transition-all duration-300 ${
                  lang === 'en'
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-inner'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ar')}
                aria-pressed={lang === 'ar'}
                className={`min-h-11 px-2.5 sm:px-3.5 py-2 flex items-center transition-all duration-300 ${
                  lang === 'ar'
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-inner'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                عربي
              </button>
            </div>

            {/* CTA */}
            <a
              className="group btn-shimmer hidden sm:flex items-center gap-2.5 text-xs uppercase tracking-wider rtl:tracking-normal font-bold px-5 py-2.5 rounded-xl btn-primary shadow-md hover:shadow-[0_0_0_3px_rgba(0,174,239,0.35),0_10px_25px_-5px_rgba(0,174,239,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/10"
              href="#contact"
            >
              <span>{t('nav.cta')}</span>
              <span className="relative flex w-4 h-4 overflow-hidden" aria-hidden="true">
                <Fingerprint size={16} className="btn-icon text-emerald-300/70 group-hover:text-emerald-300 transition-colors duration-300" />
                <span className="bio-scan-line" />
              </span>
            </a>

            {/* Mobile menu toggle */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden min-w-11 min-h-11 flex items-center justify-center p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Scroll progress line at bottom of navbar */}
        <motion.div
          className="h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 origin-left"
          style={{ scaleX: progress }}
        />
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={drawerRef}
            className="fixed inset-0 z-[10000] mobile-menu-overlay pt-28 px-6 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            onKeyDown={handleDrawerKeyDown}
          >
            {/* Back button (adapted from uiverse.io/AKAspidey01/orange-donkey-78,
                MIT): the arrow block grows to fill the pill on hover, press
                (touch has no hover) or keyboard focus. Mirrors in RTL. */}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label={t('nav.close')}
              className="group absolute top-6 end-6 w-36 h-12 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/80 shadow-sm text-slate-900 dark:text-slate-100 text-base font-semibold cursor-pointer overflow-hidden"
            >
              <span
                className="absolute start-1 top-1 z-10 h-10 w-1/4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center transition-[width] duration-500 ease-out group-hover:w-[calc(100%-0.5rem)] group-active:w-[calc(100%-0.5rem)] group-focus-visible:w-[calc(100%-0.5rem)] motion-reduce:transition-none"
                aria-hidden="true"
              >
                <svg viewBox="0 0 1024 1024" width="20" height="20" className="rtl:-scale-x-100" fill="#ffffff">
                  <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
                  <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
                </svg>
              </span>
              <span className="relative ps-8">{t('nav.back')}</span>
            </button>
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex flex-col gap-2"
            >
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.key}
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(l.tab, l.href);
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="text-lg font-semibold text-slate-800 dark:text-slate-100 hover:text-teal-700 dark:hover:text-teal-400 py-3 px-4 rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  {t(l.key)}
                </motion.a>
              ))}

              <div className="border-t border-slate-200/60 dark:border-slate-800/80 mt-4 pt-4 flex flex-col gap-3">
                {/* Mobile theme toggle */}
                <div className="flex items-center justify-between px-4 py-1">
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                    {theme === 'dark' ? t('nav.darkMode') : t('nav.lightMode')}
                  </span>
                  <ThemeSwitch dark={theme === 'dark'} onToggle={toggleTheme} label={t('nav.darkMode')} className="flex" />
                </div>

                {/* Mobile lang toggle */}
                <div className="flex items-center gap-2 px-4">
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">{t('nav.language')}</span>
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800 text-xs font-bold overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      aria-pressed={lang === 'en'}
                      className={`min-h-11 px-4 py-2 flex items-center transition-all ${lang === 'en' ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('ar')}
                      aria-pressed={lang === 'ar'}
                      className={`min-h-11 px-4 py-2 flex items-center transition-all ${lang === 'ar' ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      عربي
                    </button>
                  </div>
                </div>

                {/* Mobile CTA */}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mx-4 mt-2 btn-primary rounded-2xl px-6 py-4 text-base font-semibold flex items-center justify-center gap-2 shadow-xl"
                >
                  {t('nav.cta')} <ArrowUpRight size={18} />
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
