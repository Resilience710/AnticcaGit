import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Store, ChevronLeft, ChevronRight, Check, Quote } from 'lucide-react';
import { useDocument, useProducts, useAuctionProduct } from '../hooks/useFirestore';
import { Product, Shop } from '../types';
import { useCart } from '../contexts/CartContext';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';
import Product3DViewer, { Product3DToggle } from '../components/product/Product3DViewer';
import AuctionSection from '../components/product/AuctionSection';
import ARViewer from '../components/product/ARViewer';
import SEO from '../components/seo/SEO';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);

  // Use real-time hook for product to support live auctions
  const { product, loading: productLoading } = useAuctionProduct(id);
  const { data: shop } = useDocument<Shop>('shops', product?.shopId);
  const { products: relatedProducts } = useProducts(
    product ? { shopId: product.shopId, sortBy: 'newest' } : { sortBy: 'newest' },
    4
  );
  const { addToCart } = useCart();

  // Parallax scroll effect
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const rect = parallaxRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
          setParallaxOffset(progress * 60 - 30); // -30 to 30 range
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, 1);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handlePrevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  if (productLoading) {
    return <Loading fullScreen />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-800">{TR.errors.notFound}</h1>
          <Link to="/products" className="mt-4 inline-block">
            <Button>{TR.cart.continueShopping}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);
  const hasMetadata = product.era || product.estimatedYear || product.material || product.dimensions || product.condition;
  const parallaxImage = product.images && product.images.length > 1 ? product.images[1] : null;

  return (
    <div className="min-h-screen bg-cream-50">
      <SEO
        title={`${product.name} - ${product.category} Antika`}
        description={product.description?.substring(0, 155) || `${product.name} - Anticca'da antika ${product.category} koleksiyonu.`}
        canonical={`/products/${product.id}`}
        ogImage={product.images?.[0]}
        ogType="product"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "category": product.category,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "TRY",
              "availability": product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Anticca"
              }
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://anticca.com.tr/" },
              { "@type": "ListItem", "position": 2, "name": "Ürünler", "item": "https://anticca.com.tr/products" },
              { "@type": "ListItem", "position": 3, "name": product.name }
            ]
          }
        ]}
      />
      {/* 3D Viewer Modal - Only renders if model3dUrl exists and show3DViewer is true */}
      {product.model3dUrl && show3DViewer && (
        <Product3DViewer
          modelUrl={product.model3dUrl}
          productName={product.name}
          posterImage={product.images?.[0]}
          onClose={() => setShow3DViewer(false)}
          isModal
        />
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-navy-500 hover:text-navy-700">
              {TR.nav.home}
            </Link>
            <span className="text-navy-300">/</span>
            <Link to="/products" className="text-navy-500 hover:text-navy-700">
              {TR.nav.products}
            </Link>
            <span className="text-navy-300">/</span>
            <span className="text-navy-800 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-cream-200">
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <ChevronLeft className="h-6 w-6 text-navy-800" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <ChevronRight className="h-6 w-6 text-navy-800" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cream-400">
                  <span className="text-9xl">🏺</span>
                </div>
              )}

              {/* 3D Toggle Button - Only shown if model3dUrl exists */}
              {product.model3dUrl && (
                <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                  <Product3DToggle
                    onClick={() => setShow3DViewer(true)}
                  />
                </div>
              )}
            </div>

            {/* AR Viewer Button - Below image gallery */}
            {product.model3dUrl && (
              <div className="flex justify-center">
                <ARViewer
                  modelUrl={product.model3dUrl}
                  productName={product.name}
                  posterImage={product.images?.[0]}
                />
              </div>
            )}

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                      ? 'border-gold-500'
                      : 'border-cream-200 hover:border-gold-300'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gold-500 text-espresso-950 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                  {product.category}
                </span>
              </div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-navy-900">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-mist-500 mt-1">{product.category}</p>
              )}
            </div>

            {/* Price & Auction Section */}
            {product.saleType === 'auction' ? (
              <AuctionSection product={product} />
            ) : (
              <div className="space-y-6">
                <div className="text-3xl font-serif font-medium text-espresso-800">
                  {formatPrice(product.price)}
                </div>

                {/* Metadata Grid */}
                {hasMetadata && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-4 border-t border-b border-cream-200">
                    {product.era && (
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-mist-400 font-bold block mb-1">DÖNEM</span>
                        <span className="text-espresso-800 font-medium">{product.era}</span>
                      </div>
                    )}
                    {product.estimatedYear && (
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-mist-400 font-bold block mb-1">TAHMİNİ YIL</span>
                        <span className="text-espresso-800 font-medium">{product.estimatedYear}</span>
                      </div>
                    )}
                    {product.material && (
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-mist-400 font-bold block mb-1">MALZEME</span>
                        <span className="text-espresso-800 font-medium">{product.material}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-mist-400 font-bold block mb-1">ÖLÇÜLER</span>
                        <span className="text-espresso-800 font-medium">{product.dimensions}</span>
                      </div>
                    )}
                    {product.condition && (
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-mist-400 font-bold block mb-1">KONDİSYON</span>
                        <span className="text-espresso-800 font-medium">{product.condition}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.stock > 0 ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-green-700 font-medium uppercase tracking-widest text-xs">
                        STOKTA
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span className="text-red-700 font-medium uppercase tracking-widest text-xs">
                        STOKTA YOK
                      </span>
                    </>
                  )}
                </div>

                {/* Add to Cart - No quantity selector */}
                {product.stock > 0 && (
                  <div className="pt-4 border-t border-linen-100">
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={addedToCart}
                      className="w-full !h-14 bg-espresso-900 hover:bg-espresso-800 text-gold-500 font-serif text-lg tracking-widest uppercase transition-all"
                    >
                      {addedToCart ? (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          SEPETE EKLENDİ
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          {TR.products.addToCart}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="pt-6 border-t border-cream-200">
              <p className="text-espresso-700 leading-relaxed whitespace-pre-line text-base italic">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* === Full-width Editorial Sections Below the Product Grid === */}

        {/* Parallax Image Section */}
        {parallaxImage && (
          <div
            ref={parallaxRef}
            className="relative mt-16 -mx-4 sm:-mx-6 lg:-mx-8 h-[50vh] min-h-[400px] overflow-hidden"
          >
            <div
              className="absolute inset-0 w-full h-[120%]"
              style={{
                backgroundImage: `url('${parallaxImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s linear',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
          </div>
        )}

        {/* Story Section */}
        {product.story && (
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-gold-600 text-sm font-semibold tracking-[0.3em] uppercase block mb-3">DETAYLAR</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-espresso-900 italic">Hikâye</h2>
            </div>
            <div className="bg-white rounded-xl p-8 sm:p-12 border border-linen-200 shadow-sm">
              <p className="text-espresso-700 leading-loose text-lg whitespace-pre-line font-light">
                {product.story}
              </p>
            </div>
          </div>
        )}

        {/* Dealer Note Section */}
        {product.dealerNote && (
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-linen-100 rounded-xl p-8 sm:p-12 border border-linen-200 relative">
              <h3 className="font-serif text-xl sm:text-2xl text-espresso-900 font-bold mb-6">Antikacı Notu</h3>
              <div className="relative pl-6 border-l-2 border-gold-400">
                <Quote className="absolute -left-3 -top-1 w-6 h-6 text-gold-500 bg-linen-100" />
                <p className="text-espresso-700 leading-relaxed text-lg italic">
                  "{product.dealerNote}"
                </p>
              </div>
              {(product.dealerName || shop?.name) && (
                <div className="mt-6 flex items-center gap-2 text-espresso-500">
                  <span className="text-sm">—</span>
                  <span className="font-medium text-espresso-700">{product.dealerName || shop?.name}</span>
                  <Check className="w-4 h-4 text-olive-800" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <div className="mt-16 pt-12 border-t border-cream-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-navy-800">
                {TR.products.viewShopProducts}
              </h2>
              {shop && (
                <Link to={`/shops/${shop.id}`}>
                  <Button variant="ghost">
                    Tümünü Gör
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelated.map((p) => (
                <ProductCard key={p.id} product={p} shopName={shop?.name} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
