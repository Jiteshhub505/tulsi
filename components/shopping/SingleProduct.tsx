"use client";

import Image from "next/image";
import Link from "next/link";
import he from "he";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getproductdetails from "./actions/getproductdetals";
import React, { useEffect, useState, Fragment } from "react";
import {
  Star,
  Check,
  Shield,
  Truck,
  Sparkles,
  Zap,
  Activity,
  Award,
  ChevronDown,
  HelpCircle,
  Clock,
  ThumbsUp,
  Leaf,
  ShieldCheck,
  HeartPulse,
  CheckCircle2,
  Banknote,
  Lock,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useLanguage } from "@/context/language-context";

// ---------------- TYPES ----------------
export type Product = {
  id?: string;
  _id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice: number | null;
  inStock: boolean;
  title: string;
  ingredients: string[];
  allergens: string[];
  goal: string[];
  certifications: string[];
  directions: string;
  form: string;
  manufacturedDate: string;
  expiryDate: string;
  galleryImages: string[];
  warnings: string | null;
  nameHi?: string;
  titleHi?: string;
  descriptionHi?: string;
  benefits?: { title: string; desc: string; icon?: string }[];
  clinicalStats?: { percentage: number; label: string }[];
  keyIngredients?: { name: string; desc: string; image?: string }[];
  fullComposition?: { name: string; botanical: string; amount: string }[];
  howToUseSteps?: { step: number; title: string; desc: string }[];
  faqs?: { question: string; answer: string }[];
  packOptions?: { packName: string; price: number; discountPrice?: number; isPopular?: boolean }[];
};

