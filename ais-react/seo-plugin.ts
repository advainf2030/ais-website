import type { Plugin } from 'vite';
import i18n from './src/i18n.ts';
import { CONTACT } from './src/data.ts';

// Generated from the same translations the app renders, so the crawler-facing
// copy (JSON-LD, the no-JS fallback inside #root, llms.txt) can't drift from
// what visitors see.

interface Item { title: string; desc: string }
interface Card {
  title: string;
  desc: string;
  subservices?: Item[];
  groups?: { title: string; items: Item[] }[];
}

const MAPS_URL = 'https://maps.google.com/?q=Building+7022+Al+Aqeeq+Dist+Riyadh+13515+KSA';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function content() {
  const en = i18n.getResourceBundle('en', 'translation');
  const cards = en.services.cards as Card[];
  const sections = cards.map((c) => ({
    title: c.title,
    desc: c.desc,
    groups: c.groups ?? [{ title: '', items: c.subservices ?? [] }],
  }));
  return { en, sections };
}

function jsonLd() {
  const { en, sections } = content();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Advanced Information Systems Company',
    alternateName: ['AIS Contracting', 'Advanced Information Systems & Contracting', 'شركة أنظمة المعلومات المتقدمة'],
    description: en.hero.subtitle,
    foundingDate: '1998',
    parentOrganization: { '@type': 'Organization', name: 'City Bandit Limited' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Building 7022, Al Aqeeq Dist',
      addressLocality: 'Riyadh',
      postalCode: '13515',
      addressCountry: 'SA',
    },
    telephone: CONTACT.phone.replace(/\s/g, ''),
    email: CONTACT.email,
    areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: sections.map((s) => ({
        '@type': 'OfferCatalog',
        name: s.title,
        description: s.desc,
        itemListElement: s.groups.flatMap((g) =>
          g.items.map((it) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: it.title, description: it.desc, category: g.title || s.title },
          })),
        ),
      })),
    },
  };
  // `</` can't appear inside the script tag's JSON.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function fallbackHtml() {
  const { en, sections } = content();
  const services = sections
    .map(
      (s) =>
        `<section><h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p>` +
        s.groups
          .map(
            (g) =>
              (g.title ? `<h3>${esc(g.title)}</h3>` : '') +
              `<ul>${g.items.map((it) => `<li><strong>${esc(it.title)}</strong>: ${esc(it.desc)}</li>`).join('')}</ul>`,
          )
          .join('') +
        `</section>`,
    )
    .join('');
  return (
    // Visually hidden: React replaces this on mount; it exists for crawlers
    // and agents that read the HTML without running JavaScript.
    `<div id="root"><div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">` +
    `<h1>${esc(en.hero.titleA)} ${esc(en.hero.titleB)}</h1><p>${esc(en.hero.subtitle)}</p>` +
    `<section><h2>${esc(en.about.title)}</h2>${(en.about.overview as string[]).map((p) => `<p>${esc(p)}</p>`).join('')}` +
    `<h3>${esc(en.about.visionTitle)}</h3><p>${esc(en.about.vision)}</p>` +
    `<h3>${esc(en.about.missionTitle)}</h3><p>${esc(en.about.mission)}</p></section>` +
    services +
    `<section><h2>Contact</h2><p>${esc(en.contact.hqValue)}</p>` +
    `<p><a href="tel:${CONTACT.phone.replace(/\s/g, '')}">${esc(CONTACT.phone)}</a> · <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p></section>` +
    `</div></div>`
  );
}

function llmsTxt() {
  const { en, sections } = content();
  const lines = [
    '# Advanced Information Systems Company (AIS Contracting)',
    '',
    `> ${en.hero.subtitle}`,
    '',
    `## ${en.about.title}`,
    '',
    ...(en.about.overview as string[]).flatMap((p) => [p, '']),
    `**${en.about.visionTitle}:** ${en.about.vision}`,
    '',
    `**${en.about.missionTitle}:** ${en.about.mission}`,
    '',
    ...sections.flatMap((s) => [
      `## ${s.title}`,
      '',
      s.desc,
      '',
      ...s.groups.flatMap((g) => [
        ...(g.title ? [`### ${g.title}`, ''] : []),
        ...g.items.map((it) => `- **${it.title}:** ${it.desc}`),
        '',
      ]),
    ]),
    '## Contact',
    '',
    `- Headquarters: [${en.contact.hqValue}](${MAPS_URL})`,
    `- Phone: [${CONTACT.phone}](tel:${CONTACT.phone.replace(/\s/g, '')})`,
    `- Email: [${CONTACT.email}](mailto:${CONTACT.email})`,
    '',
  ];
  return lines.join('\n');
}

export default function seoPlugin(): Plugin {
  return {
    name: 'ais-seo',
    transformIndexHtml(html) {
      return html
        .replace('<div id="root"></div>', fallbackHtml())
        .replace('</head>', `    <script type="application/ld+json">${jsonLd()}</script>\n  </head>`);
    },
    configureServer(server) {
      server.middlewares.use('/llms.txt', (_req, res) => {
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.end(llmsTxt());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() });
    },
  };
}
