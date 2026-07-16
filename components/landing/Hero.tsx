"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] bg-[#f0fbf6] py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-16 flex items-center justify-center">

      {/* Main Page Container */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col mt-[25px]">

        {/* Hero Body Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center pb-6">

          {/* Left Column: Text & Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto lg:mx-0">
            <h1 className="text-[2rem] xs:text-[2.25rem] sm:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] font-bold text-slate-900 leading-[1.12] tracking-tight mb-6">
              Ayurvedic{" "}
              <span className="relative inline-block">
                <span className="absolute left-0 bottom-1 md:bottom-2 h-3.5 md:h-4.5 w-full bg-[#daf2e4] -z-10 rounded-xs"></span>
                Wellness
              </span>
              <br className="hidden lg:inline" /> for Everyday Energy
            </h1>

            <p className="text-slate-600 text-sm sm:text-base md:text-[18px] lg:text-[20px] xl:text-[22px] leading-relaxed max-w-lg lg:max-w-xl xl:max-w-2xl mb-8 md:mb-10 font-medium">
              Daily formulas crafted from time-tested herbs and clinically trusted ingredients to revitalize your mind and body.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-row flex-wrap justify-center lg:justify-start items-center gap-3 mb-10 w-full">
              <Link href="/shop" className="shrink-0">
                <button className="group relative inline-flex items-center justify-center bg-[#7db73c] hover:bg-[#72a635] text-white font-semibold py-3 px-5 sm:px-8 md:px-10 lg:py-4 lg:px-12 rounded-full shadow-[0_8px_25px_rgba(125,183,60,0.25)] hover:shadow-[0_10px_30px_rgba(125,183,60,0.35)] transition-all duration-300 transform active:scale-95 text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer">
                  <span>Explore More</span>
                  <ArrowRight size={16} className="ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button
                onClick={() => {
                  const el = document.getElementById("bestsellers");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center justify-center border-2 border-emerald-950/10 hover:border-emerald-950/30 text-emerald-950 font-semibold py-2.5 px-5 sm:px-8 md:px-10 lg:py-3.5 lg:px-12 rounded-full hover:bg-emerald-900/5 transition-all duration-300 active:scale-95 text-xs sm:text-sm md:text-base lg:text-lg cursor-pointer shrink-0"
              >
                <span>View Bestsellers</span>
              </button>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-emerald-950/5 pt-8 w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-[16px] sm:text-[20px] lg:text-[24px] xl:text-[28px] font-bold text-emerald-950">100%</span>
                <span className="text-[9px] sm:text-[11px] lg:text-[13px] xl:text-[14px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Natural Herbs</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left border-x border-emerald-950/5 px-2 sm:px-4">
                <span className="text-[16px] sm:text-[20px] lg:text-[24px] xl:text-[28px] font-bold text-emerald-950">Clinically</span>
                <span className="text-[9px] sm:text-[11px] lg:text-[13px] xl:text-[14px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Trusted Blends</span>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <span className="text-[16px] sm:text-[20px] lg:text-[24px] xl:text-[28px] font-bold text-emerald-950">Zero</span>
                <span className="text-[9px] sm:text-[11px] lg:text-[13px] xl:text-[14px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Chemicals Added</span>
              </div>
            </div>
          </div>

          {/* Right Column: Organic Leaf Frame & Image */}
          <div className="flex justify-center lg:justify-end items-center relative w-full mt-4 lg:mt-0">
            <div className="relative w-full max-w-[340px] xs:max-w-[410px] sm:max-w-[490px] lg:max-w-[560px] xl:max-w-[640px] aspect-square rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] border-4 border-white/60 shadow-[0_25px_60px_rgba(4,47,31,0.1)] overflow-hidden transition-all duration-500 hover:scale-[1.02]">
              <Image
                src="/hero-tulsiveda.png"
                alt="Ayurvedic Essential Products"
                fill
                priority
                className="object-cover"
                sizes="(max-w-768px) 100vw, 50vw"
              />
            </div>

            {/* Subtle light reflections/blobs under shaped card */}
            <div className="absolute -inset-2 bg-radial-to-r from-emerald-400/10 to-transparent blur-3xl -z-10" />
          </div>

        </div>

      </div>

    </section>
  );
}
