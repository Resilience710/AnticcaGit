import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useProducts, useShops } from '../hooks/useFirestore';
import { FilterState, ProductCategory, CATEGORIES } from '../types';
import { TR } from '../constants/tr';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';
import SEO from '../components/seo/SEO';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const initialCategory = categoryParam && CATEGORIES.includes(categoryParam as ProductCategory)
    ? (categoryParam as ProductCategory)
    : undefined;

  const [filters, setFilters] = useState<FilterState>({ sortBy: 'newest', category: initialCategory });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Update filters when URL params change
  useEffect(() => {
    if (categoryParam && CATEGORIES.includes(categoryParam as ProductCategory)) {
      setFilters((prev) => ({ ...prev, category: categoryParam as ProductCategory }));
    }
  }, [categoryParam]);

  const { products, loading } = useProducts(filters);
  const { shops } = useShops();

  // Map shopId to shopName
  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  return (
    <div className="min-h-screen bg-linen-50">
      <SEO
        title="Antika Ürünler — Koleksiyon"
        description="Anticca'da antika mobilya, tablo, saat, mücevherat, aydınlatma ve daha fazlası. Osmanlı, Art Deco, Viktorya dönemlerinden seçkin parçalar."
        canonical="/products"
      />
      {/* Header - Minimal & Elegant */}
      <div className="bg-linen-100/50 border-b border-linen-200 py-16 sm:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-espresso-400 text-xs sm:text-sm uppercase tracking-[0.25em] mb-4 block animate-fade-in">A N T İ C C A</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-espresso-900 mb-6">{TR.products.title}</h1>
          <p className="text-espresso-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Geçmişin estetiğini bugünün yaşamına taşıyan eşsiz parçalar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                shops={shops}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(true)}
                className="w-full"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                {TR.filters.title}
              </Button>
            </div>

            {/* Results count */}
            <div className="mb-6">
              <p className="text-espresso-700">
                {loading ? TR.common.loading : `${products.length} ürün bulundu`}
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-linen-200 rounded-xl border border-mist-300">
                <p className="text-espresso-800 text-lg">{TR.products.noProducts}</p>
                <p className="text-espresso-600 mt-2">Farklı filtreler deneyebilirsiniz.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    shopName={shopMap.get(product.shopId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showMobileFilters && (
        <ProductFilters
          filters={filters}
          onFilterChange={setFilters}
          shops={shops}
          showMobile
          onCloseMobile={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
}
