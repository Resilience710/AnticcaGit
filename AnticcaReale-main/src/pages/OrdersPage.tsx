import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Package,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ShoppingBag,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useFirestore';
import { syncOrderStatusFromShopier } from '../services/shopierService';
import { TR } from '../constants/tr';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';
import SEO from '../components/seo/SEO';
import type { Order, OrderStatus } from '../types';

// Order status progression for timeline
const ORDER_STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: 'Ödeme Bekleniyor', label: 'Ödeme Bekleniyor', icon: Clock },
  { status: 'Ödendi', label: 'Ödendi', icon: CheckCircle },
  { status: 'Hazırlanıyor', label: 'Hazırlanıyor', icon: Package },
  { status: 'Kargolandı', label: 'Kargolandı', icon: Truck },
  { status: 'Teslim Edildi', label: 'Teslim Edildi', icon: CheckCircle },
];

const statusColors: Record<string, string> = {
  'Ödeme Bekleniyor': 'bg-amber-50 text-amber-800 border-amber-200',
  'Ödendi': 'bg-blue-50 text-blue-800 border-blue-200',
  'Hazırlanıyor': 'bg-purple-50 text-purple-800 border-purple-200',
  'Kargolandı': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Teslim Edildi': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'İptal Edildi': 'bg-red-50 text-red-800 border-red-200',
};

const statusDotColors: Record<string, string> = {
  'Ödeme Bekleniyor': 'bg-amber-500',
  'Ödendi': 'bg-blue-500',
  'Hazırlanıyor': 'bg-purple-500',
  'Kargolandı': 'bg-indigo-500',
  'Teslim Edildi': 'bg-emerald-500',
  'İptal Edildi': 'bg-red-500',
};

type FilterTab = 'all' | 'active' | 'completed';

function getStepIndex(status: OrderStatus): number {
  const idx = ORDER_STEPS.findIndex(s => s.status === status);
  return idx >= 0 ? idx : -1;
}

function isActiveOrder(order: Order): boolean {
  return ['Ödeme Bekleniyor', 'Ödendi', 'Hazırlanıyor', 'Kargolandı'].includes(order.status);
}

function isCompletedOrder(order: Order): boolean {
  return ['Teslim Edildi', 'İptal Edildi'].includes(order.status);
}

