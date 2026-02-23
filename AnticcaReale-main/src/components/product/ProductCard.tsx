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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const priceDisplay = product.saleType === 'auction'
    ? `₺${(product.startingBid || 0).toLocaleString('tr-TR')}`
    : `₺${(product.price || 0).toLocaleString('tr-TR')}`;
  const inStock = product.stock !== undefined ? product.stock > 0 : true;

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="card-premium overflow-hidden hover-glow">
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden relative">
          <img
            src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover img-cinematic transition-transform duration-[3000ms] group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400/85 via-obsidian-400/10 to-transparent" />

          {product.saleType === 'auction' && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-burgundy-600/90 text-parchment-100 text-[8px] font-display uppercase tracking-extreme">
                Müzayede
              </span>
            </div>
          )}

          {product.saleType !== 'auction' && inStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center glass-dark text-agold-400 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-600 hover:bg-agold-400 hover:text-obsidian-400"
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
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
