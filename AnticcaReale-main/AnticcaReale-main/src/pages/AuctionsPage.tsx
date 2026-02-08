import { Link } from 'react-router-dom';
import { Gavel, Clock, ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useFirestore';
import { TR } from '../constants/tr';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';
import ProductCard from '../components/product/ProductCard';

export default function AuctionsPage() {
    const { products, loading } = useProducts({
        saleType: 'auction',
        sortBy: 'newest'
    });

    if (loading) {
        return <Loading fullScreen />;
    }

    // Group auctions by status/time
    const now = new Date().getTime();

    const parseDate = (d: any) => {
        if (!d) return 0;
        if (d.toDate) return d.toDate().getTime();
        return new Date(d).getTime();
    };

    const liveAuctions = products.filter(p => {
        const start = parseDate(p.auctionStartTime);
        const end = parseDate(p.auctionEndTime);
        return now >= start && now <= end;
    });

    const upcomingAuctions = products.filter(p => {
        const start = parseDate(p.auctionStartTime);
        return now < start;
    });

    const endedAuctions = products.filter(p => {
        const end = parseDate(p.auctionEndTime);
        return now > end;
    });

    return (
        <div className="min-h-screen bg-cream-50">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-olive-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544257125-e555025eaefd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-olive-950/90 via-olive-900/50 to-transparent" />

                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <div className="inline-flex p-4 rounded-full bg-gold-500/10 backdrop-blur-sm border border-gold-400/30 mb-6 animate-fade-in-up">
                        <Gavel className="w-8 h-8 text-gold-400" />
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
                        Anticca Müzayede
                    </h1>
                    <p className="text-xl text-linen-100 font-light max-w-2xl mx-auto leading-relaxed">
                        Nadir parçalar, gerçek zamanlı teklifler ve koleksiyonerler için özel seçkiler.
                        Hikayesi olan eserlere sahip olma şansını yakalayın.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

                {/* Live Auctions */}
                {liveAuctions.length > 0 && (
                    <section className="animate-fade-in">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-100">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <span className="font-semibold tracking-wide text-sm uppercase">Canlı Müzayedeler</span>
                            </div>
                            <div className="h-px flex-grow bg-gradient-to-r from-red-100 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {liveAuctions.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Auctions */}
                {upcomingAuctions.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-linen-100 text-olive-800 rounded-full border border-linen-200">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold tracking-wide text-sm uppercase">Yakında Başlayacak</span>
                            </div>
                            <div className="h-px flex-grow bg-gradient-to-r from-linen-200 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {upcomingAuctions.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* No Active Auctions */}
                {liveAuctions.length === 0 && upcomingAuctions.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-linen-300">
                        <Clock className="w-16 h-16 text-linen-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-serif text-olive-900 mb-2">Şu Anda Aktif Müzayede Yok</h3>
                        <p className="text-olive-600">Yeni koleksiyonlar hazırlanıyor. Lütfen daha sonra tekrar kontrol edin.</p>

                        {endedAuctions.length > 0 && (
                            <p className="mt-8 text-sm text-olive-400 uppercase tracking-widest font-medium">
                                Geçmiş Müzayedeler Aşağıda Listelenmiştir
                            </p>
                        )}
                    </div>
                )}

                {/* Ended Auctions (Smaller / Less prominent) */}
                {endedAuctions.length > 0 && (
                    <section className="opacity-75 grayscale-[0.3]">
                        <h3 className="font-serif text-2xl text-olive-800 mb-8 border-b border-linen-200 pb-4 inline-block">
                            Sona Erenler
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {endedAuctions.slice(0, 4).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
