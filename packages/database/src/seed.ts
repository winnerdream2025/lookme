import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Platform definitions ──────────────────────────────────────────────────
const PLATFORMS = [
  { slug: "instagram",      name: "Instagram",       sortOrder: 1 },
  { slug: "tiktok",         name: "TikTok",          sortOrder: 2 },
  { slug: "youtube",        name: "YouTube",         sortOrder: 3 },
  { slug: "facebook",       name: "Facebook",        sortOrder: 4 },
  { slug: "twitter",        name: "X (Twitter)",     sortOrder: 5 },
  { slug: "google",         name: "Google Business", sortOrder: 6 },
  { slug: "spotify",        name: "Spotify",         sortOrder: 7 },
  { slug: "apple-music",    name: "Apple Music",     sortOrder: 8 },
  { slug: "reddit",         name: "Reddit",          sortOrder: 9 },
  { slug: "yelp",           name: "Yelp",            sortOrder: 10 },
  { slug: "app-store",      name: "App Store",       sortOrder: 11 },
  { slug: "google-play",    name: "Google Play",     sortOrder: 12 },
  { slug: "whatsapp",       name: "WhatsApp",        sortOrder: 13 },
  { slug: "website",        name: "Website",         sortOrder: 14 },
];

// ─── Category definitions ──────────────────────────────────────────────────
const CATEGORIES = [
  { slug: "followers",    name: "Followers",    sortOrder: 1 },
  { slug: "likes",        name: "Likes",        sortOrder: 2 },
  { slug: "views",        name: "Views",        sortOrder: 3 },
  { slug: "subscribers",  name: "Subscribers",  sortOrder: 4 },
  { slug: "reviews",      name: "Reviews",      sortOrder: 5 },
  { slug: "streams",      name: "Streams",      sortOrder: 6 },
  { slug: "downloads",    name: "Downloads",    sortOrder: 7 },
  { slug: "traffic",      name: "Traffic",      sortOrder: 8 },
  { slug: "upvotes",      name: "Upvotes",      sortOrder: 9 },
];

