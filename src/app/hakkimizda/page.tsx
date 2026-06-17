import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/data/config";
import ProductImage from "@/components/ProductImage";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Sipahioğlu Çekme Helva - 1950'den beri geleneksel el yapımı çekme helva üretimi. Hikayemiz ve değerlerimiz.",
};

export default function AboutPage() {
  return (
    <div className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary">Anasayfa</Link>
          <span>/</span>
          <span className="text-gray-900">Hakkımızda</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hikayemiz
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {siteConfig.slogan}
          </p>
        </div>

        {/* Main Image */}
        <div className="aspect-video rounded-2xl bg-cream overflow-hidden relative mb-12">
          <ProductImage
            src="/images/products/karisik-paket.jpg"
            alt="Sipahioğlu Çekme Helva - Geleneksel üretim"
            fill
            sizes="100vw"
            priority
          />
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Geleneğin Mirası
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Sipahioğlu Çekme Helva, 1950'li yıllardan bu yana Kastamonu'nun geleneksel lezzetlerini
            yaşatmaktadır. Dedelerimizden miras kalan tarifler ve üretim teknikleri, bugün de aynı
            özenle devam ettirilmektedir.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Çekme helva, Osmanlı mutfağının en değerli tatlılarından biridir. Tahin, şeker ve un'un
            ustalıkla bir araya getirilmesiyle elde edilen bu eşsiz lezzet, sabırla ve özenle
            "çekilerek" hazırlanır. Bu işlem, ürüne karakteristik ipeksi dokusunu ve eşsiz tadını
            kazandırır.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-12">
            <div className="bg-cream rounded-xl p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
                %100 Doğal
              </h3>
              <p className="text-gray-600">
                Tüm ürünlerimiz katkı maddesi içermez. Sadece doğal malzemeler kullanılır.
              </p>
            </div>

            <div className="bg-cream rounded-xl p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
                El Yapımı
              </h3>
              <p className="text-gray-600">
                Her ürün, ustalarımızın el emeğiyle özenle hazırlanır.
              </p>
            </div>

            <div className="bg-cream rounded-xl p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
                70+ Yıllık Tecrübe
              </h3>
              <p className="text-gray-600">
                Yarım asrı aşkın deneyimle geleneksel lezzetleri yaşatıyoruz.
              </p>
            </div>

            <div className="bg-cream rounded-xl p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">
                Kastamonu'nun Kalbi
              </h3>
              <p className="text-gray-600">
                Tarihi Nasrullah Camii karşısında, şehrin merkezinde hizmet veriyoruz.
              </p>
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Üretim Sürecimiz
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Çekme helva üretimi, sabır ve ustalık gerektiren geleneksel bir sanattır. Öncelikle
            kaliteli tahin, şeker ve un doğru oranlarda karıştırılır. Ardından bu karışım, uygun
            sıcaklığa getirilerek "çekme" işlemine hazır hale gelir.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Çekme işlemi, helvanın karakteristik dokusunu oluşturan en kritik aşamadır. Ustalarımız,
            yıllarca süren deneyimleriyle bu işlemi mükemmel bir şekilde gerçekleştirir. Sonuç,
            ağızda eriyen, ipeksi dokusu ve eşsiz lezzetiyle gerçek bir çekme helvadır.
          </p>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Kalite Anlayışımız
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            Kalite, bizim için taviz vermediğimiz bir değerdir. Malzeme seçiminden son paketlemeye
            kadar her aşamada en yüksek standartları uygularız. Tüm ürünlerimiz hijyenik koşullarda
            üretilir ve taze olarak müşterilerimize ulaştırılır.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center text-white mt-12">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Ürünlerimizi Keşfedin
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Geleneksel tariflerle hazırlanan çekme helvalarımızı ve diğer ürünlerimizi inceleyin.
          </p>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-8 py-4 rounded-lg transition-all"
          >
            Ürünlere Göz At
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
