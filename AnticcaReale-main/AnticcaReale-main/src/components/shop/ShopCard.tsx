import { Link } from 'react-router-dom';
import { MapPin, Phone, ArrowRight } from 'lucide-react';
import { Shop } from '../../types';
import { TR } from '../../constants/tr';

interface ShopCardProps {
  shop: Shop;
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      to={`/shops/${shop.id}`}
      className="group bg-white rounded-sm shadow-sm hover:shadow-soft transition-all duration-500 flex flex-col h-full border border-linen-200 hover:border-linen-300"
    >
      {/* Logo / Header - Fixed aspect ratio */}
      {/* Logo / Header */}
      <div className="relative aspect-[16/10] bg-linen-200 overflow-hidden group-hover:opacity-90 transition-opacity">
        {shop.logoUrl ? (
          <img
            src={shop.logoUrl}
            alt={shop.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linen-100">
            <span className="text-5xl opacity-20">🏛️</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Name over Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-serif text-xl font-medium text-white tracking-wide drop-shadow-md group-hover:translate-x-1 transition-transform duration-300">
            {shop.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        <p className="text-espresso-600 text-sm line-clamp-2 mb-4 leading-relaxed font-light">
          {shop.description}
        </p>

        <div className="space-y-3 text-sm text-espresso-500 mt-auto border-t border-linen-100 pt-4">
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gold-600" />
            <span className="line-clamp-1 font-medium text-olive-900">
              {shop.district}, {shop.city}
            </span>
          </div>
          {shop.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 flex-shrink-0 text-gold-600" />
              <span className="font-light">{shop.phone}</span>
            </div>
          )}
        </div>

        <div className="mt-5 pt-0">
          <span className="inline-flex items-center text-xs uppercase tracking-widest font-semibold text-gold-700 group-hover:text-gold-600 transition-colors">
            {TR.shops.viewProducts}
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
