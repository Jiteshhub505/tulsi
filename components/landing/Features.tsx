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

interface Feature {
  heading: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature43Props {
  title?: string;
  features?: Feature[];
}

const Features = ({
  title = "Veda Shakti: Premium Ayurvedic Ingredients",
  features = [
    {
      heading: "Ashwagandha",
      description:
        "Reduces stress and daily fatigue while supporting optimal muscle growth. Helps maintain healthy cortisol levels for better endurance.",
      icon: <BatteryCharging className="size-6" />,
    },
    {
      heading: "Amla Extract",
      description:
        "Boosts immunity and improves digestion with natural Vitamin C. Supports cellular health and enhances your body's natural defense.",
      icon: <ShieldCheck className="size-6" />,
    },
    {
      heading: "Gokshura",
      description:
        "Supports active muscle growth and boosts overall vitality. Rejuvenates the body to increase energy and healthy physical performance.",
      icon: <Flame className="size-6" />,
    },
    {
      heading: "Pippali",
      description:
        "Enhances healthy appetite and maximizes nutrient absorption. Stimulates metabolism to help your body efficiently process nutrients.",
      icon: <HeartPulse className="size-6" />,
    },
    {
      heading: "Kaunch Beej",
      description:
        "Helps in rapid muscle recovery and increases energy and stamina. A natural strength booster that supports nervous system function.",
      icon: <Activity className="size-6" />,
    },
    {
      heading: "100% Natural",
      description:
        "30 capsules of pure Ayurvedic formulation with no synthetic additives. Rigorously tested for maximum purity and effectiveness.",
      icon: <Leaf className="size-6" />,
    },
  ],
}: Feature43Props) => {
  return (
    <section className="pt-10 w-full pb-2">
      <div className="w-full">
        <NewArrivalMarquee />
        {/* Section Title */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-slate-500 text-sm md:text-base">
            A powerful blend of ancient Ayurvedic herbs, crafted for modern wellness.
          </p>
        </div>

        <img
          className="w-full object-contain"
          src="/image-tul.png"
          alt="Ayurvedic ingredients and Veda Shakti product"
        />

        {/* <Integrations /> */}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col bg-white dark:bg-zinc-900 p-8 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-md hover:z-10">
              <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-full">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">{feature.heading}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Shop CTA */}
        <div className="flex justify-center py-10">
          <Link href="/shop/148c338c-bf9f-49c2-8c86-1fda31b15a88">
            <button className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-700/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-sm tracking-wide">
              <ShoppingBag size={18} />
              Shop Veda Shakti
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
