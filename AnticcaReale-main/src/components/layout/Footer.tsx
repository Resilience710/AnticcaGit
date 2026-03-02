import { Link } from 'react-router-dom';
import { TR } from '../../constants/tr';

export default function Footer() {
  return (
    <footer className="bg-obsidian-600 relative">
      <div className="divider-gold" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="font-display text-2xl text-agold-300 tracking-display italic">
              {TR.siteName}
            </Link>
            <p className="mt-7 text-parchment-500 max-w-sm leading-[1.9] text-[13px]">{TR.footer.description}</p>
            <div className="mt-8 w-16 h-[1px] bg-agold-800 animate-line-expand" />
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="font-display text-[10px] text-agold-500 mb-7 tracking-extreme uppercase">Keşfet</h3>
            <ul className="space-y-4">
              {[{ to: '/products', label: TR.nav.products }, { to: '/auctions', label: TR.nav.auction }, { to: '/shops', label: TR.nav.shops }, { to: '/blog', label: 'Blog' }].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-parchment-500 hover:text-agold-300 transition-colors duration-500 text-[13px] tracking-elegant">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-[10px] text-agold-500 mb-7 tracking-extreme uppercase">Bilgi</h3>
            <ul className="space-y-4">
              {[{ to: '/about', label: TR.footer.about }, { to: '/contact', label: TR.footer.contact }, { to: '/terms', label: TR.footer.terms }, { to: '/privacy', label: TR.footer.privacy }, { to: '/cookies', label: 'Çerez Politikası' }].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-parchment-500 hover:text-agold-300 transition-colors duration-500 text-[13px] tracking-elegant">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-agold-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-parchment-600 text-[11px] tracking-elegant">&copy; {new Date().getFullYear()} {TR.siteName}. {TR.footer.rights}</p>
          <p className="text-parchment-700 text-[9px] tracking-extreme uppercase">Antikacılar Online Hizmet Platformu</p>
        </div>
      </div>
    </footer>
  );
}
