"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getProducts,
  getCategories,
  toggleProductActive,
  deleteProduct,
  updateProduct,
  DbProduct,
  DbCategory,
} from "@/lib/firebase";

function isValidImageUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim() !== "";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(true),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Veriler yüklenirken bir hata oluştu.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  function getCategoryName(categoryId: string): string {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Kategori yok";
  }

  async function handleToggleActive(product: DbProduct) {
    setError(null);
    try {
      await toggleProductActive(product.id, !product.is_active);
      await fetchData();
    } catch (err) {
      setError("Ürün durumu güncellenemedi.");
      console.error("Error:", err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    setError(null);
    try {
      await deleteProduct(id);
      await fetchData();
    } catch (err) {
      setError("Ürün silinemedi.");
      console.error("Error:", err);
    }
  }

  async function handlePriceUpdate(productId: string) {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      setError("Geçerli bir fiyat girin");
      return;
    }

    setError(null);
    try {
      await updateProduct(productId, { price });
      await fetchData();
      setEditingPrice(null);
      setNewPrice("");
    } catch (err) {
      setError("Fiyat güncellenemedi.");
      console.error("Error:", err);
    }
  }

  const filteredProducts = products.filter((p) => {
    if (filter === "active") return p.is_active;
    if (filter === "inactive") return !p.is_active;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-600 mt-1">{products.length} ürün</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Ürün
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tümü ({products.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Aktif ({products.filter((p) => p.is_active).length})
          </button>
          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "inactive"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pasif ({products.filter((p) => !p.is_active).length})
          </button>
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {filter === "all" ? (
              <>
                Henüz ürün eklenmemiş.{" "}
                <Link href="/admin/urunler/yeni" className="text-primary hover:underline">
                  İlk ürünü ekleyin
                </Link>
              </>
            ) : (
              `${filter === "active" ? "Aktif" : "Pasif"} ürün bulunamadı.`
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ürün</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Fiyat</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Durum</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={!product.is_active ? "bg-gray-50" : ""}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {isValidImageUrl(product.images?.[0]) ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-cream">
                              <img
                                src="/assets/logo.png"
                                alt="Logo"
                                className="w-8 h-8 object-contain opacity-50"
                              />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                          <p className="text-sm text-gray-500 md:hidden">{getCategoryName(product.category_id)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{getCategoryName(product.category_id)}</span>
                    </td>
                    <td className="px-4 py-3">
                      {editingPrice === product.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePriceUpdate(product.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditingPrice(null);
                              setNewPrice("");
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPrice(product.id);
                            setNewPrice(product.price.toString());
                          }}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          ₺{product.price}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.is_active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {product.is_active ? "Aktif" : "Pasif"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/urunler/${product.id}`}
                          className="p-2 text-gray-400 hover:text-primary"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
