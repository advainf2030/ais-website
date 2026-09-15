# AGENTS.md

## Project

AIS Contracting landing page — single-page marketing site for Advanced Information Systems & Contracting (Saudi tech company). React app lives in `ais-react/`. Root `index.html` is a legacy static version — ignore it.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6** (strict: `noUnusedLocals`, `noUnusedParameters`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — **no `tailwind.config.*` file**. Theme tokens are defined in `src/index.css` using `@theme {}` blocks.
- **framer-motion v13** for animations, **GSAP** for scroll-driven parallax
- **i18next** + **react-i18next** for Arabic/English i18n
- **lucide-react** for icons
- **oxlint** for linting (not ESLint)

## Commands

```bash
cd ais-react
npm run dev       # Vite dev server at localhost:5173
npm run build     # tsc -b && vite build (typecheck first, then bundle)
npm run lint      # oxlint
npm run preview   # serve production build locally
```

Build order matters: `tsc` runs before `vite build`. TypeScript errors will fail the build.

## Architecture

```
ais-react/
├── index.html              # HTML entry + Google Fonts (Inter, Plus Jakarta Sans, IBM Plex Sans Arabic)
├── public/logos/            # All partner/brand logos served statically
├── src/
│   ├── main.tsx             # React root + i18n init import
│   ├── App.tsx              # Layout shell: Aurora → Navbar → sections → Footer
│   ├── i18n.ts              # All EN/AR translations inline (no JSON files)
│   ├── data.ts              # Service cards, pillar cards, partner logos, contact info
│   ├── index.css            # Tailwind v4 theme, glass effects, aurora keyframes, pillar accordion CSS
│   └── components/
│       ├── AuroraBackground  # Fixed fullscreen gradient orbs with GSAP scroll parallax
│       ├── Navbar            # Glass nav with mobile hamburger, language toggle, scroll progress
│       ├── Hero              # Title, stats strip (1998 / Vision 2030 / KSA map)
│       ├── Services          # 4 service cards in a 12-col grid with background images
│       ├── Pillars           # Horizontal accordion (CSS flex, not JS resize)
│       ├── Partners          # Infinite marquee of partner logos
│       ├── Contact           # Form with AnimatePresence success state
│       └── Footer
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

### Pillar Accordion
The horizontal accordion in `Pillars.tsx` is driven by **CSS flex transitions** defined in `index.css` (`#pillar-accordion .pillar-card`), not by JS width manipulation. React state only toggles the `is-active` class.

### Static Assets
All logos are in `public/logos/` and referenced as `logos/filename.ext` (no leading `/` needed — Vite resolves from public root). Service card background images are external URLs from `data.ts`.

### No italic on Arabic
Never use `italic` on Arabic text — IBM Plex Sans Arabic doesn't have an italic variant, and it causes character clipping (especially ن and similar descenders).
