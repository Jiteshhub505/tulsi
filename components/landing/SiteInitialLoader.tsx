"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMAGES = [
  "/1w.png",
  "/2w.png",
  "/3w.png",
  "/herom1.webp",
  "/herom22.webp",
  "/herom3.webp",
];

export default function SiteInitialLoader() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Only run on first site load per session
    if (typeof window !== "undefined" && sessionStorage.getItem("tulsiveda_loader_shown")) {
      setLoading(false);
      return;
    }

    // Preload hero images in background memory
    HERO_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    // Hide loader after 1.5 seconds so 0.5s fade completes at exactly 2.0s
    const timer = setTimeout(() => {
      setLoading(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tulsiveda_loader_shown", "true");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !loading) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="site-initial-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fafdfb]"
        >
          {/* Logo & Spinning Ring Container */}
          <div className="relative flex flex-col items-center justify-center p-6">
            <div className="relative w-28 h-28 mb-5 flex items-center justify-center">
              {/* Spinning Emerald Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-700 animate-spin" />
              
              {/* Tulsi Veda Brand Logo inside */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xs">
                <Image
                  src="/tulsiveda-logo.png"
                  alt="Tulsi Veda Logo"
                  width={64}
                  height={64}
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            {/* Title & Tagline */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-emerald-950 tracking-wider"
            >
              TULSI VEDA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-xs text-emerald-700/80 font-semibold tracking-widest uppercase mt-1"
            >
              Pure Ayurvedic Wellness
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
