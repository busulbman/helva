"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  generateSlug,
  updateCategorySortOrder,
  DbCategory,
} from "@/lib/firebase";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Kategoriler yüklenirken bir hata oluştu.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(category?: DbCategory) {
    setError(null);
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        parent_id: category.parent_id || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "", parent_id: "" });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", parent_id: "" });
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const slug = generateSlug(formData.name);
      const categoryData = {
        name: formData.name,
        slug,
        description: formData.description,
        image: "",
        parent_id: formData.parent_id || null,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }

      await fetchCategories();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      console.error("Error saving category:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;

    setError(null);
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      setError("Kategori silinemedi. Bu kategoriye ait ürünler olabilir.");
      console.error("Error deleting category:", err);
    }
  }

  async function handleMoveCategory(category: DbCategory, direction: "up" | "down") {
    setMovingId(category.id);
    setError(null);

    try {
      const isParent = !category.parent_id;
      const siblings = isParent
        ? categories.filter((c) => !c.parent_id)
        : categories.filter((c) => c.parent_id === category.parent_id);

      const currentIndex = siblings.findIndex((c) => c.id === category.id);
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= siblings.length) {
        setMovingId(null);
        return;
      }

      const targetCategory = siblings[targetIndex];
      const currentOrder = category.sort_order ?? 999;
      const targetOrder = targetCategory.sort_order ?? 999;

      await updateCategorySortOrder(category.id, targetOrder);
      await updateCategorySortOrder(targetCategory.id, currentOrder);

      await fetchCategories();
    } catch (err) {
      setError("Sıralama güncellenirken hata oluştu.");
      console.error("Error moving category:", err);
    } finally {
      setMovingId(null);
    }
  }

  async function handleInitializeSortOrders() {
    setError(null);
    try {
      const parentCategories = categories.filter((c) => !c.parent_id);
      for (let i = 0; i < parentCategories.length; i++) {
        await updateCategorySortOrder(parentCategories[i].id, i * 10);
      }

      for (const parent of parentCategories) {
        const subs = categories.filter((c) => c.parent_id === parent.id);
        for (let i = 0; i < subs.length; i++) {
          await updateCategorySortOrder(subs[i].id, i * 10);
        }
      }

      await fetchCategories();
    } catch (err) {
      setError("Sıralama başlatılırken hata oluştu.");
      console.error("Error initializing sort orders:", err);
    }
  }

  const parentCategories = categories.filter((c) => !c.parent_id);
  const getSubcategories = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);

  const needsInitialization = categories.some((c) => c.sort_order === undefined || c.sort_order === 999);

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
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">Kategoriler</h1>
          <p className="text-gray-600 mt-1">Ürün kategorilerinizi yönetin ve sıralayın</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Yeni Kategori</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Initialize Sort Orders Button */}
      {needsInitialization && categories.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
          <p className="text-yellow-800 text-sm">
            Bazı kategorilerde sıralama değeri bulunmuyor. Sıralama sistemini başlatmak ister misiniz?
          </p>
          <button
            onClick={handleInitializeSortOrders}
            className="ml-4 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Sıralamayı Başlat
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Henüz kategori eklenmemiş.
            <button onClick={() => openModal()} className="text-primary hover:underline ml-1">
              İlk kategoriyi ekleyin
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {parentCategories.map((category, catIndex) => {
              const subs = getSubcategories(category.id);
              return (
                <div key={category.id}>
                  {/* Parent Category */}
                  <div className="p-4 flex items-center gap-4">
                    {/* Sort Order Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveCategory(category, "up")}
                        disabled={catIndex === 0 || movingId === category.id}
                        className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Yukarı Taşı"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMoveCategory(category, "down")}
                        disabled={catIndex === parentCategories.length - 1 || movingId === category.id}
                        className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Aşağı Taşı"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{category.description}</p>
                      <span className="text-xs text-gray-400">Sıra: {category.sort_order ?? 999}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(category)}
                        className="p-2 text-gray-400 hover:text-primary"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {subs.map((sub, subIndex) => (
                    <div key={sub.id} className="p-4 pl-12 flex items-center gap-4 bg-gray-50">
                      {/* Sort Order Buttons for Subcategories */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveCategory(sub, "up")}
                          disabled={subIndex === 0 || movingId === sub.id}
                          className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Yukarı Taşı"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMoveCategory(sub, "down")}
                          disabled={subIndex === subs.length - 1 || movingId === sub.id}
                          className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Aşağı Taşı"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-700">{sub.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{sub.description}</p>
                        <span className="text-xs text-gray-400">Sıra: {sub.sort_order ?? 999}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(sub)}
                          className="p-2 text-gray-400 hover:text-primary"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-semibold text-gray-900">
                {editingCategory ? "Kategori Düzenle" : "Yeni Kategori"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Örn: Çekme Helva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Kategori açıklaması..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Üst Kategori (Alt kategori için)
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Ana Kategori (Üst kategori yok)</option>
                  {parentCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
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
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? "Kaydediliyor..." : editingCategory ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
