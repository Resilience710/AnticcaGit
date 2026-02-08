import { useShops } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import ShopCard from '../components/shop/ShopCard';
import Loading from '../components/ui/Loading';

export default function ShopsPage() {
  const { shops, loading } = useShops();

  return (
    <div className="min-h-screen bg-linen-50">
      {/* Header - Minimal & Elegant */}
      <div className="bg-linen-100/50 border-b border-linen-200 py-16 sm:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-gold-600 text-xs sm:text-sm uppercase tracking-[0.25em] mb-4 block animate-fade-in">Partnerlerimiz</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-olive-900 mb-6">{TR.shops.title}</h1>
          <p className="text-espresso-600 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            İstanbul'un tarihine tanıklık eden, güvenilir ve köklü antika dükkanları.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {loading ? (
          <Loading />
        ) : shops.length === 0 ? (
          <div className="text-center py-16 bg-linen-200 rounded-xl border border-mist-300">
            <p className="text-espresso-700 text-lg">{TR.shops.noShops}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
