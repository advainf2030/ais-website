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

// The one place the production domain lives. When the site moves to its own
// domain, change this default (or set SITE_URL in the host's env vars) and
// canonical, hreflang, Open Graph, JSON-LD, sitemap and robots all follow.
// Order: SITE_URL env var, then seoPlugin({ siteUrl }), then this default.
const DEFAULT_SITE_URL = 'https://advaninfo.vercel.app';
let SITE_URL = DEFAULT_SITE_URL;
const abs = (path = '') => `${SITE_URL}/${path.replace(/^\//, '')}`;
const langUrl = (lng: 'en' | 'ar') => `${SITE_URL}/?lang=${lng}`;

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
  const orgId = `${SITE_URL}/#organization`;
  const businessId = `${SITE_URL}/#business`;
  const address = {
    '@type': 'PostalAddress',
    streetAddress: 'Building 7022, Al Aqeeq Dist',
    addressLocality: 'Riyadh',
    postalCode: '13515',
    addressCountry: 'SA',
  };
  const telephone = CONTACT.phone.replace(/\s/g, '');
  const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const services = sections.flatMap((s) =>
    s.groups.flatMap((g) =>
      g.items.map((it) => ({
        '@type': 'Service',
        '@id': `${SITE_URL}/#service-${slug(it.title)}`,
        name: it.title,
        description: it.desc,
        serviceType: g.title || s.title,
        category: s.title,
        provider: { '@id': businessId },
        areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
      })),
    ),
  );
  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: 'Advanced Information Systems Company',
      alternateName: ['AIS Contracting', 'Advanced Information Systems & Contracting', 'شركة أنظمة المعلومات المتقدمة'],
      url: abs(),
      logo: { '@type': 'ImageObject', url: abs('logos/ais-app-icon.png'), width: 512, height: 512 },
      image: abs('og-image.jpg'),
      description: en.hero.subtitle,
      foundingDate: '1998',
      parentOrganization: { '@type': 'Organization', name: 'City Bandit Limited' },
      address,
      email: CONTACT.email,
      telephone,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone,
        email: CONTACT.email,
        areaServed: 'SA',
        availableLanguage: ['English', 'Arabic'],
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': businessId,
      name: 'Advanced Information Systems Company',
      url: abs(),
      image: abs('og-image.jpg'),
      parentOrganization: { '@id': orgId },
      address,
      hasMap: MAPS_URL,
      telephone,
      email: CONTACT.email,
      areaServed: { '@type': 'Country', name: 'Saudi Arabia' },
      knowsAbout: sections.map((s) => s.title),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: services.map((svc) => ({ '@type': 'Offer', itemOffered: { '@id': svc['@id'] } })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: abs(),
      name: 'AIS Contracting',
      inLanguage: ['en', 'ar'],
      publisher: { '@id': orgId },
    },
    ...services,
  ];
  // `</` can't appear inside the script tag's JSON.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

function headTags() {
  const { en } = content();
  const title = esc(en.meta.title);
  const desc = esc(en.meta.description);
  const img = abs('og-image.jpg');
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<link rel="canonical" href="${abs()}" />`,
    `<link rel="alternate" hreflang="en" href="${langUrl('en')}" />`,
    `<link rel="alternate" hreflang="ar" href="${langUrl('ar')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${abs()}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="AIS Contracting" />`,
    `<meta property="og:url" content="${abs()}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:secure_url" content="${img}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Advanced Information Systems Company: Software, Cyber Security, Managed IT, Telecom, Power" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:locale:alternate" content="ar_SA" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<script type="application/ld+json">${jsonLd()}</script>`,
  ]
    .map((t) => `    ${t}`)
    .join('\n');
}

function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const alternates = [
    `<xhtml:link rel="alternate" hreflang="en" href="${esc(langUrl('en'))}"/>`,
    `<xhtml:link rel="alternate" hreflang="ar" href="${esc(langUrl('ar'))}"/>`,
    `<xhtml:link rel="alternate" hreflang="x-default" href="${abs()}"/>`,
  ].join('');
  const url = (loc: string, priority: string) =>
    `  <url><loc>${esc(loc)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority>${alternates}</url>`;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    url(abs(), '1.0'),
    url(langUrl('en'), '0.9'),
    url(langUrl('ar'), '0.9'),
    '</urlset>',
    '',
  ].join('\n');
}

function robotsTxt() {
  // A wildcard already allows everyone; naming the search and AI crawlers
  // documents the intent and survives a future stricter default.
  const bots = [
    'Googlebot', 'Bingbot', 'Applebot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Bytespider',
  ];
  return [
    ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${abs('sitemap.xml')}`,
    '',
  ].join('\n');
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

const TEXT_FILES: Record<string, { type: string; body: () => string }> = {
  'llms.txt': { type: 'text/markdown', body: llmsTxt },
  'sitemap.xml': { type: 'application/xml', body: sitemapXml },
  'robots.txt': { type: 'text/plain', body: robotsTxt },
};

export default function seoPlugin({ siteUrl }: { siteUrl?: string } = {}): Plugin {
  SITE_URL = (process.env.SITE_URL ?? siteUrl ?? DEFAULT_SITE_URL).replace(/\/$/, '');
  return {
    name: 'ais-seo',
    transformIndexHtml(html) {
      return html
        .replace('<div id="root"></div>', fallbackHtml())
        .replace('</head>', `${headTags()}\n  </head>`);
    },
    configureServer(server) {
      for (const [file, { type, body }] of Object.entries(TEXT_FILES)) {
        server.middlewares.use(`/${file}`, (_req, res) => {
          res.setHeader('Content-Type', `${type}; charset=utf-8`);
          res.end(body());
        });
      }
    },
    generateBundle() {
      for (const [file, { body }] of Object.entries(TEXT_FILES)) {
        this.emitFile({ type: 'asset', fileName: file, source: body() });
      }
    },
  };
}
