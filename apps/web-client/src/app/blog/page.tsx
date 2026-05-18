import Link from "next/link";
import { Button } from "@/components/ui/Button";

const BLOG_POSTS = [
  {
    slug: "grow-instagram-2024",
    title: "How to grow your Instagram in 2024",
    excerpt: "Discover the latest strategies for increasing your reach and building a loyal following on Instagram this year.",
    date: "May 15, 2024",
    category: "Instagram",
    author: "Growth Team",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "google-reviews-seo",
    title: "Why Google Reviews matter for SEO",
    excerpt: "Learn how customer reviews impact your local search ranking and how to get more authentic reviews.",
    date: "May 12, 2024",
    category: "Google",
    author: "Market Insights",
    image: "https://images.unsplash.com/photo-1572021335469-3171624c9c5c?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "social-proof-explained",
    title: "The power of social proof in E-commerce",
    excerpt: "Understanding the psychology behind social proof and why it's the key to increasing your conversion rates.",
    date: "May 10, 2024",
    category: "Marketing",
    author: "Strategy Desk",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "youtube-algorithm-tips",
    title: "Mastering the YouTube algorithm",
    excerpt: "Stop guessing and start growing. Here are the 5 things you need to know about how YouTube recommends videos.",
    date: "May 08, 2024",
    category: "YouTube",
    author: "Content Crew",
    image: "https://images.unsplash.com/photo-1521302273984-db79417852bc?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "tiktok-viral-formula",
    title: "The TikTok Viral Formula for Brands",
    excerpt: "How brands can leverage the 'For You' page to reach millions without a massive ad budget.",
    date: "May 05, 2024",
    category: "TikTok",
    author: "Social Lab",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=800&auto=format&fit=crop"
  },
  {
    slug: "facebook-ads-vs-organic",
    title: "Facebook: Ads vs. Organic Reach in 2024",
    excerpt: "Is organic reach dead on Facebook? We dive into the data to see where you should spend your time.",
    date: "May 02, 2024",
    category: "Facebook",
    author: "Market Insights",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F3]">
      {/* Header */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-6 tracking-tight">
            The <span className="text-[#2563EB]">LookMe</span> Blog
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
            Insights, strategies, and tips to help you master social media and grow your online business.
          </p>
        </div>
      </section>

      {/* Featured Post (first one) */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Link href={`/blog/${BLOG_POSTS[0].slug}`} className="group block">
            <div className="bg-white border border-[#E5E7EB] rounded-[32px] overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-xl hover:border-[#2563EB]/20">
              <div className="md:w-3/5 aspect-[16/10] relative overflow-hidden">
                <img 
                  src={BLOG_POSTS[0].image} 
                  alt={BLOG_POSTS[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 md:p-12 md:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-full uppercase tracking-wider">
                    {BLOG_POSTS[0].category}
                  </span>
                  <span className="text-sm text-[#9CA3AF] font-medium">{BLOG_POSTS[0].date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] mb-4 group-hover:text-[#2563EB] transition-colors leading-tight">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="text-[#6B7280] leading-relaxed mb-8">
                  {BLOG_POSTS[0].excerpt}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[10px] font-bold text-[#4B5563]">
                    {BLOG_POSTS[0].author.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-[#374151]">{BLOG_POSTS[0].author}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Post Grid */}
      <section className="py-20 px-6 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="h-full bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden transition-all hover:shadow-lg hover:border-[#2563EB]/20">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">{post.category}</span>
                      <span className="w-1 h-1 rounded-full bg-[#D1D5DB]"></span>
                      <span className="text-xs text-[#9CA3AF] font-medium">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0A0A] mb-3 group-hover:text-[#2563EB] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="secondary" size="lg" className="rounded-full px-12 border-[#E5E7EB]">
              Load More Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-[#0A0A0A] rounded-[40px] p-8 md:p-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Get growth tips in your inbox</h2>
          <p className="text-neutral-400 mb-10 max-w-md mx-auto">
            Join 10,000+ marketers and creators receiving our weekly newsletter on social growth.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="you@example.com"
              className="flex-1 h-14 rounded-full bg-neutral-900 border border-neutral-800 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
            />
            <Button variant="svcPrimary" className="h-14 px-8 bg-[#2563EB] hover:bg-[#1d4ed8]">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-neutral-500">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
