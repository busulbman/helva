"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory, DisplayProduct } from "@/lib/data";
import { generateWhatsAppLink, generateOrderMessage } from "@/data/config";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<DisplayProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      const productData = await getProductBySlug(slug);
      if (!productData) {
        notFound();
        return;
      }
      setProduct(productData);

      const related = await getProductsByCategory(productData.categorySlug);
      setRelatedProducts(related.filter((p) => p.id !== productData.id).slice(0, 4));
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const whatsappLink = generateWhatsAppLink(
    generateOrderMessage(product.name, quantity)
  );

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary">
            Anasayfa
          </Link>
          <span>/</span>
          <Link href="/urunler" className="hover:text-primary">
            Ürünler
          </Link>
          <span>/</span>
          <Link
            href={`/kategori/${product.categorySlug}`}
            className="hover:text-primary"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-cream mb-4 relative">
              <ProductImage
                src={product.images?.[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isBestseller && (
                  <span className="bg-accent text-white text-sm font-medium px-3 py-1 rounded">
                    Çok Satan
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded">
                    Yeni
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden relative bg-cream ${
                      selectedImage === index
                        ? "ring-2 ring-primary"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-4">
              <Link
                href={`/kategori/${product.categorySlug}`}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                {product.category}
              </Link>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-gray-600 mb-6">{product.shortDescription}</p>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                ₺{product.price}
              </span>
              <span className="text-gray-500">/ {product.weight}</span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adet
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="w-12 text-center text-xl font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* WhatsApp Order Button */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center text-lg py-4 mb-6"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp'tan Sipariş Ver
            </a>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Ürün Açıklaması
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Gramaj</h4>
                  <p className="text-gray-900">{product.weight}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Kategori</h4>
                  <p className="text-gray-900">{product.category}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  İçindekiler
                </h4>
                <p className="text-gray-900">{product.ingredients}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
              Benzer Ürünler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