// Timeline component for order status
function OrderTimeline({ order }: { order: Order }) {
  if (order.status === 'İptal Edildi') {
    return (
      <div className="flex items-center gap-3 py-4 px-4 bg-red-50/50 rounded-lg">
        <div className="bg-red-100 rounded-full p-2">
          <XCircle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <p className="font-medium text-red-800">Sipariş İptal Edildi</p>
          <p className="text-sm text-red-600">Bu sipariş iptal edilmiştir.</p>
        </div>
      </div>
    );
  }

  const currentIndex = getStepIndex(order.status);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-linen-200 mx-8" />
        {/* Progress Line Active */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-olive-600 mx-8 transition-all duration-700"
          style={{
            width: `${currentIndex >= 0 ? (currentIndex / (ORDER_STEPS.length - 1)) * 100 : 0}%`,
            maxWidth: 'calc(100% - 4rem)',
          }}
        />

        {ORDER_STEPS.map((step, index) => {
          const isCompleted = currentIndex >= index;
          const isCurrent = currentIndex === index;
          const StepIcon = step.icon;

          return (
            <div
              key={step.status}
              className="relative flex flex-col items-center z-10"
              style={{ flex: 1 }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                    ? isCurrent
                      ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/30 ring-4 ring-olive-100'
                      : 'bg-olive-600 text-white'
                    : 'bg-linen-100 text-espresso-300 border-2 border-linen-200'
                  }`}
              >
                <StepIcon className="h-4 w-4" />
              </div>
              <span
                className={`mt-2 text-xs text-center font-medium transition-colors hidden sm:block ${isCompleted ? 'text-olive-800' : 'text-espresso-300'
                  }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const { orders, loading } = useOrders(currentUser?.uid);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setActiveTab('active');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const d = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(d);
  };

  const handleSyncOrder = async (orderId: string) => {
    setSyncingOrderId(orderId);
    try {
      await syncOrderStatusFromShopier(orderId);
      // Refresh will happen when Firestore updates
      window.location.reload();
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncingOrderId(null);
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') return isActiveOrder(order);
    if (activeTab === 'completed') return isCompletedOrder(order);
    return true;
  });

  const activeCount = orders.filter(isActiveOrder).length;
  const completedCount = orders.filter(isCompletedOrder).length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-linen-50 flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <Package className="h-20 w-20 text-espresso-300 mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-bold text-espresso-800 mb-2">
            {TR.errors.unauthorized}
          </h1>
          <p className="text-espresso-600 mb-6">
            Siparişlerinizi görüntülemek için giriş yapın.
          </p>
          <Link to="/login?redirect=/orders">
            <Button size="lg">{TR.auth.login}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen-50">
      <SEO title="Siparişlerim" description="Sipariş geçmişiniz ve aktif siparişleriniz" noindex />

      {/* Header */}
      <div className="bg-linen-100/50 border-b border-linen-200 py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-gold-600 text-xs sm:text-sm uppercase tracking-[0.25em] mb-4 block animate-fade-in">
            Hesabım
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-olive-900 mb-2">
            {TR.orders.title}
          </h1>
          <p className="text-espresso-500 font-light text-lg">
            Tüm siparişlerinizi buradan takip edebilirsiniz.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-fade-in">
            <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-800">Ödemeniz başarıyla alındı!</p>
              <p className="text-sm text-emerald-700">
                Siparişiniz hazırlanmak üzere satıcıya iletildi.
              </p>
            </div>
          </div>
        )}

        {/* Tab Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-linen-200 p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'all'
                ? 'bg-olive-800 text-white shadow-md'
                : 'text-espresso-600 hover:bg-linen-50'
              }`}
          >
            <Filter className="h-4 w-4" />
            Tüm Siparişler
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-linen-100 text-espresso-500'
              }`}>
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'active'
                ? 'bg-olive-800 text-white shadow-md'
                : 'text-espresso-600 hover:bg-linen-50'
              }`}
          >
            <Clock className="h-4 w-4" />
            Aktif
            {activeCount > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'active'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-amber-700'
                }`}>
                {activeCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'completed'
                ? 'bg-olive-800 text-white shadow-md'
                : 'text-espresso-600 hover:bg-linen-50'
              }`}
          >
            <CheckCircle className="h-4 w-4" />
            Tamamlanan
            {completedCount > 0 && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'completed'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-100 text-emerald-700'
                }`}>
                {completedCount}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-linen-200 shadow-sm">
            <ShoppingBag className="h-16 w-16 text-espresso-300 mx-auto mb-4" />
            <p className="text-espresso-700 text-lg font-medium mb-1">
              {activeTab === 'all'
                ? TR.orders.empty
                : activeTab === 'active'
                  ? 'Aktif siparişiniz yok.'
                  : 'Tamamlanan siparişiniz yok.'}
            </p>
            <p className="text-espresso-400 text-sm mb-6">
              {activeTab === 'all'
                ? 'Antika koleksiyonumuzu keşfetmeye başlayın.'
                : activeTab === 'active'
                  ? 'Yeni bir sipariş oluşturun.'
                  : 'Aktif siparişleriniz tamamlandıkça burada görünecek.'}
            </p>
            <Link to="/products">
              <Button>{TR.cart.continueShopping}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-linen-200 overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Order Header */}
                <div
                  className="p-4 md:p-6 cursor-pointer hover:bg-linen-50/50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Status Dot */}
                      <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${statusDotColors[order.status] || 'bg-gray-400'}`} />
                      <div>
                        <p className="text-sm text-espresso-500">
                          {TR.orders.orderNumber}:{' '}
                          <span className="font-mono font-medium text-espresso-800">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </p>
                        <p className="text-xs text-espresso-400 mt-0.5">
                          {formatDate(order.createdAt)}
                        </p>
                        {/* Item Preview */}
                        <p className="text-xs text-espresso-400 mt-1">
                          {order.items.length} ürün
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-serif font-semibold text-lg text-olive-900">
                        {formatPrice(order.totalPrice)}
                      </span>
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5 text-espresso-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-espresso-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {expandedOrder === order.id && (
                  <div className="border-t border-linen-200">
                    {/* Status Timeline */}
                    <div className="px-4 md:px-6 pt-4 pb-2">
                      <h4 className="text-xs uppercase tracking-widest font-semibold text-espresso-400 mb-3">
                        Sipariş Durumu
                      </h4>
                      <OrderTimeline order={order} />
                    </div>

                    {/* Items */}
                    <div className="px-4 md:px-6 py-4 bg-linen-50/50">
                      <h4 className="text-xs uppercase tracking-widest font-semibold text-espresso-400 mb-3">
                        Sipariş İçeriği
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 bg-white p-3 rounded-lg border border-linen-100"
                          >
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-linen-100 flex-shrink-0">
                              {item.productImage ? (
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">
                                  🏺
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/products/${item.productId}`}
                                className="font-medium text-espresso-800 hover:text-gold-700 truncate block text-sm"
                              >
                                {item.productName}
                              </Link>
                              <p className="text-xs text-espresso-500 mt-0.5">
                                {item.quantity} adet × {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="font-medium text-espresso-800 text-sm">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-4 pt-4 border-t border-linen-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-espresso-700">{TR.orders.total}</span>
                          <span className="font-serif font-bold text-lg text-gold-700">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>

                        {/* Payment Reference */}
                        {order.shopierTransactionId && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-espresso-400">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            <span>
                              Ödeme Ref: <code className="bg-linen-100 px-1.5 py-0.5 rounded">{order.shopierTransactionId}</code>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t border-linen-200 flex flex-wrap gap-2">
                        {order.status === 'Ödeme Bekleniyor' && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleSyncOrder(order.id);
                              }}
                              loading={syncingOrderId === order.id}
                              disabled={syncingOrderId === order.id}
                            >
                              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                              Durumu Güncelle
                            </Button>
                            <Link to="/cart">
                              <Button size="sm" variant="outline">
                                Ödemeyi Tamamla
                              </Button>
                            </Link>
                          </>
                        )}
                        <Link to="/contact">
                          <Button size="sm" variant="ghost">
                            Yardım Al
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Help */}
        {orders.length > 0 && (
          <div className="mt-8 text-center text-sm text-espresso-400">
            <p>
              Siparişinizle ilgili sorularınız için{' '}
              <Link to="/contact" className="text-gold-700 hover:underline">
                iletişime geçin
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
