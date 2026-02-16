import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Gavel } from 'lucide-react';
import { Product, Shop } from '../../types';
import { getAllProducts, getAllShops, updateProduct, deleteProduct } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';

import AdminProductModal from '../../components/admin/AdminProductModal';

export default function AdminAuctions() {
    const [products, setProducts] = useState<Product[]>([]);
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
            // Filter for auctions only
            setProducts(productsData.filter(p => p.saleType === 'auction'));
            setShops(shopsData);
        } catch (error) {
            console.error('Error fetching auctions:', error);
        } finally {
            setLoading(false);
        }
    }

    const shopMap = new Map(shops.map(s => [s.id, s.name]));

    const openModal = (product?: Product) => {
        setEditingProduct(product || null);
        setShowModal(true);
    };

    const parseDate = (d: any) => {
        if (!d) return 0;
        if (d.toDate) return d.toDate().getTime();
        return new Date(d).getTime();
    };

    const getAuctionStatus = (product: Product) => {
        const now = new Date().getTime();
        const start = parseDate(product.auctionStartTime);
        const end = parseDate(product.auctionEndTime);

        if (!start || !end) return 'Unknown';
        if (now < start) return TR.auction.upcoming;
        if (now > end) return TR.auction.ended;
        return TR.auction.live;
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
                    {TR.admin.auctions}
                </h1>
                <Button onClick={() => openModal()}>
                    <Plus className="h-5 w-5 mr-2" />
                    {TR.admin.startAuction}
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">
                {products.length === 0 ? (
                    <div className="p-8 text-center text-navy-500">
                        Henüz müzayede oluşturulmamış.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-cream-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Ürün</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Dükkan</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Durum</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Başlangıç</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Mevcut Teklif</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">Hemen Al</th>
                                    <th className="px-6 py-3 text-right text-sm font-medium text-navy-600">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-cream-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-cream-100 overflow-hidden">
                                                    {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <span className="font-medium text-navy-800">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-navy-600">
                                            {shopMap.get(product.shopId)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAuctionStatus(product) === TR.auction.live ? 'bg-green-100 text-green-800' :
                                                getAuctionStatus(product) === TR.auction.upcoming ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {getAuctionStatus(product)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-navy-600">
                                            {formatPrice(product.startingBid || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-navy-800">
                                            {formatPrice(product.currentHighestBid || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gold-600">
                                            {product.buyNowPrice ? formatPrice(product.buyNowPrice) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(product)} className="p-2 text-navy-500 hover:bg-cream-100 rounded-lg">
                                                    <Edit2 className="h-4 w-4" />
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
                initialSaleType="auction"
            />
        </div>
    );
}
