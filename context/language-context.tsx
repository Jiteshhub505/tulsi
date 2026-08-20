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
  // Single Product Page
  "Customer Reviews": { en: "Customer Reviews", hi: "ग्राहक समीक्षाएं" },
  "Inclusive of all taxes • Free Shipping on Prepaid Orders": {
    en: "Inclusive of all taxes • Free Shipping on Prepaid Orders",
    hi: "सभी कर शामिल • प्रीपेड ऑर्डर पर मुफ़्त शिपिंग",
  },
  "You save 10% extra on this 2-Pack bundle!": {
    en: "You save 10% extra on this 2-Pack bundle!",
    hi: "आप इस 2-पैक बंडल पर 10% अतिरिक्त बचाते हैं!",
  },
  "10% EXTRA OFF": { en: "10% EXTRA OFF", hi: "10% अतिरिक्त छूट" },
  "10% OFF": { en: "10% OFF", hi: "10% छूट" },
  "Select Pack:": { en: "Select Pack:", hi: "पैक चुनें:" },
  "Single Pack (1 Bottle)": { en: "Single Pack (1 Bottle)", hi: "सिंगल पैक (1 बोतल)" },
  "Pack of 2 (SAVE EXTRA 10%)": { en: "Pack of 2 (SAVE EXTRA 10%)", hi: "2 का पैक (10% अतिरिक्त बचत)" },
  "Available": { en: "Available", hi: "उपलब्ध" },
  "Secure Payment": { en: "Secure Payment", hi: "सुरक्षित भुगतान" },
  "Free": { en: "Free", hi: "मुफ़्त" },
  "Delivery": { en: "Delivery", hi: "डिलिवरी" },
  "100% Ayurvedic": { en: "100% Ayurvedic", hi: "100% आयुर्वेदिक" },
  "Doctor Trusted": { en: "Doctor Trusted", hi: "डॉक्टरों द्वारा भरोसेमंद" },
  "Free Shipping": { en: "Free Shipping", hi: "मुफ़्त शिपिंग" },
  "Heavy Metal Tested": { en: "Heavy Metal Tested", hi: "हेवी मेटल टेस्टेड" },
  "Product Details:": { en: "Product Details:", hi: "उत्पाद विवरण:" },
  "Key Benefits": { en: "Key Benefits", hi: "मुख्य लाभ" },
  "Why You'll Love": { en: "Why You'll Love", hi: "आपको क्यों पसंद आएगा" },
  "Time-tested Ayurvedic herb wisdom refined for maximum absorption and daily endurance.": {
    en: "Time-tested Ayurvedic herb wisdom refined for maximum absorption and daily endurance.",
    hi: "अधिकतम अवशोषण और दैनिक सहनशक्ति के लिए तैयार किया गया पारंपरिक आयुर्वेदिक ज्ञान।",
  },
  "Real Results Backed by User Studies*": {
    en: "Real Results Backed by User Studies*",
    hi: "उपयोगकर्ता अध्ययनों द्वारा समर्थित वास्तविक परिणाम*",
  },
  "**Based on 6 weeks of consumer usage studies": {
    en: "**Based on 6 weeks of consumer usage studies",
    hi: "**6 सप्ताह के उपभोक्ता उपयोग अध्ययनों पर आधारित",
  },
  "Pure Herb Synergy": { en: "Pure Herb Synergy", hi: "शुद्ध जड़ी-बूटी तालमेल" },
  "Handpicked Ayurvedic Ingredients": {
    en: "Handpicked Ayurvedic Ingredients",
    hi: "चुनिंदा आयुर्वेदिक घटक",
  },
  "Every herb is standardized for active bio-compounds to ensure consistent strength in every dose.": {
    en: "Every herb is standardized for active bio-compounds to ensure consistent strength in every dose.",
    hi: "प्रत्येक जड़ी-बूटी को हर खुराक में निरंतर शक्ति सुनिश्चित करने के लिए मानकीकृत किया गया है।",
  },
  "Directions for Use": { en: "Directions for Use", hi: "उपयोग के निर्देश" },
  "Simple 3-Step Daily Routine": {
    en: "Simple 3-Step Daily Routine",
    hi: "सरल 3-चरणीय दैनिक दिनचर्या",
  },
  "STEP": { en: "STEP", hi: "चरण" },
  "Verified Reviews": { en: "Verified Reviews", hi: "सत्यापित समीक्षाएं" },
  "Customer Experiences": { en: "Customer Experiences", hi: "ग्राहकों के अनुभव" },
  "Based on 2,450+ verified buyers": {
    en: "Based on 2,450+ verified buyers",
    hi: "2,450+ सत्यापित खरीदारों पर आधारित",
  },
  "Verified Buyer": { en: "Verified Buyer", hi: "सत्यापित खरीदार" },
  "Got Questions?": { en: "Got Questions?", hi: "कोई प्रश्न हैं?" },
  "Frequently Asked Questions": {
    en: "Frequently Asked Questions",
    hi: "अक्सर पूछे जाने वाले प्रश्न",
  },

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

  // --- SINGLE PRODUCT DEFAULT RICH CONTENT TRANSLATIONS ---
  // Benefits Titles & Descriptions
  "100% Pure Herbal Extracts": "100% शुद्ध जड़ी-बूटी अर्क",
  "Formulated with premium wild-harvested Ayurvedic herbs, heavy-metal tested for maximum potency and safety.":
    "अधिकतम शक्ति और सुरक्षा के लिए हेवी-मेटल टेस्टेड, प्रीमियम जंगली आयुर्वेदिक जड़ी-बूटियों से निर्मित।",
  "Instant Vitality & Stamina": "त्वरित जीवन शक्ति और सहनशक्ति",
  "Provides sustained cellular energy and endurance without jitters, caffeine crashes, or artificial additives.":
    "कैफीन क्रैश या कृत्रिम एडिटिव्स के बिना निरंतर कोशिकीय ऊर्जा और सहनशक्ति प्रदान करता है।",
  "Immunity & Muscle Health": "प्रतिरक्षा और मांसपेशियों का स्वास्थ्य",
  "Nourishes deep bodily tissues (Dhatus) to promote rapid muscle recovery, joint comfort, and natural immunity.":
    "तेज मांसपेशियों की रिकवरी, जोड़ों के आराम और प्राकृतिक प्रतिरक्षा को बढ़ावा देने के लिए गहरे शारीरिक ऊतकों का पोषण करता है।",
  "Stress & Cortisol Balance": "तनाव और कॉर्टिसोल संतुलन",
  "Helps calm daily mental stress, balance cortisol levels, and promote restorative sleep and mood.":
    "दैनिक मानसिक तनाव को शांत करने, कॉर्टिसोल के स्तर को संतुलित करने और पुनर्स्थापनात्मक नींद को बढ़ावा देने में मदद करता है।",
  "Pure Himalayan Gold Formula": "शुद्ध हिमालयन स्वर्ण फॉर्मूला",
  "Formulated with 500mg purified Shilajit extract, Swarna Bhasma & Ashwagandha for 24/7 natural power.":
    "24/7 प्राकृतिक शक्ति के लिए 500mg शुद्ध शिलाजीत अर्क, स्वर्ण भस्म और अश्वगंधा के साथ तैयार किया गया।",
  "Muscle Strength & Vigor": "मांसपेशियों की ताकत और स्फूर्ति",
  "Nourishes muscle tissue (Mamsa Dhatu), promoting rapid workout recovery and physical endurance.":
    "मांसपेशियों के ऊतकों (मांस धातु) का पोषण करता है, जो त्वरित कसरत रिकवरी और सहनशक्ति को बढ़ावा देता है।",
  "Fights Fatigue & Cortisol Burnout": "थकान और कॉर्टिसोल बर्नआउट से लड़ता है",
  "Reduces daily physical exhaustion, mental stress, and brain fog for sharp daily focus.":
    "तीक्ष्ण दैनिक ध्यान केंद्रित करने के लिए दैनिक शारीरिक थकान, मानसिक तनाव और ब्रेन फॉग को कम करता है।",
  "84+ Ionic Mineral Absorption": "84+ आयोनिक खनिज अवशोषण",
  "High Fulvic Acid concentration guarantees maximum cellular absorption and tissue rejuvenation.":
    "उच्च फुल्विक एसिड सांद्रता अधिकतम कोशिकीय अवशोषण और ऊतक कायाकल्प की गारंटी देती है।",

  // Clinical Stats Labels
  "Users reported higher daily stamina & energy within 10 days":
    "उपयोगकर्ताओं ने 10 दिनों के भीतर उच्च दैनिक सहनशक्ति और ऊर्जा दर्ज की",
  "Noticed reduced muscle fatigue and faster workout recovery":
    "मांसपेशियों की थकान कम होने और तेजी से कसरत रिकवरी दर्ज की गई",
  "Experienced improved daily vitality and stress resistance":
    "सुधरे हुए दैनिक जीवन शक्ति और तनाव प्रतिरोध का अनुभव किया",
  "Reported 24/7 sustained physical power & endurance without energy slumps":
    "ऊर्जा में कमी के बिना 24/7 निरंतर शारीरिक शक्ति और सहनशक्ति दर्ज की गई",
  "Noticed enhanced testosterone levels & muscle power within 14 days":
    "14 दिनों के भीतर बढ़े हुए टेस्टोस्टेरोन स्तर और मांसपेशियों की शक्ति देखी गई",
  "Experienced faster workout recovery & zero heat digestive discomfort":
    "तेज वर्कआउट रिकवरी और शून्य पाचन असुविधा का अनुभव किया",
  "Reported reduced fluid retention & foot swelling within 14 days":
    "14 दिनों के भीतर द्रव प्रतिधारण और पैर की सूजन में कमी दर्ज की गई",
  "Noticed significant reduction in urinary burning & discomfort":
    "मूत्र जलन और असुविधा में महत्वपूर्ण कमी देखी गई",
  "Experienced improved daily renal filtration & creatinine balance":
    "सुधरे हुए दैनिक गुर्दे निस्पंदन और क्रिएटिनिन संतुलन का अनुभव किया",

  // Ingredient Names & Descriptions
  "Standardized KSM-66 root extract that reduces cortisol, boosts physical strength, and promotes mental calm.":
    "मानकीकृत KSM-66 जड़ अर्क जो कॉर्टिसोल को कम करता है, शारीरिक शक्ति को बढ़ाता है, और मानसिक शांति को बढ़ावा देता है।",
  "Rich in Fulvic Acid & 84+ essential minerals to amplify cellular ATP energy and stamina.":
    "कोशिकीय एटीपी ऊर्जा और सहनशक्ति को बढ़ाने के लिए फुल्विक एसिड और 84+ आवश्यक खनिजों से भरपूर।",
  "Shatavari": "शतावरी",
  "Rejuvenating adaptogenic herb that nourishes body tissues, supports hormonal balance, and vitality.":
    "कायाकल्प करने वाली एडाप्टोजेनिक जड़ी-बूटी जो शरीर के ऊतकों का पोषण करती है, हार्मोनल संतुलन और जीवन शक्ति का समर्थन करती है।",
  "Safed Musli": "सफेद मूसली",
  "Time-tested Ayurvedic tonic for enhancing physical endurance, muscle tone, and daily vigor.":
    "शारीरिक सहनशक्ति, मांसपेशियों की टोन और दैनिक स्फूर्ति बढ़ाने के लिए समय-परीक्षित आयुर्वेदिक टॉनिक।",
  "Amla Extract": "आंवला अर्क",
  "Loaded with natural Vitamin C for cellular antioxidant protection, immune defense, and digestion.":
    "कोशिकीय एंटीऑक्सीडेंट सुरक्षा, प्रतिरक्षा रक्षा और पाचन के लिए प्राकृतिक विटामिन सी से भरपूर।",
  "Gokshura": "गोक्षुर",
  "Promotes kidney health, fluid balance, muscle strength, and natural physical performance.":
    "गुर्दे के स्वास्थ्य, द्रव संतुलन, मांसपेशियों की ताकत और प्राकृतिक शारीरिक प्रदर्शन को बढ़ावा देता है।",
  "Pure Himalayan Shilajit Extract": "शुद्ध हिमालयन शिलाजीत अर्क",
  "Concentrated Grade-A Shilajit extract capsules rich in 75%+ Fulvic Acid & 84+ minerals.":
    "75%+ फुल्विक एसिड और 84+ खनिजों से भरपूर संकेंद्रित ग्रेड-ए शिलाजीत अर्क कैप्सूल।",
  "Swarna Bhasma (Gold Dust)": "स्वर्ण भस्म",
  "Classical Ayurvedic catalyst for cellular rejuvenation, tissue strength, and peak vigor.":
    "कोशिकीय कायाकल्प, ऊतक शक्ति और चरम स्फूर्ति के लिए शास्त्रीय आयुर्वेदिक उत्प्रेरक।",
  "Ashwagandha KSM-66": "अश्वगंधा KSM-66",
  "Standardized adaptogenic root extract that reduces cortisol and boosts muscle power.":
    "मानकीकृत एडाप्टोजेनिक जड़ अर्क जो कॉर्टिसोल को कम करता है और मांसपेशियों की शक्ति को बढ़ाता है।",

  // How To Use Steps
  "TAKE 1-2 CAPSULES DAILY": "प्रतिदिन 1-2 कैप्सूल लें",
  "Take 1-2 Capsules Daily": "प्रतिदिन 1-2 कैप्सूल लें",
  "Consume after breakfast or dinner with warm milk or fresh water.":
    "नाश्ते या रात के खाने के बाद गर्म दूध या ताजे पानी के साथ लें।",
  "STAY CONSISTENT FOR 30 DAYS": "30 दिनों तक निरंतर रहें",
  "Stay Consistent for 30 Days": "30 दिनों तक निरंतर रहें",
  "Ayurvedic adaptogens build up in your system to deliver maximum benefits.":
    "अधिकतम लाभ प्रदान करने के लिए आयुर्वेदिक एडाप्टोजेन्स आपके सिस्टम में निर्मित होते हैं।",
  "ENJOY PEAK ENERGY & VITALITY": "चरम ऊर्जा और स्फूर्ति का आनंद लें",
  "Enjoy Peak Energy & Vitality": "चरम ऊर्जा और स्फूर्ति का आनंद लें",
  "Experience sustained daily energy, muscle recovery, and overall wellness.":
    "निरंतर दैनिक ऊर्जा, मांसपेशियों की रिकवरी और समग्र कल्याण का अनुभव करें।",
  "Swallow 1 capsule after breakfast and 1 capsule after dinner.":
    "नाश्ते के बाद 1 कैप्सूल और रात के खाने के बाद 1 कैप्सूल निगलें।",
  "Consume with Warm Milk or Water": "गर्म दूध या पानी के साथ सेवन करें",
  "Drink with lukewarm milk or fresh water for optimal herb digestion.":
    "इष्टतम जड़ी-बूटी के पाचन के लिए गुनगुने दूध या ताजे पानी के साथ पीएं।",
  "Use Consistently for 60-90 Days": "60-90 दिनों तक लगातार उपयोग करें",
  "Builds up deep bodily tissue reserves for lasting strength and energy.":
    "स्थायी शक्ति और ऊर्जा के लिए गहरे शारीरिक ऊतक भंडार का निर्माण करता है।",

  // Review Comments & FAQs
  "Best Shilajit Gold Capsules! Easy to swallow, zero bitter taste, and gives noticeable daily energy within 5 days.":
    "बेस्ट शिलाजीत गोल्ड कैप्सूल! निगलने में आसान, शून्य कड़वा स्वाद, और 5 दिनों के भीतर ध्यान देने योग्य दैनिक ऊर्जा देता है।",
  "My workout stamina and recovery have improved significantly. Authentic Ayurvedic product!":
    "मेरी कसरत सहनशक्ति और रिकवरी में काफी सुधार हुआ है। प्रामाणिक आयुर्वेदिक उत्पाद!",
  "High Fulvic acid concentration. Excellent capsule formulation for daily endurance.":
    "उच्च फुल्विक एसिड सांद्रता। दैनिक सहनशक्ति के लिए उत्कृष्ट कैप्सूल फॉर्मूला।",

  // Kidney Care
  "Renal Detox & Fluid Balance": "रेनल डिटॉक्स और द्रव संतुलन",
  "Flushes out harmful renal toxins, excess uric acid, and water retention naturally.":
    "हानिकारक गुर्दे के विषाक्त पदार्थों, अतिरिक्त यूरिक एसिड और पानी के प्रतिधारण को स्वाभाविक रूप से बाहर निकालता है।",
  "Supports Kidney & Bladder Health": "गुर्दे और मूत्राशय के स्वास्थ्य का समर्थन करता है",
  "Rejuvenates renal nephrons and maintains healthy urinary tract lining and filtration.":
    "गुर्दे के नेफ्रॉन का कायाकल्प करता है और स्वस्थ मूत्र पथ की परत और निस्पंदन को बनाए रखता है।",
  "Reduces Swelling & Water Retention": "सूजन और जल प्रतिधारण को कम करता है",
  "Helps eliminate fluid buildup in feet, legs, and face by supporting balanced electrolyte levels.":
    "संतुलित इलेक्ट्रोलाइट स्तर का समर्थन करके पैरों, टांगों और चेहरे में तरल पदार्थ के संचय को खत्म करने में मदद करता है।",
  "Soothes Urinary Discomfort": "मूत्र संबंधी असुविधा को शांत करता है",
  "Cools the urinary tract, easing burning sensation and supporting healthy creatinine levels.":
    "मूत्र पथ को ठंडा करता है, जलन को शांत करता है और स्वस्थ क्रिएटिनिन स्तर का समर्थन करता है।",
  "Punarnava Extract": "पुनर्नवा अर्क",
  "Famous Ayurvedic herb ('re-newer') that supports kidney detox, fluid balance, and swelling reduction.":
    "प्रसिद्ध आयुर्वेदिक जड़ी-बूटी जो गुर्दे की डिटॉक्स, द्रव संतुलन और सूजन में कमी का समर्थन करती है।",
  "Gokshura (Puncture Vine)": "गोक्षुर",
  "Promotes smooth urinary flow, dissolves mineral deposits, and protects kidney nephrons.":
    "सुचारू मूत्र प्रवाह को बढ़ावा देता है, खनिज जमाव को घोलता है और गुर्दे के नेफ्रॉन की रक्षा करता है।",
  "Pashanbhed (Stone Breaker)": "पाषाणभेद",
  "Classical herb renowned for supporting renal stone clearance and bladder comfort.":
    "गुर्दे की पथरी की निकासी और मूत्राशय के आराम का समर्थन करने के लिए प्रसिद्ध शास्त्रीय जड़ी-बूटी।",
  "Varun Bark": "वरुण छाल",
  "Tones urinary tract lining, balances uric acid levels, and aids renal filtration.":
    "मूत्र पथ की परत को टोन करता है, यूरिक एसिड के स्तर को संतुलित करता है और गुर्दे के निस्पंदन में मदद करता है।",
  "Kasani (Chicory)": "कासनी",
  "Cools the renal tract and supports natural creatinine and urea elimination.":
    "गुर्दे के पथ को ठंडा करता है और प्राकृतिक क्रिएटिनिन और यूरिया उन्मूलन का समर्थन करता है।",
  "Take 1 Scoop (3-5g) Powder": "1 चम्मच (3-5 ग्राम) पाउडर लें",
  "Mix 1 teaspoon of Kidney Care Powder in 200ml lukewarm water.":
    "200 मिलीलीटर गुनगुने पानी में 1 चम्मच पाउडर मिलाएं।",
  "Consume Twice Daily After Meals": "भोजन के बाद दिन में दो बार सेवन करें",
  "Drink 30 minutes after breakfast and after dinner.":
    "नाश्ते और रात के खाने के 30 मिनट बाद पीएं।",
  "Stay Hydrated for 60-90 Days": "60-90 दिनों तक हाइड्रेटेड रहें",
  "Drink 3-4 liters of water daily for optimal renal detoxification.":
    "इष्टतम गुर्दे विषहरण के लिए प्रतिदिन 3-4 लीटर पानी पीएं।",

  // Piles Care
  "Pain, Swelling & Itching Relief": "दर्द, सूजन और खुजली से राहत",
  "Soothes anorectal inflammation, itching, and swollen veins for daily comfort.":
    "दैनिक आराम के लिए बवासीर की सूजन, खुजली और सूजी हुई नसों को शांत करता है।",
  "Controls Bleeding & Heals Fissures": "रक्तस्राव को नियंत्रित करता है और फिशर को ठीक करता है",
  "Natural astringent herbs stop rectal bleeding and repair mucosal tissue lining.":
    "प्राकृतिक कसैली जड़ी-बूटियाँ मलाशय के रक्तस्राव को रोकती हैं और श्लेष्मा ऊतक की परत की मरम्मत करती हैं।",
  "Natural Stool Softener": "प्राकृतिक मल सोफ्नर",
  "Softens hard stools to eliminate painful straining during daily bowel movements.":
    "दैनिक शौच के दौरान दर्दनाक खिंचाव को खत्म करने के लिए कठोर मल को नरम करता है।",
  "Shrinks Pile Mass Naturally": "बवासीर के मसों को प्राकृतिक रूप से सुखाता है",
  "Helps reduce swollen pile mass and prevents chronic anorectal recurrence.":
    "सूजे हुए बवासीर के मसों को कम करने में मदद करता है और दोबारा होने से रोकता है।",
  "Reported stop in rectal bleeding & acute pain within 5 days":
    "5 दिनों के भीतर मलाशय के रक्तस्राव और तीव्र दर्द में रोक दर्ज की गई",
  "Noticed significant reduction in swelling & itching":
    "सूजन और खुजली में महत्वपूर्ण कमी देखी गई",
  "Experienced smooth, pain-free daily bowel movements":
    "चिकने, दर्द-रहित दैनिक शौच का अनुभव किया",
  "Nagkesar Extract": "नागकेसर अर्क",
  "Potent Ayurvedic herb renowned for controlling rectal bleeding and soothing inflammation.":
    "मलाशय के रक्तस्राव को नियंत्रित करने और सूजन को शांत करने के लिए प्रसिद्ध शक्तिशाली आयुर्वेदिक जड़ी-बूटी।",
  "Jimikand (Elephant Yam)": "जिमीकंद",
  "Time-tested remedy for shrinking pile masses and toning anorectal tissue.":
    "बवासीर के मसों को सुखाने और ऊतकों को टोन करने के लिए समय-परीक्षित उपाय।",
  "Triphala Extract": "त्रिफला अर्क",
  "Softens hard stools, gently cleanses colon, and prevents chronic constipation.":
    "कठोर मल को नरम करता है, धीरे से आंत को साफ करता है, और पुरानी कब्ज को रोकता है।",
  "Shuddha Guggulu": "शुद्ध गुग्गुलु",
  "Anti-inflammatory resin that reduces vein swelling, discomfort, and tissue mass.":
    "सूजन-रोधी रेजिन जो नस की सूजन, असुविधा और मसों के द्रव्यमान को कम करता है।",
  "Neem Extract": "नीम अर्क",
  "Natural antiseptic herb that prevents anorectal infections and itching.":
    "प्राकृतिक एंटीसेप्टिक जड़ी-बूटी जो संक्रमण और खुजली को रोकती है।",
  "Consume with Lukewarm Water": "गुनगुने पानी के साथ सेवन करें",
  "Drink with warm water for fast herb absorption and bowel soothing.":
    "तेजी से जड़ी-बूटी के अवशोषण और आंत को आराम देने के लिए गर्म पानी के साथ पीएं।",
  "Pair with Fiber-Rich Diet": "फाइबर युक्त आहार के साथ लें",
  "Eat leafy greens, fruits, and drink 3-4 liters of water daily for smooth results.":
    "सुचारू परिणामों के लिए हरी पत्तेदार सब्जियां, फल खाएं और रोजाना 3-4 लीटर पानी पीएं।",

  // Iron & Liver
  "Liver Detox & Fatty Liver Relief": "लिवर डिटॉक्स और फैटी लिवर से राहत",
  "Cleanses hepatic toxins, supporting liver cell regeneration and fat metabolism.":
    "यकृत के विषाक्त पदार्थों को साफ करता है, यकृत कोशिका कायाकल्प और वसा चयापचय का समर्थन करता है।",
  "Boosts Hemoglobin & RBC Count": "हीमोग्लोबिन और आरबीसी की संख्या बढ़ाता है",
  "Natural bio-available iron (Mandur Bhasma) elevates hemoglobin without stomach upset.":
    "प्राकृतिक जैव-उपलब्ध लोहा (मंडूर भस्म) पेट खराब किए बिना हीमोग्लोबिन को बढ़ाता है।",
  "Enhances Appetite & Digestion": "भूख और पाचन को बढ़ाता है",
  "Stimulates bile secretion and digestive enzymes for optimal food absorption.":
    "इष्टतम भोजन अवशोषण के लिए पित्त स्राव और पाचन एंजाइमों को उत्तेजित करता है।",
  "Protects Hepatic Cells Against Toxins": "विषाक्त पदार्थों के खिलाफ लिवर कोशिकाओं की रक्षा करता है",
  "Defends liver tissue against alcohol damage, prescription drugs, and viral stress.":
    "शराब के नुकसान, दवाओं और तनाव से लिवर के ऊतकों की रक्षा करता है।",
  "Reported noticeable boost in daily appetite & energy in 7 days":
    "7 दिनों में दैनिक भूख और ऊर्जा में ध्यान देने योग्य वृद्धि दर्ज की गई",
  "Experienced significant hemoglobin improvement within 3-4 weeks":
    "3-4 सप्ताह के भीतर महत्वपूर्ण हीमोग्लोबिन सुधार का अनुभव किया",
  "Noticed reduced abdominal heaviness & fatty liver symptoms":
    "पेट के भारीपन और फैटी लिवर के लक्षणों में कमी देखी गई",
  "Bhumi Amla Extract": "भूमि आंवला अर्क",
  "Gold standard Ayurvedic herb for liver cell repair, jaundice protection, and enzyme balance.":
    "लिवर कोशिका की मरम्मत, पीलिया सुरक्षा और एंजाइम संतुलन के लिए गोल्ड स्टैंडर्ड आयुर्वेदिक जड़ी-बूटी।",
  "Kalmegh (King of Bitters)": "कालमेघ",
  "Detoxifies hepatic tissues, stimulates bile flow, and combats liver inflammation.":
    "यकृत के ऊतकों को डिटॉक्स करता है, पित्त के प्रवाह को उत्तेजित करता है और लिवर की सूजन से लड़ता है।",
  "Mandur Bhasma (Ayurvedic Iron)": "मंडूर भस्म",
  "Classical non-constipating iron preparation that rapidly boosts RBC count and stamina.":
    "शास्त्रीय गैर-कब्ज कारक लौह तैयारी जो तेजी से आरबीसी गिनती और सहनशक्ति बढ़ाती है।",
  "Take 1-2 Teaspoons Syrup or Capsules": "1-2 चम्मच सिरप या कैप्सूल लें",
  "Consume 30 minutes after your main meals.": "अपने मुख्य भोजन के 30 मिनट बाद सेवन करें।",
  "Consume Twice Daily with Water": "पानी के साथ दिन में दो बार सेवन करें",
  "Drink after lunch and after dinner for optimal liver absorption.":
    "इष्टतम यकृत अवशोषण के लिए दोपहर के भोजन और रात के खाने के बाद पीएं।",
  "Restores healthy liver enzymes, appetite, and hemoglobin levels.":
    "स्वस्थ यकृत एंजाइम, भूख और हीमोग्लोबिन के स्तर को पुनर्स्थापित करता है।",

  // Ayur Shakti Pain Oil
  "Instant Deep Transdermal Warmth": "त्वरित गहरी ट्रांसडर्मल गर्मी",
  "Fast-absorbing warm herbal oil that penetrates deep to soothe joint, muscle & nerve pain.":
    "तेजी से अवशोषित होने वाला गर्म हर्बल तेल जो जोड़ों, मांसपेशियों और तंत्रिका दर्द को शांत करने के लिए गहराई में प्रवेश करता है।",
  "Relieves Joint Swelling & Stiffness": "जोड़ों की सूजन और जकड़न से राहत देता है",
  "Eases morning knee stiffness, backaches, cervical tightness, and muscle spasms.":
    "सुबह के समय घुटने की जकड़न, पीठ दर्द, सर्वाइकल जकड़न और मांसपेशियों की ऐंठन को कम करता है।",
  "Enhances Joint Mobility & Lubrication": "जोड़ों की गतिशीलता और स्नेहन को बढ़ाता है",
  "Nourishes joint cartilage and promotes flexible, smooth physical movement.":
    "जोड़ों की उपास्थि का पोषण करता है और लचीली, सुचारू शारीरिक हलचल को बढ़ावा देता है।",
  "100% Herbal & Non-Greasy": "100% हर्बल और गैर-चिपचिपा",
  "Fast-absorbing Ayurvedic formula with zero sticky residue or harsh skin irritation.":
    "बिना किसी चिपचिपे अवशेष या त्वचा की जलन के तेजी से अवशोषित होने वाला आयुर्वेदिक फॉर्मूला।",
  "Reported warm pain relief within 15 minutes of gentle application":
    "हल्के मालिश के 15 मिनट के भीतर गर्म दर्द से राहत दर्ज की गई",
  "Noticed reduced knee stiffness & improved walking mobility in 5 days":
    "5 दिनों में घुटने की जकड़न में कमी और चलने की गतिशीलता में सुधार देखा गया",
  "Experienced long-lasting back pain & muscle spasm relief":
    "लंबे समय तक रहने वाले पीठ दर्द और मांसपेशियों की ऐंठन से राहत का अनुभव किया",
  "Mahanarayan Oil": "महानारायण तेल",
  "Classic Ayurvedic medicated oil for deep joint nourishment, nerve pain, and arthritis relief.":
    "गहरे जोड़ों के पोषण, तंत्रिका दर्द और गठिया से राहत के लिए क्लासिक आयुर्वेदिक औषधीय तेल।",
  "Gandhapura Oil (Wintergreen)": "गंधपुरा तेल",
  "Natural Methyl Salicylate source that acts as a natural analgesic for instant warm relief.":
    "प्राकृतिक मिथाइल सैलिसिलेट स्रोत जो त्वरित गर्म राहत के लिए प्राकृतिक एनाल्जेसिक के रूप में कार्य करता है।",
  "Karpura (Camphor)": "कर्पूर",
  "Cool-to-warm counter-irritant that stimulates local blood flow and reduces stiffness.":
    "ठंडा-से-गर्म प्रति-उत्तेजक जो स्थानीय रक्त प्रवाह को उत्तेजित करता है और जकड़न को कम करता है।",
  "Nilgiri Oil (Eucalyptus)": "नीलगिरी तेल",
  "Anti-inflammatory essential oil that calms muscle soreness, inflammation, and tightness.":
    "सूजन रोधी आवश्यक तेल जो मांसपेशियों के दर्द, सूजन और जकड़न को शांत करता है।",
  "Til Oil (Sesame Base)": "तिल का तेल",
  "Deep penetrating Ayurvedic base oil that transports herbal bio-compounds into joint tissues.":
    "गहराई से प्रवेश करने वाला आयुर्वेदिक बेस ऑयल जो जोड़ों के ऊतकों में हर्बल जैव-यौगिकों का परिवहन करता है।",
  "Pour 5-10ml Ayur Shakti Oil": "5-10ml आयुर् शक्ति तेल डालें",
  "Take a small amount of warm pain oil onto your palm.":
    "अपनी हथेली पर थोड़ी मात्रा में गर्म दर्द निवारक तेल लें।",
  "Gentle Circular Massage": "हल्की गोलाकार मालिश",
  "Apply onto the affected joint or muscle area and massage gently for 5-10 minutes.":
    "प्रभावित जोड़ या मांसपेशियों के क्षेत्र पर लगाएं और 5-10 मिनट तक धीरे से मालिश करें।",
  "Apply Warm Compress for Best Results": "सर्वोत्तम परिणामों के लिए गर्म सेक लगाएं",
  "Cover with a warm towel or cloth twice daily for rapid joint comfort.":
    "तेज जोड़ों के आराम के लिए दिन में दो बार गर्म तौलिये या कपड़े से ढकें।",

  // Digestion, Fitness & Joint Care
  "100% Herbal Gut Relief": "100% हर्बल पेट की राहत",
  "Soothes stomach lining, relieving acidity, gas, and abdominal bloating naturally.":
    "पेट की परत को शांत करता है, एसिडिटी, गैस और पेट की सूजन को स्वाभाविक रूप से दूर करता है।",
  "Saunf & Jeera": "सौंफ और जीरा",
  "Cools the digestive tract, preventing acid reflux and heavy stomach fullness.":
    "पाचन तंत्र को ठंडा करता है, एसिड रिफ्लक्स और पेट के भारीपन को रोकता है।",
  "Sunthi (Ginger)": "सोंठ (अदरक)",
  "Kindles digestive fire (Agni) and reduces nausea and sluggish gut movement.":
    "पाचन अग्नि को प्रज्वलित करता है और मतली तथा सुस्त आंतों की हलचल को कम करता है।",
  "Take 1-2 Capsules / 1 Spoon": "1-2 कैप्सूल / 1 चम्मच लें",
  "Consume after lunch or dinner with lukewarm water.":
    "दोपहर या रात के खाने के बाद गुनगुने पानी के साथ सेवन करें।",
  "Stay Hydrated Throughout the Day": "दिन भर हाइड्रेटेड रहें",
  "Allows natural digestive herbs to cleanse gut toxin buildup (Ama).":
    "प्राकृतिक पाचन जड़ी-बूटियों को आंतों के विषाक्त पदार्थों (आम) की सफाई करने की अनुमति देता है।",
  "Enjoy Acidity-Free Light Living": "एसिडिटी-मुक्त हल्के जीवन का आनंद लें",
  "Feel light, comfortable, and energetic after every daily meal.":
    "हर दैनिक भोजन के बाद हल्का, आरामदायक और ऊर्जावान महसूस करें।",

  "Anabolic Muscle Growth": "एनाबॉलिक मांसपेशियों का विकास",
  "Nourishes muscle tissue (Mamsa Dhatu) for clean strength gain and stamina.":
    "स्वच्छ शक्ति लाभ और सहनशक्ति के लिए मांसपेशियों के ऊतकों (मांस धातु) का पोषण करता है।",
  "Nutrient & Protein Synthesis": "पोषक तत्व और प्रोटीन संश्लेषण",
  "Enhances metabolic absorption so your body utilizes maximum workout nutrition.":
    "चयापचय अवशोषण को बढ़ाता है ताकि आपका शरीर अधिकतम कसरत पोषण का उपयोग करे।",
  "Natural Fitness Energy": "प्राकृतिक फिटनेस ऊर्जा",
  "Sustained cellular vigor for intense gym workouts without synthetic stimulants.":
    "सिंथेटिक उत्तेजक पदार्थों के बिना तीव्र जिम वर्कआउट के लिए निरंतर कोशिकीय स्फूर्ति।",
  "Faster Workout Recovery": "तेज वर्कआउट रिकवरी",
  "Reduces post-workout muscle soreness and restores physical stamina rapidly.":
    "वर्कआउट के बाद मांसपेशियों के दर्द को कम करता है और शारीरिक सहनशक्ति को तेजी से पुनर्स्थापित करता है।",
  "Vidarikand": "विदारीकंद",
  "Ayurvedic herb renowned for healthy weight gain and anabolic muscle tone.":
    "स्वस्थ वजन बढ़ाने और एनाबॉलिक मांसपेशियों की टोन के लिए प्रसिद्ध आयुर्वेदिक जड़ी-बूटी।",
  "Take 1 Scoop or 2 Capsules": "1 चम्मच या 2 कैप्सूल लें",
  "Mix with 250ml warm milk or water after workout or breakfast.":
    "वर्कआउट या नाश्ते के बाद 250ml गर्म दूध या पानी में मिलाएं।",
  "Pair with High-Nutrient Diet": "उच्च-पोषक आहार के साथ लें",
  "Combine with protein-rich food and daily physical activity.":
    "प्रोटीन युक्त भोजन और दैनिक शारीरिक गतिविधि के साथ मिलाएं।",
  "Achieve Peak Fitness & Muscle Strength": "चरम फिटनेस और मांसपेशियों की ताकत हासिल करें",
  "Noticeable strength gains, stamina, and healthy body composition.":
    "ध्यान देने योग्य शक्ति लाभ, सहनशक्ति और स्वस्थ शरीर संरचना।",

  "Targeted Joint & Organ Relief": "लक्षित जोड़ों और अंगों को राहत",
  "Soothes systemic inflammation, joint stiffness, and chronic bodily discomfort.":
    "प्रणालीगत सूजन, जोड़ों की जकड़न और पुराने शारीरिक कष्ट को शांत करता है।",
  "Ayurvedic Cellular Protection": "आयुर्वेदिक कोशिकीय सुरक्षा",
  "Antioxidant-rich herbs defend vital tissues against oxidative stress and wear.":
    "एंटीऑक्सीडेंट से भरपूर जड़ी-बूटियाँ महत्वपूर्ण ऊतकों की रक्षा करती हैं।",
  "Restores Daily Mobility": "दैनिक गतिशीलता को पुनर्स्थापित करता है",
  "Promotes joint flexibility, cartilage lubrication, and ease of physical movement.":
    "जोड़ों के लचीलेपन, उपास्थि के स्नेहन और शारीरिक हलचल में आसानी को बढ़ावा देता है।",
  "Improves Quality of Life": "जीवन की गुणवत्ता में सुधार करता है",
  "Reduces daily aches, morning stiffness, and chronic fatigue for active living.":
    "सक्रिय जीवन के लिए दैनिक दर्द, सुबह की जकड़न और पुरानी थकान को कम करता है।",
  "Shallaki (Boswellia)": "शल्लाकी",
  "Potent anti-inflammatory herb that protects joint cartilage and reduces pain.":
    "शक्तिशाली सूजन-रोधी जड़ी-बूटी जो जोड़ों के उपास्थि की रक्षा करती है और दर्द को कम करती है।",
  "Nirgundi Extract": "निर्गुंडी अर्क",
  "Traditional Ayurvedic herb for relieving joint swelling, muscle spasms, and aches.":
    "जोड़ों की सूजन, मांसपेशियों की ऐंठन और दर्द से राहत के लिए पारंपरिक आयुर्वेदिक जड़ी-बूटी।",
  "Guggulu Purified": "गुग्गुलु शुद्ध",
  "Cleanses circulatory channels, clears inflammatory toxins, and strengthens joints.":
    "संचार नलिकाओं को साफ करता है, सूजन संबंधी विषाक्त पदार्थों को हटाता है और जोड़ों को मजबूत करता है।",
  "Hadjjod": "हड़जोड़",
  "Promotes bone mineral density, joint structural integrity, and tissue repair.":
    "अस्थि खनिज घनत्व, जोड़ों की संरचनात्मक अखंडता और ऊतक मरम्मत को बढ़ावा देता है।",
  "Take 1-2 Capsules Twice Daily": "दिन में दो बार 1-2 कैप्सूल लें",
  "Consume after breakfast and dinner with lukewarm water.":
    "नाश्ते और रात के खाने के बाद गुनगुने पानी के साथ लें।",
  "Keep a 30-Min Gap from Allopathy": "एलोपैथी से 30 मिनट का अंतर रखें",
  "Maintains optimal herb absorption without interference.":
    "बिना किसी हस्तक्षेप के इष्टतम जड़ी-बूटी अवशोषण बनाए रखता है।",
  "Experience Pain-Free Daily Mobility": "दर्द-रहित दैनिक गतिशीलता का अनुभव करें",
  "Sustained joint comfort, flexible movement, and active daily life.":
    "निरंतर जोड़ों का आराम, लचीली हलचल और सक्रिय दैनिक जीवन।",

  // FAQ Questions & Answers for ALL Products & Categories
  "How soon can I expect to see results with Ved Shakti ?": "वेद शक्ति के साथ मैं कितनी जल्दी परिणाम की उम्मीद कर सकता हूं?",
  "How soon can I expect to see results with Ved Shakti?": "वेद शक्ति के साथ मैं कितनी जल्दी परिणाम की उम्मीद कर सकता हूं?",
  "How soon can I expect to see results with Veda Shakti ?": "वेद शक्ति के साथ मैं कितनी जल्दी परिणाम की उम्मीद कर सकता हूं?",
  "How soon can I expect to see results with Veda Shakti?": "वेद शक्ति के साथ मैं कितनी जल्दी परिणाम की उम्मीद कर सकता हूं?",

  "Is Ved Shakti 100% natural and safe?": "क्या वेद शक्ति 100% प्राकृतिक और सुरक्षित है?",
  "Is Ved Shakti 100% natural and safe ?": "क्या वेद शक्ति 100% प्राकृतिक और सुरक्षित है?",
  "Is Veda Shakti 100% natural and safe?": "क्या वेद शक्ति 100% प्राकृतिक और सुरक्षित है?",
  "Is Veda Shakti 100% natural and safe ?": "क्या वेद शक्ति 100% प्राकृतिक और सुरक्षित है?",

  "What is the recommended daily dosage?": "अनुशंसित दैनिक खुराक क्या है?",

  // Piles Care FAQs
  "Is it effective for both internal and external piles?": "क्या यह आंतरिक और बाहरी दोनों तरह की बवासीर के लिए प्रभावी है?",
  "How long until I see noticeable relief from itching and pain?": "खुजली और दर्द से ध्यान देने योग्य राहत मिलने में कितना समय लगता है?",
  "Yes! The synergistic blend of Jimikand, Neem, and Triphala works internally to shrink pile mass and ease constipation for both internal and external piles.":
    "हाँ! जिमीकंद, नीम और त्रिफला का सहक्रियात्मक मिश्रण आंतरिक और बाहरी दोनों बवासीर के लिए मसों को सुखाने और कब्ज से राहत देने के लिए काम करता है।",
  "Most users report significant reduction in pain, bleeding, and itching within 3 to 7 days of regular daily use.":
    "अधिकांश उपयोगकर्ता नियमित दैनिक उपयोग के 3 से 7 दिनों के भीतर दर्द, रक्तस्राव और खुजली में महत्वपूर्ण कमी दर्ज करते हैं।",

  // Kidney Care FAQs
  "Is it safe for individuals concerned with creatinine or uric acid?":
    "क्या यह क्रिएटिनिन या यूरिक एसिड से चिंतित व्यक्तियों के लिए सुरक्षित है?",
  "How long should Kidney Powder be consumed?":
    "किडनी पाउडर का सेवन कितने समय तक करना चाहिए?",
  "Yes! The synergistic herbal blend of Varun, Kasani, and Punarnava naturally supports renal filtration rate and uric acid clearance.":
    "हाँ! वरुण, कासनी और पुनर्नवा का सहक्रियात्मक हर्बल मिश्रण स्वाभाविक रूप से गुर्दे की निस्पंदन दर और यूरिक एसिड निकासी का समर्थन करता है।",
  "We recommend consistent daily use for 60 to 90 days along with adequate daily water intake for best long-term renal health.":
    "हम सर्वोत्तम दीर्घकालिक गुर्दे के स्वास्थ्य के लिए पर्याप्त दैनिक पानी के सेवन के साथ 60 से 90 दिनों तक लगातार दैनिक उपयोग की सलाह देते हैं।",

  // Iron & Liver FAQs
  "Will this iron formula cause constipation or stomach cramps?":
    "क्या यह आयरन फॉर्मूला कब्ज या पेट में ऐंठन का कारण बनेगा?",
  "How long until I see improvement in energy and hemoglobin?":
    "ऊर्जा और हीमोग्लोबिन में सुधार देखने में कितना समय लगेगा?",
  "No! Unlike synthetic iron tablets, our Mandur Bhasma and Punarnava herbal blend is gentle on the stomach and non-constipating.":
    "नहीं! सिंथेटिक आयरन गोलियों के विपरीत, हमारा मंडूर भस्म और पुनर्नवा हर्बल मिश्रण पेट पर सौम्य और गैर-कब्ज कारक है।",
  "Most users notice boosted appetite and energy within 7 days, with visible hemoglobin progress in 3 to 4 weeks.":
    "अधिकांश उपयोगकर्ता 7 दिनों के भीतर बढ़ी हुई भूख और ऊर्जा महसूस करते हैं, और 3 से 4 सप्ताह में दृश्यमान हीमोग्लोबिन प्रगति देखते हैं।",

  // Pain Oil FAQs
  "Can this oil be used for chronic knee pain and backache?":
    "क्या इस तेल का उपयोग घुटने के पुराने दर्द और पीठ दर्द के लिए किया जा सकता है?",
  "Is it non-sticky and safe for sensitive skin?":
    "क्या यह गैर-चिपचिपा है और संवेदनशील त्वचा के लिए सुरक्षित है?",
  "Yes! Ayur Shakti is specially formulated with Mahanarayan and Gandhapura oils for severe knee pain, backaches, sciatica, and cervical stiffness.":
    "हाँ! आयुर् शक्ति विशेष रूप से घुटने के गंभीर दर्द, पीठ दर्द, साइटिका और सर्वाइकल की जकड़न के लिए महानारायण और गंधपुरा तेलों के साथ तैयार की गई है।",
  "Yes, it is 100% natural, fast-absorbing, non-sticky, and gentle on all skin types.":
    "हाँ, यह 100% प्राकृतिक, तेज़ी से अवशोषित होने वाला, गैर-चिपचिपा और सभी प्रकार की त्वचा पर सौम्य है।",

  // Digestion, Fitness & Joint Care FAQs
  "Is it safe for daily long-term use?": "क्या यह दैनिक दीर्घकालिक उपयोग के लिए सुरक्षित है?",
  "When is the best time to consume it?": "इसके सेवन का सबसे अच्छा समय क्या है?",
  "Can both men and women take this for fitness?": "क्या पुरुष और महिला दोनों इसे फिटनेस के लिए ले सकते हैं?",
  "How long to see noticeable muscle strength gains?": "मांसपेशियों की ताकत में ध्यान देने योग्य लाभ देखने में कितना समय लगेगा?",
  "Can I take this alongside my existing prescription medicines?": "क्या मैं इसे अपनी मौजूदा एलोपैथिक दवाओं के साथ ले सकता हूं?",
  "How long should I consume this product?": "मुझे इस उत्पाद का सेवन कितने समय तक करना चाहिए?",

  "Yes, keep a 30-minute gap between taking this Ayurvedic supplement and allopathic medicines.":
    "हाँ, इस आयुर्वेदिक सप्लीमेंट और एलोपैथिक दवाओं को लेने के बीच 30 मिनट का अंतर रखें।",
  "We recommend taking it consistently for 60 to 90 days for long-lasting joint strength and cellular relief.":
    "हम लंबे समय तक चलने वाले जोड़ों की ताकत और कोशिकीय राहत के लिए लगातार 60 से 90 दिनों तक इसे लेने की सलाह देते हैं।",
  "Yes! It is 100% natural, non-habit-forming, and free from synthetic laxatives or harsh chemicals.":
    "हाँ! यह 100% प्राकृतिक, गैर-आदत बनाने वाला और सिंथेटिक लैक्सेटिव या कठोर रसायनों से मुक्त है।",
  "We recommend consuming 1 dose 30 minutes after your main meals (lunch and dinner) with warm water.":
    "हम अपने मुख्य भोजन (दोपहर के भोजन और रात के खाने) के 30 मिनट बाद गर्म पानी के साथ 1 खुराक लेने की सलाह देते हैं।",
  "Yes, adaptogenic herbs like Ashwagandha and Shatavari support physical strength and vitality for both men and women.":
    "हाँ, अश्वगंधा और शतावरी जैसी एडाप्टोजेनिक जड़ी-बूटियाँ पुरुषों और महिलाओं दोनों के लिए शारीरिक शक्ति और जीवन शक्ति का समर्थन करती हैं।",

  "Most users notice an increase in daily energy, stamina, and reduced fatigue within 7 to 10 days of consistent daily use.":
    "अधिकांश उपयोगकर्ता लगातार दैनिक उपयोग के 7 से 10 दिनों के भीतर दैनिक ऊर्जा, सहनशक्ति और कम थकान में वृद्धि देखते हैं।",
  "Yes! Ved Shakti is made from 100% pure Ayurvedic herb extracts, chemical-free, lab-tested for heavy metals, and safe for long-term daily use.":
    "हाँ! वेद शक्ति 100% शुद्ध आयुर्वेदिक जड़ी बूटी के अर्क से बनी है, रसायन मुक्त है, हेवी मेटल टेस्टेड है और लंबे समय तक दैनिक उपयोग के लिए सुरक्षित है।",
  "Yes! Veda Shakti is made from 100% pure Ayurvedic herb extracts, chemical-free, lab-tested for heavy metals, and safe for long-term daily use.":
    "हाँ! वेद शक्ति 100% शुद्ध आयुर्वेदिक जड़ी बूटी के अर्क से बनी है, रसायन मुक्त है, हेवी मेटल टेस्टेड है और लंबे समय तक दैनिक उपयोग के लिए सुरक्षित है।",
  "Take 1 capsule twice daily after meals with warm milk or water, or as directed by your healthcare professional.":
    "भोजन के बाद दिन में दो बार 1 कैप्सूल गर्म दूध या पानी के साथ लें, या अपने डॉक्टर के निर्देशानुसार लें।",
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

      // Dynamic Questions Regex Fallbacks
      if (/internal and external piles/i.test(trimmed)) {
        return "क्या यह आंतरिक और बाहरी दोनों तरह की बवासीर के लिए प्रभावी है?";
      }
      if (/relief from itching and pain/i.test(trimmed)) {
        return "खुजली और दर्द से ध्यान देने योग्य राहत मिलने में कितना समय लगता है?";
      }
      if (/bleeding and severe pain/i.test(trimmed)) {
        return "यह मलाशय के रक्तस्राव और दर्द में कैसे मदद करता है?";
      }
      if (/creatinine or uric acid/i.test(trimmed)) {
        return "क्या यह क्रिएटिनिन या यूरिक एसिड से चिंतित व्यक्तियों के लिए सुरक्षित है?";
      }
      if (/fatty liver and sluggish digestion/i.test(trimmed)) {
        return "यह फैटी लिवर और सुस्त पाचन में कैसे मदद करता है?";
      }
      if (/constipation or stomach cramps/i.test(trimmed)) {
        return "क्या यह आयरन फॉर्मूला कब्ज या पेट में ऐंठन का कारण बनेगा?";
      }
      if (/energy and hemoglobin/i.test(trimmed)) {
        return "ऊर्जा और हीमोग्लोबिन में सुधार देखने में कितना समय लगेगा?";
      }
      if (/chronic knee pain and backache/i.test(trimmed)) {
        return "क्या इस तेल का उपयोग घुटने के पुराने दर्द और पीठ दर्द के लिए किया जा सकता है?";
      }
      if (/non-sticky and safe for sensitive skin/i.test(trimmed)) {
        return "क्या यह गैर-चिपचिपा है और संवेदनशील त्वचा के लिए सुरक्षित है?";
      }
      if (/prescription medicines/i.test(trimmed)) {
        return "क्या मैं इसे अपनी मौजूदा दवाओं के साथ ले सकता हूं?";
      }
      if (/how soon can i expect to see results/i.test(trimmed)) {
        return "मैं कितनी जल्दी परिणाम की उम्मीद कर सकता हूं?";
      }
      if (/100% natural and safe/i.test(trimmed)) {
        return "क्या यह 100% प्राकृतिक और सुरक्षित है?";
      }
      if (/what is the recommended daily dosage/i.test(trimmed)) {
        return "अनुशंसित दैनिक खुराक क्या है?";
      }
      if (/are .* capsules 100% vegetarian/i.test(trimmed)) {
        return "क्या ये कैप्सूल 100% शाकाहारी और प्राकृतिक हैं?";
      }
      if (/what is the best time to take/i.test(trimmed)) {
        return "सेवन करने का सबसे अच्छा समय क्या है?";
      }
      if (/are there any chemical steroids/i.test(trimmed)) {
        return "क्या इसमें कोई रासायनिक स्टेरॉयड या भारी धातुएं हैं?";
      }
      if (/how does .* help with/i.test(trimmed)) {
        return "यह राहत दिलाने में कैसे मदद करता है?";
      }
      if (/how long should .* be consumed/i.test(trimmed)) {
        return "इसका सेवन कितने समय तक करना चाहिए?";
      }

      // Dynamic Answers Regex Fallbacks
      if (/100% plant-based HPMC vegetarian capsule/i.test(trimmed)) {
        return "हाँ! इसमें 100% वनस्पति-आधारित एचपीएमसी शाकाहारी कैप्सूल शेल का उपयोग किया गया है, जिसमें बिना किसी सिंथेटिक एडिटिव्स के शुद्ध प्राकृतिक अर्क शामिल है।";
      }
      if (/in the morning after breakfast and 1 capsule/i.test(trimmed)) {
        return "हम सुबह नाश्ते के बाद 1 कैप्सूल और रात को खाने के बाद 1 कैप्सूल गर्म दूध या पानी के साथ लेने की सलाह देते हैं।";
      }
      if (/zero chemical steroids or heavy metals/i.test(trimmed)) {
        return "शून्य रासायनिक स्टेरॉयड या भारी धातुएं! प्रत्येक बैच शुद्धता और सुरक्षा के लिए एनएबीएल मान्यता प्राप्त प्रयोगशाला परीक्षण से गुजरता है।";
      }
      if (/punarnava and gokshura, natural diuretic/i.test(trimmed)) {
        return "इसमें पुनर्नवा और गोक्षुर शामिल हैं, जो प्राकृतिक मूत्रवर्धक आयुर्वेदिक जड़ी-बूटियाँ हैं जो शरीर के ऊतकों से अतिरिक्त सोडियम, जल प्रतिधारण और यूरिक एसिड को बाहर निकालती हैं।";
      }
      if (/varun, kasani, and punarnava naturally/i.test(trimmed)) {
        return "हाँ! वरुण, कासनी और पुनर्नवा का सहक्रियात्मक हर्बल मिश्रण स्वाभाविक रूप से गुर्दे की निस्पंदन दर का समर्थन करता है।";
      }
      if (/adequate daily water intake for best long-term/i.test(trimmed)) {
        return "हम इष्टतम गुर्दे के स्वास्थ्य के लिए पर्याप्त दैनिक पानी के सेवन के साथ 60 से 90 दिनों तक लगातार उपयोग की सलाह देते हैं।";
      }
      if (/nagkesar and shuddha guggulu/i.test(trimmed)) {
        return "इसमें नागकेसर और शुद्ध गुग्गुलु शामिल हैं जो शौच के दौरान मलाशय के रक्तस्राव को रोकते हैं और नसों की सूजन को कम करते हैं।";
      }
      if (/jimikand, neem, and triphala/i.test(trimmed)) {
        return "हाँ! जिमीकंद, नीम और त्रिफला का सहक्रियात्मक मिश्रण आंतरिक और बाहरी दोनों बवासीर के लिए मसों को सुखाने और कब्ज से राहत देने के लिए काम करता है।";
      }
      if (/reduction in pain, bleeding, and itching/i.test(trimmed)) {
        return "अधिकांश उपयोगकर्ता नियमित दैनिक उपयोग के 3 से 7 दिनों के भीतर दर्द, रक्तस्राव और खुजली में महत्वपूर्ण कमी दर्ज करते हैं।";
      }
      if (/bhumi amla and kalmegh/i.test(trimmed)) {
        return "इसमें भूमि आंवला और कालमेघ शामिल हैं जो पित्त उत्पादन को उत्तेजित करते हैं, अतिरिक्त यकृत वसा को तोड़ते हैं और पाचन एंजाइमों को पुनर्स्थापित करते हैं।";
      }
      if (/gentle on the stomach and non-constipating/i.test(trimmed)) {
        return "नहीं! सिंथेटिक आयरन गोलियों के विपरीत, हमारा मंडूर भस्म और पुनर्नवा हर्बल मिश्रण पेट पर सौम्य और गैर-कब्ज कारक है।";
      }
      if (/boosted appetite and energy within 7 days/i.test(trimmed)) {
        return "अधिकांश उपयोगकर्ता 7 दिनों के भीतर बढ़ी हुई भूख और ऊर्जा महसूस करते हैं, और 3 से 4 सप्ताह में दृश्यमान हीमोग्लोबिन सुधार देखते हैं।";
      }
      if (/transdermal micro-absorption/i.test(trimmed)) {
        return "गहरी सूक्ष्म-अवशोषण के कारण, अधिकांश उपयोगकर्ता हल्की मालिश के 10 से 15 मिनट के भीतर एक सुखद गर्म राहत महसूस करते हैं।";
      }
      if (/mahanarayan and gandhapura oils/i.test(trimmed)) {
        return "हाँ! यह विशेष रूप से घुटने के गंभीर दर्द, पीठ दर्द, साइटिका और सर्वाइकल की जकड़न के लिए महानारायण और गंधपुरा तेलों के साथ तैयार किया गया है।";
      }
      if (/fast-absorbing, non-sticky, and gentle/i.test(trimmed)) {
        return "हाँ, यह 100% प्राकृतिक, तेज़ी से अवशोषित होने वाला, गैर-चिपचिपा और सभी प्रकार की त्वचा पर सौम्य है।";
      }
      if (/active digestive herbs like triphala and ajwain/i.test(trimmed)) {
        return "यह त्रिफला और अजवाइन जैसी सक्रिय पाचन जड़ी बूटियों से तैयार किया गया है जो पेट के अतिरिक्त एसिड को बेअसर करती हैं और गैस के संचय को कम करती हैं।";
      }
      if (/non-habit-forming, and free from synthetic/i.test(trimmed)) {
        return "हाँ! यह 100% प्राकृतिक, गैर-आदत बनाने वाला और सिंथेटिक लैक्सेटिव या कठोर रसायनों से मुक्त है।";
      }
      if (/30 minutes after your main meals/i.test(trimmed)) {
        return "हम अपने मुख्य भोजन (दोपहर के भोजन और रात के खाने) के 30 मिनट बाद गर्म पानी के साथ 1 खुराक लेने की सलाह देते हैं।";
      }
      if (/zero synthetic steroids, heavy metals/i.test(trimmed)) {
        return "नहीं! यह शून्य सिंथेटिक स्टेरॉयड, भारी धातुओं या प्रतिबंधित पदार्थों के साथ 100% प्राकृतिक आयुर्वेदिक फॉर्मूला है।";
      }
      if (/adaptogenic herbs like ashwagandha and shatavari/i.test(trimmed)) {
        return "हाँ, अश्वगंधा और शतावरी जैसी एडाप्टोजेनिक जड़ी-बूटियाँ पुरुषों और महिलाओं दोनों के लिए शारीरिक शक्ति और जीवन शक्ति का समर्थन करती हैं।";
      }
      if (/increased stamina in 7 days and visible muscle/i.test(trimmed)) {
        return "अधिकांश उपयोगकर्ता 7 दिनों में बढ़ी हुई सहनशक्ति और 3 से 4 सप्ताह के भीतर मांसपेशियों की टोन में सुधार देखते हैं।";
      }
      if (/shallaki and nirgundi extracts/i.test(trimmed)) {
        return "इसमें शल्लाकी और निर्गुंडी अर्क शामिल हैं जो जोड़ों की सूजन को लक्षित करते हैं, उपास्थि को चिकनाई देते हैं और सुबह की जकड़न को कम करते हैं।";
      }
      if (/30-minute gap between taking this ayurvedic/i.test(trimmed)) {
        return "हाँ, इस आयुर्वेदिक सप्लीमेंट और एलोपैथिक दवाओं को लेने के बीच 30 मिनट का अंतर रखें।";
      }
      if (/60 to 90 days for long-lasting joint/i.test(trimmed)) {
        return "हम लंबे समय तक चलने वाले जोड़ों की ताकत और कोशिकीय राहत के लिए लगातार 60 से 90 दिनों तक इसे लेने की सलाह देते हैं।";
      }
      if (/increase in daily energy, stamina, and reduced/i.test(trimmed)) {
        return "अधिकांश उपयोगकर्ता लगातार दैनिक उपयोग के 7 से 10 दिनों के भीतर दैनिक ऊर्जा, सहनशक्ति और कम थकान में वृद्धि देखते हैं।";
      }
      if (/100% pure ayurvedic herb extracts, chemical-free/i.test(trimmed)) {
        return "हाँ! यह 100% शुद्ध आयुर्वेदिक जड़ी बूटी के अर्क से बना है, रसायन मुक्त है, हेवी मेटल टेस्टेड है और लंबे समय तक दैनिक उपयोग के लिए सुरक्षित है।";
      }
      if (/take 1 capsule twice daily after meals/i.test(trimmed)) {
        return "भोजन के बाद दिन में दो बार 1 कैप्सूल गर्म दूध या पानी के साथ लें, या अपने डॉक्टर के निर्देशानुसार लें।";
      }
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
