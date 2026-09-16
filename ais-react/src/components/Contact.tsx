import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTACT } from '../data';
import ScrollReveal from './ScrollReveal';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

const inputBaseClass =
  'w-full bg-white/60 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-3.5 placeholder-slate-400 dark:placeholder-slate-400 outline-none transition-all duration-300 text-slate-900 dark:text-white text-[15px] hover:bg-white/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 focus:border-teal-500 dark:focus:border-emerald-400 focus:shadow-sm';

function AnimatedInput({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="input-animate-wrapper">
      <label className="block text-xs text-slate-800 dark:text-slate-200 font-semibold mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const scopes = t('contact.scopeOptions', { returnObjects: true }) as unknown as string[];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate a brief submission delay for the typing indicator
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1500);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-20 scroll-mt-28" id="contact">
      <ScrollReveal>
        <div className="glass-card rounded-[2rem] p-8 md:p-14 relative overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-gradient-to-tl from-cyan-100/50 dark:from-emerald-500/10 via-teal-100/40 dark:via-teal-500/5 to-transparent rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-64 h-64 bg-gradient-to-br from-emerald-100/30 dark:from-cyan-500/10 to-transparent rounded-full blur-[40px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-12 items-start justify-between relative z-10">
            {/* Left info */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-7"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {t('contact.badge')}
              </motion.div>

              <h2 className="font-display text-4xl md:text-[44px] md:leading-[52px] font-bold text-slate-900 dark:text-white tracking-tight mb-5">
                {t('contact.title')}
              </h2>

              <p className="text-[15px] leading-7 text-slate-800 dark:text-slate-300 font-medium mb-10">
                {t('contact.desc')}
              </p>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4 text-slate-900 dark:text-white group">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-slate-700 transition-colors">
                    <MapPin size={18} className="text-teal-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">{t('contact.hq')}</span>
                    <span className="text-slate-800 dark:text-slate-300 leading-6">{t('contact.hqValue')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-900 dark:text-white group">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-slate-700 transition-colors">
                    <Phone size={18} className="text-teal-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{t('contact.phone')}</span>
                    <span className="text-slate-800 dark:text-slate-300 ms-1.5 font-medium" dir="ltr">{CONTACT.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-900 dark:text-white group">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-slate-700 transition-colors">
                    <Mail size={18} className="text-teal-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{t('contact.email')}</span>
                    <span className="text-slate-800 dark:text-slate-300 ms-1.5 font-medium">{CONTACT.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right form */}
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="lg:w-1/2 w-full flex flex-col items-center justify-center text-center py-20 gap-5 relative"
                >
                  {/* Confetti */}
                  <div className="confetti-container">
                    <div className="confetti-piece" />
                    <div className="confetti-piece" />
                    <div className="confetti-piece" />
                    <div className="confetti-piece" />
                    <div className="confetti-piece" />
                    <div className="confetti-piece" />
                    <div className="confetti-piece" />
                    <div className="confetti-piece" />
                  </div>

                  <motion.div
                    className="relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                  >
                    <CheckCircle2 size={56} className="text-emerald-500" />
                    <Sparkles size={20} className="absolute -top-2 -right-2 text-amber-400 animate-pulse" />
                  </motion.div>
                  <p className="text-[16px] leading-7 text-slate-800 dark:text-slate-200 font-medium max-w-sm">
                    {t('contact.success')}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="lg:w-1/2 w-full space-y-5"
                  onSubmit={onSubmit}
                >
                  <AnimatedInput label={t('contact.entity')}>
                    <input className={inputBaseClass} placeholder={t('contact.entityPh')} required type="text" />
                  </AnimatedInput>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatedInput label={t('contact.workEmail')}>
                      <input className={inputBaseClass} placeholder="officer@agency.gov.sa" required type="email" />
                    </AnimatedInput>
                    <AnimatedInput label={t('contact.phoneLabel')}>
                      <input className={inputBaseClass} placeholder="+966 5x xxx xxxx" required type="tel" />
                    </AnimatedInput>
                  </div>

                  <AnimatedInput label={t('contact.scope')}>
                    <select className={`${inputBaseClass} cursor-pointer`}>
                      {scopes.map((s) => (
                        <option key={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </AnimatedInput>

                  <AnimatedInput label={t('contact.brief')}>
                    <textarea
                      className={`${inputBaseClass} resize-none`}
                      placeholder={t('contact.briefPh')}
                      rows={3}
                    />
                  </AnimatedInput>

                  <button
                    className="group w-full py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600 text-white text-sm font-semibold shadow-xl shadow-teal-900/20 hover:shadow-2xl hover:shadow-teal-900/30 hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-1">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </span>
                    ) : (
                      <>
                        {t('contact.submit')}
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
