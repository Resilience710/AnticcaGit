import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_ITEMS = [
    { id: 'mobilya', name: 'Mobilya', description: 'Klasik & antika mobilyalar' },
    { id: 'seramik', name: 'Seramik', description: 'El yapımı seramik eserler' },
    { id: 'mucevherat', name: 'Mücevherat', description: 'Değerli taşlar & takılar' },
    { id: 'hali-kilim', name: 'Halı & Kilim', description: 'El dokuması halılar' },
    { id: 'sanat', name: 'Sanat Eserleri', description: 'Tablolar & heykeller' },
    { id: 'aydinlatma', name: 'Aydınlatma', description: 'Avizeler & lambalar' },
    { id: 'saat', name: 'Saatler', description: 'Antika duvar & cep saatleri' },
    { id: 'kitap', name: 'Kitaplar', description: 'Nadir el yazmaları' },
];

export default function CategoryShowcase() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(true);
    const navigate = useNavigate();

    const check = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 0);
        setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    };

    useEffect(() => { check(); }, []);

    const scroll = (d: 'l' | 'r') => {
        scrollRef.current?.scrollBy({ left: d === 'l' ? -280 : 280, behavior: 'smooth' });
        setTimeout(check, 400);
    };

    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.05 }
        );
        document.querySelectorAll('.cat-reveal').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <section className="bg-obsidian-300 py-28 lg:py-32 relative">
            <div className="divider-shimmer" />
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10">
                {/* Header */}
                <div className="text-center mb-18 reveal cat-reveal">
                    <span className="font-display text-agold-500 text-[9px] tracking-extreme uppercase block mb-5">Kategoriler</span>
                    <h2 className="heading-textured font-display text-fluid-xl italic mb-5">Türlere Göz Atın</h2>
                    <p className="text-parchment-600 text-[13px] tracking-elegant">İlgi alanınıza göre koleksiyonları keşfedin</p>
                </div>

                {/* Carousel */}
                <div className="relative group">
                    {canLeft && (
                        <button onClick={() => scroll('l')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center glass-dark text-agold-400 hover:text-agold-300 border border-agold-900/15 opacity-0 group-hover:opacity-100 transition-all duration-500" aria-label="Önceki görsel">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}
                    {canRight && (
                        <button onClick={() => scroll('r')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center glass-dark text-agold-400 hover:text-agold-300 border border-agold-900/15 opacity-0 group-hover:opacity-100 transition-all duration-500" aria-label="Sonraki görsel">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}

                    <div ref={scrollRef} onScroll={check} className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {CATEGORY_ITEMS.map((cat, idx) => (
                            <button
                                key={cat.id}
                                onClick={() => navigate(`/products?category=${cat.id}`)}
                                className="flex-none snap-start w-52 card-premium p-7 text-center space-y-4 group/card hover-lift reveal cat-reveal"
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >

                                <h3 className="font-display text-[13px] text-parchment-200 tracking-elegant italic">{cat.name}</h3>
                                <p className="text-parchment-600 text-[11px] leading-relaxed">{cat.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
