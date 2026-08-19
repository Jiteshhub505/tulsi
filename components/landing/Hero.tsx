"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import { useLanguage } from "@/context/language-context";

const slides = [
  {
    id: 1,
    desktopImage: "/hero1img.png",
    mobileImage: "/herom1.webp",
    alt: "Veda Shakti - Natural Power, Stronger You",
  },
  {
    id: 2,
    desktopImage: "/hero2img.png",
    mobileImage: "/herom2_v2.webp",
    alt: "Piles Care - Relief, Comfort, Freedom",
  },
  {
    id: 3,
    desktopImage: "/hero3img.png",
    mobileImage: "/herom3.webp",
    alt: "Pure Shilajit - Vitality and Vigor",
  },
];

export default function Hero() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Autoplay loop every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section
      className="relative w-full h-[calc(100vh-60px)] md:aspect-[16/9] md:h-auto xl:aspect-auto xl:h-[calc(100vh-70px)] overflow-hidden bg-[#fafdfb] shadow-xs"
    >
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Hero Banner Image - Desktop vs Mobile */}
          <div className="relative w-full h-full">
            {/* Desktop Image */}
            <div className="hidden md:block relative w-full h-full">
              <Image
                src={slides[current].desktopImage}
                alt={slides[current].alt}
                fill
                priority
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>
            {/* Mobile/Tablet Image */}
            <div className="block md:hidden relative w-full h-full">
              <Image
                src={slides[current].mobileImage}
                alt={slides[current].alt}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Interactive Button Overlay - positioned on the image */}
          <div className="absolute left-1/2 -translate-x-1/2 md:left-[8%] md:translate-x-0 bottom-[48%] sm:bottom-[15%] md:bottom-[20%] flex flex-row items-center gap-3 sm:gap-4 md:gap-6 z-10 w-max">
            <Link href="/shop">
              <button className="group relative inline-flex items-center justify-center bg-[#7db73c] hover:bg-[#72a635] text-white font-semibold rounded-full shadow-[0_4px_12px_rgba(125,183,60,0.25)] hover:shadow-[0_6px_18px_rgba(125,183,60,0.35)] transition-all duration-300 transform active:scale-95 cursor-pointer text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg py-2.5 xs:py-3 sm:py-2.5 md:py-3 lg:py-3.5 px-5 xs:px-7 sm:px-6 md:px-8 lg:px-10">
                <span>{t("Shop Now")}</span>
                <ArrowRight className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </button>
            </Link>
            <Link href="/shop">
              <button className="group inline-flex items-center justify-center border border-emerald-950/20 hover:border-emerald-950/40 text-emerald-950 font-semibold rounded-full hover:bg-emerald-900/5 transition-all duration-300 active:scale-95 cursor-pointer text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg py-2.5 xs:py-3 sm:py-2.5 md:py-3 lg:py-3.5 px-5 xs:px-7 sm:px-6 md:px-8 lg:px-10">
                <span>{t("View All Products")}</span>
              </button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Slide Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-3 md:px-6 pointer-events-none z-20">
        <button
          onClick={prevSlide}
          className="pointer-events-auto rounded-full border border-black/10 bg-white/40 hover:bg-white/70 p-1 xs:p-2 sm:p-2.5 md:p-3 text-emerald-900 hover:text-emerald-950 backdrop-blur-xs transition-all duration-300 active:scale-90 shadow-xs cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto rounded-full border border-black/10 bg-white/40 hover:bg-white/70 p-1 xs:p-2 sm:p-2.5 md:p-3 text-emerald-900 hover:text-emerald-950 backdrop-blur-xs transition-all duration-300 active:scale-90 shadow-xs cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Pagination Bullet Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2.5 md:gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${index === current
              ? "bg-emerald-700 w-5 sm:w-8 h-1 sm:h-1.5"
              : "bg-emerald-900/30 w-1 sm:w-1.5 h-1 sm:h-1.5 hover:bg-emerald-900/50"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
