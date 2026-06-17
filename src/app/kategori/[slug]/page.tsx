import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory, getProducts, getCategories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori Bulunamadı",
    };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, categories, allProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProducts(),
  ]);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(slug);

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">Anasayfa</Link>
          <span>/</span>
          <Link href="/urunler" className="hover:text-primary">Ürünler</Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
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
                    className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-cream hover:text-primary transition-colors"
                  >
                    Tüm Ürünler
                    <span className="ml-2 text-sm text-gray-500">({allProducts.length})</span>
                  </Link>
                </li>
                {categories.map((cat) => {
                  const count = allProducts.filter(p => p.categorySlug === cat.slug).length;
                  const isActive = cat.slug === slug;
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/kategori/${cat.slug}`}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-white font-medium"
                            : "text-gray-700 hover:bg-cream hover:text-primary"
                        }`}
                      >
                        {cat.name}
                        <span className={`ml-2 text-sm ${isActive ? "opacity-80" : "text-gray-500"}`}>
                          ({count})
                        </span>
                      </Link>

                      {/* Subcategories */}
                      {isActive && cat.subcategories && cat.subcategories.length > 0 && (
                        <ul className="ml-4 mt-1 space-y-1">
                          {cat.subcategories.map((sub) => {
                            const subCount = allProducts.filter(
                              p => p.categorySlug === cat.slug && p.subcategory === sub.slug
                            ).length;
                            return (
                              <li key={sub.slug}>
                                <span className="block px-3 py-1 text-sm text-white/80">
                                  {sub.name} ({subCount})
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Category Header */}
            <div className="mb-8">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              <p className="text-gray-600">{category.description}</p>
              <span className="text-sm text-gray-500 mt-2 block">
                {categoryProducts.length} ürün
              </span>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Bu kategoride henüz ürün bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
