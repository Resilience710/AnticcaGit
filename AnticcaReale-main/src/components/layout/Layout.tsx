import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
const Footer = lazy(() => import('./Footer'));

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian-400 text-parchment-200 relative">
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
