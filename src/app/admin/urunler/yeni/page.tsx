"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCategories,
  createProduct,
  uploadProductImage,
  generateSlug,
  DbCategory,
} from "@/lib/firebase";

interface ImageUpload {
  id: string;
  file?: File;
  url?: string;
  uploading: boolean;
  preview: string;
  error?: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    subcategory: "",
    price: "",
    weight: "",
    short_description: "",
    long_description: "",
    ingredients: "",
    is_bestseller: false,
    is_new: false,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError("Kategoriler yüklenemedi.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageUpload[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      uploading: false,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  }

  async function uploadImage(imageUpload: ImageUpload, productSlug: string) {
    if (!imageUpload.file) return;

    setImages((prev) =>
      prev.map((img) =>
        img.id === imageUpload.id ? { ...img, uploading: true, error: undefined } : img
      )
    );

    try {
      const url = await uploadProductImage(imageUpload.file, productSlug);
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageUpload.id ? { ...img, url, uploading: false } : img
        )
      );
      return url;
    } catch (err) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageUpload.id
            ? { ...img, uploading: false, error: "Yüklenemedi" }
            : img
        )
      );
      console.error("Image upload error:", err);
      return null;
    }
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Ürün adı gerekli");
      return;
    }

    if (!formData.category_id) {
      setError("Lütfen bir kategori seçin");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Geçerli bir fiyat girin");
      return;
    }

    setSaving(true);

    try {
      const productSlug = generateSlug(formData.name);

      // Upload all images
      const imageUrls: string[] = [];
      for (const img of images) {
        if (img.url) {
          imageUrls.push(img.url);
        } else if (img.file) {
          const url = await uploadImage(img, productSlug);
          if (url) imageUrls.push(url);
        }
      }

      await createProduct({
        name: formData.name,
        slug: productSlug,
        category_id: formData.category_id,
        subcategory: formData.subcategory || null,
        price: parseFloat(formData.price) || 0,
        weight: formData.weight,
        short_description: formData.short_description,
        long_description: formData.long_description,
        ingredients: formData.ingredients,
        images: imageUrls,
        is_bestseller: formData.is_bestseller,
        is_new: formData.is_new,
        is_active: true,
      });

      router.push("/admin/urunler");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ürün eklenemedi. Lütfen tekrar deneyin.");
      console.error("Error:", err);
    } finally {
      setSaving(false);
    }
  }

  const parentCategories = categories.filter((c) => !c.parent_id);
  const selectedCategory = categories.find((c) => c.id === formData.category_id);
  const subcategories = selectedCategory
    ? categories.filter((c) => c.parent_id === selectedCategory.id)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/urunler"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Yeni Ürün</h1>
          <p className="text-gray-600 mt-1">Yeni bir ürün ekleyin</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Örn: Sade Çekme Helva"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori *
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value, subcategory: "" }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Kategori seçin</option>
                  {parentCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Kategori
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="">Alt kategori seçin</option>
                    {subcategories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gramaj / Ağırlık
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="500g"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Açıklamalar</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kısa Açıklama
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Ürün listesinde görünecek kısa açıklama"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uzun Açıklama
              </label>
              <textarea
                rows={4}
                value={formData.long_description}
                onChange={(e) => setFormData((prev) => ({ ...prev, long_description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                placeholder="Ürün detay sayfasında görünecek detaylı açıklama"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçindekiler
              </label>
              <input
                type="text"
                value={formData.ingredients}
                onChange={(e) => setFormData((prev) => ({ ...prev, ingredients: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Tahin, şeker, un, su"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Görseller</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={img.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
                {img.url && !img.uploading && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-6 h-6 text-green-500 bg-white rounded-full" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {img.error && (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                    <span className="text-white text-xs">{img.error}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-500">Görsel Ekle</span>
            </label>
          </div>

          <p className="text-sm text-gray-500">
            PNG veya JPG formatında görseller yükleyebilirsiniz. Görseller Firebase Storage'a yüklenir.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Özellikler</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_bestseller}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_bestseller: e.target.checked }))}
                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-gray-700">Çok Satan (bestseller etiketi göster)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_new}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_new: e.target.checked }))}
                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-gray-700">Yeni Ürün (yeni etiketi göster)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/urunler"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 text-center hover:bg-gray-50 transition-colors"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            )}
            {saving ? "Kaydediliyor..." : "Ürünü Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
