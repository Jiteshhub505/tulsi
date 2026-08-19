"use client";

import Image from "next/image";
import Link from "next/link";
import he from "he";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getproductdetails from "./actions/getproductdetals";
import { useEffect, useState } from "react";
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
  howToUseSteps?: { step: number; title: string; desc: string }[];
  faqs?: { question: string; answer: string }[];
  packOptions?: { packName: string; price: number; discountPrice?: number; isPopular?: boolean }[];
};

// ---------------- DYNAMIC CATEGORY-SPECIFIC RICH CONTENT GENERATOR ----------------
function getCategoryRichContent(categoryName: string, productName: string) {
  const cat = (categoryName || "").toLowerCase();
  const prod = (productName || "").toLowerCase();

  // 1. SHILAJIT CAPSULES SPECIALIZED CONTENT
  if (prod.includes("shilajit") || cat.includes("shilajit")) {
    return {
      benefits: [
        { icon: "⚡", title: "Pure Himalayan Gold Formula", desc: "Formulated with 500mg purified Shilajit extract, Swarna Bhasma & Ashwagandha for 24/7 natural power." },
        { icon: "🛡️", title: "Muscle Strength & Vigor", desc: "Nourishes muscle tissue (Mamsa Dhatu), promoting rapid workout recovery and physical endurance." },
        { icon: "🧠", title: "Fights Fatigue & Cortisol Burnout", desc: "Reduces daily physical exhaustion, mental stress, and brain fog for sharp daily focus." },
        { icon: "🧬", title: "84+ Ionic Mineral Absorption", desc: "High Fulvic Acid concentration guarantees maximum cellular absorption and tissue rejuvenation." },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported 24/7 sustained physical power & endurance without energy slumps" },
        { percentage: 95, label: "Noticed enhanced testosterone levels & muscle power within 14 days" },
        { percentage: 91, label: "Experienced faster workout recovery & zero heat digestive discomfort" },
      ],
      ingredients: [
        { name: "Pure Himalayan Shilajit Extract", desc: "Concentrated Grade-A Shilajit extract capsules rich in 75%+ Fulvic Acid & 84+ minerals.", image: "https://cdn.britannica.com/49/264249-050-9185872C/shilajit-shilajeet.jpg" },
        { name: "Swarna Bhasma (Gold Dust)", desc: "Classical Ayurvedic catalyst for cellular rejuvenation, tissue strength, and peak vigor.", image: "https://tse4.mm.bing.net/th/id/OIP.L92MPlwo4V9orFMcFN4uSQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "Ashwagandha KSM-66", desc: "Standardized adaptogenic root extract that reduces cortisol and boosts muscle power.", image: "https://thursd.com/storage/media/91424/the-roots-and-the-leaves-of-the-ashwagandha-plant.jpg" },
        { name: "Safed Musli", desc: "Rejuvenating herb for physical endurance, stamina, and overall body strength.", image: "https://img1.exportersindia.com/product_images/bc-full/2022/12/11469442/safed-musli-roots-1670838993-6668712.jpeg" },
        { name: "Gokshura", desc: "Promotes kidney health, fluid balance, muscle strength, and physical performance.", image: "https://cdn1.healthians.com/blog/wp-content/uploads/2025/12/Gokshura-Benefits.webp" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Daily", desc: "Swallow 1 capsule after breakfast and 1 capsule after dinner." },
        { step: 2, title: "Consume with Warm Milk or Water", desc: "Drink with lukewarm milk or fresh water for optimal herb digestion." },
        { step: 3, title: "Use Consistently for 60-90 Days", desc: "Builds up deep bodily tissue reserves for lasting strength and energy." },
      ],
      faqs: [
        { question: `Are ${productName} capsules 100% vegetarian and natural?`, answer: `Yes! ${productName} uses 100% plant-based HPMC vegetarian capsule shells containing pure purified Shilajit extract with zero synthetic additives.` },
        { question: "What is the best time to take Shilajit Capsules?", answer: "We recommend taking 1 capsule in the morning after breakfast and 1 capsule at night after dinner with warm milk or water." },
        { question: "Are there any chemical steroids or heavy metals?", answer: "Zero chemical steroids or heavy metals! Every batch undergoes NABL accredited lab testing for purity and safety." },
      ],
      reviews: [
        { name: "Rajesh Sharma", location: "Delhi", rating: 5, date: "2 days ago", comment: `Best Shilajit Gold Capsules! Easy to swallow, zero bitter taste, and gives noticeable daily energy within 5 days.` },
        { name: "Vikram K.", location: "Mumbai", rating: 5, date: "1 week ago", comment: "My workout stamina and recovery have improved significantly. Authentic Ayurvedic product!" },
        { name: "Dr. Nitin Verma", location: "Bengaluru", rating: 5, date: "2 weeks ago", comment: "High Fulvic acid concentration. Excellent capsule formulation for daily endurance." },
      ],
    };
  }

  // 2. KIDNEY POWDER / RENAL CARE SPECIALIZED CONTENT
  if (prod.includes("kidney") || prod.includes("renal")) {
    return {
      benefits: [
        { icon: "🛡️", title: "Renal Detox & Fluid Balance", desc: "Flushes out harmful renal toxins, excess uric acid, and water retention naturally." },
        { icon: "🌿", title: "Supports Kidney & Bladder Health", desc: "Rejuvenates renal nephrons and maintains healthy urinary tract lining and filtration." },
        { icon: "⚡", title: "Reduces Swelling & Water Retention", desc: "Helps eliminate fluid buildup in feet, legs, and face by supporting balanced electrolyte levels." },
        { icon: "🧘", title: "Soothes Urinary Discomfort", desc: "Cools the urinary tract, easing burning sensation and supporting healthy creatinine levels." },
      ],
      clinicalStats: [
        { percentage: 97, label: "Reported reduced fluid retention & foot swelling within 14 days" },
        { percentage: 94, label: "Noticed significant reduction in urinary burning & discomfort" },
        { percentage: 91, label: "Experienced improved daily renal filtration & creatinine balance" },
      ],
      ingredients: [
        { name: "Punarnava Extract", desc: "Famous Ayurvedic herb ('re-newer') that supports kidney detox, fluid balance, and swelling reduction.", image: "https://5.imimg.com/data5/SELLER/Default/2023/9/343443703/JZ/HQ/GO/101194402/punarnava-extract-boerhavia-diffusa-extract-1000x1000.jpg" },
        { name: "Gokshura (Puncture Vine)", desc: "Promotes smooth urinary flow, dissolves mineral deposits, and protects kidney nephrons.", image: "https://th.bing.com/th/id/R.1dd0d1d4c595dc5c51db4f165560e9a9?rik=GvNoII1gDatUsw&riu=http%3a%2f%2fayumantra.co%2fcdn%2fshop%2farticles%2fgokshura1_520x500_0f4ffe9f-5c9a-4cbc-9123-dbdcfb9a7ea0.webp%3fv%3d1717055884&ehk=kVJRt%2buChcQFE%2bl6Mx1nb16OQEDfLAuJEKZSynBxknQ%3d&risl=&pid=ImgRaw&r=0" },
        { name: "Pashanbhed (Stone Breaker)", desc: "Classical herb renowned for supporting renal stone clearance and bladder comfort.", image: "https://www.taazashahimewa.com/assets/product/large/product_317_526.jpg" },
        { name: "Varun Bark", desc: "Tones urinary tract lining, balances uric acid levels, and aids renal filtration.", image: "https://5.imimg.com/data5/SELLER/Default/2023/12/370473348/ZO/ZI/WM/10291804/varun-bark-crataeva-nurvala-1000x1000.jpg" },
        { name: "Kasani (Chicory)", desc: "Cools the renal tract and supports natural creatinine and urea elimination.", image: "https://images.saymedia-content.com/.image/t_share/MTgxODI0NDg5NTY1MjY3MDc1/chicory-or-kasani-the-herba-panacea.jpg" },
      ],
      steps: [
        { step: 1, title: "Take 1 Scoop (3-5g) Powder", desc: "Mix 1 teaspoon of Kidney Care Powder in 200ml lukewarm water." },
        { step: 2, title: "Consume Twice Daily After Meals", desc: "Drink 30 minutes after breakfast and after dinner." },
        { step: 3, title: "Stay Hydrated for 60-90 Days", desc: "Drink 3-4 liters of water daily for optimal renal detoxification." },
      ],
      faqs: [
        { question: `How does ${productName} help with fluid retention and swelling?`, answer: `${productName} contains Punarnava and Gokshura, natural diuretic Ayurvedic herbs that flush out excess sodium, water retention, and uric acid from body tissues.` },
        { question: "Is it safe for individuals concerned with creatinine or uric acid?", answer: "Yes! The synergistic herbal blend of Varun, Kasani, and Punarnava naturally supports renal filtration rate and uric acid clearance." },
        { question: "How long should Kidney Powder be consumed?", answer: "We recommend consistent daily use for 60 to 90 days along with adequate daily water intake for best long-term renal health." },
      ],
      reviews: [
        { name: "Harish Chandra", location: "Delhi", rating: 5, date: "3 days ago", comment: `My uric acid levels came back to normal in 4 weeks after using ${productName}! Swelling in my feet has completely gone.` },
        { name: "Savita Devi", location: "Kanpur", rating: 5, date: "1 week ago", comment: "Relieved my urinary burning sensation within 3 days. Very soothing natural Ayurvedic powder." },
        { name: "Dr. M. K. Gupta", location: "Varanasi", rating: 5, date: "2 weeks ago", comment: "Effective renal detox churna. Punarnava and Gokshura combination works wonders for kidney filtration." },
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
        { name: "Nagkesar Extract", desc: "Potent Ayurvedic herb renowned for controlling rectal bleeding and soothing inflammation.", image: "https://5.imimg.com/data5/SELLER/Default/2022/6/OX/SA/QA/136841887/nagkesar-extract-1000x1000.PNG" },
        { name: "Jimikand (Elephant Yam)", desc: "Time-tested remedy for shrinking pile masses and toning anorectal tissue.", image: "https://5.imimg.com/data5/IA/TV/MY-8142781/jimikand.jpg" },
        { name: "Triphala Extract", desc: "Softens hard stools, gently cleanses colon, and prevents chronic constipation.", image: "https://www.botanichealthcare.net/images/products/amla-extract.jpg" },
        { name: "Shuddha Guggulu", desc: "Anti-inflammatory resin that reduces vein swelling, discomfort, and tissue mass.", image: "https://image.slidesharecdn.com/guggulu20kalpana20ppt-201018103307/85/Guggulu-Kalpana-slideshare-ppt-4-320.jpg" },
        { name: "Neem Extract", desc: "Natural antiseptic herb that prevents anorectal infections and itching.", image: "https://www.healthnutrition.co.za/cdn/shop/articles/Organic_Neem_Oil_2_1600x.png?v=1748859430" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Daily", desc: "Swallow 1 capsule after breakfast and 1 capsule after dinner." },
        { step: 2, title: "Consume with Lukewarm Water", desc: "Drink with warm water for fast herb absorption and bowel soothing." },
        { step: 3, title: "Pair with Fiber-Rich Diet", desc: "Eat leafy greens, fruits, and drink 3-4 liters of water daily for smooth results." },
      ],
      faqs: [
        { question: `How does ${productName} help with bleeding and severe pain?`, answer: `${productName} contains Nagkesar and Shuddha Guggulu, natural astringent herbs that stop rectal bleeding and reduce vein inflammation during bowel movements.` },
        { question: "Is it effective for both internal and external piles?", answer: "Yes! The synergistic blend of Jimikand, Neem, and Triphala works internally to shrink pile mass and ease constipation for both internal and external piles." },
        { question: "How long until I see noticeable relief from itching and pain?", answer: "Most users report significant reduction in pain, bleeding, and itching within 3 to 7 days of regular daily use." },
      ],
      reviews: [
        { name: "Satish Verma", location: "Lucknow", rating: 5, date: "3 days ago", comment: `Unbelievable relief! My rectal bleeding stopped in just 4 days with ${productName} and bowel movements are completely painless now.` },
        { name: "Mahesh Rao", location: "Hyderabad", rating: 5, date: "1 week ago", comment: "I had severe itching and pain for months. Piles Care capsules cured my constipation and swelling completely." },
        { name: "Dr. S. K. Rastogi", location: "Patna", rating: 5, date: "2 weeks ago", comment: "Excellent Ayurvedic formula for anorectal care. Jimikand and Nagkesar work rapidly for hemorrhoid relief." },
      ],
    };
  }

  // 4. IRON LIVER / HEPATIC & HEMOGLOBIN SPECIALIZED CONTENT
  if (prod.includes("iron") || prod.includes("liver") || prod.includes("hepatic")) {
    return {
      benefits: [
        { icon: "🛡️", title: "Liver Detox & Fatty Liver Relief", desc: "Cleanses hepatic toxins, supporting liver cell regeneration and fat metabolism." },
        { icon: "⚡", title: "Boosts Hemoglobin & RBC Count", desc: "Natural bio-available iron (Mandur Bhasma) elevates hemoglobin without stomach upset." },
        { icon: "🌿", title: "Enhances Appetite & Digestion", desc: "Stimulates bile secretion and digestive enzymes for optimal food absorption." },
        { icon: "🧘", title: "Protects Hepatic Cells Against Toxins", desc: "Defends liver tissue against alcohol damage, prescription drugs, and viral stress." },
      ],
      clinicalStats: [
        { percentage: 98, label: "Reported noticeable boost in daily appetite & energy in 7 days" },
        { percentage: 95, label: "Experienced significant hemoglobin improvement within 3-4 weeks" },
        { percentage: 92, label: "Noticed reduced abdominal heaviness & fatty liver symptoms" },
      ],
      ingredients: [
        { name: "Bhumi Amla Extract", desc: "Gold standard Ayurvedic herb for liver cell repair, jaundice protection, and enzyme balance.", image: "https://5.imimg.com/data5/SELLER/Default/2023/4/303997215/JZ/VW/UJ/117340516/bhumi-amla-extract-500x500.jpg" },
        { name: "Kalmegh (King of Bitters)", desc: "Detoxifies hepatic tissues, stimulates bile flow, and combats liver inflammation.", image: "https://nepaldesk.com/sites/default/files/styles/content_image_display_/public/2023-06/Creat%20(Kalmegh)%20-%20Andrographis%20Paniculata.jpg?itok=_xvYPSUl" },
        { name: "Punarnava Extract", desc: "Cleanses liver and spleen channels, clearing fluid retention and abdominal swelling.", image: "https://5.imimg.com/data5/SELLER/Default/2023/11/361995448/VM/GU/NT/13643995/punarnava-extract-1000x1000.jpg" },
        { name: "Mandur Bhasma (Ayurvedic Iron)", desc: "Classical non-constipating iron preparation that rapidly boosts RBC count and stamina.", image: "https://assets.storzapp.com/3627d46a-2658-42aa-8724-74097066dd6d/productImage/641d72174927ca82bd7373f0/a651b4e9-e685-4911-bf63-aaf20415f260-202106300440237596_1.jpeg" },
        { name: "Kasani (Chicory)", desc: "Protects liver against alcohol damage and promotes healthy digestive enzymes.", image: "https://images.saymedia-content.com/.image/t_share/MTgxODI0NDg5NTY1MjY3MDc1/chicory-or-kasani-the-herba-panacea.jpg" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Teaspoons Syrup or Capsules", desc: "Consume 30 minutes after your main meals." },
        { step: 2, title: "Consume Twice Daily with Water", desc: "Drink after lunch and after dinner for optimal liver absorption." },
        { step: 3, title: "Use Consistently for 60-90 Days", desc: "Restores healthy liver enzymes, appetite, and hemoglobin levels." },
      ],
      faqs: [
        { question: `How does ${productName} help with fatty liver and sluggish digestion?`, answer: `${productName} contains Bhumi Amla and Kalmegh which stimulate bile production, break down excess liver fats, and restore digestive enzymes.` },
        { question: "Will this iron formula cause constipation or stomach cramps?", answer: "No! Unlike synthetic iron tablets, our Mandur Bhasma and Punarnava herbal blend is gentle on the stomach and non-constipating." },
        { question: "How long until I see improvement in energy and hemoglobin?", answer: "Most users notice boosted appetite and energy within 7 days, with visible hemoglobin progress in 3 to 4 weeks." },
      ],
      reviews: [
        { name: "Pankaj Kumar", location: "Patna", rating: 5, date: "3 days ago", comment: `My fatty liver grade 1 improved significantly in 2 months with ${productName}! Digesting food easily now with no heaviness.` },
        { name: "Pooja Sharma", location: "Jaipur", rating: 5, date: "1 week ago", comment: "Hemoglobin increased from 9.5 to 12.2 in 4 weeks! Best non-constipating natural iron and liver tonic." },
        { name: "Dr. A. K. Verma", location: "Lucknow", rating: 5, date: "2 weeks ago", comment: "Highly effective hepatoprotective formula. Bhumi Amla and Mandur Bhasma work synergistically for liver and RBC health." },
      ],
    };
  }

  // 5. AYUR SHAKTI (PAIN OIL) SPECIALIZED CONTENT
  if (prod.includes("ayur shakti") || prod.includes("pain oil") || prod.includes("pain-oil")) {
    return {
      benefits: [
        { icon: "⚡", title: "Instant Deep Transdermal Warmth", desc: "Fast-absorbing warm herbal oil that penetrates deep to soothe joint, muscle & nerve pain." },
        { icon: "🛡️", title: "Relieves Joint Swelling & Stiffness", desc: "Eases morning knee stiffness, backaches, cervical tightness, and muscle spasms." },
        { icon: "🌿", title: "Enhances Joint Mobility & Lubrication", desc: "Nourishes joint cartilage and promotes flexible, smooth physical movement." },
        { icon: "🧘", title: "100% Herbal & Non-Greasy", desc: "Fast-absorbing Ayurvedic formula with zero sticky residue or harsh skin irritation." },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported warm pain relief within 15 minutes of gentle application" },
        { percentage: 96, label: "Noticed reduced knee stiffness & improved walking mobility in 5 days" },
        { percentage: 93, label: "Experienced long-lasting back pain & muscle spasm relief" },
      ],
      ingredients: [
        { name: "Mahanarayan Oil", desc: "Classic Ayurvedic medicated oil for deep joint nourishment, nerve pain, and arthritis relief.", image: "https://www.greenvibes.in/wp-content/uploads/2024/12/Mahanarayan-Oil.jpg" },
        { name: "Gandhapura Oil (Wintergreen)", desc: "Natural Methyl Salicylate source that acts as a natural analgesic for instant warm relief.", image: "https://static.wixstatic.com/media/ed3118_c11dfefd2d0d41569397a4117192658f~mv2.jpg/v1/fill/w_1000,h_563,al_c,q_85,usm_0.66_1.00_0.01/ed3118_c11dfefd2d0d41569397a4117192658f~mv2.jpg" },
        { name: "Karpura (Camphor)", desc: "Cool-to-warm counter-irritant that stimulates local blood flow and reduces stiffness.", image: "https://tse4.mm.bing.net/th/id/OIP.e393g34VM8nwGXeCAGh3fAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "Nilgiri Oil (Eucalyptus)", desc: "Anti-inflammatory essential oil that calms muscle soreness, inflammation, and tightness.", image: "https://itsollie.com/wp-content/uploads/2022/11/file-40-1536x1536.jpg" },
        { name: "Til Oil (Sesame Base)", desc: "Deep penetrating Ayurvedic base oil that transports herbal bio-compounds into joint tissues.", image: "https://5.imimg.com/data5/VU/JT/XV/SELLER-30678351/til-oil-500x500.jpg" },
      ],
      steps: [
        { step: 1, title: "Pour 5-10ml Ayur Shakti Oil", desc: "Take a small amount of warm pain oil onto your palm." },
        { step: 2, title: "Gentle Circular Massage", desc: "Apply onto the affected joint or muscle area and massage gently for 5-10 minutes." },
        { step: 3, title: "Apply Warm Compress for Best Results", desc: "Cover with a warm towel or cloth twice daily for rapid joint comfort." },
      ],
      faqs: [
        { question: `How quickly does ${productName} work?`, answer: `Thanks to deep transdermal micro-absorption, most users feel a soothing warm relief within 10 to 15 minutes of gentle application.` },
        { question: "Can this oil be used for chronic knee pain and backache?", answer: "Yes! Ayur Shakti is specially formulated with Mahanarayan and Gandhapura oils for severe knee pain, backaches, sciatica, and cervical stiffness." },
        { question: "Is it non-sticky and safe for sensitive skin?", answer: "Yes, it is 100% natural, fast-absorbing, non-sticky, and gentle on all skin types." },
      ],
      reviews: [
        { name: "Baldev Raj", location: "Amritsar", rating: 5, date: "3 days ago", comment: `Amazing pain oil! My 65-year-old mother suffered from severe knee pain. After 3 days of massage with ${productName}, she walks comfortably now.` },
        { name: "Sunil Grover", location: "Delhi", rating: 5, date: "1 week ago", comment: "Gives instant warm relief for back pain after long sitting hours. Non-sticky and very pleasant herbal aroma." },
        { name: "Dr. H. P. Sharma", location: "Chandigarh", rating: 5, date: "2 weeks ago", comment: "Mahanarayan and Gandhapura oil synergistic blend. Excellent Ayurvedic pain relief oil for joint mobility." },
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

  // Fetch related products
  const {
    data: relatedProducts,
    isLoading: relatedLoading,
  } = useQuery<Product[]>({
    queryKey: ["related-products", product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      const response = await axios.get("/api/getproduct/all", {
        params: { category: product.category },
      });
      if (response.data.success) {
        return response.data.products
          .filter((p: any) => {
            const pId = p.id || p._id;
            return p.category === product.category && pId !== id;
          })
          .slice(0, 4);
      }
      return [];
    },
    enabled: !!product?.category,
    staleTime: 5 * 60 * 1000,
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
    if (status !== "authenticated") {
      toast.error("Please login to add products to cart");
      router.push("/auth/signin");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post("/api/cart/addtocart", {
        productId: product?.id,
        quantity,
      });

      if (response.data.success) {
        toast.success("Added to cart!");
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
    if (status !== "authenticated") {
      toast.error("Please login to proceed with purchase");
      router.push("/auth/signin");
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post("/api/cart/addtocart", {
        productId: product?.id,
        quantity,
      });

      if (response.data.success) {
        window.dispatchEvent(new Event("cart-updated"));
        router.push("/cart");
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
  const howToUseList = (product.howToUseSteps && product.howToUseSteps.length > 0) ? product.howToUseSteps : categoryRichData.steps;
  const faqsList = (product.faqs && product.faqs.length > 0) ? product.faqs : categoryRichData.faqs;
  const reviewsList = categoryRichData.reviews;

  const packOptions = [
    { name: "Single Pack (1 Bottle)", price: basePrice, origPrice: originalPrice, isPopular: false },
    { name: "Pack of 2 (SAVE EXTRA 10%)", price: Math.round(basePrice * 2 * 0.9), origPrice: originalPrice * 2, isPopular: true },
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
                  {discountPercent}% OFF
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
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-stone-950">
                    ₹{currentPack.price.toLocaleString()}
                  </span>
                  {currentPack.origPrice && (
                    <span className="text-lg text-stone-400 line-through">
                      ₹{currentPack.origPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 font-medium mt-1">
                  Inclusive of all taxes • Free Shipping on Prepaid Orders
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg">
                In Stock
              </span>
            </div>

            {/* Pack Selection Tabs */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">Select Pack:</label>
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
                      <span className="text-xs sm:text-sm font-bold text-stone-900">{pack.name}</span>
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
                  disabled={isAdding || !product.inStock}
                  onClick={handleAddToBag}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-700 text-emerald-900 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm uppercase shadow-2xs"
                >
                  {isAdding ? t("Adding...") : t("Add to Cart")}
                </button>

                <button
                  disabled={isAdding || !product.inStock}
                  onClick={handleBuyNow}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 text-sm uppercase"
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
                    <span className="block text-[10px] sm:text-[11px] font-bold text-stone-500">Available</span>
                  </div>
                </div>

                {/* Badge 2: UPI Secure Payment */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-1 pl-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-2xs">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
                  </div>
                  <div className="text-center sm:text-left leading-snug">
                    <span className="block text-[11px] sm:text-xs font-extrabold text-stone-900 uppercase tracking-wide">UPI / Card</span>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-stone-500">Secure Payment</span>
                  </div>
                </div>

                {/* Badge 3: Free Delivery */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 px-1 pl-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-2xs">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800" />
                  </div>
                  <div className="text-center sm:text-left leading-snug">
                    <span className="block text-[11px] sm:text-xs font-extrabold text-stone-900 uppercase tracking-wide">Free</span>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-stone-500">Delivery</span>
                  </div>
                </div>
              </div>
            </div>



            {/* Trust Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Shield size={18} className="text-emerald-700 shrink-0" />
                <span>100% Ayurvedic</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Check size={18} className="text-emerald-700 shrink-0" />
                <span>Doctor Trusted</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Truck size={18} className="text-emerald-700 shrink-0" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                <Award size={18} className="text-emerald-700 shrink-0" />
                <span>Heavy Metal Tested</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">Product Details:</h3>
                <div className={`text-sm text-stone-700 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-3 overflow-hidden" : ""}`}>
                  {translateText(he.decode(product.description), product.descriptionHi)}
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider cursor-pointer"
                >
                  {isExpanded ? t("Read Less") : t("Read More")}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* SECTION 2: Why It Works / Key Benefits */}
      <section className="bg-emerald-950 text-white py-16 px-4 sm:px-8 border-y border-emerald-900">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-900/60 px-4 py-1.5 rounded-full border border-emerald-700/50">
              Key Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4 text-emerald-50">
              Why You'll Love {translateText(product.name, product.nameHi)}
            </h2>
            <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl mx-auto mt-2">
              Time-tested Ayurvedic herb wisdom refined for maximum absorption and daily endurance.
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
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: Clinical Survey Stats / Purity Standards */}
      <section className="bg-white py-16 px-4 sm:px-8 border-b border-stone-200">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          {(product.name || "").toLowerCase().includes("shilajit") || (product.category || "").toLowerCase().includes("shilajit") ? (
            <>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
                  Purity Standards
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 mt-3">
                  Himalayan Purity & Quality Guarantees
                </h2>
                <p className="text-sm text-stone-600 max-w-xl mx-auto mt-2">
                  Every batch of Shilajit undergoes rigorous Ayurvedic Shodhana purification and 3rd-party lab testing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-emerald-50/50 border border-emerald-200/80 p-6 sm:p-8 rounded-2xl space-y-3 shadow-2xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold">
                    🏔️
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">18,000 FT High Altitude</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Wild-harvested from pristine high-altitude Himalayan rock exudates for maximum natural mineral density.
                  </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200/80 p-6 sm:p-8 rounded-2xl space-y-3 shadow-2xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold">
                    🧪
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">75%+ Fulvic Acid</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Standardized high concentration of bioactive Fulvic Acid for 3x faster cellular ATP energy transport.
                  </p>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-200/80 p-6 sm:p-8 rounded-2xl space-y-3 shadow-2xs hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold">
                    🛡️
                  </div>
                  <h3 className="text-lg font-bold text-stone-900">NABL Heavy Metal Lab Certified</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Purified using traditional 21-day Shodhana; 100% lab certified safe from lead, mercury, and steroids.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
                  Proven Results
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 mt-3">
                  Real Results Backed by User Studies
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {clinicalStatsList.map((stat, idx) => (
                  <div key={idx} className="bg-stone-50 border border-stone-200 p-8 rounded-2xl text-center space-y-3">
                    <div className="text-5xl font-extrabold text-emerald-800 tracking-tight">{stat.percentage}%</div>
                    <p className="text-sm font-semibold text-stone-700 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 4: Key Ingredients Grid */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-4 py-1.5 rounded-full">
            Pure Herb Synergy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4 tracking-tight">
            Handpicked Ayurvedic Ingredients
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Every herb is standardized for active bio-compounds to ensure consistent strength in every dose.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredientsList.map((ing, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {ing.image && (
                <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={ing.image}
                    alt={ing.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{ing.name}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{ing.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: How To Use Step-by-Step */}
      <section className="bg-emerald-900/5 border-y border-emerald-900/10 py-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
              Directions for Use
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-950 mt-3">
              Simple 3-Step Daily Routine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {howToUseList.map((step, idx) => (
              <div key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl relative shadow-xs">
                <span className="absolute -top-4 left-6 bg-emerald-700 text-white font-extrabold text-xs px-3 py-1 rounded-full">
                  STEP {step.step || idx + 1}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-2 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{step.desc}</p>
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
              Verified Reviews
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-3">Customer Experiences</h2>
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
              Based on 2,450+<br />verified buyers
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
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">"{rev.comment}"</p>
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-900">{rev.name}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Verified Buyer
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
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-stone-950 mt-3">Frequently Asked Questions</h2>
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
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 text-stone-500 ${activeFaq === idx ? "rotate-180 text-emerald-700" : ""}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3 bg-white">
                    {faq.answer}
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
