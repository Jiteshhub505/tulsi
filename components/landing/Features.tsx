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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useState, useEffect } from "react";
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
    icon: <BatteryCharging className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Amla Extract",
    descriptionKey: "Amla Desc",
    icon: <ShieldCheck className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Gokshura",
    descriptionKey: "Gokshura Desc",
    icon: <Flame className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Pippali",
    descriptionKey: "Pippali Desc",
    icon: <HeartPulse className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Kaunch Beej",
    descriptionKey: "Kaunch Beej Desc",
    icon: <Activity className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Safed Musli",
    descriptionKey: "Safed Musli Desc",
    icon: <TrendingUp className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Shatavari",
    descriptionKey: "Shatavari Desc",
    icon: <WandSparkles className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Pure Shilajit",
    descriptionKey: "Shilajit Desc",
    icon: <Layers className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Vidarikand",
    descriptionKey: "Vidarikand Desc",
    icon: <SquareKanban className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Akarkara",
    descriptionKey: "Akarkara Desc",
    icon: <RadioTower className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Salam Panja",
    descriptionKey: "Salam Panja Desc",
    icon: <GitPullRequest className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Giloy (Guduchi)",
    descriptionKey: "Giloy Desc",
    icon: <ShieldCheck className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Punarnava",
    descriptionKey: "Punarnava Desc",
    icon: <Activity className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Brahmi",
    descriptionKey: "Brahmi Desc",
    icon: <WandSparkles className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Shankhpushpi",
    descriptionKey: "Shankhpushpi Desc",
    icon: <HeartPulse className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Yashad Bhasma",
    descriptionKey: "Yashad Bhasma Desc",
    icon: <Flame className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Swarna Bhasma",
    descriptionKey: "Swarna Bhasma Desc",
    icon: <TrendingUp className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Tulsi Extract",
    descriptionKey: "Tulsi Desc",
    icon: <Leaf className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Haritaki",
    descriptionKey: "Haritaki Desc",
    icon: <Layers className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Triphala",
    descriptionKey: "Triphala Desc",
    icon: <ShieldCheck className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Neem Giri",
    descriptionKey: "Neem Giri Desc",
    icon: <Leaf className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Kanchnar Guggul",
    descriptionKey: "Kanchnar Guggul Desc",
    icon: <Flame className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Musta",
    descriptionKey: "Musta Desc",
    icon: <Activity className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Vai Bidag",
    descriptionKey: "Vai Bidag Desc",
    icon: <WandSparkles className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Bakayan Migi",
    descriptionKey: "Bakayan Migi Desc",
    icon: <ShieldCheck className="size-6 text-emerald-700 text-emerald-700" />,
  },
  {
    headingKey: "Sona Mukhi",
    descriptionKey: "Sona Mukhi Desc",
    icon: <TrendingUp className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Mandur Bhasam",
    descriptionKey: "Mandur Bhasam Desc",
    icon: <BatteryCharging className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Nishoth",
    descriptionKey: "Nishoth Desc",
    icon: <Leaf className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Katha",
    descriptionKey: "Katha Desc",
    icon: <Layers className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Chitrak Mool",
    descriptionKey: "Chitrak Mool Desc",
    icon: <Flame className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Shank Bhasam",
    descriptionKey: "Shank Bhasam Desc",
    icon: <ShieldCheck className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Daruhaldi",
    descriptionKey: "Daruhaldi Desc",
    icon: <WandSparkles className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Rasonth",
    descriptionKey: "Rasonth Desc",
    icon: <HeartPulse className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "Kutki",
    descriptionKey: "Kutki Desc",
    icon: <Activity className="size-6 text-emerald-700" />,
  },
  {
    headingKey: "100% Natural",
    descriptionKey: "Natural Formula Desc",
    icon: <Leaf className="size-6 text-emerald-700" />,
  },
];

const Features = () => {
  const { t, translateText } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 30;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const visibleFeatures = showAllFeatures ? defaultFeatures : defaultFeatures.slice(0, 9);

  return (
    <section className="pt-6 w-full pb-8">
      <div className="w-full space-y-8">
        
        {/* Infographic Image Carousel */}
        <div
          className="relative w-full overflow-hidden group bg-stone-50 touch-pan-y select-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {CAROUSEL_IMAGES.map((img, idx) => (
              <div key={idx} className="w-full shrink-0 flex justify-center">
                <img
                  className="w-full h-[280px] xs:h-[340px] sm:h-[440px] md:h-[540px] lg:h-[640px] object-cover sm:object-contain object-center pointer-events-none"
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

        {/* Ingredients Grid Cards */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visibleFeatures.map((feature, i) => (
            <div key={i} className="flex flex-col bg-white dark:bg-zinc-900 p-8 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md hover:z-10">
              <div className="bg-emerald-100/80 text-emerald-800 mb-4 flex size-12 items-center justify-center rounded-full border border-emerald-200/60">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">{t(feature.headingKey)}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>

        {/* Show More / Show Less Button */}
        <div className="flex justify-center pt-4 pb-4">
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-8 py-3.5 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-sm tracking-wide"
          >
            <span>
              {showAllFeatures
                ? t("Show Less")
                : `${t("Show More Ingredients")} (${defaultFeatures.length - 9} ${t("More")})`}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllFeatures ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;

