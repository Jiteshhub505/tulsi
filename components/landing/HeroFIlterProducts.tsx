"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon: string;
};

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: number;
};

const categories = [
  { id: "gym-foods", name: "Gym Foods", icon: "/hero-1.jpg" },
  { id: "mens-health", name: "Men's Health", icon: "/hero-2.jpg" },
  { id: "womens-health", name: "Women's Health", icon: "/hero-3.jpg" },
  { id: "skin-care", name: "Skin Care", icon: "/hero-4.jpg" },
];

const productsByCategory: Record<string, Product[]> = {
  "gym-foods": [
    {
      id: "gym-1",
      name: "Protein Oats Mix",
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
      price: 699,
      oldPrice: 899,
      discount: 22,
    },
    {
      id: "gym-2",
      name: "Peanut Protein Butter",
      image:
        "https://images.unsplash.com/photo-1622480916113-0196f5a18f2e?auto=format&fit=crop&w=800&q=80",
      price: 549,
      oldPrice: 699,
      discount: 21,
    },
    {
      id: "gym-3",
      name: "Mass Gainer Blend",
      image:
        "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=800&q=80",
      price: 1699,
      oldPrice: 1999,
      discount: 15,
    },
    {
      id: "gym-4",
      name: "Electrolyte Hydration Mix",
      image:
        "https://images.unsplash.com/photo-1603052875614-3a148f7a0c2a?auto=format&fit=crop&w=800&q=80",
      price: 449,
    },
    {
      id: "gym-5",
      name: "Post-Workout Recovery Shake",
      image:
        "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=800&q=80",
      price: 1299,
      oldPrice: 1499,
      discount: 13,
    },
  ],
  "mens-health": [
    {
      id: "men-1",
      name: "Men's Vitality Capsules",
      image:
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80",
      price: 899,
      oldPrice: 1099,
      discount: 18,
    },
    {
      id: "men-2",
      name: "Testo Support Formula",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      price: 1199,
    },
    {
      id: "men-3",
      name: "Prostate Care Herbal Mix",
      image:
        "https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?auto=format&fit=crop&w=800&q=80",
      price: 799,
      oldPrice: 949,
      discount: 16,
    },
    {
      id: "men-4",
      name: "Daily Energy Gummies",
      image:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
      price: 599,
    },
    {
      id: "men-5",
      name: "Muscle Recovery Tablets",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=80",
      price: 999,
      oldPrice: 1249,
      discount: 20,
    },
  ],
  "womens-health": [
    {
      id: "women-1",
      name: "Women's Multivitamin Plus",
      image:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=800&q=80",
      price: 949,
      oldPrice: 1199,
      discount: 21,
    },
    {
      id: "women-2",
      name: "Iron Boost Syrup",
      image:
        "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80",
      price: 499,
    },
    {
      id: "women-3",
      name: "Hormone Balance Support",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
      price: 899,
      oldPrice: 1049,
      discount: 14,
    },
    {
      id: "women-4",
      name: "Calcium D3 Softgels",
      image:
        "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=800&q=80",
      price: 549,
    },
    {
      id: "women-5",
      name: "Hair-Skin-Nails Nutrition",
      image:
        "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80",
      price: 749,
      oldPrice: 899,
      discount: 17,
    },
  ],
  "skin-care": [
    {
      id: "skin-1",
      name: "Neem Face Cleanser",
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      price: 399,
      oldPrice: 499,
      discount: 20,
    },
    {
      id: "skin-2",
      name: "Vitamin C Glow Serum",
      image:
        "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80",
      price: 899,
    },
    {
      id: "skin-3",
      name: "Hydration Gel Moisturizer",
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
      price: 649,
      oldPrice: 799,
      discount: 19,
    },
    {
      id: "skin-4",
      name: "Saffron Night Cream",
      image:
        "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
      price: 999,
    },
    {
      id: "skin-5",
      name: "Aloe Sun Defense SPF 50",
      image:
        "https://images.unsplash.com/photo-1556228720-da4e85f25e0f?auto=format&fit=crop&w=800&q=80",
      price: 549,
      oldPrice: 699,
      discount: 21,
    },
  ],
};

export default function CategoryProducts() {
  const [selectedId, setSelectedId] = useState(categories[2].id);
  const products = productsByCategory[selectedId] ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-10">
      {/* --- CATEGORY SELECTOR GRID --- */}
      <div className="flex flex-wrap gap-3 items-center mb-10">
        <span className="font-bold text-sm text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <span className="text-green-600">▼</span> Select Concern:
        </span>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedId(cat.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer",
              selectedId === cat.id
                ? "bg-green-50 border-green-600 ring-1 ring-green-600 cursor-pointer"
                : "bg-white border-gray-300 hover:border-gray-400 cursor-pointer",
            )}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border">
              <Image
                src={cat.icon}
                alt={cat.name}
                fill
                className="object-cover"
              />
              {selectedId === cat.id && (
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                  <Check size={16} className="text-green-700 font-bold" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* --- SECTION TITLE --- */}
      <h2 className="text-3xl font-bold mb-8 text-gray-900">
        {categories.find((c) => c.id === selectedId)?.name}
      </h2>

      {/* --- PRODUCT GRID --- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative h-72 w-full bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              {product.discount && (
                <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl font-bold">₹{product.price}</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
