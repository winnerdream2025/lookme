export type ServiceClass =
  | "social-growth"
  | "engagement"
  | "visibility"
  | "reputation"
  | "music-promotion"
  | "web-traffic";

export type ServiceCategory =
  | "followers"
  | "likes"
  | "views"
  | "subscribers"
  | "reviews"
  | "streams"
  | "traffic";

export interface ServiceClass_Definition {
  id: ServiceClass;
  label: string;
  description: string;
  tagline: string;
}

export const SERVICE_CLASSES: ServiceClass_Definition[] = [
  {
    id: "social-growth",
    label: "Social Growth",
    description: "Build your audience across every major social platform.",
    tagline: "Followers & Subscribers",
  },
  {
    id: "engagement",
    label: "Engagement",
    description: "Boost likes, reactions, shares and interactions on your content.",
    tagline: "Likes, Reactions & Shares",
  },
  {
    id: "visibility",
    label: "Visibility & Views",
    description: "Increase content reach, impressions and view counts.",
    tagline: "Views & Impressions",
  },
  {
    id: "reputation",
    label: "Reputation Management",
    description: "Improve your business ratings and reviews across review platforms.",
    tagline: "Reviews & Ratings",
  },
  {
    id: "music-promotion",
    label: "Music Promotion",
    description: "Grow your streaming presence and music discovery.",
    tagline: "Streams & Listeners",
  },
  {
    id: "web-traffic",
    label: "Web Traffic",
    description: "Drive real human visitors to any website or landing page.",
    tagline: "Visitors & Sessions",
  },
];

export interface ServicePackage {
  qty: number;
  price: number;
  label: string;
  popular?: boolean;
}

export interface OrderFormConfig {
  targetLabel: string;
  targetPlaceholder: string;
  targetHint: string;
  targetDescription: string;
  requiresPublicAccount: boolean;
}

export interface ReviewFormConfig {
  urlLabel: string;
  urlPlaceholder: string;
  urlHint: string;
  hasCountry: boolean;
  starOptions: number[];
  starsLabel: string;
}

export interface ServiceDefinition {
  slug: string;
  name: string;
  platform: string;
  platformKey: string;
  serviceClass: ServiceClass;
  category: ServiceCategory;
  description: string;
  longDescription: string;
  deliveryTime: string;
  features: string[];
  packages: ServicePackage[];
  stats: {
    purchasedToday: number;
    fiveStarReviews: number;
    repeatPurchasers: number;
  };
  faq: { q: string; a: string }[];
  orderConfig?: OrderFormConfig;
  reviewConfig?: ReviewFormConfig;
}

