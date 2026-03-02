import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

// Yield to main thread before heavy React hydration to allow First Contentful Paint
const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>,
  )
};

if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(renderApp, { timeout: 1000 });
} else {
  setTimeout(renderApp, 10);
}
