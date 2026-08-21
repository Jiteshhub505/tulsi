"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function SpecialOffers() {
  const offers = [
    {
      subtitle: "Flat 20% OFF",
      title: "Ultimate Vitality Combo",
      description: "Veda Shakti + Pure Shilajit. Boost your energy, stamina & vigor.",
      image: "/offer_vitality.webp",
      link: "/shop",
      gradient: "from-amber-600 via-amber-700 to-amber-950",
      accent: "text-amber-300",
    },
    {
      subtitle: "Buy 2 Save 10%",
      title: "Piles Care Twin Pack",
      description: "Complete Ayurvedic recovery and relief comfort pack.",
      image: "/offer_piles.webp",
      link: "/shop",
      gradient: "from-[#5b4a7d] via-[#483a66] to-[#2b1f45]",
      accent: "text-purple-300",
    },
    {
      subtitle: "Special Price",
      title: "Daily Wellness Bundle",
      description: "Complete Ayurvedic health booster pack for daily energy.",
      image: "/offer_wellness.webp",
      link: "/shop",
      gradient: "from-emerald-700 via-emerald-800 to-emerald-950",
      accent: "text-emerald-300",
    },
  ];

  return (
    <section className="w-full py-8 md:py-16 bg-[#fafdfb] px-4 md:px-12 lg:px-16 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading with Decorative Lines */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
          <div className="hidden sm:block h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-slate-300" />
          <span className="text-amber-600 font-serif text-sm md:text-base tracking-widest uppercase">♦</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-slate-800 font-bold tracking-tight text-center">
            Special Offers Just for You
          </h2>
          <span className="text-amber-600 font-serif text-sm md:text-base tracking-widest uppercase">♦</span>
          <div className="hidden sm:block h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-slate-300" />
        </div>

        {/* Responsive Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((item, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-[24px] bg-gradient-to-br ${item.gradient} p-6 sm:p-8 flex flex-col justify-between h-[230px] sm:h-[260px] text-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1`}
            >
              {/* Floating Product Image Container on Right */}
              <div className="absolute right-0 bottom-0 top-0 w-[42%] sm:w-[45%] h-full pointer-events-none select-none overflow-hidden rounded-r-[24px]">
                {/* Gradient overlay to smoothly blend the image into the card background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/20 via-transparent to-transparent z-10" />
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-w-768px) 50vw, 30vw"
                  className="object-cover object-center opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text Layout (Left Column - 58% width to avoid overlapping image) */}
              <div className="w-[58%] flex flex-col justify-between h-full z-20 relative">
                <div>
                  <span className={`${item.accent} text-[10px] sm:text-xs font-bold tracking-widest uppercase block mb-1.5`}>
                    {item.subtitle}
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold leading-tight tracking-tight text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <Link href={item.link}>
                  <button className="bg-white/95 hover:bg-white text-slate-900 text-[10px] sm:text-xs font-bold tracking-widest uppercase py-2 px-5 sm:py-2.5 sm:px-6 rounded-full transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg cursor-pointer">
                    SHOP NOW
                  </button>
                </Link>
              </div>

              {/* Top Accent Light Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
