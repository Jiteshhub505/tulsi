"use client";

import { useEffect } from "react";
import axios from "axios";
import { getOptimizedImageUrl } from "@/lib/image-utils";

export default function GlobalProductImagePreloader() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const preloadAllProductImages = async () => {
      try {
        const res = await axios.get("/api/getproduct/all");
        if (res.data.success && Array.isArray(res.data.products)) {
          const products = res.data.products;

          const urlsToPreload: string[] = [];

          products.forEach((p: any) => {
            if (p.galleryImages && Array.isArray(p.galleryImages)) {
              p.galleryImages.forEach((img: string, idx: number) => {
                if (idx === 0) {
                  // Full res for product detail page
                  urlsToPreload.push(getOptimizedImageUrl(img, { width: 1000 }));
                  // Medium res for catalog card
                  urlsToPreload.push(getOptimizedImageUrl(img, { width: 600 }));
                } else if (idx <= 3) {
                  // Gallery thumbnails
                  urlsToPreload.push(getOptimizedImageUrl(img, { width: 1000 }));
                  urlsToPreload.push(getOptimizedImageUrl(img, { width: 160 }));
                }
              });
            }
          });

          // Preload all product images into browser RAM & HTTP cache
          urlsToPreload.forEach((src) => {
            const img = new window.Image();
            img.src = src;
          });
        }
      } catch {
        // Ignore background prefetch errors
      }
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(preloadAllProductImages, { timeout: 1000 });
    } else {
      setTimeout(preloadAllProductImages, 200);
    }
  }, []);

  return null;
}
