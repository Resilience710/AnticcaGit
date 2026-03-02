import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingCart, LogOut, BookOpen, Gavel } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TR } from '../../constants/tr';
import Loading from '../../components/ui/Loading';

const navItems = [
  { path: '/admin', label: TR.admin.dashboard, icon: LayoutDashboard, exact: true },
  { path: '/admin/shops', label: TR.admin.shops, icon: Store },
  { path: '/admin/products', label: TR.admin.products, icon: Package },
  { path: '/admin/auctions', label: TR.admin.auctions, icon: Gavel },
  { path: '/admin/orders', label: TR.admin.orders, icon: ShoppingCart },
  { path: '/admin/blog', label: 'Blog Yönetimi', icon: BookOpen },
];

export default function AdminLayout() {
  const { currentUser, userData, loading, logout, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-linen-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-linen-200 text-espresso-900 flex-shrink-0 hidden md:flex flex-col border-r border-mist-300">
        <div className="p-6 border-b border-mist-300">
          <Link to="/" className="font-display text-2xl font-bold text-agold-500">
            {TR.siteName}
          </Link>
          <p className="text-sm text-espresso-500 mt-1">{TR.admin.title}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-agold-500 text-linen-50 shadow-md'
                  : 'text-espresso-700 hover:bg-linen-300'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-mist-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-agold-500 flex items-center justify-center text-linen-50 font-bold">
              {userData?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-medium text-espresso-900">{userData?.name}</p>
              <p className="text-xs text-espresso-500">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-espresso-700 hover:text-burgundy-500 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            {TR.nav.logout}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-linen-200 text-espresso-900 z-40 border-b border-mist-300">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="font-serif text-xl font-bold text-agold-500">
            {TR.siteName} Admin
          </Link>
        </div>
        <nav className="flex overflow-x-auto border-t border-navy-700 px-2">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${isActive
                  ? 'border-agold-500 text-agold-600 font-medium'
                  : 'border-transparent text-espresso-600'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-8 p-4 pt-28 md:pt-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
