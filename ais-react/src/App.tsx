import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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

import SplashScreen from './components/SplashScreen';

const SPLASH_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

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

  return (
    <ThemeProvider>
      {/* Premium Deep Space Splash Loader */}
      {loading && <SplashScreen onComplete={() => setLoading(false)} />}

      {/* Main app */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!loading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease: SPLASH_EASE }}
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
