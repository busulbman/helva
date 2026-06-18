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
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAaGguIv1OK9-BaMfp5yAbVBv9zmf9M8UQ",
  authDomain: "sipahioglu-helva-c4aec.firebaseapp.com",
  projectId: "sipahioglu-helva-c4aec",
  storageBucket: "sipahioglu-helva-c4aec.firebasestorage.app",
  messagingSenderId: "1032412472187",
  appId: "1:1032412472187:web:4f8d7230911e88ac1c53de",
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const storage = getStorage(app);

// Types
export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: string | null;
  created_at: Date;
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

// Helper to generate slug
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
    const q = query(categoriesRef, orderBy("name"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date(),
    })) as DbCategory[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<DbCategory | null> {
  try {
    const categoriesRef = collection(db, "categories");
    const q = query(categoriesRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date(),
    } as DbCategory;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export async function createCategory(
  category: Omit<DbCategory, "id" | "created_at">
): Promise<DbCategory> {
  try {
    const categoriesRef = collection(db, "categories");
    const docRef = await addDoc(categoriesRef, {
      ...category,
      created_at: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...category,
      created_at: new Date(),
    };
  } catch (error) {
    console.error("Error creating category:", error);
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
    console.error("Error updating category:", error);
    throw new Error("Kategori güncellenemedi");
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Kategori silinemedi");
  }
}

// ==================== PRODUCTS ====================

export async function getProducts(includeInactive = false): Promise<DbProduct[]> {
  try {
    const productsRef = collection(db, "products");
    let q;

    if (includeInactive) {
      q = query(productsRef, orderBy("name"));
    } else {
      q = query(productsRef, where("is_active", "==", true), orderBy("name"));
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date(),
      updated_at: doc.data().updated_at?.toDate() || new Date(),
    })) as DbProduct[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("slug", "==", slug),
      where("is_active", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date(),
      updated_at: doc.data().updated_at?.toDate() || new Date(),
    } as DbProduct;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<DbProduct[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("category_id", "==", categoryId),
      where("is_active", "==", true),
      orderBy("name")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate() || new Date(),
      updated_at: doc.data().updated_at?.toDate() || new Date(),
    })) as DbProduct[];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function createProduct(
  product: Omit<DbProduct, "id" | "created_at" | "updated_at">
): Promise<DbProduct> {
  try {
    const productsRef = collection(db, "products");
    const now = Timestamp.now();

    const docRef = await addDoc(productsRef, {
      ...product,
      created_at: now,
      updated_at: now,
    });

    return {
      id: docRef.id,
      ...product,
      created_at: new Date(),
      updated_at: new Date(),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Ürün oluşturulamadı");
  }
}

export async function updateProduct(
  id: string,
  product: Partial<DbProduct>
): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, {
      ...product,
      updated_at: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Ürün güncellenemedi");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Ürün silinemedi");
  }
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<void> {
  return updateProduct(id, { is_active: isActive });
}

// ==================== STORAGE ====================

export async function uploadImage(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Görsel yüklenemedi. Lütfen tekrar deneyin.");
  }
}

export async function uploadProductImage(file: File, productSlug: string): Promise<string> {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `products/${productSlug}/${timestamp}.${extension}`;
  return uploadImage(file, path);
}

export async function uploadCategoryImage(file: File, categorySlug: string): Promise<string> {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `categories/${categorySlug}/${timestamp}.${extension}`;
  return uploadImage(file, path);
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

// ==================== TEST CONNECTION ====================

export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const categoriesRef = collection(db, "categories");
    await getDocs(query(categoriesRef));
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    return false;
  }
}
