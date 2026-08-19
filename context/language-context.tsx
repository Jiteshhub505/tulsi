"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateText: (text: string | null | undefined, altHi?: string | null) => string;
}

const uiTranslations: Record<string, Record<Language, string>> = {
  // Navigation
  "Home": { en: "Home", hi: "Home" },
  "Shop": { en: "Shop", hi: "Shop" },
  "About Us": { en: "About Us", hi: "About Us" },

  // Hero & Buttons
  "Shop Now": { en: "Shop Now", hi: "अभी खरीदें" },
  "View All Products": { en: "View All Products", hi: "सभी उत्पाद देखें" },
  "Shop by Category": { en: "Shop by Category", hi: "श्रेणी के अनुसार खरीदें" },
  "Category Subtitle": {
    en: "Everything you need for your best skin, hair, health, and daily energy days.",
    hi: "आपकी त्वचा, बाल, स्वास्थ्य और दैनिक ऊर्जा के लिए आवश्यक सब कुछ।",
  },
  "Our Best Sellers": { en: "Our Best Sellers", hi: "हमारे बेस्ट सेलर्स" },
  "Explore Products": { en: "Explore Products", hi: "उत्पाद देखें" },
  "Shop Top Ayurveda Formulas": { en: "Shop Top Ayurveda Formulas", hi: "सर्वश्रेष्ठ आयुर्वेदिक फॉर्मूले खरीदें" },
  "Best Sellers Subtitle": {
    en: "Premium quality formulations crafted from time-tested Ayurvedic ingredients.",
    hi: "समय की कसौटी पर खरे उतरे आयुर्वेदिक घटकों से निर्मित प्रीमियम गुणवत्ता।",
  },

  // Wavy & Promo Banners
  "100% Ayurvedic & Natural Products": { en: "100% Ayurvedic & Natural Products", hi: "100% आयुर्वेदिक और प्राकृतिक उत्पाद" },
  "Pure Ingredients, Time-Tested Formulations": { en: "Pure Ingredients, Time-Tested Formulations", hi: "शुद्ध घटक, समय सिद्ध फॉर्मूले" },
  "GET UPTO 25% OFF": { en: "GET UPTO 25% OFF", hi: "25% तक की छूट पाएं" },
  "FLAT 25% OFF ON YOUR FIRST ORDER": { en: "FLAT 25% OFF ON YOUR FIRST ORDER", hi: "अपने पहले ऑर्डर पर फ्लैट 25% की छूट पाएं" },
  "Use Code: TULSI25 at checkout to claim your discount. Limited time offer!": {
    en: "Use Code: TULSI25 at checkout to claim your discount. Limited time offer!",
    hi: "छूट पाने के लिए चेकआउट पर कोड: TULSI25 का उपयोग करें। सीमित समय की पेशकश!",
  },
  "Claim Discount": { en: "Claim Discount", hi: "छूट प्राप्त करें" },

  // Features Section
  "Veda Shakti: Premium Ayurvedic Ingredients": {
    en: "Veda Shakti: Premium Ayurvedic Ingredients",
    hi: "वेद शक्ति: प्रीमियम आयुर्वेदिक घटक",
  },
  "A powerful blend of ancient Ayurvedic herbs, crafted for modern wellness.": {
    en: "A powerful blend of ancient Ayurvedic herbs, crafted for modern wellness.",
    hi: "प्राचीन आयुर्वेदिक जड़ी-बूटियों का एक शक्तिशाली मिश्रण, आधुनिक वेलनेस के लिए तैयार।",
  },
  "Ashwagandha": { en: "Ashwagandha", hi: "अश्वगंधा" },
  "Ashwagandha Desc": {
    en: "Reduces stress and daily fatigue while supporting optimal muscle growth. Helps maintain healthy cortisol levels for better endurance.",
    hi: "तनाव और दैनिक थकान को कम करता है और मांसपेशियों के विकास का समर्थन करता है।",
  },
  "Amla Extract": { en: "Amla Extract", hi: "आंवला अर्क" },
  "Amla Desc": {
    en: "Boosts immunity and improves digestion with natural Vitamin C. Supports cellular health and enhances your body's natural defense.",
    hi: "प्राकृतिक विटामिन सी के साथ प्रतिरक्षा बढ़ाता है और पाचन में सुधार करता है।",
  },
  "Gokshura": { en: "Gokshura", hi: "गोक्षुर" },
  "Gokshura Desc": {
    en: "Supports active muscle growth and boosts overall vitality. Rejuvenates the body to increase energy and healthy physical performance.",
    hi: "सक्रिय मांसपेशियों के विकास का समर्थन करता है और समग्र जीवन शक्ति को बढ़ाता है।",
  },
  "Pippali": { en: "Pippali", hi: "पिप्पली" },
  "Pippali Desc": {
    en: "Enhances healthy appetite and maximizes nutrient absorption. Stimulates metabolism to help your body efficiently process nutrients.",
    hi: "स्वस्थ भूख को बढ़ाता है और पोषक तत्वों के अवअवशोषण को अधिकतम करता है।",
  },
  "Kaunch Beej": { en: "Kaunch Beej", hi: "कौंच बीज" },
  "Kaunch Beej Desc": {
    en: "Helps in rapid muscle recovery and increases energy and stamina. A natural strength booster that supports nervous system function.",
    hi: "तेजी से मांसपेशियों की रिकवरी में मदद करता है और ऊर्जा तथा सहनशक्ति बढ़ाता है।",
  },
  "100% Natural": { en: "100% Natural", hi: "100% प्राकृतिक" },
  "Natural Formula Desc": {
    en: "30 capsules of pure Ayurvedic formulation with no synthetic additives. Rigorously tested for maximum purity and effectiveness.",
    hi: "बिना किसी सिंथेटिक एडिटिव्स के शुद्ध आयुर्वेदिक फॉर्मूले के 30 कैप्सूल।",
  },
  "Shop Veda Shakti": { en: "Shop Veda Shakti", hi: "वेद शक्ति खरीदें" },

  "Why Choose TulsiVeda": { en: "Why Choose TulsiVeda", hi: "तुलसीवेद क्यों चुनें" },
  "Why Choose Subtitle": {
    en: "Combining ancient Ayurvedic wisdom with modern quality standards.",
    hi: "आधुनिक गुणवत्ता मानकों के साथ प्राचीन आयुर्वेदिक ज्ञान का संयोजन।",
  },
  "100% Authentic Herbs": { en: "100% Authentic Herbs", hi: "100% प्रामाणिक जड़ी-बूटियाँ" },
  "Authentic Herbs Desc": {
    en: "Sourced directly from certified organic farms across India.",
    hi: "पूरे भारत के प्रमाणित जैविक खेतों से सीधे प्राप्त की गई।",
  },
  "Doctor Recommended": { en: "Doctor Recommended", hi: "डॉक्टर द्वारा अनुशंसित" },
  "Doctor Recommended Desc": {
    en: "Formulated and tested by experienced Ayurvedic practitioners.",
    hi: "अनुभवी आयुर्वेदिक चिकित्सकों द्वारा तैयार और परीक्षण किया गया।",
  },
  "Zero Harmful Chemicals": { en: "Zero Harmful Chemicals", hi: "शून्य हानिकारक रसायन" },
  "Zero Chemicals Desc": {
    en: "Free from artificial preservatives, parabens, and heavy metals.",
    hi: "कृत्रिम परिरक्षकों, पैराबेन्स और भारी धातुओं से मुक्त।",
  },
  "Fast & Free Shipping": { en: "Fast & Free Shipping", hi: "तेज़ और मुफ़्त शिपिंग" },
  "Free Shipping Desc": {
    en: "Free delivery across India on orders above ₹500.",
    hi: "₹500 से ऊपर के ऑर्डर पर पूरे भारत में मुफ़्त डिलीवरी।",
  },

  // Testimonials
  "What Our Customers Say": { en: "What Our Customers Say", hi: "हमारे ग्राहक क्या कहते हैं" },
  "Testimonials Subtitle": {
    en: "Real stories from people whose wellness journey was transformed by TulsiVeda.",
    hi: "उन लोगों की वास्तविक कहानियाँ जिनका वेलनेस सफर तुलसीवेद से बदल गया।",
  },

  // Integrations / Quality
  "Certified & Tested Quality": { en: "Certified & Tested Quality", hi: "प्रमाणित और परीक्षण की गई गुणवत्ता" },
  "Certified Subtitle": {
    en: "Our products undergo strict quality checks and hold top national certifications.",
    hi: "हमारे उत्पाद कड़े गुणवत्ता जांच से गुजरते हैं और शीर्ष राष्ट्रीय प्रमाणपत्र रखते हैं।",
  },

  // Footer
  "Quick Links": { en: "Quick Links", hi: "त्वरित लिंक" },
  "Policies": { en: "Policies", hi: "नीतियां" },
  "Customer Support": { en: "Customer Support", hi: "ग्राहक सहायता" },
  "Privacy Policy": { en: "Privacy Policy", hi: "गोपनीयता नीति" },
  "Terms & Conditions": { en: "Terms & Conditions", hi: "नियम एवं शर्तें" },
  "Cancellations & Refunds": { en: "Cancellations & Refunds", hi: "रद्दीकरण और रिफंड" },
  "Shipping Policy": { en: "Shipping Policy", hi: "शिपिंग नीति" },
  "All Rights Reserved.": { en: "All Rights Reserved.", hi: "सर्वाधिकार सुरक्षित।" },

  // Shop Page Filters & Toolbar
  "Filter Options": { en: "Filter Options", hi: "फ़िल्टर विकल्प" },
  "Filters": { en: "Filters", hi: "फ़िल्टर" },
  "By Categories": { en: "By Categories", hi: "श्रेणियों के अनुसार" },
  "Price": { en: "Price", hi: "मूल्य" },
  "Availability": { en: "Availability", hi: "उपलब्धता" },
  "In Stock": { en: "In Stock", hi: "स्टॉक में उपलब्ध" },
  "Out of Stock": { en: "Out of Stock", hi: "स्टॉक में उपलब्ध नहीं" },
  "Clear All": { en: "Clear All", hi: "सभी फ़िल्टर हटाएं" },
  "Clear All Filters": { en: "Clear All Filters", hi: "सभी फ़िल्टर हटाएं" },
  "Showing": { en: "Showing", hi: "दिखाए जा रहे हैं" },
  "products": { en: "products", hi: "उत्पाद" },
  "Sort by:": { en: "Sort by:", hi: "क्रमानुसार रखें:" },
  "Active Filter:": { en: "Active Filter:", hi: "सक्रिय फ़िल्टर:" },

  // Sort Options
  "Featured": { en: "Featured", hi: "विशेष रुप से प्रदर्शित" },
  "Price: Low to High": { en: "Price: Low to High", hi: "मूल्य: कम से उच्च" },
  "Price: High to Low": { en: "Price: High to Low", hi: "मूल्य: उच्च से कम" },
  "Best Discount": { en: "Best Discount", hi: "सर्वश्रेष्ठ छूट" },
  "Name A–Z": { en: "Name A–Z", hi: "नाम A–Z" },

  // Category Labels
  "All": { en: "All Products", hi: "सभी उत्पाद" },
  "All Products": { en: "All Products", hi: "सभी उत्पाद" },
  "Digestion": { en: "Digestion", hi: "पाचन स्वास्थ्य" },
  "Health & Fitness": { en: "Health & Fitness", hi: "स्वास्थ्य और फिटनेस" },
  "Stamina and Power": { en: "Stamina and Power", hi: "स्टैमिना और शक्ति" },
  "Health Disease": { en: "Health Disease", hi: "स्वास्थ्य रोग" },
  "Supplements": { en: "Supplements", hi: "सप्लीमेंट्स" },
  "Suppliments": { en: "Supplements", hi: "सप्लीमेंट्स" },
  "Skin Care": { en: "Skin Care", hi: "स्किन केयर" },
  "Skin": { en: "Skin Care", hi: "स्किन केयर" },
  "Hygiene": { en: "Hygiene", hi: "हाइजीन" },
  "Others": { en: "Others", hi: "अन्य" },

  // Empty Search State
  "No products found": { en: "No products found", hi: "कोई उत्पाद नहीं मिला" },
  "Try adjusting your filters or search terms.": {
    en: "Try adjusting your filters or search terms.",
    hi: "अपने फ़िल्टर या खोज शब्दों को समायोजित करने का प्रयास करें।",
  },
  "No products in this category yet — check back soon.": {
    en: "No products in this category yet — check back soon.",
    hi: "इस श्रेणी में अभी तक कोई उत्पाद नहीं है — जल्द ही वापस देखें।",
  },

  // Single Product Page Badges & Buttons
  "TRUSTED BY DOCTORS": { en: "TRUSTED BY DOCTORS", hi: "डॉक्टरों द्वारा विश्वसनीय" },
  "EASY TO USE": { en: "EASY TO USE", hi: "उपयोग में आसान" },
  "CERTIFIED QUALITY": { en: "CERTIFIED QUALITY", hi: "प्रमाणित गुणवत्ता" },
  "Read More": { en: "Read More", hi: "अधिक पढ़ें" },
  "READ MORE": { en: "READ MORE", hi: "अधिक पढ़ें" },
  "Read Less": { en: "Read Less", hi: "कम पढ़ें" },
  "READ LESS": { en: "READ LESS", hi: "कम पढ़ें" },
  "Inclusive of all taxes": { en: "Inclusive of all taxes", hi: "सभी कर शामिल" },
  "QUANTITY:": { en: "QUANTITY:", hi: "मात्रा:" },
  "Quantity:": { en: "Quantity:", hi: "मात्रा:" },
  "Satisfaction Guaranteed • Free Shipping Over ₹500 • Secure Check-Out": {
    en: "Satisfaction Guaranteed • Free Shipping Over ₹500 • Secure Check-Out",
    hi: "संतुष्टि की गारंटी • ₹500 से अधिक पर मुफ़्त शिपिंग • सुरक्षित चेक-आउट",
  },
  "View Product": { en: "View Product", hi: "उत्पाद देखें" },
  "Unavailable": { en: "Unavailable", hi: "अनुपलब्ध" },
  "Add to Cart": { en: "Add to Cart", hi: "कार्ट में जोड़ें" },
  "Adding to Cart...": { en: "Adding to Cart...", hi: "कार्ट में जोड़ा जा रहा है..." },
  "Buy Now": { en: "Buy Now", hi: "अभी खरीदें" },
  "Key Ingredients": { en: "Key Ingredients", hi: "मुख्य सामग्री" },
  "Health Goals": { en: "Health Goals", hi: "स्वास्थ्य लक्ष्य" },
  "Form": { en: "Form", hi: "रूप" },
  "Product Description": { en: "Product Description", hi: "उत्पाद विवरण" },
  "Related Products": { en: "Related Products", hi: "संबंधित उत्पाद" },
  "Customer Reviews": { en: "Customer Reviews", hi: "ग्राहक समीक्षाएं" },
  "Directions": { en: "Directions & Usage", hi: "उपयोग के निर्देश" },
  "Warnings": { en: "Warnings & Precautions", hi: "चेतावनी और सावधानियां" },

  // Cart Drawer
  "Your Shopping Cart": { en: "Your Shopping Cart", hi: "आपकी शॉपिंग कार्ट" },
  "Your cart is empty": { en: "Your cart is empty", hi: "आपकी कार्ट खाली है" },
  "Subtotal": { en: "Subtotal", hi: "उप-कुल" },
  "Proceed to Checkout": { en: "Proceed to Checkout", hi: "चेकआउट करें" },
  "Items": { en: "Items", hi: "वस्तुएं" },
};

