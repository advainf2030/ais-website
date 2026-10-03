import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import seoPlugin from './seo-plugin.ts'

// `vite build --mode standalone` (npm run build:standalone): one classic
// script instead of ES modules. Browsers refuse module scripts and
// crossorigin stylesheets on file://, so this build also runs when index.html
// is opened straight from a folder, with no server and no internet.
function classicScripts(): Plugin {
  return {
    name: 'classic-scripts',
    transformIndexHtml: {
      order: 'post',
      handler: (html) =>
        html
          .replace(/<script type="module" crossorigin src=/g, '<script defer src=')
          .replace(/<link rel="stylesheet" crossorigin /g, '<link rel="stylesheet" '),
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const standalone = mode === 'standalone'
  return {
    // Relative asset URLs: the same dist/ works at a domain root (Vercel) and
    // when uploaded into any sub-folder of a traditional host (cPanel/Spaceship)
    base: './',
    // The standalone build is the one uploaded to the client's own domain
    plugins: [react(), tailwindcss(), seoPlugin(standalone ? { siteUrl: 'https://advainf.com' } : {}), standalone && classicScripts()],
    build: {
      sourcemap: !standalone,
      modulePreload: standalone ? false : undefined,
      // one stylesheet file (a non-ES build would otherwise inject the CSS from JS)
      cssCodeSplit: !standalone,
      chunkSizeWarningLimit: standalone ? 1024 : undefined,
      rolldownOptions: {
        output: standalone
          ? { format: 'iife', codeSplitting: false }
          : {
              // Large libraries in their own long-cached chunks; the app chunk then
              // stays small and only it changes between deploys
              codeSplitting: {
                groups: [
                  { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
                  { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
                  { name: 'gsap', test: /node_modules[\\/]gsap[\\/]/ },
                  { name: 'i18n', test: /node_modules[\\/](i18next|react-i18next|i18next-browser-languagedetector)[\\/]/ },
                ],
              },
            },
        onLog(level, log, handler) {
          // Tailwind's Vite plugin transforms CSS without emitting a sourcemap;
          // the warning is about the CSS step only — the JS maps are correct
          if (log.code === 'SOURCEMAP_BROKEN' && log.plugin?.startsWith('@tailwindcss/vite')) return
          handler(level, log)
        },
      },
    },
  }
})
