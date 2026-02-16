import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Gavel } from 'lucide-react';
import { Product, Shop } from '../../types';
import { getAllProducts, getAllShops, updateProduct, deleteProduct } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import AdminProductModal from '../../components/admin/AdminProductModal';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalSaleType, setModalSaleType] = useState<'fixed' | 'auction'>('fixed');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [productsData, shopsData] = await Promise.all([
        getAllProducts(false),
        getAllShops(false),
      ]);
      setProducts(productsData);
      setShops(shopsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  const openModal = (product?: Product, saleType: 'fixed' | 'auction' = 'fixed') => {
    setEditingProduct(product || null);
    setModalSaleType(saleType);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(TR.admin.confirmDelete)) return;
    try {
      await deleteProduct(id);
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme hatası oluştu.');
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { isActive: !product.isActive });
      await fetchData();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-navy-800">
          {TR.admin.products}
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => openModal()} disabled={shops.length === 0} variant="outline">
            <Plus className="h-5 w-5 mr-2" />
            {TR.admin.addProduct}
          </Button>
          <Button
            onClick={() => openModal(undefined, 'auction')}
            disabled={shops.length === 0}
          >
            <Gavel className="h-5 w-5 mr-2" />
            {TR.admin.startAuction}
          </Button>
        </div>
      </div>

      {shops.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-yellow-800">
          Ürün eklemek için önce bir dükkan oluşturmalısınız.
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-navy-500">
            Henüz ürün eklenmemiş.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Görsel</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Ürün Adı</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Dükkan</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Kategori</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Fiyat</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Stok</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Satış Tipi</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Durum</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-navy-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-cream-100 overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🏺</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy-800 line-clamp-1">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">{shopMap.get(product.shopId) || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-navy-600">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-800">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-sm text-navy-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.saleType === 'auction' ? 'bg-gold-100 text-gold-800' : 'bg-cream-100 text-navy-600'}`}>
                        {product.saleType === 'auction' ? TR.admin.auction : TR.admin.fixedPrice}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? TR.admin.active : TR.admin.inactive}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleActive(product)} className="p-2 text-navy-500 hover:text-navy-700 hover:bg-cream-100 rounded-lg transition-colors">
                          {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button onClick={() => openModal(product, product.saleType)} className="p-2 text-navy-500 hover:text-navy-700 hover:bg-cream-100 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={editingProduct}
        shops={shops}
        onSave={fetchData}
        initialSaleType={modalSaleType}
      />
    </div>
  );
}
