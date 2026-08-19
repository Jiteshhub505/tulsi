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
        className="absolute inset-0 bg-[url('/25off.png')] bg-cover bg-center bg-no-repeat"
        style={{ backgroundPosition: "center center" }}
        aria-hidden="true"
      />
      
      {/* Central content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-zinc-900 tracking-tight mb-5 sm:mb-7 uppercase">
          GET UPTO 25% OFF
        </h2>
        
        <div>
          <Link href="/shop">
            <button className="bg-zinc-900 hover:bg-black text-white font-semibold text-xs sm:text-sm tracking-widest px-8 py-3.5 sm:px-10 sm:py-4 rounded-full uppercase transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg cursor-pointer">
              {t("Shop Now")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
