"use client";

import { useState, useEffect } from "react";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadImage,
  DbBanner,
} from "@/lib/firebase";

function isValidImageUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim() !== "";
}

export default function BannersPage() {
  const [banners, setBanners] = useState<DbBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<DbBanner | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    is_active: true,
    order: 0,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    try {
      const data = await getBanners(true);
      setBanners(data);
    } catch (err) {
      setError("Bannerlar yüklenemedi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(banner?: DbBanner) {
    setError(null);
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        description: banner.description,
        image: banner.image,
        is_active: banner.is_active,
        order: banner.order,
      });
      setImagePreview(banner.image || null);
    } else {
      setEditingBanner(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        is_active: true,
        order: banners.length,
      });
      setImagePreview(null);
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ title: "", description: "", image: "", is_active: true, order: 0 });
    setImagePreview(null);
    setError(null);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);

    try {
      const url = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setError("Görsel yüklenemedi.");
      setImagePreview(null);
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, formData);
      } else {
        await createBanner(formData);
      }
      await fetchBanners();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu banner'ı silmek istediğinizden emin misiniz?")) return;

    try {
      await deleteBanner(id);
      await fetchBanners();
    } catch (err) {
      setError("Banner silinemedi.");
      console.error(err);
    }
  }

  async function handleToggleActive(banner: DbBanner) {
    try {
      await updateBanner(banner.id, { is_active: !banner.is_active });
      await fetchBanners();
    } catch (err) {
      setError("Banner güncellenemedi.");
      console.error(err);
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    try {
      await updateBanner(banners[index].id, { order: newIndex });
      await updateBanner(banners[newIndex].id, { order: index });
      await fetchBanners();
    } catch (err) {
      setError("Sıralama güncellenemedi.");
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Bannerlar</h1>
          <p className="text-gray-600 mt-1">Ana sayfada gösterilecek duyuruları yönetin</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Yeni Banner</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Henüz banner eklenmemiş.
            <button onClick={() => openModal()} className="text-primary hover:underline ml-1">
              İlk banner'ı ekleyin
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {banners.map((banner, index) => (
              <div key={banner.id} className={`p-4 flex items-center gap-4 ${!banner.is_active ? "opacity-50" : ""}`}>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleReorder(banner.id, "up")}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(banner.id, "down")}
                    disabled={index === banners.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {isValidImageUrl(banner.image) ? (
                    <img src={banner.image} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{banner.title || "Başlık yok"}</h3>
                  <p className="text-sm text-gray-500 truncate">{banner.description || "Açıklama yok"}</p>
                </div>

                <button
                  onClick={() => handleToggleActive(banner)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    banner.is_active
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {banner.is_active ? "Aktif" : "Pasif"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openModal(banner)}
                    className="p-2 text-gray-400 hover:text-primary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-semibold text-gray-900">
                {editingBanner ? "Banner Düzenle" : "Yeni Banner"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Örn: Yeni Ürün Duyurusu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Banner açıklaması..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
                <div className="flex items-center gap-4">
                  {(isValidImageUrl(imagePreview) || isValidImageUrl(formData.image)) && (
                    <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                        Yükleniyor...
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Görsel Seç</span>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-gray-700">Aktif (Ana sayfada göster)</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? "Kaydediliyor..." : editingBanner ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
