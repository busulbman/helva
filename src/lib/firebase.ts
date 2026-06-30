import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// ==================== TYPES ====================

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: string | null;
  sort_order: number;
  created_at: Date;
}

export interface DbSubcategoryOrder {
  id: string;
  category_id: string;
  subcategory_name: string;
  subcategory_slug: string;
  sort_order: number;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  subcategory: string | null;
  price: number;
  weight: string;
  short_description: string;
  long_description: string;
  ingredients: string;
  images: string[];
  is_bestseller: boolean;
  is_new: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DbBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  is_active: boolean;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbHomepageImage {
  id: string;
  url: string;
  alt: string;
  type: "hero" | "gallery";
  order: number;
  is_active: boolean;
  created_at: Date;
}

export interface SiteSettings {
  logo_url: string;
  updated_at: Date;
}

// ==================== HELPER ====================

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<DbCategory[]> {
  try {
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);

    const categories = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      sort_order: docSnap.data().sort_order ?? 999,
      created_at: docSnap.data().created_at?.toDate() || new Date(),
    })) as DbCategory[];

    return categories.sort((a, b) => {
      const orderDiff = (a.sort_order ?? 999) - (b.sort_order ?? 999);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name, "tr");
    });
  } catch (error) {
    console.error("[Firebase] Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<DbCategory | null> {
  try {
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
      created_at: docSnap.data().created_at?.toDate() || new Date(),
    } as DbCategory;
  } catch (error) {
    console.error("[Firebase] Error fetching category:", error);
    return null;
  }
}

export async function createCategory(
  category: Omit<DbCategory, "id" | "created_at" | "sort_order"> & { sort_order?: number }
): Promise<DbCategory> {
  try {
    const categoriesRef = collection(db, "categories");
    const docRef = await addDoc(categoriesRef, {
      ...category,
      sort_order: category.sort_order ?? 999,
      created_at: Timestamp.now(),
    });

    return { id: docRef.id, ...category, sort_order: category.sort_order ?? 999, created_at: new Date() };
  } catch (error) {
    console.error("[Firebase] Error creating category:", error);
    throw new Error("Kategori oluşturulamadı");
  }
}

export async function updateCategory(
  id: string,
  category: Partial<DbCategory>
): Promise<void> {
  try {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, category);
  } catch (error) {
    console.error("[Firebase] Error updating category:", error);
    throw new Error("Kategori güncellenemedi");
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("[Firebase] Error deleting category:", error);
    throw new Error("Kategori silinemedi");
  }
}

// ==================== PRODUCTS ====================

export async function getProducts(includeInactive = false): Promise<DbProduct[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    let products = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      images: docSnap.data().images || [],
      created_at: docSnap.data().created_at?.toDate() || new Date(),
      updated_at: docSnap.data().updated_at?.toDate() || new Date(),
    })) as DbProduct[];

    if (!includeInactive) {
      products = products.filter((p) => p.is_active === true);
    }

    return products.sort((a, b) => a.name.localeCompare(b.name, "tr"));
  } catch (error) {
    console.error("[Firebase] Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const product = {
      id: docSnap.id,
      ...docSnap.data(),
      images: docSnap.data().images || [],
      created_at: docSnap.data().created_at?.toDate() || new Date(),
      updated_at: docSnap.data().updated_at?.toDate() || new Date(),
    } as DbProduct;

    return product.is_active ? product : null;
  } catch (error) {
    console.error("[Firebase] Error fetching product:", error);
    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<DbProduct[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("category_id", "==", categoryId));
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      images: docSnap.data().images || [],
      created_at: docSnap.data().created_at?.toDate() || new Date(),
      updated_at: docSnap.data().updated_at?.toDate() || new Date(),
    })) as DbProduct[];

    return products
      .filter((p) => p.is_active === true)
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  } catch (error) {
    console.error("[Firebase] Error fetching products by category:", error);
    return [];
  }
}

