import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidUrl = supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://");

export const supabase: SupabaseClient | null = isValidUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!supabase;

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: string | null;
  created_at: string;
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
  created_at: string;
  updated_at: string;
}

export async function getCategories(): Promise<DbCategory[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function getProducts(includeInactive = false): Promise<DbProduct[]> {
  if (!supabase) return [];

  let query = supabase.from("products").select("*").order("name");

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data;
}

export async function getProductsByCategory(categoryId: string): Promise<DbProduct[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<DbCategory | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
}

export async function createCategory(category: Omit<DbCategory, "id" | "created_at">) {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, category: Partial<DbCategory>) {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;
}

export async function createProduct(product: Omit<DbProduct, "id" | "created_at" | "updated_at">) {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<DbProduct>) {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("products")
    .update({
      ...product,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw error;
}

export async function toggleProductActive(id: string, isActive: boolean) {
  return updateProduct(id, { is_active: isActive });
}
