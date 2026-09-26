import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';

const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Total sequence: 2.2s zoom entrance + 0.4s hold = 2.6s, then trigger fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="deep-space-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: CINEMATIC_EASE },
          }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#EEF2F7] dark:bg-[#06142D] overflow-hidden select-none pointer-events-auto"
        >
          {/* Subtle corporate ambient glow expanding smoothly behind logo */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.6 }}
            transition={{ duration: 2.2, ease: CINEMATIC_EASE }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-teal-400/20 via-emerald-500/10 dark:from-emerald-500/25 dark:via-cyan-500/15 to-transparent blur-3xl pointer-events-none"
          />

          {/* Deep Space Scale Logo */}
          <div className="relative flex flex-col items-center justify-center px-6">
            <motion.img
              src={theme === 'dark' ? 'logos/ais-logo-horizontal-dark.svg' : 'logos/ais-logo-stacked.svg'}
              alt="Advanced Information Systems Company"
              width={theme === 'dark' ? 1312 : 1000}
              height={theme === 'dark' ? 221 : 470}
              fetchPriority="high"
              initial={{
                scale: 0.15,
                opacity: 0,
                filter: 'blur(24px)',
              }}
              animate={{
                scale: 1.45,
                opacity: 1,
                filter: 'blur(0px)',
              }}
              transition={{
                duration: 2.2,
                ease: CINEMATIC_EASE,
              }}
              className="w-56 md:w-80 h-auto object-contain relative z-10 dark:drop-shadow-[0_0_30px_rgba(0,174,239,0.35)]"
            />

            {/* Corporate hairline progress accent — animates scaleX (composited)
                instead of width (layout-thrashing) for a smoother, cheaper reveal */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.9 }}
              transition={{
                delay: 0.8,
                duration: 1.4,
                ease: CINEMATIC_EASE,
              }}
              className="relative z-10 w-[140px] h-[2px] rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 mt-12 md:mt-16 origin-left rtl:origin-right"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
