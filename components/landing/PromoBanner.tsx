"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function PromoBanner() {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  return (
    <section className="relative w-full h-[220px] xs:h-[260px] sm:h-[320px] md:h-[400px] lg:h-[460px] xl:h-[500px] overflow-hidden bg-[#e8e4dc]">
      {/* Background image container */}
      <div 
        className="absolute inset-0 bg-[url('/25off.webp')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundPosition: "center center" }}
        aria-hidden="true"
      />
      
      {/* Central content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-2 sm:py-4 z-10">
        
        {/* Responsive Pill Badge */}
        <span className="inline-flex items-center gap-1 text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-0.5 sm:px-4 sm:py-1 md:px-5 md:py-1.5 rounded-full mb-1.5 xs:mb-2 sm:mb-3 md:mb-4 shadow-2xs">
          🌿 {t("Empower Your Daily Health")}
        </span>

        {/* 2-Line Fluid Responsive Headline (Scales perfectly from mobile to large screens) */}
        <h2 className="text-xs xs:text-sm sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-black text-[#0c392b] tracking-tight mb-2.5 xs:mb-3 sm:mb-4 md:mb-6 uppercase leading-tight sm:leading-snug drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] flex flex-col items-center">
          {isHi ? (
            <>
              <span>संपूर्ण स्वास्थ्य के लिए</span>
              <span className="text-emerald-800">शुद्ध हर्बल फॉर्मूले</span>
            </>
          ) : (
            <>
              <span>Pure Herbal Formulas</span>
              <span className="text-emerald-800">For Complete Wellness</span>
            </>
          )}
        </h2>
        
        {/* Responsive CTA Button */}
        <div>
          <Link href="/shop">
            <button className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#0c392b] hover:bg-[#06241b] text-white font-bold text-[10px] xs:text-xs sm:text-sm md:text-base tracking-wider px-4 py-1.5 xs:px-5 xs:py-2 sm:px-7 sm:py-2.5 md:px-9 md:py-3.5 rounded-full uppercase transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 shadow-md hover:shadow-xl cursor-pointer">
              <span>{t("Explore Products")}</span>
              <span>→</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}




