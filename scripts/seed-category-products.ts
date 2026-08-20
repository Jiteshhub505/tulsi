/**
 * One-off seed script: inserts real products (mirroring what used to be
 * hardcoded mock data on the /categories/* pages) into MongoDB, so the
 * same products now show up consistently in both the Shop page and the
 * category pages (both read from the same `products` collection).
 *
 * Usage:
 *   node --env-file=.env scripts/seed-category-products.ts
 */

import { MongoClient } from "mongodb";

function uuid() {
  return crypto.randomUUID();
}

const REAL_FAT_BURNER_IMAGE =
  "https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765780898/nutrivya2_titil6.png";
const REAL_WEIGHT_GAINER_IMAGE =
  "https://res.cloudinary.com/dwrp1rgdi/image/upload/v1765780897/nutrivya_bmxqor.png";

const products = [
  // ── Suppliments ─────────────────────────────────────────────────────
  {
    name: "Ayurvedic Fat Burner",
    title: "Ayurvedic Fat Burner - Metabolism & Energy Support",
    category: "Suppliments",
    price: 600,
    description:
      "An Ayurvedic formulation designed to support metabolism and active daily routines when combined with proper diet and exercise.",
    galleryImages: [REAL_FAT_BURNER_IMAGE],
    inStock: 25,
  },
  {
    name: "Ayurvedic Weight Support Formula",
    title: "Ayurvedic Weight Support Formula - Daily Nutrition",
    category: "Suppliments",
    price: 1299,
    description:
      "Carefully selected Ayurvedic ingredients to support overall nutrition and consistent lifestyle habits.",
    galleryImages: ["/gym_foods.png"],
    inStock: 25,
  },
  {
    name: "Daily Wellness Combo",
    title: "Daily Wellness Combo - Nutrition & Recovery",
    category: "Suppliments",
    price: 2499,
    description:
      "A balanced combination formulated to complement everyday wellness and recovery routines.",
    galleryImages: ["/gym_foods.png"],
    inStock: 25,
  },
  {
    name: "Herbal Metabolism Support",
    title: "Herbal Metabolism Support - Daily Energy",
    category: "Suppliments",
    price: 1199,
    description:
      "Designed to support metabolic activity and daily energy as part of an active lifestyle.",
    galleryImages: ["/gym_foods.png"],
    inStock: 25,
  },
  {
    name: "Ayurvedic Nutrition Blend",
    title: "Ayurvedic Nutrition Blend - Daily Wellness",
    category: "Suppliments",
    price: 999,
    description:
      "A clean Ayurvedic blend created to support daily nutritional intake and overall wellness.",
    galleryImages: ["/gym_foods.png"],
    inStock: 25,
  },
  {
    name: "Active Lifestyle Support",
    title: "Active Lifestyle Support - Physical Activity Complement",
    category: "Suppliments",
    price: 1499,
    description:
      "Formulated to complement regular physical activity, balanced meals, and disciplined routines.",
    galleryImages: ["/gym_foods.png"],
    inStock: 25,
  },
  {
    name: "Herbal Wellness Formula",
    title: "Herbal Wellness Formula - General Wellness",
    category: "Suppliments",
    price: 899,
    description:
      "Traditional Ayurvedic ingredients selected to support general wellness and consistency.",
    galleryImages: ["/gym_foods.png"],
    inStock: 25,
  },

  // ── Health & Fitness ────────────────────────────────────────────────
  {
    name: "Ayurvedic Weight Gainer",
    title: "Ayurvedic Weight Gainer - Daily Nutrition Support",
    category: "Health & Fitness",
    price: 600,
    description: "Supports daily nutrition and active lifestyles.",
    galleryImages: [REAL_WEIGHT_GAINER_IMAGE],
    inStock: 25,
  },
  {
    name: "Herbal Fat Burner",
    title: "Herbal Fat Burner - Workout Companion",
    category: "Health & Fitness",
    price: 2000,
    description: "Designed to complement workout routines.",
    galleryImages: ["/mens_health.png"],
    inStock: 25,
  },
  {
    name: "Wellness Combo Pack",
    title: "Wellness Combo Pack - Balanced Recovery Support",
    category: "Health & Fitness",
    price: 2499,
    description: "Balanced support for nutrition and recovery.",
    galleryImages: ["/mens_health.png"],
    inStock: 25,
  },

  // ── Skin ────────────────────────────────────────────────────────────
  {
    name: "Ayurvedic Glow Support Cream",
    title: "Ayurvedic Glow Support Cream - Daily Nourishment",
    category: "Skin",
    price: 599,
    description:
      "An Ayurvedic skincare formulation designed to support daily skin nourishment and a healthy-looking glow when used as part of a regular skincare routine.",
    galleryImages: ["/skin_care.png"],
    inStock: 25,
  },
  {
    name: "Herbal Skin Hydration Gel",
    title: "Herbal Skin Hydration Gel - Everyday Comfort",
    category: "Skin",
    price: 499,
    description:
      "A lightweight herbal gel formulated to support skin hydration and comfort for everyday use.",
    galleryImages: ["/skin_care.png"],
    inStock: 25,
  },
  {
    name: "Ayurvedic Skin Balance Serum",
    title: "Ayurvedic Skin Balance Serum - Balanced Skincare",
    category: "Skin",
    price: 799,
    description:
      "Carefully selected Ayurvedic ingredients designed to support balanced-looking skin as part of a consistent skincare routine.",
    galleryImages: ["/skin_care.png"],
    inStock: 25,
  },
  {
    name: "Daily Herbal Face Cleanser",
    title: "Daily Herbal Face Cleanser - Gentle Cleansing",
    category: "Skin",
    price: 399,
    description:
      "A gentle herbal cleanser created to support daily cleansing without stripping natural skin moisture.",
    galleryImages: ["/skin_care.png"],
    inStock: 25,
  },
  {
    name: "Ayurvedic Skin Nourish Lotion",
    title: "Ayurvedic Skin Nourish Lotion - Softness & Care",
    category: "Skin",
    price: 699,
    description:
      "A smooth Ayurvedic lotion designed to support skin softness and everyday care with regular use.",
    galleryImages: ["/skin_care.png"],
    inStock: 25,
  },

  // ── Hygiene ─────────────────────────────────────────────────────────
  {
    name: "Herbal Daily Shampoo",
    title: "Herbal Daily Shampoo - Gentle Everyday Cleansing",
    category: "Hygiene",
    price: 399,
    description:
      "A gentle herbal shampoo designed to support everyday hair cleansing and freshness.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Ayurvedic Hair Cleanse Wash",
    title: "Ayurvedic Hair Cleanse Wash - Traditional Herbs",
    category: "Hygiene",
    price: 449,
    description:
      "Formulated with traditional herbs to support regular hair washing as part of a hygiene routine.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Herbal Hand Wash",
    title: "Herbal Hand Wash - Mild Daily Hygiene",
    category: "Hygiene",
    price: 199,
    description:
      "A mild hand wash designed to support daily hand hygiene while being gentle on skin.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Ayurvedic Body Cleanser",
    title: "Ayurvedic Body Cleanser - Everyday Freshness",
    category: "Hygiene",
    price: 299,
    description:
      "A refreshing body cleanser created for everyday cleansing and skin comfort.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Herbal Hair Removal Cream",
    title: "Herbal Hair Removal Cream - Convenient Care",
    category: "Hygiene",
    price: 349,
    description:
      "A personal care formulation designed to support easy and convenient hair removal.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Daily Face Wash",
    title: "Daily Face Wash - Gentle Cleansing",
    category: "Hygiene",
    price: 249,
    description:
      "A gentle face wash formulated to support daily cleansing without harshness.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Herbal Intimate Wash",
    title: "Herbal Intimate Wash - Daily Personal Care",
    category: "Hygiene",
    price: 299,
    description:
      "Carefully formulated to support daily intimate hygiene as part of a personal care routine.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Ayurvedic Liquid Soap",
    title: "Ayurvedic Liquid Soap - Everyday Cleansing",
    category: "Hygiene",
    price: 189,
    description:
      "A smooth liquid soap designed for everyday hand and body cleansing.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Herbal Foaming Face Cleanser",
    title: "Herbal Foaming Face Cleanser - Fresh Feeling Skin",
    category: "Hygiene",
    price: 279,
    description:
      "A lightweight foaming cleanser created to support fresh and clean-feeling skin.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
  {
    name: "Daily Hygiene Combo",
    title: "Daily Hygiene Combo - Essential Personal Care Set",
    category: "Hygiene",
    price: 1299,
    description:
      "A curated set of essential hygiene products designed for everyday personal care needs.",
    galleryImages: ["/womens_health.png"],
    inStock: 25,
  },
];

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set. Run with: node --env-file=.env scripts/seed-category-products.ts");
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const collection = db.collection("products");

  let created = 0;
  let skipped = 0;

  for (const p of products) {
    const existing = await collection.findOne({ name: p.name, category: p.category });
    if (existing) {
      skipped++;
      continue;
    }
    await collection.insertOne({
      _id: uuid(),
      medicineType: "capsule",
      createdAt: new Date(),
      ...p,
    } as any);
    created++;
  }

  console.log(`✅ Seed complete. Created ${created} products, skipped ${skipped} (already existed).`);
  await client.close();
}

main().catch((err) => {
  console.error("Failed to seed products:", err);
  process.exit(1);
});
