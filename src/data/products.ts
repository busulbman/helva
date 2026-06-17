export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  price: number;
  weight: string;
  shortDescription: string;
  longDescription: string;
  ingredients: string;
  images: string[];
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: { name: string; slug: string }[];
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Çekme Helva",
    slug: "cekme-helva",
    description: "Geleneksel tariflerle hazırlanan el yapımı çekme helvalarımız",
    image: "/images/products/sade-cekme-helva.jpg",
    subcategories: [
      { name: "Sade", slug: "sade" },
      { name: "Kakao Kaplamalı", slug: "kakao-kaplamali" },
      { name: "Antep Fıstıklı", slug: "antep-fistikli" },
      { name: "Fındıklı", slug: "findikli" },
      { name: "Tereyağlı", slug: "tereyagli" },
      { name: "Karışık", slug: "karisik" },
    ],
  },
  {
    id: "2",
    name: "Reçel",
    slug: "recel",
    description: "Doğal meyvelerden hazırlanan ev yapımı reçellerimiz",
    image: "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=600&q=80",
  },
  {
    id: "3",
    name: "Hediye Paketleri",
    slug: "hediye-paketleri",
    description: "Sevdiklerinize özel hazırlanmış hediye kutuları",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
  },
  {
    id: "4",
    name: "Yöresel Ürünler",
    slug: "yoresel-urunler",
    description: "Kastamonu'nun geleneksel lezzetleri",
    image: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=600&q=80",
  },
];

