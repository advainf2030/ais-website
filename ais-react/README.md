# AIS Contracting — website

Single-page site for Advanced Information Systems Company (Arabic / English),
deployed to Vercel from `master`.

## Setting up on a new machine

1. Install **Node.js 22 LTS** (the version is pinned in `.nvmrc`; with nvm or
   fnm run `nvm use` / `fnm use` inside `ais-react/`). npm 10 comes with it.
2. Clone and install — use `npm ci`, not `npm install`:

   ```bash
   git clone <repo-url>
   cd <repo>/ais-react
   npm ci
   npm run dev
   ```

   `npm ci` installs the exact versions from `package-lock.json` in one pass
   (no dependency resolution), so it is the fastest and always gives the same
   result. `.npmrc` makes it reuse the local npm cache and skips the audit /
   funding requests, so a second install on the same machine is near-instant.
3. Open http://localhost:5173.

Only `ais-react/` is needed. Never commit `node_modules/` or `dist/` (both are
git-ignored); after pulling changes that touch `package-lock.json`, run
`npm ci` again.

## Commands

```bash
npm run dev       # http://localhost:5173
npm run build     # type-check, then production build (also writes sitemap.xml, robots.txt, llms.txt)
npm run lint      # oxlint
npm run preview   # serve the production build
```

Stack: React 19, Vite 8, TypeScript, Tailwind CSS v4 (theme in `src/index.css`),
framer-motion, GSAP, i18next. Translations live in `src/i18n.ts`; the site URL
used for SEO tags is `SITE_URL` in `seo-plugin.ts`. See `../AGENTS.md` for the
project conventions.