export async function createProduct(
  product: Omit<DbProduct, "id" | "created_at" | "updated_at">
): Promise<DbProduct> {
  try {
    const productsRef = collection(db, "products");
    const now = Timestamp.now();

    const productData = {
      name: product.name,
      slug: product.slug,
      category_id: product.category_id,
      subcategory: product.subcategory || null,
      price: product.price || 0,
      weight: product.weight || "",
      short_description: product.short_description || "",
      long_description: product.long_description || "",
      ingredients: product.ingredients || "",
      images: Array.isArray(product.images) ? product.images : [],
      is_bestseller: product.is_bestseller || false,
      is_new: product.is_new || false,
      is_active: product.is_active !== false,
      created_at: now,
      updated_at: now,
    };

    const docRef = await addDoc(productsRef, productData);

    return {
      id: docRef.id,
      ...productData,
      created_at: new Date(),
      updated_at: new Date(),
    };
  } catch (error) {
    console.error("[Firebase] Error creating product:", error);
    throw new Error("Ürün oluşturulamadı");
  }
}

export async function updateProduct(
  id: string,
  product: Partial<DbProduct>
): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    const updateData: Record<string, unknown> = {
      ...product,
      updated_at: Timestamp.now(),
    };

    if (product.images !== undefined) {
      updateData.images = Array.isArray(product.images) ? product.images : [];
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("[Firebase] Error updating product:", error);
    throw new Error("Ürün güncellenemedi");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("[Firebase] Error deleting product:", error);
    throw new Error("Ürün silinemedi");
  }
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  return updateProduct(id, { is_active: isActive });
}

// ==================== BANNERS ====================

export async function getBanners(includeInactive = false): Promise<DbBanner[]> {
  try {
    const bannersRef = collection(db, "banners");
    const snapshot = await getDocs(bannersRef);

    let banners = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      created_at: docSnap.data().created_at?.toDate() || new Date(),
      updated_at: docSnap.data().updated_at?.toDate() || new Date(),
    })) as DbBanner[];

    if (!includeInactive) {
      banners = banners.filter((b) => b.is_active === true);
    }

    return banners.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("[Firebase] Error fetching banners:", error);
    return [];
  }
}

export async function createBanner(
  banner: Omit<DbBanner, "id" | "created_at" | "updated_at">
): Promise<DbBanner> {
  try {
    const bannersRef = collection(db, "banners");
    const now = Timestamp.now();

    const docRef = await addDoc(bannersRef, {
      ...banner,
      created_at: now,
      updated_at: now,
    });

    return { id: docRef.id, ...banner, created_at: new Date(), updated_at: new Date() };
  } catch (error) {
    console.error("[Firebase] Error creating banner:", error);
    throw new Error("Banner oluşturulamadı");
  }
}

export async function updateBanner(
  id: string,
  banner: Partial<DbBanner>
): Promise<void> {
  try {
    const docRef = doc(db, "banners", id);
    await updateDoc(docRef, {
      ...banner,
      updated_at: Timestamp.now(),
    });
  } catch (error) {
    console.error("[Firebase] Error updating banner:", error);
    throw new Error("Banner güncellenemedi");
  }
}

export async function deleteBanner(id: string): Promise<void> {
  try {
    const docRef = doc(db, "banners", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("[Firebase] Error deleting banner:", error);
    throw new Error("Banner silinemedi");
  }
}

// ==================== HOMEPAGE IMAGES ====================

export async function getHomepageImages(type?: "hero" | "gallery"): Promise<DbHomepageImage[]> {
  try {
    const imagesRef = collection(db, "homepage_images");
    const snapshot = await getDocs(imagesRef);

    let images = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      created_at: docSnap.data().created_at?.toDate() || new Date(),
    })) as DbHomepageImage[];

    images = images.filter((img) => img.is_active === true);

    if (type) {
      images = images.filter((img) => img.type === type);
    }

    return images.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("[Firebase] Error fetching homepage images:", error);
    return [];
  }
}

export async function getAllHomepageImages(): Promise<DbHomepageImage[]> {
  try {
    const imagesRef = collection(db, "homepage_images");
    const snapshot = await getDocs(imagesRef);

    const images = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      created_at: docSnap.data().created_at?.toDate() || new Date(),
    })) as DbHomepageImage[];

    return images.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("[Firebase] Error fetching homepage images:", error);
    return [];
  }
}