// ─── Service type definitions ──────────────────────────────────────────────
// [slug, platform, category, name, basePrice/unit, workerReward/unit, min, max, deliveryEstimate]
const SERVICES: [string, string, string, string, number, number, number, number, string][] = [
  // Instagram
  ["instagram-followers", "instagram", "followers", "Instagram Followers", 0.0299, 0.018, 100, 50000, "1-2 hours"],
  ["instagram-likes",     "instagram", "likes",     "Instagram Likes",     0.0099, 0.006, 50,  10000, "30 minutes"],
  ["instagram-views",     "instagram", "views",     "Instagram Views",     0.0005, 0.0003, 1000, 1000000, "1-6 hours"],

  // TikTok
  ["tiktok-followers", "tiktok", "followers", "TikTok Followers", 0.0349, 0.02,  100, 50000, "1-2 hours"],
  ["tiktok-likes",     "tiktok", "likes",     "TikTok Likes",     0.0079, 0.005, 50,  10000, "30 minutes"],
  ["tiktok-views",     "tiktok", "views",     "TikTok Views",     0.0003, 0.0002, 1000, 1000000, "1-6 hours"],

  // YouTube
  ["youtube-subscribers", "youtube", "subscribers", "YouTube Subscribers", 0.0499, 0.03,  100, 10000, "2-4 hours"],
  ["youtube-likes",       "youtube", "likes",       "YouTube Likes",       0.0149, 0.009, 50,  5000, "1-2 hours"],
  ["youtube-views",       "youtube", "views",       "YouTube Views",       0.0006, 0.0004, 1000, 1000000, "6-24 hours"],

  // Facebook
  ["facebook-followers", "facebook", "followers", "Facebook Page Followers", 0.0249, 0.015, 100, 20000, "2-6 hours"],
  ["facebook-likes",     "facebook", "likes",     "Facebook Post Likes",     0.0089, 0.005, 50,  5000, "30 minutes"],

  // X (Twitter)
  ["twitter-followers", "twitter", "followers", "X (Twitter) Followers", 0.0399, 0.024, 100, 20000, "2-4 hours"],
  ["twitter-likes",     "twitter", "likes",     "X (Twitter) Likes",     0.0049, 0.003, 50,  5000, "30 minutes"],
  ["twitter-retweets",  "twitter", "upvotes",   "X (Twitter) Retweets",  0.0079, 0.005, 50,  2000, "1-2 hours"],

  // Google Business
  ["google-reviews", "google", "reviews", "Google Business Reviews", 6.99, 4.0, 1, 200, "24-72 hours"],

  // Spotify
  ["spotify-streams",   "spotify", "streams",   "Spotify Streams",   0.0004, 0.00025, 1000, 500000, "6-24 hours"],
  ["spotify-followers", "spotify", "followers", "Spotify Followers", 0.0299, 0.018,   100,  20000,  "2-6 hours"],

  // Apple Music
  ["apple-music-streams", "apple-music", "streams", "Apple Music Streams", 0.0005, 0.0003, 1000, 500000, "6-24 hours"],

  // Reddit
  ["reddit-upvotes", "reddit", "upvotes", "Reddit Upvotes", 0.0099, 0.006, 50, 5000, "1-2 hours"],

  // Yelp
  ["yelp-reviews", "yelp", "reviews", "Yelp Reviews", 7.99, 4.5, 1, 100, "24-72 hours"],

  // App Store
  ["app-store-downloads", "app-store", "downloads", "App Store Downloads", 0.0499, 0.03, 100, 10000, "24-48 hours"],

  // Google Play
  ["google-play-downloads", "google-play", "downloads", "Google Play Downloads", 0.0449, 0.027, 100, 10000, "24-48 hours"],

  // WhatsApp
  ["whatsapp-followers", "whatsapp", "followers", "WhatsApp Channel Followers", 0.0299, 0.018, 100, 10000, "2-6 hours"],

  // Website
  ["website-traffic", "website", "traffic", "Website Traffic Visits", 0.0020, 0.0012, 500, 500000, "6-24 hours"],
];

async function main() {
  console.log("Seeding catalog...");

  // Upsert platforms
  const platformMap = new Map<string, string>();
  for (const p of PLATFORMS) {
    const record = await prisma.platform.upsert({
      where:  { slug: p.slug },
      update: { name: p.name, sortOrder: p.sortOrder },
      create: { slug: p.slug, name: p.name, sortOrder: p.sortOrder, isActive: true },
    });
    platformMap.set(p.slug, record.id);
  }
  console.log(`  ✓ ${PLATFORMS.length} platforms`);

  // Upsert categories
  const categoryMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const record = await prisma.serviceCategory.upsert({
      where:  { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: { slug: c.slug, name: c.name, sortOrder: c.sortOrder, isActive: true },
    });
    categoryMap.set(c.slug, record.id);
  }
  console.log(`  ✓ ${CATEGORIES.length} categories`);

  // Upsert service types
  let count = 0;
  for (const [slug, platSlug, catSlug, name, basePrice, workerReward, minQty, maxQty, delivery] of SERVICES) {
    const platformId = platformMap.get(platSlug);
    const categoryId = categoryMap.get(catSlug);

    if (!platformId || !categoryId) {
      console.warn(`  ⚠ Skipping ${slug}: platform ${platSlug} or category ${catSlug} not found`);
      continue;
    }

    await prisma.serviceType.upsert({
      where:  { slug },
      update: { name, basePrice, workerReward, minQuantity: minQty, maxQuantity: maxQty, deliveryEstimate: delivery, isActive: true },
      create: {
        slug, name, platformId, categoryId,
        basePrice, workerReward,
        minQuantity: minQty, maxQuantity: maxQty,
        deliveryEstimate: delivery,
        isActive: true,
        requiresProof: true,
        proofType: catSlug === "reviews" ? "screenshot" : "username",
      },
    });
    count++;
  }
  console.log(`  ✓ ${count} service types`);
  console.log("Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
