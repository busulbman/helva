import { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Sipahioğlu Çekme Helva - Geleneksel çekme helva, reçel ve yöresel ürünler. Tüm ürünlerimizi keşfedin.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">Anasayfa</Link>
          <span>/</span>
          <span className="text-gray-900">Tüm Ürünler</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Kategoriler</h2>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/urunler"
                    className="block px-3 py-2 rounded-lg bg-primary text-white font-medium"
                  >
                    Tüm Ürünler
                    <span className="ml-2 text-sm opacity-80">({products.length})</span>
                  </Link>
                </li>
                {categories.map((category) => {
                  const count = products.filter(p => p.categorySlug === category.slug).length;
                  return (
                    <li key={category.id}>
                      <Link
                        href={`/kategori/${category.slug}`}
                        className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-cream hover:text-primary transition-colors"
                      >
                        {category.name}
                        <span className="ml-2 text-sm text-gray-500">({count})</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
                Tüm Ürünler
              </h1>
              <span className="text-gray-600">{products.length} ürün</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
