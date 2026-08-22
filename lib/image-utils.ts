/**
 * Utility functions for high performance image URLs (WebP / Cloudinary dynamic transformations).
 */

/**
 * Normalizes and optimizes any image URL.
 * - Converts Cloudinary URLs to use dynamic auto format (AVIF/WebP), auto quality, and optimal width
 * - Falls back to /tulsiveda-logo.webp if missing
 *
 * NOTE: All local static assets are now .webp directly — no mapping needed.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options?: { width?: number; quality?: string }
): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "/tulsiveda-logo.webp";
  }

  const cleanUrl = url.trim();

  // Cloudinary image URL optimization
  if (cleanUrl.includes("res.cloudinary.com") && cleanUrl.includes("/upload/")) {
    const width = options?.width || 600;
    const quality = options?.quality || "auto:good";
    const transform = `f_auto,q_${quality},w_${width},c_limit,dpr_auto`;

    // Replace upload path ensuring new optimal transformations are applied
    const optimized = cleanUrl.replace(
      /\/upload\/(?:[a-zA-Z0-9_:,]+(?:\/))?/,
      `/upload/${transform}/`
    );
    return optimized;
  }

  return cleanUrl;
}
