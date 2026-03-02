import { TR } from '../constants/tr';
import SEO from '../components/seo/SEO';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linen-300">
      <SEO
        title="Kullanım Koşulları — Anticca"
        description="Anticca kullanım koşulları ve mesafeli satış sözleşmesi."
        canonical="/terms"
      />
      {/* Header */}
      <div className="bg-espresso-900 text-linen-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Kullanım Koşulları</h1>
          <p className="text-xl text-linen-300">
            Güncel Metin
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 p-8 md:p-12">
          <div className="prose prose-lg max-w-none text-espresso-800">

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">1. Genel Hükümler</h2>
              <p>
                Bu web sitesini (“Site”) ziyaret eden ve/veya kullanan her kullanıcı, aşağıda yer alan kullanım koşullarını kabul etmiş sayılır.
              </p>
              <p>
                Anticca, tamamen online faaliyet gösteren bir platformdur ve herhangi bir fiziki mağaza veya ziyaret edilebilir adresi bulunmamaktadır.
              </p>
              <p>
                Anticca, kullanım koşullarını önceden bildirimde bulunmaksızın güncelleme hakkını saklı tutar. Güncel metin Site üzerinde yayımlandığı tarihten itibaren geçerli olur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">2. Hesap Oluşturma ve Güvenlik</h2>
              <p>
                Site üzerinden alışveriş yapabilmek için kullanıcı hesabı oluşturmanız gerekmektedir.
              </p>
              <p>Kullanıcı:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hesap bilgilerinin doğru ve güncel olmasından,</li>
                <li>Şifresinin güvenliğinden,</li>
                <li>Hesabı üzerinden gerçekleştirilen tüm işlemlerden</li>
              </ul>
              <p className="mt-4">bizzat sorumludur.</p>
              <p>
                Hesap bilgilerinin üçüncü kişilerle paylaşılması halinde doğabilecek sonuçlardan Anticca sorumlu değildir.
              </p>
              <p>
                Şüpheli bir işlem fark edilmesi durumunda derhal <strong>destek@anticca.com.tr</strong> adresine bildirim yapılmalıdır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">3. Ürünler ve Ürün Bilgileri</h2>
              <p>
                Site üzerinde satışa sunulan tüm ürünler antika niteliğindedir.
              </p>
              <p>
                Siteye yüklenen her ürün fotoğrafı gerçek ürüne aittir. Ürün görselleri temsili değildir ve satışı yapılan ürünün kendisini yansıtmaktadır.
              </p>
              <p>Antika ürünlerin doğası gereği:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Yaşa bağlı deformasyon,</li>
                <li>Patina,</li>
                <li>Kullanım izleri,</li>
                <li>Küçük ölçü ve ton farklılıkları</li>
              </ul>
              <p className="mt-4">kusur değil, ürünün karakteristik özellikleridir.</p>
              <p>
                Ürün fiyatları Türk Lirası (TRY) cinsindendir ve aksi belirtilmedikçe geçerli vergileri içerir.
              </p>
              <p>
                Anticca, fiyatlarda teknik hata oluşması halinde siparişi iptal etme hakkını saklı tutar.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">4. Sipariş ve Ödeme</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Site üzerinden verilen sipariş, satın alma teklifidir.</li>
                <li>Siparişler, ödeme onayının alınması sonrasında işleme alınır.</li>
                <li>Ödeme yöntemleri: Kredi kartı, Banka kartı, Havale / EFT</li>
                <li>Sipariş onayı, kullanıcı tarafından belirtilen e-posta adresine gönderilir.</li>
                <li>Anticca, tamamen online bir platform olduğundan yüz yüze ödeme veya kapıda ödeme hizmeti sunmamaktadır.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">5. Kargo ve Teslimat</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sipariş edilen ürünler, uygun ambalaj ve koruma yöntemleri ile gönderilir.</li>
                <li>15.000 TL üzeri alışverişlerde kargo ücretsizdir.</li>
                <li>15.000 TL altındaki siparişlerde kargo ücreti sipariş tutarına ve teslimat adresine göre belirlenir.</li>
                <li>Teslimat süresi, kargo firmasına ve teslimat adresine bağlı olarak değişiklik gösterebilir.</li>
                <li>Teslimat sırasında ürün kontrol edilmeli; hasarlı paketler teslim alınmamalıdır.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">6. İade ve Cayma Hakkı</h2>
              <p>
                6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında tüketicinin cayma hakkı bulunmaktadır.
              </p>
              <p>
                Ürün tesliminden itibaren 14 gün içinde cayma hakkı kullanılabilir.
              </p>
              <p>İade şartları:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ürün, orijinal haliyle,</li>
                <li>Hasarsız,</li>
                <li>Eksiksiz olarak gönderilmelidir.</li>
              </ul>
              <p className="mt-4">
                İade talepleri <strong>destek@anticca.com.tr</strong> adresine yazılı olarak iletilmelidir.
              </p>
              <p>
                İade süreci onaylandıktan sonra yasal süre içerisinde ücret iadesi gerçekleştirilir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">7. Fikri Mülkiyet Hakları</h2>
              <p>
                Site üzerinde yer alan tüm içerik (tasarım, metin, logo, yazılım, görseller vb.) Anticca’ya aittir ve fikri mülkiyet mevzuatı ile korunmaktadır.
              </p>
              <p>
                İzinsiz kopyalama, çoğaltma, dağıtma veya ticari kullanım yasaktır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">8. Sorumluluk Sınırlaması</h2>
              <p>Anticca aşağıdaki durumlardan kaynaklanan zararlardan sorumlu değildir:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mücbir sebepler (doğal afet, savaş, grev vb.)</li>
                <li>İnternet altyapısından kaynaklanan kesintiler</li>
                <li>Kargo firmalarından kaynaklanan gecikmeler</li>
                <li>Kullanıcının hatalı bilgi vermesi</li>
              </ul>
              <p className="mt-4">
                Antika ürünlerin doğası gereği oluşabilecek estetik farklılıklar ayıp kapsamında değerlendirilmez.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">9. Uyuşmazlık Çözümü</h2>
              <p>Uyuşmazlık halinde:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tüketici Hakem Heyetleri</li>
                <li>Tüketici Mahkemeleri</li>
              </ul>
              <p className="mt-4">görevlidir. Türkiye Cumhuriyeti mevzuatı uygulanır.</p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-4">10. İletişim</h2>
              <ul className="list-none space-y-1">
                <li><strong>E-posta:</strong> destek@anticca.com.tr</li>
                <li><strong>Telefon:</strong> 0532 390 15 37</li>
              </ul>
              <p className="mt-4">
                Anticca tamamen online faaliyet göstermektedir ve fiziki ziyaret adresi bulunmamaktadır.
              </p>
            </section>

            <hr className="my-12 border-mist-300" />

            <section className="mb-8">
              <h2 className="font-serif text-3xl font-bold text-espresso-900 mb-6">MESAFELİ SATIŞ SÖZLEŞMESİ</h2>
              <h3 className="text-xl font-bold mb-3">MADDE 1 – TARAFLAR</h3>
              <p><strong>Satıcı:</strong> Anticca</p>
              <p><strong>E-posta:</strong> destek@anticca.com.tr</p>
              <p><strong>Telefon:</strong> 0532 390 15 37</p>
              <p><strong>Faaliyet Modeli:</strong> Tamamen online platform (fiziki mağaza veya ziyaret adresi bulunmamaktadır)</p>
              <p className="mt-4"><strong>Alıcı:</strong> Site üzerinden sipariş veren gerçek veya tüzel kişi.</p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">MADDE 2 – KONU</h3>
              <p>
                İşbu sözleşmenin konusu, Alıcı’nın www.anticca.com.tr internet sitesi üzerinden elektronik ortamda sipariş verdiği antika ürünün satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">MADDE 3 – ÜRÜN BİLGİLERİ</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Satışa sunulan tüm ürünler antika niteliğindedir.</li>
                <li>Siteye yüklenen ürün fotoğrafları gerçek ürüne aittir, temsili değildir.</li>
                <li>Ürünlerde yaşa bağlı izler, patina ve kullanım belirtileri bulunabilir; bunlar kusur sayılmaz.</li>
                <li>Ürün fiyatları Türk Lirası (TRY) cinsindendir.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">MADDE 4 – ÖDEME VE TESLİMAT</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sipariş, ödeme onayı sonrası kesinleşir.</li>
                <li>Ödeme yöntemleri: Kredi kartı, banka kartı, havale/EFT.</li>
                <li>15.000 TL üzeri alışverişlerde kargo ücretsizdir.</li>
                <li>15.000 TL altındaki siparişlerde kargo ücreti ayrıca tahsil edilir.</li>
                <li>Teslimat süresi kargo firmasına bağlı olarak değişebilir.</li>
                <li>Teslim sırasında hasarlı paketler teslim alınmamalıdır.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold mb-3">MADDE 5 – CAYMA HAKKI</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir.</li>
                <li>Cayma hakkı için bildirim <strong>destek@anticca.com.tr</strong> adresine yazılı olarak yapılmalıdır.</li>
                <li>İade edilecek ürün: Orijinal haliyle, Hasarsız, Eksiksiz olarak gönderilmelidir.</li>
                <li>İade onaylandıktan sonra bedel, yasal süre içinde Alıcı’ya iade edilir.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3">MADDE 6 – UYUŞMAZLIK ÇÖZÜMÜ</h3>
              <p>
                Uyuşmazlık halinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri görevlidir. Türkiye Cumhuriyeti mevzuatı uygulanır.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
