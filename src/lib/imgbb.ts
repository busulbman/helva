const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

interface ImgbbResponse {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  error?: {
    message: string;
  };
}

export async function uploadToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result: ImgbbResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || "Görsel yüklenemedi");
  }

  return result.data.display_url;
}

export async function uploadMultipleToImgbb(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToImgbb(file));
  return Promise.all(uploadPromises);
}
