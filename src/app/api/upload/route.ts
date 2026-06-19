import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      console.error("IMGBB_API_KEY is not configured");
      return NextResponse.json(
        { error: "Görsel yükleme servisi yapılandırılmamış." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Görsel dosyası bulunamadı." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Desteklenmeyen dosya formatı. PNG, JPG, WEBP veya GIF kullanın." },
        { status: 400 }
      );
    }

    const maxSize = 32 * 1024 * 1024; // 32MB (imgbb limit)
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Dosya boyutu 32MB'dan büyük olamaz." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const imgbbFormData = new FormData();
    imgbbFormData.append("key", apiKey);
    imgbbFormData.append("image", base64);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    });

    const result = await response.json();

    if (!result.success) {
      console.error("imgbb upload failed:", result);
      return NextResponse.json(
        { error: result.error?.message || "Görsel yüklenemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
      display_url: result.data.display_url,
      delete_url: result.data.delete_url,
      thumb_url: result.data.thumb?.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Görsel yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
