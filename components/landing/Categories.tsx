"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function Categories() {
  const { t } = useLanguage();

  const categories = [
    {
      nameKey: "Digestion",
      image: "/digestion.webp",
      link: "/shop?category=Digestion",
    },
    {
      nameKey: "Health & Fitness",
      image: "/health&fitness.webp",
      link: "/shop?category=Health%20%26%20Fitness",
    },
    {
      nameKey: "Stamina and Power",
      image: "/staminaandpower.webp",
      link: "/shop?category=Stamina%20and%20Power",
    },
    {
      nameKey: "Health Disease",
      image: "/healthdisease.webp",
      link: "/shop?category=Health%20Disease",
    },
  ];

  return (
    <section className="w-full py-8 md:py-20 bg-white px-4 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_3.9fr] gap-6 lg:gap-16 items-start">
          
          {/* Left Column: Heading and description */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-md mx-auto lg:mx-0 pb-2 lg:pb-0">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-slate-900 leading-tight tracking-tight mb-4">
              {t("Shop by Category")}
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium mb-6 lg:mb-8">
              {t("Category Subtitle")}
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center text-slate-900 font-bold text-sm md:text-base hover:text-emerald-800 transition-colors group cursor-pointer"
            >
              <span>{t("View All Products")}</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Column: Grid of Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full">
            {categories.map((item, idx) => (
              <Link key={idx} href={item.link} className="group flex flex-col cursor-pointer">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100/50 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:translate-y-[-2px]">
                  <Image
                    src={item.image}
                    alt={t(item.nameKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 sm:mt-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h3 className="font-semibold text-sm sm:text-lg text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {t(item.nameKey)}
                  </h3>
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-800 tracking-wider uppercase mt-0.5 sm:mt-1">
                    <span>{t("Shop Now")}</span>
                    <ArrowRight size={10} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

