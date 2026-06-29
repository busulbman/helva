"use client";

import { useState, useEffect } from "react";
import {
  getAllHomepageImages,
  createHomepageImage,
  updateHomepageImage,
  deleteHomepageImage,
  uploadImage,
  DbHomepageImage,
} from "@/lib/firebase";

function isValidImageUrl(url: string | null | undefined): url is string {
  return typeof url === "string" && url.trim() !== "";
}

export default function HomepageImagesPage() {
  const [images, setImages] = useState<DbHomepageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"hero" | "gallery">("hero");

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const data = await getAllHomepageImages();
      setImages(data);
    } catch (err) {
      setError("Görseller yüklenemedi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "gallery") {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const typeImages = images.filter((img) => img.type === type);
    let currentOrder = typeImages.length;

    for (const file of Array.from(files)) {
      try {
        const url = await uploadImage(file);
        await createHomepageImage({
          url,
          alt: file.name.replace(/\.[^/.]+$/, ""),
          type,
          order: currentOrder++,
          is_active: true,
        });
      } catch (err) {
        setError(`"${file.name}" yüklenemedi.`);
        console.error(err);
      }
    }

    await fetchImages();
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu görseli silmek istediğinizden emin misiniz?")) return;

    try {
      await deleteHomepageImage(id);
      await fetchImages();
    } catch (err) {
      setError("Görsel silinemedi.");
      console.error(err);
    }
  }

  async function handleToggleActive(image: DbHomepageImage) {
    try {
      await updateHomepageImage(image.id, { is_active: !image.is_active });
      await fetchImages();
    } catch (err) {
      setError("Görsel güncellenemedi.");
      console.error(err);
    }
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const typeImages = images.filter((img) => img.type === activeTab);
    const index = typeImages.findIndex((img) => img.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= typeImages.length) return;

    try {
      await updateHomepageImage(typeImages[index].id, { order: newIndex });
      await updateHomepageImage(typeImages[newIndex].id, { order: index });
      await fetchImages();
    } catch (err) {
      setError("Sıralama güncellenemedi.");
      console.error(err);
    }
  }

  const heroImages = images.filter((img) => img.type === "hero");
  const galleryImages = images.filter((img) => img.type === "gallery");
  const currentImages = activeTab === "hero" ? heroImages : galleryImages;

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
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Ana Sayfa Görselleri</h1>
        <p className="text-gray-600 mt-1">Hero ve galeri görsellerini yönetin</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "hero"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Hero Görseli ({heroImages.length})
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "gallery"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Galeri Görselleri ({galleryImages.length})
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
        {activeTab === "hero" ? (
          <p><strong>Hero Görseli:</strong> Ana sayfanın üst kısmında büyük olarak görünen ana görsel.</p>
        ) : (
          <p><strong>Galeri Görselleri:</strong> Ana sayfada slider veya galeri olarak gösterilen görseller.</p>
        )}
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple={activeTab === "gallery"}
            onChange={(e) => handleImageUpload(e, activeTab)}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              Yükleniyor...
            </div>
          ) : (
            <div className="text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-lg font-medium">
                {activeTab === "hero" ? "Hero görseli yükle" : "Galeri görselleri yükle"}
              </span>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, WEBP - Birden fazla seçebilirsiniz</p>
            </div>
          )}
        </label>
      </div>

      {/* Images List */}
      <div className="bg-white rounded-xl shadow-sm">
        {currentImages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {activeTab === "hero" ? "Hero görseli eklenmemiş." : "Galeri görseli eklenmemiş."}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {currentImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative group rounded-lg overflow-hidden border-2 ${
                  image.is_active ? "border-green-500" : "border-gray-200 opacity-50"
                }`}
              >
                <div className="aspect-video bg-gray-100">
                  {isValidImageUrl(image.url) ? (
                    <img
                      src={image.url}
                      alt={image.alt || "Görsel"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleReorder(image.id, "up")}
                    disabled={index === 0}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToggleActive(image)}
                    className={`p-2 rounded-full ${
                      image.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleReorder(image.id, "down")}
                    disabled={index === currentImages.length - 1}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Order Badge */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
