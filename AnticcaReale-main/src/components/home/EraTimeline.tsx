import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// Era data with visual styling
const ERAS = [
    {
        id: 'roma',
        name: 'Roma Dönemi',
        period: 'M.Ö. 753 - M.S. 476',
        icon: '🏛️',
        color: 'from-amber-600 to-amber-800'
    },
    {
        id: 'bizans',
        name: 'Bizans',
        period: '330 - 1453',
        icon: '⛪',
        color: 'from-purple-600 to-purple-800'
    },
    {
        id: 'selcuklu',
        name: 'Selçuklu',
        period: '1037 - 1194',
        icon: '🕌',
        color: 'from-teal-600 to-teal-800'
    },
    {
        id: 'osmanli',
        name: 'Osmanlı',
        period: '1299 - 1922',
        icon: '👑',
        color: 'from-red-700 to-red-900'
    },
    {
        id: 'barok',
        name: 'Barok',
        period: '1600 - 1750',
        icon: '🎭',
        color: 'from-yellow-600 to-yellow-800'
    },
    {
        id: 'rokoko',
        name: 'Rokoko',
        period: '1730 - 1770',
        icon: '🌸',
        color: 'from-pink-500 to-pink-700'
    },
    {
        id: 'viktorya',
        name: 'Viktorya',
        period: '1837 - 1901',
        icon: '🎩',
        color: 'from-slate-600 to-slate-800'
    },
    {
        id: 'art-nouveau',
        name: 'Art Nouveau',
        period: '1890 - 1910',
        icon: '🌿',
        color: 'from-emerald-600 to-emerald-800'
    },
    {
        id: 'art-deco',
        name: 'Art Deco',
        period: '1920 - 1940',
        icon: '💎',
        color: 'from-gold-600 to-gold-800'
    },
    {
        id: 'modern',
        name: 'Modern',
        period: '1940+',
        icon: '✨',
        color: 'from-blue-600 to-blue-800'
    },
];

export default function EraTimeline() {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 400);
        }
    };

    const handleEraClick = (eraName: string) => {
        navigate(`/products?era=${encodeURIComponent(eraName)}`);
    };

    return (
        <section className="py-20 bg-espresso-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium tracking-[0.3em] uppercase mb-4">
                        <Clock className="w-4 h-4" />
                        Zaman Yolculuğu
                    </span>
                    <h2 className="font-serif text-4xl sm:text-5xl text-gold-500 mb-4">
                        Dönemler Arasında Keşfet
                    </h2>
                    <p className="text-linen-300 max-w-2xl mx-auto">
                        Her dönemin kendine özgü estetiği ve hikayesi var. İlgilendiğiniz döneme tıklayarak o dönemin eserlerini keşfedin.
                    </p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Scroll Buttons */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-espresso-900/90 backdrop-blur rounded-full flex items-center justify-center text-gold-400 hover:text-gold-300 hover:bg-espresso-800 transition-all shadow-lg"
                            aria-label="Sola kaydır"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-espresso-900/90 backdrop-blur rounded-full flex items-center justify-center text-gold-400 hover:text-gold-300 hover:bg-espresso-800 transition-all shadow-lg"
                            aria-label="Sağa kaydır"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    )}

                    {/* Gradient Overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-espresso-950 to-transparent z-[5] pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-espresso-950 to-transparent z-[5] pointer-events-none" />

                    {/* Timeline Track */}
                    <div className="relative py-8">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-600/30 to-transparent" />

                        {/* Scrollable Container */}
                        <div
                            ref={scrollRef}
                            onScroll={checkScroll}
                            className="flex gap-6 overflow-x-auto scrollbar-hide px-8 snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {ERAS.map((era, index) => (
                                <button
                                    key={era.id}
                                    onClick={() => handleEraClick(era.name)}
                                    className="group flex-shrink-0 snap-center"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Era Card */}
                                    <div className="relative w-40 h-48 rounded-xl overflow-hidden hover-lift cursor-pointer">
                                        {/* Background Gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${era.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

                                        {/* Content */}
                                        <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                                            {/* Icon */}
                                            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                                {era.icon}
                                            </span>

                                            {/* Era Name */}
                                            <h3 className="font-serif text-lg text-white font-medium mb-1">
                                                {era.name}
                                            </h3>

                                            {/* Period */}
                                            <span className="text-xs text-white/70 font-light">
                                                {era.period}
                                            </span>

                                            {/* Hover Indicator */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                        </div>
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="flex justify-center mt-4">
                                        <div className="w-3 h-3 rounded-full bg-gold-500 group-hover:scale-150 group-hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/50" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
