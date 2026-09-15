import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LINKS = [
  { href: '#about', key: 'nav.about' },
  { href: '#solutions', key: 'nav.software' },
  { href: '#cyber-security', key: 'nav.cyber' },
  { href: '#power', key: 'nav.power' },
  { href: '#telecom', key: 'nav.telecom' },
] as const;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const setLang = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-7xl flex items-center justify-between px-4 md:px-8 py-2.5 rounded-2xl transition-all duration-500 ${
          scrolled
            ? 'glass-nav shadow-2xl top-3'
            : 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg'
        }`}
      >
        {/* Logo */}
        <a className="flex items-center shrink-0 group" href="#">
          <img
            alt="AIS Logo"
            className="h-16 md:h-20 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
            src="logos/ais-logo.png"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              className="relative text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-white/30"
              href={l.href}
            >
              {t(l.key)}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          {/* Language toggle */}
          <div className="hidden sm:flex items-center rounded-xl border border-white/50 bg-white/30 backdrop-blur-sm text-[11px] font-bold overflow-hidden">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3.5 py-2 transition-all duration-300 ${
                lang === 'en'
                  ? 'bg-slate-900 text-white shadow-inner'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`px-3.5 py-2 transition-all duration-300 ${
                lang === 'ar'
                  ? 'bg-slate-900 text-white shadow-inner'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              عربي
            </button>
          </div>

          {/* CTA */}
          <a href="#contact" className="hidden md:block">
            <button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl px-6 py-3 text-sm font-semibold hover:shadow-xl hover:shadow-slate-900/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center gap-1.5 border border-white/10">
              {t('nav.cta')} <ArrowUpRight size={16} />
            </button>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 text-slate-700 hover:bg-white/50 transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Scroll progress */}
        <motion.span
          style={{ scaleX: progress }}
          className="absolute -bottom-0.5 left-6 right-6 h-[2px] origin-left rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"
        />
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99] mobile-menu-overlay pt-28 px-6 lg:hidden"
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
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="text-lg font-semibold text-slate-800 hover:text-teal-700 py-3 px-4 rounded-2xl hover:bg-white/60 transition-all"
                >
                  {t(l.key)}
                </motion.a>
              ))}

              <div className="border-t border-slate-200/60 mt-4 pt-4 flex flex-col gap-3">
                {/* Mobile lang toggle */}
                <div className="flex items-center gap-2 px-4">
                  <span className="text-xs text-slate-500 font-medium">Language:</span>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-white/60 text-xs font-bold overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      className={`px-4 py-2 transition-all ${lang === 'en' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('ar')}
                      className={`px-4 py-2 transition-all ${lang === 'ar' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
                    >
                      عربي
                    </button>
                  </div>
                </div>

                {/* Mobile CTA */}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="mx-4 mt-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl px-6 py-4 text-base font-semibold flex items-center justify-center gap-2 shadow-xl"
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