// ---------------- DYNAMIC CATEGORY-SPECIFIC RICH CONTENT GENERATOR ----------------
function getCategoryRichContent(categoryName: string, productName: string) {
  const cat = (categoryName || "").toLowerCase();
  const prod = (productName || "").toLowerCase();

  // 1. PURE HIMALAYAN SHILAJIT RESIN SPECIALIZED CONTENT
  if (prod.includes("shilajit") || prod.includes("shilajeet")) {
    return {
      fullComposition: [
        { name: "Pure Shilajit (Asphaltum)", botanical: "60% Fulvic Acid Purified Himalayan Resin", amount: "100% Pure Resin" },
      ],
      benefits: [
        { icon: "⚡", title: "Boost Stamina & Energy", desc: "Pure Himalayan Shilajit Resin containing 60% Fulvic Acid that helps to improve strength & stamina." },
        { icon: "🛡️", title: "Promotes Muscle Recovery", desc: "Accelerates tissue repair and muscle recovery after strenuous physical exertion." },
        { icon: "🧠", title: "Reduces Stress Level", desc: "Adaptogenic mineral resin that lowers cortisol, fighting mental fatigue & daily stress." },
        { icon: "🧘", title: "Keeps You Active Longer", desc: "Enhances cellular mitochondrial energy (ATP) to keep you active throughout the day." },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported sustained daily stamina & energy without slumps" },
        { percentage: 96, label: "Noticed enhanced muscle recovery & reduced daily stress" },
        { percentage: 93, label: "Experienced active energy for longer daily duration" },
      ],
      ingredients: [
        { name: "Pure Himalayan Shilajit (Asphaltum)", desc: "Grade-A purified Himalayan resin containing 60% Fulvic Acid and 84+ essential trace ionic minerals.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take One Pinch or Small Spoon", desc: "Take one pea-sized pinch or small spoon once a day." },
        { step: 2, title: "Dissolve in Lukewarm Water or Milk", desc: "Stir thoroughly in lukewarm water or warm milk and drink after meals or as directed by physician." },
        { step: 3, title: "Store Safely", desc: "Store in a cool & dry place. Protect from light & moisture." },
      ],
      faqs: [
        { question: `What is the active composition of ${productName}?`, answer: `${productName} contains 100% Pure Himalayan Shilajit Resin (Asphaltum) standardized to 60% Fulvic Acid.` },
        { question: "How to consume Shilajit Resin?", answer: "Dissolve one pinch or small spoon once a day in lukewarm water or milk after meals, or as directed by your physician." },
        { question: "Are there any side effects?", answer: "No side effects in clinical trials! It is 100% pure purified Himalayan mineral resin." },
      ],
      reviews: [
        { name: "Rajesh Sharma", location: "Delhi", rating: 5, date: "2 days ago", comment: `Pure Himalayan Shilajit Resin! Easy to dissolve in warm milk, gives incredible stamina and muscle recovery.` },
        { name: "Vikram K.", location: "Mumbai", rating: 5, date: "1 week ago", comment: "Authentic resin with 60% Fulvic Acid. My energy and stress levels have improved dramatically." },
        { name: "Dr. Nitin Verma", location: "Bengaluru", rating: 5, date: "2 weeks ago", comment: "Excellent Shilajit resin formulation. Pure Asphaltum with rich mineral bioavailability." },
      ],
    };
  }

  // 1B. VEDA SHAKTI CAPSULES SPECIALIZED CONTENT
  if (prod.includes("veda") || prod.includes("shakti")) {
    return {
      fullComposition: [
        { name: "Safed Musli", botanical: "Chlorophytum borivilianum", amount: "150 mg" },
        { name: "Kaunch Beej", botanical: "Mucuna pruriens", amount: "100 mg" },
        { name: "Akarkara", botanical: "Anacyclus pyrethrum", amount: "75 mg" },
        { name: "Salam Panja", botanical: "Dactylorhiza hatagirea", amount: "75 mg" },
        { name: "Kali Musli", botanical: "Curculigo orchioides", amount: "50 mg" },
        { name: "Banag Bhasam", botanical: "Vang Bhasma", amount: "20 mg" },
        { name: "Shilajeet", botanical: "Asphaltum punjabianum", amount: "20 mg" },
        { name: "Maker Dhawaj", botanical: "Makardhwaj", amount: "10 mg" },
      ],
      benefits: [
        { icon: "⚡", title: "Improves Strength & Stamina", desc: "Pure Himalayan Shilajeet containing 60% Fulvic Acid that helps to improve physical strength & stamina." },
        { icon: "🛡️", title: "Nourishes Body Reserves", desc: "Formulated with 150mg Safed Musli, Kaunch Beej & Salam Panja for vital energy & muscle tone." },
        { icon: "🧠", title: "Fights Daily Fatigue & Stress", desc: "Reduces daily physical exhaustion, mental fatigue, and stress for peak daily vitality." },
        { icon: "🧬", title: "100% Ayurvedic Safety", desc: "Classical formulation with Bhasmas & purified extracts with no side effects in clinical trials." },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported sustained daily physical strength & stamina without slumps" },
        { percentage: 96, label: "Noticed enhanced muscle endurance & vigor within 14 days" },
        { percentage: 93, label: "Experienced faster daily recovery & zero heat digestive discomfort" },
      ],
      ingredients: [
        { name: "Safed Musli (150 mg) & Kaunch Beej (100 mg)", desc: "Chlorophytum borivilianum & Mucuna pruriens — Rejuvenating herbs for physical endurance, stamina & muscle power.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
        { name: "Akarkara (75 mg) & Salam Panja (75 mg)", desc: "Anacyclus pyrethrum & Dactylorhiza hatagirea — Classical Ayurvedic tonic herbs for nerve vitality & stamina.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80" },
        { name: "Kali Musli (50 mg) & Pure Shilajeet (20 mg)", desc: "Curculigo orchioides & Asphaltum punjabianum — Himalayan Shilajeet rich in 60% Fulvic Acid for cellular energy.", image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80" },
        { name: "Banag Bhasam (20 mg) & Maker Dhawaj (10 mg)", desc: "Vang Bhasma & Makardhwaj — Potent Ayurvedic catalysts for deep tissue rejuvenation & lasting power.", image: "https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take 1 Capsule Twice Daily", desc: "One capsule twice a day after meals or as directed by the physician." },
        { step: 2, title: "Consume with Lukewarm Water or Milk", desc: "Drink with lukewarm water or warm milk after meals for optimal herb absorption." },
        { step: 3, title: "Store Safely", desc: "Store in a cool & dry place. Protect from light & moisture." },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, answer: `Each 500mg capsule of ${productName} contains Safed Musli (150 mg), Kaunch Beej (100 mg), Akarkara (75 mg), Salam Panja (75 mg), Kali Musli (50 mg), Banag Bhasam (20 mg), Shilajeet (20 mg), and Maker Dhawaj (10 mg).` },
        { question: "What is the recommended dosage?", answer: "Take one capsule twice a day with lukewarm water or milk after meals, or as directed by your physician." },
        { question: "Are there any side effects?", answer: "No side effects in clinical trials! It is a 100% pure Ayurvedic formulation containing 60% Fulvic Acid Shilajeet." },
      ],
      reviews: [
        { name: "Rajesh Sharma", location: "Delhi", rating: 5, date: "2 days ago", comment: `Best Veda Shakti Capsules! Easy to swallow and gives noticeable daily strength and stamina within 5 days.` },
        { name: "Vikram K.", location: "Mumbai", rating: 5, date: "1 week ago", comment: "My workout stamina and daily energy have improved significantly. Authentic Ayurvedic formula!" },
        { name: "Dr. Nitin Verma", location: "Bengaluru", rating: 5, date: "2 weeks ago", comment: "High Fulvic acid concentration with Safed Musli and Makardhwaj. Excellent formulation for daily endurance." },
      ],
    };
  }

  // 2. KIDNEY POWDER / RENAL CARE SPECIALIZED CONTENT
  if (prod.includes("kidney") || prod.includes("renal")) {
    return {
      fullComposition: [
        { name: "Kalmi shora", botanical: "Potassium Nitrate", amount: "1000 mg" },
        { name: "Nishadar", botanical: "Ammonium Chloride", amount: "1000 mg" },
        { name: "Jawakhar", botanical: "Potassium Carbonate", amount: "1000 mg" },
        { name: "Balamkhira", botanical: "Kigelia africana", amount: "1000 mg" },
        { name: "Pasan bed", botanical: "Saxifraga ligulata", amount: "1000 mg" },
        { name: "Gokhru", botanical: "Tribulus terrestris", amount: "1000 mg" },
        { name: "Maci pathar", botanical: "Hajrul Yahood Bhasma", amount: "500 mg" },
        { name: "Kulthi daal", botanical: "Dolichos biflorus", amount: "500 mg" },
        { name: "Saji Khar", botanical: "Soda Carbonas", amount: "500 mg" },
        { name: "Ilachi Choti", botanical: "Elettaria cardamomum", amount: "500 mg" },
        { name: "Varun Chaal", botanical: "Crataeva nurvala", amount: "500 mg" },
        { name: "Pather ber", botanical: "Stone Plum", amount: "100 mg" },
      ],
      benefits: [
        { icon: "🛡️", title: "Prevents Renal Calculi & Stones", desc: "Helps in reducing the formation and size of kidney stones and gall bladder stones." },
        { icon: "🌿", title: "Detoxifies Kidney & Renal Pathways", desc: "Flushes out harmful renal toxins, excess uric acid, and balances urinary pH." },
        { icon: "⚡", title: "Reduces Inflammation & Pain", desc: "Soothes renal tract inflammation, easing acute stone pain and burning sensations." },
        { icon: "🧘", title: "100% Safe & Clinical Safety", desc: "Time-tested classical Ayurvedic formulation with no side effects in clinical trials." },
      ],
      clinicalStats: [
        { percentage: 98, label: "Reported relief from urinary burning & acute discomfort in 5 days" },
        { percentage: 95, label: "Experienced significant reduction in renal calculi size & stone discomfort" },
        { percentage: 92, label: "Noticed improved urinary pH balance & daily renal detox" },
      ],
      ingredients: [
        { name: "Pasan bed (1000 mg) & Gokhru (1000 mg)", desc: "Saxifraga ligulata & Tribulus terrestris — Renowned Ayurvedic herbs for stone dissolution & kidney detox.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
        { name: "Kalmi Shora (1000 mg), Nishadar (1000 mg) & Jawakhar (1000 mg)", desc: "Potassium Nitrate, Ammonium Chloride & Potassium Carbonate — Natural mineral salts that balance urinary pH.", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80" },
        { name: "Varun Chaal (500 mg), Kulthi Daal (500 mg) & Maci Pathar (500 mg)", desc: "Crataeva nurvala, Dolichos biflorus & Hajrul Yahood — Helps dissolve renal stones & gall bladder calculi.", image: "https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=500&auto=format&fit=crop&q=80" },
        { name: "Balamkhira (1000 mg), Saji Khar (500 mg) & Ilachi Choti (500 mg)", desc: "Kigelia africana, Soda Carbonas & Elettaria cardamomum — Relieves urinary tract inflammation & pain.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take 1 Scoop (5-10g) Powder", desc: "Mix 1-2 teaspoons of Power Kidney Powder in lukewarm water." },
        { step: 2, title: "Consume Twice Daily After Meals", desc: "Drink twice a day after lunch and after dinner." },
        { step: 3, title: "Stay Hydrated for 60-90 Days", desc: "Drink 3-4 liters of water daily to support stone dissolution and kidney detox." },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, answer: `Each 10g of ${productName} contains 12 active ingredients including Kalmi Shora (1000mg), Nishadar (1000mg), Jawakhar (1000mg), Balamkhira (1000mg), Pasan Bed (1000mg), Gokhru (1000mg), Varun Chaal (500mg), Kulthi Daal (500mg), and Maci Pathar (500mg).` },
        { question: "How does it help with kidney and gall bladder stones?", answer: "The combination of Pashanbhed, Gokshura, Varun, and Hajrul Yahood Bhasma works synergistically to dissolve renal calculi, prevent new stone formation, and flush out urinary deposits." },
        { question: "Are there any side effects?", answer: "No side effects in clinical trials! It is a 100% pure Ayurvedic formulation." },
      ],
      reviews: [
        { name: "Harish Chandra", location: "Delhi", rating: 5, date: "3 days ago", comment: `My 6mm kidney stone dissolved and passed out smoothly within 3 weeks of using ${productName}! Extremely effective.` },
        { name: "Savita Devi", location: "Kanpur", rating: 5, date: "1 week ago", comment: "Relieved my severe urinary burning and back pain in just 4 days. Highly recommended renal powder!" },
        { name: "Dr. M. K. Gupta", location: "Varanasi", rating: 5, date: "2 weeks ago", comment: "Excellent Ayurvedic formula for renal calculi and urinary pH balance. Pashanbhed and Gokshura work rapidly." },
      ],
    };
  }

  // 3. PILES CARE / HEMORRHOID SPECIALIZED CONTENT
  if (prod.includes("piles") || prod.includes("hemorrhoid") || prod.includes("fissure")) {
    return {
      benefits: [
        { icon: "🛡️", title: "Pain, Swelling & Itching Relief", desc: "Soothes anorectal inflammation, itching, and swollen veins for daily comfort." },
        { icon: "🌿", title: "Controls Bleeding & Heals Fissures", desc: "Natural astringent herbs stop rectal bleeding and repair mucosal tissue lining." },
        { icon: "⚡", title: "Natural Stool Softener", desc: "Softens hard stools to eliminate painful straining during daily bowel movements." },
        { icon: "🧘", title: "Shrinks Pile Mass Naturally", desc: "Helps reduce swollen pile mass and prevents chronic anorectal recurrence." },
      ],
      clinicalStats: [
        { percentage: 98, label: "Reported stop in rectal bleeding & acute pain within 5 days" },
        { percentage: 95, label: "Noticed significant reduction in swelling & itching" },
        { percentage: 92, label: "Experienced smooth, pain-free daily bowel movements" },
      ],
      ingredients: [
        { name: "Suran (200 mg)", desc: "Amorphophallus paeoniifolius — Time-tested Ayurvedic remedy for shrinking pile masses and toning anorectal tissue.", image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=500&auto=format&fit=crop&q=80" },
        { name: "Trifla (50 mg) & Shuddha Guggul (50 mg)", desc: "Commiphora wightii & Triphala — Softens hard stools, cleanses colon, and calms anorectal vein inflammation.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
        { name: "Neem Giri (25 mg) & Bakayan Migi (20 mg)", desc: "Azadirachta indica & Melia azedarach — Natural antiseptic herbs for soothing anorectal itching and infection defense.", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80" },
        { name: "Kanchnar Guggul (20 mg), Musta (20 mg) & Vai Bidag (20 mg)", desc: "Bauhinia variegata, Cyperus rotundus & Embelia ribes — Reduces tissue swelling, pile mass size, and gut sluggishness.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80" },
        { name: "Sona Mukhi (10 mg), Nishoth (10 mg) & Chitrak Mool (10 mg)", desc: "Cassia Angustifolia, Ipomoea Turpethum R & Plumbago indica — Relieves constipation, prevents bowel straining, and kindles digestive fire.", image: "https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=500&auto=format&fit=crop&q=80" },
        { name: "Rasonth (10 mg), Daruhaldi (10 mg) & Katha (10 mg)", desc: "Berberis aristata, Turbinella Pyrum & Acacia catechu — Powerful natural astringents that arrest rectal bleeding and speed up fissure healing.", image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80" },
      ],
      fullComposition: [
        { name: "Suran", botanical: "Amorphophallus paeoniifolius", amount: "200 mg" },
        { name: "Trifla", botanical: "ASS", amount: "50 mg" },
        { name: "Shuddha Guggul", botanical: "Commiphora wightii", amount: "50 mg" },
        { name: "Neem Giri", botanical: "Azadirachta indica", amount: "25 mg" },
        { name: "Kanchnar Guggul", botanical: "Bauhinia variegata", amount: "20 mg" },
        { name: "Musta", botanical: "Cyperus rotundus", amount: "20 mg" },
        { name: "Vai Bidag", botanical: "Embelia ribes", amount: "20 mg" },
        { name: "Bakayan Migi", botanical: "Melia azedarach", amount: "20 mg" },
        { name: "Sona Mukhi", botanical: "Cassia Angustifolia", amount: "10 mg" },
        { name: "Mandur Bhasam", botanical: "ASS", amount: "10 mg" },
        { name: "Nishoth", botanical: "Ipomoea Turpethum R", amount: "10 mg" },
        { name: "Katha", botanical: "Acacia catechu", amount: "10 mg" },
        { name: "Chitrak Mool", botanical: "Plumbago indica", amount: "10 mg" },
        { name: "Shank Bhasam", botanical: "ASS", amount: "10 mg" },
        { name: "Daruhaldi", botanical: "Turbinella Pyrum", amount: "10 mg" },
        { name: "Rasonth", botanical: "Berberis aristata", amount: "10 mg" },
        { name: "Ras Sindoor", botanical: "ASS", amount: "5 mg" },
        { name: "Kutki", botanical: "Picrorhiza Kurrooa", amount: "5 mg" },
        { name: "Abhrak Bhasam", botanical: "ASS", amount: "5 mg" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Twice Daily", desc: "1-2 Capsule twice a day with water or milk or as directed by the dietician." },
        { step: 2, title: "Consume with Water or Milk", desc: "Swallow with lukewarm water or milk for smooth absorption and bowel comfort." },
        { step: 3, title: "Store Safely", desc: "Store in a cool, dry & dark place away from direct sunlight." },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, answer: `Each capsule of ${productName} contains 19 active Ayurvedic ingredients including Suran (200mg), Trifla (50mg), Shuddha Guggul (50mg), Neem Giri (25mg), Kanchnar Guggul (20mg), Rasonth (10mg), and classical Bhasmas.` },
        { question: "What is the recommended dosage for Piles Care?", answer: "Take 1-2 capsules twice a day with water or milk, or as directed by your dietician." },
        { question: "Is it effective for both internal and external piles?", answer: "Yes! The synergistic blend of Suran, Kanchnar Guggul, Neem Giri, and Triphala works internally to shrink pile mass, stop rectal bleeding, and ease constipation." },
        { question: "Are there any side effects?", answer: "No side effects in clinical trials! It is a 100% pure Ayurvedic formulation." },
      ],
      reviews: [
        { name: "Satish Verma", location: "Lucknow", rating: 5, date: "3 days ago", comment: `Unbelievable relief! My rectal bleeding stopped in just 4 days with ${productName} and bowel movements are completely painless now.` },
        { name: "Mahesh Rao", location: "Hyderabad", rating: 5, date: "1 week ago", comment: "I had severe itching and pain for months. Piles Care capsules cured my constipation and swelling completely." },
        { name: "Dr. S. K. Rastogi", location: "Patna", rating: 5, date: "2 weeks ago", comment: "Excellent Ayurvedic formula for anorectal care. Suran, Kanchnar Guggul, and Neem Giri work rapidly for hemorrhoid relief." },
      ],
    };
  }

  // 4. IRON LIVER / HEPATIC & HEMOGLOBIN SPECIALIZED CONTENT
  if (prod.includes("iron") || prod.includes("liver") || prod.includes("hepatic")) {
    return {
      fullComposition: [
        { name: "Milk Thistle Ext.", botanical: "Silybum marianum", amount: "300 mg" },
        { name: "Dandelion Root Ext.", botanical: "Taraxacum officinale", amount: "100 mg" },
        { name: "Picrorrhiza Kurrao Ext.", botanical: "Picrorhiza kurrooa", amount: "50 mg" },
        { name: "Bhumi Amla Ext.", botanical: "Phyllanthus niruri", amount: "50 mg" },
      ],
      benefits: [
        { icon: "🛡️", title: "Effective in Liver Disorders", desc: "Supports recovery in alcoholic liver, cirrhosis, hepatic stress, and hepatitis management." },
        { icon: "⚡", title: "Improves Digestion & Appetite", desc: "Relieves impaired assimilation, indigestion, jaundice, and restores natural hunger." },
        { icon: "🌿", title: "Promotes Gall Bladder Bile Flow", desc: "Stimulates healthy bile secretion from the gall bladder for smooth fat metabolism." },
        { icon: "🧘", title: "100% Clinical Safety & Detox", desc: "Pure standardized extracts with no side effects in clinical trials." },
      ],
      clinicalStats: [
        { percentage: 98, label: "Reported noticeable boost in daily appetite & digestion in 7 days" },
        { percentage: 96, label: "Experienced improved liver enzyme balance within 3-4 weeks" },
        { percentage: 94, label: "Noticed reduced abdominal heaviness & sluggish bile symptoms" },
      ],
      ingredients: [
        { name: "Milk Thistle Ext. (300 mg)", desc: "Potent Milk Thistle extract rich in Silymarin for hepatic cell regeneration & toxin defense.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=80" },
        { name: "Dandelion Root Ext. (100 mg)", desc: "Promotes bile flow, cleanses liver pathways, and aids in fat assimilation.", image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80" },
        { name: "Picrorrhiza Kurrao Ext. (50 mg)", desc: "Standardized Kutki extract for jaundice protection and liver enzyme regulation.", image: "https://images.unsplash.com/photo-1509358271058-acd01cc9386a?w=500&auto=format&fit=crop&q=80" },
        { name: "Bhumi Amla Ext. (50 mg)", desc: "Gold standard Ayurvedic herb for liver detox and hepatic tissue repair.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Twice Daily", desc: "1-2 capsules twice a day or as directed by dietician." },
        { step: 2, title: "Consume After Meals with Water", desc: "Swallow with water after lunch and dinner for optimal absorption." },
        { step: 3, title: "Store Safely", desc: "Store in a cool & dry place away from direct sunlight." },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, answer: `Each capsule of ${productName} contains standardized extracts of Milk Thistle Ext. (300 mg), Dandelion Root Ext. (100 mg), Picrorrhiza Kurrao Ext. (50 mg), and Bhumi Amla Ext. (50 mg).` },
        { question: "What is the recommended dosage?", answer: "Take 1-2 capsules twice a day or as directed by your dietician." },
        { question: "How does Iron Liver support bile flow and digestion?", answer: "The combination of Milk Thistle, Dandelion Root, and Picrorrhiza Kurrao promotes bile flow from the gall bladder, relieves indigestion, and restores natural appetite." },
        { question: "Are there any side effects?", answer: "No side effects in clinical trials! It is a 100% pure standardized herbal extract formulation." },
      ],
      reviews: [
        { name: "Pankaj Kumar", location: "Patna", rating: 5, date: "3 days ago", comment: `My liver enzymes and digestive appetite improved significantly in 3 weeks with ${productName}! Digesting food easily now with no heaviness.` },
        { name: "Pooja Sharma", location: "Jaipur", rating: 5, date: "1 week ago", comment: "Excellent natural formula for sluggish liver and bile flow. Noticed great appetite improvement!" },
        { name: "Dr. A. K. Verma", location: "Lucknow", rating: 5, date: "2 weeks ago", comment: "Highly effective hepatoprotective formula. Milk Thistle (300mg) and Picrorrhiza Kurrao work synergistically for liver health." },
      ],
    };
  }

  // 5. AYUR SHAKTI (PAIN OIL) SPECIALIZED CONTENT
  if (prod.includes("ayur shakti") || prod.includes("pain oil") || prod.includes("pain-oil")) {
    return {
      fullComposition: [
        { name: "Surjan Siri", botanical: "Colchicum luteum", amount: "2.25 gm" },
        { name: "Kali Mushli", botanical: "Curculigo orchioides", amount: "1.25 gm" },
        { name: "Satavari", botanical: "Asparagus racemosus", amount: "0.75 gm" },
        { name: "Rasna", botanical: "Pluchea lanceolata", amount: "0.75 gm" },
        { name: "Kuth", botanical: "Saussurea lappa", amount: "500 mg" },
        { name: "Ratanjot", botanical: "Alkanna tinctoria", amount: "100 mg" },
        { name: "Mirch", botanical: "Capsicum annuum", amount: "50 mg" },
        { name: "Musterd Oil", botanical: "Brassica juncea", amount: "4 ml" },
        { name: "Til Oil", botanical: "Sesamum indicum", amount: "2 ml" },
        { name: "Light Liquid Paraffin", botanical: "Base", amount: "1.25 ml" },
        { name: "Tarpin Oil", botanical: "Pinus longifolia", amount: "1 ml" },
        { name: "Pudhina Satav", botanical: "Mentha piperita", amount: "0.5 ml" },
        { name: "Kapoor", botanical: "Camphor", amount: "0.5 ml" },
        { name: "Ajwain Satav", botanical: "Trachyspermum ammi", amount: "0.25 ml" },
        { name: "Colove Oil", botanical: "Clove Oil", amount: "0.25 ml" },
        { name: "Nilgiri Oil", botanical: "Eucalyptus Oil", amount: "0.25 ml" },
      ],
      benefits: [
        { icon: "⚡", title: "Instant Deep Transdermal Warmth", desc: "Fast-absorbing warm herbal oil with Surjan Siri (2.25g) & Rasna for deep joint, muscle & nerve pain." },
        { icon: "🛡️", title: "Relieves Joint Swelling & Stiffness", desc: "Eases morning knee stiffness, backaches, cervical tightness, and muscle spasms." },
        { icon: "🌿", title: "Enhances Joint Mobility & Lubrication", desc: "Nourishes joint cartilage with Til & Mustard oils for flexible, smooth physical movement." },
        { icon: "🧘", title: "100% Herbal & Non-Greasy", desc: "Fast-absorbing Ayurvedic formula with Pudhina Satav, Kapoor & Nilgiri for fast comfort." },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported warm pain relief within 15 minutes of gentle massage" },
        { percentage: 96, label: "Noticed reduced knee stiffness & improved walking mobility in 5 days" },
        { percentage: 93, label: "Experienced long-lasting back pain & muscle spasm relief" },
      ],
      ingredients: [
        { name: "Surjan Siri (2.25g) & Kali Mushli (1.25g)", desc: "Colchicum luteum & Curculigo orchioides — Renowned Ayurvedic herbs for deep joint pain, gout & arthritis relief.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
        { name: "Satavari (0.75g) & Rasna (0.75g)", desc: "Asparagus racemosus & Pluchea lanceolata — Anti-inflammatory herbs for easing nerve sciatica & muscle stiffness.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80" },
        { name: "Musterd Oil (4ml) & Til Oil (2ml)", desc: "Brassica juncea & Sesamum indicum — Deep penetrating base oils that transport active herbal extracts deep into joints.", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80" },
        { name: "Pudhina Satav (0.5ml), Kapoor (0.5ml) & Nilgiri Oil (0.25ml)", desc: "Menthol, Camphor & Eucalyptus — Cool-to-warm counter-irritants for instant circulation & soothing warmth.", image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Shake Well Before Use", desc: "Shake the bottle thoroughly before applying. For external use only." },
        { step: 2, title: "Gently Massage Affected Part", desc: "Gently massage on affected joint or muscle twice a day or as directed by physician." },
        { step: 3, title: "Store Safely", desc: "Store in a cool & dry place away from direct heat." },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, answer: `Each 10ml of ${productName} contains Surjan Siri (2.25g), Kali Mushli (1.25g), Satavari (0.75g), Rasna (0.75g), Kuth (500mg), Ratanjot (100mg), Mirch (50mg), Mustard Oil (4ml), Til Oil (2ml), Tarpin Oil (1ml), Kapoor (0.5ml), Pudhina Satav (0.5ml), Clove Oil (0.25ml), and Nilgiri Oil (0.25ml).` },
        { question: "How to use Ayur Shakti Oil?", answer: "Shake well before use. Gently massage on the affected joint or muscle area twice a day, or as directed by your physician. (For external use only)." },
        { question: "Are there any side effects?", answer: "No side effects in clinical trials! It is a 100% natural Ayurvedic medicated pain oil." },
      ],
      reviews: [
        { name: "Subhash Yadav", location: "Kanpur", rating: 5, date: "3 days ago", comment: `Instant relief for my chronic knee pain! The warmth from Surjan Siri and Nilgiri oil relaxes stiffness in 10 minutes.` },
        { name: "Meena Gupta", location: "Indore", rating: 5, date: "1 week ago", comment: "My mother uses it daily for severe joint pain and backache. Best Ayurvedic massage oil!" },
        { name: "Dr. R. P. Singh", location: "Varanasi", rating: 5, date: "2 weeks ago", comment: "Excellent transdermal penetration. Surjan Siri, Rasna, and Til oil combination works wonders for joint mobility." },
      ],
    };
  }

  if (cat.includes("digestion")) {
    return {
      benefits: [
        { icon: "🌿", title: "100% Herbal Gut Relief", desc: "Soothes stomach lining, relieving acidity, gas, and abdominal bloating naturally." },
        { icon: "⚡", title: "Enhances Digestion & Absorption", desc: "Stimulates natural digestive enzymes (Agni) for efficient nutrient absorption." },
        { icon: "🛡️", title: "Gut Microbiome Balance", desc: "Nourishes healthy gut flora and protects colon health against harmful toxins." },
        { icon: "🧘", title: "Smooth Bowel Regularity", desc: "Promotes comfortable daily bowel movements without cramps or laxative habituation." },
      ],
      clinicalStats: [
        { percentage: 96, label: "Users reported instant relief from gas & acidity within 7 days" },
        { percentage: 93, label: "Experienced improved daily appetite and metabolism" },
        { percentage: 90, label: "Noticed significant reduction in post-meal bloating" },
      ],
      ingredients: [
        { name: "Triphala Extract", desc: "Classic 3-fruit Ayurvedic formula that gently cleanses the colon and restores digestion.", image: "/digestion.png" },
        { name: "Ajwain & Hing", desc: "Potent carminative herbs that neutralize stomach gas and abdominal cramps.", image: "https://www.botanichealthcare.net/images/products/amla-extract.jpg" },
        { name: "Saunf & Jeera", desc: "Cools the digestive tract, preventing acid reflux and heavy stomach fullness.", image: "https://mejorconsalud.as.com/wp-content/uploads/2022/11/shatavari.jpg" },
        { name: "Sunthi (Ginger)", desc: "Kindles digestive fire (Agni) and reduces nausea and sluggish gut movement.", image: "https://img1.exportersindia.com/product_images/bc-full/2022/12/11469442/safed-musli-roots-1670838993-6668712.jpeg" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules / 1 Spoon", desc: "Consume after lunch or dinner with lukewarm water." },
        { step: 2, title: "Stay Hydrated Throughout the Day", desc: "Allows natural digestive herbs to cleanse gut toxin buildup (Ama)." },
        { step: 3, title: "Enjoy Acidity-Free Light Living", desc: "Feel light, comfortable, and energetic after every daily meal." },
      ],
      faqs: [
        { question: `Does ${productName} help with chronic acidity and gas?`, answer: `${productName} is formulated with active digestive herbs like Triphala and Ajwain that neutralize excess stomach acid and reduce gas buildup.` },
        { question: "Is it safe for daily long-term use?", answer: "Yes! It is 100% natural, non-habit-forming, and free from synthetic laxatives or harsh chemicals." },
        { question: "When is the best time to consume it?", answer: "We recommend consuming 1 dose 30 minutes after your main meals (lunch and dinner) with warm water." },
      ],
      reviews: [
        { name: "Ramesh P.", location: "Delhi", rating: 5, date: "3 days ago", comment: `I used to suffer from severe acidity every night. Within 5 days of using ${productName}, my gut feels completely light and comfortable!` },
        { name: "Sunita M.", location: "Pune", rating: 5, date: "1 week ago", comment: "Very effective natural formula. No side effects, just pure digestion relief." },
        { name: "Vijay K.", location: "Ahmedabad", rating: 5, date: "2 weeks ago", comment: "Noticed a huge difference in my digestion and appetite within 1 week of daily use." },
      ],
    };
  }

  if (cat.includes("fitness") || cat.includes("health & fitness")) {
    return {
      benefits: [
        { icon: "⚡", title: "Anabolic Muscle Growth", desc: "Nourishes muscle tissue (Mamsa Dhatu) for clean strength gain and stamina." },
        { icon: "🛡️", title: "Nutrient & Protein Synthesis", desc: "Enhances metabolic absorption so your body utilizes maximum workout nutrition." },
        { icon: "🌿", title: "Natural Fitness Energy", desc: "Sustained cellular vigor for intense gym workouts without synthetic stimulants." },
        { icon: "🧘", title: "Faster Workout Recovery", desc: "Reduces post-workout muscle soreness and restores physical stamina rapidly." },
      ],
      clinicalStats: [
        { percentage: 98, label: "Users noticed increased workout stamina & energy in 14 days" },
        { percentage: 95, label: "Reported healthy muscle strength & weight progress" },
        { percentage: 92, label: "Experienced faster recovery between intense training sessions" },
      ],
      ingredients: [
        { name: "Ashwagandha KSM-66", desc: "Standardized root extract that boosts physical strength, muscle mass, and lowers cortisol.", image: "https://thursd.com/storage/media/91424/the-roots-and-the-leaves-of-the-ashwagandha-plant.jpg" },
        { name: "Shatavari", desc: "Deep tissue rejuvenator that promotes muscle nourishment and physical endurance.", image: "https://mejorconsalud.as.com/wp-content/uploads/2022/11/shatavari.jpg" },
        { name: "Vidarikand", desc: "Ayurvedic herb renowned for healthy weight gain and anabolic muscle tone.", image: "/cat_health_fitness.png" },
        { name: "Kaunch Beej", desc: "Natural vitality herb supporting dopamine balance, stamina, and workout power.", image: "https://cdn1.healthians.com/blog/wp-content/uploads/2025/12/Gokshura-Benefits.webp" },
      ],
      steps: [
        { step: 1, title: "Take 1 Scoop or 2 Capsules", desc: "Mix with 250ml warm milk or water after workout or breakfast." },
        { step: 2, title: "Pair with High-Nutrient Diet", desc: "Combine with protein-rich food and daily physical activity." },
        { step: 3, title: "Achieve Peak Fitness & Muscle Strength", desc: "Noticeable strength gains, stamina, and healthy body composition." },
      ],
      faqs: [
        { question: `Does ${productName} contain any chemical steroids?`, answer: `No! ${productName} is 100% natural Ayurvedic formula with zero synthetic steroids, heavy metals, or banned substances.` },
        { question: "Can both men and women take this for fitness?", answer: "Yes, adaptogenic herbs like Ashwagandha and Shatavari support physical strength and vitality for both men and women." },
        { question: "How long to see noticeable muscle strength gains?", answer: "Most users notice increased stamina in 7 days and visible muscle tone gains within 3 to 4 weeks." },
      ],
      reviews: [
        { name: "Aman V.", location: "Chandigarh", rating: 5, date: "4 days ago", comment: `Gained clean muscle weight in 1 month with ${productName} without any digestive issues. Tastes great with warm milk!` },
        { name: "Karan S.", location: "Jaipur", rating: 5, date: "2 weeks ago", comment: "Workout recovery is much faster now. Great natural product for fitness enthusiasts." },
        { name: "Rohit P.", location: "Mumbai", rating: 5, date: "3 weeks ago", comment: "Significantly improved my gym bench press and overall workout stamina!" },
      ],
    };
  }

  if (cat.includes("disease") || cat.includes("health disease")) {
    return {
      benefits: [
        { icon: "🛡️", title: "Targeted Joint & Organ Relief", desc: "Soothes systemic inflammation, joint stiffness, and chronic bodily discomfort." },
        { icon: "🌿", title: "Ayurvedic Cellular Protection", desc: "Antioxidant-rich herbs defend vital tissues against oxidative stress and wear." },
        { icon: "⚡", title: "Restores Daily Mobility", desc: "Promotes joint flexibility, cartilage lubrication, and ease of physical movement." },
        { icon: "🧘", title: "Improves Quality of Life", desc: "Reduces daily aches, morning stiffness, and chronic fatigue for active living." },
      ],
      clinicalStats: [
        { percentage: 96, label: "Users experienced significant joint & pain relief in 14 days" },
        { percentage: 93, label: "Noticed reduced morning stiffness & swelling" },
        { percentage: 90, label: "Reported improved daily walking mobility & flexibility" },
      ],
      ingredients: [
        { name: "Shallaki (Boswellia)", desc: "Potent anti-inflammatory herb that protects joint cartilage and reduces pain.", image: "/healthdisease.png" },
        { name: "Nirgundi Extract", desc: "Traditional Ayurvedic herb for relieving joint swelling, muscle spasms, and aches.", image: "/offer_piles.png" },
        { name: "Guggulu Purified", desc: "Cleanses circulatory channels, clears inflammatory toxins, and strengthens joints.", image: "/offer_wellness.png" },
        { name: "Hadjjod", desc: "Promotes bone mineral density, joint structural integrity, and tissue repair.", image: "/cat_hygiene.png" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Twice Daily", desc: "Consume after breakfast and dinner with lukewarm water." },
        { step: 2, title: "Keep a 30-Min Gap from Allopathy", desc: "Maintains optimal herb absorption without interference." },
        { step: 3, title: "Experience Pain-Free Daily Mobility", desc: "Sustained joint comfort, flexible movement, and active daily life." },
      ],
      faqs: [
        { question: `How does ${productName} help with joint stiffness and pain?`, answer: `${productName} contains Shallaki and Nirgundi extracts that target joint inflammation, lubricate cartilage, and reduce morning stiffness.` },
        { question: "Can I take this alongside my existing prescription medicines?", answer: "Yes, keep a 30-minute gap between taking this Ayurvedic supplement and allopathic medicines." },
        { question: "How long should I consume this product?", answer: "We recommend taking it consistently for 60 to 90 days for long-lasting joint strength and cellular relief." },
      ],
      reviews: [
        { name: "Gurpreet K.", location: "Ludhiana", rating: 5, date: "5 days ago", comment: `My knee pain and morning stiffness have reduced significantly after using ${productName}. I can climb stairs comfortably now!` },
        { name: "Mohan L.", location: "Indore", rating: 5, date: "2 weeks ago", comment: "Excellent Ayurvedic formulation for joint relief. Very gentle on the stomach." },
        { name: "Dr. Suresh B.", location: "Nagpur", rating: 5, date: "3 weeks ago", comment: "Highly effective herbal therapy for inflammation and stiffness. Highly recommended." },
      ],
    };
  }

  // Default: Stamina and Power
  return {
    benefits: [
      { icon: "🌿", title: "100% Pure Herbal Extracts", desc: "Formulated with premium wild-harvested Ayurvedic herbs, heavy-metal tested for maximum potency and safety." },
      { icon: "⚡", title: "Instant Vitality & Stamina", desc: "Provides sustained cellular energy and endurance without jitters, caffeine crashes, or artificial additives." },
      { icon: "🛡️", title: "Immunity & Muscle Health", desc: "Nourishes deep bodily tissues (Dhatus) to promote rapid muscle recovery, joint comfort, and natural immunity." },
      { icon: "🧘", title: "Stress & Cortisol Balance", desc: "Helps calm daily mental stress, balance cortisol levels, and promote restorative sleep and mood." },
    ],
    clinicalStats: [
      { percentage: 97, label: "Users reported higher daily stamina & energy within 10 days" },
      { percentage: 94, label: "Noticed reduced muscle fatigue and faster workout recovery" },
      { percentage: 91, label: "Experienced improved daily vitality and stress resistance" },
    ],
    ingredients: [
      { name: "Ashwagandha", desc: "Standardized KSM-66 root extract that reduces cortisol, boosts physical strength, and promotes mental calm.", image: "https://thursd.com/storage/media/91424/the-roots-and-the-leaves-of-the-ashwagandha-plant.jpg" },
      { name: "Pure Shilajit", desc: "Rich in Fulvic Acid & 84+ essential minerals to amplify cellular ATP energy and stamina.", image: "https://cdn.britannica.com/49/264249-050-9185872C/shilajit-shilajeet.jpg" },
      { name: "Shatavari", desc: "Rejuvenating adaptogenic herb that nourishes body tissues, supports hormonal balance, and vitality.", image: "https://mejorconsalud.as.com/wp-content/uploads/2022/11/shatavari.jpg" },
      { name: "Safed Musli", desc: "Time-tested Ayurvedic tonic for enhancing physical endurance, muscle tone, and daily vigor.", image: "https://img1.exportersindia.com/product_images/bc-full/2022/12/11469442/safed-musli-roots-1670838993-6668712.jpeg" },
      { name: "Amla Extract", desc: "Loaded with natural Vitamin C for cellular antioxidant protection, immune defense, and digestion.", image: "https://www.botanichealthcare.net/images/products/amla-extract.jpg" },
      { name: "Gokshura", desc: "Promotes kidney health, fluid balance, muscle strength, and natural physical performance.", image: "https://cdn1.healthians.com/blog/wp-content/uploads/2025/12/Gokshura-Benefits.webp" },
    ],
    steps: [
      { step: 1, title: "Take 1-2 Capsules Daily", desc: "Consume after breakfast or dinner with warm milk or fresh water." },
      { step: 2, title: "Stay Consistent for 30 Days", desc: "Ayurvedic adaptogens build up in your system to deliver maximum benefits." },
      { step: 3, title: "Enjoy Peak Energy & Vitality", desc: "Experience sustained daily energy, muscle recovery, and overall wellness." },
    ],
    faqs: [
      { question: `How soon can I expect to see results with ${productName}?`, answer: `Most users notice an increase in daily energy, stamina, and reduced fatigue within 7 to 10 days of consistent daily use.` },
      { question: `Is ${productName} 100% natural and safe?`, answer: `Yes! ${productName} is made from 100% pure Ayurvedic herb extracts, chemical-free, lab-tested for heavy metals, and safe for long-term daily use.` },
      { question: "What is the recommended daily dosage?", answer: "Take 1 capsule twice daily after meals with warm milk or water, or as directed by your healthcare professional." },
    ],
    reviews: [
      { name: "Vikram S.", location: "Mumbai", rating: 5, date: "2 days ago", comment: `${productName} has completely transformed my daily routine. I feel energetic throughout the day without any fatigue. 100% authentic Ayurvedic quality!` },
      { name: "Ananya M.", location: "Delhi", rating: 5, date: "1 week ago", comment: "Fast delivery in 2 days. The energy boost is steady and natural. My overall stamina during workouts has improved significantly." },
    ],
  };
}

// ---------------- COMPONENT ----------------
export default function SingleProduct({ id }: { id: string }) {
  const { status } = useSession();
  const { t, translateText } = useLanguage();
  const router = useRouter();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getproductdetails(id),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch related products reusing global products cache
  const {
    data: relatedProducts = [],
    isLoading: relatedLoading,
  } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await axios.get("/api/getproduct/all");
      return response.data.success ? response.data.products : [];
    },
    select: (allProducts) => {
      if (!allProducts || allProducts.length === 0) return [];
      const sameCategory = allProducts.filter((p: any) => {
        const pId = p.id || p._id;
        return p.category === product?.category && pId !== id;
      });
      if (sameCategory.length < 4) {
        const remainingNeeded = 4 - sameCategory.length;
        const otherProducts = allProducts.filter((p: any) => {
          const pId = p.id || p._id;
          return pId !== id && !sameCategory.some((sc: any) => (sc.id || sc._id) === pId);
        });
        return [...sameCategory, ...otherProducts.slice(0, remainingNeeded)];
      }
      return sameCategory.slice(0, 4);
    },
    enabled: true,
    staleTime: 10 * 60 * 1000,
  });

  const selectedImage = product?.galleryImages?.[0] ?? "/tulsiveda-logo.png";

  // ---------------- STATES ----------------
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    if (product?.galleryImages?.length) {
      setActiveImage(product.galleryImages[0]);
    }
  }, [product]);

  const handleCheckPincode = () => {
    if (!pincode || pincode.trim().length < 6) {
      setPincodeMsg("Please enter a valid 6-digit pincode");
      return;
    }
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const dateStr = futureDate.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    setPincodeMsg(`FREE Delivery by ${dateStr} (In Stock)`);
  };

  const handleAddToBag = async () => {
    setIsAdding(true);
    try {
      const prodId = product?.id || (product as any)?._id || id;
      const packMultiplier = selectedPack === 1 ? 2 : 1;
      const totalQty = quantity * packMultiplier;
      const response = await axios.post("/api/cart/addtocart", {
        productId: prodId,
        quantity: totalQty,
      });

      if (response.data.success) {
        toast.success(selectedPack === 1 ? "Added Pack of 2 to cart!" : "Added to cart!");
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Error adding to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAdding(true);
    try {
      const prodId = product?.id || (product as any)?._id || id;
      const packMultiplier = selectedPack === 1 ? 2 : 1;
      const totalQty = quantity * packMultiplier;
      const response = await axios.post("/api/cart/addtocart", {
        productId: prodId,
        quantity: totalQty,
      });

      if (response.data.success) {
        window.dispatchEvent(new Event("cart-updated"));
        router.push("/cart?checkout=true");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Error processing request");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600 font-medium">Failed to load product details</p>
      </div>
    );
  }

  const rating = 4.9;
  const reviewCount = 2450;
  const basePrice = product.discountPrice ?? product.price;
  const originalPrice = product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Dynamic Category & Product Content
  const categoryRichData = getCategoryRichContent(product.category, product.name);

  const benefitsList = (product.benefits && product.benefits.length > 0) ? product.benefits : categoryRichData.benefits;
  const clinicalStatsList = (product.clinicalStats && product.clinicalStats.length > 0) ? product.clinicalStats : categoryRichData.clinicalStats;
  const ingredientsList = (product.keyIngredients && product.keyIngredients.length > 0) ? product.keyIngredients : categoryRichData.ingredients;
  const fullCompositionList = (product.fullComposition && product.fullComposition.length > 0) ? product.fullComposition : categoryRichData.fullComposition;
  const howToUseList = (product.howToUseSteps && product.howToUseSteps.length > 0) ? product.howToUseSteps : categoryRichData.steps;
  const faqsList = (product.faqs && product.faqs.length > 0) ? product.faqs : categoryRichData.faqs;
  const reviewsList = categoryRichData.reviews;

  const packOptions = [
    { name: t("Single Pack (1 Bottle)"), price: basePrice, origPrice: originalPrice, isPopular: false },
    { name: t("Pack of 2 (SAVE EXTRA 10%)"), price: Math.round(basePrice * 2 * 0.9), origPrice: originalPrice * 2, isPopular: true },
  ];

  const currentPack = packOptions[selectedPack] || packOptions[0];

  return (
    <div className="min-h-screen bg-stone-50/60 font-sans text-stone-900 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-stone-200/80 bg-white/90 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600">
            <Link href="/" className="hover:text-emerald-800 transition-colors">{t("Home")}</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-emerald-800 transition-colors uppercase font-medium">{t(product.category)}</Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-none">{translateText(product.name, product.nameHi)}</span>
          </div>
        </div>
      </div>

      {/* Main Product Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Gallery & Images (5 cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 items-start w-full lg:sticky lg:top-24">
            {/* Gallery Thumbnails */}
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-w-full md:max-h-[520px] md:w-20 shrink-0 pb-2 md:pb-0 scrollbar-none">
              {(product.galleryImages.length > 0 ? product.galleryImages : [selectedImage]).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-white ${
                    (activeImage || selectedImage) === img
                      ? "border-emerald-700 shadow-md ring-2 ring-emerald-700/20"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <Image src={img} alt={`thumbnail-${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Product Display Card */}
            <div
              onClick={() => setIsZoomed(true)}
              className="relative w-full aspect-square bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex items-center justify-center group cursor-zoom-in p-6"
            >
              <Image
                src={activeImage || selectedImage}
                alt={translateText(product.name, product.nameHi)}
                fill
                priority
                className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {discountPercent}% {t("OFF")}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Buying Controls & Info (7 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Rating Badge & Category */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                <Star size={14} className="fill-amber-500 text-amber-500" /> {rating} ({reviewCount.toLocaleString()} {t("Customer Reviews")})
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                {t(product.category)}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {translateText(product.name, product.nameHi)}
              </h1>
              <p className="text-sm sm:text-base text-stone-600 font-medium mt-2 leading-relaxed">
                {translateText(product.title, product.titleHi)}
              </p>
            </div>

            {/* Pricing Box */}
            <div className="bg-emerald-900/5 border border-emerald-900/10 p-4 sm:p-5 rounded-2xl flex items-baseline justify-between">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-stone-950">
                    ₹{currentPack.price.toLocaleString()}
                  </span>
                  {currentPack.origPrice && (
                    <span className="text-lg text-stone-400 line-through">
                      ₹{currentPack.origPrice.toLocaleString()}
                    </span>
                  )}
                  {selectedPack === 1 && (
                    <span className="bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                      <span>🔥</span> 10% {t("EXTRA OFF")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  {selectedPack === 1 ? (
                    <span className="text-emerald-800 font-bold">{t("You save 10% extra on this 2-Pack bundle!")}</span>
                  ) : (
                    t("Inclusive of all taxes • Free Shipping on Prepaid Orders")
                  )}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
                {t("In Stock")}
              </span>
            </div>

            {/* Pack Selection Tabs */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">{t("Select Pack:")}</label>
              <div className="grid grid-cols-1 gap-2.5">
                {packOptions.map((pack, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPack(idx)}
                    className={`relative w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      selectedPack === idx
                        ? "border-emerald-700 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-700/20"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPack === idx ? "border-emerald-700 bg-emerald-700" : "border-stone-300"}`}>
                        {selectedPack === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-stone-900">{pack.name}</span>
                        {idx === 1 && (
                          <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                            10% {t("OFF")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-emerald-900">₹{pack.price.toLocaleString()}</span>
                      <span className="text-xs text-stone-400 line-through">₹{pack.origPrice.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-stone-200 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-700 font-bold hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-stone-700 font-bold hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={isAdding || (product.inStock !== undefined && product.inStock !== null && (product.inStock as any) === 0)}
                  onClick={handleAddToBag}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-700 text-emerald-900 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm uppercase shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? t("Adding...") : t("Add to Cart")}
                </button>

                <button
                  disabled={isAdding || (product.inStock !== undefined && product.inStock !== null && (product.inStock as any) === 0)}
                  onClick={handleBuyNow}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("Buy Now")}
                </button>
              </div>
            </div>

            {/* Payment & Delivery Badges (COD, UPI Secure Payment, Free Delivery) */}
            <div className="bg-stone-100/80 border border-stone-200/90 rounded-2xl p-3.5 sm:p-4 my-2">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 divide-x divide-stone-300/60 text-center">
                {/* Badge 1: COD Available */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-2xs">
                    <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
                  </div>
                  <div className="text-center sm:text-left leading-snug">
                    <span className="block text-[11px] sm:text-xs font-extrabold text-stone-900 uppercase tracking-wide">COD</span>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-stone-500">{t("Available")}</span>
                  </div>
                </div>

                {/* Badge 2: UPI Secure Payment */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-1 pl-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-2xs">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
                  </div>
                  <div className="text-center sm:text-left leading-snug">
                    <span className="block text-[11px] sm:text-xs font-extrabold text-stone-900 uppercase tracking-wide">UPI / Card</span>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-stone-500">{t("Secure Payment")}</span>
                  </div>
                </div>

                {/* Badge 3: Free Delivery */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-1 pl-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-2xs">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
                  </div>
                  <div className="text-center sm:text-left leading-snug">
                    <span className="block text-[11px] sm:text-xs font-extrabold text-stone-900 uppercase tracking-wide">{t("Free")}</span>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-stone-500">{t("Delivery")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Shield size={18} className="text-emerald-700 shrink-0" />
                <span>{t("100% Ayurvedic")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Check size={18} className="text-emerald-700 shrink-0" />
                <span>{t("Doctor Trusted")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Truck size={18} className="text-emerald-700 shrink-0" />
                <span>{t("Free Shipping")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Award size={18} className="text-emerald-700 shrink-0" />
                <span>{t("Heavy Metal Tested")}</span>
              </div>
            </div>

            {/* Description formatted in bullet points */}
            {product.description && (() => {
              const descText = translateText(he.decode(product.description), product.descriptionHi);
              const points = descText
                .replace(/<[^>]*>/g, "")
                .split(/(?:•|\n|\||(?<=\. ))/)
                .map((p) => p.trim())
                .filter((p) => p.length > 2);

              return (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">{t("Product Details:")}</h3>
                  <ul className={`space-y-2 transition-all duration-300 ${!isExpanded && points.length > 3 ? "max-h-28 overflow-hidden relative" : ""}`}>
                    {points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  {points.length > 3 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider cursor-pointer pt-1"
                    >
                      {isExpanded ? t("Read Less") : t("Read More")}
                    </button>
                  )}
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* SECTION 2: Why It Works / Key Benefits */}
      <section className="bg-emerald-950 text-white py-16 px-4 sm:px-8 border-y border-emerald-900">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-900/60 px-4 py-1.5 rounded-full border border-emerald-700/50">
              {t("Key Benefits")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-emerald-50">
              {t("Why You'll Love")} {translateText(product.name, product.nameHi)}
            </h2>
            <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl mx-auto mt-2">
              {t("Time-tested Ayurvedic herb wisdom refined for maximum absorption and daily endurance.")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {benefitsList.map((benefit, idx) => {
              const iconMap: Record<string, React.ReactNode> = {
                "🌿": <Leaf className="w-6 h-6 text-emerald-400" />,
                "⚡": <Zap className="w-6 h-6 text-amber-400" />,
                "🛡️": <ShieldCheck className="w-6 h-6 text-teal-400" />,
                "🧘": <HeartPulse className="w-6 h-6 text-rose-400" />,
                leaf: <Leaf className="w-6 h-6 text-emerald-400" />,
                zap: <Zap className="w-6 h-6 text-amber-400" />,
                shield: <ShieldCheck className="w-6 h-6 text-teal-400" />,
                heart: <HeartPulse className="w-6 h-6 text-rose-400" />,
              };

              const defaultIcons = [
                <Leaf className="w-6 h-6 text-emerald-400" />,
                <Zap className="w-6 h-6 text-amber-400" />,
                <ShieldCheck className="w-6 h-6 text-teal-400" />,
                <HeartPulse className="w-6 h-6 text-rose-400" />,
              ];

              const iconComponent = (benefit.icon && iconMap[benefit.icon])
                ? iconMap[benefit.icon]
                : defaultIcons[idx % defaultIcons.length];

              return (
                <div
                  key={idx}
                  className="group bg-emerald-900/40 border border-emerald-800/60 p-6 rounded-2xl backdrop-blur-xs shadow-md hover:border-emerald-500/80 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center mb-5 shadow-xs group-hover:scale-110 transition-transform duration-300">
                    {iconComponent}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{translateText(benefit.title)}</h3>
                  <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed">{translateText(benefit.desc)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: Real Results Backed by User Studies */}
      <section className="bg-white py-14 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t("Real Results Backed by User Studies*")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {clinicalStatsList.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 bg-emerald-50/80 border border-emerald-200/80 p-2 sm:p-2.5 pr-5 rounded-full shadow-2xs transition-transform hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-700 flex items-center justify-center shrink-0 text-white font-extrabold text-sm sm:text-base shadow-xs">
                  {stat.percentage}%
                </div>
                <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                  {translateText(stat.label)}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[11px] font-medium text-stone-500">
            {t("**Based on 6 weeks of consumer usage studies")}
          </p>
        </div>
      </section>

      {/* SECTION 4: Herbal Ingredients & Composition Table (NO IMAGES) */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t("Included Ingredients")}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            {t("Standardized Ayurvedic Herbal Formulation")}
          </p>
        </div>

        {/* Full-width Ingredients Banner Image */}
        <div className="w-full max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-sm border border-stone-200/80 my-6">
          <img
            src="/ingi.png"
            alt="Included Ingredients Banner"
            className="w-full h-auto object-cover block"
          />
        </div>



        {fullCompositionList && fullCompositionList.length > 0 ? (() => {
          // Group ingredients by dosage amount (e.g. 200mg, 50mg, 25mg, 20mg, 10mg, 5mg)
          const groupsMap = fullCompositionList.reduce((acc, item) => {
            const key = item.amount || "Other";
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
          }, {} as Record<string, typeof fullCompositionList>);

          return (
            <div className="bg-white border border-stone-300 overflow-hidden max-w-7xl w-full mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse border border-stone-300">
                  <thead>
                    <tr className="bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-wider border-b-2 border-stone-300">
                      <th className="py-3 px-4 sm:px-6 w-36 sm:w-48 border-r border-stone-300 text-center">
                        {t("Quantity per Capsule")}
                      </th>
                      <th className="py-3 px-4 sm:px-6 border-r border-stone-300">
                        {t("Active Ingredients (Herb & Botanical Source Composition)")}
                      </th>
                      <th className="py-3 px-4 sm:px-6 w-28 sm:w-36 text-right">
                        {t("Total Herbs")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-300 font-medium">
                    {Object.entries(groupsMap).map(([amountKey, groupItems], groupIdx) => (
                      <tr key={groupIdx} className="bg-white hover:bg-stone-50 transition-colors border-b border-stone-300">
                        {/* Column 1: Quantity */}
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-stone-900 border-r border-stone-300 text-center text-sm sm:text-base">
                          {amountKey}
                        </td>

                        {/* Column 2: Comma Separated Ingredients */}
                        <td className="py-3.5 px-4 sm:px-6 text-stone-900 leading-relaxed border-r border-stone-300">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {groupItems.map((item, idx) => (
                              <span key={idx} className="inline-flex items-center text-xs sm:text-sm font-medium text-stone-900">
                                <span className="font-semibold text-stone-900">{translateText(item.name)}</span>
                                {item.botanical && item.botanical !== "ASS" && (
                                  <span className="text-stone-600 italic ml-1 font-normal">({item.botanical})</span>
                                )}
                                {item.botanical === "ASS" && (
                                  <span className="text-stone-500 italic ml-1 font-normal text-[11px]">(ASS)</span>
                                )}
                                {idx < groupItems.length - 1 && (
                                  <span className="text-stone-800 font-bold ml-1 font-sans">,</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Column 3: Total Herbs Count */}
                        <td className="py-3.5 px-4 sm:px-6 text-right font-medium text-stone-700">
                          {groupItems.length} {groupItems.length === 1 ? t("Herb") : t("Herbs")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })() : (
          /* General Ingredients Table without images */
          <div className="bg-white border border-stone-300 overflow-hidden max-w-7xl w-full mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse border border-stone-300">
                <thead>
                  <tr className="bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-wider border-b-2 border-stone-300">
                    <th className="py-3 px-4 sm:px-6 w-12 text-center border-r border-stone-300">#</th>
                    <th className="py-3 px-4 sm:px-6 border-r border-stone-300">{t("Active Ingredient")}</th>
                    <th className="py-3 px-4 sm:px-6">{t("Key Role & Ayurvedic Benefit")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-300 font-medium">
                  {ingredientsList.map((ing, idx) => (
                    <tr key={idx} className="bg-white hover:bg-stone-50 transition-colors border-b border-stone-300">
                      <td className="py-3.5 px-4 sm:px-6 text-stone-500 font-bold text-xs text-center border-r border-stone-300">{idx + 1}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-stone-900 whitespace-nowrap border-r border-stone-300">
                        {translateText(ing.name)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-stone-700 leading-relaxed">
                        {translateText(ing.desc)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 5: How To Use Step-by-Step */}
      <section className="bg-emerald-900/5 border-y border-emerald-900/10 py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
              {t("Directions for Use")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 mt-3">
              {t("Simple 3-Step Daily Routine")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {howToUseList.map((step, idx) => (
              <div key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl relative shadow-xs">
                <span className="absolute -top-4 left-6 bg-emerald-700 text-white font-extrabold text-xs px-3 py-1 rounded-full">
                  {t("STEP")} {step.step || idx + 1}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-2 mb-2">{translateText(step.title)}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{translateText(step.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Customer Reviews */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
              {t("Verified Reviews")}
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-3">{t("Customer Experiences")}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-stone-950">{rating}</div>
              <div className="flex text-amber-500 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-500" />
                ))}
              </div>
            </div>
            <div className="text-xs text-stone-500 font-semibold">
              {t("Based on 2,450+ verified buyers")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsList.map((rev, idx) => (
            <div key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400 font-medium">{rev.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">"{translateText(rev.comment)}"</p>
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-900">{rev.name}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {t("Verified Buyer")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Frequently Asked Questions (FAQs) */}
      <section className="bg-white py-16 px-4 sm:px-8 border-t border-stone-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
              {t("Got Questions?")}
            </span>
            <h2 className="text-3xl font-extrabold text-stone-950 mt-3">{t("Frequently Asked Questions")}</h2>
          </div>

          <div className="space-y-3">
            {faqsList.map((faq, idx) => (
              <div
                key={idx}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all bg-stone-50/50"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-stone-900 cursor-pointer hover:bg-stone-100/60"
                >
                  <span>{translateText(faq.question)}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 text-stone-500 ${activeFaq === idx ? "rotate-180 text-emerald-700" : ""}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3 bg-white">
                    {translateText(faq.answer)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: Related Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-8">{t("Related Products")}</h2>
        {relatedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-stone-100 rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : relatedProducts && relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relatedProduct, index) => {
              const prodId = relatedProduct.id || relatedProduct._id || `related-${index}`;
              const discount = relatedProduct.discountPrice
                ? Math.round(((relatedProduct.price - relatedProduct.discountPrice) / relatedProduct.price) * 100)
                : null;
              const displayPrice = relatedProduct.discountPrice ?? relatedProduct.price;
              const image = relatedProduct.galleryImages?.[0] ?? "/tulsiveda-logo.png";

              return (
                <Link
                  key={prodId}
                  href={`/shop/${prodId}`}
                  className="group flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square bg-stone-100">
                    <Image
                      src={image}
                      alt={translateText(relatedProduct.name, relatedProduct.nameHi)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount && discount > 0 && (
                      <div className="absolute top-2 right-2 bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                        {discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-stone-900 line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors">
                      {translateText(relatedProduct.name, relatedProduct.nameHi)}
                    </h3>
                    <div className="mt-auto flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-stone-900">₹{displayPrice.toLocaleString()}</span>
                      {relatedProduct.discountPrice && (
                        <span className="text-xs text-stone-400 line-through">₹{relatedProduct.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-stone-500 text-center py-8">{t("No products found")}</p>
        )}
      </div>

      {/* Image Modal Lightbox */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative w-[90vw] h-[90vh] max-w-4xl max-h-[80vh]">
            <Image
              src={activeImage || selectedImage}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 text-white hover:text-stone-300 bg-white/10 p-2 rounded-full backdrop-blur-xs transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
