"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  getProducts,
  createProduct,
  uploadImage,
  generateSlug,
  DbCategory,
  DbProduct,
} from "@/lib/firebase";

interface ScannedProduct {
  fileName: string;
  productName: string;
  imagePath: string;
  slug: string;
  selected: boolean;
  status: "pending" | "uploading" | "success" | "error" | "duplicate";
  error?: string;
}

export default function BulkImportPage() {
  const [products, setProducts] = useState<ScannedProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [existingProducts, setExistingProducts] = useState<DbProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    success: number;
    failed: number;
    duplicates: number;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, existingData] = await Promise.all([
        getCategories(),
        getProducts(true),
      ]);
      setCategories(categoriesData);
      setExistingProducts(existingData);

      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].id);
      }

      const response = await fetch("/api/scan-products");
      const data = await response.json();

      if (data.files) {
        const existingSlugs = new Set(existingData.map((p) => p.slug));

        const scanned = data.files.map((file: ScannedProduct) => ({
          ...file,
          selected: !existingSlugs.has(file.slug),
          status: existingSlugs.has(file.slug) ? "duplicate" : "pending",
        }));
        setProducts(scanned);
      }
    } catch (err) {
      setError("Veriler yüklenirken hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleProduct(index: number) {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index && p.status !== "duplicate"
          ? { ...p, selected: !p.selected }
          : p
      )
    );
  }

  function selectAll() {
    setProducts((prev) =>
      prev.map((p) =>
        p.status !== "duplicate" ? { ...p, selected: true } : p
      )
    );
  }

  function deselectAll() {
    setProducts((prev) => prev.map((p) => ({ ...p, selected: false })));
  }

  function updateProductName(index: number, newName: string) {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, productName: newName, slug: generateSlug(newName) }
          : p
      )
    );
  }

  async function handleImport() {
    if (!selectedCategory) {
      setError("Lütfen bir kategori seçin.");
      return;
    }

    const selectedProducts = products.filter(
      (p) => p.selected && p.status === "pending"
    );

    if (selectedProducts.length === 0) {
      setError("Aktarılacak ürün seçilmedi.");
      return;
    }

    setImporting(true);
    setError(null);
    setResult(null);

    let successCount = 0;
    let failedCount = 0;
    const duplicateCount = products.filter((p) => p.status === "duplicate").length;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      if (!product.selected || product.status !== "pending") continue;

      setProducts((prev) =>
        prev.map((p, idx) =>
          idx === i ? { ...p, status: "uploading" } : p
        )
      );

      try {
        const imageResponse = await fetch(product.imagePath);
        const imageBlob = await imageResponse.blob();
        const imageFile = new File([imageBlob], product.fileName, {
          type: imageBlob.type,
        });

        const timestamp = Date.now();
        const extension = product.fileName.split(".").pop() || "jpg";
        const storagePath = `products/${product.slug}/${timestamp}.${extension}`;
        const imageUrl = await uploadImage(imageFile, storagePath);

        await createProduct({
          name: product.productName,
          slug: product.slug,
          category_id: selectedCategory,
          subcategory: null,
          price: 0,
          weight: "",
          short_description: `Geleneksel ${product.productName} - Sipahioğlu Çekme Helva`,
          long_description: `${product.productName}, özenle seçilmiş malzemelerle geleneksel yöntemlerle hazırlanmaktadır. El emeği ile üretilen bu ürün, damak zevkinize hitap edecek eşsiz bir lezzet sunmaktadır.`,
          ingredients: "",
          images: [imageUrl],
          is_bestseller: false,
          is_new: true,
          is_active: true,
        });

        setProducts((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: "success" } : p
          )
        );
        successCount++;
      } catch (err) {
        console.error(`Error importing ${product.fileName}:`, err);
        setProducts((prev) =>
          prev.map((p, idx) =>
            idx === i
              ? {
                  ...p,
                  status: "error",
                  error: err instanceof Error ? err.message : "Bilinmeyen hata",
                }
              : p
          )
        );
        failedCount++;
      }
    }

    setResult({
      success: successCount,
      failed: failedCount,
      duplicates: duplicateCount,
    });
    setImporting(false);
  }

  const selectedCount = products.filter(
    (p) => p.selected && p.status === "pending"
  ).length;
  const duplicateCount = products.filter((p) => p.status === "duplicate").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
          Toplu Ürün Aktarımı
        </h1>
        <p className="text-gray-600 mt-1">
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            public/assets/products
          </code>{" "}
          klasöründeki görselleri Firebase&apos;e aktarın.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            Aktarım Tamamlandı
          </h3>
          <ul className="text-green-700 space-y-1">
            <li>✅ {result.success} ürün başarıyla aktarıldı</li>
            {result.failed > 0 && (
              <li>❌ {result.failed} ürün aktarılamadı</li>
            )}
            {result.duplicates > 0 && (
              <li>⚠️ {result.duplicates} ürün zaten mevcut (atlandı)</li>
            )}
          </ul>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Görsel Bulunamadı
          </h2>
          <p className="text-gray-600 mb-4">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              public/assets/products
            </code>{" "}
            klasörüne görsel ekleyin ve sayfayı yenileyin.
          </p>
          <p className="text-sm text-gray-500">
            Dosya adı formatı: <code>fistikli-cekme-helva.jpg</code>
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Seçin
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={importing}
                >
                  <option value="">Kategori seçin...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={selectAll}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  disabled={importing}
                >
                  Tümünü Seç
                </button>
                <button
                  onClick={deselectAll}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  disabled={importing}
                >
                  Seçimi Kaldır
                </button>
                <button
                  onClick={fetchData}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  disabled={importing}
                >
                  Yenile
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {selectedCount} ürün seçili
                {duplicateCount > 0 && (
                  <span className="text-yellow-600 ml-2">
                    ({duplicateCount} zaten mevcut)
                  </span>
                )}
              </div>

              <button
                onClick={handleImport}
                disabled={importing || selectedCount === 0 || !selectedCategory}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  importing || selectedCount === 0 || !selectedCategory
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Aktarılıyor...
                  </>
                ) : (
                  <>
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Tümünü Firebase&apos;e Aktar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div
                key={product.fileName}
                className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-colors ${
                  product.status === "duplicate"
                    ? "border-yellow-300 opacity-60"
                    : product.status === "success"
                    ? "border-green-500"
                    : product.status === "error"
                    ? "border-red-500"
                    : product.selected
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.imagePath}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />

                  {product.status === "duplicate" ? (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Mevcut
                    </div>
                  ) : product.status === "success" ? (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      ✓ Aktarıldı
                    </div>
                  ) : product.status === "error" ? (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      ✗ Hata
                    </div>
                  ) : product.status === "uploading" ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleProduct(index)}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        product.selected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-gray-300"
                      }`}
                      disabled={importing}
                    >
                      {product.selected && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                <div className="p-3">
                  <input
                    type="text"
                    value={product.productName}
                    onChange={(e) => updateProductName(index, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={
                      importing ||
                      product.status === "duplicate" ||
                      product.status === "success"
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {product.fileName}
                  </p>
                  {product.status === "error" && product.error && (
                    <p className="text-xs text-red-600 mt-1">{product.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
