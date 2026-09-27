import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'

// Focus rings are for keyboard users. Programmatic focus after a tap (the
// mobile menu moves focus into the drawer and back to the menu button) would
// otherwise leave a ring on screen, so remember how the visitor last interacted.
const setInput = (mode: 'pointer' | 'keyboard') => {
  document.documentElement.dataset.input = mode
}
window.addEventListener('pointerdown', () => setInput('pointer'), { capture: true, passive: true })
window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' || e.key.startsWith('Arrow') || e.key === 'Enter' || e.key === ' ') setInput('keyboard')
}, { capture: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
