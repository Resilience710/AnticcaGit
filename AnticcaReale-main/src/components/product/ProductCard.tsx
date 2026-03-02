import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useState, useCallback, useRef } from 'react';

interface ProductCardProps {
  product: Product;
  shopName?: string;
}

export default function ProductCard({ product, shopName }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasMultiple = images.length > 1;

  const priceDisplay = product.saleType === 'auction'
    ? `₺${(product.startingBid || 0).toLocaleString('tr-TR')}`
    : `₺${(product.price || 0).toLocaleString('tr-TR')}`;
  const inStock = product.stock !== undefined ? product.stock > 0 : true;

  // ──── Hover-Zone Slide Navigation ────

  const goToSlide = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, index));
    if (clamped !== activeSlide) {
      setActiveSlide(clamped);
    }
  }, [activeSlide, images.length]);

  const handleZoneEnter = useCallback((direction: 'prev' | 'next') => {
    // Small debounce to prevent flickering on fast mouse movement
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (direction === 'next') {
        goToSlide(activeSlide + 1);
      } else {
        goToSlide(activeSlide - 1);
      }
    }, 60);
  }, [activeSlide, goToSlide]);

  // Reset to first image when mouse leaves the card entirely
  const handleCardLeave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setActiveSlide(0);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link to={`/products/${product.slug || product.id}`} className="group block">
      <div className="card-premium overflow-hidden hover-glow" onMouseLeave={handleCardLeave}>
        {/* Image Gallery */}
        <div className="aspect-[3/4] overflow-hidden relative">
          {images.length > 0 ? (
            <div
              className="carousel-strip h-full"
              style={{
                width: `${images.length * 100}%`,
                transform: `translateX(-${activeSlide * (100 / images.length)}%)`,
              }}
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  className="img-cinematic"
                  style={{ width: `${100 / images.length}%` }}
                  width="364"
                  height="455"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-parchment-700">
              <span className="text-7xl">🏺</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400/85 via-obsidian-400/10 to-transparent pointer-events-none" />

          {/* ── Invisible Hover Trigger Zones ── */}
          {hasMultiple && (
            <>
              {/* Left 30% → previous image */}
              {activeSlide > 0 && (
                <div
                  className="carousel-zone carousel-zone-left"
                  onMouseEnter={() => handleZoneEnter('prev')}
                />
              )}
              {/* Right 30% → next image */}
              {activeSlide < images.length - 1 && (
                <div
                  className="carousel-zone carousel-zone-right"
                  onMouseEnter={() => handleZoneEnter('next')}
                />
              )}
            </>
          )}

          {/* Auction badge */}
          {product.saleType === 'auction' && (
            <div className="absolute top-3 left-3 z-[6]">
              <span className="px-2.5 py-1 bg-burgundy-600/90 text-parchment-100 text-[8px] font-display uppercase tracking-extreme">
                Müzayede
              </span>
            </div>
          )}

          {/* Cart button */}
          {product.saleType !== 'auction' && inStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 z-[6] w-10 h-10 flex items-center justify-center glass-dark text-agold-400 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-600 hover:bg-agold-400 hover:text-obsidian-400"
              aria-label="Sepete ekle"
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          )}

          {/* Progress Lines */}
          {hasMultiple && (
            <div className="carousel-lines">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`carousel-line ${i === activeSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 lg:p-6 space-y-3">
          {shopName && (
            <p className="font-display text-agold-600 text-[8px] uppercase tracking-extreme">{shopName}</p>
          )}
          <h3 className="font-serif text-[13px] text-parchment-200 leading-snug group-hover:text-agold-300 transition-colors duration-700 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex justify-between items-end pt-3 border-t border-agold-900/8">
            <p className="font-display text-lg text-agold-300 italic">{priceDisplay}</p>
            {!inStock && (
              <span className="text-[8px] text-parchment-700 tracking-extreme uppercase">Tükendi</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
