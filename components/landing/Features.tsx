"use client";

import {
  BatteryCharging,
  Flame,
  GitPullRequest,
  HeartPulse,
  Layers,
  Leaf,
  RadioTower,
  ShieldCheck,
  SquareKanban,
  TrendingUp,
  WandSparkles,
  Activity,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface Feature {
  headingKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
}

const CAROUSEL_IMAGES = [
  "/image-tul.png",
  "/new2.png",
  "/new3.png",
  "/new4.png",
  "/new5.png",
];

const defaultFeatures: Feature[] = [
  {
    headingKey: "Ashwagandha",
    descriptionKey: "Ashwagandha Desc",
    icon: <BatteryCharging className="size-6" />,
  },
  {
    headingKey: "Amla Extract",
    descriptionKey: "Amla Desc",
    icon: <ShieldCheck className="size-6" />,
  },
  {
    headingKey: "Gokshura",
    descriptionKey: "Gokshura Desc",
    icon: <Flame className="size-6" />,
  },
  {
    headingKey: "Pippali",
    descriptionKey: "Pippali Desc",
    icon: <HeartPulse className="size-6" />,
  },
  {
    headingKey: "Kaunch Beej",
    descriptionKey: "Kaunch Beej Desc",
    icon: <Activity className="size-6" />,
  },
  {
    headingKey: "100% Natural",
    descriptionKey: "Natural Formula Desc",
    icon: <Leaf className="size-6" />,
  },
];

const Features = () => {
  const { t, translateText } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-6 w-full pb-2">
      <div className="w-full space-y-8">
        
        {/* Infographic Image Carousel */}
        <div className="relative w-full overflow-hidden group bg-stone-50">
          <div
            className="flex transition-transform duration-700 ease-in-out w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {CAROUSEL_IMAGES.map((img, idx) => (
              <div key={idx} className="w-full shrink-0 flex justify-center">
                <img
                  className="w-full h-[280px] xs:h-[340px] sm:h-[440px] md:h-[540px] lg:h-[640px] object-cover sm:object-contain object-center"
                  src={img}
                  alt={`Veda Shakti feature slide ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows (Hidden on Mobile) */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10 shadow-md items-center justify-center"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10 shadow-md items-center justify-center"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>

        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center items-center gap-2 -mt-2">
          <div className="flex items-center gap-2 bg-stone-200/90 backdrop-blur-xs px-4 py-2 rounded-full shadow-2xs border border-stone-300/60">
            {CAROUSEL_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? "w-8 bg-emerald-700 shadow-xs" : "w-2.5 bg-stone-400 hover:bg-stone-600"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {defaultFeatures.map((feature, i) => (
            <div key={i} className="flex flex-col bg-white dark:bg-zinc-900 p-8 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md hover:z-10">
              <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-full">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">{t(feature.headingKey)}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>

        {/* Shop CTA */}
        <div className="flex justify-center py-10">
          <Link href="/shop/148c338c-bf9f-49c2-8c86-1fda31b15a88">
            <button className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-sm tracking-wide">
              <ShoppingBag size={18} />
              {t("Shop Veda Shakti")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;

