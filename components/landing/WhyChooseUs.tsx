"use client";

import React from "react";
import Link from "next/link";
import { 
  Leaf, 
  CheckCircle2, 
  XCircle,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

/* ---------------- 3D CUSTOM VECTOR ILLUSTRATION ICONS ---------------- */

// 1. Lab Tested Shield with Gold Laurel & Check
function LabTestedIcon() {
  return (
    <svg viewBox="0 0 72 72" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="34" fill="url(#labBg)" />
      <circle cx="36" cy="36" r="33" stroke="#059669" strokeWidth="1" strokeOpacity="0.3" />
      {/* 3D Shield */}
      <path d="M36 14L50 20V34C50 44 44 52 36 56C28 52 22 44 22 34V20L36 14Z" fill="url(#labShield)" />
      {/* Shield Inner Bevel */}
      <path d="M36 16L48 21.5V33.5C48 42.5 42.8 49.8 36 53.5V16Z" fill="#10B981" fillOpacity="0.4" />
      <path d="M36 16L24 21.5V33.5C24 42.5 29.2 49.8 36 53.5V16Z" fill="#047857" fillOpacity="0.3" />
      {/* Gold Laurel Wreath */}
      <path d="M26 38C26 43 29 46 36 49C43 46 46 43 46 38" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
      {/* 3D Checkmark */}
      <path d="M30 33L35 38L43 28" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkles */}
      <circle cx="21" cy="22" r="2" fill="#FBBF24" />
      <circle cx="51" cy="20" r="1.5" fill="#FBBF24" />
      <defs>
        <linearGradient id="labBg" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFDF5" />
          <stop offset="1" stopColor="#D1FAE5" />
        </linearGradient>
        <linearGradient id="labShield" x1="22" y1="14" x2="50" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="26" y1="38" x2="46" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 2. Standardized Botanical Extracts - 3D Mortar & Gold Sparkles
function BotanicalExtractIcon() {
  return (
    <svg viewBox="0 0 72 72" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="34" fill="url(#botBg)" />
      <circle cx="36" cy="36" r="33" stroke="#D97706" strokeWidth="1" strokeOpacity="0.3" />
      {/* Mortar Body */}
      <path d="M22 33C22 33 22 49 36 49C50 49 50 33 50 33H22Z" fill="url(#mortarGrad)" />
      <ellipse cx="36" cy="33" rx="14" ry="4" fill="#047857" />
      <ellipse cx="36" cy="33" rx="12" ry="2.5" fill="#064E3B" />
      {/* Pestle */}
      <path d="M41 18L32 34" stroke="url(#pestleGrad)" strokeWidth="5.5" strokeLinecap="round" />
      {/* Floating Golden Plant Leaf */}
      <path d="M36 21C42 16 48 20 47 27C42 27 37 24 36 21Z" fill="url(#leafGold)" />
      <path d="M36 21C41 24 44 26 47 27" stroke="#92400E" strokeWidth="1" strokeLinecap="round" />
      {/* Golden Extraction Essence Droplets */}
      <circle cx="36" cy="40" r="2.5" fill="#FBBF24" />
      <path d="M21 24L23 27L25 24L23 21Z" fill="#F59E0B" />
      <path d="M49 42L51 45L53 42L51 39Z" fill="#F59E0B" />
      <defs>
        <linearGradient id="botBg" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF3C7" />
          <stop offset="1" stopColor="#ECFDF5" />
        </linearGradient>
        <linearGradient id="mortarGrad" x1="22" y1="33" x2="50" y2="49" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="pestleGrad" x1="41" y1="18" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="leafGold" x1="36" y1="16" x2="47" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 3. 100% Natural & Safe - 3D Sacred Tulsi Leaf & Pure Droplet
function NaturalSafeIcon() {
  return (
    <svg viewBox="0 0 72 72" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="34" fill="url(#natBg)" />
      <circle cx="36" cy="36" r="33" stroke="#059669" strokeWidth="1" strokeOpacity="0.3" />
      {/* 3D Main Healing Leaf */}
      <path d="M22 46C20 30 35 18 50 18C50 34 38 48 22 46Z" fill="url(#leafMain)" />
      <path d="M22 46C31 38 41 28 50 18" stroke="#ECFDF5" strokeWidth="1.8" strokeLinecap="round" />
      {/* Side Leaf Accent */}
      <path d="M23 44C20 37 26 31 32 30C32 37 28 43 23 44Z" fill="#047857" />
      {/* 3D Pure Water Dew Droplet */}
      <path d="M42 32C42 36 38 39 34 39C30 39 30 36 34 30C38 30 42 30 42 32Z" fill="url(#dewDrop)" />
      <circle cx="33" cy="34" r="1" fill="white" />
      {/* 0% Chemical Badge */}
      <rect x="18" y="47" width="24" height="10" rx="5" fill="#065F46" />
      <text x="30" y="54" fill="#A7F3D0" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">0% TOXIN</text>
      <defs>
        <linearGradient id="natBg" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FDF4" />
          <stop offset="1" stopColor="#DCFCE7" />
        </linearGradient>
        <linearGradient id="leafMain" x1="20" y1="18" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="dewDrop" x1="30" y1="30" x2="42" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67E8F9" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 4. Classical Samhita Science - 3D Ancient Scroll & Elixir Beaker
function ClassicalScienceIcon() {
  return (
    <svg viewBox="0 0 72 72" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="34" fill="url(#sciBg)" />
      <circle cx="36" cy="36" r="33" stroke="#0D9488" strokeWidth="1" strokeOpacity="0.3" />
      {/* Ancient Manuscript Scroll */}
      <rect x="18" y="20" width="24" height="32" rx="3" fill="url(#scrollGrad)" stroke="#D97706" strokeWidth="1.5" />
      <line x1="22" y1="26" x2="38" y2="26" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="31" x2="38" y2="31" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="36" x2="34" y2="36" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28" cy="44" r="3" fill="#D97706" />
      {/* 3D Chemistry Conical Flask */}
      <path d="M42 22H46V28L52 42C53 45 51 48 48 48H40C37 48 35 45 36 42L42 28V22Z" fill="url(#flaskGrad)" stroke="#047857" strokeWidth="1.5" />
      {/* Elixir Bubbles inside Flask */}
      <ellipse cx="44" cy="44" rx="5" ry="2" fill="#34D399" />
      <circle cx="43" cy="38" r="1.5" fill="#6EE7B7" />
      <circle cx="46" cy="34" r="1" fill="#6EE7B7" />
      <defs>
        <linearGradient id="sciBg" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FDFA" />
          <stop offset="1" stopColor="#CCFBF1" />
        </linearGradient>
        <linearGradient id="scrollGrad" x1="18" y1="20" x2="42" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF3C7" />
          <stop offset="1" stopColor="#FDE68A" />
        </linearGradient>
        <linearGradient id="flaskGrad" x1="36" y1="22" x2="52" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFDF5" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 5. Lasting Dosha Balance - 3D Tridosha Sacred Lotus Mandala
function DoshaBalanceIcon() {
  return (
    <svg viewBox="0 0 72 72" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="34" fill="url(#doshaBg)" />
      <circle cx="36" cy="36" r="33" stroke="#059669" strokeWidth="1" strokeOpacity="0.3" />
      {/* Outer Sacred Halo */}
      <circle cx="36" cy="36" r="22" stroke="url(#haloGrad)" strokeWidth="2" strokeDasharray="3 3" />
      {/* Central 3D Balance Chakra Lotus */}
      {/* Vata Petal (Cyan/Air) */}
      <path d="M36 36C32 26 40 20 46 26C46 32 40 36 36 36Z" fill="url(#vataGrad)" />
      {/* Pitta Petal (Fiery Amber/Fire) */}
      <path d="M36 36C46 36 50 44 42 48C36 48 36 40 36 36Z" fill="url(#pittaGrad)" />
      {/* Kapha Petal (Lush Green/Earth) */}
      <path d="M36 36C36 46 28 50 24 42C24 36 32 36 36 36Z" fill="url(#kaphaGrad)" />
      {/* Golden Center Core */}
      <circle cx="36" cy="36" r="5" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.5" />
      <circle cx="36" cy="36" r="2" fill="#78350F" />
      <defs>
        <linearGradient id="doshaBg" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FDF4" />
          <stop offset="1" stopColor="#E0F2FE" />
        </linearGradient>
        <linearGradient id="haloGrad" x1="14" y1="14" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="vataGrad" x1="32" y1="20" x2="46" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="pittaGrad" x1="36" y1="36" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="kaphaGrad" x1="24" y1="36" x2="36" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 6. Pan-India Free Delivery & COD - 3D Express Van & Gold Rupee Coin
function FreeDeliveryCodIcon() {
  return (
    <svg viewBox="0 0 72 72" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="34" fill="url(#truckBg)" />
      <circle cx="36" cy="36" r="33" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />
      {/* 3D Delivery Van Cabin & Cargo */}
      <rect x="18" y="26" width="22" height="18" rx="3" fill="url(#vanBody)" />
      <path d="M40 31H47L52 37V44H40V31Z" fill="#047857" />
      <path d="M42 33H46L49.5 37.5H42V33Z" fill="#ECFDF5" />
      {/* Van Wheels */}
      <circle cx="26" cy="45" r="4.5" fill="#1F2937" />
      <circle cx="26" cy="45" r="2" fill="#E5E7EB" />
      <circle cx="46" cy="45" r="4.5" fill="#1F2937" />
      <circle cx="46" cy="45" r="2" fill="#E5E7EB" />
      {/* Speed Streaks */}
      <path d="M12 30H16" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 35H15" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 40H16" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      {/* 3D Floating Gold Coin Badge with ₹ symbol */}
      <circle cx="48" cy="22" r="9" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="1" />
      <text x="48" y="26" fill="#78350F" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">₹</text>
      <defs>
        <linearGradient id="truckBg" x1="8" y1="8" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFDF5" />
          <stop offset="1" stopColor="#D1FAE5" />
        </linearGradient>
        <linearGradient id="vanBody" x1="18" y1="26" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="coinGrad" x1="39" y1="13" x2="57" y2="31" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function WhyChooseUs() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const pillars = [
    {
      icon: <LabTestedIcon />,
      badge: isHi ? "आयुष व GMP प्रमाणित" : "AYUSH & GMP Certified",
      title: isHi ? "100% लैब परीक्षित व शुद्ध" : "100% Lab Tested & Certified",
      desc: isHi 
        ? "हमारे सभी उत्पाद 24+ गुणवत्ता मानकों, भारी धातुओं और कीटनाशक मुक्त शुद्धता परीक्षणों से गुजरते हैं।"
        : "Every batch is verified across 24+ stringent safety parameters, ensuring zero heavy metals or contaminants.",
      color: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-200/80",
    },
    {
      icon: <BotanicalExtractIcon />,
      badge: isHi ? "5 गुना अधिक प्रभावशीलता" : "5x Higher Potency",
      title: isHi ? "मानकीकृत पादप सत्व (Grade-A)" : "Standardized Botanical Extracts",
      desc: isHi
        ? "साधारण कच्चे चूर्ण के बजाय मानकीकृत एक्टिव एक्सट्रैक्ट्स (जैसे 60% फुल्विक एसिड) का उपयोग, जो तेजी से असर दिखाते हैं।"
        : "Formulated using standardized active botanicals (like 60% Fulvic Shilajit) rather than generic unrefined powders.",
      color: "from-amber-500/10 to-emerald-500/5",
      border: "border-amber-200/80",
    },
    {
      icon: <NaturalSafeIcon />,
      badge: isHi ? "हानिकारक रसायनों से मुक्त" : "Zero Chemicals & Steroids",
      title: isHi ? "100% प्राकृतिक व सुरक्षित" : "100% Natural & Safe",
      desc: isHi
        ? "स्टेरॉयड, कृत्रिम परिरक्षकों या सिंथेटिक रसायनों से पूर्णतः मुक्त। कोई आदत या दुष्प्रभाव नहीं।"
        : "Strictly free from steroids, artificial additives, binders, or parabens. Non-habit forming pure plant wellness.",
      color: "from-emerald-500/10 to-green-500/5",
      border: "border-emerald-200/80",
    },
    {
      icon: <ClassicalScienceIcon />,
      badge: isHi ? "वैद्य व विशेषज्ञों द्वारा विकसित" : "Vaidya & Doctor Formulated",
      title: isHi ? "शास्त्रीय ज्ञान व आधुनिक विज्ञान" : "Classical Samhita Science",
      desc: isHi
        ? "चरक व सुश्रुत संहिता के प्राचीन सूत्रों को आधुनिक फाइटोथेरेपी रिसर्च के साथ तालमेल बिठाकर तैयार किया गया।"
        : "Engineered by senior Ayurvedic Vaidyas adhering to classical texts enhanced with modern clinical research.",
      color: "from-teal-500/10 to-emerald-500/5",
      border: "border-teal-200/80",
    },
    {
      icon: <DoshaBalanceIcon />,
      badge: isHi ? "जड़ से संपूर्ण समाधान" : "Root-Cause Healing",
      title: isHi ? "त्रिदोष संतुलन व स्थायी परिणाम" : "Lasting Dosha Balance",
      desc: isHi
        ? "केवल लक्षणों को दबाने के बजाय समस्या के मूल कारण पर काम करता है ताकि आपको दीर्घकालिक स्वास्थ्य लाभ मिले।"
        : "Targets internal imbalances and metabolic pathways to deliver sustained wellness rather than temporary relief.",
      color: "from-emerald-500/10 to-lime-500/5",
      border: "border-emerald-200/80",
    },
    {
      icon: <FreeDeliveryCodIcon />,
      badge: isHi ? "1,00,000+ संतुष्ट परिवार" : "100,000+ Happy Buyers",
      title: isHi ? "अखिल भारतीय COD व निःशुल्क डिलीवरी" : "Pan-India Free Delivery & COD",
      desc: isHi
        ? "संपूर्ण भारत में 2-4 दिनों में सुरक्षित डिलीवरी, कैश ऑन डिलीवरी (COD) और समर्पित आयुर्वेदिक परामर्श सहायता।"
        : "Fast 2-4 day door-step shipping, transparent Cash on Delivery, and direct 1-on-1 customer care support.",
      color: "from-amber-500/10 to-teal-500/5",
      border: "border-amber-200/80",
    },
  ];

  const comparisonRows = [
    {
      feature: isHi ? "सक्रिय वनस्पति सत्व (Standardized Extracts)" : "Standardized Active Extracts",
      tulsi: isHi ? "100% मानकीकृत शुद्ध एक्सट्रैक्ट्स" : "100% Pure Standardized Extracts",
      others: isHi ? "साधारण कच्चा चूर्ण या कम गुणवत्ता" : "Raw unrefined powders with low potency",
    },
    {
      feature: isHi ? "सुरक्षा व लैब परीक्षण" : "Third-Party Lab Testing",
      tulsi: isHi ? "24+ मापदंडों पर त्रि-स्तरीय परीक्षण" : "Triple-tested for Heavy Metals & Purity",
      others: isHi ? "अस्पष्ट या सीमित परीक्षण" : "Unverified or minimal quality testing",
    },
    {
      feature: isHi ? "रसायन व स्टेरॉयड मुक्त" : "Steroid & Chemical-Free",
      tulsi: isHi ? "0% स्टेरॉयड, 100% सुरक्षित प्राकृतिक फॉर्मूलेशन" : "100% Natural, Zero Hidden Chemicals",
      others: isHi ? "संभावित हानिकारक एडिटिव्स व प्रिजर्वेटिव" : "Often contains synthetic binders & additives",
    },
    {
      feature: isHi ? "निर्माण गुणवत्ता मानक" : "Manufacturing Standards",
      tulsi: isHi ? "आयुष व GMP प्रमाणित स्वच्छ इकाइयां" : "GMP & AYUSH Certified Clean Facilities",
      others: isHi ? "अमानकीकृत स्थानीय पैकेजिंग" : "White-labeled contract production",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#fbfdfc] via-[#f4f9f6] to-[#fbfdfc] border-t border-b border-emerald-950/5 relative overflow-hidden">
      
      {/* Background Subtle Ayurvedic Leaf Motif */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#10b981_0.75px,transparent_0.75px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-16">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Leaf className="size-3.5 text-emerald-700" />
            <span>{isHi ? "तुलसीवेदा का संकल्प" : "The TulsiVeda Promise"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            {isHi ? (
              <>
                आप <span className="text-emerald-800 underline decoration-emerald-500/40 underline-offset-8">तुलसीवेदा</span> को ही क्यों चुनें?
              </>
            ) : (
              <>
                Why Should You Choose <span className="text-emerald-800 underline decoration-emerald-500/40 underline-offset-8">TulsiVeda</span>?
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-stone-600 font-medium leading-relaxed">
            {isHi 
              ? "प्राचीन आयुर्वेदिक संहिताओं का ज्ञान, आधुनिक लैब परीक्षण और 100% शुद्ध वनस्पति सत्व—बिना किसी रसायन या समझौते के।"
              : "Pure botanical potency, authentic classical formulations, and strict modern scientific testing—crafted for real, lasting results."}
          </p>
        </div>

        {/* 6 Core Value Pillar Cards with 3D Custom Vector Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border ${pillar.border} shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden group`}
            >
              {/* Soft Gradient Corner Glow */}
              <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${pillar.color} rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110`} />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-1 rounded-2xl transition-transform duration-300 group-hover:scale-110">
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {pillar.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Section (TulsiVeda vs Ordinary Brands) */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden p-6 sm:p-8 md:p-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {isHi ? "तुलना तालिका" : "Quality Standard Comparison"}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 pt-2">
              {isHi ? "तुलसीवेदा बनाम साधारण ब्रांड्स" : "TulsiVeda vs Ordinary Market Alternatives"}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="py-4 px-4 sm:px-6 font-bold text-stone-500 uppercase text-xs">
                    {isHi ? "विशेषता" : "Quality Factor"}
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-black text-emerald-800 bg-emerald-50/80 rounded-t-xl text-xs sm:text-sm">
                    🌿 TulsiVeda Standard
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-semibold text-stone-500 text-xs sm:text-sm">
                    {isHi ? "अन्य साधारण उत्पाद" : "Ordinary Alternatives"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-bold text-stone-900">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-emerald-900 bg-emerald-50/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4.5 text-emerald-700 shrink-0" />
                        <span>{row.tulsi}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-stone-500">
                      <div className="flex items-center gap-2">
                        <XCircle className="size-4.5 text-rose-400 shrink-0" />
                        <span>{row.others}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Footer Banner */}
        <div className="text-center pt-2">
          <Link 
            href="/shop"
            className="inline-flex items-center gap-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <span>{isHi ? "100% शुद्ध आयुर्वेदिक उत्पाद देखें" : "Explore Authentic Formulations"}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
