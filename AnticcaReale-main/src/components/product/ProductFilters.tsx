import { useState, useEffect, useRef } from 'react';
import { X, Search, RotateCcw } from 'lucide-react';
import { FilterState, CATEGORIES, Shop } from '../../types';
import { TR } from '../../constants/tr';
import Select from '../ui/Select';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  shops: Shop[];
  showMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  shops,
  showMobile,
  onCloseMobile,
}: ProductFiltersProps) {
  // Local state for the price slider
  const [localMin, setLocalMin] = useState<number>(filters.minPrice || 0);
  const [localMax, setLocalMax] = useState<number>(filters.maxPrice || 500000);
  const sliderRef = useRef<HTMLDivElement>(null);

  const MAX_PRICE = 500000;
  const STEP = 1000;

  useEffect(() => {
    setLocalMin(filters.minPrice || 0);
    setLocalMax(filters.maxPrice || MAX_PRICE);
  }, [filters.minPrice, filters.maxPrice]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const applyPriceFilter = () => {
    onFilterChange({
      ...filters,
      minPrice: localMin > 0 ? localMin : undefined,
      maxPrice: localMax < MAX_PRICE ? localMax : undefined,
    });
  };

  const resetFilters = () => {
    onFilterChange({ sortBy: 'newest' });
    setLocalMin(0);
    setLocalMax(MAX_PRICE);
  };

  const hasActiveFilters =
    filters.category ||
    filters.shopId ||
    filters.search ||
    filters.minPrice ||
    filters.maxPrice;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val);

  const shopOptions = [
    { value: '', label: TR.filters.allShops },
    ...shops.map((shop) => ({ value: shop.id, label: shop.name })),
  ];

  const sortOptions = [
    { value: 'newest', label: TR.filters.sortNewest },
    { value: 'price-asc', label: TR.filters.sortPriceAsc },
    { value: 'price-desc', label: TR.filters.sortPriceDesc },
  ];

  const filtersContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mist-400" />
          <input
            type="text"
            placeholder={TR.filters.search}
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-linen-300 bg-white focus:border-gold-500 focus:ring-2 focus:ring-gold-200 text-sm transition-all"
          />
        </div>
      </div>

      {/* Sort */}
      <Select
        label={TR.filters.sortBy}
        options={sortOptions}
        value={filters.sortBy}
        onChange={(e) => updateFilter('sortBy', e.target.value)}
      />

      {/* Shop */}
      <Select
        label={TR.filters.shop}
        options={shopOptions}
        value={filters.shopId || ''}
        onChange={(e) => updateFilter('shopId', e.target.value)}
      />

      {/* Price Range Slider */}
      <div>
        <label className="block text-sm font-semibold text-olive-800 mb-3 uppercase tracking-wider">
          Fiyat Aralığı
        </label>
        <div className="bg-linen-50 rounded-xl p-4 border border-linen-200">
          {/* Price Display */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-olive-700 bg-white px-3 py-1.5 rounded-lg border border-linen-200 shadow-sm">
              {formatCurrency(localMin)}
            </span>
            <span className="text-xs text-mist-400 mx-2">—</span>
            <span className="text-sm font-medium text-olive-700 bg-white px-3 py-1.5 rounded-lg border border-linen-200 shadow-sm">
              {formatCurrency(localMax)}
            </span>
          </div>

          {/* Dual Range Slider */}
          <div ref={sliderRef} className="relative h-2 mb-4">
            <div className="absolute inset-0 bg-linen-300 rounded-full" />
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full"
              style={{
                left: `${(localMin / MAX_PRICE) * 100}%`,
                right: `${100 - (localMax / MAX_PRICE) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={STEP}
              value={localMin}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v < localMax) setLocalMin(v);
              }}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            />
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={STEP}
              value={localMax}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v > localMin) setLocalMax(v);
              }}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-auto z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={applyPriceFilter}
            className="w-full py-2 bg-olive-800 hover:bg-olive-700 text-gold-400 rounded-lg text-sm font-medium tracking-wide uppercase transition-colors"
          >
            Filtrele
          </button>
        </div>
      </div>

      {/* Categories – Link List */}
      <div>
        <label className="block text-sm font-semibold text-olive-800 mb-3 uppercase tracking-wider">
          {TR.filters.category}
        </label>
        <div className="space-y-0.5">
          {/* All Categories */}
          <button
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${!filters.category
              ? 'bg-gold-100 text-gold-800 font-medium'
              : 'text-espresso-600 hover:bg-linen-100 hover:text-olive-800'
              }`}
          >
            {TR.filters.allCategories}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${filters.category === cat
                ? 'bg-gold-100 text-gold-800 font-medium'
                : 'text-espresso-600 hover:bg-linen-100 hover:text-olive-800'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50 rounded-lg transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Filtreleri Temizle
        </button>
      )}
    </div>
  );

  // Mobile Overlay
  if (showMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-linen-200 px-5 py-4 flex items-center justify-between z-10">
            <h3 className="font-serif text-lg font-semibold text-olive-900">
              {TR.filters.title}
            </h3>
            <button onClick={onCloseMobile} className="text-mist-500 hover:text-olive-800 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5">{filtersContent}</div>
        </div>
      </div>
    );
  }

  // Desktop Sidebar
  return (
    <div className="bg-white rounded-xl border border-linen-200 p-5 shadow-sm">
      <h3 className="font-serif text-lg font-semibold text-olive-900 mb-5 pb-3 border-b border-linen-200">
        {TR.filters.title}
      </h3>
      {filtersContent}
    </div>
  );
}
