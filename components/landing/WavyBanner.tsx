"use client";

import React from "react";

export default function WavyBanner() {
  const textContent = 
    "Free Delivery All Over India • Fast Shipping • 100% Natural • Clinically Trusted • Zero Chemical Additives • Premium Quality • " +
    "Free Delivery All Over India • Fast Shipping • 100% Natural • Clinically Trusted • Zero Chemical Additives • Premium Quality • " +
    "Free Delivery All Over India • Fast Shipping • 100% Natural • Clinically Trusted • Zero Chemical Additives • Premium Quality";

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-zinc-950 py-4 -mt-2">
      <div className="relative w-full min-w-[1440px] h-[90px] mx-auto select-none pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Wavy Ribbon Path (Thick Line) */}
          <path
            d="M -40 50 Q 140 10, 320 50 T 680 50 T 1040 50 T 1400 50 T 1760 50"
            fill="none"
            stroke="#d4fc34"
            strokeWidth="48"
            strokeLinecap="round"
          />

          {/* Invisible Text Path (Shifted down slightly to center text vertically in stroke) */}
          <path
            id="wavy-text-path"
            d="M -40 54 Q 140 14, 320 54 T 680 54 T 1040 54 T 1400 54 T 1760 54"
            fill="none"
            stroke="transparent"
          />

          {/* Wavy Scrolling Text */}
          <text className="font-semibold fill-emerald-950 text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
            <textPath href="#wavy-text-path" startOffset="0%">
              {textContent}
              <animate
                attributeName="startOffset"
                from="0%"
                to="-100%"
                dur="30s"
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
