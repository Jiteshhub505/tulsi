"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function PromoBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden bg-white">
      {/* Background image container */}
      <div 
        className="absolute inset-0 bg-[url('/25off.webp')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundPosition: "center center" }}
        aria-hidden="true"
      />
      
      {/* Central content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 bg-black/10 backdrop-brightness-[0.95]">
        <span className="text-[11px] sm:text-sm font-bold uppercase tracking-wider sm:tracking-widest text-emerald-950 bg-emerald-100/90 px-3 py-1 rounded-full mb-2.5 sm:mb-3 shadow-xs">
          {t("Empower Your Daily Health")}
        </span>

        <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4 sm:mb-7 uppercase max-w-[280px] xs:max-w-xs sm:max-w-3xl leading-snug sm:leading-tight">
          {t("Pure Herbal Formulas For Complete Wellness")}
        </h2>
        
        <div>
          <Link href="/shop">
            <button className="bg-zinc-900 hover:bg-black text-white font-semibold text-xs sm:text-sm tracking-widest px-8 py-3.5 sm:px-10 sm:py-4 rounded-full uppercase transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg cursor-pointer">
              {t("Explore Products")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
