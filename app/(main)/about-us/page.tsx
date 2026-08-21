"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Leaf, 
  Heart, 
  Shield, 
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Eye,
  TestTube,
  TreePine
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function AboutUsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/30">
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-6">
            <Leaf size={16} className="text-emerald-700" />
            <span className="text-sm font-semibold text-emerald-900">{t("About TulsiVeda")}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight">
            {t("Ancient Ayurvedic Wisdom")}<br />
            <span className="text-emerald-700">{t("for Modern Wellness")}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed mb-12">
            {t("About Us Hero Subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-8 py-4 rounded-lg transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
                {t("Explore Our Products")}
                <ArrowRight size={18} />
              </button>
            </Link>
            <a href="https://www.instagram.com/tulsiveda2/" target="_blank" rel="noopener noreferrer">
              <button className="border-2 border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold px-8 py-4 rounded-lg transition-all cursor-pointer">
                {t("Get in Touch")}
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2">5000+</div>
              <div className="text-sm text-stone-600 font-medium">{t("Years of Ayurvedic Wisdom")}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2">50K+</div>
              <div className="text-sm text-stone-600 font-medium">{t("Happy Customers")}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2">100+</div>
              <div className="text-sm text-stone-600 font-medium">{t("Natural Products")}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2">100%</div>
              <div className="text-sm text-stone-600 font-medium">{t("Natural & Pure")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                {t("Our Story: Bridging Tradition & Science")}
              </h2>
              <div className="space-y-4 text-stone-700 leading-relaxed">
                <p>{t("Our Story Paragraph 1")}</p>
                <p>{t("Our Story Paragraph 2")}</p>
                <p>{t("Our Story Paragraph 3")}</p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                <Image
                  src="/hero-tulsiveda.webp"
                  alt="TulsiVeda Natural Products"
                  width={600}
                  height={600}
                  className="object-contain w-full"
                />
              </div>
              {/* Decorative background */}
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              {t("Our Mission & Vision")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm rounded-2xl p-10 border border-emerald-100/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">{t("Our Mission")}</h3>
              <p className="text-stone-600 leading-relaxed text-[15px]">
                {t("Mission Text")}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-10 border border-amber-100/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">{t("Our Vision")}</h3>
              <p className="text-stone-600 leading-relaxed text-[15px]">
                {t("Vision Text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              {t("What We Stand For")}
            </h2>
            <p className="text-stone-500 text-base max-w-2xl mx-auto">
              {t("What We Stand For Subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value 1 */}
            <div className="bg-white rounded-xl p-8 border-2 border-stone-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Leaf size={28} className="text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-3">{t("100% Natural")}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t("Natural Value Desc")}
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-xl p-8 border-2 border-stone-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <TestTube size={28} className="text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-3">{t("Scientifically Tested")}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t("Tested Value Desc")}
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-xl p-8 border-2 border-stone-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                <Heart size={28} className="text-rose-700" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-3">{t("Holistic Wellness")}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t("Holistic Value Desc")}
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white rounded-xl p-8 border-2 border-stone-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Award size={28} className="text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-3">{t("Certified Quality")}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {t("Quality Value Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Ayurveda Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("Why Choose Ayurveda?")}
            </h2>
            <p className="text-emerald-50 text-lg leading-relaxed">
              {t("Why Choose Ayurveda Subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-8 h-8 rounded-full bg-emerald-300/30 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 size={18} className="text-emerald-200" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">{t("Natural & Safe")}</h4>
                <p className="text-emerald-100 text-sm">{t("Natural & Safe Subtitle")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-8 h-8 rounded-full bg-emerald-300/30 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 size={18} className="text-emerald-200" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">{t("Personalized Approach")}</h4>
                <p className="text-emerald-100 text-sm">{t("Personalized Approach Subtitle")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-8 h-8 rounded-full bg-emerald-300/30 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 size={18} className="text-emerald-200" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">{t("Preventive Care")}</h4>
                <p className="text-emerald-100 text-sm">{t("Preventive Care Subtitle")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-8 h-8 rounded-full bg-emerald-300/30 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 size={18} className="text-emerald-200" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">{t("Sustainable Wellness")}</h4>
                <p className="text-emerald-100 text-sm">{t("Sustainable Wellness Subtitle")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              {t("The TulsiVeda Promise")}
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              {t("The TulsiVeda Promise Subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Promise 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t("Purity Guaranteed")}</h3>
              <p className="text-stone-600 leading-relaxed">
                {t("Purity Promise Desc")}
              </p>
            </div>

            {/* Promise 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine size={32} className="text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t("Sustainably Sourced")}</h3>
              <p className="text-stone-600 leading-relaxed">
                {t("Source Promise Desc")}
              </p>
            </div>

            {/* Promise 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{t("Customer First")}</h3>
              <p className="text-stone-600 leading-relaxed">
                {t("Customer Promise Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 px-4 bg-gradient-to-br from-stone-100 to-amber-50/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              {t("Our Journey")}
            </h2>
            <p className="text-stone-600 text-lg">
              {t("Milestones Subtitle")}
            </p>
          </div>

          <div className="space-y-12">
            {/* Timeline Item 1 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                01
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-stone-900 mb-2">{t("Timeline 1 Title")}</h3>
                <p className="text-stone-600 leading-relaxed">
                  {t("Timeline 1 Desc")}
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                02
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-stone-900 mb-2">{t("Timeline 2 Title")}</h3>
                <p className="text-stone-600 leading-relaxed">
                  {t("Timeline 2 Desc")}
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                03
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-stone-900 mb-2">{t("Timeline 3 Title")}</h3>
                <p className="text-stone-600 leading-relaxed">
                  {t("Timeline 3 Desc")}
                </p>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                04
              </div>
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-stone-900 mb-2">{t("Timeline 4 Title")}</h3>
                <p className="text-stone-600 leading-relaxed">
                  {t("Timeline 4 Desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles size={16} />
            <span className="text-sm font-medium">{t("Start Your Journey")}</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("Experience the Power of Ayurveda")}
          </h2>
          
          <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
            {t("Final CTA Subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <button className="bg-white text-emerald-900 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-lg transition-all cursor-pointer inline-flex items-center gap-2 shadow-lg">
                {t("Shop Products")}
                <ArrowRight size={18} />
              </button>
            </Link>
            <a href="https://www.instagram.com/tulsiveda2/" target="_blank" rel="noopener noreferrer">
              <button className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all cursor-pointer">
                {t("Contact Us")}
              </button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">100%</div>
                <div className="text-emerald-100 text-sm">{t("Natural Ingredients")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">99%</div>
                <div className="text-emerald-100 text-sm">{t("Customer Satisfaction")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-emerald-100 text-sm">{t("Expert Support")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
