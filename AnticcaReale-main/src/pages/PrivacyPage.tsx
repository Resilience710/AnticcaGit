import { TR } from '../constants/tr';
import SEO from '../components/seo/SEO';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linen-300">
      <SEO
        title="Gizlilik Politikası — Anticca"
        description="Anticca gizlilik politikası ve kişisel verilerin korunması."
        canonical="/privacy"
      />
      {/* Header */}
      <div className="bg-espresso-900 text-linen-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Gizlilik Politikası</h1>
          <p className="text-xl text-linen-300">
            Kişisel Verilerin Korunması ve Gizlilik İlkeleri
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-espresso-800">

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">1. Genel İlkeler</h2>
              <p>
                Anticca, kullanıcılarının kişisel verilerinin gizliliğine önem verir ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında hareket eder.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">2. Toplanan Veriler</h2>
              <p>Aşağıdaki veriler toplanabilir:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ad, soyad</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Teslimat bilgileri</li>
                <li>Ödeme bilgileri (ödeme altyapısı sağlayıcısı aracılığıyla)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">3. Verilerin Kullanım Amaçları</h2>
              <p>Toplanan kişisel veriler:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sipariş işlemlerinin yürütülmesi</li>
                <li>Teslimat organizasyonu</li>
                <li>Müşteri desteği sağlanması</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              </ul>
              <p className="mt-4">amaçlarıyla kullanılır.</p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">4. Veri Güvenliği</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Anticca, kişisel verilerin korunması için teknik ve idari tedbirler almaktadır.</li>
                <li>Ödeme bilgileri doğrudan ödeme altyapı sağlayıcısı üzerinden işlenir; Anticca kredi kartı bilgilerini saklamaz.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">5. Veri Sahibi Hakları</h2>
              <p>KVKK kapsamında kullanıcılar:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verilerinin işlenip işlenmediğini öğrenme</li>
                <li>Yanlış işlenen verilerin düzeltilmesini isteme</li>
                <li>Silinmesini talep etme</li>
              </ul>
              <p className="mt-4">haklarına sahiptir.</p>
              <p>
                Talepler <strong>destek@anticca.com.tr</strong> adresine iletilmelidir.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
