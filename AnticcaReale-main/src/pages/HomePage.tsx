import { Link } from 'react-router-dom';
import { ArrowRight, Store, Package, Truck, Gem, History, HandMetal, Clock, Gavel } from 'lucide-react';
import { useProducts, useShops } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import ShopCard from '../components/shop/ShopCard';
import EraTimeline from '../components/home/EraTimeline';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

export default function HomePage() {
  const { products, loading: productsLoading } = useProducts({ sortBy: 'newest' }, 20); // Fetch more to find auctions
  const { shops, loading: shopsLoading } = useShops();

  const featuredShops = shops.slice(0, 4);

  // Map shopId to shopName for products
  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  const parseDate = (d: any) => {
    if (!d) return 0;
    if (d.toDate) return d.toDate().getTime();
    return new Date(d).getTime();
  };

  const now = new Date().getTime();
  const liveAuctions = products.filter(p => {
    if (p.saleType !== 'auction') return false;
    const start = parseDate(p.auctionStartTime);
    const end = parseDate(p.auctionEndTime);
    return now >= start && now <= end;
  }).slice(0, 3);

  const featuredProducts = products.filter(p => p.saleType !== 'auction').slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col gap-16 sm:gap-24 mb-16">
      {/* Hero Section - "Exhibition Entrance" Style */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-linen-100">
        {/* Foundation Image from Ref 1 Inspiration */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop')` // Warm, academic books and light
          }}
        />
        {/* Soft, light overlay for quiet luxury feel */}
        <div className="absolute inset-0 bg-linen-50/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-linen-50/30 to-linen-100" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-fade-in">
            <span className="inline-block text-gold-400 tracking-[0.4em] text-xs sm:text-sm uppercase font-semibold">
              Est. 2026 • İstanbul
            </span>

            <div className="space-y-2">
              <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium leading-none tracking-tight text-gold-500">
                {TR.siteName}
              </h1>
              <div className="w-24 h-[1px] bg-gold-400 mx-auto" />
            </div>

            <p className="max-w-2xl mx-auto text-xl sm:text-2xl md:text-3xl text-espresso-800/90 font-serif italic font-light leading-relaxed">
              {TR.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link to="/products">
                <Button size="lg" className="bg-olive-900 text-linen-50 hover:bg-olive-800 min-w-[220px] rounded-none shadow-none transform transition-all hover:-translate-y-1">
                  {TR.nav.products}
                </Button>
              </Link>
              <Link to="/shops">
                <Button size="lg" variant="outline" className="border-gold-500 text-gold-700 hover:bg-gold-50 min-w-[220px] rounded-none transform transition-all hover:-translate-y-1">
                  {TR.nav.shops}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section - The Story (Ref 2 Inspiration) */}
      <section className="relative overflow-hidden py-12 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative group overflow-hidden shadow-elegant">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2074&auto=format&fit=crop"
                  alt="Antique collection storytelling"
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-4 border border-white/30 pointer-events-none" />
            </div>

            <div className="space-y-10 lg:pl-12">
              <div className="space-y-4">
                <span className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase block">
                  Yaşanmışlıklar Müzesi
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-olive-900 leading-tight">
                  Her Parçanın Bir <br />
                  <span className="italic text-gold-700">Hikayesi</span> Var
                </h2>
              </div>

              <div className="w-16 h-[2px] bg-gold-400" />

              <div className="space-y-6">
                <p className="text-espresso-800 text-lg sm:text-xl leading-relaxed font-light">
                  Anticca, sadece bir pazar yeri değil; geçmişin zarafetini günümüzün yaşam alanlarına taşıyan bir köprüdür.
                  İstanbul'un en köklü antikacılarından özenle seçilmiş, yaşanmışlığı ve ruhu olan parçalar burada buluşuyor.
                </p>
                <p className="text-espresso-600 text-base sm:text-lg leading-relaxed italic border-l-2 border-gold-300 pl-6">
                  "Bir objeye dokunmak, onun taşıdığı onca anıya ve zamana ortak olmaktır."
                </p>
              </div>

              <div className="flex gap-12 pt-6">
                <div className="space-y-1">
                  <span className="font-serif text-4xl text-espresso-900 block">50+</span>
                  <span className="text-xs text-gold-700 uppercase tracking-widest font-bold">Dükkan</span>
                </div>
                <div className="w-[1px] h-12 bg-cream-300" />
                <div className="space-y-1">
                  <span className="font-serif text-4xl text-espresso-900 block">1K+</span>
                  <span className="text-xs text-gold-700 uppercase tracking-widest font-bold">Eser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Era Timeline */}
      <EraTimeline />

      {/* Live Auctions Section */}
      <section className="py-24 bg-espresso-950 text-linen-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-gold-400 text-sm font-medium tracking-[0.3em] uppercase block">Canlı Etkinlikler</span>
              <h2 className="font-serif text-4xl sm:text-5xl text-gold-500">Aktif Müzayedeler</h2>
            </div>
            <Link to="/auctions" className="group flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
              <span className="text-lg font-medium">Tüm Müzayedeleri Gör</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveAuctions.map(auction => (
              <Link
                key={auction.id}
                to={`/products/${auction.id}`}
                className="group bg-espresso-900/50 border border-espresso-800 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={auction.images[0]}
                    alt={auction.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-full animate-pulse">
                      Canlı
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-gold-400 text-xs uppercase tracking-widest">{shopMap.get(auction.shopId)}</p>
                    <h3 className="font-serif text-xl text-linen-100 group-hover:text-gold-400 transition-colors uppercase tracking-tight">
                      {auction.name}
                    </h3>
                  </div>
                  <div className="flex justify-between items-end pb-2 border-b border-espresso-800">
                    <p className="text-espresso-400 text-sm">{TR.auction.currentBid}</p>
                    <p className="text-2xl font-serif text-gold-400">₺{(auction.currentHighestBid || auction.startingBid || 0).toLocaleString('tr-TR')}</p>
                  </div>
                  <div className="flex items-center gap-2 text-espresso-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{TR.auction.live}</span>
                  </div>
                </div>
              </Link>
            ))}
            {liveAuctions.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-espresso-800 rounded-xl">
                <Gavel className="w-12 h-12 text-espresso-700 mx-auto mb-4" />
                <p className="text-espresso-400 text-lg">Şu an aktif bir müzayede bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products - Gallery Style */}
      <section className="bg-linen-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold-600 text-sm font-medium tracking-widest uppercase mb-3 block">Koleksiyon</span>
            <h2 className="font-serif text-4xl text-olive-900 mb-6">{TR.products.featured}</h2>
            <p className="text-espresso-600">Her biri tek ve özel. Zamana meydan okuyan tasarımlar.</p>
          </div>

          {productsLoading ? (
            <Loading />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-xl">
              <p className="text-espresso-500 italic font-serif text-xl">{TR.products.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <Link to={`/products/${product.id}`} className="block">
                    <div className="aspect-[3/4] overflow-hidden bg-linen-200 mb-4 relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gold-700 tracking-wider uppercase">{shopMap.get(product.shopId)}</p>
                      <h3 className="font-serif text-lg text-olive-900 leading-tight group-hover:text-gold-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-espresso-500 font-medium">₺{product.price.toLocaleString('tr-TR')}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/products">
              <Button variant="outline" className="border-olive-900 text-olive-900 hover:bg-olive-900 hover:text-white px-8">
                Tüm Koleksiyonu İncele
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Values - Minimal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-linen-200 border-y border-linen-200">
          <div className="p-8 text-center space-y-3">
            <Gem className="w-8 h-8 text-burgundy-700 mx-auto opacity-80" />
            <h3 className="font-serif text-lg text-olive-900">Ekspertiz Garantisi</h3>
            <p className="text-sm text-espresso-500 max-w-xs mx-auto">Her ürün uzmanlar tarafından incelenir ve orijinalliği onaylanır.</p>
          </div>
          <div className="p-8 text-center space-y-3">
            <History className="w-8 h-8 text-burgundy-700 mx-auto opacity-80" />
            <h3 className="font-serif text-lg text-olive-900">Köklü Miras</h3>
            <p className="text-sm text-espresso-500 max-w-xs mx-auto">Sadece hikayesi olan, gerçek antika ve vintage parçalar.</p>
          </div>
          <div className="p-8 text-center space-y-3">
            <HandMetal className="w-8 h-8 text-burgundy-700 mx-auto opacity-80" />
            <h3 className="font-serif text-lg text-olive-900">Güvenli Teslimat</h3>
            <p className="text-sm text-espresso-500 max-w-xs mx-auto">Sanat eserlerine özel sigortalı ve korumalı kargo.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
