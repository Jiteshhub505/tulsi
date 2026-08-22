/**
 * Utility functions for high performance image URLs (WebP / Cloudinary dynamic transformations).
 */

const LOCAL_WEBP_MAP: Record<string, string> = {
  "/tul-web1.png": "/tul-web1.webp",
  "/tul-web2.png": "/tul-web2.webp",
  "/tul-web3.png": "/tul-web3.webp",
  "/tul-web4.png": "/tul-web4.webp",
  "/tul-web5.png": "/tul-web5.webp",
  "/tul-web6.png": "/tul-web6.webp",
  "/tul-mob1.png": "/tul-mob1.webp",
  "/tul-mob4.png": "/tul-mob4.webp",
  "/tul-mob5.png": "/tul-mob5.webp",
  "/tul-mob6.png": "/tul-mob6.webp",
  "/tulsiveda-logo.png": "/tulsiveda-logo.webp",
  "/digestion.png": "/digestion.webp",
  "/health&fitness.png": "/health&fitness.webp",
  "/staminaandpower.png": "/staminaandpower.webp",
  "/healthdisease.png": "/healthdisease.webp",
  "/25off.png": "/25off.webp",
  "/f1.png": "/f1.webp",
  "/f2.png": "/f2.webp",
  "/f3.png": "/f3.webp",
  "/f4.png": "/f4.webp",
  "/f5.png": "/f5.webp",
  "/f6.png": "/f6.webp",
  "/hero-tulsiveda.png": "/hero-tulsiveda.webp",
  "/ingi.png": "/ingi.webp",
  "/mens_health.png": "/mens_health.webp",
  "/womens_health.png": "/womens_health.webp",
  "/skin_care.png": "/skin_care.webp",
  "/offer_piles.png": "/offer_piles.webp",
  "/offer_vitality.png": "/offer_vitality.webp",
  "/offer_wellness.png": "/offer_wellness.webp",
};

/**
 * Normalizes and optimizes any image URL.
 * - Converts Cloudinary URLs to use dynamic auto format (AVIF/WebP), auto quality, and optimal width
 * - Replaces local PNG references with lightweight WebP counterparts
 * - Falls back to /tulsiveda-logo.webp if missing
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options?: { width?: number; quality?: string }
): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "/tulsiveda-logo.webp";
  }

  const cleanUrl = url.trim();

  // Local static asset optimization
  if (LOCAL_WEBP_MAP[cleanUrl]) {
    return LOCAL_WEBP_MAP[cleanUrl];
  }

  // Auto-rewrite any standard local .png extension to .webp if available
  if (cleanUrl.startsWith("/") && cleanUrl.endsWith(".png")) {
    const webpCandidate = cleanUrl.replace(/\.png$/, ".webp");
    if (LOCAL_WEBP_MAP[cleanUrl] || LOCAL_WEBP_MAP[webpCandidate]) {
      return webpCandidate;
    }
  }

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
