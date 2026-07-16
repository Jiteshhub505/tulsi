/**
 * Uploads a batch of files straight to Cloudinary using a short-lived
 * signature minted by /api/admin/cloudinary, and returns the resulting
 * secure URLs. Shared by the add-product and edit-product admin forms.
 */
export async function uploadImagesToCloudinary(files: File[]): Promise<string[]> {
  const sigRes = await fetch("/api/admin/cloudinary");
  const { signature, timestamp } = await sigRes.json();

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
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
    uploadedUrls.push(data.secure_url);
  }

  return uploadedUrls;
}
