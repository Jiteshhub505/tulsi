"use client";

import React from "react";

export default function SingleProductSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50/60 font-sans text-stone-900 pb-20 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-stone-200/80 bg-white/90 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="h-4 w-12 bg-stone-200 rounded" />
          <div className="h-4 w-3 bg-stone-200 rounded" />
          <div className="h-4 w-20 bg-stone-200 rounded" />
          <div className="h-4 w-3 bg-stone-200 rounded" />
          <div className="h-4 w-32 bg-stone-200 rounded" />
        </div>
      </div>

      {/* Main Product Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery Thumbnails & Big Image */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 items-start w-full">
            <div className="flex md:flex-col gap-2.5 shrink-0">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-stone-200" />
              ))}
            </div>
            <div className="w-full aspect-square bg-stone-200 rounded-3xl" />
          </div>

          {/* Right Column: Product Info Skeleton */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="space-y-3">
              <div className="h-5 w-28 bg-emerald-100 rounded-full" />
              <div className="h-8 w-4/5 bg-stone-200 rounded-lg" />
              <div className="h-4 w-1/3 bg-stone-200 rounded" />
            </div>

            {/* Price Box Skeleton */}
            <div className="p-4 bg-stone-100/80 rounded-2xl flex items-center justify-between">
              <div className="h-8 w-28 bg-stone-200 rounded" />
              <div className="h-6 w-20 bg-emerald-100 rounded-full" />
            </div>

            {/* Pack Selector Skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 bg-stone-200 rounded-2xl" />
              <div className="h-20 bg-stone-200 rounded-2xl" />
            </div>

            {/* Quantity & CTA Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-14 w-full sm:w-32 bg-stone-200 rounded-2xl" />
              <div className="h-14 flex-1 bg-stone-200 rounded-2xl" />
              <div className="h-14 flex-1 bg-stone-300 rounded-2xl" />
            </div>

            {/* Badges Skeleton */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-12 bg-stone-100 rounded-xl" />
              <div className="h-12 bg-stone-100 rounded-xl" />
              <div className="h-12 bg-stone-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Experiences Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-6">
        <div className="h-7 w-48 bg-stone-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-stone-200 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
