import {
  getCategories as getDbCategories,
  getProducts as getDbProducts,
  getProductBySlug as getDbProductBySlug,
  getCategoryBySlug as getDbCategoryBySlug,
  getProductsByCategory as getDbProductsByCategory,
  DbCategory,
  DbProduct,
} from "./firebase";
import {
  categories as staticCategories,
  products as staticProducts,
  Product as StaticProduct,
  Category as StaticCategory,
} from "@/data/products";

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

function mapStaticProductToDisplay(product: StaticProduct): DisplayProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    categorySlug: product.categorySlug,
    subcategory: product.subcategory,
    price: product.price,
    weight: product.weight,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    ingredients: product.ingredients,
    images: product.images,
    isBestseller: product.isBestseller || false,
    isNew: product.isNew || false,
    isActive: true,
  };
}

function mapDbCategoryToDisplay(category: DbCategory, allCategories: DbCategory[]): DisplayCategory {
  const subcategories = allCategories
    .filter((c) => c.parent_id === category.id)
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

function mapStaticCategoryToDisplay(category: StaticCategory): DisplayCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    subcategories: category.subcategories,
  };
}

export async function getCategories(): Promise<DisplayCategory[]> {
  try {
    const dbCategories = await getDbCategories();
    if (dbCategories.length > 0) {
      const parentCategories = dbCategories.filter((c) => !c.parent_id);
      return parentCategories.map((c) => mapDbCategoryToDisplay(c, dbCategories));
    }
  } catch (error) {
    console.error("Firebase error, falling back to static data:", error);
  }
  return staticCategories.map(mapStaticCategoryToDisplay);
}

export async function getProducts(): Promise<DisplayProduct[]> {
  try {
    const [dbProducts, dbCategories] = await Promise.all([
      getDbProducts(false),
      getDbCategories(),
    ]);
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => mapDbProductToDisplay(p, dbCategories));
    }
  } catch (error) {
    console.error("Firebase error, falling back to static data:", error);
  }
  return staticProducts.map(mapStaticProductToDisplay);
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
  } catch (error) {
    console.error("Firebase error, falling back to static data:", error);
  }
  const product = staticProducts.find((p) => p.slug === slug);
  return product ? mapStaticProductToDisplay(product) : null;
}

export async function getCategoryBySlug(slug: string): Promise<DisplayCategory | null> {
  try {
    const dbCategories = await getDbCategories();
    const category = dbCategories.find((c) => c.slug === slug);
    if (category) {
      return mapDbCategoryToDisplay(category, dbCategories);
    }
  } catch (error) {
    console.error("Firebase error, falling back to static data:", error);
  }
  const category = staticCategories.find((c) => c.slug === slug);
  return category ? mapStaticCategoryToDisplay(category) : null;
}

export async function getProductsByCategory(categorySlug: string): Promise<DisplayProduct[]> {
  try {
    const dbCategories = await getDbCategories();
    const category = dbCategories.find((c) => c.slug === categorySlug);
    if (category) {
      const dbProducts = await getDbProductsByCategory(category.id);
      return dbProducts.map((p) => mapDbProductToDisplay(p, dbCategories));
    }
  } catch (error) {
    console.error("Firebase error, falling back to static data:", error);
  }
  return staticProducts
    .filter((p) => p.categorySlug === categorySlug)
    .map(mapStaticProductToDisplay);
}

export async function getBestsellers(): Promise<DisplayProduct[]> {
  const products = await getProducts();
  return products.filter((p) => p.isBestseller);
}

export async function getNewProducts(): Promise<DisplayProduct[]> {
  const products = await getProducts();
  return products.filter((p) => p.isNew);
}
