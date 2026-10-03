# AIS Contracting — website

Single-page site for Advanced Information Systems Company (Arabic / English),
deployed to Vercel from `master`.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check, then production build (also writes sitemap.xml, robots.txt, llms.txt)
npm run lint      # oxlint
npm run preview   # serve the production build
```

Stack: React 19, Vite 8, TypeScript, Tailwind CSS v4 (theme in `src/index.css`),
framer-motion, GSAP, i18next. Translations live in `src/i18n.ts`; the site URL
used for SEO tags is `SITE_URL` in `seo-plugin.ts`. See `../AGENTS.md` for the
project conventions.
