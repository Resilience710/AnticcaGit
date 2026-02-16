import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { User, ShieldCheck } from 'lucide-react';
import { useBidHistory } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';

interface BidHistoryProps {
    productId: string;
}

export default function BidHistory({ productId }: BidHistoryProps) {
    const { bids, loading } = useBidHistory(productId);

    if (loading) {
        return <div className="animate-pulse h-20 bg-linen-100 rounded-lg"></div>;
    }

    if (bids.length === 0) {
        return (
            <div className="text-center py-6 text-espresso-400 bg-linen-50/50 rounded-lg border border-dashed border-linen-300">
                {TR.auction.noBidsYet}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-serif text-lg text-olive-900 border-b border-linen-200 pb-2">
                {TR.auction.bidHistory}
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {bids.map((bid, index) => (
                    <div
                        key={bid.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${index === 0
                                ? 'bg-gold-50 border border-gold-200'
                                : 'bg-white border border-linen-100'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${index === 0 ? 'bg-gold-100' : 'bg-linen-100'}`}>
                                {index === 0 ? (
                                    <ShieldCheck className={`w-4 h-4 ${index === 0 ? 'text-gold-700' : 'text-espresso-400'}`} />
                                ) : (
                                    <User className="w-4 h-4 text-espresso-400" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-medium ${index === 0 ? 'text-gold-800' : 'text-espresso-700'}`}>
                                    {bid.userName}
                                </span>
                                <span className="text-xs text-espresso-400">
                                    {bid.timestamp && formatDistanceToNow(bid.timestamp, { addSuffix: true, locale: tr })}
                                </span>
                            </div>
                        </div>
                        <span className={`font-medium ${index === 0 ? 'text-gold-700' : 'text-espresso-600'}`}>
                            ₺{bid.amount.toLocaleString('tr-TR')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
