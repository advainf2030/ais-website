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

## Hosting outside Vercel (cPanel, Spaceship, any Apache/LiteSpeed host)

The browser can't run the source (`index.html` there loads `src/main.tsx`), so
the server must get the **build**, never the project folder.

**Offline / on a computer:** the `hosting` branch has no internet
dependencies. GitHub → branch `hosting` → *Code* → *Download ZIP*, unzip, and
double-click `index.html` (or `npm run build:standalone` and open `dist/index.html`).

**Pulling from GitHub (recommended):** on every push to `master`, the GitHub
Action `.github/workflows/hosting.yml` builds the site (for
`https://advainf.com`) and commits the ready files to the **`hosting`**
branch. The server needs no Node.js or npm:

- cPanel → *Git Version Control* → *Create* → Clone URL = the repo, Repository
  Path = the domain's document root (*Domains* → *Document Root*, must be
  empty), then under *Manage* set the checked-out branch to `hosting`.
- To update later: *Manage* → *Pull or Deploy* → *Update from Remote*.
- Without cPanel Git: GitHub → switch branch to `hosting` → *Code* →
  *Download ZIP*, and upload the files inside it to the document root.

**Automatic upload on every push (FTP):** add repo secrets `FTP_SERVER`,
`FTP_USERNAME`, `FTP_PASSWORD` (Settings → Secrets and variables → Actions;
cPanel → *FTP Accounts* shows the server and user). The Action then uploads the
build into `public_html/` after each push. Optional repo variables: `FTP_DIR`
(another document root, ending in `/`) and `FTP_PROTOCOL` (`ftp` if the host
rejects FTPS).

If the Action fails to push, enable *Settings → Actions → General → Workflow
permissions → Read and write* on the repo.

**Manual build:**

1. `npm run build:standalone`. Canonical / Open Graph / sitemap already point
   to `https://advainf.com`; for another domain set `SITE_URL` first
   (PowerShell: `$env:SITE_URL="https://example.com"; npm run build:standalone`).
2. Upload the **contents** of `dist/` (`index.html`, `assets/`, `logos/`, …,
   including the hidden `.htaccess`) into `public_html/` or any sub-folder.
   `*.map` files are optional.

Asset URLs are relative (`base: './'` in `vite.config.ts`), so the same build
works at the domain root and in a sub-folder. Only the standalone build
(`npm run build:standalone`) opens by double-click (`file://`): the normal
build uses ES modules, which browsers block there.

Stack: React 19, Vite 8, TypeScript, Tailwind CSS v4 (theme in `src/index.css`),
framer-motion, GSAP, i18next. Translations live in `src/i18n.ts`; the site URL
used for SEO tags is `SITE_URL` in `seo-plugin.ts`. See `../AGENTS.md` for the
project conventions.
