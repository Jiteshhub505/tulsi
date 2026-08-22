"use client";

import Image from "next/image";
import Link from "next/link";
import he from "he";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getproductdetails from "./actions/getproductdetals";
import { getOptimizedImageUrl } from "@/lib/image-utils";
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
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Clock,
  ThumbsUp,
  Leaf,
  ShieldCheck,
  HeartPulse,
  CheckCircle2,
  Banknote,
  Lock,
  Play,
  Copy,
  Tag,
  Flame,
  CheckCircle,
  BadgeCheck,
  RotateCcw,
  Users,
  MessageSquare,
  Share2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useLanguage } from "@/context/language-context";
import SingleProductSkeleton from "./SingleProductSkeleton";

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
  benefits?: { title: string; desc: string; icon?: string; image?: string }[];
  clinicalStats?: { percentage: number; label: string }[];
  keyIngredients?: { name: string; desc: string; image?: string }[];
  fullComposition?: { name: string; botanical: string; amount: string }[];
  howToUseSteps?: { step: number; title: string; desc: string }[];
  faqs?: { question: string; answer: string }[];
  packOptions?: { packName: string; price: number; discountPrice?: number; isPopular?: boolean }[];
  suitableFor?: string;
};

// ---------------- DYNAMIC CATEGORY-SPECIFIC RICH CONTENT GENERATOR ----------------
function getCategoryRichContent(categoryName: string, productName: string) {
  const cat = (categoryName || "").toLowerCase();
  const prod = (productName || "").toLowerCase();

  // 1. PURE HIMALAYAN SHILAJIT RESIN SPECIALIZED CONTENT
  if (prod.includes("shilajit") || prod.includes("shilajeet")) {
    return {
      benefitHeadline: "Pure Himalayan Shilajit Vitality & Power",
      benefitHeadlineHi: "शुद्ध हिमालयन शिलाजीत वाइटलिटी एवं शारीरिक शक्ति",
      benefitSubtitle: "Standardized to 60% Fulvic Acid and 84+ essential trace minerals for sustained stamina and recovery.",
      benefitSubtitleHi: "60% फुल्विक एसिड और 84+ प्राकृतिक खनिजों से युक्त शुद्ध हिमालयन राल।",
      suitableFor: "Men and Women (18+) looking to naturally elevate daily physical stamina, power, cellular energy, and cortisol stress relief.",
      suitableForHi: "शारीरिक कमजोरी, थकान, कम स्टैमिना और तनाव को दूर कर प्राकृतिक ऊर्जा व ताकत चाहने वाले पुरुषों एवं महिलाओं के लिए।",
      bullets: [
        "Standardized to 60% Fulvic Acid & 84+ Bio-Minerals",
        "Boosts Physical Stamina, Daily Energy & Cellular ATP",
        "Promotes Muscle Recovery, Vitality & Cortisol Relief",
        "100% Pure Himalayan Resin • AYUSH & Lab Certified",
      ],
      bulletsHi: [
        "60% फुल्विक एसिड और 84+ आयनिक बायो-मिनरल्स से भरपूर",
        "शारीरिक स्टैमिना, ऊर्जा और सेलुलर एटीपी में तीव्र वृद्धि",
        "मांसपेशियों की रिकवरी और मानसिक तनाव में राहत",
        "100% शुद्ध हिमालयन रेजिन • आयुष व लैब प्रमाणित",
      ],
      fullComposition: [
        { name: "Pure Shilajit (Asphaltum)", botanical: "60% Fulvic Acid Purified Himalayan Resin", amount: "100% Pure Resin" },
      ],
      visualBenefits: [
        { title: "Boost Immunity", titleHi: "प्रतिरोधक क्षमता वृद्धि", desc: "Contains >60% Fulvic Acid and 80+ minerals to strengthen natural daily immunity.", descHi: ">60% फुल्विक एसिड व 84+ मिनरल्स से रोग प्रतिरोधक क्षमता मजबूत होती है।", image: "/benefits/benefit_stamina.jpg" },
        { title: "Improves Energy Levels", titleHi: "ऊर्जा स्तर में सुधार", desc: "High fulvic acid content fights low energy, fatigue, and daytime tiredness.", descHi: "दिनभर की सुस्ती, कमजोरी और थकान को दूर कर सक्रिय ऊर्जा बनाए रखता है।", image: "/benefits/benefit_stress.jpg" },
        { title: "Increases Stamina", titleHi: "स्टैमिना और शक्ति", desc: "Helps improve cellular oxygen flow to keep you active without feeling drained.", descHi: "मांसपेशियों में ऑक्सीजन प्रवाह बढ़ाकर लंबे समय तक ताकत प्रदान करता है।", image: "/benefits/benefit_muscle.jpg" },
      ],
      benefits: [
        { icon: "⚡", title: "Boost Stamina & Energy", titleHi: "स्टैमिना और ऊर्जा में वृद्धि", desc: "Pure Himalayan Shilajit Resin containing 60% Fulvic Acid that helps to improve strength & stamina.", descHi: "60% फुल्विक एसिड युक्त शुद्ध शिलाजीत जो ताकत और सहनशक्ति बढ़ाता है।" },
        { icon: "🛡️", title: "Promotes Muscle Recovery", titleHi: "मांसपेशियों की रिकवरी", desc: "Accelerates tissue repair and muscle recovery after strenuous physical exertion.", descHi: "भारी शारीरिक श्रम के बाद ऊतकों की तेजी से मरम्मत करता है।" },
        { icon: "🧠", title: "Reduces Stress Level", titleHi: "तनाव स्तर में कमी", desc: "Adaptogenic mineral resin that lowers cortisol, fighting mental fatigue & daily stress.", descHi: "कॉर्टिसोल हार्मोन कम कर मानसिक थकान और दैनिक तनाव दूर करता है।" },
        { icon: "🧘", title: "Keeps You Active Longer", titleHi: "लंबे समय तक सक्रिय रखे", desc: "Enhances cellular mitochondrial energy (ATP) to keep you active throughout the day.", descHi: "सेलुलर ऊर्जा (एटीपी) बढ़ाकर दिनभर ऊर्जावान बनाए रखता है।" },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported sustained daily stamina & energy without slumps", labelHi: "दैनिक स्टैमिना और ऊर्जा में निरंतर वृद्धि का अनुभव किया" },
        { percentage: 96, label: "Noticed enhanced muscle recovery & reduced daily stress", labelHi: "मांसपेशियों की त्वरित रिकवरी और तनाव में कमी देखी" },
        { percentage: 93, label: "Experienced active energy for longer daily duration", labelHi: "दिनभर लंबे समय तक सक्रिय ऊर्जा महसूस की" },
      ],
      ingredients: [
        { name: "Pure Himalayan Shilajit (Asphaltum)", desc: "Grade-A purified Himalayan resin containing 60% Fulvic Acid and 84+ essential trace ionic minerals.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take 1 Pea-Sized Scoop (250mg)", titleHi: "1 मटर के दाने जितना लें (250mg)", desc: "Use the provided Ayurvedic spoon to take a pea-sized quantity of pure resin.", descHi: "दिए गए चम्मच से मटर के दाने जितनी शुद्ध राल निकालें।" },
        { step: 2, title: "Dissolve in 100-200ml Warm Milk/Water", titleHi: "गुनगुने दूध या पानी में घोलें", desc: "Stir thoroughly in lukewarm water or warm milk until completely dissolved.", descHi: "गुनगुने पानी या गर्म दूध में पूरी तरह घुलने तक अच्छी तरह मिलाएं।" },
        { step: 3, title: "Drink Daily for Best Results", titleHi: "नियमित सेवन करें", desc: "Consume once or twice daily after breakfast or post-workout for lasting vigor.", descHi: "नाश्ते के बाद या वर्कआउट के बाद रोजाना पिएं।" },
      ],
      faqs: [
        { question: `What is the active composition of ${productName}?`, questionHi: `${productName} में मुख्य घटक क्या हैं?`, answer: `${productName} contains 100% Pure Himalayan Shilajit Resin (Asphaltum) standardized to 60% Fulvic Acid and 84+ trace minerals.`, answerHi: `${productName} में 100% शुद्ध हिमालयन शिलाजीत रेजिन है जिसमें 60% फुल्विक एसिड और 84+ खनिज लवण मौजूद हैं।` },
        { question: "How to consume Shilajit Resin?", questionHi: "शिलाजीत का सेवन कैसे करें?", answer: "Dissolve one pea-sized pinch or spoon once a day in lukewarm water or milk after meals, or as directed by your physician.", answerHi: "एक मटर के दाने जितना भाग गुनगुने पानी या गर्म दूध में घोलकर भोजन के बाद लें।" },
        { question: "Are there any side effects?", questionHi: "क्या इसके कोई दुष्प्रभाव हैं?", answer: "No side effects in clinical trials! It is 100% pure purified Himalayan mineral resin, tested for heavy metals.", answerHi: "नैदानिक परीक्षणों में कोई दुष्प्रभाव नहीं पाया गया! यह 100% शुद्ध और हेवी-मेटल टेस्टेड है।" },
      ],
      reviews: [
        { name: "Rajesh Sharma", location: "Delhi", locationHi: "दिल्ली", rating: 5, date: "2 days ago", dateHi: "2 दिन पहले", comment: "Pure Himalayan Shilajit Resin! Easy to dissolve in warm milk, gives incredible stamina and muscle recovery.", commentHi: "बेहतरीन शुद्ध शिलाजीत! गर्म दूध में आसानी से घुल जाता है, स्टैमिना में जबरदस्त सुधार हुआ।" },
        { name: "Vikram K.", location: "Mumbai", locationHi: "मुंबई", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Authentic resin with 60% Fulvic Acid. My energy and stress levels have improved dramatically.", commentHi: "असली राल! मेरी ऊर्जा बढ़ गई है और दैनिक तनाव काफी कम हो गया है।" },
        { name: "Amit Verma", location: "Bangalore", locationHi: "बैंगलोर", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Best post-workout natural energy booster. Feel active throughout my long office shifts.", commentHi: "वर्कआउट के बाद का बेहतरीन प्राकृतिक ऊर्जा बूस्टर। दिनभर चुस्ती बनी रहती है।" },
        { name: "Sanjay Patel", location: "Ahmedabad", locationHi: "अहमदाबाद", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Comes with certificate of purity. Dissolves completely in warm water without any residue.", commentHi: "शुद्धता के प्रमाण पत्र के साथ आता है। पानी में बिना किसी तलछट के पूरी तरह घुल जाता है।" },
        { name: "Neeraj Joshi", location: "Dehradun", locationHi: "देहरादून", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Remarkable difference in immunity and stamina within 15 days of daily use.", commentHi: "15 दिनों के नियमित सेवन से इम्यूनिटी और स्टैमिना में गजब का बदलाव महसूस हुआ।" },
        { name: "Devendra Singh", location: "Jaipur", locationHi: "जयपुर", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Top quality Himalayan Shilajit! Very authentic earthy aroma and high potency.", commentHi: "उच्च गुणवत्ता वाला हिमालयन शिलाजीत! बहुत ही शुद्ध और असरदार।" },
      ],
    };
  }

  // 1B. AYUR SHAKTI (PAIN OIL) SPECIALIZED CONTENT
  if (prod.includes("pain") || prod.includes("oil") || prod.includes("ayur shakti")) {
    return {
      benefitHeadline: "Deep Penetrating Joint & Muscle Pain Relief Oil",
      benefitHeadlineHi: "गहन असरदार जोड़ों एवं मांसपेशियों का दर्द निवारक तेल",
      benefitSubtitle: "Fast-acting warm medicated herbal oil with Surjan Siri (2.25g), Rasna, and Til oil for instant joint comfort.",
      benefitSubtitleHi: "सुरंजान शीरीं (2.25g), रास्ना और तिल तेल से निर्मित तुरंत दर्द निवारक मालिश तेल।",
      suitableFor: "Individuals suffering from joint stiffness, knee pain, arthritis, sciatica, cervical stiffness, and acute muscle spasms.",
      suitableForHi: "घुटनों का दर्द, जोड़ों की अकड़न, गठिया, साइटिका, कमर दर्द और मांसपेशियों के खिंचाव से पीड़ित लोगों के लिए।",
      bullets: [
        "Fast Warm Herbal Oil with Surjan Siri (2.25g) & Rasna",
        "Relieves Knee Pain, Joint Stiffness, Sciatica & Muscle Spasms",
        "Deep Transdermal Penetration with Til & Mustard Base Oils",
        "100% Natural Medicated Ayurvedic Oil • For External Use",
      ],
      bulletsHi: [
        "सुरंजान शीरीं (2.25g) व रास्ना युक्त असरदार गर्म तेल",
        "घुटनों के दर्द, जोड़ों की जकड़न, साइटिका व कमर दर्द में तुरंत राहत",
        "तिल और सरसों के तेल से त्वचा में गहरी अवशोषण क्षमता",
        "100% प्राकृतिक आयुर्वेदिक औषधीय तेल • केवल बाह्य उपयोग",
      ],
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
      visualBenefits: [
        { title: "Deep Warmth & Fast Relief", titleHi: "गहरी गर्माहट और त्वरित राहत", desc: "Surjan Siri and Rasna penetrate deep to deliver soothing warmth to aching joints.", descHi: "सुरंजान शीरीं और रास्ना गहराई में जाकर दर्द वाले जोड़ों को तुरंत आराम देते हैं।", image: "/benefits/pain_warmth.jpg" },
        { title: "Eases Joint Stiffness", titleHi: "जोड़ों की जकड़न में आराम", desc: "Medicated Til and Mustard oils lubricate knee joints and ease morning stiffness.", descHi: "औषधीय तिल व सरसों का तेल कार्टिलेज को पोषण देकर सुबह की अकड़न दूर करता है।", image: "/benefits/pain_flexibility.jpg" },
        { title: "Active Daily Mobility", titleHi: "सहज दैनिक गतिशीलता", desc: "Soothes nerve tightness and back spasms so you can walk freely and comfortably.", descHi: "नसों के खिंचाव और कमर दर्द को शांत कर आपको स्वतंत्र गतिशीलता प्रदान करता है।", image: "/benefits/pain_movement.jpg" },
      ],
      benefits: [
        { icon: "⚡", title: "Instant Deep Transdermal Warmth", titleHi: "त्वरित गहरी गर्माहट", desc: "Fast-absorbing warm herbal oil with Surjan Siri (2.25g) & Rasna for deep joint, muscle & nerve pain.", descHi: "सुरंजान शीरीं और रास्ना युक्त तेल जो जोड़ों और मांसपेशियों के दर्द में तुरंत गर्माहट देता है।" },
        { icon: "🛡️", title: "Relieves Joint Swelling & Stiffness", titleHi: "सूजन व अकड़न में राहत", desc: "Eases morning knee stiffness, backaches, cervical tightness, and muscle spasms.", descHi: "घुटनों की जकड़न, कमर दर्द और गर्दन की अकड़न को दूर करता है।" },
        { icon: "🌿", title: "Enhances Joint Mobility & Lubrication", titleHi: "जोड़ों का लचीलापन", desc: "Nourishes joint cartilage with Til & Mustard oils for flexible, smooth physical movement.", descHi: "तिल व सरसों तेल से कार्टिलेज को पोषण देकर चिकनाई बनाए रखता है।" },
        { icon: "🧘", title: "100% Herbal & Non-Greasy", titleHi: "100% प्राकृतिक व असरदार", desc: "Fast-absorbing Ayurvedic formula with Pudhina Satav, Kapoor & Nilgiri for fast comfort.", descHi: "कपूर, पुदीना सत और नीलगिरी युक्त तुरंत राहत देने वाला फॉर्मूला।" },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported warm pain relief within 15 minutes of gentle massage", labelHi: "मालिश के 15 मिनट के भीतर गर्माहट और दर्द में राहत महसूस की" },
        { percentage: 96, label: "Noticed reduced knee stiffness & improved walking mobility in 5 days", labelHi: "5 दिनों में घुटनों की अकड़न में कमी और चलने-फिरने में सुधार देखा" },
        { percentage: 93, label: "Experienced long-lasting back pain & muscle spasm relief", labelHi: "कमर दर्द और मांसपेशियों के खिंचाव में स्थायी आराम पाया" },
      ],
      ingredients: [
        { name: "Surjan Siri (2.25g) & Kali Mushli (1.25g)", desc: "Colchicum luteum & Curculigo orchioides — Renowned Ayurvedic herbs for deep joint pain, gout & arthritis relief.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Shake Bottle Well Before Use", titleHi: "उपयोग से पहले अच्छी तरह हिलाएं", desc: "Shake well and pour 5-10 drops of warm medicated oil directly onto the affected joint or muscle.", descHi: "तेल की शीशी को हिलाएं और 5-10 बूंदें प्रभावित जोड़ या मांसपेशी पर लगाएं।" },
        { step: 2, title: "Gently Massage in Circular Motion", titleHi: "गोलाकार गति में धीरे-धीरे मालिश करें", desc: "Massage gently for 3-5 minutes until the herbal oil is deeply absorbed into the skin.", descHi: "3-5 मिनट तक हल्के हाथों से मालिश करें जब तक तेल त्वचा में समा न जाए।" },
        { step: 3, title: "Apply Twice Daily for Lasting Relief", titleHi: "दिन में दो बार लगाएं", desc: "Use morning and before bed for continuous joint warmth, mobility and stiffness relief.", descHi: "सुबह और रात को सोने से पहले लगाएं, जोड़ों में गर्माहट बनी रहेगी।" },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, questionHi: `${productName} में मुख्य घटक क्या हैं?`, answer: `Each 10ml contains Surjan Siri (2.25g), Kali Mushli (1.25g), Satavari (0.75g), Rasna (0.75g), Mustard Oil (4ml), Til Oil (2ml), and Nilgiri Oil (0.25ml).`, answerHi: `प्रत्येक 10ml में सुरंजान शीरीं (2.25g), काली मूसली (1.25g), शतावरी (0.75g), रास्ना (0.75g), सरसों तेल (4ml), तिल तेल (2ml) और नीलगिरी तेल शामिल हैं।` },
        { question: "How to use Ayur Shakti Oil?", questionHi: "आयुर् शक्ति तेल का उपयोग कैसे करें?", answer: "Shake well before use. Gently massage on the affected joint or muscle area twice a day. (For external use only).", answerHi: "उपयोग से पहले हिलाएं और दिन में 2 बार प्रभावित हिस्से पर हल्के हाथों से मालिश करें।" },
      ],
      reviews: [
        { name: "Subhash Yadav", location: "Kanpur", locationHi: "कानपुर", rating: 5, date: "3 days ago", dateHi: "3 दिन पहले", comment: `Instant relief for my chronic knee pain! The warmth relaxes stiffness in 10 minutes.`, commentHi: "घुटनों के दर्द में तुरंत आराम मिला! 10 मिनट में गर्माहट से अकड़न दूर हो जाती है।" },
        { name: "Meena Gupta", location: "Indore", locationHi: "इंदौर", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "My mother uses it daily for severe joint pain and backache. Best Ayurvedic massage oil!", commentHi: "मेरी माताजी जोड़ों और कमर दर्द के लिए रोज इस्तेमाल करती हैं। सबसे अच्छा तेल है।" },
        { name: "Rameshwar Lal", location: "Varanasi", locationHi: "वाराणसी", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Relieved my sciatica nerve pain significantly after regular night massage.", commentHi: "रात को मालिश करने से साइटिका के दर्द में बहुत बड़ा आराम मिला।" },
        { name: "Anita Deshmukh", location: "Nagpur", locationHi: "नागपुर", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Fast absorbing and non-sticky. Relieves cervical and shoulder tension within minutes.", commentHi: "जल्दी सोखने वाला और चिपचिपाहट रहित। गर्दन और कंधे के खिंचाव में तुरंत आराम देता है।" },
        { name: "Harish Rawat", location: "Haridwar", locationHi: "हरिद्वार", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Excellent warm herbal formulation. Great for elderly parents with knee stiffness.", commentHi: "बुजुर्गों के घुटनों के दर्द और अकड़न के लिए सबसे उत्तम गर्म तेल।" },
        { name: "Balwant Singh", location: "Amritsar", locationHi: "अमृतसर", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Very soothing herbal aroma and long-lasting joint comfort throughout the winter.", commentHi: "जोड़ों के दर्द को जड़ से शांत करता है, पूरे दिन चलना-फिरना आसान हो गया।" },
      ],
    };
  }

  // 1C. VEDA SHAKTI CAPSULES SPECIALIZED CONTENT (MALE SEXUAL STAMINA & POWER)
  if (prod.includes("veda") || prod.includes("ved shakti") || prod.includes("shakti")) {
    return {
      benefitHeadline: "Ayurvedic Male Vitality, Power & Sexual Wellness",
      benefitHeadlineHi: "आयुर्वेदिक पुरुष शक्ति, स्टैमिना और वाइटलिटी कैप्सूल",
      benefitSubtitle: "Formulated with 150mg Safed Musli, Kaunch Beej, Salam Panja and purified Shilajit for male stamina, peak performance and timing.",
      benefitSubtitleHi: "150mg सफेद मूसली, कौंच बीज, सालम पंजा और मकरध्वज से निर्मित पुरुष शक्ति योग।",
      suitableFor: "Men seeking authentic Ayurvedic support to naturally elevate sexual stamina, performance timing, physical vigor, and overcome daily fatigue.",
      suitableForHi: "शारीरिक कमजोरी दूर करने, स्टैमिना, टाइमिंग और पुरुष वाइटलिटी को प्राकृतिक रूप से बढ़ाने के लिए।",
      bullets: [
        "150mg Safed Musli, Kaunch Beej, Salam Panja & Makardhwaj",
        "Boosts Male Stamina, Physical Power & Sexual Performance",
        "Enhances Peak Staying Timing & Lasting Nerve Endurance",
        "100% Pure Classical Ayurvedic Formulation • Zero Side Effects",
      ],
      bulletsHi: [
        "150mg सफेद मूसली, कौंच बीज, सालम पंजा और मकरध्वज",
        "पुरुष स्टैमिना, शारीरिक शक्ति और पौरुष क्षमता में वृद्धि",
        "लंबे समय तक नसों की मजबूती और स्थायी ऊर्जा",
        "100% शुद्ध शास्त्रीय आयुर्वेदिक योग • शून्य दुष्प्रभाव",
      ],
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
      visualBenefits: [
        { title: "Enhances Male Power & Drive", titleHi: "पुरुष शक्ति और ड्राइव में वृद्धि", desc: "Safed Musli, Salam Panja and Makardhwaj elevate natural male vitality and performance.", descHi: "सफेद मूसली और मकरध्वज प्राकृतिक पुरुष वाइटलिटी और ऊर्जा को बढ़ाते हैं।", image: "/benefits/ved_male_power.jpg" },
        { title: "Boosts Timing & Endurance", titleHi: "टाइमिंग और सहनशक्ति में सुधार", desc: "Kaunch Beej and Akarkara strengthen nerve response for staying power and lasting endurance.", descHi: "कौंच बीज और अकरकरा नसों को मजबूती देकर स्थायी शक्ति प्रदान करते हैं।", image: "/benefits/ved_male_timing.jpg" },
        { title: "Restores Vital Vigor", titleHi: "गहन ऊर्जा और ताजगी की पुनर्स्थापना", desc: "Purified Shilajit and Bhasmas nourish deep reproductive tissues (Shukra Dhatu) to fight fatigue.", descHi: "शुद्ध शिलाजीत और भस्म शुक्र धातु को पोषण देकर थकान को खत्म करते हैं।", image: "/benefits/ved_male_vigor.jpg" },
      ],
      benefits: [
        { icon: "⚡", title: "Boosts Male Stamina & Power", titleHi: "पुरुष शक्ति में वृद्धि", desc: "Formulated with 150mg Safed Musli and Makardhwaj to power peak male vigor and endurance.", descHi: "सफेद मूसली और मकरध्वज से पौरुष शक्ति और ताकत बढ़ती है।" },
        { icon: "🛡️", title: "Improves Timing & Lasting Power", titleHi: "स्थायी टाइमिंग व ताकत", desc: "Kaunch Beej and Akarkara support healthy nerve strength for improved sexual performance.", descHi: "कौंच बीज और अकरकरा नसों को मजबूत कर टाइमिंग में सुधार करते हैं।" },
        { icon: "🧠", title: "Relieves Performance Anxiety & Stress", titleHi: "तनाव व घबराहट में राहत", desc: "Reduces stress hormones and mental fatigue to keep your confidence and energy high.", descHi: "मानसिक थकान और घबराहट कम कर आत्मविश्वास बढ़ाता है।" },
        { icon: "🧬", title: "Nourishes Shukra Dhatu Reserves", titleHi: "शुक्र धातु का पोषण", desc: "Classical Rasayana herbs revitalize deep bodily tissues for long-lasting natural vigor.", descHi: "शास्त्रीय रसायन औषधियां गहरे ऊतकों को पोषण देकर ऊर्जा लौटाती हैं।" },
      ],
      clinicalStats: [
        { percentage: 99, label: "Reported noticeable improvement in male stamina & physical vigor", labelHi: "पुरुष स्टैमिना और शारीरिक शक्ति में सुधार महसूस किया" },
        { percentage: 96, label: "Experienced enhanced staying timing & lasting endurance", labelHi: "टाइमिंग और सहनशक्ति में उल्लेखनीय वृद्धि देखी" },
        { percentage: 94, label: "Noticed significant reduction in performance fatigue & daily stress", labelHi: "शारीरिक थकान और दैनिक तनाव में भारी कमी पाई" },
      ],
      ingredients: [
        { name: "Safed Musli (150 mg) & Kaunch Beej (100 mg)", desc: "Chlorophytum borivilianum & Mucuna pruriens — Potent Ayurvedic botanicals for male vitality, drive & stamina.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Twice Daily", titleHi: "दिन में 1-2 कैप्सूल लें", desc: "Take 1 to 2 capsules 30 minutes after your main meals (lunch and dinner).", descHi: "दोपहर और रात के भोजन के 30 मिनट बाद 1-2 कैप्सूल लें।" },
        { step: 2, title: "Drink with Warm Milk or Water", titleHi: "गुनगुने दूध के साथ सेवन करें", desc: "Warm milk enhances botanical absorption of Safed Musli, Kaunch Beej, and Makardhwaj.", descHi: "दूध जड़ी-बूटियों के पोषण अवशोषण को कई गुना बढ़ा देता है।" },
        { step: 3, title: "Maintain Daily for 60-90 Days", titleHi: "60-90 दिनों तक नियमित लें", desc: "Consistent daily use revitalizes Shukra Dhatu reserves for peak male power, stamina, and timing.", descHi: "स्थायी पौरुष शक्ति और स्टैमिना के लिए नियमित दिनचर्या बनाए रखें।" },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, questionHi: `${productName} में कौन से सक्रिय तत्व हैं?`, answer: `Each 500mg capsule contains Safed Musli (150mg), Kaunch Beej (100mg), Akarkara (75mg), Salam Panja (75mg), and Makardhwaj (10mg).`, answerHi: `प्रत्येक 500mg कैप्सूल में सफेद मूसली (150mg), कौंच बीज (100mg), अकरकरा (75mg), सालम पंजा (75mg) और मकरध्वज (10mg) शामिल हैं।` },
        { question: "How does Ved Shakti help with male stamina and timing?", questionHi: "वेद शक्ति पुरुष स्टैमिना और टाइमिंग में कैसे मदद करता है?", answer: "The combination of Safed Musli, Kaunch Beej, Akarkara, and Makardhwaj strengthens nerve stamina and supports lasting physical performance.", answerHi: "सफेद मूसली, कौंच बीज और मकरध्वज का संयोजन नसों को मजबूत कर पौरुष क्षमता और टाइमिंग बढ़ाता है।" },
      ],
      reviews: [
        { name: "Rajesh Sharma", location: "Delhi", locationHi: "दिल्ली", rating: 5, date: "2 days ago", dateHi: "2 दिन पहले", comment: `Best Ved Shakti formula! Noticeable boost in daily stamina, confidence, and energy within 5 days. Very satisfied!`, commentHi: "शानदार वेद शक्ति फॉर्मूला! 5 दिनों में स्टैमिना और आत्मविश्वास में गजब का सुधार हुआ।" },
        { name: "Vikram K.", location: "Mumbai", locationHi: "मुंबई", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Helped immensely with physical stamina and staying timing. Authentic classical Ayurvedic formulation!", commentHi: "शारीरिक शक्ति और टाइमिंग में बहुत मददगार साबित हुआ। असली आयुर्वेदिक उत्पाद!" },
        { name: "Deepak Tiwari", location: "Lucknow", locationHi: "लखनऊ", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Great boost in physical energy and endurance. Zero side effects, feel completely rejuvenated.", commentHi: "शारीरिक ऊर्जा और सहनशक्ति में शानदार वृद्धि। बिना किसी साइड इफेक्ट के नया जोश मिला।" },
        { name: "Rahul Choudhary", location: "Patna", locationHi: "पटना", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Safed Musli and Kaunch Beej blend is genuine. My performance confidence returned in 10 days.", commentHi: "सफेद मूसली और कौंच बीज का संयोजन असली है। 10 दिनों में आत्मविश्वास वापस आ गया।" },
        { name: "Gaurav Saxena", location: "Bhopal", locationHi: "भोपाल", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Helped reduce daily work exhaustion and improved relationship wellness drastically.", commentHi: "दिनभर की थकान दूर हुई और वाइटलिटी में बड़ा सुधार हुआ।" },
        { name: "Arvind Kumar", location: "Chandigarh", locationHi: "चंडीगढ़", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Highly recommended Ayurvedic vitality supplement. Safe, pure and very potent.", commentHi: "आयुर्वेदिक पौरुष शक्ति के लिए अत्यधिक अनुशंसित। पूरी तरह सुरक्षित और असरदार।" },
      ],
    };
  }

  // 2. KIDNEY POWDER / RENAL CARE SPECIALIZED CONTENT
  if (prod.includes("kidney") || prod.includes("renal")) {
    return {
      benefitHeadline: "Classical Ayurvedic Renal & Stone Care Formulation",
      benefitHeadlineHi: "शास्त्रीय आयुर्वेदिक गुर्दा एवं पथरी नाशक योग",
      benefitSubtitle: "Formulated with 12 active mineral salts and botanicals to dissolve kidney stones, soothe burning, and detoxify urinary pathways.",
      benefitSubtitleHi: "पाषाणभेद, गोक्षुर, वरुण छाल और 12 खनिज लवणों से युक्त पथरी गलाने वाला फॉर्मूला।",
      suitableFor: "Individuals seeking pure Ayurvedic renal support to dissolve kidney & gall bladder stones, ease urinary discomfort, and balance urinary pH.",
      suitableForHi: "किडनी व पित्ताशय की पथरी, पेशाब में जलन और यूरिक एसिड की समस्या से पीड़ित लोगों के लिए।",
      bullets: [
        "12 Classical Actives (Pashanbhed, Gokshura, Varun Chaal)",
        "Supports Kidney & Gall Bladder Stone Dissolution",
        "Relieves Burning Micturition & Flushes Renal Toxins",
        "100% Pure Ayurvedic Formulation • AYUSH & Lab Certified",
      ],
      bulletsHi: [
        "12 शास्त्रीय औषधियां (पाषाणभेद, गोखरू, वरुण छाल, हजरुल यहूद)",
        "गुर्दे व पित्त की पथरी को धीरे-धीरे गलाने में सहायक",
        "पेशाब की जलन में तुरंत आराम और यूरिक एसिड डिटॉक्स",
        "100% शुद्ध आयुर्वेदिक योग • आयुष व लैब प्रमाणित",
      ],
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
      visualBenefits: [
        { title: "Flushes Renal Toxins", titleHi: "किडनी टॉक्सिन्स बाहर निकाले", desc: "Stimulates healthy urine flow to naturally flush out excess uric acid and deposits.", descHi: "मूत्र प्रवाह को सुचारू कर यूरिक एसिड और जमा गंदगी को साफ करता है।", image: "/benefits/kidney_hydration.jpg" },
        { title: "Prevents Stone Buildup", titleHi: "पथरी बनने से रोके", desc: "Classical Pashanbhed and mineral salts help clear deposits and soothe pathways.", descHi: "पाषाणभेद और प्राकृतिक लवण जमाव को घोलकर मार्ग साफ करते हैं।", image: "/benefits/kidney_relief.jpg" },
        { title: "Soothes Burning Sensation", titleHi: "पेशाब की जलन शांत करे", desc: "Natural alkaline cooling salts ease urinary discomfort and balance pH.", descHi: "प्राकृतिक क्षारीय लवण यूरिनरी पीएच को संतुलित कर ठंडक पहुंचाते हैं।", image: "/benefits/digest_gut.jpg" },
      ],
      benefits: [
        { icon: "🛡️", title: "Prevents Renal Calculi & Stones", titleHi: "पथरी बनने से रोके", desc: "Helps in reducing the formation and size of kidney stones and gall bladder stones.", descHi: "गुर्दे और पित्ताशय की पथरी के आकार को कम करने में मदद करता है।" },
        { icon: "🌿", title: "Detoxifies Kidney & Renal Pathways", titleHi: "गुर्दे व मूत्र मार्ग की सफाई", desc: "Flushes out harmful renal toxins, excess uric acid, and balances urinary pH.", descHi: "हानिकारक टॉक्सिन्स को बाहर निकालता है और यूरिनरी पीएच संतुलित करता है।" },
        { icon: "⚡", title: "Reduces Inflammation & Pain", titleHi: "दर्द व सूजन में राहत", desc: "Soothes renal tract inflammation, easing acute stone pain and burning sensations.", descHi: "मूत्र मार्ग की सूजन को शांत कर पथरी के तीव्र दर्द में राहत देता है।" },
        { icon: "🧘", title: "100% Safe & Clinical Safety", titleHi: "100% सुरक्षित व प्राकृतिक", desc: "Time-tested classical Ayurvedic formulation with no side effects in clinical trials.", descHi: "बिना किसी दुष्प्रभाव के समय-सिद्ध शास्त्रीय आयुर्वेदिक योग।" },
      ],
      clinicalStats: [
        { percentage: 98, label: "Reported relief from urinary burning & acute discomfort in 5 days", labelHi: "5 दिनों में पेशाब की जलन और दर्द में भारी राहत महसूस की" },
        { percentage: 95, label: "Experienced significant reduction in renal calculi size & stone discomfort", labelHi: "पथरी के आकार में कमी और परेशानी में सुधार देखा" },
        { percentage: 92, label: "Noticed improved urinary pH balance & daily renal detox", labelHi: "यूरिनरी पीएच संतुलन और बेहतर किडनी डिटॉक्स का अनुभव किया" },
      ],
      ingredients: [
        { name: "Pasan bed (1000 mg) & Gokhru (1000 mg)", desc: "Saxifraga ligulata & Tribulus terrestris — Renowned Ayurvedic herbs for stone dissolution & kidney detox.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Mix 1 Scoop (5-10g) in Warm Water", titleHi: "1 चम्मच गुनगुने पानी में मिलाएं", desc: "Add 1-2 scoops of Power Kidney Powder into 200ml of lukewarm water and stir well.", descHi: "पाउडर का 1 चम्मच 200ml गुनगुने पानी में अच्छी तरह मिलाएं।" },
        { step: 2, title: "Consume Twice Daily After Meals", titleHi: "भोजन के बाद दिन में दो बार पिएं", desc: "Drink once in the morning after breakfast and once at night after dinner.", descHi: "सुबह नाश्ते के बाद और रात को खाने के बाद नियमित पिएं।" },
        { step: 3, title: "Drink 3-4 Liters of Water Daily", titleHi: "रोज 3-4 लीटर पानी पिएं", desc: "Adequate hydration accelerates renal detox, flushes uric acid, and supports smooth stone clearance.", descHi: "भरपूर पानी पीने से यूरिक एसिड निकलता है और पथरी आसानी से बाहर होती है।" },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, questionHi: `${productName} में कौन से मुख्य घटक हैं?`, answer: `Each 10g contains Kalmi Shora (1000mg), Nishadar (1000mg), Jawakhar (1000mg), Pasan Bed (1000mg), Gokhru (1000mg), and Varun Chaal (500mg).`, answerHi: `प्रत्येक 10g में कलमी शोरा (1000mg), नौसादर (1000mg), जवाखार (1000mg), पाषाणभेद (1000mg), गोखरू (1000mg) और वरुण छाल (500mg) शामिल हैं।` },
        { question: "How does it help with kidney and gall bladder stones?", questionHi: "यह किडनी और पित्त की पथरी में कैसे मदद करता है?", answer: "The combination of Pashanbhed, Gokshura, and Varun works synergistically to dissolve renal calculi and flush out urinary deposits.", answerHi: "पाषाणभेद, गोखरू और वरुण का शास्त्रीय योग पथरी को धीरे-धीरे गलाकर बाहर निकालने में मदद करता है।" },
      ],
      reviews: [
        { name: "Harish Chandra", location: "Delhi", locationHi: "दिल्ली", rating: 5, date: "3 days ago", dateHi: "3 दिन पहले", comment: `My 6mm kidney stone dissolved and passed out smoothly within 3 weeks of using ${productName}! Extremely effective.`, commentHi: "3 सप्ताह में मेरी 6mm की पथरी गलकर निकल गई! बहुत ही असरदार चूर्ण है।" },
        { name: "Savita Devi", location: "Kanpur", locationHi: "कानपुर", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Relieved my severe urinary burning and back pain in just 4 days. Highly recommended renal powder!", commentHi: "सिर्फ 4 दिनों में पेशाब की जलन और कमर दर्द में आराम मिला। बहुत बढ़िया उत्पाद।" },
        { name: "Manoj Agrawal", location: "Agra", locationHi: "आगरा", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Very soothing herbal formulation. Flushed out urinary crystals without any unbearable pain.", commentHi: "यूरिनरी क्रिस्टल्स को बिना किसी असहनीय दर्द के आसानी से बाहर निकाल दिया।" },
        { name: "Surendra Mishra", location: "Varanasi", locationHi: "वाराणसी", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Doctor advised surgery for stone, but this Ayurvedic powder dissolved it naturally in 25 days.", commentHi: "डॉक्टर ने सर्जरी की सलाह दी थी, लेकिन इस चूर्ण ने 25 दिनों में पथरी गला दी।" },
        { name: "Geeta Rani", location: "Meerut", locationHi: "मेरठ", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Instant relief from flank pain and burning micturition. Authentic Pashanbhed active.", commentHi: "पेशाब की तीव्र जलन और पसली के दर्द में तुरंत राहत मिली।" },
        { name: "Prakash Jha", location: "Ranchi", locationHi: "रांची", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Best renal detox powder. Regular use kept my uric acid levels completely normal.", commentHi: "किडनी डिटॉक्स के लिए सर्वश्रेष्ठ। यूरिक एसिड पूरी तरह सामान्य हो गया।" },
      ],
    };
  }

  // 3. PILES CARE / HEMORRHOID SPECIALIZED CONTENT
  if (prod.includes("piles") || prod.includes("hemorrhoid") || prod.includes("fissure")) {
    return {
      benefitHeadline: "Classical Ayurvedic Anorectal Relief & Colon Care",
      benefitHeadlineHi: "शास्त्रीय आयुर्वेदिक बवासीर व गुदा रोग निवारक योग",
      benefitSubtitle: "Formulated with 19 active herbs including Suran 200mg, Triphala, and Shuddha Guggul to shrink pile mass and stop bleeding.",
      benefitSubtitleHi: "200mg सूरन, कचनार गुग्गुल, नीम गिरी और त्रिफला से निर्मित मस्सों को सुखाने वाला योग।",
      suitableFor: "Adults suffering from internal or external piles, painful fissures, bleeding, rectal itching, and chronic constipation.",
      suitableForHi: "खूनी व बादी बवासीर, फिशर, गुदा मार्ग में दर्द, सूजन, जलन और पुरानी कब्ज से पीड़ित लोगों के लिए।",
      bullets: [
        "19 Potent Botanicals (Suran 200mg, Guggul & Neem Giri)",
        "Shrinks Anorectal Pile Mass & Arrests Rectal Bleeding",
        "Natural Stool Softener for Pain-Free Daily Bowel Regularity",
        "100% Pure Ayurvedic Formulation • AYUSH & Lab Certified",
      ],
      bulletsHi: [
        "19 शक्तिशाली जड़ी-बूटियां (सूरन 200mg, कचनार गुग्गुल व नीम गिरी)",
        "बवासीर के मस्सों को सुखाए और मलद्वार से खून आना बंद करे",
        "प्राकृतिक मल सॉफ़्नर - बिना दर्द और जोर लगाए पेट साफ",
        "100% शुद्ध आयुर्वेदिक योग • आयुष व लैब प्रमाणित",
      ],
      fullComposition: [
        { name: "Suran", botanical: "Amorphophallus paeoniifolius", amount: "200 mg" },
        { name: "Trifla", botanical: "Classical Triphala Extract", amount: "50 mg" },
        { name: "Shuddha Guggul", botanical: "Commiphora wightii", amount: "50 mg" },
        { name: "Neem Giri", botanical: "Azadirachta indica", amount: "25 mg" },
        { name: "Kanchnar Guggul", botanical: "Bauhinia variegata", amount: "20 mg" },
        { name: "Musta", botanical: "Cyperus rotundus", amount: "20 mg" },
        { name: "Vai Bidag", botanical: "Embelia ribes", amount: "20 mg" },
        { name: "Bakayan Migi", botanical: "Melia azedarach", amount: "20 mg" },
        { name: "Sona Mukhi", botanical: "Cassia angustifolia", amount: "10 mg" },
        { name: "Mandur Bhasam", botanical: "Purified Iron Calx", amount: "10 mg" },
      ],
      visualBenefits: [
        { title: "Relieves Swelling & Itching", titleHi: "सूजन व खुजली में राहत", desc: "Suran and Kanchnar Guggul soothe irritated anorectal tissue and reduce mass.", descHi: "सूरन और कांचनार गुग्गुल गुदा मार्ग की सूजन और खुजली को शांत करते हैं।", image: "/benefits/piles_comfort.jpg" },
        { title: "Arrests Rectal Bleeding", titleHi: "खून आना तुरंत रोके", desc: "Natural astringent botanicals promote fast mucosal repair and stop bleeding.", descHi: "प्राकृतिक कषाय औषधियां अंदरूनी घाव भरकर खून आना बंद करती हैं।", image: "/benefits/kidney_relief.jpg" },
        { title: "Pain-Free Bowel Movement", titleHi: "दर्द रहित पेट साफ", desc: "Triphala softens hard stools to eliminate painful straining every morning.", descHi: "त्रिफला कठोर मल को मुलायम कर बिना जोर लगाए पेट साफ करता है।", image: "/benefits/pain_movement.jpg" },
      ],
      benefits: [
        { icon: "🛡️", title: "Pain, Swelling & Itching Relief", titleHi: "दर्द, सूजन व खुजली से मुक्ति", desc: "Soothes anorectal inflammation, itching, and swollen veins for daily comfort.", descHi: "गुदा मार्ग की नसों की सूजन, जलन और चुभन को शांत करता है।" },
        { icon: "🌿", title: "Controls Bleeding & Heals Fissures", titleHi: "खून रोके व घाव भरे", desc: "Natural astringent herbs stop rectal bleeding and repair mucosal tissue lining.", descHi: "खून के रिसाव को तुरंत नियंत्रित कर दरारों और घावों को भरता है।" },
        { icon: "⚡", title: "Natural Stool Softener", titleHi: "प्राकृतिक मल सॉफ़्नर", desc: "Softens hard stools to eliminate painful straining during daily bowel movements.", descHi: "कब्ज दूर कर मल त्याग को सुगम और पीड़ा रहित बनाता है।" },
        { icon: "🧘", title: "Shrinks Pile Mass Naturally", titleHi: "मस्सों को सुखाए", desc: "Helps reduce swollen pile mass and prevents chronic anorectal recurrence.", descHi: "बवासीर के बाहरी व अंदरूनी मस्सों को सुखाकर सिकुड़ने में मदद करता है।" },
      ],
      clinicalStats: [
        { percentage: 98, label: "Reported stop in rectal bleeding & acute pain within 5 days", labelHi: "5 दिनों में खून आना बंद हुआ और दर्द में राहत मिली" },
        { percentage: 95, label: "Noticed significant reduction in swelling & itching", labelHi: "मस्सों की सूजन और खुजली में भारी कमी देखी" },
        { percentage: 92, label: "Experienced smooth, pain-free daily bowel movements", labelHi: "बिना दर्द के नियमित व आसान शौच का अनुभव किया" },
      ],
      ingredients: [
        { name: "Suran (200 mg)", desc: "Amorphophallus paeoniifolius — Time-tested Ayurvedic remedy for shrinking pile masses and toning anorectal tissue.", image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Twice Daily", titleHi: "दिन में 1-2 कैप्सूल लें", desc: "Take 1-2 capsules daily after breakfast and after dinner with normal or lukewarm water.", descHi: "सुबह नाश्ते और रात के खाने के बाद गुनगुने पानी के साथ 1-2 कैप्सूल लें।" },
        { step: 2, title: "Maintain High-Fiber Hydration", titleHi: "फाइबर युक्त आहार व पानी लें", desc: "Drink plenty of water and include high-fiber foods to support effortless stool softening.", descHi: "दिन में पर्याप्त पानी पिएं और फाइबर युक्त भोजन लें।" },
        { step: 3, title: "Follow 30-Day Regimen", titleHi: "30 दिनों का कोर्स पूरा करें", desc: "Helps shrink pile mass, arrests rectal bleeding, and relieves painful anorectal inflammation.", descHi: "मस्सों को पूरी तरह सुखाने और दोबारा होने से रोकने के लिए नियमित लें।" },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, questionHi: `${productName} में कौन सी जड़ी-बूटियां हैं?`, answer: `Each capsule contains Suran (200mg), Trifla (50mg), Shuddha Guggul (50mg), Neem Giri (25mg), Kanchnar Guggul (20mg), and classical Bhasmas.`, answerHi: `प्रत्येक कैप्सूल में सूरन (200mg), त्रिफला (50mg), शुद्ध गुग्गुल (50mg), नीम गिरी (25mg) और कचनार गुग्गुल (20mg) शामिल हैं।` },
        { question: "Is it effective for both internal and external piles?", questionHi: "क्या यह खूनी और बादी दोनों बवासीर में असरदार है?", answer: "Yes! The synergistic blend of Suran, Kanchnar Guggul, Neem Giri, and Triphala works internally to shrink pile mass and stop bleeding.", answerHi: "हाँ! सूरन और कचनार गुग्गुल का संयोजन खूनी और बादी दोनों प्रकार के मस्सों को सुखाने में अत्यंत प्रभावी है।" },
      ],
      reviews: [
        { name: "Satish Verma", location: "Lucknow", locationHi: "लखनऊ", rating: 5, date: "3 days ago", dateHi: "3 दिन पहले", comment: `Unbelievable relief! My rectal bleeding stopped in just 4 days with ${productName}.`, commentHi: "अद्भुत राहत! सिर्फ 4 दिनों में खून आना बंद हो गया और पेट आसानी से साफ होने लगा।" },
        { name: "Mahesh Rao", location: "Hyderabad", locationHi: "हैदराबाद", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Piles Care capsules cured my constipation and swelling completely.", commentHi: "पाइल्स केयर कैप्सूल से मेरी पुरानी कब्ज और सूजन पूरी तरह ठीक हो गई।" },
        { name: "Vinod Yadav", location: "Gorakhpur", locationHi: "गोरखपुर", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Shrank external pile mass within 2 weeks. Can sit and walk comfortably without stinging pain.", commentHi: "2 सप्ताह में मस्सों का आकार बहुत छोटा हो गया। अब बिना दर्द के आराम से बैठ पाता हूँ।" },
        { name: "Rekha Sen", location: "Kolkata", locationHi: "कोलकाता", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Stool passing became completely smooth without any straining. Godsend for fissure pain.", commentHi: "बिना जोर लगाए पेट साफ होता है। फिशर के दर्द के लिए यह वरदान साबित हुआ।" },
        { name: "Ashok Trivedi", location: "Ahmedabad", locationHi: "अहमदाबाद", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "100% natural and effective. Stopped painful itching and rectal discomfort in 5 days.", commentHi: "100% प्राकृतिक और असरदार। 5 दिनों में खुजली और जलन से मुक्ति मिल गई।" },
        { name: "Dharmendra Singh", location: "Jaipur", locationHi: "जयपुर", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "No more bleeding or fear of morning bowel movements. Highly grateful for this medicine.", commentHi: "अब शौच के समय कोई खून या दर्द नहीं होता। बहुत ही उत्तम आयुर्वेदिक दवा।" },
      ],
    };
  }

  // 4. IRON LIVER / HEPATIC & HEMOGLOBIN SPECIALIZED CONTENT
  if (prod.includes("iron") || prod.includes("liver") || prod.includes("hepatic")) {
    return {
      benefitHeadline: "Targeted Hepatic Cell Repair & Liver Detox",
      benefitHeadlineHi: "लिवर सेल्स रिपेयर और हेपेटिक डिटॉक्स फॉर्मूलेशन",
      benefitSubtitle: "Standardized extracts of Milk Thistle (300mg Silymarin), Dandelion Root, and Kutki for liver detox and appetite recovery.",
      benefitSubtitleHi: "300mg सिलीमारिन (मिल्क थीस्ल), कुटकी और भूमि आंवला युक्त लिवर रीजेनरेशन फॉर्मूला।",
      suitableFor: "Adults seeking pure Ayurvedic hepatic support to detoxify sluggish liver, regulate liver enzymes, and improve appetite.",
      suitableForHi: "कमजोर लिवर, भूख न लगना, फैटी लिवर और पाचन की सुस्ती से पीड़ित लोगों के लिए।",
      bullets: [
        "Standardized Milk Thistle (300mg Silymarin) & Kutki",
        "Supports Liver Detox, Hepatic Cell Repair & Enzyme Balance",
        "Promotes Gall Bladder Bile Flow & Restores Natural Appetite",
        "100% Pure Standardized Extracts • AYUSH & Lab Certified",
      ],
      bulletsHi: [
        "मानकीकृत मिल्क थीस्ल (300mg सिलीमारिन) और कुटकी सत्व",
        "लिवर डिटॉक्स, हेपेटिक सेल रिपेयर और एंजाइम संतुलन",
        "पित्ताशय से पित्त प्रवाह बढ़ाकर भूख और पाचन ठीक करे",
        "100% शुद्ध मानकीकृत सत्व • आयुष व लैब प्रमाणित",
      ],
      fullComposition: [
        { name: "Milk Thistle Ext.", botanical: "Silybum marianum (Silymarin)", amount: "300 mg" },
        { name: "Dandelion Root Ext.", botanical: "Taraxacum officinale", amount: "100 mg" },
        { name: "Picrorrhiza Kurrao Ext.", botanical: "Picrorhiza kurrooa (Kutki)", amount: "50 mg" },
        { name: "Bhumi Amla Ext.", botanical: "Phyllanthus niruri", amount: "50 mg" },
      ],
      visualBenefits: [
        { title: "Detoxifies Sluggish Liver", titleHi: "सुस्त लिवर को डिटॉक्स करे", desc: "Potent 300mg Milk Thistle (Silymarin) extract supports healthy liver cell renewal.", descHi: "300mg मिल्क थीस्ल सत्व लिवर कोशिकाओं के पुनर्निर्माण में मदद करता है।", image: "/benefits/liver_energy.jpg" },
        { title: "Restores Natural Appetite", titleHi: "प्राकृतिक भूख लौटाए", desc: "Kutki and Bhumi Amla relieve heaviness and bring back healthy digestive hunger.", descHi: "कुटकी और भूमि आंवला पेट का भारीपन दूर कर स्वाभाविक भूख बढ़ाते हैं।", image: "/benefits/digest_gut.jpg" },
        { title: "Promotes Bile Flow", titleHi: "पित्त रस प्रवाह सुधारे", desc: "Dandelion Root cleanses hepatic pathways for smooth fat and nutrient breakdown.", descHi: "पित्त नली को साफ कर वसा और पोषक तत्वों का पाचन सुगम बनाता है।", image: "/benefits/kidney_hydration.jpg" },
      ],
      benefits: [
        { icon: "🛡️", title: "Effective in Liver Disorders", titleHi: "लिवर विकारों में असरदार", desc: "Supports recovery in alcoholic liver, cirrhosis, hepatic stress, and hepatitis management.", descHi: "फैटी लिवर, शराब से प्रभावित लिवर और हेपेटिक तनाव में सुधार करता है।" },
        { icon: "⚡", title: "Improves Digestion & Appetite", titleHi: "पाचन व भूख में सुधार", desc: "Relieves impaired assimilation, indigestion, jaundice, and restores natural hunger.", descHi: "अपच, पीलिया के बाद की कमजोरी दूर कर खुलकर भूख लगाता है।" },
        { icon: "🌿", title: "Promotes Gall Bladder Bile Flow", titleHi: "पित्त रस स्राव को बढ़ावा", desc: "Stimulates healthy bile secretion from the gall bladder for smooth fat metabolism.", descHi: "पित्ताशय से स्वस्थ पित्त स्राव को उत्तेजित कर वसा पाचन ठीक करता है।" },
        { icon: "🧘", title: "100% Clinical Safety & Detox", titleHi: "100% सुरक्षित लिवर डिटॉक्स", desc: "Pure standardized extracts with no side effects in clinical trials.", descHi: "शुद्ध मानकीकृत अर्क से तैयार, शून्य दुष्प्रभाव।" },
      ],
      clinicalStats: [
        { percentage: 98, label: "Reported noticeable boost in daily appetite & digestion in 7 days", labelHi: "7 दिनों में भूख और पाचन में उल्लेखनीय सुधार महसूस किया" },
        { percentage: 96, label: "Experienced improved liver enzyme balance within 3-4 weeks", labelHi: "3-4 हफ्तों में लिवर एंजाइम संतुलन में सुधार देखा" },
        { percentage: 94, label: "Noticed reduced abdominal heaviness & sluggish bile symptoms", labelHi: "पेट के भारीपन और सुस्ती में भारी कमी पाई" },
      ],
      ingredients: [
        { name: "Milk Thistle Ext. (300 mg)", desc: "Potent Milk Thistle extract rich in Silymarin for hepatic cell regeneration & toxin defense.", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=80" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Daily", titleHi: "दिन में 1-2 कैप्सूल लें", desc: "Consume 1-2 capsules daily with a glass of water after your lunch or dinner.", descHi: "दोपहर या रात के भोजन के बाद पानी के साथ 1-2 कैप्सूल लें।" },
        { step: 2, title: "Consistent Daily Consumption", titleHi: "नियमित सेवन बनाए रखें", desc: "Standardized Milk Thistle and Kutki work synergistically to stimulate healthy bile flow.", descHi: "मिल्क थीस्ल और कुटकी लिवर को लगातार डिटॉक्स करते रहते हैं।" },
        { step: 3, title: "Notice Rapid Appetite & Energy", titleHi: "भूख और ऊर्जा में सुधार देखें", desc: "In 2-3 weeks, notice lighter abdominal digestion, improved appetite, and natural liver detox.", descHi: "2-3 हफ्तों में पेट हल्का महसूस होगा और भूख खुलकर लगेगी।" },
      ],
      faqs: [
        { question: `What are the active ingredients in ${productName}?`, questionHi: `${productName} में कौन से सक्रिय घटक हैं?`, answer: `Each capsule contains Milk Thistle Ext. (300mg Silymarin), Dandelion Root (100mg), Picrorrhiza Kurrao (50mg), and Bhumi Amla (50mg).`, answerHi: `प्रत्येक कैप्सूल में मिल्क थीस्ल (300mg सिलीमारिन), डैंडेलियन रूट (100mg), कुटकी (50mg) और भूमि आंवला (50mg) शामिल हैं।` },
        { question: "How does Iron Liver support bile flow and digestion?", questionHi: "यह लिवर और पाचन में कैसे मदद करता है?", answer: "Milk Thistle and Kutki stimulate bile secretion, protect liver cells from toxins, and restore digestive fire.", answerHi: "मिल्क थीस्ल और कुटकी लिवर कोशिकाओं को सुरक्षित रखते हैं और पित्त रस बढ़ाकर पाचन दुरुस्त करते हैं।" },
      ],
      reviews: [
        { name: "Pankaj Kumar", location: "Patna", locationHi: "पटना", rating: 5, date: "3 days ago", dateHi: "3 दिन पहले", comment: `My liver enzymes and digestive appetite improved significantly in 3 weeks with ${productName}!`, commentHi: "3 हफ्तों में मेरे लिवर एंजाइम और भूख में बहुत अच्छा सुधार हुआ! पेट का भारीपन खत्म हो गया।" },
        { name: "Pooja Sharma", location: "Jaipur", locationHi: "जयपुर", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Excellent natural formula for sluggish liver. Great appetite improvement!", commentHi: "कमजोर लिवर के लिए बहुत बढ़िया फॉर्मूला। भूख खुलकर लगने लगी है।" },
        { name: "Alok Ranjan", location: "Bhubaneswar", locationHi: "भुवनेश्वर", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Fatty liver grade-1 symptoms reduced in ultrasound after 1 month course.", commentHi: "1 महीने के कोर्स के बाद अल्ट्रासाउंड में फैटी लिवर के लक्षणों में काफी सुधार आया।" },
        { name: "Narendra Mohan", location: "Gwalior", locationHi: "ग्वालियर", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Milk Thistle and Kutki blend relieved chronic post-meal heaviness and bloating.", commentHi: "मिल्क थीस्ल और कुटकी के मिश्रण ने खाने के बाद का भारीपन पूरी तरह दूर कर दिया।" },
        { name: "Sunita Rastogi", location: "Bareilly", locationHi: "बरेली", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Restored natural hunger and energy after severe jaundice recovery.", commentHi: "पीलिया के बाद की कमजोरी दूर कर स्वाभाविक भूख और ऊर्जा लौटाई।" },
        { name: "Tarun Chakraborty", location: "Kolkata", locationHi: "कोलकाता", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Very gentle on stomach. Improves liver digestion and cleared skin dullness.", commentHi: "लिवर को डिटॉक्स कर पाचन दुरुस्त किया और चेहरे की चमक भी लौट आई।" },
      ],
    };
  }

  // 6. DIGESTION CARE SPECIALIZED CONTENT
  if (cat.includes("digestion") || prod.includes("digest") || prod.includes("gas") || prod.includes("acid")) {
    return {
      benefitHeadline: "Comprehensive Gut Cleansing & Acidity Relief",
      benefitHeadlineHi: "गहन आंत सफाई एवं गैस-एसिडिटी निवारक फॉर्मूला",
      benefitSubtitle: "Classical Triphala, Ajwain, Hing, and Sunthi ginger extracts to relieve gas, acidity, and ignite digestive fire (Agni).",
      benefitSubtitleHi: "त्रिफला, अजवाइन, हींग और सोंठ से युक्त जठराग्नि प्रदीपक पाचन योग।",
      suitableFor: "Adults experiencing chronic acidity, gas, abdominal bloating, indigestion, and irregular bowel habits.",
      suitableForHi: "पुरानी गैस, सीने में जलन, खट्टी डकारें, पेट फूलना और अपच से परेशान लोगों के लिए।",
      bullets: [
        "Classical Triphala, Ajwain, Hing & Sunthi (Ginger)",
        "Neutralizes Acidity, Trapped Gas & Abdominal Bloating",
        "Ignites Natural Digestive Fire (Agni) & Balances Gut Flora",
        "100% Pure Ayurvedic Formulation • AYUSH & Lab Certified",
      ],
      bulletsHi: [
        "शास्त्रीय त्रिफला, अजवाइन, हींग और सोंठ अर्क",
        "एसिडिटी, फंसी गैस और पेट फूलने की समस्या में तुरंत राहत",
        "जठराग्नि को तेज कर पाचन शक्ति और भूख में सुधार",
        "100% शुद्ध आयुर्वेदिक योग • आयुष व लैब प्रमाणित",
      ],
      fullComposition: [
        { name: "Triphala Extract", botanical: "Amla, Haritaki & Bibhitaki", amount: "200 mg" },
        { name: "Ajwain Ext.", botanical: "Trachyspermum ammi", amount: "100 mg" },
        { name: "Sunthi (Dry Ginger)", botanical: "Zingiber officinale", amount: "100 mg" },
        { name: "Hing Purified", botanical: "Ferula foetida", amount: "50 mg" },
        { name: "Saunf Ext.", botanical: "Foeniculum vulgare", amount: "50 mg" },
      ],
      visualBenefits: [
        { title: "Relieves Gas & Bloating", titleHi: "गैस व पेट फूलना दूर करे", desc: "Triphala and Ajwain quickly neutralize trapped gas and reduce abdominal fullness.", descHi: "त्रिफला और अजवाइन फंसी गैस को बाहर निकालकर पेट का तनाव खत्म करते हैं।", image: "/benefits/digest_gut.jpg" },
        { title: "Prevents Acid Reflux", titleHi: "खट्टी डकारें व जलन शांत करे", desc: "Gentle cooling herbs balance stomach acid and protect the gastric mucosal lining.", descHi: "शीतल पाचक जड़ी-बूटियां पेट के एसिड को संतुलित कर सीने की जलन शांत करती हैं।", image: "/benefits/liver_energy.jpg" },
        { title: "Daily Regularity", titleHi: "दैनिक पेट की सफाई", desc: "Sunthi ginger stimulates natural digestive fire for smooth morning elimination.", descHi: "सोंठ जठराग्नि को प्रदीप्त कर सुबह आसानी से पेट साफ करता है।", image: "/benefits/kidney_hydration.jpg" },
      ],
      benefits: [
        { icon: "🌿", title: "100% Herbal Gut Relief", titleHi: "प्राकृतिक पेट राहत", desc: "Soothes stomach lining, relieving acidity, gas, and abdominal bloating naturally.", descHi: "पेट की अंदरूनी परत को शांत कर गैस और एसिडिटी से राहत दिलाता है।" },
        { icon: "⚡", title: "Enhances Digestion & Absorption", titleHi: "पाचन शक्ति में वृद्धि", desc: "Stimulates natural digestive enzymes (Agni) for efficient nutrient absorption.", descHi: "पाचक एंजाइमों को उत्तेजित कर भोजन के अवशोषण को बढ़ाता है।" },
        { icon: "🛡️", title: "Gut Microbiome Balance", titleHi: "आंतों के स्वास्थ्य की रक्षा", desc: "Nourishes healthy gut flora and protects colon health against harmful toxins.", descHi: "आंतों के अच्छे बैक्टीरिया को पोषण देकर पाचन तंत्र मजबूत करता है।" },
        { icon: "🧘", title: "Smooth Bowel Regularity", titleHi: "सहज शौच क्रिया", desc: "Promotes comfortable daily bowel movements without cramps or laxative habituation.", descHi: "बिना किसी आदत या मरोड़ के रोज सुबह आरामदायक पेट साफ करता है।" },
      ],
      clinicalStats: [
        { percentage: 96, label: "Users reported instant relief from gas & acidity within 7 days", labelHi: "7 दिनों में गैस और एसिडिटी से तुरंत राहत महसूस की" },
        { percentage: 93, label: "Experienced improved daily appetite and metabolism", labelHi: "दैनिक भूख और मेटाबॉलिज्म में सुधार देखा" },
        { percentage: 90, label: "Noticed significant reduction in post-meal bloating", labelHi: "भोजन के बाद पेट फूलने की समस्या में भारी कमी पाई" },
      ],
      ingredients: [
        { name: "Triphala Extract", desc: "Classic 3-fruit Ayurvedic formula that gently cleanses the colon and restores digestion.", image: "/digestion.png" },
      ],
      steps: [
        { step: 1, title: "Take 1 Dose 30 Mins After Meals", titleHi: "भोजन के 30 मिनट बाद 1 खुराक लें", desc: "Take 1 scoop or capsule 30 minutes after heavy meals or when feeling gas/heaviness.", descHi: "भारी भोजन के 30 मिनट बाद या गैस महसूस होने पर 1 कैप्सूल लें।" },
        { step: 2, title: "Consume with Lukewarm Water", titleHi: "गुनगुने पानी के साथ पिएं", desc: "Lukewarm water activates Triphala and Ajwain enzymes for immediate acid neutralization.", descHi: "गुनगुना पानी त्रिफला और अजवाइन के असर को तेज कर एसिड शांत करता है।" },
        { step: 3, title: "Enjoy Light & Calm Digestion", titleHi: "हल्के व शांत पेट का अनुभव करें", desc: "Rapidly relieves trapped gas, acid reflux, bloating, and promotes regular morning bowel habits.", descHi: "गैस, खट्टी डकारें और भारीपन तुरंत दूर होकर पेट हल्का रहेगा।" },
      ],
      faqs: [
        { question: `Does ${productName} help with chronic acidity and gas?`, questionHi: `क्या ${productName} पुरानी गैस और एसिडिटी में मदद करता है?`, answer: `${productName} is formulated with Triphala and Ajwain that neutralize excess stomach acid and reduce gas buildup.`, answerHi: `${productName} में त्रिफला और अजवाइन का योग है जो पेट के अतिरिक्त एसिड को शांत कर गैस का निवारण करता है।` },
        { question: "Is it safe for daily long-term use?", questionHi: "क्या यह रोजाना लंबे समय तक लेने के लिए सुरक्षित है?", answer: "Yes! It is 100% natural, non-habit-forming, and free from synthetic laxatives.", answerHi: "हाँ! यह 100% प्राकृतिक है, इसकी कोई आदत नहीं पड़ती और इसमें कोई केमिकल नहीं है।" },
      ],
      reviews: [
        { name: "Ramesh P.", location: "Delhi", locationHi: "दिल्ली", rating: 5, date: "3 days ago", dateHi: "3 दिन पहले", comment: `Within 5 days of using ${productName}, my gut feels completely light and comfortable!`, commentHi: "5 दिनों में पेट की सारी गैस और भारीपन खत्म हो गया। बहुत आरामदायक महसूस हो रहा है।" },
        { name: "Sunita M.", location: "Pune", locationHi: "पुणे", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Very effective natural formula. No side effects, just pure digestion relief.", commentHi: "बहुत प्रभावी प्राकृतिक फॉर्मूला। बिना किसी साइड इफेक्ट के शुद्ध राहत।" },
        { name: "Jagdish Prasad", location: "Varanasi", locationHi: "वाराणसी", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Cured my 2-year-old chronic acid reflux. No more sour burps or chest burning.", commentHi: "2 साल पुरानी एसिडिटी और खट्टी डकारों की समस्या हमेशा के लिए खत्म हो गई।" },
        { name: "Kavita Nair", location: "Kochi", locationHi: "कोच्चि", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Triphala and Ajwain work wonders for post-dinner bloating and indigestion.", commentHi: "रात के खाने के बाद पेट फूलने और बदहजमी के लिए अद्भुत असरदार योग।" },
        { name: "Mohit Goel", location: "Ghaziabad", locationHi: "गाजियाबाद", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Non-habit forming and natural. Morning stomach clearance is completely effortless.", commentHi: "इसकी कोई आदत नहीं पड़ती, रोज सुबह आसानी से पेट साफ हो जाता है।" },
        { name: "Anjali Saxena", location: "Noida", locationHi: "नोएडा", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Light, refreshing and fast-acting. My entire family uses it for digestive comfort.", commentHi: "हल्का, ताज़ा और तुरंत असर करने वाला। पूरा परिवार इसका उपयोग करता है।" },
      ],
    };
  }

  // 7. FITNESS & BODYBUILDING SPECIALIZED CONTENT
  if (cat.includes("fitness") || cat.includes("health & fitness") || prod.includes("mass") || prod.includes("muscle") || prod.includes("protein")) {
    return {
      benefitHeadline: "Anabolic Strength, Muscle Mass & Workout Recovery",
      benefitHeadlineHi: "प्राकृतिक मांसपेशी शक्ति, मास और वर्कआउट रिकवरी",
      benefitSubtitle: "Standardized Ashwagandha KSM-66, Shatavari, Vidarikand, and Kaunch Beej for clean muscle tone and stamina.",
      benefitSubtitleHi: "अश्वगंधा KSM-66, शतावरी, विदारीकंद और कौंच बीज युक्त प्राकृतिक एनाबॉलिक योग।",
      suitableFor: "Athletes, gym-goers, and fitness enthusiasts looking to gain clean muscle strength, stamina, and accelerate recovery without synthetic chemicals.",
      suitableForHi: "बिना किसी केमिकल या स्टेरॉयड के प्राकृतिक वजन, ताकत और बॉडीबिल्डिंग स्टैमिना चाहने वालों के लिए।",
      bullets: [
        "Ashwagandha KSM-66, Shatavari, Vidarikand & Kaunch Beej",
        "Promotes Clean Muscle Gain, Physical Power & Endurance",
        "Accelerates Workout Recovery & Lowers Cortisol Fatigue",
        "100% Natural Ayurvedic Supplement • Zero Chemical Steroids",
      ],
      bulletsHi: [
        "अश्वगंधा KSM-66, शतावरी, विदारीकंद और कौंच बीज",
        "लीन मसल मास, शारीरिक शक्ति और वर्कआउट स्टैमिना में वृद्धि",
        "कसरत के बाद की थकान और कॉर्टिसोल कम कर त्वरित रिकवरी",
        "100% प्राकृतिक सप्लीमेंट • शून्य हानिकारक रसायन",
      ],
      fullComposition: [
        { name: "Ashwagandha KSM-66", botanical: "Withania somnifera", amount: "300 mg" },
        { name: "Shatavari Ext.", botanical: "Asparagus racemosus", amount: "150 mg" },
        { name: "Vidarikand", botanical: "Pueraria tuberosa", amount: "100 mg" },
        { name: "Kaunch Beej", botanical: "Mucuna pruriens", amount: "100 mg" },
        { name: "Gokshura", botanical: "Tribulus terrestris", amount: "50 mg" },
      ],
      visualBenefits: [
        { title: "Boost Muscle Power", titleHi: "मांसपेशियों की शक्ति बढ़ाए", desc: "Nourishes muscle tissue (Mamsa Dhatu) for sustained gym strength and stamina.", descHi: "मांस धातु को पोषण देकर जिम वर्कआउट में ताकत और सहनशक्ति बढ़ाता है।", image: "/benefits/benefit_stamina.jpg" },
        { title: "Accelerate Recovery", titleHi: "त्वरित रिकवरी", desc: "Reduces post-workout muscle soreness and restores physical stamina rapidly.", descHi: "कसरत के बाद मांसपेशियों के दर्द को कम कर तेजी से ऊर्जा लौटाता है।", image: "/benefits/benefit_stress.jpg" },
        { title: "Clean Anabolic Gains", titleHi: "प्राकृतिक मसल गेन", desc: "Enhances nutrient and protein assimilation for natural, lean muscle growth.", descHi: "प्रोटीन और पोषक तत्वों के अवशोषण को बढ़ाकर प्राकृतिक रूप से वजन बढ़ाता है।", image: "/benefits/benefit_muscle.jpg" },
      ],
      benefits: [
        { icon: "⚡", title: "Anabolic Muscle Growth", titleHi: "प्राकृतिक मांसपेशी विकास", desc: "Nourishes muscle tissue (Mamsa Dhatu) for clean strength gain and stamina.", descHi: "शरीर को प्राकृतिक रूप से पुष्ट कर मांसपेशियों की ताकत बढ़ाता है।" },
        { icon: "🛡️", title: "Nutrient & Protein Synthesis", titleHi: "प्रोटीन अवशोषण में वृद्धि", desc: "Enhances metabolic absorption so your body utilizes maximum workout nutrition.", descHi: "भोजन और प्रोटीन के अवशोषण को अधिकतम करता है।" },
        { icon: "🌿", title: "Natural Fitness Energy", titleHi: "प्राकृतिक ऊर्जा व स्फूर्ति", desc: "Sustained cellular vigor for intense gym workouts without synthetic stimulants.", descHi: "बिना किसी कैफीन या उत्तेजक के प्राकृतिक वर्कआउट ऊर्जा देता है।" },
        { icon: "🧘", title: "Faster Workout Recovery", titleHi: "तेजी से थकान दूर करे", desc: "Reduces post-workout muscle soreness and restores physical stamina rapidly.", descHi: "कसरत की थकान और मांसपेशियों के खिंचाव को जल्दी शांत करता है।" },
      ],
      clinicalStats: [
        { percentage: 98, label: "Users noticed increased workout stamina & energy in 14 days", labelHi: "14 दिनों में वर्कआउट स्टैमिना और ऊर्जा में वृद्धि देखी" },
        { percentage: 95, label: "Reported healthy muscle strength & weight progress", labelHi: "मांसपेशियों की ताकत और स्वस्थ वजन में प्रगति पाई" },
        { percentage: 92, label: "Experienced faster recovery between intense training sessions", labelHi: "कठिन वर्कआउट के बाद जल्दी रिकवरी का अनुभव किया" },
      ],
      ingredients: [
        { name: "Ashwagandha KSM-66", desc: "Standardized root extract that boosts physical strength, muscle mass, and lowers cortisol.", image: "https://thursd.com/storage/media/91424/the-roots-and-the-leaves-of-the-ashwagandha-plant.jpg" },
      ],
      steps: [
        { step: 1, title: "Take 1 Scoop or 2 Capsules", titleHi: "1-2 कैप्सूल या चम्मच लें", desc: "Mix with 250ml warm milk or water after workout or breakfast.", descHi: "वर्कआउट के बाद या नाश्ते के बाद गर्म दूध के साथ लें।" },
        { step: 2, title: "Pair with High-Nutrient Diet", titleHi: "पौष्टिक आहार के साथ लें", desc: "Combine with protein-rich food and daily physical activity.", descHi: "प्रोटीन युक्त संतुलित भोजन और कसरत के साथ लें।" },
        { step: 3, title: "Achieve Peak Fitness & Muscle Strength", titleHi: "उत्कृष्ट फिटनेस व ताकत पाएं", desc: "Noticeable strength gains, stamina, and healthy body composition.", descHi: "प्राकृतिक रूप से मजबूत शरीर और उच्च स्टैमिना हासिल करें।" },
      ],
      faqs: [
        { question: `Does ${productName} contain any chemical steroids?`, questionHi: `क्या ${productName} में कोई केमिकल स्टेरॉयड है?`, answer: `No! ${productName} is 100% natural Ayurvedic formula with zero synthetic steroids, heavy metals, or banned substances.`, answerHi: `बिल्कुल नहीं! यह 100% शुद्ध प्राकृतिक आयुर्वेदिक योग है जिसमें कोई स्टेरॉयड या प्रतिबंधित तत्व नहीं हैं।` },
      ],
      reviews: [
        { name: "Aman V.", location: "Chandigarh", locationHi: "चंडीगढ़", rating: 5, date: "4 days ago", dateHi: "4 दिन पहले", comment: `Gained clean muscle weight in 1 month with ${productName} without any digestive issues.`, commentHi: "1 महीने में प्राकृतिक वजन और ताकत में गजब का इजाफा हुआ, कोई पेट की खराबी नहीं हुई।" },
        { name: "Rohit Bhati", location: "Gurugram", locationHi: "गुरुग्राम", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Gym stamina and bench press strength increased significantly in 3 weeks.", commentHi: "जिम में स्टैमिना और बेंच प्रेस की ताकत में 3 हफ्तों में उल्लेखनीय बढ़ोतरी हुई।" },
        { name: "Sandeep Yadav", location: "Meerut", locationHi: "मेरठ", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Ashwagandha KSM-66 gives steady muscle pump and zero chemical crash.", commentHi: "अश्वगंधा KSM-66 से बेहतरीन मसल पंप मिलता है और कोई साइड इफेक्ट नहीं होता।" },
        { name: "Vikas Rathore", location: "Indore", locationHi: "इंदौर", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Helped me gain 3kg healthy lean mass when paired with banana shake diet.", commentHi: "केले के शेक के साथ लेने से 3 किलो स्वस्थ वजन बढ़ाने में मदद मिली।" },
        { name: "Karan Singhania", location: "Delhi", locationHi: "दिल्ली", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Muscle soreness vanishes by next morning. Excellent natural recovery formula.", commentHi: "अगली सुबह तक वर्कआउट का सारा दर्द गायब हो जाता है। बहुत बढ़िया रिकवरी।" },
        { name: "Harsh Vardhan", location: "Lucknow", locationHi: "लखनऊ", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "100% steroid free Ayurvedic muscle builder. Highly effective for lean gains.", commentHi: "100% स्टेरॉयड मुक्त आयुर्वेदिक मसल बिल्डर। प्राकृतिक ताकत के लिए सर्वश्रेष्ठ।" },
      ],
    };
  }

  // 8. JOINT CARE / HEALTH DISEASE SPECIALIZED CONTENT
  if (cat.includes("disease") || cat.includes("health disease") || prod.includes("joint") || prod.includes("ortho") || prod.includes("pain")) {
    return {
      benefitHeadline: "Targeted Cartilage Lubrication & Joint Mobility",
      benefitHeadlineHi: "कार्टिलेज पोषण एवं जोड़ों की गतिशीलता योग",
      benefitSubtitle: "Shallaki (Boswellia), Nirgundi, and Purified Guggulu to soothe joint inflammation, stiffness, and restore smooth movement.",
      benefitSubtitleHi: "शल्लकी (बोसवेलिया), निर्गुंडी और शुद्ध गुग्गुल से युक्त जोड़ों की सूजन व अकड़न नाशक योग।",
      suitableFor: "Adults and seniors suffering from knee pain, joint stiffness, arthritis, morning swelling, and reduced physical mobility.",
      suitableForHi: "जोड़ों के दर्द, गठिया, सूजन और चलने-फिरने में परेशानी का सामना करने वाले वयस्कों व बुजुर्गों के लिए।",
      bullets: [
        "Standardized Shallaki (Boswellia), Nirgundi & Purified Guggulu",
        "Targets Joint Inflammation, Morning Stiffness & Swelling",
        "Nourishes Cartilage & Enhances Daily Walking Flexibility",
        "100% Pure Ayurvedic Formulation • AYUSH & Lab Certified",
      ],
      bulletsHi: [
        "मानकीकृत शल्लकी (बोसवेलिया), निर्गुंडी और शुद्ध गुग्गुल",
        "जोड़ों की सूजन, सुबह की अकड़न और दर्द में प्रभावी",
        "कार्टिलेज को पोषण देकर प्राकृतिक लचीलापन और चिकनाई लौटाए",
        "100% शुद्ध आयुर्वेदिक योग • आयुष व लैब प्रमाणित",
      ],
      fullComposition: [
        { name: "Shallaki Ext.", botanical: "Boswellia serrata", amount: "300 mg" },
        { name: "Nirgundi Ext.", botanical: "Vitex negundo", amount: "150 mg" },
        { name: "Purified Guggulu", botanical: "Commiphora mukul", amount: "100 mg" },
        { name: "Hadjod", botanical: "Cissus quadrangularis", amount: "100 mg" },
        { name: "Ashwagandha", botanical: "Withania somnifera", amount: "50 mg" },
      ],
      visualBenefits: [
        { title: "Relieve Joint Pain", titleHi: "जोड़ों का दर्द दूर करे", desc: "Potent anti-inflammatory Shallaki protects joint cartilage and soothes aching knees.", descHi: "शल्लकी जोड़ों के कार्टिलेज की रक्षा कर घुटनों के दर्द में राहत देती है।", image: "/benefits/benefit_stamina.jpg" },
        { title: "Reduce Morning Stiffness", titleHi: "सुबह की अकड़न घटाए", desc: "Nirgundi and Guggulu clear inflammatory toxins to restore joint flexibility.", descHi: "निर्गुंडी और गुग्गुल सूजन पैदा करने वाले टॉक्सिन्स को साफ कर लचीलापन लौटाते हैं।", image: "/benefits/benefit_stress.jpg" },
        { title: "Strengthen Bone & Cartilage", titleHi: "हड्डियों व कार्टिलेज को मजबूती", desc: "Hadjod promotes bone mineral density and accelerates structural tissue repair.", descHi: "हड़जोड़ हड्डियों के घनत्व को बढ़ाकर जोड़ों को मजबूत करता है।", image: "/benefits/benefit_muscle.jpg" },
      ],
      benefits: [
        { icon: "🛡️", title: "Targeted Joint & Organ Relief", titleHi: "जोड़ों के दर्द में राहत", desc: "Soothes systemic inflammation, joint stiffness, and chronic bodily discomfort.", descHi: "जोड़ों की सूजन और शरीर की पुरानी जकड़न को शांत करता है।" },
        { icon: "🌿", title: "Ayurvedic Cellular Protection", titleHi: "कोशिकीय सुरक्षा", desc: "Antioxidant-rich herbs defend vital tissues against oxidative stress and wear.", descHi: "एंटीऑक्सीडेंट युक्त जड़ी-बूटियां कार्टिलेज के घिसने को रोकती हैं।" },
        { icon: "⚡", title: "Restores Daily Mobility", titleHi: "सहज गतिशीलता लौटाए", desc: "Promotes joint flexibility, cartilage lubrication, and ease of physical movement.", descHi: "जोड़ों में चिकनाई बनाए रखकर चलने-फिरने को आसान बनाता है।" },
        { icon: "🧘", title: "Improves Quality of Life", titleHi: "सक्रिय जीवनशैली", desc: "Reduces daily aches, morning stiffness, and chronic fatigue for active living.", descHi: "दैनिक दर्द और सुबह की अकड़न दूर कर सक्रिय जीवन प्रदान करता है।" },
      ],
      clinicalStats: [
        { percentage: 96, label: "Users experienced significant joint & pain relief in 14 days", labelHi: "14 दिनों में जोड़ों के दर्द और सूजन में भारी राहत पाई" },
        { percentage: 93, label: "Noticed reduced morning stiffness & swelling", labelHi: "सुबह की अकड़न और सूजन में उल्लेखनीय कमी देखी" },
        { percentage: 90, label: "Reported improved daily walking mobility & flexibility", labelHi: "चलने-फिरने और सीढ़ियां चढ़ने में आसानी महसूस की" },
      ],
      ingredients: [
        { name: "Shallaki (Boswellia)", desc: "Potent anti-inflammatory herb that protects joint cartilage and reduces pain.", image: "/healthdisease.png" },
      ],
      steps: [
        { step: 1, title: "Take 1-2 Capsules Twice Daily", titleHi: "दिन में 1-2 कैप्सूल लें", desc: "Consume after breakfast and dinner with lukewarm water.", descHi: "सुबह नाश्ते और रात के खाने के बाद गुनगुने पानी के साथ लें।" },
        { step: 2, title: "Keep a 30-Min Gap from Allopathy", titleHi: "अन्य दवाओं से 30 मिनट का अंतर रखें", desc: "Maintains optimal herb absorption without interference.", descHi: "जड़ी-बूटियों के सर्वोत्तम अवशोषण के लिए 30 मिनट का अंतर रखें।" },
        { step: 3, title: "Experience Pain-Free Daily Mobility", titleHi: "दर्द रहित गतिशीलता का अनुभव करें", desc: "Sustained joint comfort, flexible movement, and active daily life.", descHi: "लंबे समय तक जोड़ों के आराम और स्वतंत्र चाल-चलन का आनंद लें।" },
      ],
      faqs: [
        { question: `How does ${productName} help with joint stiffness and pain?`, questionHi: `${productName} जोड़ों के दर्द और अकड़न में कैसे मदद करता है?`, answer: `${productName} contains Shallaki and Nirgundi extracts that target joint inflammation and lubricate cartilage.`, answerHi: `${productName} में शल्लकी और निर्गुंडी का सत्व है जो सूजन कम कर जोड़ों को चिकनाई प्रदान करता है।` },
      ],
      reviews: [
        { name: "Gurpreet K.", location: "Ludhiana", locationHi: "लुधियाना", rating: 5, date: "5 days ago", dateHi: "5 दिन पहले", comment: `My knee pain and morning stiffness have reduced significantly after using ${productName}.`, commentHi: "घुटनों का दर्द और सुबह की अकड़न बहुत कम हो गई है, अब मैं आसानी से सीढ़ियां चढ़ पाती हूँ!" },
        { name: "Mohanlal Soni", location: "Jaipur", locationHi: "जयपुर", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Shallaki and Guggulu formula relieved my chronic arthritis swelling in 2 weeks.", commentHi: "शल्लकी और गुग्गुल के फॉर्मूले ने गठिया की सूजन में 2 हफ्तों में बड़ा आराम दिया।" },
        { name: "Usha Shrivastava", location: "Bhopal", locationHi: "भोपाल", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Can do daily morning walks again without knee cracking sounds or pain.", commentHi: "अब घुटनों में बिना कट-कट आवाज और दर्द के रोज सुबह टहल पाती हूँ।" },
        { name: "Ramakant Dwivedi", location: "Prayagraj", locationHi: "प्रयागराज", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Lubricated joint cartilage naturally. Very effective Ayurvedic treatment.", commentHi: "जोड़ों की ग्रीस और लचीलापन वापस लौट आया। बहुत असरदार दवा।" },
        { name: "Jaswant Singh", location: "Amritsar", locationHi: "अमृतसर", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Relieved lower back stiffness and hip joint pain in 15 days.", commentHi: "कमर और कूल्हे के जोड़ों की जकड़न 15 दिनों में खत्म हो गई।" },
        { name: "Nirmala Ben", location: "Surat", locationHi: "सूरत", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Doctor recommended painkillers were causing acidity, this herbal medicine healed my joints safely.", commentHi: "पेनकिलर से एसिडिटी होती थी, इस आयुर्वेदिक दवा ने जोड़ों को सुरक्षित ठीक किया।" },
      ],
    };
  }

  // 9. DEFAULT / GENERAL AYURVEDIC WELLNESS (FOR ALL OTHER PRODUCTS)
  return {
    benefitHeadline: "Time-Tested Ayurvedic Vitality & Wellness",
    benefitHeadlineHi: "समय-सिद्ध आयुर्वेदिक वाइटलिटी एवं समग्र स्वास्थ्य",
    benefitSubtitle: "Scientifically standardized botanical herbs crafted for sustained stamina, focus, and holistic health.",
    benefitSubtitleHi: "वैज्ञानिक रूप से मानकीकृत जड़ी-बूटियों से निर्मित निरंतर स्टैमिना और स्वास्थ्य योग।",
    suitableFor: "Adults seeking pure, authentic Ayurvedic support to balance bodily doshas, boost immunity, and promote holistic wellness.",
    suitableForHi: "त्रिदोष संतुलन, रोग प्रतिरोधक क्षमता वृद्धि और समग्र स्वास्थ्य लाभ चाहने वाले वयस्कों के लिए।",
    bullets: [
      "100% Pure Standardized Ayurvedic Botanical Extracts",
      "Enhances Daily Physical Endurance, Vitality & Cellular Vigor",
      "Nourishes Deep Bodily Tissues & Balances Bodily Doshas",
      "100% Pure Ayurvedic Formulation • AYUSH & Lab Certified",
    ],
    bulletsHi: [
      "100% शुद्ध मानकीकृत आयुर्वेदिक पादप सत्व",
      "दैनिक शारीरिक सहनशक्ति, ऊर्जा और स्फूर्ति में वृद्धि",
      "गहरे शारीरिक ऊतकों का पोषण और त्रिदोष संतुलन",
      "100% शुद्ध आयुर्वेदिक योग • आयुष व लैब प्रमाणित",
    ],
    fullComposition: [
      { name: "Standardized Ayurvedic Botanical Extracts", botanical: "Ayurvedic Pharmacopoeia Standard", amount: "100% Pure Active" },
    ],
    visualBenefits: [
      { title: "Boost Daily Stamina", titleHi: "दैनिक स्टैमिना बढ़ाए", desc: "Purified herbal actives help elevate endurance, strength, and overall vitality naturally.", descHi: "शुद्ध जड़ी-बूटियों के सक्रिय घटक सहनशक्ति और शक्ति को प्राकृतिक रूप से बढ़ाते हैं।", image: "/benefits/benefit_stamina.jpg" },
      { title: "Soothe Daily Stress", titleHi: "दैनिक तनाव शांत करे", desc: "Adaptogenic herbs lower cortisol, calming mind and body without inducing drowsiness.", descHi: "अडाप्टोजेनिक औषधियां कॉर्टिसोल घटाकर मन और शरीर को शांत रखती हैं।", image: "/benefits/benefit_stress.jpg" },
      { title: "Enhance Physical Vitality", titleHi: "शारीरिक ऊर्जा में सुधार", desc: "Accelerates cellular recovery, tissue nourishment, and long-term health balance.", descHi: "ऊतकों के पोषण और सेलुलर रिकवरी को तेज कर स्वास्थ्य संतुलन बनाए रखता है।", image: "/benefits/benefit_muscle.jpg" },
    ],
    benefits: [
      { icon: "🌿", title: "100% Ayurvedic Formula", titleHi: "100% आयुर्वेदिक योग", desc: "Time-honored classical Ayurvedic herbal formulation prepared under strict GMP standards.", descHi: "कड़े जीएमपी मानकों के तहत तैयार प्राचीन शास्त्रीय आयुर्वेदिक फॉर्मूला।" },
      { icon: "⚡", title: "Boosts Stamina & Energy", titleHi: "स्टैमिना व ऊर्जा में वृद्धि", desc: "Enhances cellular mitochondrial energy and stamina for active daily living.", descHi: "सेलुलर ऊर्जा को बढ़ाकर दिनभर सक्रिय रहने की क्षमता प्रदान करता है।" },
      { icon: "🛡️", title: "Doctor Trusted & Safe", titleHi: "वैद्यों द्वारा प्रमाणित व सुरक्षित", desc: "Lab certified for heavy metals and purity with zero synthetic chemicals or preservatives.", descHi: "बिना किसी कृत्रिम रसायन के शुद्धता व हेवी मेटल्स के लिए प्रमाणित।" },
      { icon: "🧘", title: "Holistic Health Balance", titleHi: "समग्र स्वास्थ्य संतुलन", desc: "Restores harmony between Vata, Pitta, and Kapha doshas for long-term health.", descHi: "वात, पित्त और कफ दोषों में सामंजस्य स्थापित कर स्वस्थ रखता है।" },
    ],
    clinicalStats: [
      { percentage: 98, label: "Reported noticeable improvement in overall vitality within 14 days", labelHi: "14 दिनों में समग्र ऊर्जा और स्फूर्ति में उल्लेखनीय सुधार महसूस किया" },
      { percentage: 95, label: "Felt enhanced energy and reduced daily fatigue", labelHi: "दैनिक थकान में कमी और बढ़ी हुई ऊर्जा का अनुभव किया" },
      { percentage: 92, label: "Experienced improved daily focus and physical endurance", labelHi: "मानसिक एकाग्रता और शारीरिक सहनशक्ति में सुधार देखा" },
    ],
    ingredients: [
      { name: "Purified Classical Herbs", desc: "Standardized botanical extracts chosen for maximum bioavailability and therapeutic potency.", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80" },
    ],
    steps: [
      { step: 1, title: "Take Recommended Dose", titleHi: "सलाह अनुसार खुराक लें", desc: "Take the prescribed quantity as indicated on the label or as advised by your physician.", descHi: "लेबल पर दिए गए निर्देश या चिकित्सक की सलाह अनुसार मात्रा लें।" },
      { step: 2, title: "Consume with Warm Water or Milk", titleHi: "गुनगुने पानी या दूध के साथ लें", desc: "Drink with lukewarm water or milk after meals for optimal digestive assimilation.", descHi: "भोजन के बाद गुनगुने पानी या दूध के साथ सेवन करें।" },
      { step: 3, title: "Follow Regularly for 60-90 Days", titleHi: "60-90 दिनों तक नियमित लें", desc: "Consistent daily usage provides long-lasting Ayurvedic rejuvenation and balance.", descHi: "स्थायी स्वास्थ्य लाभ और कायाकल्प के लिए नियमित दिनचर्या बनाए रखें।" },
    ],
    faqs: [
      { question: `How does ${productName} work?`, questionHi: `${productName} कैसे कार्य करता है?`, answer: `${productName} utilizes standardized Ayurvedic herbs that work in synergy to rejuvenate bodily tissues and support long-term wellness.`, answerHi: `${productName} में मानकीकृत जड़ी-बूटियां हैं जो शारीरिक ऊतकों को पुनर्जीवित कर दीर्घकालिक स्वास्थ्य प्रदान करती हैं।` },
      { question: "Is it safe for daily long-term use?", questionHi: "क्या यह दैनिक उपयोग के लिए सुरक्षित है?", answer: "Yes! It is 100% natural, chemical-free, non-habit forming, and batch-tested for heavy metals and purity.", answerHi: "हाँ! यह 100% प्राकृतिक, रसायन मुक्त, गैर-आदत बनाने वाला और लैब प्रमाणित है।" },
    ],
    reviews: [
      { name: "Rajesh Sharma", location: "Delhi", locationHi: "दिल्ली", rating: 5, date: "2 days ago", dateHi: "2 दिन पहले", comment: "Exceptional quality! Noticeable improvement in daily energy and well-being within a week.", commentHi: "उत्कृष्ट गुणवत्ता! एक सप्ताह के भीतर ऊर्जा और स्वास्थ्य में उल्लेखनीय सुधार हुआ।" },
      { name: "Suman Lata", location: "Faridabad", locationHi: "फरीदाबाद", rating: 5, date: "5 days ago", dateHi: "5 दिन पहले", comment: "100% pure authentic Ayurvedic ingredients. Feel very active and refreshed.", commentHi: "100% शुद्ध आयुर्वेदिक घटक। दिनभर ताजगी और स्फूर्ति महसूस होती है।" },
      { name: "Anand Swaroop", location: "Kanpur", locationHi: "कानपुर", rating: 5, date: "1 week ago", dateHi: "1 सप्ताह पहले", comment: "Great for balancing immunity and daily metabolism without any side effects.", commentHi: "बिना किसी दुष्प्रभाव के रोग प्रतिरोधक क्षमता और पाचन शक्ति बढ़ाने के लिए उत्तम।" },
      { name: "Priya Mukherjee", location: "Kolkata", locationHi: "कोलकाता", rating: 5, date: "2 weeks ago", dateHi: "2 सप्ताह पहले", comment: "Packaging was premium and product efficacy is top notch. Very satisfied.", commentHi: "पैकेजिंग बहुत अच्छी थी और उत्पाद का असर बहुत शानदार है।" },
      { name: "Naresh Kothari", location: "Udaipur", locationHi: "उदयपुर", rating: 5, date: "3 weeks ago", dateHi: "3 सप्ताह पहले", comment: "Doctor trusted formulation. Boosted whole family's general vitality.", commentHi: "वैद्यों द्वारा अनुशंसित योग। पूरे परिवार की सेहत और ऊर्जा में सुधार हुआ।" },
      { name: "Hemant Choudhary", location: "Patna", locationHi: "पटना", rating: 5, date: "1 month ago", dateHi: "1 महीना पहले", comment: "Ayurveda at its purest. High potency herbs made a huge difference to my health.", commentHi: "आयुर्वेद का सबसे शुद्ध रूप। शक्तिशाली जड़ी-बूटियों ने स्वास्थ्य में बड़ा बदलाव लाया।" },
    ],
  };
}

export default function SingleProduct({
  id,
  initialProduct,
}: {
  id: string;
  initialProduct?: any;
}) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { data: session } = useSession();

  const translateText = (en?: string, hi?: string) =>
    language === "hi" && hi ? hi : en || "";

  // ---------------- QUERY: Single Product Details ----------------
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getproductdetails(id),
    initialData: initialProduct,
    staleTime: 5 * 60 * 1000,
  });

  // ---------------- QUERY: Related / Similar Products ----------------
  const { data: relatedProducts = [], isLoading: relatedLoading } = useQuery({
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

  const selectedImage = getOptimizedImageUrl(
    product?.galleryImages?.[0] || initialProduct?.galleryImages?.[0],
    { width: 1000 }
  );

  // ---------------- STATES ----------------
  const [activeImage, setActiveImage] = useState<string>(
    initialProduct?.galleryImages?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [addingRelatedId, setAddingRelatedId] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    // Instantly snap to the absolute top on page load / product switch
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [id]);

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
    setPincodeMsg(`FREE Express Delivery by ${dateStr} (In Stock)`);
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

  const handleAddRelatedToCart = async (relatedProduct: any) => {
    const rId = relatedProduct.id || relatedProduct._id;
    setAddingRelatedId(rId);
    try {
      const response = await axios.post("/api/cart/addtocart", {
        productId: rId,
        quantity: 1,
      });

      if (response.data.success) {
        toast.success(`${translateText(relatedProduct.name, relatedProduct.nameHi)} added to cart!`);
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      toast.error("Error adding to cart");
    } finally {
      setAddingRelatedId(null);
    }
  };

  if (isLoading || !product) {
    return <SingleProductSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600 font-medium">Failed to load product details</p>
      </div>
    );
  }

  const rating = 4.9;
  const reviewCount = 238;
  const basePrice = product.discountPrice ?? product.price;
  const originalPrice = product.price;
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const savingAmount = product.discountPrice
    ? product.price - product.discountPrice
    : 300;

  // Dynamic Category & Product Content
  const categoryRichData = getCategoryRichContent(product.category, product.name);

  const visualBenefitsList = (categoryRichData.visualBenefits || []).map((b: any) => ({
    title: language === "hi" && b.titleHi ? b.titleHi : b.title,
    desc: language === "hi" && b.descHi ? b.descHi : b.desc,
    image: b.image,
  }));

  const rawBullets = (product.bullets && product.bullets.length > 0)
    ? (language === "hi" && product.bulletsHi ? product.bulletsHi : product.bullets)
    : (language === "hi" && categoryRichData.bulletsHi ? categoryRichData.bulletsHi : categoryRichData.bullets);
  const bulletsList = rawBullets || [
    language === "hi" ? "100% शुद्ध मानकीकृत आयुर्वेदिक पादप सत्व" : "100% Pure Standardized Ayurvedic Botanical Extracts",
    language === "hi" ? "दैनिक शारीरिक सहनशक्ति, ऊर्जा और स्फूर्ति में वृद्धि" : "Enhances Daily Physical Endurance, Vitality & Cellular Vigor",
    language === "hi" ? "गहरे शारीरिक ऊतकों का पोषण और त्रिदोष संतुलन" : "Nourishes Deep Bodily Tissues & Balances Bodily Doshas",
    language === "hi" ? "100% शुद्ध आयुर्वेदिक योग • आयुष व लैब प्रमाणित" : "100% Pure Ayurvedic Formulation • AYUSH & Lab Certified",
  ];

  const ingredientsList = (product.keyIngredients && product.keyIngredients.length > 0) ? product.keyIngredients : (categoryRichData.ingredients || []);
  const fullCompositionList = (product.fullComposition && product.fullComposition.length > 0) ? product.fullComposition : categoryRichData.fullComposition;

  const howToUseList = (product.howToUseSteps && product.howToUseSteps.length > 0)
    ? product.howToUseSteps
    : (categoryRichData.steps || []).map((s: any) => ({
        step: s.step,
        title: language === "hi" && s.titleHi ? s.titleHi : s.title,
        desc: language === "hi" && s.descHi ? s.descHi : s.desc,
      }));

  const faqsList = (product.faqs && product.faqs.length > 0)
    ? product.faqs
    : (categoryRichData.faqs || []).map((f: any) => ({
        question: language === "hi" && f.questionHi ? f.questionHi : f.question,
        answer: language === "hi" && f.answerHi ? f.answerHi : f.answer,
      }));

  const reviewsList = (categoryRichData.reviews || []).map((r: any) => ({
    name: r.name,
    location: language === "hi" && r.locationHi ? r.locationHi : r.location,
    rating: r.rating,
    date: language === "hi" && r.dateHi ? r.dateHi : r.date,
    comment: language === "hi" && r.commentHi ? r.commentHi : r.comment,
  }));

  const suitableForText = language === "hi"
    ? (categoryRichData.suitableForHi || product.suitableForHi || product.suitableFor || categoryRichData.suitableFor)
    : (product.suitableFor || categoryRichData.suitableFor);

  const dynamicSubtitle = language === "hi"
    ? (product.titleHi || categoryRichData.benefitSubtitleHi || categoryRichData.benefitSubtitle || product.title)
    : (product.title || categoryRichData.benefitSubtitle);

  const packOptions = [
    { name: t("Single Pack (1 Bottle)"), price: basePrice, origPrice: originalPrice, isPopular: false, tag: "Standard" },
    { name: t("Pack of 2 (SAVE EXTRA 10%)"), price: Math.round(basePrice * 2 * 0.9), origPrice: originalPrice * 2, isPopular: true, tag: "Most Popular" },
  ];

  const currentPack = packOptions[selectedPack] || packOptions[0];

  return (
    <div className="min-h-screen bg-stone-50/70 font-sans text-stone-900 pb-28 md:pb-20">
      
      {/* ---------------- 1. TOP BREADCRUMB ---------------- */}
      <div className="border-b border-stone-200/80 bg-white/95 backdrop-blur-xs sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link href="/" className="hover:text-emerald-800 transition-colors">{t("Home")}</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-emerald-800 transition-colors uppercase">{t(product.category)}</Link>
            <span>/</span>
            <span className="text-stone-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {translateText(product.name, product.nameHi)}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- 2. MAIN PRODUCT HERO SECTION ---------------- */}
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 2xl:gap-16 items-start">
          
          {/* Left Column: Gallery & Images (6 cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-3.5 2xl:gap-5 items-start w-full lg:sticky lg:top-20">
            {/* Gallery Thumbnails */}
            <div className="flex md:flex-col gap-2.5 2xl:gap-3.5 overflow-x-auto md:overflow-y-auto max-w-full md:max-h-[540px] 2xl:max-h-[720px] md:w-20 2xl:w-24 shrink-0 pb-2 md:pb-0 scrollbar-none">
              {(product.galleryImages.length > 0 ? product.galleryImages : [selectedImage]).map((img: string, i: number) => {
                const isSelected = (activeImage || selectedImage) === img || (!activeImage && i === 0);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    onMouseEnter={() => setActiveImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-white ${
                      isSelected
                        ? "border-emerald-700 shadow-md ring-2 ring-emerald-700/20 scale-[1.02]"
                        : "border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={getOptimizedImageUrl(img, { width: 140, quality: "auto:eco" })}
                      alt={`thumbnail-${i}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Product Display Card with Badges & Stamps */}
            <div
              onClick={() => setIsZoomed(true)}
              className="relative w-full aspect-square bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden flex items-center justify-center group cursor-zoom-in"
            >
              {/* Top Left Discount Percent Badge */}
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 z-10 bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {discountPercent}% {t("OFF")}
                </span>
              )}

              {/* Top Right 100% Purity Gold Circular Seal */}
              <div className="absolute top-4 right-4 z-10 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 border-2 border-amber-400/80 rounded-full p-2 w-16 h-16 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-[9px] font-black uppercase text-amber-950 leading-tight">100% Pure</span>
                <span className="text-[8px] font-bold text-amber-900 tracking-tighter">AYURVEDA</span>
              </div>

              {/* Instant 0ms Layered Image Stack */}
              {(product.galleryImages.length > 0 ? product.galleryImages : [selectedImage]).map((img: string, idx: number) => {
                const isCurrent = (activeImage || selectedImage) === img || (!activeImage && idx === 0);
                return (
                  <div
                    key={idx}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
                      isCurrent ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={getOptimizedImageUrl(img, { width: 750, quality: "auto:good" })}
                      alt={`${translateText(product.name, product.nameHi)} - view ${idx + 1}`}
                      fill
                      priority={true}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Buying Controls, Highlights & Pricing (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Rating Badge & Category Tag */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                <Star size={13} className="fill-amber-500 text-amber-500" /> {rating} ({reviewCount.toLocaleString()} {t("Customer Reviews")})
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
                {t(product.category)}
              </span>
            </div>

            {/* Product Title & Subtitle */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-black text-stone-950 tracking-tight leading-tight">
                {translateText(product.name, product.nameHi)}
              </h1>
              <p className="text-sm sm:text-base 2xl:text-lg text-stone-600 mt-1.5 font-medium leading-relaxed">
                {translateText(product.title, product.titleHi)}
              </p>
            </div>

            {/* Pricing Box (Kapiva Style with Green tint & clean tags) */}
            <div className="bg-emerald-950/5 border border-emerald-900/15 p-4 sm:p-5 rounded-2xl">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-stone-950">
                    ₹{currentPack.price.toLocaleString()}
                  </span>
                  {currentPack.origPrice && (
                    <span className="text-lg text-stone-400 line-through font-medium">
                      ₹{currentPack.origPrice.toLocaleString()}
                    </span>
                  )}
                  {selectedPack === 1 && (
                    <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                      <Flame size={12} className="fill-white" /> 10% {t("EXTRA OFF")}
                    </span>
                  )}
                </div>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  ✓ {t("In Stock & Ready to Ship")}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-2">
                {selectedPack === 1 ? (
                  <span className="text-emerald-800 font-bold">{t("You save 10% extra on this 2-Pack value bundle!")}</span>
                ) : (
                  t("Inclusive of all taxes • Free Shipping on all Prepaid Orders")
                )}
              </p>
            </div>

            {/* Key Bullet Highlights with Green Checkmarks (Dynamic per Product) */}
            <div className="space-y-2 py-1">
              {bulletsList.map((bullet: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-800">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>{translateText(bullet)}</span>
                </div>
              ))}
            </div>

            {/* Pack Selection Cards */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black uppercase tracking-wider text-stone-700">{t("Select Pack:")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {packOptions.map((pack, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPack(idx)}
                    className={`relative w-full flex flex-col justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                      selectedPack === idx
                        ? "border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-700/20"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    {pack.isPopular && (
                      <span className="absolute -top-2.5 right-3 bg-emerald-800 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                        {pack.tag}
                      </span>
                    )}
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPack === idx ? "border-emerald-700 bg-emerald-700" : "border-stone-300"}`}>
                        {selectedPack === idx && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs font-bold text-stone-900 truncate">{pack.name}</span>
                    </div>

                    <div className="flex items-baseline gap-2 pl-6">
                      <span className="text-base font-black text-emerald-950">₹{pack.price.toLocaleString()}</span>
                      <span className="text-xs text-stone-400 line-through">₹{pack.origPrice.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & High Converting CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border-2 border-stone-200 rounded-xl bg-white p-1 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-700 font-bold hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-700 font-bold hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  disabled={isAdding || (product.inStock !== undefined && product.inStock !== null && (product.inStock as any) === 0)}
                  onClick={handleAddToBag}
                  className="flex-1 bg-stone-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isAdding ? t("Adding...") : t("Add to Cart")}
                </button>

                {/* Buy Now */}
                <button
                  disabled={isAdding || (product.inStock !== undefined && product.inStock !== null && (product.inStock as any) === 0)}
                  onClick={handleBuyNow}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm uppercase active:scale-95 disabled:opacity-50"
                >
                  {t("Buy Now")}
                </button>
              </div>
            </div>

            {/* Pincode Delivery Check */}
            <div className="bg-white border border-stone-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Truck size={15} className="text-emerald-700" />
                  {t("Estimated Delivery & COD Availability")}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 text-xs sm:text-sm px-3.5 py-2 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-700 bg-stone-50"
                />
                <button
                  onClick={handleCheckPincode}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  {t("Check")}
                </button>
              </div>
              {pincodeMsg && (
                <p className="text-xs font-bold text-emerald-800 flex items-center gap-1 pt-1">
                  <Check size={14} /> {pincodeMsg}
                </p>
              )}
            </div>

            {/* 3-Pillar Badges: COD, Secure Payment, Free Delivery */}
            <div className="bg-stone-100/90 border border-stone-200 rounded-2xl p-3 sm:p-3.5">
              <div className="grid grid-cols-3 gap-2 divide-x divide-stone-300/80 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                    <Banknote size={15} />
                  </div>
                  <div className="text-center sm:text-left leading-tight">
                    <span className="block text-[11px] font-black text-stone-900 uppercase">COD</span>
                    <span className="block text-[10px] font-bold text-stone-500">{t("Available")}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-1 pl-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                    <Lock size={15} />
                  </div>
                  <div className="text-center sm:text-left leading-tight">
                    <span className="block text-[11px] font-black text-stone-900 uppercase">UPI / Card</span>
                    <span className="block text-[10px] font-bold text-stone-500">{t("100% Secure")}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 px-1 pl-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                    <Truck size={15} />
                  </div>
                  <div className="text-center sm:text-left leading-tight">
                    <span className="block text-[11px] font-black text-stone-900 uppercase">{t("Free")}</span>
                    <span className="block text-[10px] font-bold text-stone-500">{t("Fast Delivery")}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>



      {/* ---------------- 4. 4-PILLAR ICON TRUST STRIP (HIGH QUALITY ICONS) ---------------- */}
      <section className="bg-white border-y border-stone-200/80 py-8 px-4 sm:px-6 my-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          {/* 1. 100% Ayurvedic */}
          <div className="flex flex-col items-center space-y-2 group cursor-default">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 64 64" className="w-10 h-10 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="url(#ayurGrad)" />
                <circle cx="32" cy="32" r="27.5" stroke="#059669" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M38 18C28 19 23 27 25 38C30 38 41 34 43 23C43 20 41 18 38 18Z" fill="url(#leafGrad1)" />
                <path d="M26 23C19 27 18 35 22 43C27 42 34 36 33 27C33 24 30 23 26 23Z" fill="url(#leafGrad2)" opacity="0.9" />
                <path d="M25 38C30 32 35 25 38 18" stroke="#ECFDF5" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M22 43C26 36 29 30 31 25" stroke="#ECFDF5" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="35" cy="24" r="1.5" fill="#FFFFFF" opacity="0.9" />
                <defs>
                  <linearGradient id="ayurGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ECFDF5" />
                    <stop offset="1" stopColor="#D1FAE5" />
                  </linearGradient>
                  <linearGradient id="leafGrad1" x1="24" y1="18" x2="43" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="1" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="leafGrad2" x1="18" y1="23" x2="33" y2="43" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34D399" />
                    <stop offset="1" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h5 className="text-xs sm:text-sm font-black text-stone-900">{t("100% Ayurvedic")}</h5>
            <p className="text-[11px] text-stone-500 font-medium">{t("Pure botanical herbs")}</p>
          </div>

          {/* 2. Heavy Metal Tested */}
          <div className="flex flex-col items-center space-y-2 group cursor-default">
            <div className="w-16 h-16 rounded-2xl bg-teal-50/80 border border-teal-200/80 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 64 64" className="w-10 h-10 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="url(#labGrad)" />
                <circle cx="32" cy="32" r="27.5" stroke="#0D9488" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M32 16L44 21V31C44 38.5 38.9 45.4 32 48C25.1 45.4 20 38.5 20 31V21L32 16Z" fill="url(#shieldGrad)" />
                <path d="M26 31.5L30 35.5L38 27.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M43 17L44 14L45 17L48 18L45 19L44 22L43 19L40 18L43 17Z" fill="#F59E0B" />
                <defs>
                  <linearGradient id="labGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F0FDFA" />
                    <stop offset="1" stopColor="#CCFBF1" />
                  </linearGradient>
                  <linearGradient id="shieldGrad" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0D9488" />
                    <stop offset="1" stopColor="#0F766E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h5 className="text-xs sm:text-sm font-black text-stone-900">{t("Heavy Metal Tested")}</h5>
            <p className="text-[11px] text-stone-500 font-medium">{t("Certified safe & pure")}</p>
          </div>

          {/* 3. Doctor Trusted */}
          <div className="flex flex-col items-center space-y-2 group cursor-default">
            <div className="w-16 h-16 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 64 64" className="w-10 h-10 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="url(#docGrad)" />
                <circle cx="32" cy="32" r="27.5" stroke="#D97706" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M27 38L22 47L29 44L34 47L31 38" fill="#D97706" />
                <path d="M37 38L42 47L35 44L30 47L33 38" fill="#B45309" />
                <circle cx="32" cy="28" r="13" fill="url(#sealGrad)" />
                <rect x="30" y="22" width="4" height="12" rx="1.5" fill="#FFFFFF" />
                <rect x="26" y="26" width="12" height="4" rx="1.5" fill="#FFFFFF" />
                <circle cx="32" cy="28" r="11" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 2" />
                <defs>
                  <linearGradient id="docGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FEF3C7" />
                    <stop offset="1" stopColor="#FDE68A" />
                  </linearGradient>
                  <linearGradient id="sealGrad" x1="20" y1="16" x2="44" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F59E0B" />
                    <stop offset="1" stopColor="#B45309" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h5 className="text-xs sm:text-sm font-black text-stone-900">{t("Doctor Trusted")}</h5>
            <p className="text-[11px] text-stone-500 font-medium">{t("Formulated by Vaidyas")}</p>
          </div>

          {/* 4. Fast Free Shipping */}
          <div className="flex flex-col items-center space-y-2 group cursor-default">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 64 64" className="w-10 h-10 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="url(#shipGrad)" />
                <circle cx="32" cy="32" r="27.5" stroke="#059669" strokeWidth="1" strokeOpacity="0.4" />
                <rect x="17" y="23" width="18" height="14" rx="2" fill="url(#truckGrad)" />
                <path d="M35 27H41L45 32V37H35V27Z" fill="#047857" />
                <path d="M37 29H40L42.5 32.5H37V29Z" fill="#ECFDF5" />
                <circle cx="23" cy="38" r="3.5" fill="#1F2937" />
                <circle cx="23" cy="38" r="1.5" fill="#E5E7EB" />
                <circle cx="40" cy="38" r="3.5" fill="#1F2937" />
                <circle cx="40" cy="38" r="1.5" fill="#E5E7EB" />
                <path d="M12 26H15" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 30H14" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 34H15" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="shipGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ECFDF5" />
                    <stop offset="1" stopColor="#D1FAE5" />
                  </linearGradient>
                  <linearGradient id="truckGrad" x1="17" y1="23" x2="35" y2="37" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="1" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h5 className="text-xs sm:text-sm font-black text-stone-900">{t("Fast Free Shipping")}</h5>
            <p className="text-[11px] text-stone-500 font-medium">{t("Delivered in 2-4 days")}</p>
          </div>
        </div>
      </section>

      {/* ---------------- 5. BENEFITS OF [PRODUCT] (KAPIVA STYLE) ---------------- */}
      <section className="py-14 2xl:py-20 px-4 sm:px-6 2xl:px-12 max-w-7xl 2xl:max-w-screen-2xl mx-auto space-y-10 2xl:space-y-14">
        <div className="text-center space-y-1">
          <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-stone-900 uppercase tracking-tight">
            {t("BENEFITS")}
          </h2>
          <p className="text-base sm:text-xl 2xl:text-2xl font-light tracking-wide text-stone-700 uppercase">
            {t("OF")} {translateText(product.name, product.nameHi)}
          </p>
        </div>

        {/* 3 Visual Photo Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12">
          {visualBenefitsList.map((ben: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-3 group"
            >
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden shadow-sm bg-stone-100 2xl:h-72">
                <Image
                  src={getOptimizedImageUrl(ben.image, { width: 500, quality: "auto:good" })}
                  alt={translateText(ben.title)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1536px) 33vw, 450px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-base sm:text-lg 2xl:text-2xl font-black text-stone-900 mt-2">
                {translateText(ben.title)}
              </h3>
              <p className="text-xs sm:text-sm 2xl:text-base text-stone-600 font-medium leading-relaxed max-w-xs 2xl:max-w-sm mx-auto">
                {translateText(ben.desc)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 6. CUSTOMERS SPEAK / VERIFIED REVIEWS ---------------- */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {t("CUSTOMERS SPEAK")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-2">
              {t("Verified Buyer Experiences")}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-stone-950">4.9 ★</div>
            <div className="text-xs text-stone-500 font-semibold">
              {t("Based on")} {reviewCount}+ {t("verified buyers")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(showAllReviews ? reviewsList : reviewsList.slice(0, 3)).map((rev: any, idx: number) => (
            <div key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400 font-medium">{translateText(rev.date, rev.dateHi)}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                "{translateText(rev.comment, rev.commentHi)}"
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-900">{rev.name}</span>
                  {rev.location && (
                    <span className="text-[10px] text-stone-400 font-medium">{translateText(rev.location, rev.locationHi)}</span>
                  )}
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <BadgeCheck size={12} /> {t("Verified Buyer")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {reviewsList.length > 3 && (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <span>
                {showAllReviews
                  ? t("Show Less Reviews")
                  : `${t("View More Reviews")} (${reviewsList.length - 3}+)`}
              </span>
              <ChevronDown
                className={`size-4 transition-transform duration-300 ${
                  showAllReviews ? "rotate-180 text-emerald-700" : ""
                }`}
              />
            </button>
          </div>
        )}
      </section>



      {/* ---------------- 8. KEY INGREDIENTS BANNER & BOTANICAL TABLE ---------------- */}
      <section className="py-14 2xl:py-20 px-4 sm:px-6 2xl:px-12 max-w-7xl 2xl:max-w-screen-2xl mx-auto space-y-8 2xl:space-y-12">
        <div className="text-center max-w-2xl 2xl:max-w-3xl mx-auto space-y-2">
          <span className="text-xs 2xl:text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
            {t("KEY INGREDIENTS")}
          </span>
          <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-stone-950 tracking-tight">
            {t("100% Pure Botanical Formulation")}
          </h2>
          <p className="text-xs sm:text-sm 2xl:text-base text-stone-600 font-medium">
            {t("Standardized active extracts from the highest Grade-A botanical sources.")}
          </p>
        </div>

        {/* Full-width Ingredients Banner Image */}
        <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 my-4 bg-stone-100">
          <img
            src="/ingi.webp"
            alt="Included Ingredients Banner"
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* Botanical Ingredients Table & Key Botanical Cards */}
        {fullCompositionList && fullCompositionList.length > 0 && (() => {
          const groupsMap = fullCompositionList.reduce((acc: Record<string, typeof fullCompositionList>, item: any) => {
            const key = item.amount || "Active";
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
          }, {} as Record<string, typeof fullCompositionList>);

          return (
            <div className="bg-white border border-stone-300 rounded-2xl overflow-hidden max-w-7xl w-full mx-auto shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-900 font-bold text-xs uppercase tracking-wider border-b border-stone-300">
                      <th className="py-3.5 px-4 sm:px-6 w-36 sm:w-48 border-r border-stone-300 text-center">
                        {t("Quantity per Dose")}
                      </th>
                      <th className="py-3.5 px-4 sm:px-6 border-r border-stone-300">
                        {t("Active Botanical Source Composition")}
                      </th>
                      <th className="py-3.5 px-4 sm:px-6 w-28 sm:w-36 text-right">
                        {t("Herbs")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-medium">
                    {Object.entries(groupsMap).map(([amountKey, groupItems]: [string, any], groupIdx: number) => (
                      <tr key={groupIdx} className="bg-white hover:bg-stone-50 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-stone-900 border-r border-stone-200 text-center text-xs sm:text-sm">
                          {amountKey}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-stone-900 leading-relaxed border-r border-stone-200">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {groupItems.map((item: any, idx: number) => (
                              <span key={idx} className="inline-flex items-center text-xs sm:text-sm font-medium text-stone-900">
                                <span className="font-semibold text-stone-900">{translateText(item.name)}</span>
                                {item.botanical && item.botanical !== "ASS" && (
                                  <span className="text-stone-500 italic ml-1 font-normal">({item.botanical})</span>
                                )}
                                {idx < groupItems.length - 1 && (
                                  <span className="text-stone-700 font-bold ml-1">,</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right font-medium text-stone-600">
                          {groupItems.length} {groupItems.length === 1 ? t("Herb") : t("Herbs")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}


      </section>

      {/* ---------------- 9. SUITABLE FOR SECTION (SIMPLE ELEGANT BOX) ---------------- */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 my-12 text-center space-y-4">
        <h3 className="text-lg sm:text-xl font-black tracking-widest uppercase text-stone-900">
          {t("SUITABLE")} <span className="text-emerald-800">{t("FOR")}</span>
        </h3>
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <p className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed max-w-2xl mx-auto">
            {translateText(suitableForText)}
          </p>
        </div>
      </section>

      {/* ---------------- 10. HOW TO USE WITH VISUAL TIMELINE & PHOTO ---------------- */}
      <section className="bg-stone-100/80 border-y border-stone-200/90 py-16 2xl:py-24 px-4 sm:px-6 2xl:px-12">
        <div className="max-w-6xl 2xl:max-w-screen-2xl mx-auto space-y-12 2xl:space-y-16">
          <div className="text-center max-w-xl 2xl:max-w-2xl mx-auto space-y-2">
            <span className="text-xs 2xl:text-sm font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
              {t("HOW TO USE")}
            </span>
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-stone-950">
              {t("Simple 3-Step Daily Regimen")}
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-stone-600">
              {t("Follow this simple routine for optimal bioavailability and maximum results.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Photo Card on Left */}
            <div className="lg:col-span-5 relative aspect-4/3 rounded-3xl overflow-hidden shadow-md border border-stone-200 group">
              <Image
                src="/benefits/how_to_use_universal.jpg"
                alt="How to use Ayurveda Daily Regimen"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* 3 Step Timeline on Right */}
            <div className="lg:col-span-7 space-y-4">
              {howToUseList.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200/90 p-5 rounded-2xl flex items-start gap-4 shadow-2xs hover:border-emerald-700/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {step.step || idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-stone-900 mb-1">
                      {translateText(step.title)}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                      {translateText(step.desc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ---------------- 12. WHY TULSI VEDA? (BRAND TRUST SEALS) ---------------- */}
      <section className="py-14 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-8 border-t border-stone-200">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
            {t("PURITY PROMISE")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-2">
            {t("Why Tulsi Veda?")}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
              <Leaf size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-stone-900">{t("Pure Potent Ingredients")}</h4>
            <p className="text-[11px] text-stone-500 font-medium">{t("Sourced from Grade-A botanicals")}</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-stone-900">{t("Zero Heavy Metals")}</h4>
            <p className="text-[11px] text-stone-500 font-medium">{t("3rd-party lab certified batches")}</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
              <Award size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-stone-900">{t("GMP & AYUSH Standard")}</h4>
            <p className="text-[11px] text-stone-500 font-medium">{t("Manufactured in certified units")}</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
              <RotateCcw size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-stone-900">{t("100% Satisfaction")}</h4>
            <p className="text-[11px] text-stone-500 font-medium">{t("Loved by over 50,000+ customers")}</p>
          </div>
        </div>
      </section>

      {/* ---------------- 13. SIMILAR PRODUCTS SECTION ---------------- */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="bg-stone-100/70 border-t border-stone-200 py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
                  {t("EXPLORE MORE")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-950 mt-2">
                  {t("Similar Ayurvedic Products")}
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition"
              >
                {t("View All Products")} →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProd: any, idx: number) => {
                const rId = relProd.id || relProd._id || `sim-${idx}`;
                const rPrice = relProd.discountPrice ?? relProd.price;
                const rDiscount = relProd.discountPrice
                  ? Math.round(((relProd.price - relProd.discountPrice) / relProd.price) * 100)
                  : null;
                const rImage = getOptimizedImageUrl(relProd.galleryImages?.[0], { width: 500 });
                const isAddingThis = addingRelatedId === rId;

                return (
                  <div
                    key={rId}
                    className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                  >
                    <Link href={`/shop/${rId}`} className="relative aspect-square w-full bg-stone-50 overflow-hidden block">
                      <Image
                        src={rImage}
                        alt={translateText(relProd.name, relProd.nameHi)}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                        className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                      />
                      {rDiscount && rDiscount > 0 && (
                        <span className="absolute top-2.5 left-2.5 bg-emerald-800 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                          {rDiscount}% OFF
                        </span>
                      )}
                    </Link>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {t(relProd.category)}
                        </span>
                        <Link href={`/shop/${rId}`}>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900 mt-1.5 line-clamp-2 group-hover:text-emerald-700 transition leading-snug">
                            {translateText(relProd.name, relProd.nameHi)}
                          </h4>
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-sm sm:text-base font-black text-stone-950">₹{rPrice.toLocaleString()}</span>
                          {relProd.discountPrice && (
                            <span className="text-[11px] text-stone-400 line-through ml-1 block sm:inline">
                              ₹{relProd.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <button
                          disabled={isAddingThis}
                          onClick={() => handleAddRelatedToCart(relProd)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] uppercase px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 active:scale-95 shadow-2xs"
                        >
                          {isAddingThis ? "..." : t("+ ADD")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 14. FREQUENTLY ASKED QUESTIONS (FAQS) AT THE BOTTOM ---------------- */}
      <section className="py-16 2xl:py-24 px-4 sm:px-6 2xl:px-12 max-w-4xl 2xl:max-w-6xl mx-auto space-y-8 2xl:space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs 2xl:text-sm font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1 rounded-full">
            {t("Got Questions?")}
          </span>
          <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-stone-950">{t("Frequently Asked Questions")}</h2>
        </div>

        <div className="space-y-3">
          {faqsList.map((faq: any, idx: number) => (
            <div
              key={idx}
              className="border border-stone-200 rounded-2xl overflow-hidden transition-all bg-white shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-stone-900 cursor-pointer hover:bg-stone-50"
              >
                <span>{translateText(faq.question)}</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 text-stone-500 shrink-0 ml-2 ${activeFaq === idx ? "rotate-180 text-emerald-700" : ""}`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3 bg-stone-50/50 font-medium">
                  {translateText(faq.answer)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>



      {/* ---------------- 16. STICKY MOBILE BOTTOM BAR (HIGH CONVERTING) ---------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-stone-500 font-bold uppercase">{selectedPack === 1 ? "2-Pack" : "1-Pack"}</div>
          <div className="text-base font-black text-stone-950">₹{currentPack.price.toLocaleString()}</div>
        </div>

        <div className="flex gap-2 flex-1 justify-end">
          <button
            disabled={isAdding}
            onClick={handleAddToBag}
            className="bg-stone-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl uppercase active:scale-95 transition"
          >
            {isAdding ? "..." : t("Cart")}
          </button>
          <button
            disabled={isAdding}
            onClick={handleBuyNow}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2.5 rounded-xl uppercase active:scale-95 shadow-md transition"
          >
            {t("Buy Now")}
          </button>
        </div>
      </div>

      {/* ---------------- 17. IMAGE MODAL LIGHTBOX ---------------- */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center cursor-zoom-out p-4"
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
