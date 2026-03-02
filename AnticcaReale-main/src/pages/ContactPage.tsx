import { useState } from 'react';
import { Globe, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SEO from '../components/seo/SEO';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-linen-200">
      <SEO
        title="İletişim — Bize Ulaşın"
        description="Anticca ile iletişime geçin. Tamamen online hizmet veren antika pazar yeri. Destek ve sorularınız için bizimle iletişime geçin."
        canonical="/contact"
      />
      {/* Header */}
      <div className="bg-espresso-900 text-linen-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
          <p className="text-xl text-linen-300">
            Sorularınız için bize ulaşın
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
              Bize Ulaşın
            </h2>
            <p className="text-espresso-700 mb-8">
              Antika alım satım, dükkan başvuruları veya genel sorularınız için
              aşağıdaki kanallardan bize ulaşabilirsiniz.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">Hizmet Modeli</h3>
                  <p className="text-espresso-700">
                    Anticca tamamen online bir platformdur.<br />
                    Fiziksel bir mağazamız bulunmamaktadır.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">Destek Hattı</h3>
                  <p className="text-espresso-700">
                    0532 390 15 37<br />
                    (WhatsApp Desteği Mevcuttur)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">E-posta</h3>
                  <p className="text-espresso-700">
                    destek@anticca.com.tr
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-gold-800" />
                </div>
                <div>
                  <h3 className="font-semibold text-espresso-900 mb-1">Online Destek</h3>
                  <p className="text-espresso-700">
                    Haftanın her günü:<br />
                    10:00 - 19:00
                  </p>
                </div>
              </div>
            </div>

            {/* Service Guarantee Placeholder */}
            <div className="mt-8 bg-linen-100 rounded-xl h-64 flex items-center justify-center border border-dashed border-espresso-200">
              <div className="text-center text-espresso-500 max-w-sm px-6">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h4 className="font-semibold mb-2">Güvenli Online Deneyim</h4>
                <p className="text-xs">Anticca, platform üzerinden tüm alışveriş süreçlerinizi güvence altına alır.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-linen-300 p-8">
              <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
                Mesaj Gönderin
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-espresso-900 mb-2">
                    Mesajınız Alındı!
                  </h3>
                  <p className="text-espresso-700 mb-6">
                    En kısa sürede size dönüş yapacağız.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    Yeni Mesaj Gönder
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Adınız Soyadınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ahmet Yılmaz"
                  />

                  <Input
                    label="E-posta Adresiniz"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="ornek@email.com"
                  />

                  <Input
                    label="Konu"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="Mesajınızın konusu"
                  />

                  <div>
                    <label className="block text-sm font-medium text-espresso-800 mb-1">
                      Mesajınız
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      placeholder="Mesajınızı buraya yazın..."
                      className="w-full px-4 py-2.5 rounded-lg border border-linen-300 focus:border-espresso-600 focus:ring-2 focus:ring-espresso-200 bg-linen-50"
                    />
                  </div>

                  <Button type="submit" className="w-full" loading={loading}>
                    <Send className="h-5 w-5 mr-2" />
                    Gönder
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div className="mt-8 bg-white rounded-xl p-6 border border-linen-300">
              <h3 className="font-semibold text-espresso-900 mb-4">Sık Sorulan Sorular</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-espresso-800">Ürün iadesi yapabilir miyim?</p>
                  <p className="text-espresso-700">Evet, 14 gün içinde iade hakkınız bulunmaktadır.</p>
                </div>
                <div>
                  <p className="font-medium text-espresso-800">Kargo ücreti ne kadar?</p>
                  <p className="text-espresso-700">500 TL üzeri siparişlerde kargo ücretsizdir.</p>
                </div>
                <div>
                  <p className="font-medium text-espresso-800">Dükkanımı nasıl ekleyebilirim?</p>
                  <p className="text-espresso-700">Bizimle iletişime geçerek başvuru yapabilirsiniz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