// Generic dictionary for dynamic text translation (Product names, titles, descriptions)
const knownTextTranslations: Record<string, string> = {
  // Product Names & Titles
  "Ved Shakti": "वेद शक्ति",
  "Veda Shakti": "वेद शक्ति",
  "Empower you strength": "अपनी ताकत बढ़ाएं",
  "Empower your strength": "अपनी ताकत बढ़ाएं",
  "Veda Shakti - Natural Power, Stronger You": "वेद शक्ति - प्राकृतिक शक्ति, मजबूत आप",
  "Veda Shakti - Natural Power & Stamina Support": "वेद शक्ति - प्राकृतिक शक्ति और सहनशक्ति समर्थन",
  "Veda Shakti is a premium Ayurvedic wellness supplement made with carefully selected natural herbs to support overall health and vitality. Its traditional herbal formula is crafted to promote daily wellness, boost energy, and help maintain a balanced, healthy lifestyle....":
    "वेद शक्ति एक प्रीमियम आयुर्वेदिक वेलनेस सप्लीमेंट है जो समग्र स्वास्थ्य और जीवन शक्ति का समर्थन करने के लिए ध्यानपूर्वक चुनी गई प्राकृतिक जड़ी-बूटियों से बना है। इसका पारंपरिक हर्बल फॉर्मूला दैनिक कल्याण को बढ़ावा देने, ऊर्जा बढ़ाने और एक संतुलित, स्वस्थ जीवन शैली बनाए रखने में मदद करने के लिए तैयार किया गया है।",
  "Veda Shakti is a premium Ayurvedic wellness supplement made with carefully selected natural herbs to support overall health and vitality. Its traditional herbal formula is crafted to promote daily wellness, boost energy, and help maintain a balanced, healthy lifestyle.":
    "वेद शक्ति एक प्रीमियम आयुर्वेदिक वेलनेस सप्लीमेंट है जो समग्र स्वास्थ्य और जीवन शक्ति का समर्थन करने के लिए ध्यानपूर्वक चुनी गई प्राकृतिक जड़ी-बूटियों से बना है। इसका पारंपरिक हर्बल फॉर्मूला दैनिक कल्याण को बढ़ावा देने, ऊर्जा बढ़ाने और एक संतुलित, स्वस्थ जीवन शैली बनाए रखने में मदद करने के लिए तैयार किया गया है।",
  "Carefully selected Ayurvedic ingredients to support overall energy, stamina, and power.":
    "समग्र ऊर्जा, सहनशक्ति और शक्ति का समर्थन करने के लिए सावधानीपूर्वक चुने गए आयुर्वेदिक घटक।",

  "Ayurvedic Fat Burner": "आयुर्वेदिक फैट बर्नर",
  "Ayurvedic Fat Burner - Metabolism & Energy Support": "आयुर्वेदिक फैट बर्नर - चयापचय और ऊर्जा समर्थन",
  "An Ayurvedic formulation designed to support metabolism and active daily routines when combined with proper diet and exercise.":
    "उचित आहार और व्यायाम के साथ संयुक्त होने पर चयापचय और सक्रिय दैनिक दिनचर्या का समर्थन करने के लिए डिज़ाइन किया गया एक आयुर्वेदिक सूत्र।",

  "Ayurvedic Weight Support Formula": "आयुर्वेदिक वजन सहायता फॉर्मूला",
  "Ayurvedic Weight Support Formula - Daily Nutrition": "आयुर्वेदिक वजन सहायता फॉर्मूला - दैनिक पोषण",
  "Carefully selected Ayurvedic ingredients to support overall nutrition and consistent lifestyle habits.":
    "समग्र पोषण और सुसंगत जीवन शैली की आदतों का समर्थन करने के लिए ध्यानपूर्वक चुने गए आयुर्वेदिक घटक।",

  "Daily Wellness Combo": "दैनिक वेलनेस कॉम्बो",
  "Daily Wellness Combo - Nutrition & Recovery": "दैनिक वेलनेस कॉम्बो - पोषण और रिकवरी",
  "A balanced combination formulated to complement everyday wellness and recovery routines.":
    "प्रतिदिन के स्वास्थ्य और रिकवरी दिनचर्या को पूरा करने के लिए तैयार किया गया एक संतुलित संयोजन।",

  "Herbal Metabolism Support": "हर्बल मेटाबॉलिज्म सपोर्ट",
  "Herbal Metabolism Support - Daily Energy": "हर्बल मेटाबॉलिज्म सपोर्ट - दैनिक ऊर्जा",
  "Designed to support metabolic activity and daily energy as part of an active lifestyle.":
    "सक्रिय जीवन शैली के भाग के रूप में चयापचय गतिविधि और दैनिक ऊर्जा का समर्थन करने के लिए डिज़ाइन किया गया।",

  "Ayurvedic Nutrition Blend": "आयुर्वेदिक न्यूट्रिशन ब्लेंड",
  "Ayurvedic Nutrition Blend - Daily Wellness": "आयुर्वेदिक न्यूट्रिशन ब्लेंड - दैनिक कल्याण",
  "A clean Ayurvedic blend created to support daily nutritional intake and overall wellness.":
    "दैनिक पोषण सेवन और समग्र कल्याण का समर्थन करने के लिए बनाया गया एक स्वच्छ आयुर्वेदिक मिश्रण।",

  "Active Lifestyle Support": "एक्टिव लाइफस्टाइल सपोर्ट",
  "Active Lifestyle Support - Physical Activity Complement": "एक्टिव लाइफस्टाइल सपोर्ट - शारीरिक गतिविधि पूरक",
  "Formulated to complement regular physical activity, balanced meals, and disciplined routines.":
    "नियमित शारीरिक गतिविधि, संतुलित भोजन और अनुशासित दिनचर्या का समर्थन करने के लिए तैयार किया गया।",

  "Herbal Wellness Formula": "हर्बल वेलनेस फॉर्मूला",
  "Herbal Wellness Formula - General Wellness": "हर्बल वेलनेस फॉर्मूला - सामान्य कल्याण",
  "Traditional Ayurvedic ingredients selected to support general wellness and consistency.":
    "सामान्य कल्याण और निरंतरता का समर्थन करने के लिए चुने गए पारंपरिक आयुर्वेदिक घटक।",

  "Ayurvedic Weight Gainer": "आयुर्वेदिक वेट गेनर",
  "Ayurvedic Weight Gainer - Daily Nutrition Support": "आयुर्वेदिक वेट गेनर - दैनिक पोषण समर्थन",
  "Supports daily nutrition and active lifestyles.": "दैनिक पोषण और सक्रिय जीवन शैली का समर्थन करता है।",

  "Herbal Fat Burner": "हर्बल फैट बर्नर",
  "Herbal Fat Burner - Workout Companion": "हर्बल फैट बर्नर - कसरत साथी",
  "Designed to complement workout routines.": "कसरत की दिनचर्या को पूरा करने के लिए डिज़ाइन किया गया।",

  "Wellness Combo Pack": "वेलनेस कॉम्बो पैक",
  "Wellness Combo Pack - Balanced Recovery Support": "वेलनेस कॉम्बो पैक - संतुलित रिकवरी समर्थन",
  "Balanced support for nutrition and recovery.": "पोषण और रिकवरी के लिए संतुलित समर्थन।",

  "Ayurvedic Glow Support Cream": "आयुर्वेदिक ग्लो सपोर्ट क्रीम",
  "Ayurvedic Glow Support Cream - Daily Nourishment": "आयुर्वेदिक ग्लो सपोर्ट क्रीम - दैनिक पोषण",
  "An Ayurvedic skincare formulation designed to support daily skin nourishment and a healthy-looking glow when used as part of a regular skincare routine.":
    "नियमित त्वचा देखभाल दिनचर्या के रूप में उपयोग किए जाने पर दैनिक त्वचा पोषण और स्वस्थ चमक का समर्थन करने के लिए डिज़ाइन किया गया एक आयुर्वेदिक स्किनकेयर फॉर्मूला।",

  "Herbal Skin Hydration Gel": "हर्बल स्किन हाइड्रेशन जेल",
  "Herbal Skin Hydration Gel - Everyday Comfort": "हर्बल स्किन हाइड्रेशन जेल - रोजमर्रा का आराम",
  "A lightweight herbal gel formulated to support skin hydration and comfort for everyday use.":
    "रोजमर्रा के उपयोग के लिए त्वचा जलयोजन और आराम का समर्थन करने के लिए तैयार किया गया एक हल्का हर्बल जेल।",

  "Ayurvedic Skin Balance Serum": "आयुर्वेदिक स्किन बैलेंस सीरम",
  "Ayurvedic Skin Balance Serum - Balanced Skincare": "आयुर्वेदिक स्किन बैलेंस सीरम - संतुलित स्किनकेयर",
  "Carefully selected Ayurvedic ingredients designed to support balanced-looking skin as part of a consistent skincare routine.":
    "सुसंगत त्वचा देखभाल दिनचर्या के हिस्से के रूप में संतुलित दिखने वाली त्वचा का समर्थन करने के लिए सावधानीपूर्वक चुने गए आयुर्वेदिक घटक।",

  "Daily Herbal Face Cleanser": "डेली हर्बल फेस क्लींजर",
  "Daily Herbal Face Cleanser - Gentle Cleansing": "डेली हर्बल फेस क्लींजर - सौम्य सफाई",
  "A gentle herbal cleanser created to support daily cleansing without stripping natural skin moisture.":
    "प्राकृतिक त्वचा की नमी को छीने बिना दैनिक सफाई का समर्थन करने के लिए बनाया गया एक सौम्य हर्बल क्लींजर।",

  "Ayurvedic Skin Nourish Lotion": "आयुर्वेदिक स्किन नरिश लोशन",
  "Ayurvedic Skin Nourish Lotion - Softness & Care": "आयुर्वेदिक स्किन नरिश लोशन - कोमलता और देखभाल",
  "A smooth Ayurvedic lotion designed to support skin softness and everyday care with regular use.":
    "नियमित उपयोग के साथ त्वचा की कोमलता और रोजमर्रा की देखभाल का समर्थन करने के लिए डिज़ाइन किया गया एक चिकना आयुर्वेदिक लोशन।",

  "Herbal Daily Shampoo": "हर्बल डेली शैम्पू",
  "Herbal Daily Shampoo - Gentle Everyday Cleansing": "हर्बल डेली शैम्पू - सौम्य दैनिक सफाई",
  "A gentle herbal shampoo designed to support everyday hair cleansing and freshness.":
    "रोजमर्रा के बालों की सफाई और ताजगी का समर्थन करने के लिए डिज़ाइन किया गया एक सौम्य हर्बल शैम्पू।",

  "Ayurvedic Hair Cleanse Wash": "आयुर्वेदिक हेयर क्लींज वॉश",
  "Ayurvedic Hair Cleanse Wash - Traditional Herbs": "आयुर्वेदिक हेयर क्लींज वॉश - पारंपरिक जड़ी-बूटियाँ",
  "Formulated with traditional herbs to support regular hair washing as part of a hygiene routine.":
    "स्वच्छता दिनचर्या के भाग के रूप में नियमित बाल धोने का समर्थन करने के लिए पारंपरिक जड़ी-बूटियों के साथ तैयार किया गया।",

  "Herbal Hand Wash": "हर्बल हैंड वॉश",
  "Herbal Hand Wash - Mild Daily Hygiene": "हर्बल हैंड वॉश - सौम्य दैनिक स्वच्छता",
  "A mild hand wash designed to support daily hand hygiene while being gentle on skin.":
    "त्वचा पर सौम्य रहते हुए दैनिक हाथ की स्वच्छता का समर्थन करने के लिए डिज़ाइन किया गया एक हल्का हैंड वॉश।",

  "Ayurvedic Body Cleanser": "आयुर्वेदिक बॉडी क्लींजर",
  "Ayurvedic Body Cleanser - Everyday Freshness": "आयुर्वेदिक बॉडी क्लींजर - रोजमर्रा की ताजगी",
  "A refreshing body cleanser created for everyday cleansing and skin comfort.":
    "रोजमर्रा की सफाई और त्वचा के आराम के लिए बनाया गया एक ताज़ा बॉडी क्लींजर।",

  "Herbal Hair Removal Cream": "हर्बल हेयर रिमूवल क्रीम",
  "Herbal Hair Removal Cream - Convenient Care": "हर्बल हेयर रिमूवल क्रीम - सुविधाजनक देखभाल",
  "A personal care formulation designed to support easy and convenient hair removal.":
    "आसान और सुविधाजनक बाल हटाने का समर्थन करने के लिए डिज़ाइन किया गया एक व्यक्तिगत देखभाल फॉर्मूला।",

  "Daily Face Wash": "डेली फेस वॉश",
  "Daily Face Wash - Gentle Cleansing": "डेली फेस वॉश - सौम्य सफाई",
  "A gentle face wash formulated to support daily cleansing without harshness.":
    "कठोरता के बिना दैनिक सफाई का समर्थन करने के लिए तैयार किया गया एक सौम्य फेस वॉश।",

  "Herbal Intimate Wash": "हर्बल इंटीमेट वॉश",
  "Herbal Intimate Wash - Daily Personal Care": "हर्बल इंटीमेट वॉश - दैनिक व्यक्तिगत देखभाल",
  "Carefully formulated to support daily intimate hygiene as part of a personal care routine.":
    "व्यक्तिगत देखभाल दिनचर्या के भाग के रूप में दैनिक अंतरंग स्वच्छता का समर्थन करने के लिए सावधानीपूर्वक तैयार किया गया।",

  "Ayurvedic Liquid Soap": "आयुर्वेदिक लिक्विड सोप",
  "Ayurvedic Liquid Soap - Everyday Cleansing": "आयुर्वेदिक लिक्विड सोप - रोजमर्रा की सफाई",
  "A smooth liquid soap designed for everyday hand and body cleansing.":
    "रोजमर्रा के हाथ और शरीर की सफाई के लिए डिज़ाइन किया गया एक चिकना तरल साबुन।",

  "Herbal Foaming Face Cleanser": "हर्बल फ़ोमिंग फेस क्लींजर",
  "Herbal Foaming Face Cleanser - Fresh Feeling Skin": "हर्बल फ़ोमिंग फेस क्लींजर - ताज़ा अहसास वाली त्वचा",
  "A lightweight foaming cleanser created to support fresh and clean-feeling skin.":
    "ताज़ा और साफ अहसास वाली त्वचा का समर्थन करने के लिए बनाया गया एक हल्का फोमिंग क्लींजर।",

  "Daily Hygiene Combo": "डेली हाइजीन कॉम्बो",
  "Daily Hygiene Combo - Essential Personal Care Set": "डेली हाइजीन कॉम्बो - आवश्यक व्यक्तिगत देखभाल सेट",
  "A curated set of essential hygiene products designed for everyday personal care needs.":
    "रोजमर्रा की व्यक्तिगत देखभाल की जरूरतों के लिए डिज़ाइन किए गए आवश्यक स्वच्छता उत्पादों का एक क्यूरेटेड सेट।",

  "Piles Care": "पाइल्स केयर",
  "Piles Care - Relief, Comfort, Freedom": "पाइल्स केयर - राहत, आराम, स्वतंत्रता",
  "Piles Care Formula": "पाइल्स केयर फॉर्मूला",
  "Piles Care Formula - Relief & Comfort Support": "पाइल्स केयर फॉर्मूला - राहत और आराम समर्थन",
  "A traditional Ayurvedic blend designed to support daily digestive health and relief.":
    "दैनिक पाचन स्वास्थ्य और राहत का समर्थन करने के लिए बनाया गया एक पारंपरिक आयुर्वेदिक मिश्रण।",
  "Pure Shilajit": "शुद्ध शिलाजीत",
  "Pure Shilajit - Vitality and Vigor": "शुद्ध शिलाजीत - जीवन शक्ति और स्फूर्ति",

  "capsule": "कैप्सूल",
  "powder": "पाउडर",
  "tablet": "टैबलेट",
  "liquid": "तरल",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("tulsiveda_lang") as Language;
    if (saved === "en" || saved === "hi") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("tulsiveda_lang", lang);
    window.dispatchEvent(new Event("language-changed"));
  };

  const t = (key: string): string => {
    if (!key) return "";
    if (uiTranslations[key]) {
      return uiTranslations[key][language] || key;
    }
    const trimmed = key.trim();
    if (uiTranslations[trimmed]) {
      return uiTranslations[trimmed][language] || key;
    }
    if (language === "hi" && knownTextTranslations[key]) {
      return knownTextTranslations[key];
    }
    if (language === "hi" && knownTextTranslations[trimmed]) {
      return knownTextTranslations[trimmed];
    }
    return key;
  };

  const translateText = (text: string | null | undefined, altHi?: string | null): string => {
    if (language === "hi") {
      if (altHi && altHi.trim()) return altHi.trim();
      if (!text) return "";
      const trimmed = text.trim();
      if (knownTextTranslations[trimmed]) return knownTextTranslations[trimmed];
      if (knownTextTranslations[text]) return knownTextTranslations[text];
      if (uiTranslations[trimmed]) return uiTranslations[trimmed].hi || trimmed;
      if (uiTranslations[text]) return uiTranslations[text].hi || text;
    }
    return text || "";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
