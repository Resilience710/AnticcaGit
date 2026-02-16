import { useState, useEffect } from 'react';
import { X, Upload, Image, Box, Gavel, Plus } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { Product, Shop, CATEGORIES, ProductCategory } from '../../types';
import { createProduct, updateProduct } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface AdminProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    shops: Shop[];
    onSave: () => void;
    initialSaleType?: 'fixed' | 'auction';
}

export default function AdminProductModal({
    isOpen,
    onClose,
    product,
    shops,
    onSave,
    initialSaleType = 'fixed'
}: AdminProductModalProps) {
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        shopId: '',
        name: '',
        description: '',
        price: 0,
        currency: 'TRY',
        category: 'Mobilya' as ProductCategory,
        images: [] as string[],
        model3dUrl: '',
        stock: 1,
        isActive: true,
        saleType: initialSaleType,
        auctionStartTime: '',
        auctionEndTime: '',
        startingBid: 0,
        buyNowPrice: 0,
        minimumBidIncrement: 100,
    });

    useEffect(() => {
        const parseForInput = (d: any) => {
            if (!d) return '';
            const date = d.toDate ? d.toDate() : new Date(d);
            if (isNaN(date.getTime())) return '';
            // Adjust to local time for datetime-local input
            const pad = (n: number) => n.toString().padStart(2, '0');
            const year = date.getFullYear();
            const month = pad(date.getMonth() + 1);
            const day = pad(date.getDate());
            const hours = pad(date.getHours());
            const minutes = pad(date.getMinutes());
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        if (product) {
            setFormData({
                shopId: product.shopId,
                name: product.name,
                description: product.description,
                price: product.price,
                currency: product.currency,
                category: product.category,
                images: product.images || [],
                model3dUrl: product.model3dUrl || '',
                stock: product.stock,
                isActive: product.isActive,
                saleType: product.saleType || 'fixed',
                auctionStartTime: parseForInput(product.auctionStartTime),
                auctionEndTime: parseForInput(product.auctionEndTime),
                startingBid: product.startingBid || 0,
                buyNowPrice: product.buyNowPrice || 0,
                minimumBidIncrement: product.minimumBidIncrement || 100,
            });
        } else {
            setFormData({
                shopId: shops[0]?.id || '',
                name: '',
                description: '',
                price: 0,
                currency: 'TRY',
                category: 'Mobilya',
                images: [],
                model3dUrl: '',
                stock: 1,
                isActive: true,
                saleType: initialSaleType,
                auctionStartTime: '',
                auctionEndTime: '',
                startingBid: 0,
                buyNowPrice: 0,
                minimumBidIncrement: 100,
            });
        }
    }, [product, shops, initialSaleType, isOpen]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const urls: string[] = [];
            for (const file of Array.from(files)) {
                const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                urls.push(url);
            }
            setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
        } catch (error) {
            console.error('Upload error:', error);
            alert('Görsel yüklenirken hata oluştu.');
        } finally {
            setUploading(false);
        }
    };

    const handle3DModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.glb')) {
            alert('Lütfen sadece .glb formatında 3D model yükleyin.');
            return;
        }

        setUploading(true);
        try {
            const storageRef = ref(storage, `models/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, model3dUrl: url }));
        } catch (error) {
            console.error('3D model upload error:', error);
            alert('3D model yüklenirken hata oluştu.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.shopId) {
            alert('Lütfen bir dükkan seçin.');
            return;
        }

        setSaving(true);
        try {
            const submitData: any = { ...formData };
            if (formData.saleType === 'auction') {
                if (formData.auctionStartTime) submitData.auctionStartTime = new Date(formData.auctionStartTime);
                if (formData.auctionEndTime) submitData.auctionEndTime = new Date(formData.auctionEndTime);
                // Ensure price is set to starting bid for auctions by default if not set
                if (!submitData.price) submitData.price = submitData.startingBid;
            }

            if (product) {
                await updateProduct(product.id, submitData);
            } else {
                await createProduct(submitData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Save error:', error);
            alert('Kaydetme hatası oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const categoryOptions = CATEGORIES.map((cat) => ({ value: cat, label: cat }));
    const shopOptions = shops.map((shop) => ({ value: shop.id, label: shop.name }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-semibold text-navy-800">
                        {product ? TR.admin.editProduct : TR.admin.addProduct}
                    </h2>
                    <button onClick={onClose} className="text-navy-400 hover:text-navy-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <Select
                        label={TR.admin.selectShop}
                        options={shopOptions}
                        value={formData.shopId}
                        onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-navy-700 mb-2">
                            {TR.admin.uploadImages}
                        </label>
                        <div className="flex flex-wrap gap-3 mb-3">
                            {formData.images.map((url, index) => (
                                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream-100 border border-cream-200">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-cream-300 flex items-center justify-center cursor-pointer hover:border-gold-500 transition-colors">
                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                {uploading ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-gold-500 border-t-transparent rounded-full" />
                                ) : (
                                    <Image className="h-6 w-6 text-cream-400" />
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-cream-100">
                        <label className="block text-sm font-medium text-navy-700 mb-2">{TR.admin.upload3dModel}</label>
                        <div className="flex items-center gap-4">
                            {formData.model3dUrl ? (
                                <div className="flex-grow flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <Box className="h-5 w-5" />
                                        <span className="text-sm font-medium">3D Model Hazır</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, model3dUrl: '' })}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex-grow flex items-center justify-center p-4 border-2 border-dashed border-cream-300 rounded-lg cursor-pointer hover:border-gold-500 hover:bg-cream-50 transition-all duration-300">
                                    <input type="file" accept=".glb" onChange={handle3DModelUpload} className="hidden" />
                                    {uploading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin h-5 w-5 border-2 border-gold-500 border-t-transparent rounded-full" />
                                            <span className="text-sm text-navy-500">Yükleniyor...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <Upload className="h-6 w-6 text-cream-400" />
                                            <span className="text-sm text-navy-600 font-medium">.glb dosyası seçin</span>
                                        </div>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>

                    <Input
                        label={TR.admin.productName}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-navy-700 mb-1">{TR.admin.productDescription}</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-lg border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label={TR.filters.category}
                            options={categoryOptions}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={TR.products.price}
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                            required={formData.saleType === 'fixed'}
                            disabled={formData.saleType === 'auction'}
                        />
                        <Input
                            label={TR.admin.stock}
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                            required
                        />
                    </div>

                    <div className="pt-4 border-t border-cream-100">
                        <label className="block text-sm font-medium text-navy-700 mb-2">{TR.admin.saleType}</label>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={formData.saleType === 'fixed'}
                                    onChange={() => setFormData({ ...formData, saleType: 'fixed' })}
                                    className="w-4 h-4 text-gold-600 focus:ring-gold-500"
                                />
                                <span className="text-navy-700">{TR.admin.fixedPrice}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={formData.saleType === 'auction'}
                                    onChange={() => setFormData({ ...formData, saleType: 'auction' })}
                                    className="w-4 h-4 text-gold-600 focus:ring-gold-500"
                                />
                                <span className="text-navy-700">{TR.admin.auction}</span>
                            </label>
                        </div>

                        {formData.saleType === 'auction' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-cream-50 p-4 rounded-lg">
                                <Input
                                    label={TR.admin.startingBid}
                                    type="number"
                                    min="0"
                                    value={formData.startingBid}
                                    onChange={(e) => setFormData({ ...formData, startingBid: parseFloat(e.target.value) || 0, price: parseFloat(e.target.value) || 0 })}
                                    required
                                />
                                <Input
                                    label="Hemen Al Fiyatı"
                                    type="number"
                                    min="0"
                                    value={formData.buyNowPrice}
                                    onChange={(e) => setFormData({ ...formData, buyNowPrice: parseFloat(e.target.value) || 0 })}
                                />
                                <Input
                                    label={TR.admin.minIncrement}
                                    type="number"
                                    min="0"
                                    value={formData.minimumBidIncrement}
                                    onChange={(e) => setFormData({ ...formData, minimumBidIncrement: parseFloat(e.target.value) || 0 })}
                                    required
                                />
                                <Input
                                    label={TR.admin.auctionStart}
                                    type="datetime-local"
                                    value={formData.auctionStartTime}
                                    onChange={(e) => setFormData({ ...formData, auctionStartTime: e.target.value })}
                                    required
                                />
                                <Input
                                    label={TR.admin.auctionEnd}
                                    type="datetime-local"
                                    value={formData.auctionEndTime}
                                    onChange={(e) => setFormData({ ...formData, auctionEndTime: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-navy-700">{TR.admin.active}</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                        <Button type="button" variant="ghost" onClick={onClose}>{TR.admin.cancel}</Button>
                        <Button type="submit" loading={saving}>{TR.admin.save}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
