import {
  getCategories as getDbCategories,
  getProducts as getDbProducts,
  getProductBySlug as getDbProductBySlug,
  getProductsByCategory as getDbProductsByCategory,
  getSubcategoryOrders,
  DbCategory,
  DbProduct,
} from "./firebase";

export interface DisplayProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  categoryId?: string;
  subcategory?: string;
  price: number;
  weight: string;
  shortDescription: string;
  longDescription: string;
  ingredients: string;
  images: string[];
  isBestseller: boolean;
  isNew: boolean;
  isActive: boolean;
}

export interface DisplayCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string | null;
  subcategories?: { name: string; slug: string }[];
}

function mapDbProductToDisplay(product: DbProduct, categories: DbCategory[]): DisplayProduct {
  const category = categories.find((c) => c.id === product.category_id);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: category?.name || "",
    categorySlug: category?.slug || "",
    categoryId: product.category_id,
    subcategory: product.subcategory || undefined,
    price: product.price,
    weight: product.weight,
    shortDescription: product.short_description,
    longDescription: product.long_description,
    ingredients: product.ingredients,
    images: product.images,
    isBestseller: product.is_bestseller,
    isNew: product.is_new,
    isActive: product.is_active,
  };
}

function mapDbCategoryToDisplay(category: DbCategory, allCategories: DbCategory[]): DisplayCategory {
  const subcategories = allCategories
    .filter((c) => c.parent_id === category.id)
    .sort((a, b) => {
      const orderDiff = (a.sort_order ?? 999) - (b.sort_order ?? 999);
      if (orderDiff !== 0) return orderDiff;
      return a.name.localeCompare(b.name, "tr");
    })
    .map((c) => ({ name: c.name, slug: c.slug }));

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    parentId: category.parent_id,
    subcategories: subcategories.length > 0 ? subcategories : undefined,
  };
}

export async function getCategories(): Promise<DisplayCategory[]> {
  try {
    const dbCategories = await getDbCategories();
    const parentCategories = dbCategories.filter((c) => !c.parent_id);
    return parentCategories.map((c) => mapDbCategoryToDisplay(c, dbCategories));
  } catch (error) {
    console.error("Firebase error:", error);
    return [];
  }
}

export async function getProducts(): Promise<DisplayProduct[]> {
  try {
    const [dbProducts, dbCategories] = await Promise.all([
      getDbProducts(false),
      getDbCategories(),
    ]);
    return dbProducts.map((p) => mapDbProductToDisplay(p, dbCategories));
  } catch (error) {
    console.error("Firebase error:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<DisplayProduct | null> {
  try {
    const [dbProduct, dbCategories] = await Promise.all([
      getDbProductBySlug(slug),
      getDbCategories(),
    ]);
    if (dbProduct) {
      return mapDbProductToDisplay(dbProduct, dbCategories);
    }
    return null;
  } catch (error) {
    console.error("Firebase error:", error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<DisplayCategory | null> {
  try {
    const dbCategories = await getDbCategories();
    const category = dbCategories.find((c) => c.slug === slug);
    if (category) {
      return mapDbCategoryToDisplay(category, dbCategories);
    }
    return null;
  } catch (error) {
    console.error("Firebase error:", error);
    return null;
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<DisplayProduct[]> {
  try {
    const dbCategories = await getDbCategories();
    const category = dbCategories.find((c) => c.slug === categorySlug);

    if (category) {
      // If it's a parent category, get all products in this category
      if (!category.parent_id) {
        const dbProducts = await getDbProductsByCategory(category.id);
        return dbProducts.map((p) => mapDbProductToDisplay(p, dbCategories));
      }

      // If it's a subcategory, get products from parent category filtered by subcategory
      const parentCategory = dbCategories.find((c) => c.id === category.parent_id);
      if (parentCategory) {
        const dbProducts = await getDbProductsByCategory(parentCategory.id);
        // Filter by subcategory - normalize slugs for comparison
        const normalizeSlug = (s: string | null) => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        const targetSlug = normalizeSlug(categorySlug);
        const targetName = normalizeSlug(category.name);

        const filteredProducts = dbProducts.filter((p) => {
          const productSubSlug = normalizeSlug(p.subcategory);
          return productSubSlug === targetSlug ||
                 productSubSlug === targetName ||
                 productSubSlug.includes(targetSlug) ||
                 targetSlug.includes(productSubSlug);
        });
        return filteredProducts.map((p) => mapDbProductToDisplay(p, dbCategories));
      }
    }

    // Fallback: try to find by subcategory field directly in all products
    const allProducts = await getDbProducts(false);
    const normalizeSlug = (s: string | null) => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const targetSlug = normalizeSlug(categorySlug);

    const matchingProducts = allProducts.filter((p) => {
      const productSubSlug = normalizeSlug(p.subcategory);
      return productSubSlug === targetSlug ||
             productSubSlug.includes(targetSlug) ||
             targetSlug.includes(productSubSlug);
    });

    if (matchingProducts.length > 0) {
      return matchingProducts.map((p) => mapDbProductToDisplay(p, dbCategories));
    }

    return [];
  } catch (error) {
    console.error("Firebase error:", error);
    return [];
  }
}

export async function getBestsellers(): Promise<DisplayProduct[]> {
  const products = await getProducts();
  return products.filter((p) => p.isBestseller);
}

export async function getNewProducts(): Promise<DisplayProduct[]> {
  const products = await getProducts();
  return products.filter((p) => p.isNew);
}
