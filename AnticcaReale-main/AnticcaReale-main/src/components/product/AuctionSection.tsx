import { useState, useEffect } from 'react';
import { Gavel, Clock, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { placeBid, buyNowPurchase, useBidHistory } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AuctionSectionProps {
    product: Product;
}

export default function AuctionSection({ product }: AuctionSectionProps) {
    const { userData: user } = useAuth();
    const { loading: bidsLoading } = useBidHistory(product.id);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const parseDate = (d: any) => {
        if (!d) return 0;
        if (d.toDate) return d.toDate().getTime();
        return new Date(d).getTime();
    };

    const startTime = parseDate(product.auctionStartTime);
    const endTime = parseDate(product.auctionEndTime);
    const now = new Date().getTime();

    const isUpcoming = now < startTime;
    const isEnded = now > endTime || product.stock <= 0;
    const isLive = !isUpcoming && !isEnded;

    const currentBid = product.currentHighestBid || product.startingBid || 0;
    const minIncrement = product.minimumBidIncrement || 100;
    const nextMinBid = product.currentHighestBid ? currentBid + minIncrement : product.startingBid || 0;

    useEffect(() => {
        setBidAmount(nextMinBid);
    }, [nextMinBid]);

    const handleBid = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError('Teklif vermek için giriş yapmalısınız.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await placeBid(product.id, bidAmount, user as any);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Teklif verilemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            setError('Giriş yapmalısınız.');
            return;
        }

        if (!window.confirm(`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(product.buyNowPrice || 0)} karşılığında bu ürünü hemen almak istiyor musunuz?`)) {
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await buyNowPurchase(product.id, user as any);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Satın alma işlemi başarısız.');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isEnded && product.stock <= 0) {
        return (
            <div className="bg-linen-100 p-8 rounded-xl border border-linen-200 text-center">
                <div className="w-16 h-16 bg-linen-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gavel className="h-8 w-8 text-mist-400" />
                </div>
                <h3 className="font-serif text-2xl text-olive-900 mb-2">Müzayede Sona Erdi</h3>
                <p className="text-mist-600 mb-4">Bu ürün satılmıştır.</p>
                <div className="inline-block px-4 py-2 bg-gold-500 text-white font-serif rounded">
                    Satış Fiyatı: {formatPrice(product.currentHighestBid || product.price)}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-linen-200 shadow-sm">
            {/* Header Status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    {isLive ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 animate-pulse">
                            <span className="w-2 h-2 bg-red-600 rounded-full" />
                            <span className="text-xs font-bold tracking-widest uppercase">CANLI</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1 bg-mist-50 text-mist-600 rounded-full border border-mist-100">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs font-bold tracking-widest uppercase">
                                {isUpcoming ? 'YAKINDA' : 'BİTTİ'}
                            </span>
                        </div>
                    )}
                </div>
                {isLive && endTime && (
                    <div className="flex items-center gap-2 text-mist-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                            Kalan Süre: {formatDistanceToNow(endTime, { locale: tr, addSuffix: false })}
                        </span>
                    </div>
                )}
            </div>

            {/* Price Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-linen-50 p-4 rounded-lg border border-linen-100">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-mist-400 block mb-1">
                        MEVCUT TEKLİF
                    </span>
                    <div className="text-3xl font-serif font-medium text-olive-900">
                        {formatPrice(currentBid)}
                    </div>
                    {user && product.currentHighestBidderId === user.uid && (
                        <div className="text-[10px] text-green-600 mt-1 uppercase tracking-wider font-medium">
                            En yüksek teklif sizde
                        </div>
                    )}
                </div>

                {product.buyNowPrice && isLive && (
                    <button
                        onClick={handleBuyNow}
                        disabled={loading}
                        className="bg-gold-500 hover:bg-gold-600 text-white p-4 rounded-lg border border-gold-400 shadow-sm transition-all group relative overflow-hidden text-left"
                    >
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-gold-100 block mb-1">
                                    HEMEN AL
                                </span>
                                <div className="text-2xl font-serif font-medium">
                                    {formatPrice(product.buyNowPrice)}
                                </div>
                            </div>
                            <Zap className="h-8 w-8 text-gold-200 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                )}
            </div>

            {/* Bidding Interface */}
            {isLive ? (
                <form onSubmit={handleBid} className="space-y-4">
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm font-medium text-olive-900">Teklifiniz</label>
                            <span className="text-[10px] text-mist-400 uppercase tracking-wider">
                                Min: {formatPrice(nextMinBid)}
                            </span>
                        </div>
                        <div className="relative">
                            <Input
                                type="number"
                                min={nextMinBid}
                                step={minIncrement}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                                className="pl-12 !h-14 font-serif text-xl border-linen-300"
                                required
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-mist-400 text-xl">
                                ₺
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded border border-green-100">
                            Teklifiniz başarıyla alındı!
                        </div>
                    )}

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full !h-14 bg-olive-900 hover:bg-olive-800 text-gold-500 font-serif text-lg tracking-widest uppercase transition-all"
                    >
                        <Gavel className="mr-2 h-5 w-5" />
                        Teklif Ver
                    </Button>

                    <p className="text-[10px] text-mist-400 text-center uppercase tracking-widest leading-loose">
                        Teklif göndererek <a href="#" className="underline">Katılım Koşulları</a>'nı kabul etmiş sayılırsınız.
                    </p>
                </form>
            ) : isUpcoming ? (
                <div className="p-6 bg-linen-50 border border-linen-100 rounded-lg text-center">
                    <Clock className="w-8 h-8 text-mist-400 mx-auto mb-3" />
                    <h4 className="font-serif text-lg text-olive-900 mb-1">Müzayede Henüz Başlamadı</h4>
                    <p className="text-sm text-mist-600">
                        {product.auctionStartTime && `Başlangıç: ${new Date(product.auctionStartTime).toLocaleString('tr-TR')}`}
                    </p>
                </div>
            ) : null}
        </div>
    );
}
