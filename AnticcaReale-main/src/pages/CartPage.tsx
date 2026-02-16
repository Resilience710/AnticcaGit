import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Shield, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import Button from '../components/ui/Button';
import {
  initiateShopierPayment,
  parseUserName,
  formatPhoneNumber,
  type CreatePaymentRequest
} from '../services/shopierService';
import SEO from '../components/seo/SEO';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'creating_order' | 'redirecting'>('idle');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const handleShopierCheckout = async () => {
    if (!currentUser || !userData) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (!userData.name || !userData.email) {
      setError('Lütfen profil bilgilerinizi tamamlayın.');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentStep('creating_order');

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
        shopId: item.product.shopId,
        shopName: '',
        quantity: item.quantity,
        price: item.product.price,
      }));

      const orderId = await createOrder({
        userId: currentUser.uid,
        userEmail: userData.email,
        userName: userData.name,
        userPhone: userData.phone,
        userAddress: userData.address,
        items: orderItems,
        totalPrice,
        status: 'Ödeme Bekleniyor',
      });

      console.log('Order created:', orderId);
      setPaymentStep('redirecting');

      const { name, surname } = parseUserName(userData.name);

      const paymentRequest: CreatePaymentRequest = {
        orderId,
        orderAmount: totalPrice,
        currency: 0,
        productName: items.length === 1
          ? items[0].product.name
          : `Anticca Sipariş (${items.length} ürün)`,
        buyer: {
          id: currentUser.uid,
          name,
          surname,
          email: userData.email,
          phone: formatPhoneNumber(userData.phone || '5551234567'),
          accountAge: 0,
        },
        address: {
          address: userData.address || 'Adres belirtilmemiş',
          city: 'İstanbul',
          country: 'Turkey',
          postcode: '34000',
        },
      };

      clearCart();
      await initiateShopierPayment(paymentRequest);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : TR.common.error);
      setPaymentStep('idle');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linen-100 flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <ShoppingBag className="h-20 w-20 text-espresso-300 mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-bold text-espresso-800 mb-2">
            {TR.cart.empty}
          </h1>
          <p className="text-espresso-600 mb-6">
            Antika koleksiyonumuzu keşfetmeye başlayın.
          </p>
          <Link to="/products">
            <Button size="lg">
              {TR.cart.continueShopping}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50">
      <SEO title="Sepetim" description="Alışveriş sepetiniz" noindex />
      {/* Header - Minimal & Elegant */}
      <div className="bg-linen-100/50 border-b border-linen-200 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-gold-600 text-xs sm:text-sm uppercase tracking-[0.25em] mb-4 block animate-fade-in">Alışveriş Sepetim</span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-olive-900 mb-2">{TR.cart.title}</h1>
          <p className="text-espresso-500 font-light text-lg">Seçkin antika koleksiyonunuz.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">
              {/* Table Header (Desktop) */}
              <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-4 bg-linen-50 border-b border-linen-200 text-xs uppercase tracking-widest font-semibold text-espresso-400">
                <div className="col-span-6">Ürün Detayı</div>
                <div className="col-span-2 text-center">{TR.cart.unitPrice}</div>
                <div className="col-span-2 text-center">{TR.cart.quantity}</div>
                <div className="col-span-2 text-right">{TR.cart.itemTotal}</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-linen-100">
                {items.map((item) => (
                  <div key={item.productId} className="p-4 md:p-6 group hover:bg-linen-50/50 transition-colors">
                    <div className="md:grid md:grid-cols-12 md:gap-6 md:items-center">
                      {/* Product Info */}
                      <div className="md:col-span-6 flex items-start gap-4 mb-4 md:mb-0">
                        <Link to={`/products/${item.productId}`} className="flex-shrink-0 relative overflow-hidden rounded-sm w-24 h-28 bg-linen-200 border border-linen-300">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-mist-400">
                              🏺
                            </div>
                          )}
                        </Link>
                        <div>
                          <Link
                            to={`/products/${item.productId}`}
                            className="font-serif font-medium text-lg text-olive-900 hover:text-gold-700 line-clamp-2 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs uppercase tracking-wider text-gold-600 mt-1.5 font-medium">
                            {item.product.category}
                          </p>
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="md:col-span-2 hidden md:block text-center text-espresso-600 font-light">
                        {formatPrice(item.product.price)}
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-center gap-4 mb-4 md:mb-0">
                        <span className="md:hidden text-sm text-espresso-500 line-clamp-1">{TR.cart.quantity}:</span>
                        <div className="flex items-center border border-linen-300 rounded-full overflow-hidden bg-white">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-linen-100 transition-colors text-espresso-600"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 py-1 font-medium text-olive-900 min-w-[1.5rem] text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 hover:bg-linen-100 transition-colors text-espresso-600 disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-6">
                        <span className="font-serif font-medium text-lg text-olive-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-mist-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                          title={TR.cart.remove}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link to="/products">
                <Button variant="ghost">
                  ← {TR.cart.continueShopping}
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-sm shadow-soft border border-linen-200 p-8 sticky top-24">
              <h2 className="font-serif text-2xl font-medium text-olive-900 mb-8 border-b border-linen-100 pb-4">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 text-espresso-600">
                <div className="flex justify-between font-light">
                  <span>{TR.cart.subtotal}</span>
                  <span className="font-medium text-olive-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-light text-sm">
                  <span>Kargo</span>
                  <span className="text-gold-600 font-medium">Alıcı Ödemeli</span>
                </div>
              </div>

              <div className="border-t border-linen-200 my-6 pt-6">
                <div className="flex justify-between text-xl font-serif font-medium text-olive-900">
                  <span>{TR.cart.total}</span>
                  <span className="text-gold-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {paymentStep !== 'idle' && (
                <div className="bg-gold-50 text-gold-800 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gold-600 border-t-transparent"></div>
                  {paymentStep === 'creating_order' && 'Sipariş oluşturuluyor...'}
                  {paymentStep === 'redirecting' && 'Ödeme sayfasına yönlendiriliyorsunuz...'}
                </div>
              )}

              <Button
                size="lg"
                className="w-full bg-olive-800 hover:bg-olive-900 text-white rounded-sm h-14 font-medium tracking-wide shadow-md hover:shadow-lg transition-all"
                onClick={handleShopierCheckout}
                loading={loading}
                disabled={loading}
              >
                <CreditCard className="h-5 w-5 mr-3" />
                {loading ? 'İşleniyor...' : 'ÖDEMEYİ TAMAMLA'}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-espresso-500">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>3D Secure</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-linen-200">
                <p className="text-xs text-espresso-500 text-center">
                  Ödeme işlemi güvenli Shopier altyapısı ile gerçekleştirilir.
                  Taksit seçenekleri ödeme sayfasında görüntülenir.
                </p>
              </div>

              {!currentUser && (
                <p className="text-sm text-espresso-500 mt-4 text-center">
                  Ödeme yapmak için{' '}
                  <Link to="/login?redirect=/cart" className="text-gold-700 hover:underline">
                    giriş yapmalısınız
                  </Link>
                  .
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-linen-200">
                <p className="text-xs text-espresso-400 text-center mb-2">Kabul Edilen Kartlar</p>
                <div className="flex justify-center gap-2">
                  <div className="bg-linen-100 px-2 py-1 rounded text-xs font-medium text-espresso-600">VISA</div>
                  <div className="bg-linen-100 px-2 py-1 rounded text-xs font-medium text-espresso-600">Mastercard</div>
                  <div className="bg-linen-100 px-2 py-1 rounded text-xs font-medium text-espresso-600">TROY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
