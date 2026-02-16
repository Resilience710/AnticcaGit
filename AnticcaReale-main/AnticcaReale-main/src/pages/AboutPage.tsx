import { Store, Shield, Truck, Award } from 'lucide-react';
import { TR } from '../constants/tr';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linen-50">
      {/* Header - Minimal & Elegant */}
      <div className="bg-linen-100/50 border-b border-linen-200 py-20 lg:py-32 text-center relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-olive-900/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-gold-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 block animate-fade-in">Hikayemiz</span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-olive-900 mb-6 drop-shadow-sm">Hakkımızda</h1>
          <p className="text-xl md:text-2xl text-espresso-600 font-light italic">
            {TR.siteName} — {TR.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Main Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-olive-900 prose-p:text-espresso-700 prose-p:leading-relaxed">
          <section className="mb-20 text-center">
            <h2 className="text-3xl md:text-4xl font-normal mb-8 relative inline-block">
              Biz Kimiz?
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gold-300 w-1/2 mx-auto" />
            </h2>
            <p className="text-lg md:text-xl font-light leading-8">
              Anticca, İstanbul'un köklü antika geleneğini dijital dünyaya taşıyan öncü bir platformdur.
              2024 yılında kurulan şirketimiz, Türkiye'nin en seçkin antikacılarını ve antika meraklılarını
              bir araya getirme vizyonuyla yola çıkmıştır.
            </p>
          </section>

          <section className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="relative aspect-[4/5] bg-linen-200 rounded-sm overflow-hidden shadow-soft rotate-2 hover:rotate-0 transition-transform duration-700">
                  <img
                    src="https://images.unsplash.com/photo-1565514020176-13d85ae31950?q=80&w=2070&auto=format&fit=crop"
                    alt="Antika dükkanı iç mekan"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <h2 className="text-3xl font-serif text-olive-900">Miras ve Teknoloji</h2>
                <p>
                  Misyonumuz, yüzyıllık zanaat geleneğini ve tarihi eserleri koruyarak gelecek nesillere
                  aktarmak, aynı zamanda antika koleksiyonerliğini herkes için erişilebilir kılmaktır.
                </p>
                <p>
                  Platformumuzda yer alan her ürün, uzman ekibimiz tarafından titizlikle incelenir ve
                  orijinalliği doğrulanır. Müşterilerimize sadece ürün değil, aynı zamanda her eserin
                  ardındaki hikayeyi de sunuyoruz.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-olive-900 mb-4">Değerlerimiz</h2>
              <div className="w-12 h-1 bg-gold-400 mx-auto rounded-full" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: "Güvenilirlik", desc: "Tüm ürünlerimizin orijinalliğini garanti ediyor, şeffaf bir deneyim sunuyoruz." },
                { icon: Award, title: "Kalite", desc: "Sadece en kaliteli ve değerli antika eserleri platformumuza kabul ediyoruz." },
                { icon: Store, title: "Gelenek", desc: "İstanbul'un yüzyıllık antikacılık geleneğini yaşatıyor ve destekliyoruz." },
                { icon: Truck, title: "Özenli Hizmet", desc: "Her ürün özel olarak paketlenir ve sigortalı kargo ile güvenle teslim edilir." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-sm border border-linen-200 hover:border-gold-300 hover:shadow-soft transition-all duration-300 group">
                  <div className="w-12 h-12 bg-linen-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-gold-50 transition-colors">
                    <item.icon className="h-6 w-6 text-olive-800 group-hover:text-gold-700 transition-colors" />
                  </div>
                  <h3 className="font-serif font-medium text-xl text-olive-900 mb-3">{item.title}</h3>
                  <p className="text-espresso-600 font-light text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-olive-900 text-linen-100 p-12 lg:p-16 rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl font-medium text-center mb-12 text-gold-500">Rakamlarla Anticca</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-olive-800/50">
                {[
                  { val: "50+", label: "Antika Dükkanı" },
                  { val: "1000+", label: "Eşsiz Eser" },
                  { val: "5000+", label: "Mutlu Müşteri" },
                  { val: "81", label: "İl'e Teslimat" }
                ].map((stat, idx) => (
                  <div key={idx} className="px-2">
                    <p className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.val}</p>
                    <p className="text-sm uppercase tracking-wider text-olive-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
