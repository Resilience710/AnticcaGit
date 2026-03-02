import { TR } from '../constants/tr';
import SEO from '../components/seo/SEO';

export default function CookiePage() {
    return (
        <div className="min-h-screen bg-linen-300">
            <SEO
                title="Çerez Politikası — Anticca"
                description="Anticca çerez kullanımı ve politikası."
                canonical="/cookies"
            />
            {/* Header */}
            <div className="bg-espresso-900 text-linen-100 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Çerez Politikası</h1>
                    <p className="text-xl text-linen-300">
                        Çerezlerin Kullanımı Hakkında Bilgilendirme
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 p-8 md:p-12">
                    <div className="prose prose-lg max-w-none text-espresso-800">

                        <section className="mb-8">
                            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">1. Çerez Nedir?</h2>
                            <p>
                                Çerezler, internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük veri dosyalarıdır.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">2. Kullanılan Çerez Türleri</h2>
                            <p>Anticca aşağıdaki çerez türlerini kullanabilir:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Zorunlu Çerezler:</strong> Site’nin düzgün çalışması için gereklidir.</li>
                                <li><strong>Performans Çerezleri:</strong> Site kullanım istatistiklerini analiz etmek için kullanılır.</li>
                                <li><strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlamak için kullanılır.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">3. Çerezlerin Yönetimi</h2>
                            <p>
                                Kullanıcılar, tarayıcı ayarlarından çerezleri silebilir veya engelleyebilir. Ancak bu durumda Site’nin bazı özellikleri düzgün çalışmayabilir.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">4. Güncellemeler</h2>
                            <p>
                                Çerez Politikası gerektiğinde güncellenebilir. Güncel metin Site üzerinde yayımlanır.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
