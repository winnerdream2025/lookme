import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";

const BLOG_POSTS = [
  {
    slug: "grow-instagram-2024",
    title: "How to grow your Instagram in 2024",
    excerpt: "Discover the latest strategies for increasing your reach and building a loyal following on Instagram this year.",
    date: "May 15, 2024",
    category: "Instagram",
    author: "Growth Team",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    content: `
      <p>Building an Instagram following in 2024 requires more than just high-quality photos. With the platform's shift towards video content and community-driven engagement, your strategy needs to evolve. Here's exactly what's working right now.</p>
      
      <h2>1. Prioritize Reels (But Make Them Original)</h2>
      <p>Reels remain the primary engine for reach on Instagram. However, the focus has shifted from viral trends to "original value." The algorithm now favors content that keeps users on the platform and sparks genuine interactions.</p>
      <p><strong>Actionable tip:</strong> Instead of jumping on every trending audio, create Reels that solve a specific problem for your audience. Tutorial-style content, before-and-afters, and "day in the life" videos consistently outperform dance trends.</p>
      
      <h2>2. Community Over Following</h2>
      <p>Raw numbers are becoming less important than community engagement. Instagram is increasingly showing content to "Connected" followers first—these are people who regularly interact with your posts, reply to your Stories, and save your content.</p>
      <p><strong>How to build connection:</strong></p>
      <ul>
        <li>Use polls, Q&As, and quizzes in Stories to spark two-way conversations</li>
        <li>Reply to every DM and comment within the first hour of posting</li>
        <li>Create Broadcast Channels to share exclusive updates with your most engaged fans</li>
        <li>Host live sessions at least once a week to build real-time rapport</li>
      </ul>
      
      <h2>3. Master Instagram SEO</h2>
      <p>Instagram search is more powerful than ever. The platform now functions like a mini search engine, and using relevant keywords in your bio, captions, and alt text is no longer optional—it's essential for discovery.</p>
      <p><strong>SEO checklist:</strong></p>
      <ul>
        <li>Include 3-5 target keywords naturally in your captions</li>
        <li>Write descriptive alt text for every image (Instagram indexes this!)</li>
        <li>Use location tags strategically, even if you're not a local business</li>
        <li>Add keywords to your name field (e.g., "Sarah | Fitness Coach")</li>
      </ul>

      <h2>4. Leverage Collaborative Posts</h2>
      <p>Collaborative posts allow you to co-author content with other accounts, instantly exposing your profile to their audience. This is one of the fastest ways to grow in 2024.</p>
      <p>Partner with accounts in your niche that have a similar or slightly larger following. The engagement from both audiences signals to Instagram that your content is valuable.</p>
      
      <blockquote>
        "The goal isn't just to be seen, but to be remembered and followed. Build a community, not just a follower count."
      </blockquote>
      
      <h2>Final Thoughts</h2>
      <p>Focus on creating content that speaks directly to your niche's pain points or desires. Consistency combined with authentic engagement is the secret sauce for 2024. Post 4-7 times per week, engage daily, and track what resonates using Instagram Insights.</p>
      <p>Remember: Instagram rewards accounts that keep users on the platform. The more time people spend watching, saving, and sharing your content, the more the algorithm will promote you.</p>
    `
  },
  {
    slug: "google-reviews-seo",
    title: "Why Google Reviews matter for SEO",
    excerpt: "Learn how customer reviews impact your local search ranking and how to get more authentic reviews.",
    date: "May 12, 2024",
    category: "Google",
    author: "Market Insights",
    image: "https://images.unsplash.com/photo-1572021335469-3171624c9c5c?q=80&w=800&auto=format&fit=crop",
    content: `
      <p>If you're a local business, your Google Business Profile is your digital storefront. And the primary currency of that profile is reviews. Here's why they matter more than you think—and how to get more of them.</p>
      
      <h2>Reviews Are a Direct Ranking Factor</h2>
      <p>Google has explicitly stated that review count, review score, and review velocity (how often you get new reviews) all factor into local search ranking. More reviews, and more importantly, <strong>regular new reviews</strong>, signal to Google that your business is active, trustworthy, and worth showing to searchers.</p>
      <p>Businesses with 50+ reviews rank significantly higher in the "Local Pack" (the map results at the top of Google) than those with fewer than 10, even if the star rating is similar.</p>
      
      <h2>Trust and Click-Through Rate</h2>
      <p>SEO isn't just about ranking; it's about getting clicks. A 4.8-star rating with 100 reviews will almost always get more clicks than a 5.0-star rating with only 3 reviews. Why? Because consumers are smart—they know that a perfect score with minimal reviews looks suspicious.</p>
      <p><strong>The sweet spot:</strong> Aim for a 4.5-4.9 star average with at least 50 reviews. This signals authenticity and social proof.</p>

      <h2>Reviews Improve Your Snippet</h2>
      <p>Google pulls keywords from your reviews to enhance your search snippet. If multiple customers mention "best tacos in Austin" in their reviews, Google is more likely to show your business for that exact search term.</p>
      <p>This means reviews don't just boost your ranking—they also improve your <em>relevance</em> for specific search queries.</p>
      
      <h2>How to Get More Reviews (The Right Way)</h2>
      <ul>
        <li><strong>Ask at the right moment:</strong> Request a review immediately after a positive interaction, not days later when the experience has faded.</li>
        <li><strong>Make it easy:</strong> Send a direct link to your Google review page via text or email. Don't make customers search for you.</li>
        <li><strong>Respond to every review:</strong> Businesses that respond to reviews get 35% more reviews on average. It shows you care.</li>
        <li><strong>Incentivize (carefully):</strong> You can't pay for reviews, but you can run a "leave a review and get entered to win" contest, as long as you don't require a positive review.</li>
      </ul>

      <blockquote>
        "A steady stream of authentic reviews is the most powerful local SEO signal you can build. It's not a one-time effort—it's a habit."
      </blockquote>
      
      <h2>Final Takeaway</h2>
      <p>Ready to boost your local SEO? Start by asking your happy customers for feedback consistently. Set a goal to get at least 5 new reviews per month, and watch your local rankings climb.</p>
    `
  },
  {
    slug: "social-proof-explained",
    title: "The power of social proof in E-commerce",
    excerpt: "Understanding the psychology behind social proof and why it's the key to increasing your conversion rates.",
    date: "May 10, 2024",
    category: "Marketing",
    author: "Strategy Desk",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    content: `
      <p>Social proof is a psychological phenomenon where people assume the actions of others in an attempt to reflect correct behavior for a given situation. In e-commerce, it's the difference between a visitor bouncing and a visitor buying.</p>

      <h2>Types of Social Proof</h2>
      <ul>
        <li><strong>Customer Reviews:</strong> The most common form. Seeing others' experiences builds immediate trust.</li>
        <li><strong>User-Generated Content (UGC):</strong> Photos and videos of real customers using your product.</li>
        <li><strong>Certifications & Badges:</strong> Trust seals that show your business is legitimate and secure.</li>
        <li><strong>Wisdom of the Crowd:</strong> "Join 10,000 others who have already switched."</li>
      </ul>

      <h2>Why It Works</h2>
      <p>Human beings are social creatures. When we are uncertain, we look to others for cues on how to act. By showcasing that others have successfully and happily purchased from you, you remove the "risk of the unknown."</p>

      <p>Don't just sell a product—sell the fact that people are already loving it.</p>
    `
  },
  {
    slug: "youtube-algorithm-tips",
    title: "Mastering the YouTube algorithm",
    excerpt: "Stop guessing and start growing. Here are the 5 things you need to know about how YouTube recommends videos.",
    date: "May 08, 2024",
    category: "YouTube",
    author: "Content Crew",
    image: "https://images.unsplash.com/photo-1521302273984-db79417852bc?q=80&w=800&auto=format&fit=crop",
    content: `
      <p>YouTube is no longer just a video hosting site; it's the world's second-largest search engine. To win, you need to understand what the algorithm actually wants.</p>

      <h2>1. Focus on Retention, Not Just Views</h2>
      <p>A view means nothing if the viewer leaves after 10 seconds. YouTube rewards videos that keep people on the platform. Watch time and Average Percentage Viewed are your most important metrics.</p>

      <h2>2. The Click-Through Rate (CTR) Battle</h2>
      <p>Your thumbnail and title are your "packaging." If nobody clicks, nobody watches. Aim for a CTR above 5% by using high-contrast images and curiosity-driven titles.</p>

      <h2>3. Reply to Every Comment</h2>
      <p>Engagement signals to YouTube that your content is creating a conversation. The first 24 hours of a video's life are critical—be active in your comment section during this window.</p>

      <p>Mastering YouTube is a marathon, not a sprint. Keep analyzing your data and iterating on your successes.</p>
    `
  },
  {
    slug: "tiktok-viral-formula",
    title: "The TikTok Viral Formula for Brands",
    excerpt: "How brands can leverage the 'For You' page to reach millions without a massive ad budget.",
    date: "May 05, 2024",
    category: "TikTok",
    author: "Social Lab",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=800&auto=format&fit=crop",
    content: `
      <p>TikTok has leveled the playing field for brands. You don't need a Hollywood production budget to go viral—you just need to understand the platform's culture.</p>

      <h2>Don't Make Ads, Make TikToks</h2>
      <p>The most successful brands on TikTok are the ones that blend in. Use trending sounds, participate in challenges, and show the "behind the scenes" of your business. Authenticity is the primary currency here.</p>

      <h2>The Hook is Everything</h2>
      <p>You have exactly 1.5 seconds to capture a user's attention before they swipe. Your "hook"—the first thing they see and hear—must be undeniable.</p>

      <p>TikTok is about entertainment first, education second, and selling third. Flip your traditional marketing funnel on its head and watch your reach explode.</p>
    `
  },
  {
    slug: "facebook-ads-vs-organic",
    title: "Facebook: Ads vs. Organic Reach in 2024",
    excerpt: "Is organic reach dead on Facebook? We dive into the data to see where you should spend your time.",
    date: "May 02, 2024",
    category: "Facebook",
    author: "Market Insights",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
    content: `
      <p>The question we get most often is: "Is it even worth posting on Facebook anymore if I'm not paying?" The answer is nuanced.</p>

      <h2>The Reality of Organic Reach</h2>
      <p>It's true that organic reach for business pages has declined significantly over the last decade. However, Facebook Groups and the new "Professional Mode" for profiles have opened up new avenues for reach that don't cost a dime.</p>

      <h2>When to Pay</h2>
      <p>If you have a specific conversion goal—like sales or lead generation—Facebook Ads remain one of the most powerful targeting tools in existence. The ROI on a well-optimized ad campaign still outperforms almost any other platform.</p>

      <p>The winning strategy for 2024 is a hybrid approach: use Groups for community building and targeted Ads for direct growth.</p>
    `
  }
];

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <header className="py-20 px-6 bg-[#F6F5F3]">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] mb-8 hover:opacity-80 transition-opacity">
            <span>←</span> Back to Blog
          </Link>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-sm text-[#9CA3AF] font-medium">{post.date}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#0A0A0A] mb-8 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex items-center justify-center text-xs font-bold text-[#4B5563]">
              {post.author.charAt(0)}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#0A0A0A]">{post.author}</div>
              <div className="text-xs text-[#6B7280]">Content Strategist</div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 mb-16">
        <div className="aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 pb-24">
        <div 
          className="prose prose-lg prose-blue max-w-none text-[#374151] leading-relaxed
            prose-headings:text-[#0A0A0A] prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-p:mb-6
            prose-blockquote:border-l-4 prose-blockquote:border-[#2563EB] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:text-[#111827] prose-blockquote:my-10
            prose-strong:text-[#0A0A0A] prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
            prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <hr className="my-16 border-[#E5E7EB]" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[#F9FAFB] rounded-3xl p-8 border border-[#E5E7EB]">
          <div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Need help growing your presence?</h3>
            <p className="text-[#6B7280] text-sm">Our experts can help you build the social proof you need to succeed.</p>
          </div>
          <Link href="/services">
            <Button variant="svcPrimary" size="lg" className="rounded-full px-8 whitespace-nowrap">
              See All Services
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
