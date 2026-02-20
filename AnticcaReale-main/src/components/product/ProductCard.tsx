import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { TR } from '../../constants/tr';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  shopName?: string;
}

export default function ProductCard({ product, shopName }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0 && !added) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-sm shadow-sm hover-lift flex flex-col h-full relative"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-linen-200">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mist-400 bg-linen-100">
            <span className="text-4xl opacity-20">🏺</span>
          </div>
        )}

        {/* Soft Overlay on Hover */}
        <div className="absolute inset-0 bg-olive-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badges - Minimal */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.saleType === 'auction' && (
            <span className="bg-gold-500 text-espresso-950 text-[10px] uppercase tracking-widest px-2 py-1 font-bold border border-gold-400">
              {TR.admin.auction}
            </span>
          )}
        </div>

        {/* Quick Add Button - Floating (Only for Fixed Price) */}
        {product.stock > 0 && product.saleType !== 'auction' && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                       bg-white text-olive-900 hover:bg-gold-500 hover:text-white
                       w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300
                       z-10"
            aria-label="Sepete ekle"
          >
            {added ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Content - Clean & Serif */}
      <div className="p-4 flex-1 flex flex-col text-center">
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-[0.15em] text-gold-600 font-medium">
            {product.category}
          </span>
        </div>

        <h3 className="font-serif text-lg text-olive-900 group-hover:text-gold-700 transition-colors leading-tight mb-2">
          {product.name}
        </h3>

        {shopName && (
          <p className="text-xs text-mist-500 font-light mb-auto">
            {shopName}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-linen-200 flex flex-col gap-1">
          {product.saleType === 'auction' ? (
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-mist-400">{TR.auction.currentBid}</span>
                <span className="font-serif text-lg font-medium text-gold-700">
                  {formatPrice(product.currentHighestBid || product.startingBid || 0)}
                </span>
              </div>
              {product.buyNowPrice && (
                <div className="flex flex-col mt-1 pt-1 border-t border-linen-100">
                  <span className="text-[10px] uppercase tracking-wider text-mist-400">Hemen Al</span>
                  <span className="font-serif text-sm font-medium text-olive-800">
                    {formatPrice(product.buyNowPrice)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="font-serif text-lg font-medium text-olive-800">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
