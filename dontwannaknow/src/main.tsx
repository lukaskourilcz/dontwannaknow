import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

// The public report and the password-gated dev console are separate surfaces.
// Load only the one the current path needs, so neither downloads the other's
// code. Vercel rewrites every path to index.html,
// so client-side path routing works in production too.
const App = lazy(() => import('./App.tsx'))
const DevApp = lazy(() => import('./dev/DevApp.tsx'))

const isDevRoute = window.location.pathname.startsWith('/dev')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {isDevRoute ? <DevApp /> : <App />}
    </Suspense>
  </StrictMode>,
)
