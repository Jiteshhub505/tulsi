/**
 * Helper to scale and convert any image File to WebP format in the browser before upload.
 */
export async function convertFileToWebP(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Calculate optimal dimensions (max 1600px on longest side)
      let { width, height } = img;
      const maxDim = 1600;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const webpName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const webpFile = new File([blob], webpName, {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve(webpFile);
        },
        "image/webp",
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * Optimizes Cloudinary URLs by inserting auto format (f_auto) and auto quality (q_auto).
 */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("f_auto")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto/");
    }
  }
  return url;
}

/**
 * Uploads a batch of files straight to Cloudinary using a short-lived
 * signature minted by /api/admin/cloudinary, converting to WebP automatically.
 */
export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const sigRes = await fetch("/api/admin/cloudinary");
  const { signature, timestamp } = await sigRes.json();

  const uploadedUrls: string[] = [];

  for (const rawFile of files) {
    // Convert image to WebP client-side before uploading
    const webpFile = await convertFileToWebP(rawFile);

    const formData = new FormData();
    formData.append("file", webpFile);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("folder", "products");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );

    const data = await res.json();
    if (!res.ok || !data.secure_url) {
      throw new Error(data?.error?.message || "Image upload failed");
    }

    const optimizedUrl = optimizeCloudinaryUrl(data.secure_url);
    uploadedUrls.push(optimizedUrl);
  }

  return uploadedUrls;
}
