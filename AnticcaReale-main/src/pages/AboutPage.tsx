import { Store, Shield, Truck, Award, Gavel, Filter, CreditCard, Smartphone, Search, BookOpen, Clock, MapPin, Star, Box, Palette, Gem, Lamp, Watch, Scroll, Armchair } from 'lucide-react';
import { TR } from '../constants/tr';
import SEO from '../components/seo/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linen-50">
      <SEO
        title="Hakkımızda — Anticca'yı Tanıyın"
        description="Anticca, İstanbul'un en seçkin antikacılarını tek çatı altında buluşturan dijital antika pazar yeri. Misyonumuz ve vizyonumuz."
        canonical="/about"
      />
      {/* Header - Pre-Launch Announcement */}
      <div className="bg-espresso-900 border-b border-espresso-800 py-20 lg:py-32 text-center relative overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block animate-fade-in">Yakında Açılıyor</span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-gold-500 mb-6 drop-shadow-sm">Hakkımızda</h1>
          <p className="text-xl md:text-2xl text-linen-200 font-light italic">
            {TR.siteName} — {TR.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Main Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-espresso-900 prose-p:text-espresso-700 prose-p:leading-relaxed">

          {/* Coming Soon Banner */}
          <section className="mb-16 text-center">
            <div className="inline-flex items-center gap-3 bg-gold-100 border border-gold-300 rounded-full px-6 py-3 mb-8">
              <Clock className="w-5 h-5 text-gold-600" />
              <span className="text-gold-800 font-semibold">Birkaç Hafta İçinde Kapılarımızı Açıyoruz!</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-normal mb-8 relative inline-block text-espresso-900">
              Biz Kimiz?
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gold-300 w-1/2 mx-auto" />
            </h2>
            <p className="text-lg md:text-xl font-light leading-8 text-espresso-700">
              Anticca, İstanbul'un köklü antika geleneğini dijital dünyaya taşıyan yeni nesil bir platformdur.
              2026 yılında kurulan şirketimiz, Türkiye'nin en seçkin antikacılarını ve antika meraklılarını
              bir araya getirme vizyonuyla yola çıkmıştır. Şu anda son hazırlıklarımızı tamamlıyoruz ve
              çok yakında sizlerle buluşacağız!
            </p>
          </section>

          {/* Mission Section */}
          <section className="mb-24 max-w-3xl mx-auto text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-espresso-900">Vizyonumuz</h2>
              <p className="text-espresso-700">
                Misyonumuz, yüzyıllık zanaat geleneğini ve tarihi eserleri koruyarak gelecek nesillere
                aktarmak, aynı zamanda antika koleksiyonerliğini herkes için erişilebilir kılmaktır.
              </p>
              <p className="text-espresso-700">
                Platformumuzda yer alacak her ürün, uzman ekibimiz tarafından titizlikle incelenecek ve
                orijinalliği doğrulanacaktır. Müşterilerimize sadece ürün değil, aynı zamanda her eserin
                ardındaki hikayeyi de sunacağız.
              </p>
            </div>
          </section>


          {/* Platform Features Section */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-espresso-900 mb-4">Platform Özellikleri</h2>
              <p className="text-espresso-600 max-w-2xl mx-auto">Anticca'nın sunduğu tüm özellikler ve hizmetler</p>
              <div className="w-12 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Gavel, title: "Canlı Müzayede", desc: "Açık artırma sistemi ile nadide eserlere teklif verin. Gerçek zamanlı teklif takibi ve otomatik bildirimler." },
                { icon: Filter, title: "Gelişmiş Filtreleme", desc: "Kategori, dönem, fiyat aralığı ve şehir bazlı arama. İstediğiniz eseri kolayca bulun." },
                { icon: Shield, title: "Orijinallik Garantisi", desc: "Tüm ürünler uzman ekibimiz tarafından incelenir ve orijinalliği onaylanır." },
                { icon: CreditCard, title: "Güvenli Ödeme", desc: "SSL şifreli altyapı ile kredi kartı ve havale/EFT ile güvenli ödeme." },
                { icon: Truck, title: "Sigortalı Kargo", desc: "Her ürün özel olarak paketlenir ve sigortalı kargo ile güvenle teslim edilir." },
                { icon: Smartphone, title: "Mobil Uyumlu", desc: "Her cihazdan sorunsuz alışveriş. Responsive tasarım ile mükemmel deneyim." },
                { icon: Store, title: "Seçkin Dükkanlar", desc: "İstanbul'un en köklü antikacılarından özenle seçilmiş mağazalar." },
                { icon: BookOpen, title: "Blog & Hikayeler", desc: "Antika dünyasından haberler, koleksiyon hikayeleri ve uzman görüşleri." },
                { icon: Star, title: "Kalite Standartları", desc: "Sadece en kaliteli ve değerli antika eserleri platformumuza kabul edilir." },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-sm border border-linen-200 hover:border-gold-300 hover:shadow-soft transition-all duration-300 group">
                  <div className="w-12 h-12 bg-espresso-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-gold-500 transition-colors">
                    <item.icon className="h-6 w-6 text-gold-400 group-hover:text-espresso-900 transition-colors" />
                  </div>
                  <h3 className="font-serif font-medium text-lg text-espresso-900 mb-2">{item.title}</h3>
                  <p className="text-espresso-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Categories Section */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-espresso-900 mb-4">Ürün Kategorileri</h2>
              <p className="text-espresso-600 max-w-2xl mx-auto">Geniş yelpazede antika ve vintage ürünler</p>
              <div className="w-12 h-1 bg-gold-400 mx-auto mt-4 rounded-full" />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Armchair, name: "Mobilya" },
                { icon: Box, name: "Seramik" },
                { icon: Gem, name: "Mücevherat" },
                { icon: Scroll, name: "Halı & Kilim" },
                { icon: Palette, name: "Sanat Eserleri" },
                { icon: Lamp, name: "Aydınlatma" },
                { icon: Watch, name: "Saatler" },
                { icon: BookOpen, name: "Nadir Kitaplar" },
              ].map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-linen-100 border border-linen-200 rounded-full px-4 py-2 hover:border-gold-400 hover:bg-gold-50 transition-colors">
                  <cat.icon className="w-4 h-4 text-espresso-700" />
                  <span className="text-espresso-800 text-sm font-medium">{cat.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-espresso-900 mb-4">Değerlerimiz</h2>
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
                    <item.icon className="h-6 w-6 text-espresso-800 group-hover:text-gold-700 transition-colors" />
                  </div>
                  <h3 className="font-serif font-medium text-xl text-espresso-900 mb-3">{item.title}</h3>
                  <p className="text-espresso-600 font-light text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Coming Soon Stats Section */}
          <section className="bg-espresso-900 text-linen-100 p-12 lg:p-16 rounded-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl font-medium text-center mb-4 text-gold-500">Çok Yakında!</h2>
              <p className="text-center text-linen-300 mb-12 max-w-xl mx-auto">
                Şu anda dükkan ve ürün kayıtlarını alıyoruz. Birkaç hafta içinde tüm Türkiye'ye hizmet vermeye başlayacağız.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-espresso-800/50">
                {[
                  { val: "Yakında", label: "Antika Dükkanı" },
                  { val: "Yakında", label: "Eşsiz Eser" },
                  { val: "Hazırlanıyor", label: "Platform" },
                  { val: "81", label: "İl'e Teslimat Hedefi" }
                ].map((stat, idx) => (
                  <div key={idx} className="px-2">
                    <p className="text-2xl lg:text-3xl font-bold text-gold-500 mb-2">{stat.val}</p>
                    <p className="text-xs uppercase tracking-widest text-linen-300/80 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact/Launch Interest */}
          <section className="mt-16 text-center">
            <div className="bg-linen-100 border border-linen-200 rounded-sm p-8 lg:p-12">
              <MapPin className="w-10 h-10 text-gold-600 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-espresso-900 mb-4">İstanbul, Türkiye</h3>
              <p className="text-espresso-600 max-w-lg mx-auto">
                Anticca, İstanbul merkezli olarak tüm Türkiye'ye hizmet verecektir.
                Açılışımızdan haberdar olmak için bizi takip edin!
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
