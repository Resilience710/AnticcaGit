import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package, BookOpen, Info, Home, Store, Grid3X3, Gavel, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { TR } from '../../constants/tr';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, userData, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); setMobileMenuOpen(false); navigate('/'); } catch (e) { console.error(e); }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-agold-900/10 transition-all duration-700">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18 lg:h-22">
          {/* Logo */}
          <Link to="/" className="flex items-center min-h-[44px] group">
            <span className="font-display text-xl sm:text-2xl text-agold-300 tracking-display italic transition-all duration-700 group-hover:text-agold-200 group-hover:tracking-[0.2em]">
              {TR.siteName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10 lg:space-x-12">
            {[
              { to: '/', label: TR.nav.home },
              { to: '/products', label: TR.nav.products },
              { to: '/auctions', label: TR.nav.auction },
              { to: '/shops', label: TR.nav.shops },
              { to: '/blog', label: 'Blog' },
              { to: '/about', label: 'Hakkımızda' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="relative text-parchment-400 hover:text-agold-300 transition-colors duration-500 py-2 text-[13px] tracking-elegant group">
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-agold-400 group-hover:w-full transition-all duration-500 ease-out" />
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="text-parchment-400 hover:text-agold-300 transition-all duration-500 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Tema değiştir">
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <Link to="/cart" className="relative text-parchment-400 hover:text-agold-300 transition-colors duration-500 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Sepetim">
              <ShoppingCart className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-agold-400 text-obsidian-400 text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="relative hidden md:block">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center space-x-2 text-parchment-400 hover:text-agold-300 transition-colors duration-500 p-2 min-h-[44px]" aria-label="Kullanıcı Menüsü">
                  <User className="h-[18px] w-[18px]" />
                  <span className="hidden lg:inline max-w-[100px] truncate text-[13px] tracking-elegant">{userData?.name || 'Kullanıcı'}</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-56 glass-dark rounded-sm shadow-dramatic py-2 z-50 animate-fade-up-subtle">
                      <div className="px-4 py-3 border-b border-agold-900/15">
                        <p className="font-serif text-parchment-100 text-sm">{userData?.name}</p>
                        <p className="text-[11px] text-parchment-600 truncate mt-0.5">{userData?.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-3 text-parchment-300 hover:bg-agold-900/8 hover:text-agold-300 transition-all duration-300">
                        <Package className="h-4 w-4 mr-3 text-parchment-600" /><span className="text-[13px]">{TR.nav.orders}</span>
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-3 text-parchment-300 hover:bg-agold-900/8 hover:text-agold-300 transition-all duration-300">
                          <Settings className="h-4 w-4 mr-3 text-parchment-600" /><span className="text-[13px]">{TR.nav.adminPanel}</span>
                        </Link>
                      )}
                      <button onClick={() => { setUserMenuOpen(false); handleLogout(); }} className="flex items-center w-full px-4 py-3 text-burgundy-300 hover:bg-burgundy-900/15 transition-all duration-300">
                        <LogOut className="h-4 w-4 mr-3" /><span className="text-[13px]">{TR.nav.logout}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-parchment-400 hover:text-agold-300 transition-colors duration-500 py-2 px-3 text-[13px] tracking-elegant">{TR.nav.login}</Link>
                <Link to="/register" className="border border-agold-700/40 text-agold-300 px-6 py-2.5 hover:bg-agold-400 hover:text-obsidian-400 hover:border-agold-400 transition-all duration-700 text-[12px] tracking-display uppercase">{TR.nav.register}</Link>
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-parchment-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label={mobileMenuOpen ? "Mobil menüyü kapat" : "Mobil menüyü aç"}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-agold-900/10 animate-fade-up-subtle">
            {currentUser && (
              <div className="px-3 py-4 mb-4 bg-charcoal-200/50 border border-agold-900/8">
                <p className="font-serif text-parchment-100 text-sm">{userData?.name || 'Kullanıcı'}</p>
                <p className="text-[11px] text-parchment-600 truncate">{userData?.email}</p>
              </div>
            )}
            <div className="space-y-0.5">
              {[
                { to: '/', icon: <Home className="h-5 w-5" />, label: TR.nav.home },
                { to: '/products', icon: <Grid3X3 className="h-5 w-5" />, label: TR.nav.products },
                { to: '/auctions', icon: <Gavel className="h-5 w-5" />, label: TR.nav.auction },
                { to: '/shops', icon: <Store className="h-5 w-5" />, label: TR.nav.shops },
                { to: '/blog', icon: <BookOpen className="h-5 w-5" />, label: 'Blog' },
                { to: '/about', icon: <Info className="h-5 w-5" />, label: 'Hakkımızda' },
              ].map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-3 py-3.5 text-parchment-400 hover:text-agold-300 hover:bg-charcoal-200/30 transition-all duration-300 min-h-[48px] text-[14px]">
                  <span className="text-parchment-600">{link.icon}</span>{link.label}
                </Link>
              ))}
            </div>
            {currentUser ? (
              <div className="mt-5 pt-5 border-t border-agold-900/10 space-y-0.5">
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-3 py-3.5 text-parchment-400 hover:text-agold-300 hover:bg-charcoal-200/30 transition-all duration-300 min-h-[48px]"><Package className="h-5 w-5 text-parchment-600" />{TR.nav.orders}</Link>
                {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-3 py-3.5 text-parchment-400 hover:text-agold-300 hover:bg-charcoal-200/30 transition-all duration-300 min-h-[48px]"><Settings className="h-5 w-5 text-parchment-600" />{TR.nav.adminPanel}</Link>}
                <button onClick={handleLogout} className="flex items-center gap-4 w-full px-3 py-3.5 text-burgundy-300 hover:bg-burgundy-900/15 transition-all duration-300 min-h-[48px]"><LogOut className="h-5 w-5" />{TR.nav.logout}</button>
              </div>
            ) : (
              <div className="mt-5 pt-5 border-t border-agold-900/10 space-y-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3.5 text-parchment-300 border border-agold-900/20 hover:border-agold-600 hover:text-agold-300 transition-all duration-500">{TR.nav.login}</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center bg-agold-400 text-obsidian-400 px-4 py-3.5 hover:bg-agold-300 transition-colors duration-500 font-medium tracking-elegant">{TR.nav.register}</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
