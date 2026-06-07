import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Warm Editorial typeface set — Fraunces (display), Newsreader (body serif),
// Instrument Sans (UI). The app's styles live in App.tsx's ./styles.css import.
import '@fontsource-variable/fraunces/standard.css'
import '@fontsource-variable/newsreader/standard.css'
import '@fontsource-variable/newsreader/standard-italic.css'
import '@fontsource-variable/instrument-sans/standard.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
