import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gem, History, HandMetal, Clock, Gavel, Shield, Globe, Award, ChevronDown } from 'lucide-react';
import { useProducts, useShops } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import CategoryShowcase from '../components/home/CategoryShowcase';
import Loading from '../components/ui/Loading';
import SEO from '../components/seo/SEO';

export default function HomePage() {
  const { products, loading: productsLoading } = useProducts({ sortBy: 'newest' }, 20);
  const { shops, loading: shopsLoading } = useShops();
  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  const parseDate = (d: any) => {
    if (!d) return 0;
    if (d.toDate) return d.toDate().getTime();
    return new Date(d).getTime();
  };
  const now = Date.now();
  const liveAuctions = products.filter(p => {
    if (p.saleType !== 'auction') return false;
    const s = parseDate(p.auctionStartTime), e = parseDate(p.auctionEndTime);
    return now >= s && now <= e;
  }).slice(0, 3);
  const featuredProducts = products.filter(p => p.saleType !== 'auction').slice(0, 8);
  const showcaseProduct = featuredProducts[0];

  /* ═════ PARALLAX ═════ */
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ═════ SCROLL REVEALS ═════ */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      }),
      { threshold: 0.04, rootMargin: '0px 0px -80px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right, .animate-on-scroll').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [productsLoading, shopsLoading]);

  /* ═════ HERO ENTRANCE ═════ */
  const [heroReady, setHeroReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <SEO title="Anticca — Antikanın Dijital Adresi" description="Zamansız antika eserleri keşfedin." canonical="/" />

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║              HERO — Full Immersive Experience             ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="relative min-h-screen flex items-end overflow-hidden pb-28 pt-32">

        {/* ── Layer 1: Ken Burns Background with deep parallax ── */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-antique.png"
            alt="" aria-hidden="true"
            className="w-full h-full object-cover ken-burns-drift"
          />
        </div>

        {/* ── Layer 2: Atmospheric gradients ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-400/95 via-obsidian-400/60 to-obsidian-400/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400 via-obsidian-400/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-400/70 via-transparent to-transparent" style={{ height: '30%' }} />

        {/* ── Layer 3: Content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">

          {/* Typography — staggered clip-path reveals */}
          <div className="max-w-3xl space-y-8">

            {/* Eyebrow */}
            <div className="overflow-hidden">
              <div className={`flex items-center gap-5 ${heroReady ? 'clip-up stagger-1' : 'clip-hidden'}`}>
                <div className="w-14 h-[1px] bg-agold-400 animate-line-expand" style={{ animationDelay: '0.6s' }} />
                <span className="font-display text-agold-400 text-[9px] tracking-extreme uppercase">
                  Koleksiyoner Seçkisi
                </span>
              </div>
            </div>

            {/* Headline — word by word clip reveals */}
            <div className="space-y-0">
              {[
                { text: 'Seçkin', color: 'text-parchment-50', italic: true },
                { text: 'Koleksiyonerler', color: 'text-agold-300', italic: true },
                { text: 'İçin Zamansız', color: 'text-parchment-100', italic: false },
                { text: 'Zarafet.', color: 'text-parchment-50', italic: true },
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <h1 className={`font-display text-fluid-3xl ${line.color} ${line.italic ? 'italic' : ''} ${heroReady ? `clip-up stagger-${i + 2}` : 'clip-hidden'}`}>
                    {line.text}
                  </h1>
                </div>
              ))}
            </div>

            {/* Subtitle */}
            <div className="overflow-hidden max-w-lg">
              <p className={`text-parchment-400 text-lg leading-[1.9] font-light ${heroReady ? 'clip-up stagger-6' : 'clip-hidden'}`}>
                Tarihin derinliklerinden gelen, eşsiz ve paha biçilemez antika eserleri keşfedin.
              </p>
            </div>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-8 items-center pt-2 ${heroReady ? 'animate-fade-up stagger-7' : 'opacity-0'}`}>
              <Link to="/products">
                <button className="btn-magnetic">
                  <span className="flex items-center gap-5">
                    Koleksiyonu İncele
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </Link>
              <Link to="/about" className="btn-ghost flex items-center gap-3">
                Hikayemizi Keşfedin
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
          <span className="text-parchment-700 text-[8px] tracking-extreme uppercase font-display">Aşağı Kaydır</span>
          <div className="w-[1px] h-14 bg-gradient-to-b from-agold-500/80 to-transparent animate-subtle-pulse" />
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║           STATISTICS BANNER — Glowing Counters            ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="relative bg-charcoal-100 py-20 lg:py-24">
        <div className="divider-shimmer" />
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 pt-14">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '500+', label: 'Asırlık Tarih', icon: <History className="w-5 h-5" /> },
              { value: '%100', label: 'Orijinallik Garantisi', icon: <Shield className="w-5 h-5" /> },
              { value: '30+', label: 'Küresel Kaynaklar', icon: <Globe className="w-5 h-5" /> },
            ].map((stat, idx) => (
              <div key={idx} className="reveal space-y-4" style={{ transitionDelay: `${idx * 250}ms` }}>
                <div className="text-agold-500/60 flex justify-center mb-1">{stat.icon}</div>
                <p className="font-display text-4xl sm:text-5xl lg:text-6xl text-agold-300 italic animate-glow-pulse" style={{ animationDelay: `${idx * 0.7}s` }}>
                  {stat.value}
                </p>
                <p className="text-parchment-600 text-[10px] sm:text-xs tracking-extreme uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 divider-gold" />
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║         ÖNE ÇIKAN ESER — Cinematic Single Piece           ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="relative bg-obsidian-400 py-28 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

          {/* Section Title */}
          <div className="text-center mb-24 lg:mb-32 reveal">
            <h2 className="heading-textured font-display text-fluid-2xl italic">
              Öne Çıkan Eser
            </h2>
          </div>

          {/* Showcase */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Image — curtain reveal + parallax */}
            <div className="lg:col-span-5 reveal-left" style={{ transitionDelay: '200ms' }}>
              <div
                className="relative group"
                style={{ transform: `translateY(${Math.max(0, (scrollY - 800) * 0.04)}px)` }}
              >
                <div className="aspect-[4/5] overflow-hidden shadow-dramatic">
                  <img
                    src={showcaseProduct?.images?.[0] || 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=900&q=80&auto=format&fit=crop'}
                    alt={showcaseProduct?.name || 'Özel eser'}
                    className="w-full h-full object-cover img-cinematic transition-transform duration-[4000ms] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                </div>
                {/* Gold frame */}
                <div className="absolute top-6 left-6 right-6 bottom-6 border border-agold-800/10 pointer-events-none transition-all duration-1000 group-hover:inset-4" />
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-6 lg:col-start-7 space-y-8 reveal-right" style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-agold-400" />
                <span className="font-display text-agold-500 text-[9px] tracking-extreme uppercase">Özel Koleksiyon</span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-parchment-50 italic leading-[1.05]">
                {showcaseProduct?.name || 'XIV. Louis Dönemi Komodin'}
              </h3>

              <div className="w-28 h-[2px] bg-gradient-to-r from-agold-400 to-transparent animate-line-expand" />

              <p className="text-parchment-400 text-[15px] sm:text-base leading-[2] font-light">
                {showcaseProduct?.description ||
                  'XVIII. yüzyıl Fransız saray mobilyası geleneğinin en zarif örneklerinden biri. El oyması ceviz kaplama, orijinal bronz kulplar ve mermer üst yüzeyi ile müze kalitesinde bir eser. Provans bölgesindeki bir şatodan gelen bu nadide parça, dönemin en usta mobilya ustalarının elinden çıkmıştır.'}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-agold-900/10">
                {[
                  { l: 'Dönem', v: 'XVIII. Yüzyıl' },
                  { l: 'Menşei', v: 'Fransa, Provans' },
                  { l: 'Malzeme', v: 'Ceviz & Bronz' },
                  { l: 'Durum', v: 'Mükemmel' },
                ].map((spec, i) => (
                  <div key={i} className="space-y-1.5">
                    <p className="text-parchment-700 text-[9px] tracking-extreme uppercase">{spec.l}</p>
                    <p className="text-parchment-200 font-serif text-[14px]">{spec.v}</p>
                  </div>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-10 pt-2">
                {showcaseProduct && (
                  <p className="font-display text-3xl text-agold-300 italic animate-glow-pulse">
                    ₺{showcaseProduct.price?.toLocaleString('tr-TR')}
                  </p>
                )}
                <Link to={showcaseProduct ? `/products/${showcaseProduct.id}` : '/products'}>
                  <button className="btn-magnetic">
                    <span className="flex items-center gap-5">
                      Eser Detayları
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Categories ═══ */}
      <CategoryShowcase />

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║                   AKTİF MÜZAYEDELER                       ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="py-28 lg:py-36 bg-charcoal-100 relative">
        <div className="divider-gold" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8 reveal">
            <div className="space-y-5">
              <span className="font-display text-agold-500 text-[9px] tracking-extreme uppercase">Canlı Etkinlikler</span>
              <h2 className="heading-textured font-display text-4xl sm:text-5xl lg:text-6xl italic">
                Aktif Müzayedeler
              </h2>
            </div>
            <Link to="/auctions" className="group flex items-center gap-5">
              <span className="text-[13px] tracking-elegant text-agold-500 group-hover:text-agold-300 transition-colors duration-600">
                Tüm Müzayedeleri Gör
              </span>
              <ArrowRight className="w-4 h-4 text-agold-500 group-hover:translate-x-3 transition-transform duration-700" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {liveAuctions.map((auction, idx) => (
              <Link key={auction.id} to={`/products/${auction.id}`} className="group reveal" style={{ transitionDelay: `${idx * 200}ms` }}>
                <div className="card-premium overflow-hidden hover-glow">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={auction.images[0]} alt={auction.name} className="w-full h-full object-cover img-cinematic transition-transform duration-[3000ms] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400/95 via-obsidian-400/30 to-transparent" />
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1.5 bg-burgundy-600/90 text-parchment-100 text-[8px] font-display uppercase tracking-extreme animate-subtle-pulse">
                        Canlı
                      </span>
                    </div>
                  </div>
                  <div className="p-7 lg:p-8 space-y-5">
                    <div className="space-y-2">
                      <p className="font-display text-agold-600 text-[8px] uppercase tracking-extreme">{shopMap.get(auction.shopId)}</p>
                      <h3 className="font-serif text-lg text-parchment-100 group-hover:text-agold-300 transition-colors duration-700 leading-tight">{auction.name}</h3>
                    </div>
                    <div className="flex justify-between items-end pb-5 border-b border-agold-900/10">
                      <p className="text-parchment-700 text-[9px] tracking-extreme uppercase">{TR.auction.currentBid}</p>
                      <p className="text-2xl font-display text-agold-300 italic">₺{(auction.currentHighestBid || auction.startingBid || 0).toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="flex items-center gap-2 text-parchment-600 text-xs">
                      <Clock className="w-3 h-3 text-burgundy-400" />
                      <span className="tracking-elegant text-[11px]">{TR.auction.live}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {liveAuctions.length === 0 && (
              <div className="col-span-full py-24 text-center border border-dashed border-agold-900/10">
                <Gavel className="w-10 h-10 text-agold-800 mx-auto mb-6" />
                <p className="text-parchment-600 text-[13px] tracking-elegant">Şu an aktif bir müzayede bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║            SEÇKİN KOLEKSİYONUMUZ — Product Grid           ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="bg-obsidian-400 pt-32 lg:pt-44 pb-32 lg:pb-44 relative">

        {/* Textured heading */}
        <div className="text-center mb-24 lg:mb-32 px-6 reveal-scale">
          <h2 className="heading-textured font-display text-fluid-2xl italic mb-7">
            Seçkin Koleksiyonumuz
          </h2>
          <p className="text-parchment-600 text-[13px] tracking-elegant max-w-lg mx-auto leading-[1.9]">
            Zamana meydan okumuş, İstanbul'un en seçkin koleksiyonlarından
            titizlikle seçilmiş zamansız eserler.
          </p>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {productsLoading ? (
            <Loading />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-28 border border-dashed border-agold-900/10">
              <p className="text-parchment-600 italic font-serif text-xl">{TR.products.noProducts}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product, idx) => {
                // Deep parallax: alternating speeds create 3D depth
                const speed = idx % 3 === 0 ? 0.03 : idx % 3 === 1 ? 0.018 : 0.04;
                const parallaxOffset = Math.max(0, (scrollY - 2800) * speed);
                return (
                  <div
                    key={product.id}
                    className={`reveal ${idx % 2 === 1 ? 'lg:pt-16' : ''}`}
                    style={{ transitionDelay: `${idx * 120}ms`, transform: `translateY(${parallaxOffset}px)` }}
                  >
                    <ProductCard product={product} shopName={shopMap.get(product.shopId)} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-24 lg:mt-32 reveal">
          <Link to="/products">
            <button className="btn-magnetic">
              <span className="flex items-center gap-5">
                Tüm Koleksiyonu İncele
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </Link>
        </div>
      </section>

      {/* ╔═══════════════════════════════════════════════════════════╗
          ║                    GÜVEN — Trust Pillars                   ║
          ╚═══════════════════════════════════════════════════════════╝ */}
      <section className="bg-charcoal-100 py-28 lg:py-36 relative">
        <div className="divider-gold" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-14">
            {[
              { icon: <Gem className="w-7 h-7" />, title: 'Ekspertiz Garantisi', desc: 'Her ürün uzmanlar tarafından incelenir ve orijinalliği onaylanır.' },
              { icon: <History className="w-7 h-7" />, title: 'Köklü Miras', desc: 'Sadece hikayesi olan, gerçek antika ve vintage parçalar.' },
              { icon: <HandMetal className="w-7 h-7" />, title: 'Güvenli Teslimat', desc: 'Sanat eserlerine özel sigortalı ve korumalı kargo.' },
            ].map((item, idx) => (
              <div key={idx} className="card-premium p-10 lg:p-14 text-center space-y-6 reveal hover-border-sweep" style={{ transitionDelay: `${idx * 200}ms` }}>
                <div className="text-agold-500/70 mx-auto flex items-center justify-center">{item.icon}</div>
                <h3 className="font-display text-[15px] text-parchment-100 tracking-elegant italic">{item.title}</h3>
                <p className="text-[13px] text-parchment-500 max-w-[260px] mx-auto leading-[1.8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
