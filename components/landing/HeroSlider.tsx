"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Ayurvedic Wellness for Everyday Energy",
    subtitle:
      "Daily formulas crafted from time-tested herbs and clinically trusted ingredients.",
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1800&q=80",
    cta: "Shop Ayurvedic Range",
    link: "/shop/",
  },
  {
    id: 2,
    title: "Nature Meets Modern Nutrition",
    subtitle:
      "Clean, balanced blends that support immunity, recovery, and long-term vitality.",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1800&q=80",
    cta: "Explore Best Sellers",
    link: "/shop/",
  },
  {
    id: 3,
    title: "Real Ingredients, Real Results",
    subtitle:
      "Transparent sourcing and powerful plant-based nutrition made for active lives.",
    image:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1800&q=80",
    cta: "Discover Supplements",
    link: "/shop/",
  },
  {
    id: 4,
    title: "Feel Better, Live Better",
    subtitle:
      "Holistic support for body and mind with trusted products you can use every day.",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=80",
    cta: "Start Your Wellness Journey",
    link: "/shop/",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Autoplay Logic with Pause functionality
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative mt-16 h-[72vh] min-h-[520px] w-full overflow-hidden border-b border-white/10 bg-slate-950 shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Optimized Background Image */}
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            priority={current === 0}
            className="object-cover scale-105"
            sizes="100vw"
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-900/65 to-emerald-950/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <span className="mb-4 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-emerald-100 uppercase backdrop-blur">
              Trusted Ayurvedic Nutrition
            </span>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 max-w-5xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
            >
              {slides[current].title}
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-10 max-w-3xl text-base font-normal text-slate-100 md:text-xl"
            >
              {slides[current].subtitle}
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href={slides[current].link}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer rounded-full bg-emerald-500 px-10 py-4 text-lg font-bold text-emerald-950 shadow-lg shadow-emerald-700/30 transition-colors hover:bg-emerald-400"
                >
                  {slides[current].cta}
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto rounded-full border border-white/30 bg-black/20 p-3 text-white backdrop-blur-md transition-all hover:bg-black/40 active:scale-90"
          aria-label="Next Slide"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === current
                ? "bg-white w-10"
                : "bg-white/40 w-4 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
