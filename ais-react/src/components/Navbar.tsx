import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeContext';

const LINKS = [
  { href: '#about', tab: 'about', key: 'nav.about' },
  { href: '#software', tab: 'software', key: 'nav.software' },
  { href: '#telecom', tab: 'telecom', key: 'nav.telecom' },
  { href: '#power', tab: 'power', key: 'nav.power' },
] as const;

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

  const setLang = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

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
        className="fixed top-0 left-0 right-0 z-[9999] w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-white/50 dark:border-slate-800/60 shadow-sm transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
          {/* Logo */}
          <a className="flex items-center shrink-0 group" href="#">
            <img
              alt="AIS Logo"
              className="h-14 md:h-16 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105 dark:brightness-125 dark:contrast-110 dark:drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              src="logos/ais-logo.png"
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
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="min-w-11 min-h-11 p-2.5 rounded-xl border border-white/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/60 backdrop-blur-sm text-slate-700 dark:text-amber-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={17} className="text-amber-400 theme-toggle-icon" />
              ) : (
                <Moon size={17} className="text-slate-700 theme-toggle-icon" />
              )}
            </button>

            {/* Language toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-white/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-800/60 backdrop-blur-sm text-[11px] font-bold overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`min-h-11 px-3.5 py-2 flex items-center transition-all duration-300 ${
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
                className={`min-h-11 px-3.5 py-2 flex items-center transition-all duration-300 ${
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
              className="btn-shimmer hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-teal-600 shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 border border-white/10"
              href="#contact"
            >
              <span>{t('nav.cta')}</span>
              <ArrowUpRight size={14} />
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
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="min-w-11 min-h-11 flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800 text-slate-700 dark:text-amber-300"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                </div>

                {/* Mobile lang toggle */}
                <div className="flex items-center gap-2 px-4">
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-semibold">Language:</span>
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
                  className="mx-4 mt-2 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-emerald-600 dark:to-teal-600 text-white rounded-2xl px-6 py-4 text-base font-semibold flex items-center justify-center gap-2 shadow-xl"
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
