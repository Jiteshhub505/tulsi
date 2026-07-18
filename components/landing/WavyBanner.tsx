"use client";

import React from "react";

export default function WavyBanner() {
  const items = [
    "Free Delivery All Over India",
    "Fast Shipping",
    "100% Natural",
    "Clinically Trusted",
    "Zero Chemical Additives",
    "Premium Quality",
  ];

  return (
    <div className="w-full overflow-hidden bg-[#d4fc34] py-3.5 select-none relative border-y border-lime-500/20">
        <style>{`
          @keyframes wavy-banner-marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-wavy-banner {
            display: flex;
            width: max-content;
            animation: wavy-banner-marquee 30s linear infinite;
          }
        `}</style>
        <div className="animate-wavy-banner">
          <div className="flex gap-12 text-emerald-950 font-black tracking-[0.18em] text-xs sm:text-sm uppercase items-center">
            {items.map((item, i) => (
              <span key={i} className="flex items-center gap-12">
                <span>{item}</span>
                <span className="inline-block size-1.5 rounded-full bg-emerald-950" />
              </span>
            ))}
          </div>
          {/* Duplicate the items to make the loop seamless */}
          <div className="flex gap-12 text-emerald-950 font-black tracking-[0.18em] text-xs sm:text-sm uppercase items-center pl-12">
            {items.map((item, i) => (
              <span key={i + items.length} className="flex items-center gap-12">
                <span>{item}</span>
                <span className="inline-block size-1.5 rounded-full bg-emerald-950" />
              </span>
            ))}
          </div>
        </div>
      </div>
  );
}
