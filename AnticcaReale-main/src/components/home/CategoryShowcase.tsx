import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_ITEMS = [
    {
        id: 'mobilya',
        name: 'Mobilya',
        icon: '🪑',
        color: 'from-amber-800 to-amber-950',
        accent: 'bg-amber-400',
        description: 'Klasik & antika mobilyalar',
    },
    {
        id: 'seramik',
        name: 'Seramik',
        icon: '🏺',
        color: 'from-orange-700 to-orange-900',
        accent: 'bg-orange-400',
        description: 'El yapımı seramik eserler',
    },
    {
        id: 'mucevherat',
        name: 'Mücevherat',
        icon: '💎',
        color: 'from-rose-700 to-rose-900',
        accent: 'bg-rose-400',
        description: 'Değerli taşlar & takılar',
    },
    {
        id: 'hali-kilim',
        name: 'Halı & Kilim',
        icon: '🧶',
        color: 'from-red-800 to-red-950',
        accent: 'bg-red-400',
        description: 'El dokuması halılar',
    },
    {
        id: 'sanat',
        name: 'Sanat Eserleri',
        icon: '🎨',
        color: 'from-violet-700 to-violet-900',
        accent: 'bg-violet-400',
        description: 'Tablolar & heykeller',
    },
    {
        id: 'aydinlatma',
        name: 'Aydınlatma',
        icon: '🕯️',
        color: 'from-yellow-700 to-yellow-900',
        accent: 'bg-yellow-400',
        description: 'Avizeler & lambalar',
    },
    {
        id: 'saatler',
        name: 'Saatler',
        icon: '⏰',
        color: 'from-emerald-800 to-emerald-950',
        accent: 'bg-emerald-400',
        description: 'Antika saatler',
    },
    {
        id: 'kitaplar',
        name: 'Nadir Kitaplar',
        icon: '📚',
        color: 'from-stone-700 to-stone-900',
        accent: 'bg-stone-400',
        description: 'Nadir & koleksiyon kitaplar',
    },
    {
        id: 'dekorasyon',
        name: 'Dekorasyon & Aksesuar',
        icon: '🪞',
        color: 'from-teal-700 to-teal-900',
        accent: 'bg-teal-400',
        description: 'Dekoratif objeler',
    },
    {
        id: 'ayna',
        name: 'Ayna',
        icon: '🪟',
        color: 'from-sky-700 to-sky-900',
        accent: 'bg-sky-400',
        description: 'Antika aynalar',
    },
    {
        id: 'koleksiyon',
        name: 'Koleksiyon',
        icon: '🏛️',
        color: 'from-indigo-700 to-indigo-900',
        accent: 'bg-indigo-400',
        description: 'Koleksiyon parçaları',
    },
];

export default function CategoryShowcase() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        setCanScrollLeft(container.scrollLeft > 10);
        setCanScrollRight(
            container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        container.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
        return () => container.removeEventListener('scroll', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const scrollAmount = 340;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <section className="py-20 bg-linen-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <span className="text-gold-600 text-xs uppercase tracking-[0.3em] mb-3 block font-medium">
                        KATEGORİLER
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-olive-900 mb-4">
                        Türlere Göz Atın
                    </h2>
                    <p className="text-espresso-500 max-w-xl mx-auto text-base font-light">
                        İlgi alanınıza göre koleksiyonları keşfedin
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative group">
                    {/* Left Arrow */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-olive-800 hover:bg-gold-50 hover:text-gold-700 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300"
                            aria-label="Önceki"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-olive-800 hover:bg-gold-50 hover:text-gold-700 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                            aria-label="Sonraki"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {CATEGORY_ITEMS.map((cat, index) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.name)}
                                className="group/card flex-shrink-0 snap-center focus:outline-none"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {/* Card */}
                                <div className="relative w-44 h-56 rounded-2xl overflow-hidden hover-lift cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500">
                                    {/* Background */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${cat.color} transition-all duration-500`}
                                    />

                                    {/* Subtle Pattern Overlay */}
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_60%)]" />

                                    {/* Content */}
                                    <div className="relative h-full flex flex-col items-center justify-center p-5 text-center">
                                        {/* Icon */}
                                        <span className="text-5xl mb-4 group-hover/card:scale-110 transition-transform duration-500 drop-shadow-lg">
                                            {cat.icon}
                                        </span>

                                        {/* Category Name */}
                                        <h3 className="font-serif text-lg text-white font-medium mb-1 leading-tight">
                                            {cat.name}
                                        </h3>

                                        {/* Description */}
                                        <span className="text-[11px] text-white/60 font-light leading-snug">
                                            {cat.description}
                                        </span>

                                        {/* Bottom Accent Line */}
                                        <div
                                            className={`absolute bottom-0 left-0 right-0 h-1 ${cat.accent} transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left`}
                                        />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
