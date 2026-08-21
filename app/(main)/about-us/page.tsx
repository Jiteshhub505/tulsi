"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Leaf, 
  Shield, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Stethoscope, 
  Check, 
  PhoneCall,
  FlaskConical,
  Sprout,
  HeartHandshake
} from "lucide-react";
import { useLanguage } from "@/context/language-context";

// Sourcing regions data
const sourcingRegions = [
  {
    id: "himalayas",
    region: "High Himalayas (18,000+ ft)",
    regionHi: "उच्च हिमालय (18,000+ फीट)",
    altitude: "18,000 ft Altitude",
    herb: "Grade-A Purified Shilajit Resin (60% Fulvic Acid)",
    herbHi: "ग्रेड-ए शुद्ध शिलाजीत राल (60% फुल्विक एसिड)",
    desc: "Naturally exuded from pristine Himalayan rock fissures during summer heat, packed with 84+ ionic trace minerals for deep cellular energy and stamina.",
    image: "/benefits/benefit_stamina.jpg",
    badge: "100% Wild Sourced"
  },
  {
    id: "rajasthan",
    region: "Rajasthan & Malwa Plains",
    regionHi: "राजस्थान और मालवा का मैदान",
    altitude: "Arid Botanical Soil",
    herb: "Organic Ashwagandha KSM-66 & Safed Musli",
    herbHi: "जैविक अश्वगंधा KSM-66 और सफेद मूसली",
    desc: "Cultivated in mineral-rich arid soils that naturally stimulate high concentrations of active withanolides and saponins for maximum stamina and vitality.",
    image: "/benefits/ved_male_power.jpg",
    badge: "Grade-A Potency"
  },
  {
    id: "kerala",
    region: "Kerala & Western Ghats",
    regionHi: "केरल और पश्चिमी घाट",
    altitude: "Rainforest Biodiverse Zone",
    herb: "Nirgundi, Rasna & Surjan Siri",
    herbHi: "निर्गुंडी, रास्ना और सुरंजान शीरीं",
    desc: "Harvested from dense tropical forest zones with high bioactive transdermal properties, specifically extracted for joint lubrication, warmth, and cartilage comfort.",
    image: "/benefits/pain_warmth.jpg",
    badge: "Forest Wildcrafted"
  },
  {
    id: "ganga",
    region: "Sacred Ganges Foothills",
    regionHi: "पवित्र गंगा की तराई",
    altitude: "Pristine Riverine Basin",
    herb: "Rama & Krishna Holy Tulsi (Ocimum Sanctum)",
    herbHi: "रामा और कृष्णा पवित्र तुलसी (ऑसीमम सैंक्टम)",
    desc: "Fresh, unadulterated holy basil leaves hand-plucked at dawn to preserve essential volatile oils like Eugenol for immune defense and respiratory vigor.",
    image: "/benefits/how_to_use_universal.jpg",
    badge: "Pure Botanical Source"
  }
];

// Interactive Health Guide options
const healthGoals = [
  { 
    label: "Boost Stamina, Power & Male Vigor", 
    labelHi: "शारीरिक शक्ति, स्टैमिना और पुरुष वाइटलिटी",
    rec: "Veda Shakti / Pure Shilajit Resin", 
    link: "/shop" 
  },
  { 
    label: "Relieve Knee, Back & Joint Pain", 
    labelHi: "घुटनों, पीठ और जोड़ों के दर्द में आराम",
    rec: "Ayur Shakti Pain Relief Oil", 
    link: "/shop" 
  },
  { 
    label: "Detox Liver & Dissolve Renal Stones", 
    labelHi: "लिवर डिटॉक्स और किडनी स्टोन में राहत",
    rec: "Power Kidney Powder / Iron Liver", 
    link: "/shop" 
  },
  { 
    label: "Relieve Acidity, Gas & Constipation", 
    labelHi: "एसिडिटी, गैस और पेट की भारीपन से राहत",
    rec: "Digestion Care / Piles Care", 
    link: "/shop" 
  },
];

