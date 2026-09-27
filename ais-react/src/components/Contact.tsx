import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CheckCircle2, Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTACT } from '../data';
import ScrollReveal from './ScrollReveal';

const EASE = [0.22, 0.61, 0.36, 1] as [number, number, number, number];

// Client-side format checks driving the progressive reveal and the live
// checkmarks. Not Saudi-specific — any real email / international phone
// number passes. Paired with `required` + the input's own `type`/`pattern`
// so a JS-disabled submit still gets the same constraint on the server-side
// (native HTML5 validation) rather than relying on this alone.
const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
// International phone: optional leading +, 7-15 digits once separators are stripped (E.164 range).
const PHONE_RE = /^\+?[0-9]{7,15}$/;
// Unicode-aware: letters (incl. Arabic), numbers, spaces and common punctuation only —
// blocks angle brackets, backticks and other markup/script-injection characters outright.
const ENTITY_RE = /^[\p{L}\p{N}\s.,&'\-/()]{2,120}$/u;

const stripPhoneSeparators = (v: string) => v.replace(/[\s\-()]/g, '');
// Defense-in-depth for free-text fields: strip characters with no legitimate
// use in a name/description but that are the building blocks of HTML/script
// injection. React already escapes on render, so this isn't load-bearing for
// XSS on this page — it just keeps the data itself clean if it's ever piped
// elsewhere (email, CRM, log).
const sanitizeText = (v: string) => v.replace(/[<>`]/g, '');

// Client-side abuse throttle — a deterrent against a script hammering this
// form, not a real defense (anything determined enough calls a future API
// directly, bypassing the browser entirely). Real DDoS/bot protection has
// to live at the infra layer (host-level rate limiting, a WAF/Cloudflare
// rule, a CAPTCHA + server-side check) once this form has a real backend.
const RATE_LIMIT_KEY = 'ais_contact_submissions';
const RATE_LIMIT_MAX = 5; // max submissions per rolling window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MIN_SUBMIT_INTERVAL_MS = 20 * 1000; // cool-down between two submissions

const getRecentSubmissions = (): number[] => {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
    return arr.filter((t): t is number => typeof t === 'number' && t > cutoff);
  } catch {
    return [];
  }
};

const recordSubmission = (timestamps: number[]) => {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
  } catch {
    // Private mode / storage blocked — fail open, nothing to persist.
  }
};

const inputBaseClass =
  'w-full bg-white/60 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-4 py-3.5 placeholder-slate-400 dark:placeholder-slate-400 outline-none transition-all duration-300 text-slate-900 dark:text-white text-[15px] hover:bg-white/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/80 focus:border-teal-500 dark:focus:border-emerald-400 focus:shadow-sm';

function FieldError({ show, message }: { show: boolean; message: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          role="alert"
          className="text-xs text-red-600 dark:text-red-400 mt-1.5 overflow-hidden"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function AnimatedInput({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="input-animate-wrapper">
      <label
        htmlFor={htmlFor}
        className="flex items-end min-h-[2.25rem] text-xs text-slate-800 dark:text-slate-200 font-semibold mb-1.5"
      >
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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [entity, setEntity] = useState('');
  const [brief, setBrief] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [touched, setTouched] = useState({ email: false, phone: false, entity: false });
  const emailValid = EMAIL_RE.test(email.trim());
  const phoneValid = PHONE_RE.test(stripPhoneSeparators(phone.trim()));
  const entityValid = ENTITY_RE.test(entity.trim());
  const markTouched = (field: keyof typeof touched) => setTouched((t) => ({ ...t, [field]: true }));
  const scopes = t('contact.scopeOptions', { returnObjects: true }) as unknown as string[];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot field is invisible to real visitors — only a bot filling
    // every input finds it. Pretend success without recording anything so
    // the bot has no signal it was caught.
    if (honeypot) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setSent(true);
      }, 1200);
      return;
    }

    const recent = getRecentSubmissions();
    const last = recent[recent.length - 1];
    const tooSoon = last !== undefined && Date.now() - last < MIN_SUBMIT_INTERVAL_MS;
    if (recent.length >= RATE_LIMIT_MAX || tooSoon) {
      setRateLimited(true);
      return;
    }
    setRateLimited(false);
    recordSubmission([...recent, Date.now()]);

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
                whileHover={{ y: -2 }}
                className="group inline-block mb-7 p-px bg-gradient-to-r from-emerald-400/80 via-teal-400/40 to-cyan-400/80 dark:from-emerald-400/70 dark:via-teal-500/30 dark:to-cyan-400/70 [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]"
              >
                <div className="flex items-center gap-3 px-4 py-2 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-emerald-400"
                      animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(0,174,239,0.9)]" />
                  </span>
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] rtl:tracking-normal rtl:text-xs text-emerald-800 dark:text-emerald-300">
                    {t('contact.badge')}
                  </span>
                </div>
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
                    <Sparkles size={20} className="absolute -top-2 -right-2 text-emerald-400 animate-pulse" />
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
                  {/* Honeypot — invisible to sighted users and skipped by
                      screen readers/tab order; a bot script filling every
                      field in the DOM fills this one too, which flags it. */}
                  <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="field-website">Website</label>
                    <input
                      id="field-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Step 1 — always visible: the two lowest-friction fields.
                      Everything else only appears once the visitor has
                      committed to a real email, so the form never looks
                      like "homework" on first glance. */}
                  <AnimatedInput label={t('contact.scope')} htmlFor="field-scope">
                    <select id="field-scope" className={`${inputBaseClass} cursor-pointer`}>
                      {scopes.map((s) => (
                        <option key={s} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </AnimatedInput>

                  <AnimatedInput label={t('contact.workEmail')} htmlFor="field-email">
                    <div className="relative">
                      <input
                        id="field-email"
                        className={`${inputBaseClass} pe-11 ${
                          emailValid
                            ? 'border-emerald-500 dark:border-emerald-400 shadow-[0_0_0_4px_rgba(0,174,239,0.12)] focus:border-emerald-500 dark:focus:border-emerald-400'
                            : touched.email && email
                              ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400'
                              : ''
                        }`}
                        placeholder="officer@agency.gov.sa"
                        required
                        aria-required="true"
                        aria-invalid={touched.email && email.length > 0 && !emailValid}
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => markTouched('email')}
                      />
                      <AnimatePresence>
                        {emailValid && (
                          <motion.span
                            key="email-check"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="absolute end-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white"
                            aria-hidden="true"
                          >
                            <Check size={13} strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <FieldError
                      show={touched.email && email.length > 0 && !emailValid}
                      message={t('contact.emailError')}
                    />
                  </AnimatedInput>

                  {/* Step 2 — slides in once the email looks real. A screen
                      reader announces the new fields as they're added to
                      the DOM (no visually-hidden-but-focusable limbo). */}
                  <AnimatePresence initial={false}>
                    {emailValid && (
                      <motion.div
                        key="progressive-fields"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-5 pt-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AnimatedInput label={t('contact.entity')} htmlFor="field-entity">
                              <div className="relative">
                                <input
                                  id="field-entity"
                                  className={`${inputBaseClass} pe-11 ${
                                    entity && entityValid
                                      ? 'border-emerald-500 dark:border-emerald-400 shadow-[0_0_0_4px_rgba(0,174,239,0.12)] focus:border-emerald-500 dark:focus:border-emerald-400'
                                      : touched.entity && entity
                                        ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400'
                                        : ''
                                  }`}
                                  placeholder={t('contact.entityPh')}
                                  required
                                  aria-required="true"
                                  aria-invalid={touched.entity && entity.length > 0 && !entityValid}
                                  type="text"
                                  autoComplete="organization"
                                  maxLength={120}
                                  value={entity}
                                  onChange={(e) => setEntity(sanitizeText(e.target.value))}
                                  onBlur={() => markTouched('entity')}
                                />
                                <AnimatePresence>
                                  {entity && entityValid && (
                                    <motion.span
                                      key="entity-check"
                                      initial={{ opacity: 0, scale: 0.6 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.6 }}
                                      transition={{ duration: 0.25, ease: EASE }}
                                      className="absolute end-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white"
                                      aria-hidden="true"
                                    >
                                      <Check size={13} strokeWidth={3} />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                              <FieldError
                                show={touched.entity && entity.length > 0 && !entityValid}
                                message={t('contact.entityError')}
                              />
                            </AnimatedInput>
                            <AnimatedInput label={t('contact.phoneLabel')} htmlFor="field-phone">
                              <div className="relative">
                                <input
                                  id="field-phone"
                                  className={`${inputBaseClass} pe-11 ${
                                    phone && phoneValid
                                      ? 'border-emerald-500 dark:border-emerald-400 shadow-[0_0_0_4px_rgba(0,174,239,0.12)] focus:border-emerald-500 dark:focus:border-emerald-400'
                                      : touched.phone && phone
                                        ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400'
                                        : ''
                                  }`}
                                  placeholder="+966 5x xxx xxxx"
                                  required
                                  aria-required="true"
                                  aria-invalid={touched.phone && phone.length > 0 && !phoneValid}
                                  type="tel"
                                  autoComplete="tel"
                                  inputMode="tel"
                                  pattern="^\+?[0-9\s\-\(\)]{7,20}$"
                                  maxLength={20}
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  onBlur={() => markTouched('phone')}
                                />
                                <AnimatePresence>
                                  {phone && phoneValid && (
                                    <motion.span
                                      key="phone-check"
                                      initial={{ opacity: 0, scale: 0.6 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.6 }}
                                      transition={{ duration: 0.25, ease: EASE }}
                                      className="absolute end-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white"
                                      aria-hidden="true"
                                    >
                                      <Check size={13} strokeWidth={3} />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </div>
                              <FieldError
                                show={touched.phone && phone.length > 0 && !phoneValid}
                                message={t('contact.phoneError')}
                              />
                            </AnimatedInput>
                          </div>

                          <AnimatedInput label={t('contact.brief')} htmlFor="field-brief">
                            <textarea
                              id="field-brief"
                              className={`${inputBaseClass} resize-none`}
                              placeholder={t('contact.briefPh')}
                              rows={3}
                              maxLength={1000}
                              value={brief}
                              onChange={(e) => setBrief(sanitizeText(e.target.value))}
                            />
                          </AnimatedInput>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <FieldError show={rateLimited} message={t('contact.rateLimitError')} />

                  <button
                    className="btn-submit btn-shimmer group relative w-full h-14 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2.5 hover:enabled:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed cursor-pointer"
                    type="submit"
                    disabled={submitting || !emailValid || !phoneValid || !entityValid}
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
                        {/* Same icon treatment as the hero and navbar buttons: a scan line
                            passes over the icon on hover */}
                        <span className="relative flex w-[18px] h-[18px] overflow-hidden" aria-hidden="true">
                          <Send size={18} className="btn-icon rtl:-scale-x-100 text-emerald-300/80 group-hover:text-emerald-300 transition-colors duration-300" />
                          <span className="bio-scan-line [--scan-travel:18px]" />
                        </span>
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
