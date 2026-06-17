import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

// The game and the password-gated dev console are separate surfaces. Load only
// the one the current path needs, so /dev never pulls in the game bundle (and
// the game never pays for the editor). Vercel rewrites every path to index.html,
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
