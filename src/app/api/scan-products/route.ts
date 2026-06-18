import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "assets", "products");

function fileNameToProductName(fileName: string): string {
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

  const turkishMap: Record<string, string> = {
    "fistik": "Fıstık",
    "fistiikli": "Fıstıklı",
    "fistikli": "Fıstıklı",
    "cekme": "Çekme",
    "helva": "Helva",
    "tahin": "Tahin",
    "tahinli": "Tahinli",
    "kakao": "Kakao",
    "kakaolu": "Kakaolu",
    "cikolata": "Çikolata",
    "cikolatali": "Çikolatalı",
    "sade": "Sade",
    "findik": "Fındık",
    "findikli": "Fındıklı",
    "ceviz": "Ceviz",
    "cevizli": "Cevizli",
    "susam": "Susam",
    "susamli": "Susamlı",
    "antep": "Antep",
    "kaymak": "Kaymak",
    "kaymakli": "Kaymaklı",
    "bal": "Bal",
    "balli": "Ballı",
    "hurma": "Hurma",
    "hurmali": "Hurmalı",
    "incir": "İncir",
    "incirli": "İncirli",
    "kayisi": "Kayısı",
    "kayisili": "Kayısılı",
    "erik": "Erik",
    "erikli": "Erikli",
    "uzum": "Üzüm",
    "uzumlu": "Üzümlü",
    "portakal": "Portakal",
    "portakalli": "Portakallı",
    "limon": "Limon",
    "limonlu": "Limonlu",
    "visne": "Vişne",
    "visneli": "Vişneli",
    "cilek": "Çilek",
    "cilekli": "Çilekli",
    "muz": "Muz",
    "muzlu": "Muzlu",
    "vanilya": "Vanilya",
    "vanilyali": "Vanilyalı",
    "badem": "Badem",
    "bademli": "Bademli",
    "lokum": "Lokum",
    "yer": "Yer",
    "yerfistigi": "Yerfıstığı",
    "yerfistikli": "Yerfıstıklı",
    "klasik": "Klasik",
    "ozel": "Özel",
    "geleneksel": "Geleneksel",
    "ev": "Ev",
    "yapimi": "Yapımı",
    "dogal": "Doğal",
    "organik": "Organik",
  };

  const words = nameWithoutExt.split(/[-_\s]+/);

  const capitalizedWords = words.map((word) => {
    const lower = word.toLowerCase();
    if (turkishMap[lower]) {
      return turkishMap[lower];
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
}

export async function GET() {
  try {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
      return NextResponse.json({ files: [], message: "Klasör oluşturuldu. Görselleri public/assets/products klasörüne ekleyin." });
    }

    const files = fs.readdirSync(PRODUCTS_DIR);

    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    const products = imageFiles.map((file) => ({
      fileName: file,
      productName: fileNameToProductName(file),
      imagePath: `/assets/products/${file}`,
      slug: file.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));

    return NextResponse.json({ files: products });
  } catch (error) {
    console.error("Error scanning products:", error);
    return NextResponse.json(
      { error: "Klasör taranamadı", files: [] },
      { status: 500 }
    );
  }
}
