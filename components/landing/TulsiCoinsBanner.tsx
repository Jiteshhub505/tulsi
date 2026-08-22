"use client";

import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function TulsiCoinsBanner() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-[#fbfdfc] pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-22 md:pb-28 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/5">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
        
        {/* Centered Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-4 py-1.5 rounded-full border border-emerald-300 shadow-2xs">
            <span className="text-base">🪙</span>
            <span>{t("1 Tulsi Coin = ₹1")}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-stone-900 tracking-tight leading-tight">
            {t("How Tulsi Coins Work")}
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-stone-600 font-medium max-w-xl mx-auto leading-relaxed">
            {t("Earn cashback coins on every purchase and redeem them directly at checkout.")}
          </p>
        </div>

        {/* 3-Step Arrow Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-6 relative">
          
          {/* Step 1: 5% Order Cashback */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all text-center flex flex-col items-center justify-center space-y-4 group">
            
            {/* Custom Rich 3D Gold Coins Illustration */}
            <div className="relative size-18 sm:size-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/70 border border-amber-200/80 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <svg className="size-11 sm:size-12 drop-shadow-md" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Back Coin */}
                <ellipse cx="28" cy="22" rx="14" ry="14" fill="url(#goldGradDark)" />
                <ellipse cx="28" cy="22" rx="12" ry="12" fill="url(#goldGrad)" stroke="#FDE68A" strokeWidth="1.5" />
                <path d="M25 17h6M25 21h6M27 17v10M25 21c3 0 4 3 0 5" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />
                
                {/* Front Coin */}
                <circle cx="20" cy="26" r="14" fill="url(#goldGradDark)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
                <circle cx="20" cy="26" r="12" fill="url(#goldGradLight)" stroke="#FEF08A" strokeWidth="1.5" />
                <circle cx="20" cy="26" r="9.5" fill="none" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
                <text x="20" y="31" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350F" fontFamily="sans-serif">₹</text>
                
                {/* Sparkle */}
                <path d="M12 12L13.5 15.5L17 17L13.5 18.5L12 22L10.5 18.5L7 17L10.5 15.5L12 12Z" fill="#FBBF24" />
                
                <defs>
                  <linearGradient id="goldGrad" x1="14" y1="8" x2="42" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FDE047" />
                    <stop offset="0.5" stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="goldGradDark" x1="14" y1="8" x2="42" y2="36" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#D97706" />
                    <stop offset="1" stopColor="#B45309" />
                  </linearGradient>
                  <linearGradient id="goldGradLight" x1="6" y1="12" x2="34" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FEF08A" />
                    <stop offset="0.4" stopColor="#FBBF24" />
                    <stop offset="1" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              {t("Step 1")}
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-stone-900">
              {t("5% Order Cashback")}
            </h4>
            <p className="text-xs sm:text-sm text-stone-500 max-w-[260px] leading-relaxed font-medium">
              {t("Earn 5 coins automatically for every ₹100 spent on your order.")}
            </p>

            {/* Desktop Horizontal Arrow Connector */}
            <div className="hidden md:flex absolute -right-4.5 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white border-2 border-emerald-400 items-center justify-center text-emerald-700 shadow-md">
              <ArrowRight className="size-4.5 stroke-[2.5]" />
            </div>

            {/* Mobile Downward Arrow Connector */}
            <div className="flex md:hidden absolute -bottom-5.5 left-1/2 -translate-x-1/2 z-10 size-9 rounded-full bg-white border-2 border-emerald-400 items-center justify-center text-emerald-700 shadow-md">
              <ArrowDown className="size-4.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Step 2: Saved to Your Mobile */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all text-center flex flex-col items-center justify-center space-y-4 group">
            
            {/* Custom Rich 3D Smartphone & Wallet Illustration */}
            <div className="relative size-18 sm:size-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/70 border border-emerald-200/80 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <svg className="size-11 sm:size-12 drop-shadow-md" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Phone Body */}
                <rect x="13" y="6" width="22" height="36" rx="5" fill="url(#phoneGrad)" stroke="#065F46" strokeWidth="1.5" />
                {/* Phone Screen */}
                <rect x="16" y="10" width="16" height="26" rx="2" fill="#ECFDF5" />
                {/* Phone Notch/Home */}
                <line x1="21" y1="8.5" x2="27" y2="8.5" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="24" cy="38.5" r="1.5" fill="#047857" />
                
                {/* Shield Badge on Screen */}
                <path d="M24 14L30 16.5V22C30 25.5 27.5 28.5 24 29.5C20.5 28.5 18 25.5 18 22V16.5L24 14Z" fill="url(#shieldGrad)" />
                <path d="M21.5 21.5L23.5 23.5L27 19" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Mini Coin Badge */}
                <circle cx="34" cy="32" r="7" fill="#F59E0B" stroke="#FEF08A" strokeWidth="1.2" />
                <text x="34" y="35.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#78350F">🪙</text>

                <defs>
                  <linearGradient id="phoneGrad" x1="13" y1="6" x2="35" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#059669" />
                    <stop offset="1" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="shieldGrad" x1="18" y1="14" x2="30" y2="29.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="1" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              {t("Step 2")}
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-stone-900">
              {t("Saved to Your Mobile")}
            </h4>
            <p className="text-xs sm:text-sm text-stone-500 max-w-[260px] leading-relaxed font-medium">
              {t("Coins are safely stored on your verified phone with zero expiry.")}
            </p>

            {/* Desktop Horizontal Arrow Connector */}
            <div className="hidden md:flex absolute -right-4.5 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white border-2 border-emerald-400 items-center justify-center text-emerald-700 shadow-md">
              <ArrowRight className="size-4.5 stroke-[2.5]" />
            </div>

            {/* Mobile Downward Arrow Connector */}
            <div className="flex md:hidden absolute -bottom-5.5 left-1/2 -translate-x-1/2 z-10 size-9 rounded-full bg-white border-2 border-emerald-400 items-center justify-center text-emerald-700 shadow-md">
              <ArrowDown className="size-4.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Step 3: Instant Discount */}
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all text-center flex flex-col items-center justify-center space-y-4 group">
            
            {/* Custom Rich 3D Shopping Bag & Discount Badge Illustration */}
            <div className="relative size-18 sm:size-20 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100/70 border border-teal-200/80 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <svg className="size-11 sm:size-12 drop-shadow-md" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Bag Handle */}
                <path d="M18 17V12C18 8.68629 20.6863 6 24 6C27.3137 6 30 8.68629 30 12V17" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Bag Body */}
                <rect x="10" y="15" width="28" height="26" rx="5" fill="url(#bagGrad)" stroke="#115E59" strokeWidth="1.5" />
                <path d="M10 21H38" stroke="#134E4A" strokeWidth="1" strokeOpacity="0.3" />
                
                {/* Discount Tag Inside Bag */}
                <rect x="17" y="23" width="14" height="12" rx="3" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
                <text x="24" y="32" textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400E" fontFamily="sans-serif">% OFF</text>
                
                {/* Sparkles */}
                <path d="M37 10L38 12.5L40.5 13.5L38 14.5L37 17L36 14.5L33.5 13.5L36 12.5L37 10Z" fill="#F59E0B" />
                
                <defs>
                  <linearGradient id="bagGrad" x1="10" y1="15" x2="38" y2="41" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14B8A6" />
                    <stop offset="0.5" stopColor="#0D9488" />
                    <stop offset="1" stopColor="#0F766E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
              {t("Step 3")}
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-stone-900">
              {t("Instant Discount")}
            </h4>
            <p className="text-xs sm:text-sm text-stone-500 max-w-[260px] leading-relaxed font-medium">
              {t("Apply coins to pay up to 50% of your cart total at checkout.")}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
