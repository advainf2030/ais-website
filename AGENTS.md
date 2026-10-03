# AGENTS.md

## Project

AIS Contracting landing page — single-page marketing site for Advanced Information Systems & Contracting (Saudi tech company). The React app in `ais-react/` is the whole project (the old static HTML version has been removed).

## Stack

- **Vite 8** + **React 19** + **TypeScript 6** (strict: `noUnusedLocals`, `noUnusedParameters`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — **no `tailwind.config.*` file**. Theme tokens are defined in `src/index.css` using `@theme {}` blocks.
- **framer-motion v13** for animations, **GSAP** (`quickTo`) for the cursor-tilt cards
- **i18next** + **react-i18next** for Arabic/English i18n
- **lucide-react** for icons
- **oxlint** for linting (not ESLint)

## Setup on a new machine

Node.js 22 LTS (pinned in `ais-react/.nvmrc`), then install with **`npm ci`** — it installs the exact `package-lock.json` versions without re-resolving, so it is fast and reproducible. `ais-react/.npmrc` sets `prefer-offline` (reuse the npm cache) and turns off the audit/fund calls. Use `npm install <pkg>` only when adding or upgrading a dependency, and commit the updated `package-lock.json`. Don't add an `engines` field to `package.json`: Vercel reads it and would switch the production Node version.

```bash
cd ais-react
npm ci            # first-time / after package-lock.json changes
```

## Commands

```bash
cd ais-react
npm run dev       # Vite dev server at localhost:5173
npm run build     # tsc -b && vite build (typecheck first, then bundle)
npm run lint      # oxlint
npm run preview   # serve production build locally
```

Build order matters: `tsc` runs before `vite build`. TypeScript errors will fail the build.

`base: './'` in `vite.config.ts` keeps every built URL relative so `dist/` also works when uploaded to a sub-folder on a traditional host. Keep public assets referenced without a leading `/` (`logos/x.svg`, not `/logos/x.svg`).

## Architecture

```
ais-react/
├── index.html              # HTML entry + Google Fonts (Montserrat, IBM Plex Sans Arabic)
├── seo-plugin.ts           # Build plugin: meta/OG/hreflang/JSON-LD, sitemap.xml, robots.txt, llms.txt
├── public/                 # logos/, images/, videos/, og-image.jpg, .htaccess (cPanel hosts), Search Console file (keep)
├── src/
│   ├── main.tsx             # React root + i18n init, keyboard/pointer focus-ring mode
│   ├── App.tsx              # Layout shell: Splash → Aurora → Navbar → sections → Footer
│   ├── i18n.ts              # All EN/AR translations inline (no JSON files)
│   ├── data.ts              # Partner logos, contact info
│   ├── index.css            # Tailwind v4 theme (brand colours), glass, motion keyframes
│   ├── hooks/useTheme.ts    # Theme context + hook
│   ├── lib/splitUnits.ts    # Headline splitting for KineticHeadline (words for Arabic)
│   └── components/
│       ├── SplashScreen      # Logo intro
│       ├── AuroraBackground  # Fixed background: CSS-animated orbs + video (never hide it)
│       ├── Navbar            # Glass nav, mobile drawer, language/theme switches, scroll progress
│       ├── Hero / KineticHeadline  # Title with scroll-dissolve and light-beam reveal
│       ├── TabSystem         # About + service tabs; two-column accordions
│       ├── AboutScenes       # Scroll scenes for About (pinned on desktop, position-driven on touch)
│       ├── WhyChooseUs, ContactInfo, Partners, Contact, Footer
│       ├── ScrollReveal      # whileInView wrapper
│       └── ThemeContext      # ThemeProvider
```

## Critical Gotchas

### Tailwind v4 — No config file
Tailwind v4 uses CSS-first configuration. All theme customization is in `src/index.css` inside `@theme {}`. There is no `tailwind.config.js/ts`. The Vite plugin `@tailwindcss/vite` handles everything.

### Arabic/RTL
- `App.tsx` sets `document.documentElement.dir` and `lang` reactively based on i18n language.
- Arabic font is **IBM Plex Sans Arabic**, loaded via Google Fonts in `index.html`.
- The RTL font override in `index.css` uses `html[dir="rtl"] *` with `!important` — this is required because Tailwind utility classes (`font-sans`, `font-display`) have higher specificity and would otherwise override the Arabic font.
- All translations are in `src/i18n.ts` inline, not separate JSON files. Both `en` and `ar` are in the same `resources` object.
- Arabic translations should read naturally — avoid AI-sounding terms like "سيادية", "حوكمة سيادية", "مصفوفات احتياطية". Write like a real Saudi company website.

### framer-motion v13 typing
Cubic-bezier ease arrays must be typed as tuples: `[0.22, 0.61, 0.36, 1] as [number, number, number, number]`. Plain `number[]` causes TS errors with framer-motion's `Variants` type.

### Accordion layout
In the two-column service accordions (`TabSystem.tsx`), an item opened in the second column swaps places with the item opposite it (CSS `order`), so its description opens directly beneath it. DOM order never changes.

### Static Assets
All logos are in `public/logos/` and referenced as `logos/filename.ext` (no leading `/` needed — Vite resolves from public root). Service images live in `public/images/`.

### No italic on Arabic
Never use `italic` on Arabic text — IBM Plex Sans Arabic doesn't have an italic variant, and it causes character clipping (especially ن and similar descenders).
