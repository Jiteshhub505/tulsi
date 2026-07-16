"use client";

import React from "react";

export default function NewArrivalMarquee() {
  const words = Array(12).fill("NEW ARRIVAL");

  return (
    <div className="w-full overflow-hidden bg-[#d4fc34] py-3.5 select-none relative z-10 border-y border-lime-500/20">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-custom {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
      `}</style>
      <div className="animate-marquee-custom">
        <div className="flex gap-12 text-zinc-950 font-black tracking-[0.25em] text-xs sm:text-sm uppercase items-center">
          {words.map((w, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>{w}</span>
              <span className="inline-block size-1.5 rounded-full bg-zinc-950" />
            </span>
          ))}
        </div>
        {/* Duplicate the items to make the loop seamless */}
        <div className="flex gap-12 text-zinc-950 font-black tracking-[0.25em] text-xs sm:text-sm uppercase items-center pl-12">
          {words.map((w, i) => (
            <span key={i + words.length} className="flex items-center gap-12">
              <span>{w}</span>
              <span className="inline-block size-1.5 rounded-full bg-zinc-950" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
