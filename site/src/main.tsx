import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import GalleryPage from './pages/GalleryPage.tsx'
import { SiteShell } from './components/layout/SiteShell.tsx'

const path = window.location.pathname.replace(/\/$/, '') || '/'
const isGalleryPage = path === '/galeria'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteShell includeVideo={!isGalleryPage}>
      {isGalleryPage ? <GalleryPage /> : <App />}
    </SiteShell>
  </StrictMode>,
)