export default function AboutUsPage() {
  const { language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState(sourcingRegions[0]);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Tulsi Veda ensure 100% Ayurvedic purity?",
      qHi: "तुलसीवेद 100% शुद्धता कैसे सुनिश्चित करता है?",
      a: "Every batch of Tulsi Veda formulations undergoes strict heavy-metal screening (Lead, Cadmium, Mercury, Arsenic) in NABL-accredited laboratories. We strictly use 100% plant-based botanicals, classical Shodhana purifications, and standardized active percentages with zero chemical steroids or adulterants.",
      aHi: "तुलसीवेद के प्रत्येक बैच का NABL-प्रमाणित प्रयोगशालाओं में हेवी-मेटल टेस्ट किया जाता है। हम केवल 100% प्राकृतिक जड़ी-बूटियों और शास्त्रीय शोधन प्रक्रिया का उपयोग करते हैं।"
    },
    {
      q: "Are Tulsi Veda formulations approved by AYUSH?",
      qHi: "क्या तुलसीवेद उत्पाद आयुष मंत्रालय द्वारा स्वीकृत हैं?",
      a: "Yes! All our proprietary and classical Ayurvedic products are licensed and manufactured under strict AYUSH Ministry guidelines in GMP-certified facilities adhering to classical Ayurvedic Pharmacopoeia protocols.",
      aHi: "जी हाँ! हमारे सभी उत्पाद आयुष मंत्रालय के दिशा-निर्देशों और GMP प्रमाणित निर्माण इकाइयों में तैयार किए जाते हैं।"
    },
    {
      q: "Can I consult an Ayurvedic doctor (Vaidya) for free?",
      qHi: "क्या मैं निःशुल्क आयुर्वेदिक डॉक्टर परामर्श प्राप्त कर सकता हूँ?",
      a: "Absolutely! We provide direct one-on-one consultations with certified Ayurvedic doctors (BAMS Vaidyas) via WhatsApp or phone to understand your body constitution and provide tailored dosage advice.",
      aHi: "बिल्कुल! आप व्हाट्सएप या फोन के माध्यम से हमारे अनुभवी BAMS आयुर्वेदिक डॉक्टरों से निःशुल्क परामर्श ले सकते हैं।"
    },
    {
      q: "How long should I take Ayurvedic remedies for lasting results?",
      qHi: "स्थायी परिणामों के लिए मुझे कब तक सेवन करना चाहिए?",
      a: "Ayurveda addresses the root cause rather than just masking symptoms. Most users experience noticeable improvements in energy, digestion, and pain within 7 to 14 days, while deep tissue nourishment (Dhatu Poshan) achieves optimal stability in 60 to 90 days.",
      aHi: "आयुर्वेद जड़ से उपचार करता है। अधिकांश ग्राहकों को 7 से 14 दिनों में राहत का अनुभव होता है, जबकि दीर्घकालिक लाभ के लिए 60 से 90 दिनों का नियमित सेवन अनुशंसित है।"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 pb-20">
      
      {/* ---------------- 1. MINIMALIST CLEAN HERO ---------------- */}
      <section className="relative py-16 sm:py-24 2xl:py-32 px-4 sm:px-6 lg:px-8 2xl:px-12 border-b border-stone-200/80 bg-stone-50/50">
        <div className="max-w-4xl 2xl:max-w-6xl mx-auto text-center space-y-6 2xl:space-y-8">
          
          <div className="inline-flex items-center gap-2 bg-white border border-stone-200 text-stone-800 text-xs 2xl:text-sm font-semibold px-4 2xl:px-5 py-1.5 2xl:py-2 rounded-full shadow-2xs">
            <Leaf size={14} className="text-emerald-700 2xl:w-4 2xl:h-4" />
            <span className="tracking-wide uppercase">
              {language === "hi" ? "प्रामाणिक आयुष-प्रमाणित आयुर्वेद" : "AYUSH-Certified Classical Ayurveda"}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-black text-stone-950 tracking-tight leading-tight">
            {language === "hi" ? (
              <>प्राचीन वैदिक ज्ञान, <span className="text-emerald-800">आधुनिक जीवन के लिए।</span></>
            ) : (
              <>Ancient Ayurvedic Wisdom, <span className="text-emerald-800">Engineered for Modern Life.</span></>
            )}
          </h1>
          
          <p className="text-base sm:text-lg 2xl:text-2xl text-stone-600 max-w-2xl 2xl:max-w-4xl mx-auto leading-relaxed font-normal">
            {language === "hi" 
              ? "तुलसीवेद में हम 5,000 वर्षों के शास्त्रीय ग्रंथों के ज्ञान को आधुनिक वैज्ञानिक परीक्षणों के साथ लाते हैं। 100% शुद्ध जड़ी-बूटियाँ, शून्य मिलावट और प्रमाणित प्रभाव।"
              : "At Tulsi Veda, we bridge 5,000 years of classical Ayurvedic heritage with modern standardized botanical science. Zero synthetic chemicals, 100% pure Grade-A botanical extracts."}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 2xl:gap-5 justify-center items-center pt-2">
            <Link href="/shop" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-stone-900 hover:bg-black text-white font-bold px-8 2xl:px-10 py-3.5 2xl:py-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base 2xl:text-lg">
                <span>{language === "hi" ? "सभी उत्पाद देखें" : "Explore Formulations"}</span>
                <ArrowRight size={16} className="2xl:w-5 2xl:h-5" />
              </button>
            </Link>
            <a 
              href="https://wa.me/918178128367?text=Hello%20Tulsi%20Veda%2C%20I%20want%20to%20consult%20an%20Ayurvedic%20doctor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 font-bold px-8 2xl:px-10 py-3.5 2xl:py-4 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base 2xl:text-lg">
                <MessageCircle size={16} className="text-emerald-700 2xl:w-5 2xl:h-5" />
                <span>{language === "hi" ? "मुफ्त डॉक्टर परामर्श" : "Free Vaidya Consultation"}</span>
              </button>
            </a>
          </div>

          {/* Clean Stats Row */}
          <div className="pt-10 2xl:pt-14 grid grid-cols-2 md:grid-cols-4 gap-4 2xl:gap-8 max-w-3xl 2xl:max-w-5xl mx-auto text-center border-t border-stone-200">
            <div className="p-3 2xl:p-4">
              <div className="text-2xl sm:text-3xl 2xl:text-5xl font-black text-stone-950">5,000+</div>
              <div className="text-xs 2xl:text-sm text-stone-500 font-medium mt-1">{language === "hi" ? "वर्षों की परंपरा" : "Years Vedic Heritage"}</div>
            </div>
            <div className="p-3 2xl:p-4">
              <div className="text-2xl sm:text-3xl 2xl:text-5xl font-black text-stone-950">2.5 Lakh+</div>
              <div className="text-xs 2xl:text-sm text-stone-500 font-medium mt-1">{language === "hi" ? "संतुष्ट ग्राहक" : "Happy Families"}</div>
            </div>
            <div className="p-3 2xl:p-4">
              <div className="text-2xl sm:text-3xl 2xl:text-5xl font-black text-emerald-800">100%</div>
              <div className="text-xs 2xl:text-sm text-stone-500 font-medium mt-1">{language === "hi" ? "लैब टेस्टेड शुद्धता" : "Heavy Metal Tested"}</div>
            </div>
            <div className="p-3 2xl:p-4">
              <div className="text-2xl sm:text-3xl 2xl:text-5xl font-black text-stone-950">AYUSH</div>
              <div className="text-xs 2xl:text-sm text-stone-500 font-medium mt-1">{language === "hi" ? "मंत्रालय स्वीकृत" : "Govt. Approved GMP"}</div>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 2. OUR STORY & FOUNDING MANIFESTO ---------------- */}
      <section className="py-16 sm:py-24 2xl:py-32 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-6xl 2xl:max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 2xl:gap-20 items-center">
          
          {/* Left Column: Story Text */}
          <div className="lg:col-span-7 space-y-6 2xl:space-y-8">
            <span className="text-xs 2xl:text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 2xl:px-4 py-1 rounded-full">
              {language === "hi" ? "हमारा संकल्प" : "OUR PHILOSOPHY"}
            </span>

            <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-black text-stone-950 tracking-tight leading-snug">
              {language === "hi" 
                ? "प्राकृतिक स्वास्थ्य को पुनः शुद्ध और पारदर्शी बनाने का मिशन" 
                : "Restoring the Integrity of Traditional Vedic Healthcare"}
            </h2>

            <div className="space-y-4 2xl:space-y-6 text-stone-600 text-sm sm:text-base 2xl:text-xl leading-relaxed">
              <p>
                {language === "hi"
                  ? "तुलसीवेद की स्थापना एक स्पष्ट उद्देश्य के साथ हुई: आज बाजार में जहां मिलावटी और कम गुणवत्ता वाले सप्लीमेंट्स की भरमार है, वहां हर भारतीय परिवार को असली, शास्त्रीय और 100% शुद्ध आयुर्वेदिक उपचार उपलब्ध कराना।"
                  : "Tulsi Veda was founded with a single uncompromising mission: to eliminate low-grade, diluted, and chemical-laden supplements from the market, delivering the authentic potency of classical Ayurvedic healing to every household."}
              </p>
              <p>
                {language === "hi"
                  ? "हम हिमालय की 18,000 फीट की ऊंचाइयों से शुद्ध शिलाजीत, मालवा के जंगलों से सफेद मूसली और पश्चिमी घाट से दुर्लभ वनौषधियां एकत्र करते हैं। प्रत्येक घटक को पारंपरिक 'शोधन' और आधुनिक लैब टेस्टिंग के बाद ही उपयोग किया जाता है।"
                  : "We wildcraft Grade-A Shilajit from 18,000+ ft Himalayan altitudes, organic Ashwagandha and Safed Musli from mineral-rich arid plains, and bio-active herbs from the Western Ghats. Each ingredient undergoes classical Ayurvedic purification followed by multi-element laboratory verification."}
              </p>
            </div>

            {/* 3 Clean Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 2xl:gap-6 pt-2">
              <div className="bg-stone-50 border border-stone-200/80 p-4 2xl:p-6 rounded-2xl">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-white border border-stone-200 text-emerald-800 flex items-center justify-center mb-2 shadow-2xs">
                  <Shield size={16} className="2xl:w-5 2xl:h-5" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "शून्य रसायन" : "Zero Chemicals"}</h4>
                <p className="text-xs 2xl:text-sm text-stone-500 mt-1">{language === "hi" ? "कोई स्टेरॉयड या प्रिजर्वेटिव नहीं" : "No steroids, binders or additives"}</p>
              </div>

              <div className="bg-stone-50 border border-stone-200/80 p-4 2xl:p-6 rounded-2xl">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-white border border-stone-200 text-emerald-800 flex items-center justify-center mb-2 shadow-2xs">
                  <FlaskConical size={16} className="2xl:w-5 2xl:h-5" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "मानकीकृत सत्व" : "Standardized Actives"}</h4>
                <p className="text-xs 2xl:text-sm text-stone-500 mt-1">{language === "hi" ? "60% फुल्विक एसिड व शुद्धता" : "60% Fulvic Acid & bio-markers"}</p>
              </div>

              <div className="bg-stone-50 border border-stone-200/80 p-4 2xl:p-6 rounded-2xl">
                <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-white border border-stone-200 text-emerald-800 flex items-center justify-center mb-2 shadow-2xs">
                  <Stethoscope size={16} className="2xl:w-5 2xl:h-5" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "वैद्य निर्देशित" : "Doctor Formulated"}</h4>
                <p className="text-xs 2xl:text-sm text-stone-500 mt-1">{language === "hi" ? "अनुभवी BAMS डॉक्टरों द्वारा तैयार" : "Crafted by classical physicians"}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Photo */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 sm:aspect-square 2xl:aspect-4/3 rounded-3xl overflow-hidden shadow-md border border-stone-200 bg-stone-100">
              <Image
                src="/benefits/how_to_use_universal.jpg"
                alt="Tulsi Veda Herbal Regimen"
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 40vw, 600px"
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 3. BOTANICAL SOURCING LOCATIONS ---------------- */}
      <section className="py-16 sm:py-24 2xl:py-32 px-4 sm:px-6 lg:px-8 2xl:px-12 bg-stone-50/70 border-y border-stone-200/80">
        <div className="max-w-6xl 2xl:max-w-screen-2xl mx-auto space-y-12 2xl:space-y-16">
          
          <div className="text-center max-w-2xl 2xl:max-w-3xl mx-auto space-y-2">
            <span className="text-xs 2xl:text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full">
              {language === "hi" ? "कच्चे माल के स्रोत" : "BOTANICAL ORIGINS"}
            </span>
            <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-black text-stone-950 tracking-tight">
              {language === "hi" ? "भारत के प्राकृतिक क्षेत्रों से प्रामाणिक स्रोत" : "Sourced Directly from Native Geographies"}
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-lg text-stone-600 font-medium">
              {language === "hi" ? "प्रत्येक जड़ी-बूटी को उसके प्राकृतिक जलवायु क्षेत्र से ही संचित किया जाता है।" : "Every botanical is harvested from its indigenous bio-diverse terrain for peak therapeutic potency."}
            </p>
          </div>

          {/* Clean Region Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 2xl:gap-5">
            {sourcingRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className={`p-4 2xl:p-6 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedRegion.id === region.id
                    ? "bg-white border-stone-900 shadow-sm"
                    : "bg-white/60 border-stone-200 hover:border-stone-400"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs 2xl:text-sm text-emerald-800 font-bold mb-1">
                  <MapPin size={13} className="2xl:w-4 2xl:h-4" />
                  <span className="truncate">{region.altitude}</span>
                </div>
                <div className="font-extrabold text-sm sm:text-base 2xl:text-lg text-stone-900 leading-tight">
                  {language === "hi" ? region.regionHi : region.region}
                </div>
              </button>
            ))}
          </div>

          {/* Region Display Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 2xl:p-14 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 2xl:gap-14 items-center">
            <div className="lg:col-span-7 space-y-4 2xl:space-y-6">
              <span className="text-xs 2xl:text-sm font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
                {selectedRegion.badge}
              </span>
              <h3 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-stone-900">
                {language === "hi" ? selectedRegion.herbHi : selectedRegion.herb}
              </h3>
              <p className="text-sm sm:text-base 2xl:text-xl text-stone-600 leading-relaxed font-normal">
                {selectedRegion.desc}
              </p>
              
              <div className="pt-2 flex items-center gap-5 2xl:gap-8 text-xs sm:text-sm 2xl:text-base font-semibold text-stone-800">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="2xl:w-5 2xl:h-5" /> {language === "hi" ? "शुद्धता प्रमाणित" : "Purity Certified"}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="2xl:w-5 2xl:h-5" /> {language === "hi" ? "सतत संचयन" : "Sustainable Wildcrafting"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden shadow-xs bg-stone-100 2xl:h-80">
              <Image
                src={selectedRegion.image}
                alt={selectedRegion.region}
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 40vw, 550px"
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 4. INTERACTIVE HEALTH GUIDE ---------------- */}
      <section className="py-16 sm:py-24 2xl:py-32 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-5xl 2xl:max-w-6xl mx-auto">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-12 2xl:p-16 shadow-sm space-y-8 2xl:space-y-10">
          
          <div className="text-center max-w-xl 2xl:max-w-2xl mx-auto space-y-2">
            <span className="text-xs 2xl:text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              {language === "hi" ? "स्वास्थ्य गाइड" : "INTERACTIVE HEALTH GUIDE"}
            </span>
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-stone-950">
              {language === "hi" ? "अपनी आवश्यकता अनुसार सही उपचार चुनें" : "Find Your Personalized Formulation"}
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-stone-600">
              {language === "hi" ? "अपनी मुख्य समस्या चुनें और सटीक आयुर्वेदिक समाधान प्राप्त करें।" : "Select your primary health goal to view tailored Ayurvedic guidance."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 2xl:gap-4 max-w-3xl 2xl:max-w-4xl mx-auto">
            {healthGoals.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGoal(opt)}
                className={`p-4 2xl:p-6 rounded-2xl border transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                  selectedGoal?.label === opt.label
                    ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                    : "bg-stone-50/70 hover:bg-stone-100 text-stone-800 border-stone-200"
                }`}
              >
                <span className="text-xs sm:text-sm 2xl:text-base font-bold">
                  {language === "hi" ? opt.labelHi : opt.label}
                </span>
                {selectedGoal?.label === opt.label && <Check size={16} className="shrink-0 2xl:w-5 2xl:h-5" />}
              </button>
            ))}
          </div>

          {selectedGoal && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 2xl:p-8 text-center max-w-xl 2xl:max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs 2xl:text-sm font-bold uppercase text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                <Sparkles size={13} /> {language === "hi" ? "अनुशंसित फॉर्मूलेशन" : "Recommended Formulation"}
              </div>
              <h4 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-stone-950">
                {selectedGoal.rec}
              </h4>
              <p className="text-xs sm:text-sm 2xl:text-base text-stone-600">
                {language === "hi"
                  ? "यह शास्त्रीय योग शरीर के दोषों को संतुलित कर प्राकृतिक रूप से स्वास्थ्य व ऊर्जा प्रदान करता है।"
                  : "Targeted botanical formulation designed for optimal bioavailability and deep restorative relief."}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={selectedGoal.link || "/shop"}>
                  <button className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 2xl:px-8 py-2.5 2xl:py-3.5 rounded-xl text-xs sm:text-sm 2xl:text-base transition-all shadow-xs cursor-pointer">
                    {language === "hi" ? "दुकान में देखें" : "View in Shop"}
                  </button>
                </Link>
                <a 
                  href={`https://wa.me/918178128367?text=Hello%20Tulsi%20Veda%2C%20I%20need%20help%20with%20${encodeURIComponent(selectedGoal.label)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold px-6 2xl:px-8 py-2.5 2xl:py-3.5 rounded-xl text-xs sm:text-sm 2xl:text-base transition-all cursor-pointer">
                    {language === "hi" ? "डॉक्टर से बात करें" : "Consult Vaidya"}
                  </button>
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ---------------- 5. 5-STEP STANDARDIZATION PROCESS ---------------- */}
      <section className="py-16 sm:py-24 2xl:py-32 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-6xl 2xl:max-w-screen-2xl mx-auto space-y-12 2xl:space-y-16">
        <div className="text-center max-w-2xl 2xl:max-w-3xl mx-auto space-y-2">
          <span className="text-xs 2xl:text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {language === "hi" ? "गुणवत्ता मानक" : "QUALITY STANDARDS"}
          </span>
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-black text-stone-950 tracking-tight">
            {language === "hi" ? "खेत से लेकर बोतल तक 5-चरणीय शुद्धता" : "Our 5-Step Standardization Process"}
          </h2>
          <p className="text-xs sm:text-sm 2xl:text-lg text-stone-600 font-medium">
            {language === "hi" ? "प्रत्येक बैच का वैज्ञानिक परीक्षण कर उच्च सुरक्षा सुनिश्चित की जाती है।" : "How we ensure every single batch delivers consistent therapeutic efficacy."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 2xl:gap-6">
          <div className="bg-white border border-stone-200 p-5 2xl:p-6 rounded-2xl space-y-2.5 2xl:space-y-3.5 shadow-2xs">
            <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-stone-900 text-white font-bold text-xs 2xl:text-sm flex items-center justify-center">1</div>
            <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "ऋतु अनुसार संचयन" : "Wild Harvesting"}</h4>
            <p className="text-xs 2xl:text-sm text-stone-500 leading-relaxed">{language === "hi" ? "पौधों में अधिकतम सक्रिय तत्वों के समय पारंपरिक संचयन।" : "Herbs wildcrafted at seasonal bio-potency peaks."}</p>
          </div>

          <div className="bg-white border border-stone-200 p-5 2xl:p-6 rounded-2xl space-y-2.5 2xl:space-y-3.5 shadow-2xs">
            <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-stone-900 text-white font-bold text-xs 2xl:text-sm flex items-center justify-center">2</div>
            <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "शास्त्रीय शोधन" : "Vedic Shodhana"}</h4>
            <p className="text-xs 2xl:text-sm text-stone-500 leading-relaxed">{language === "hi" ? "पारंपरिक विधियों से विषहरण एवं शुद्धिकरण।" : "Multi-stage classical purification protocols."}</p>
          </div>

          <div className="bg-white border border-stone-200 p-5 2xl:p-6 rounded-2xl space-y-2.5 2xl:space-y-3.5 shadow-2xs">
            <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-stone-900 text-white font-bold text-xs 2xl:text-sm flex items-center justify-center">3</div>
            <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "कोल्ड एक्सट्रैक्शन" : "Cold Extraction"}</h4>
            <p className="text-xs 2xl:text-sm text-stone-500 leading-relaxed">{language === "hi" ? "बिना ताप के सक्रिय पोषक तत्वों का संरक्षण।" : "Low-temperature processing preserving actives."}</p>
          </div>

          <div className="bg-white border border-stone-200 p-5 2xl:p-6 rounded-2xl space-y-2.5 2xl:space-y-3.5 shadow-2xs">
            <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-stone-900 text-white font-bold text-xs 2xl:text-sm flex items-center justify-center">4</div>
            <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "लैब टेस्टिंग" : "Lab Testing"}</h4>
            <p className="text-xs 2xl:text-sm text-stone-500 leading-relaxed">{language === "hi" ? "लेड, मरकरी व हेवी मेटल की गहन जांच।" : "Triple tested for heavy metals and purity."}</p>
          </div>

          <div className="bg-white border border-stone-200 p-5 2xl:p-6 rounded-2xl space-y-2.5 2xl:space-y-3.5 shadow-2xs">
            <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-stone-900 text-white font-bold text-xs 2xl:text-sm flex items-center justify-center">5</div>
            <h4 className="font-bold text-stone-900 text-sm 2xl:text-base">{language === "hi" ? "सुरक्षित पैकेजिंग" : "Clean Packaging"}</h4>
            <p className="text-xs 2xl:text-sm text-stone-500 leading-relaxed">{language === "hi" ? "प्राकृतिक शुद्धता का दीर्घकालिक संरक्षण।" : "Sealed in protective containers for fresh shelf life."}</p>
          </div>
        </div>
      </section>

      {/* ---------------- 6. FREQUENTLY ASKED QUESTIONS ---------------- */}
      <section className="py-16 sm:py-24 2xl:py-32 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-4xl 2xl:max-w-5xl mx-auto space-y-8 2xl:space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs 2xl:text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {language === "hi" ? "सामान्य प्रश्न" : "FAQS"}
          </span>
          <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-stone-950">
            {language === "hi" ? "तुलसीवेद के बारे में अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="space-y-3 2xl:space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 2xl:p-6 text-left font-bold text-stone-900 text-sm sm:text-base 2xl:text-lg flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{language === "hi" ? faq.qHi : faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} className="text-stone-900 shrink-0 2xl:w-6 2xl:h-6" /> : <ChevronDown size={18} className="text-stone-400 shrink-0 2xl:w-6 2xl:h-6" />}
              </button>
              {openFaq === idx && (
                <div className="px-5 2xl:px-6 pb-5 2xl:pb-6 text-xs sm:text-sm 2xl:text-base text-stone-600 leading-relaxed border-t border-stone-100 pt-3 2xl:pt-4">
                  {language === "hi" ? faq.aHi : faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 7. CLEAN PROFESSIONAL BOTTOM CTA ---------------- */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl 2xl:max-w-5xl mx-auto text-center">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 2xl:p-16 shadow-md space-y-6 2xl:space-y-8">
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-black tracking-tight text-white">
            {language === "hi" ? "प्राकृतिक स्वास्थ्य की ओर पहला कदम बढ़ाएं" : "Start Your Ayurvedic Wellness Journey"}
          </h2>
          <p className="text-xs sm:text-base 2xl:text-xl text-stone-300 max-w-2xl 2xl:max-w-3xl mx-auto">
            {language === "hi"
              ? "2,50,000+ से अधिक भारतीय परिवार तुलसीवेद के शुद्ध शास्त्रीय उत्पादों पर विश्वास करते हैं।"
              : "Over 250,000+ happy customers trust Tulsi Veda for authentic, 100% natural healing."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 2xl:gap-5 justify-center items-center pt-2">
            <Link href="/shop" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-stone-950 hover:bg-stone-100 font-bold px-8 2xl:px-10 py-3.5 2xl:py-4 rounded-xl transition-all shadow-sm cursor-pointer text-sm sm:text-base 2xl:text-lg">
                {language === "hi" ? "सभी उत्पाद देखें" : "Explore Formulations"}
              </button>
            </Link>
            <a 
              href="https://wa.me/918178128367?text=Hello%20Tulsi%20Veda%20Team" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold px-8 2xl:px-10 py-3.5 2xl:py-4 rounded-xl transition-all cursor-pointer text-sm sm:text-base 2xl:text-lg flex items-center justify-center gap-2">
                <PhoneCall size={16} className="text-emerald-400 2xl:w-5 2xl:h-5" />
                <span>+91 81781 28367</span>
              </button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
