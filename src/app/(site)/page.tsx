import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { getBanners } from "@/lib/firebase";
import { siteConfig } from "@/data/config";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import BannerSection from "@/components/BannerSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, allProducts, banners] = await Promise.all([
    getCategories(),
    getProducts(),
    getBanners(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm mb-6">
              <span className="w-2 h-2 bg-accent rounded-full" />
              1950'den beri geleneksel lezzet
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {siteConfig.name}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              {siteConfig.slogan}
            </p>

            <p className="text-white/80 mb-8 max-w-lg">
              El emeği göz nuru, geleneksel tariflerle hazırlanan çekme helvalarımızı
              keşfedin. Her lokmada Osmanlı'nın eşsiz lezzeti.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/urunler"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-8 py-4 rounded-lg transition-all hover:-translate-y-0.5"
              >
                Ürünleri Keşfet
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/hakkimizda"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-lg transition-all border border-white/30"
              >
                Hikayemiz
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 w-1/2 h-full hidden lg:block">
          <div className="absolute right-20 bottom-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute right-40 top-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>
      </section>

      {/* Banners Section */}
      {banners.length > 0 && <BannerSection banners={banners} />}

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kategoriler
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Geleneksel tariflerle hazırlanan ürünlerimizi keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Tüm Ürünler
              </h2>
              <p className="text-gray-600">Geleneksel lezzetlerimiz</p>
            </div>
            <Link
              href="/urunler"
              className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Tümünü Gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {allProducts.length > 8 && (
            <div className="text-center mt-8">
              <Link href="/urunler" className="btn-secondary inline-flex items-center gap-2">
                Tüm Ürünleri Gör ({allProducts.length})
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Strip */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Geleneksel Üretim,<br />Eşsiz Lezzet
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Yarım asrı aşkın tecrübemizle, dedelerimizden miras kalan geleneksel tarifleri
                modern hijyen standartlarıyla birleştiriyoruz. Her bir ürünümüz, ustalarımızın
                el emeğiyle özenle hazırlanır.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  %100 Doğal Malzemeler
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Geleneksel El Yapımı Üretim
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Katkı Maddesi Yok
                </li>
              </ul>
              <Link href="/hakkimizda" className="btn-primary inline-flex items-center gap-2">
                Hikayemizi Okuyun
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden relative flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">Geleneksel Üretim</p>
                  <p className="text-sm text-gray-500">El emeği, göz nuru</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 hidden md:block">
                <div className="text-4xl font-serif font-bold text-primary">70+</div>
                <div className="text-gray-600 text-sm">Yıllık Tecrübe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Strip */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-primary rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 text-white">
                <h2 className="font-serif text-3xl font-bold mb-4">Bizi Ziyaret Edin</h2>
                <p className="text-white/80 mb-6">
                  Kastamonu'nun tarihi merkezinde, Nasrullah Camii karşısında sizleri bekliyoruz.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Adres</div>
                      <div className="text-white/80 text-sm">{siteConfig.address.full}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Çalışma Saatleri</div>
                      <div className="text-white/80 text-sm">{siteConfig.workingHours.display}</div>
                      <div className="text-white/60 text-sm">Pazar: {siteConfig.workingHours.sunday}</div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/iletisim"
                  className="inline-flex items-center gap-2 mt-8 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-lg transition-all"
                >
                  İletişim Bilgileri
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="h-64 md:h-auto bg-gradient-to-br from-cream to-secondary relative overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">Kastamonu</p>
                  <p className="text-sm text-gray-500">1950'den beri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
