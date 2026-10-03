import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import seoPlugin from './seo-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
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
})
