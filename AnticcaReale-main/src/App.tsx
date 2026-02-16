import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/layout/Layout';
import Loading from './components/ui/Loading';

// Lazy-loaded Pages (code splitting for better Core Web Vitals)
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AuctionsPage = lazy(() => import('./pages/AuctionsPage'));
const ShopsPage = lazy(() => import('./pages/ShopsPage'));
const ShopDetailPage = lazy(() => import('./pages/ShopDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'));
const CheckoutFailPage = lazy(() => import('./pages/CheckoutFailPage'));

// Admin Pages (lazy-loaded)
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminShops = lazy(() => import('./pages/admin/AdminShops'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAuctions = lazy(() => import('./pages/admin/AdminAuctions'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading fullScreen />}>
              <Routes>
                {/* Main Layout Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="products/:id" element={<ProductDetailPage />} />
                  <Route path="auctions" element={<AuctionsPage />} />
                  <Route path="shops" element={<ShopsPage />} />
                  <Route path="shops/:id" element={<ShopDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:id" element={<BlogDetailPage />} />
                  <Route path="checkout/success" element={<CheckoutSuccessPage />} />
                  <Route path="checkout/fail" element={<CheckoutFailPage />} />
                </Route>

                {/* Auth Routes (no layout) */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Admin Routes */}
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="shops" element={<AdminShops />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="auctions" element={<AdminAuctions />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="blog" element={<AdminBlog />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-cream-50">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-navy-800 mb-4">404</h1>
                      <p className="text-navy-600">Sayfa bulunamadı.</p>
                    </div>
                  </div>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
