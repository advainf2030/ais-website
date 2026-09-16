import { MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTACT } from '../data';
import ScrollReveal from './ScrollReveal';

export default function ContactInfo() {
  const { t } = useTranslation();

  const channels = [
    {
      icon: MapPin,
      label: t('contact.hq'),
      value: t('contact.hqValue'),
      dir: undefined as string | undefined,
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: CONTACT.phone,
      dir: 'ltr',
    },
    {
      icon: Mail,
      label: t('contact.email'),
      value: CONTACT.email,
      dir: undefined as string | undefined,
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 lg:px-8 py-16 scroll-mt-28" id="contact-channels">
      <ScrollReveal className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t('contactChannels.title')}
        </h2>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 font-medium mt-3 max-w-lg mx-auto">
          {t('contactChannels.desc')}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="glass-card rounded-2xl p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-100 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-slate-700 transition-colors duration-300">
                    <Icon size={20} className="text-teal-700 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {ch.label}
                    </span>
                    <span
                      className="block text-sm text-slate-700 dark:text-slate-300 leading-6 font-medium break-words"
                      dir={ch.dir}
                    >
                      {ch.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