export const products: Product[] = [
  // Çekme Helva - Sade (GERÇEK GÖRSEL)
  {
    id: "1",
    name: "Sade Çekme Helva",
    slug: "sade-cekme-helva",
    category: "Çekme Helva",
    categorySlug: "cekme-helva",
    subcategory: "sade",
    price: 180,
    weight: "500g",
    shortDescription: "Geleneksel tarifle hazırlanan sade çekme helva",
    longDescription:
      "Osmanlı'dan günümüze uzanan geleneksel tarifimizle, tamamen doğal malzemeler kullanarak el ile çekilen helvamız. Tahin, şeker ve un'un mükemmel uyumuyla hazırlanan sade çekme helvamız, tüm çekme helva çeşitlerimizin temelini oluşturur. Her bir parça, ustalarımızın elli yıllık tecrübesiyle özenle hazırlanır.",
    ingredients: "Tahin, şeker, un, su",
    images: ["/images/products/sade-cekme-helva.jpg"],
    isBestseller: true,
  },
  {
    id: "2",
    name: "Sade Çekme Helva (Küçük)",
    slug: "sade-cekme-helva-kucuk",
    category: "Çekme Helva",
    categorySlug: "cekme-helva",
    subcategory: "sade",
    price: 100,
    weight: "250g",
    shortDescription: "Küçük boy sade çekme helva",
    longDescription:
      "Geleneksel sade çekme helvamızın küçük boy versiyonu. Tek kişilik tüketim veya deneme için ideal boyutta. Aynı lezzet, aynı kalite.",
    ingredients: "Tahin, şeker, un, su",
    images: ["/images/products/sade-cekme-helva.jpg"],
  },
  // Çekme Helva - Kakao Kaplamalı (GERÇEK GÖRSEL)
  {
    id: "3",
    name: "Kakao Kaplamalı Çekme Helva",
    slug: "kakao-kaplamali-cekme-helva",
    category: "Çekme Helva",
    categorySlug: "cekme-helva",
    subcategory: "kakao-kaplamali",
    price: 220,
    weight: "500g",
    shortDescription: "Bitter kakao ile kaplanmış çekme helva",
    longDescription:
      "Geleneksel çekme helvamızın üzerine özenle sürülen bitter kakao kaplaması ile benzersiz bir tat deneyimi. Helvanın tatlılığı ile kakaonun hafif acılığı mükemmel bir denge oluşturur. Çikolata severler için vazgeçilmez bir lezzet.",
    ingredients: "Tahin, şeker, un, su, kakao",
    images: ["/images/products/kakao-kaplamali.jpg"],
    isBestseller: true,
  },
  // Çekme Helva - Antep Fıstıklı (GERÇEK GÖRSEL)
  {
    id: "4",
    name: "Antep Fıstıklı Çekme Helva",
    slug: "antep-fistikli-cekme-helva",
    category: "Çekme Helva",
    categorySlug: "cekme-helva",
    subcategory: "antep-fistikli",
    price: 280,
    weight: "500g",
    shortDescription: "Bol Antep fıstıklı premium çekme helva",
    longDescription:
      "En kaliteli Antep fıstıklarıyla zenginleştirilmiş özel çekme helvamız. Her dilimde bol miktarda fıstık bulunur. Özel günler ve ikramlar için ideal bir tercih. Premium kalite fıstıklarımız doğrudan Gaziantep'ten temin edilmektedir.",
    ingredients: "Tahin, şeker, un, su, Antep fıstığı",
    images: ["/images/products/antep-fistikli.jpg"],
    isNew: true,
  },
  // Çekme Helva - Fındıklı (GERÇEK GÖRSEL)
  {
    id: "5",
    name: "Fındıklı Çekme Helva",
    slug: "findikli-cekme-helva",
    category: "Çekme Helva",
    categorySlug: "cekme-helva",
    subcategory: "findikli",
    price: 240,
    weight: "500g",
    shortDescription: "Karadeniz fındığı ile hazırlanan çekme helva",
    longDescription:
      "Karadeniz'in meşhur tombul fındıklarıyla hazırlanan özel çekme helvamız. Fındığın kendine has aroması ile helvanın tatlılığı bir arada. Kavrulmuş fındıklar helvanın içine serpiştirilir ve her lokmada fındık keyfi yaşarsınız.",
    ingredients: "Tahin, şeker, un, su, Karadeniz fındığı",
    images: ["/images/products/findikli.jpg"],
    isBestseller: true,
  },
  // Çekme Helva - Tereyağlı (GERÇEK GÖRSEL)
  {
    id: "6",
    name: "Tereyağlı Çekme Helva",
    slug: "tereyagli-cekme-helva",
    category: "Çekme Helva",
    categorySlug: "cekme-helva",
    subcategory: "tereyagli",
    price: 200,
    weight: "500g",
    shortDescription: "Köy tereyağı ile zenginleştirilmiş çekme helva",
    longDescription:
      "Kastamonu köylerinden temin ettiğimiz taze tereyağı ile hazırlanan özel tarif. Tereyağının kremamsı dokusu helvaya eşsiz bir yumuşaklık katar. Geleneksel tarifin en lezzetli versiyonlarından biri.",
    ingredients: "Tahin, şeker, un, su, köy tereyağı",
    images: ["/images/products/tereyagli.jpg"],
  },
  // Çekme Helva - Karışık (GERÇEK GÖRSEL)
  {
    id: "7",
    name: "Karışık Çekme Helva Paketi",
    slug: "karisik-cekme-helva-paketi",
    category: "Çekme Helva",
    categorySlug: "cekme-helva",
    subcategory: "karisik",
    price: 350,
    weight: "750g",
    shortDescription: "Tüm çeşitlerimizden karışık paket",
    longDescription:
      "Sade, kakaolu, fıstıklı, fındıklı ve tereyağlı çekme helvalarımızdan oluşan özel karışık paket. Tüm lezzetleri bir arada deneme fırsatı. Hediye olarak da ideal bir seçim.",
    ingredients:
      "Tahin, şeker, un, su, kakao, Antep fıstığı, Karadeniz fındığı, köy tereyağı",
    images: ["/images/products/karisik-paket.jpg"],
  },
  // Reçeller (UNSPLASH PLACEHOLDER)
  {
    id: "8",
    name: "Gül Reçeli",
    slug: "gul-receli",
    category: "Reçel",
    categorySlug: "recel",
    price: 120,
    weight: "400g",
    shortDescription: "Isparta güllerinden hazırlanan geleneksel reçel",
    longDescription:
      "Isparta'nın meşhur güllerinden özenle hazırlanan gül reçelimiz. Sabah kahvaltılarınızın vazgeçilmezi olacak bu reçel, hoş kokusu ve hafif tatlılığıyla damağınızda unutulmaz bir tat bırakacak.",
    ingredients: "Gül yaprağı, şeker, limon suyu",
    images: ["https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&q=80"],
    isBestseller: true,
  },
  {
    id: "9",
    name: "Vişne Reçeli",
    slug: "visne-receli",
    category: "Reçel",
    categorySlug: "recel",
    price: 95,
    weight: "400g",
    shortDescription: "Taze vişnelerden ev yapımı reçel",
    longDescription:
      "Mevsiminde toplanan taze vişnelerden hazırlanan ev yapımı reçelimiz. Ekşi-tatlı dengesiyle mükemmel bir lezzet. Katkısız ve doğal.",
    ingredients: "Vişne, şeker, limon suyu",
    images: ["https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=600&q=80"],
  },
  {
    id: "10",
    name: "İncir Reçeli",
    slug: "incir-receli",
    category: "Reçel",
    categorySlug: "recel",
    price: 110,
    weight: "400g",
    shortDescription: "Bursa'nın siyah incirlerinden hazırlanan reçel",
    longDescription:
      "Bursa'nın meşhur siyah incirlerinden hazırlanan geleneksel reçelimiz. İncirin doğal tatlılığı ve ceviz parçalarıyla zenginleştirilmiş eşsiz bir lezzet.",
    ingredients: "Siyah incir, şeker, ceviz, limon suyu",
    images: ["https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600&q=80"],
  },
  // Hediye Paketleri (UNSPLASH PLACEHOLDER)
  {
    id: "11",
    name: "Klasik Hediye Kutusu",
    slug: "klasik-hediye-kutusu",
    category: "Hediye Paketleri",
    categorySlug: "hediye-paketleri",
    price: 450,
    weight: "1kg",
    shortDescription: "En sevilen ürünlerimizden oluşan hediye paketi",
    longDescription:
      "Sade çekme helva, kakaolu çekme helva ve gül reçelinden oluşan özel hediye kutumuz. Şık ahşap kutuda sunulan bu paket, sevdiklerinize özel günlerde verebileceğiniz anlamlı bir hediye.",
    ingredients: "Çekme helva çeşitleri, gül reçeli",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80"],
    isBestseller: true,
  },
  {
    id: "12",
    name: "Premium Hediye Kutusu",
    slug: "premium-hediye-kutusu",
    category: "Hediye Paketleri",
    categorySlug: "hediye-paketleri",
    price: 750,
    weight: "2kg",
    shortDescription: "Tüm ürünlerimizi içeren lüks hediye paketi",
    longDescription:
      "Tüm çekme helva çeşitlerimiz, seçme reçellerimiz ve yöresel ürünlerimizden oluşan premium hediye kutumuz. El yapımı ahşap kutuda, özel ambalajla sunulur. Kurumsal hediyeler için de idealdir.",
    ingredients: "Çekme helva çeşitleri, reçel çeşitleri, yöresel ürünler",
    images: ["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=80"],
    isNew: true,
  },
  // Yöresel Ürünler (UNSPLASH PLACEHOLDER)
  {
    id: "13",
    name: "Kastamonu Sarımsağı",
    slug: "kastamonu-sarimsagi",
    category: "Yöresel Ürünler",
    categorySlug: "yoresel-urunler",
    price: 80,
    weight: "500g",
    shortDescription: "Meşhur Kastamonu sarımsağı",
    longDescription:
      "Kastamonu'nun ünlü sarımsağı, kendine has aroması ve keskin tadıyla mutfağınızın vazgeçilmezi. Doğal yöntemlerle yetiştirilen sarımsaklarımız, bölgenin en kaliteli ürünlerindendir.",
    ingredients: "Kastamonu sarımsağı",
    images: ["https://images.unsplash.com/photo-1540148426945-6cf22a6b2f56?w=600&q=80"],
  },
  {
    id: "14",
    name: "Kuru Pastırma",
    slug: "kuru-pastirma",
    category: "Yöresel Ürünler",
    categorySlug: "yoresel-urunler",
    price: 320,
    weight: "500g",
    shortDescription: "Geleneksel yöntemlerle hazırlanan pastırma",
    longDescription:
      "Geleneksel Kastamonu usulü hazırlanan kuru pastırmamız. Özel baharatlarla marine edilip doğal ortamda kurutulan pastırmamız, kahvaltılarınızın ve mezelerinizin baş tacı olacak.",
    ingredients: "Dana eti, çemen, sarımsak, baharatlar",
    images: ["https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80"],
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter((p) => p.categorySlug === categorySlug);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((c) => c.slug === slug);
};

export const getBestsellers = (): Product[] => {
  return products.filter((p) => p.isBestseller);
};

export const getNewProducts = (): Product[] => {
  return products.filter((p) => p.isNew);
};