export async function createHomepageImage(
  image: Omit<DbHomepageImage, "id" | "created_at">
): Promise<DbHomepageImage> {
  try {
    const imagesRef = collection(db, "homepage_images");

    const docRef = await addDoc(imagesRef, {
      ...image,
      created_at: Timestamp.now(),
    });

    return { id: docRef.id, ...image, created_at: new Date() };
  } catch (error) {
    console.error("[Firebase] Error creating homepage image:", error);
    throw new Error("Görsel eklenemedi");
  }
}

export async function updateHomepageImage(
  id: string,
  image: Partial<DbHomepageImage>
): Promise<void> {
  try {
    const docRef = doc(db, "homepage_images", id);
    await updateDoc(docRef, image);
  } catch (error) {
    console.error("[Firebase] Error updating homepage image:", error);
    throw new Error("Görsel güncellenemedi");
  }
}

export async function deleteHomepageImage(id: string): Promise<void> {
  try {
    const docRef = doc(db, "homepage_images", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("[Firebase] Error deleting homepage image:", error);
    throw new Error("Görsel silinemedi");
  }
}

// ==================== SITE SETTINGS ====================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, "settings", "site");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      ...docSnap.data(),
      updated_at: docSnap.data().updated_at?.toDate() || new Date(),
    } as SiteSettings;
  } catch (error) {
    console.error("[Firebase] Error fetching site settings:", error);
    return null;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, "settings", "site");
    await setDoc(
      docRef,
      {
        ...settings,
        updated_at: Timestamp.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("[Firebase] Error updating site settings:", error);
    throw new Error("Ayarlar güncellenemedi");
  }
}

// ==================== IMAGE UPLOAD ====================

export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Görsel yüklenemedi.");
    }

    return result.url;
  } catch (error: unknown) {
    console.error("[Firebase] Error uploading image:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Görsel yüklenemedi. Lütfen tekrar deneyin.");
  }
}

export async function uploadProductImage(file: File, _productSlug: string): Promise<string> {
  return uploadImage(file);
}

export async function uploadCategoryImage(file: File, _categorySlug: string): Promise<string> {
  return uploadImage(file);
}

export async function deleteImage(_url: string): Promise<void> {
  // imgbb doesn't support programmatic deletion without delete URL
}

// ==================== SUBCATEGORY ORDERS ====================

export async function getSubcategoryOrders(categoryId?: string): Promise<DbSubcategoryOrder[]> {
  try {
    const ordersRef = collection(db, "subcategory_orders");
    const snapshot = await getDocs(ordersRef);

    let orders = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as DbSubcategoryOrder[];

    if (categoryId) {
      orders = orders.filter((o) => o.category_id === categoryId);
    }

    return orders.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  } catch (error) {
    console.error("[Firebase] Error fetching subcategory orders:", error);
    return [];
  }
}

export async function setSubcategoryOrder(
  categoryId: string,
  subcategorySlug: string,
  subcategoryName: string,
  sortOrder: number
): Promise<void> {
  try {
    const ordersRef = collection(db, "subcategory_orders");
    const q = query(
      ordersRef,
      where("category_id", "==", categoryId),
      where("subcategory_slug", "==", subcategorySlug)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(ordersRef, {
        category_id: categoryId,
        subcategory_name: subcategoryName,
        subcategory_slug: subcategorySlug,
        sort_order: sortOrder,
      });
    } else {
      const docRef = doc(db, "subcategory_orders", snapshot.docs[0].id);
      await updateDoc(docRef, { sort_order: sortOrder, subcategory_name: subcategoryName });
    }
  } catch (error) {
    console.error("[Firebase] Error setting subcategory order:", error);
    throw new Error("Alt kategori sırası güncellenemedi");
  }
}

export async function updateCategorySortOrder(id: string, sortOrder: number): Promise<void> {
  try {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, { sort_order: sortOrder });
  } catch (error) {
    console.error("[Firebase] Error updating category sort order:", error);
    throw new Error("Kategori sırası güncellenemedi");
  }
}

// ==================== TEST CONNECTION ====================

export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const testRef = collection(db, "_connection_test");
    await getDocs(testRef);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
      return true;
    }
    console.error("[Firebase] Connection test failed:", error);
    return false;
  }
}