export const SERVICES: ServiceDefinition[] = [
  // ─── INSTAGRAM ──────────────────────────────────────────────
  {
    slug: "instagram-followers",
    name: "Instagram Followers",
    platform: "Instagram",
    platformKey: "instagram",
    serviceClass: "social-growth",
    category: "followers",
    description: "Real, active Instagram followers delivered fast.",
    longDescription:
      "Grow your Instagram profile with genuine followers from real, active accounts. No bots, no fake profiles — every follower is a real person who completes the task manually.",
    deliveryTime: "Starts within 1h, completes in 24–48h",
    features: ["Real accounts only", "No password required", "30-day refill guarantee", "Gradual delivery"],
    packages: [
      { qty: 100, price: 2.99, label: "Starter" },
      { qty: 250, price: 5.99, label: "Growth" },
      { qty: 500, price: 9.99, label: "Boost", popular: true },
      { qty: 1000, price: 17.99, label: "Pro" },
      { qty: 2500, price: 39.99, label: "Authority" },
      { qty: 5000, price: 69.99, label: "Viral" },
    ],
    stats: { purchasedToday: 187, fiveStarReviews: 1312, repeatPurchasers: 38571 },
    faq: [
      { q: "Are these real followers?", a: "Yes. Every follower is a real person completing a task on our platform. No bots, no automation." },
      { q: "Do I need to give my password?", a: "Never. We only need your public Instagram profile URL." },
      { q: "Will followers drop?", a: "We offer a 30-day refill guarantee. If followers drop, we top them up for free." },
      { q: "Is it safe for my account?", a: "Yes. Our delivery is gradual and looks organic to Instagram's algorithm." },
    ],
    orderConfig: {
      targetLabel: "Instagram Profile URL",
      targetPlaceholder: "https://www.instagram.com/yourusername",
      targetHint: "Your profile must be set to Public to receive followers.",
      targetDescription: "Which Instagram profile should we grow?",
      requiresPublicAccount: true,
    },
  },
  {
    slug: "instagram-likes",
    name: "Instagram Likes",
    platform: "Instagram",
    platformKey: "instagram",
    serviceClass: "engagement",
    category: "likes",
    description: "Instant likes on your posts from real accounts.",
    longDescription: "Boost your Instagram posts with real likes delivered instantly. Improve engagement rate and make your content more visible in the feed.",
    deliveryTime: "Starts within 15min, completes in 1–2h",
    features: ["Real accounts only", "Instant start", "Any post type", "Safe delivery"],
    packages: [
      { qty: 50, price: 0.99, label: "Starter" },
      { qty: 100, price: 1.49, label: "Growth" },
      { qty: 250, price: 2.99, label: "Boost", popular: true },
      { qty: 500, price: 4.99, label: "Pro" },
      { qty: 1000, price: 8.99, label: "Authority" },
    ],
    stats: { purchasedToday: 342, fiveStarReviews: 2108, repeatPurchasers: 55230 },
    faq: [
      { q: "How fast are likes delivered?", a: "Most orders start within 15 minutes. Small orders complete in under 1 hour." },
      { q: "Can I order for multiple posts?", a: "Yes. Place a separate order for each post URL." },
      { q: "Will the likes disappear?", a: "Likes from real accounts are permanent. We guarantee delivery." },
    ],
    orderConfig: {
      targetLabel: "Instagram Post URL",
      targetPlaceholder: "https://www.instagram.com/p/AbCdEfGhIjK/",
      targetHint: "Paste the link to the specific post you want to boost. The post must be public.",
      targetDescription: "Which Instagram post should receive the likes?",
      requiresPublicAccount: true,
    },
  },
  {
    slug: "instagram-views",
    name: "Instagram Views",
    platform: "Instagram",
    platformKey: "instagram",
    serviceClass: "visibility",
    category: "views",
    description: "Video and Reel views delivered at scale.",
    longDescription: "Increase your video and Reel view counts to improve visibility on the Explore page and in the Reels feed.",
    deliveryTime: "Starts within 10min, completes in 30min–2h",
    features: ["Works on Reels and videos", "No password required", "Fast delivery", "High retention"],
    packages: [
      { qty: 1000, price: 0.99, label: "Starter" },
      { qty: 5000, price: 2.99, label: "Growth", popular: true },
      { qty: 10000, price: 4.99, label: "Boost" },
      { qty: 50000, price: 17.99, label: "Viral" },
    ],
    stats: { purchasedToday: 521, fiveStarReviews: 1876, repeatPurchasers: 42000 },
    faq: [
      { q: "Does this work for Reels?", a: "Yes, it works for all Instagram video content including Reels, Stories, and regular videos." },
      { q: "What is the retention rate?", a: "Our workers watch at least 30 seconds of your video, ensuring high retention." },
    ],
    orderConfig: {
      targetLabel: "Instagram Reel or Video URL",
      targetPlaceholder: "https://www.instagram.com/reel/AbCdEfGhIjK/",
      targetHint: "Paste the direct link to the Reel or video you want to boost. It must be public.",
      targetDescription: "Which Reel or video should we boost?",
      requiresPublicAccount: true,
    },
  },
  // ─── TIKTOK ─────────────────────────────────────────────────
  {
    slug: "tiktok-followers",
    name: "TikTok Followers",
    platform: "TikTok",
    platformKey: "tiktok",
    serviceClass: "social-growth",
    category: "followers",
    description: "Grow your TikTok audience with real followers.",
    longDescription: "Build your TikTok presence with genuine followers who help boost your For You page visibility and organic reach.",
    deliveryTime: "Starts within 1h, completes in 24–48h",
    features: ["Real TikTok accounts", "No password required", "Gradual delivery", "30-day guarantee"],
    packages: [
      { qty: 100, price: 3.49, label: "Starter" },
      { qty: 500, price: 12.99, label: "Growth", popular: true },
      { qty: 1000, price: 22.99, label: "Pro" },
      { qty: 5000, price: 89.99, label: "Viral" },
    ],
    stats: { purchasedToday: 264, fiveStarReviews: 987, repeatPurchasers: 28000 },
    faq: [
      { q: "Will TikTok ban me for buying followers?", a: "No. Our delivery is gradual and mimics organic growth. We've served thousands of TikTok creators safely." },
      { q: "What if followers drop?", a: "We offer a 30-day refill guarantee on all follower orders." },
    ],
    orderConfig: {
      targetLabel: "TikTok Profile URL",
      targetPlaceholder: "https://www.tiktok.com/@yourusername",
      targetHint: "Your account must be Public. Copy your profile link from the TikTok app.",
      targetDescription: "Which TikTok account should we grow?",
      requiresPublicAccount: true,
    },
  },
  {
    slug: "tiktok-likes",
    name: "TikTok Likes",
    platform: "TikTok",
    platformKey: "tiktok",
    serviceClass: "engagement",
    category: "likes",
    description: "Boost TikTok engagement with real likes.",
    longDescription: "Increase your TikTok video likes to improve For You page algorithm ranking and social proof.",
    deliveryTime: "Starts within 15min, completes in 1h",
    features: ["Real accounts", "Fast delivery", "Any video", "Safe"],
    packages: [
      { qty: 100, price: 1.49, label: "Starter" },
      { qty: 500, price: 4.99, label: "Growth", popular: true },
      { qty: 1000, price: 7.99, label: "Pro" },
      { qty: 5000, price: 29.99, label: "Viral" },
    ],
    stats: { purchasedToday: 398, fiveStarReviews: 1540, repeatPurchasers: 35000 },
    faq: [
      { q: "Can I target a specific video?", a: "Yes. Just provide the link to the specific TikTok video at checkout." },
    ],
    orderConfig: {
      targetLabel: "TikTok Video URL",
      targetPlaceholder: "https://www.tiktok.com/@username/video/1234567890123456789",
      targetHint: "Open the video in TikTok, tap Share → Copy link, then paste it here.",
      targetDescription: "Which TikTok video should receive the likes?",
      requiresPublicAccount: true,
    },
  },
  {
    slug: "tiktok-views",
    name: "TikTok Views",
    platform: "TikTok",
    platformKey: "tiktok",
    serviceClass: "visibility",
    category: "views",
    description: "Boost video view count for the For You page.",
    longDescription: "More views = more algorithmic reach. Get your TikTok videos seen by boosting view count and watch time.",
    deliveryTime: "Starts within 10min, completes in 30min–1h",
    features: ["High retention", "Fast start", "Works on all videos", "No password needed"],
    packages: [
      { qty: 1000, price: 0.79, label: "Starter" },
      { qty: 5000, price: 2.49, label: "Growth", popular: true },
      { qty: 10000, price: 3.99, label: "Boost" },
      { qty: 100000, price: 24.99, label: "Viral" },
    ],
    stats: { purchasedToday: 612, fiveStarReviews: 2201, repeatPurchasers: 61000 },
    faq: [
      { q: "Does TikTok count these as real views?", a: "Yes. Our workers watch videos naturally, which TikTok registers as authentic engagement." },
    ],
    orderConfig: {
      targetLabel: "TikTok Video URL",
      targetPlaceholder: "https://www.tiktok.com/@username/video/1234567890123456789",
      targetHint: "Open the video in TikTok, tap Share → Copy link, then paste it here.",
      targetDescription: "Which TikTok video should get more views?",
      requiresPublicAccount: true,
    },
  },
  // ─── YOUTUBE ────────────────────────────────────────────────
  {
    slug: "youtube-subscribers",
    name: "YouTube Subscribers",
    platform: "YouTube",
    platformKey: "youtube",
    serviceClass: "social-growth",
    category: "subscribers",
    description: "Real YouTube subscribers to grow your channel.",
    longDescription: "Hit monetization thresholds faster with real subscribers from genuine YouTube accounts. No bots, no fake channels.",
    deliveryTime: "Starts within 2h, completes in 48–72h",
    features: ["Real YouTube accounts", "Gradual delivery", "No password required", "30-day refill"],
    packages: [
      { qty: 100, price: 4.99, label: "Starter" },
      { qty: 500, price: 19.99, label: "Growth", popular: true },
      { qty: 1000, price: 34.99, label: "Pro" },
      { qty: 5000, price: 139.99, label: "Authority" },
    ],
    stats: { purchasedToday: 143, fiveStarReviews: 876, repeatPurchasers: 19000 },
    faq: [
      { q: "Will this help me reach 1000 subscribers for monetization?", a: "Yes. Our real subscribers count toward YouTube's monetization threshold." },
      { q: "Is gradual delivery safe?", a: "Yes. Sudden spikes can trigger YouTube's spam filters. Gradual delivery looks natural." },
    ],
    orderConfig: {
      targetLabel: "YouTube Channel URL",
      targetPlaceholder: "https://www.youtube.com/@yourchannel",
      targetHint: "Copy the URL of your YouTube channel from the browser address bar.",
      targetDescription: "Which YouTube channel should we grow?",
      requiresPublicAccount: false,
    },
  },
  {
    slug: "youtube-views",
    name: "YouTube Views",
    platform: "YouTube",
    platformKey: "youtube",
    serviceClass: "visibility",
    category: "views",
    description: "Boost YouTube video view counts with real watches.",
    longDescription: "Real people watching your videos — increasing watch time, improving search ranking, and boosting social proof.",
    deliveryTime: "Starts within 30min, completes in 1–6h",
    features: ["High watch time", "Improves SEO ranking", "Safe delivery", "Any video type"],
    packages: [
      { qty: 1000, price: 2.99, label: "Starter" },
      { qty: 5000, price: 9.99, label: "Growth", popular: true },
      { qty: 10000, price: 16.99, label: "Boost" },
      { qty: 100000, price: 99.99, label: "Viral" },
    ],
    stats: { purchasedToday: 289, fiveStarReviews: 1430, repeatPurchasers: 38000 },
    faq: [
      { q: "Does YouTube count these views?", a: "Yes. Our workers watch videos for a minimum of 30 seconds, which YouTube registers as valid views." },
    ],
    orderConfig: {
      targetLabel: "YouTube Video URL",
      targetPlaceholder: "https://www.youtube.com/watch?v=xxxxxxxxxxx",
      targetHint: "Paste the full URL of the video from your browser address bar.",
      targetDescription: "Which YouTube video should get more views?",
      requiresPublicAccount: false,
    },
  },
  {
    slug: "youtube-likes",
    name: "YouTube Likes",
    platform: "YouTube",
    platformKey: "youtube",
    serviceClass: "engagement",
    category: "likes",
    description: "Real likes on your YouTube videos to boost engagement.",
    longDescription: "Increase your YouTube video like count with genuine likes from real accounts. Improve social proof and algorithmic reach.",
    deliveryTime: "Starts within 30min, completes in 2–6h",
    features: ["Real YouTube accounts", "Instant start", "Any video type", "Safe delivery"],
    packages: [
      { qty: 50, price: 1.49, label: "Starter" },
      { qty: 100, price: 2.49, label: "Growth" },
      { qty: 250, price: 4.99, label: "Boost", popular: true },
      { qty: 500, price: 8.99, label: "Pro" },
      { qty: 1000, price: 14.99, label: "Authority" },
    ],
    stats: { purchasedToday: 198, fiveStarReviews: 1120, repeatPurchasers: 27000 },
    faq: [
      { q: "Will YouTube count these likes?", a: "Yes. Likes from real accounts with watch history are counted by YouTube." },
      { q: "Is this safe for my channel?", a: "Yes. Our delivery is gradual and organic-looking." },
    ],
    orderConfig: {
      targetLabel: "YouTube Video URL",
      targetPlaceholder: "https://www.youtube.com/watch?v=xxxxxxxxxxx",
      targetHint: "Paste the full URL of the video from your browser address bar.",
      targetDescription: "Which YouTube video should receive the likes?",
      requiresPublicAccount: false,
    },
  },
  // ─── GOOGLE ─────────────────────────────────────────────────
  {
    slug: "google-reviews",
    name: "Google Business Reviews",
    platform: "Google Business",
    platformKey: "google",
    serviceClass: "reputation",
    category: "reviews",
    description: "5-star Google Business reviews from verified accounts.",
    longDescription: "Improve your Google Business rating and local SEO ranking with genuine 5-star reviews written by real workers.",
    deliveryTime: "Starts within 24h, completes in 48–72h",
    features: ["Written by real accounts", "Custom review text available", "Improves local SEO", "Gradual delivery"],
    packages: [
      { qty: 1, price: 6.99, label: "Single" },
      { qty: 5, price: 29.99, label: "Starter", popular: true },
      { qty: 10, price: 54.99, label: "Growth" },
      { qty: 25, price: 124.99, label: "Authority" },
    ],
    stats: { purchasedToday: 78, fiveStarReviews: 634, repeatPurchasers: 12000 },
    faq: [
      { q: "Will the reviews stay up?", a: "Reviews from real accounts with post history are significantly more stable than fake reviews." },
      { q: "Can I request specific review text?", a: "Yes. Add your desired text or keywords in the instructions field at checkout." },
    ],
    reviewConfig: {
      urlLabel: "Google Business Profile Link",
      urlPlaceholder: "https://www.google.com/maps/place/...",
      urlHint: "Find your business on Google Maps and copy the URL from your browser.",
      hasCountry: true,
      starOptions: [5, 4],
      starsLabel: "Star Rating",
    },
  },
  // ─── FACEBOOK ───────────────────────────────────────────────
  {
    slug: "facebook-followers",
    name: "Facebook Page Followers",
    platform: "Facebook",
    platformKey: "facebook",
    serviceClass: "social-growth",
    category: "followers",
    description: "Real followers for your Facebook page or profile.",
    longDescription: "Grow your Facebook page presence with genuine followers who improve social proof and reach.",
    deliveryTime: "Starts within 2h, completes in 24–48h",
    features: ["Real Facebook accounts", "Page and profile support", "Safe delivery", "No password required"],
    packages: [
      { qty: 100, price: 2.49, label: "Starter" },
      { qty: 500, price: 9.99, label: "Growth", popular: true },
      { qty: 1000, price: 16.99, label: "Pro" },
    ],
    stats: { purchasedToday: 112, fiveStarReviews: 743, repeatPurchasers: 21000 },
    faq: [
      { q: "Does this work for Facebook Groups?", a: "Currently we support Facebook Pages and personal profiles only." },
    ],
    orderConfig: {
      targetLabel: "Facebook Page URL",
      targetPlaceholder: "https://www.facebook.com/yourpage",
      targetHint: "Paste the link to your Facebook page. It must be a public page.",
      targetDescription: "Which Facebook page should we grow?",
      requiresPublicAccount: true,
    },
  },
  {
    slug: "facebook-reviews",
    name: "Facebook Reviews",
    platform: "Facebook",
    platformKey: "facebook",
    serviceClass: "reputation",
    category: "reviews",
    description: "Positive reviews for your Facebook business page.",
    longDescription: "Build trust and credibility with genuine Facebook reviews written by real workers from real accounts.",
    deliveryTime: "Starts within 24h, completes in 48–72h",
    features: ["Real Facebook accounts", "Custom text available", "Gradual delivery", "Business page support"],
    packages: [
      { qty: 1, price: 5.99, label: "Single" },
      { qty: 5, price: 24.99, label: "Starter", popular: true },
      { qty: 10, price: 44.99, label: "Growth" },
    ],
    stats: { purchasedToday: 56, fiveStarReviews: 421, repeatPurchasers: 8900 },
    faq: [
      { q: "Will Facebook remove these reviews?", a: "Reviews from accounts with real activity are far more resistant to removal." },
    ],
    reviewConfig: {
      urlLabel: "Facebook Business Page URL",
      urlPlaceholder: "https://www.facebook.com/yourbusiness",
      urlHint: "Paste your Facebook business page link here.",
      hasCountry: true,
      starOptions: [5, 4],
      starsLabel: "Recommendation",
    },
  },
  // ─── YELP ────────────────────────────────────────────────────
  {
    slug: "yelp-reviews",
    name: "Yelp Reviews",
    platform: "Yelp",
    platformKey: "yelp",
    serviceClass: "reputation",
    category: "reviews",
    description: "Genuine Yelp reviews from real verified accounts.",
    longDescription: "Boost your Yelp rating with authentic reviews written by real workers from verified Yelp accounts with post history.",
    deliveryTime: "Starts within 24h, completes in 48–72h",
    features: ["Verified Yelp accounts", "Custom review text", "Gradual delivery", "Elite-quality accounts"],
    packages: [
      { qty: 1, price: 7.99, label: "Single" },
      { qty: 5, price: 34.99, label: "Starter", popular: true },
      { qty: 10, price: 59.99, label: "Growth" },
      { qty: 25, price: 134.99, label: "Authority" },
    ],
    stats: { purchasedToday: 41, fiveStarReviews: 318, repeatPurchasers: 6400 },
    faq: [
      { q: "Are these Yelp Elite accounts?", a: "Many of our workers have established Yelp profiles with review history, which adds credibility." },
      { q: "Will Yelp filter the reviews?", a: "Yelp's filter can be aggressive. We use aged accounts to maximise the chance reviews stay visible." },
    ],
    reviewConfig: {
      urlLabel: "Yelp Business Page URL",
      urlPlaceholder: "https://www.yelp.com/biz/your-business-name",
      urlHint: "Search your business on Yelp and copy the URL from the business page.",
      hasCountry: true,
      starOptions: [5, 4, 3],
      starsLabel: "Star Rating",
    },
  },
  // ─── STYLESEAT ───────────────────────────────────────────────
  {
    slug: "styleseat-reviews",
    name: "Styleseat Reviews",
    platform: "Styleseat",
    platformKey: "styleseat",
    serviceClass: "reputation",
    category: "reviews",
    description: "5-star reviews for your Styleseat professional profile.",
    longDescription: "Grow your Styleseat booking rate with authentic 5-star reviews from real clients. More reviews means higher search ranking inside the Styleseat app.",
    deliveryTime: "Starts within 24h, completes in 48–72h",
    features: ["Real Styleseat accounts", "Custom review content", "Improves booking visibility", "Gradual delivery"],
    packages: [
      { qty: 1, price: 5.99, label: "Single" },
      { qty: 5, price: 24.99, label: "Starter", popular: true },
      { qty: 10, price: 44.99, label: "Growth" },
      { qty: 25, price: 99.99, label: "Authority" },
    ],
    stats: { purchasedToday: 29, fiveStarReviews: 214, repeatPurchasers: 4100 },
    faq: [
      { q: "Do I need to share my Styleseat login?", a: "Never. We only need your public profile URL." },
      { q: "Will this increase my bookings?", a: "More positive reviews improve your ranking in Styleseat's local search, which directly drives bookings." },
    ],
    reviewConfig: {
      urlLabel: "Styleseat Profile URL",
      urlPlaceholder: "https://www.styleseat.com/m/your-name",
      urlHint: "Open your Styleseat professional profile and copy the URL.",
      hasCountry: false,
      starOptions: [5, 4],
      starsLabel: "Star Rating",
    },
  },
  // ─── BOOKSY ──────────────────────────────────────────────────
  {
    slug: "booksy-reviews",
    name: "Booksy Reviews",
    platform: "Booksy",
    platformKey: "booksy",
    serviceClass: "reputation",
    category: "reviews",
    description: "Authentic reviews for your Booksy business profile.",
    longDescription: "Stand out in Booksy's competitive marketplace. More 5-star reviews boost your profile's visibility and attract new clients organically.",
    deliveryTime: "Starts within 24h, completes in 48–72h",
    features: ["Real Booksy accounts", "Custom review text", "Improves search rank", "Gradual delivery"],
    packages: [
      { qty: 1, price: 5.99, label: "Single" },
      { qty: 5, price: 24.99, label: "Starter", popular: true },
      { qty: 10, price: 44.99, label: "Growth" },
      { qty: 25, price: 99.99, label: "Authority" },
    ],
    stats: { purchasedToday: 24, fiveStarReviews: 187, repeatPurchasers: 3600 },
    faq: [
      { q: "Do I need to share my Booksy password?", a: "No. We only need your public Booksy profile link." },
      { q: "How long until I see results?", a: "Reviews start appearing within 24 hours of order start. Delivery is gradual to look natural." },
    ],
    reviewConfig: {
      urlLabel: "Booksy Profile URL",
      urlPlaceholder: "https://booksy.com/en-us/...",
      urlHint: "Open your Booksy business profile in a browser and copy the URL.",
      hasCountry: false,
      starOptions: [5, 4],
      starsLabel: "Star Rating",
    },
  },
  // ─── TRUSTPILOT ──────────────────────────────────────────────
  {
    slug: "trustpilot-reviews",
    name: "Trustpilot Reviews",
    platform: "Trustpilot",
    platformKey: "trustpilot",
    serviceClass: "reputation",
    category: "reviews",
    description: "Verified Trustpilot reviews to boost your company rating.",
    longDescription: "Trustpilot is one of the most trusted review platforms online. Increase your star rating with genuine reviews from verified accounts to convert more visitors into customers.",
    deliveryTime: "Starts within 24h, completes in 48–72h",
    features: ["Verified Trustpilot accounts", "Custom review content", "Improves conversion rate", "Gradual delivery"],
    packages: [
      { qty: 1, price: 8.99, label: "Single" },
      { qty: 5, price: 39.99, label: "Starter", popular: true },
      { qty: 10, price: 69.99, label: "Growth" },
      { qty: 25, price: 149.99, label: "Authority" },
    ],
    stats: { purchasedToday: 33, fiveStarReviews: 276, repeatPurchasers: 5200 },
    faq: [
      { q: "Are these from verified Trustpilot accounts?", a: "Yes. Our workers have verified Trustpilot profiles with email-confirmed accounts." },
      { q: "Can I target a specific domain?", a: "Yes. Provide your Trustpilot company review page URL at checkout." },
    ],
    reviewConfig: {
      urlLabel: "Trustpilot Company Page URL",
      urlPlaceholder: "https://www.trustpilot.com/review/yourcompany.com",
      urlHint: "Search your company on Trustpilot and copy the review page URL.",
      hasCountry: false,
      starOptions: [5, 4, 3],
      starsLabel: "Star Rating",
    },
  },
  // ─── TWITTER / X ────────────────────────────────────────────
  {
    slug: "twitter-followers",
    name: "X (Twitter) Followers",
    platform: "X (Twitter)",
    platformKey: "twitter",
    serviceClass: "social-growth",
    category: "followers",
    description: "Grow your X following with real accounts.",
    longDescription: "Build credibility on X with genuine followers from real accounts. No bots, no suspended accounts.",
    deliveryTime: "Starts within 2h, completes in 24–48h",
    features: ["Real X accounts", "Gradual delivery", "30-day guarantee", "No password required"],
    packages: [
      { qty: 100, price: 3.99, label: "Starter" },
      { qty: 500, price: 14.99, label: "Growth", popular: true },
      { qty: 1000, price: 24.99, label: "Pro" },
    ],
    stats: { purchasedToday: 89, fiveStarReviews: 612, repeatPurchasers: 14000 },
    faq: [
      { q: "Will X suspend my account?", a: "No. Buying followers does not violate X's ToS when done with real accounts at a gradual pace." },
    ],
    orderConfig: {
      targetLabel: "X (Twitter) Profile URL",
      targetPlaceholder: "https://twitter.com/yourusername",
      targetHint: "Your account must be public. Paste your X profile URL here.",
      targetDescription: "Which X account should we grow?",
      requiresPublicAccount: true,
    },
  },
  // ─── SPOTIFY ────────────────────────────────────────────────
  {
    slug: "spotify-streams",
    name: "Spotify Streams",
    platform: "Spotify",
    platformKey: "spotify",
    serviceClass: "music-promotion",
    category: "streams",
    description: "Increase your Spotify stream count organically.",
    longDescription: "More streams means more royalties and better playlist algorithmic placement. Real people streaming your music.",
    deliveryTime: "Starts within 6h, completes in 24–72h",
    features: ["Real Spotify accounts", "Counts toward royalties", "Playlist algorithm boost", "Safe delivery"],
    packages: [
      { qty: 1000, price: 3.99, label: "Starter" },
      { qty: 5000, price: 14.99, label: "Growth", popular: true },
      { qty: 10000, price: 24.99, label: "Pro" },
      { qty: 50000, price: 99.99, label: "Chart" },
    ],
    stats: { purchasedToday: 167, fiveStarReviews: 891, repeatPurchasers: 22000 },
    faq: [
      { q: "Do these streams count for royalties?", a: "Yes. Our workers stream via real Spotify accounts, which counts toward Spotify royalties." },
    ],
    orderConfig: {
      targetLabel: "Spotify Track, Album or Playlist URL",
      targetPlaceholder: "https://open.spotify.com/track/xxxxxxxxxxxxxxxxxxxx",
      targetHint: "In Spotify, tap \u22ef → Share → Copy link and paste it here. Works for tracks, albums, and playlists.",
      targetDescription: "Which Spotify content should we stream?",
      requiresPublicAccount: false,
    },
  },
  // ─── WEBSITE ────────────────────────────────────────────────
  {
    slug: "website-traffic",
    name: "Website Traffic",
    platform: "Website",
    platformKey: "website",
    serviceClass: "web-traffic",
    category: "traffic",
    description: "Real human visits to your website with 30s+ dwell time.",
    longDescription: "Drive genuine traffic to any website. Our workers visit your site, browse for at least 30 seconds, and register as real sessions in Google Analytics.",
    deliveryTime: "Starts within 2h, completes in 24–48h",
    features: ["Real human visitors", "30s+ dwell time", "Reduces bounce rate", "Google Analytics compatible"],
    packages: [
      { qty: 500, price: 4.99, label: "Starter" },
      { qty: 1000, price: 7.99, label: "Growth", popular: true },
      { qty: 5000, price: 29.99, label: "Boost" },
      { qty: 10000, price: 49.99, label: "Authority" },
    ],
    stats: { purchasedToday: 134, fiveStarReviews: 756, repeatPurchasers: 18000 },
    faq: [
      { q: "Will this affect my Google Analytics?", a: "Yes — in a good way. Real visits with 30s+ dwell time improve your session metrics." },
      { q: "Can I target specific pages?", a: "Yes. Provide the exact page URL you want traffic directed to." },
    ],
    orderConfig: {
      targetLabel: "Website URL",
      targetPlaceholder: "https://yourwebsite.com/landing-page",
      targetHint: "Enter the exact page you want visitors sent to. Any public URL works.",
      targetDescription: "Which URL should we send traffic to?",
      requiresPublicAccount: false,
    },
  },
];

export const SERVICE_MAP = new Map<string, ServiceDefinition>(
  SERVICES.map((s) => [s.slug, s])
);

export const PLATFORM_LIST = [...new Set(SERVICES.map((s) => s.platform))];
export const CATEGORY_LIST: ServiceCategory[] = [
  "followers", "likes", "views", "subscribers", "reviews", "streams", "traffic",
];

export function getServicesByClass(cls: ServiceClass): ServiceDefinition[] {
  return SERVICES.filter((s) => s.serviceClass === cls);
}

export function getPlatformsForClass(cls: ServiceClass): { key: string; label: string }[] {
  const seen = new Map<string, string>();
  SERVICES.filter((s) => s.serviceClass === cls).forEach((s) => {
    if (!seen.has(s.platformKey)) seen.set(s.platformKey, s.platform);
  });
  return Array.from(seen.entries()).map(([key, label]) => ({ key, label }));
}
