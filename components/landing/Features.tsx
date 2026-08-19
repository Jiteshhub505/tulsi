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
import Integrations from "./Integrations";
import NewArrivalMarquee from "./NewArrivalMarquee";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface Feature {
  headingKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
}

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

  return (
    <section className="pt-10 w-full pb-2">
      <div className="w-full">
        <NewArrivalMarquee />

        <img
          className="w-full object-contain"
          src="/image-tul.png"
          alt="Ayurvedic ingredients and Veda Shakti product"
        />

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

