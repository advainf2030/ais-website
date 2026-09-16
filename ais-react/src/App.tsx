import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraBackground from './components/AuroraBackground';
import Contact from './components/Contact';
import ContactInfo from './components/ContactInfo';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Partners from './components/Partners';
import TabSystem from './components/TabSystem';
import WhyChooseUs from './components/WhyChooseUs';

import { ThemeProvider } from './components/ThemeContext';

const SPLASH_EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

export default function App() {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  // Set HTML dir/lang reactively
  useEffect(() => {
    const lang = i18n.resolvedLanguage ?? i18n.language;
    const rtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  }, [i18n, i18n.language]);

  // Splash screen timing
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {/* Splash loader with radial reveal */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: SPLASH_EASE }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
          >
            {/* Radial glow behind logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: SPLASH_EASE }}
              className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-cyan-200/20 via-emerald-100/10 to-transparent blur-[60px]"
            />
            <motion.img
              src="logos/ais-logo.png"
              alt="AIS"
              className="h-28 w-auto object-contain relative z-10"
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.1, ease: SPLASH_EASE }}
            />
            {/* Loading bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: SPLASH_EASE }}
              className="relative z-10 h-[2px] rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 mt-6"
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: SPLASH_EASE }}
                style={{ originX: 0 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!loading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: SPLASH_EASE }}
        className="relative min-h-screen overflow-x-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300"
      >
        <AuroraBackground />
        <Navbar />
        <main className="relative z-10 pt-28 md:pt-32 pb-16">
          <Hero />
          <TabSystem />
          <WhyChooseUs />
          <ContactInfo />
          <Partners />
          <Contact />
        </main>
        <Footer />
      </motion.div>
    </ThemeProvider>
  );
}
