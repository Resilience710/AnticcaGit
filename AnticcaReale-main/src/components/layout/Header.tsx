import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Settings, Package, BookOpen, Info, Home, Store, Grid3X3, Gavel } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';
import { CATEGORIES } from '../../types';

const MEGA_MENU_CATEGORIES = [
  { name: 'Mobilya', icon: '🪑' },
  { name: 'Seramik', icon: '🏺' },
  { name: 'Mücevherat', icon: '💎' },
  { name: 'Halı & Kilim', icon: '🧶' },
  { name: 'Sanat Eserleri', icon: '🎨' },
  { name: 'Aydınlatma', icon: '🕯️' },
  { name: 'Saatler', icon: '⏰' },
  { name: 'Nadir Kitaplar', icon: '📚' },
  { name: 'Dekorasyon & Aksesuar', icon: '🪞' },
  { name: 'Ayna', icon: '🪟' },
  { name: 'Koleksiyon', icon: '🏛️' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentUser, userData, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Fetch a few products for the mega menu images
  const { products: megaProducts } = useProducts({ sortBy: 'newest' }, 12);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMenus = () => {
    setUserMenuOpen(false);
  };

  const openMegaMenu = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const closeMegaMenu = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setHoveredCategory(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    };
  }, []);

  // Get products for hovered category
  const getCategoryProducts = (categoryName: string) => {
    return megaProducts
      .filter((p) => p.category === categoryName && p.images?.length > 0)
      .slice(0, 4);
  };

  const displayProducts = hoveredCategory
    ? getCategoryProducts(hoveredCategory)
    : megaProducts.filter((p) => p.images?.length > 0).slice(0, 4);

  return (
    <header className="bg-olive-800/90 glass-dark text-linen-100 sticky top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-h-[44px] min-w-[44px]">
            <span className="font-serif text-xl sm:text-2xl font-bold text-gold-500">
              {TR.siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              {TR.nav.home}
            </Link>

            {/* Products with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
            >
              <Link
                to="/products"
                className="text-linen-100 hover:text-gold-500 transition-colors py-2 inline-flex items-center"
              >
                {TR.nav.products}
              </Link>

              {/* Mega Menu Dropdown — Prada Style */}
              {megaMenuOpen && (
                <div
                  className="fixed left-0 right-0 top-16 bg-white border-t border-linen-200 z-50 shadow-lg"
                  onMouseEnter={openMegaMenu}
                  onMouseLeave={closeMegaMenu}
                >
                  <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex gap-8">
                      {/* Left — Product Thumbnails (2 rows x 3) */}
                      <div className="flex-shrink-0">
                        <div className="grid grid-cols-3 gap-3" style={{ width: '300px' }}>
                          {displayProducts.slice(0, 6).map((product) => (
                            <Link
                              key={product.id}
                              to={`/products/${product.id}`}
                              onClick={() => setMegaMenuOpen(false)}
                              className="group"
                            >
                              <div className="aspect-square overflow-hidden bg-linen-100">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Center — Feature Image */}
                      {displayProducts.length > 0 && (
                        <div className="flex-shrink-0 w-[200px]">
                          <Link
                            to={`/products/${displayProducts[0]?.id}`}
                            onClick={() => setMegaMenuOpen(false)}
                            className="block h-full"
                          >
                            <div className="h-full overflow-hidden bg-gold-50 relative">
                              <img
                                src={displayProducts[0]?.images[0]}
                                alt={displayProducts[0]?.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                        </div>
                      )}

                      {/* Right — Category Links (2 columns) */}
                      <div className="flex gap-12 flex-1">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-espresso-900 mb-4">
                            Kategoriler
                          </h4>
                          <ul className="space-y-2">
                            {MEGA_MENU_CATEGORIES.slice(0, 6).map((cat) => (
                              <li key={cat.name}>
                                <Link
                                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  onMouseEnter={() => setHoveredCategory(cat.name)}
                                  className="text-sm text-espresso-700 hover:text-espresso-900 hover:underline transition-colors"
                                >
                                  {cat.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-espresso-900 mb-4">
                            Daha Fazla
                          </h4>
                          <ul className="space-y-2">
                            {MEGA_MENU_CATEGORIES.slice(6).map((cat) => (
                              <li key={cat.name}>
                                <Link
                                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  onMouseEnter={() => setHoveredCategory(cat.name)}
                                  className="text-sm text-espresso-700 hover:text-espresso-900 hover:underline transition-colors"
                                >
                                  {cat.name}
                                </Link>
                              </li>
                            ))}
                            <li className="pt-2">
                              <Link
                                to="/products"
                                onClick={() => setMegaMenuOpen(false)}
                                className="text-sm font-semibold text-espresso-900 hover:underline"
                              >
                                Tüm Ürünler →
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/auctions"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              {TR.nav.auction}
            </Link>
            <Link
              to="/shops"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              {TR.nav.shops}
            </Link>
            <Link
              to="/blog"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              Blog
            </Link>
            <Link
              to="/about"
              className="text-linen-100 hover:text-gold-500 transition-colors py-2"
            >
              Hakkımızda
            </Link>
          </div>

          {/* Right side - Cart & User */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart - Always visible */}
            <Link
              to="/cart"
              className="relative text-linen-100 hover:text-gold-500 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={`Sepet (${totalItems} ürün)`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-espresso-950 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            {currentUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-linen-100 hover:text-gold-500 transition-colors p-2 min-h-[44px]"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden lg:inline max-w-[100px] truncate">{userData?.name || 'Kullanıcı'}</span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={closeMenus} />
                    <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-mist-300">
                        <p className="font-medium text-espresso-900 truncate">{userData?.name}</p>
                        <p className="text-sm text-espresso-600 truncate">{userData?.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-espresso-800 hover:bg-linen-200 transition-colors"
                      >
                        <Package className="h-5 w-5 mr-3 text-espresso-600" />
                        {TR.nav.orders}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center px-4 py-3 text-espresso-800 hover:bg-linen-200 transition-colors"
                        >
                          <Settings className="h-5 w-5 mr-3 text-espresso-600" />
                          {TR.nav.adminPanel}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-3 text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        {TR.nav.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-linen-100 hover:text-gold-500 transition-colors py-2 px-3"
                >
                  {TR.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 text-espresso-950 px-4 py-2 rounded-lg hover:bg-gold-400 transition-colors font-medium"
                >
                  {TR.nav.register}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-linen-100 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-olive-600 animate-in slide-in-from-top duration-200">
            {/* User info (if logged in) */}
            {currentUser && (
              <div className="px-2 py-3 mb-3 bg-olive-700/50 rounded-lg">
                <p className="font-medium text-linen-100">{userData?.name || 'Kullanıcı'}</p>
                <p className="text-sm text-linen-100/70 truncate">{userData?.email}</p>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Home className="h-5 w-5 text-gold-500" />
                {TR.nav.home}
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Grid3X3 className="h-5 w-5 text-gold-500" />
                {TR.nav.products}
              </Link>
              <Link
                to="/auctions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Gavel className="h-5 w-5 text-gold-500" />
                {TR.nav.auction}
              </Link>
              <Link
                to="/shops"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Store className="h-5 w-5 text-gold-500" />
                {TR.nav.shops}
              </Link>
              <Link
                to="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <BookOpen className="h-5 w-5 text-gold-500" />
                Blog
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
              >
                <Info className="h-5 w-5 text-gold-500" />
                Hakkımızda
              </Link>
            </div>

            {/* User Actions */}
            {currentUser ? (
              <div className="mt-4 pt-4 border-t border-olive-600 space-y-1">
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
                >
                  <Package className="h-5 w-5 text-gold-500" />
                  {TR.nav.orders}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-linen-100 hover:bg-olive-700 rounded-lg transition-colors min-h-[48px]"
                  >
                    <Settings className="h-5 w-5 text-gold-500" />
                    {TR.nav.adminPanel}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors min-h-[48px]"
                >
                  <LogOut className="h-5 w-5" />
                  {TR.nav.logout}
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-olive-600 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-linen-100 border border-linen-100/30 rounded-lg hover:bg-olive-700 transition-colors min-h-[48px]"
                >
                  {TR.nav.login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-gold-500 text-espresso-950 px-4 py-3 rounded-lg hover:bg-gold-400 transition-colors font-medium min-h-[48px]"
                >
                  {TR.nav.register}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
