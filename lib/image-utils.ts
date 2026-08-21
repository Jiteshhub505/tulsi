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
 * - Converts Cloudinary URLs to use auto format and auto quality with optional max width
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

  // Cloudinary image URL optimization
  if (cleanUrl.includes("res.cloudinary.com") && cleanUrl.includes("/upload/")) {
    const widthParam = options?.width ? `w_${options.width},` : "";
    const qualityParam = options?.quality ? `q_${options.quality},` : "q_auto,";
    const transform = `f_auto,${qualityParam}${widthParam}c_limit`;

    // Replace if already has transformations or plain /upload/
    if (cleanUrl.includes("/upload/f_auto")) {
      return cleanUrl;
    }
    return cleanUrl.replace("/upload/", `/upload/${transform}/`);
  }

  return cleanUrl;
}
