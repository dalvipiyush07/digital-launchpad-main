import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { API_BASE } from "@/lib/apiBase";

interface Blog {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  publishedDate: string;
  category: string;
  isMedium?: boolean;
  url?: string;
}

const fallbackBlogs: Blog[] = [
  {
    id: "fallback-1",
    slug: "build-saas-30-days",
    title: "How We Built a SaaS Product in 30 Days",
    summary: "A behind-the-scenes look at rapid SaaS development, agile methodology, and key engineering trade-offs made to ship fast.",
    coverImage: "/placeholder.svg",
    publishedDate: "Feb 15, 2026",
    category: "SaaS Development",
    isMedium: true,
    url: "https://medium.com/@cloudbuildtechnologies"
  },
  {
    id: "fallback-2",
    slug: "why-indian-business-needs-website",
    title: "Why Every Indian Business Needs a Website in 2026",
    summary: "The digital transformation imperative for Indian enterprises and startups in the era of digital payments and AI-driven workflows.",
    coverImage: "/placeholder.svg",
    publishedDate: "Jan 28, 2026",
    category: "Digital Growth",
    isMedium: true,
    url: "https://medium.com/@cloudbuildtechnologies"
  },
  {
    id: "fallback-3",
    slug: "payment-gateway-comparison-india",
    title: "Razorpay vs PayU vs PhonePe: Which Gateway to Choose?",
    summary: "A comprehensive developer-centric comparison of the leading Indian payment gateways, covering integration, fees, and uptime.",
    coverImage: "/placeholder.svg",
    publishedDate: "Dec 10, 2025",
    category: "Dev Integration",
    isMedium: true,
    url: "https://medium.com/@cloudbuildtechnologies"
  }
];

export default function InsightsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function getBlogs() {
      try {
        const res = await fetch(`${API_BASE}/api/blogs`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch blogs in InsightsPage", err);
      }
      setBlogs(fallbackBlogs);
    }
    getBlogs();
    window.scrollTo(0, 0);
  }, []);

  // Dynamically extract categories
  const categories = ["All", ...Array.from(new Set(blogs.map(b => b.category || "Insights")))];

  const filteredBlogs = selectedCategory === "All"
    ? blogs
    : blogs.filter(b => (b.category || "Insights") === selectedCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-32 pb-16 bg-secondary/10 border-b border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
              CloudBuild Insights
            </span>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-foreground mt-6 tracking-tight leading-none">
              Engineering Leadership & Tech Strategy
            </h1>
            <p className="font-body text-lg text-muted-foreground mt-6 leading-relaxed">
              Explore perspectives, guides, and architectural design patterns in Cloud Engineering, SRE, AI Solutions, and SaaS.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Grid section */}
      <main className="py-16 flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 border ${
                  selectedCategory === cat
                    ? "bg-[#7B2CF5] text-white border-[#7B2CF5]"
                    : "bg-secondary/20 text-muted-foreground border-border/60 hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-secondary/10 border border-dashed border-border rounded-3xl">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-semibold">No articles found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => {
                const isMedium = blog.isMedium || false;
                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex flex-col h-full rounded-2xl bg-secondary/10 border border-border/60 overflow-hidden hover:border-[#7B2CF5]/40 hover:shadow-md transition-all duration-300"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/40">
                      <img
                        src={blog.coverImage.startsWith("/uploads") ? `${API_BASE}${blog.coverImage}` : blog.coverImage}
                        alt={blog.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-background/90 text-foreground px-2.5 py-1 rounded-md shadow-sm border border-border/55">
                          {blog.category || "Insights"}
                        </span>
                      </div>
                      {isMedium && (
                        <div className="absolute top-4 right-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-md shadow-sm">
                            Medium ↗
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="font-body text-xs text-muted-foreground mb-2 block">
                        {blog.publishedDate}
                      </span>
                      
                      {isMedium ? (
                        <a
                          href={blog.url || "https://medium.com/@cloudbuildtechnologies"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group-hover:text-[#7B2CF5] transition-colors duration-200"
                        >
                          <h3 className="font-heading font-bold text-lg md:text-xl text-foreground line-clamp-2 leading-snug">
                            {blog.title}
                          </h3>
                        </a>
                      ) : (
                        <Link
                          to={`/insights/${blog.slug}`}
                          className="block group-hover:text-[#7B2CF5] transition-colors duration-200"
                        >
                          <h3 className="font-heading font-bold text-lg md:text-xl text-foreground line-clamp-2 leading-snug">
                            {blog.title}
                          </h3>
                        </Link>
                      )}

                      <p className="font-body text-sm text-muted-foreground mt-3 line-clamp-3 leading-relaxed flex-grow">
                        {blog.summary}
                      </p>

                      <div className="mt-6 pt-4 border-t border-border/40">
                        {isMedium ? (
                          <a
                            href={blog.url || "https://medium.com/@cloudbuildtechnologies"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#7B2CF5] group-hover:text-[#621dd1]"
                          >
                            Read on Medium
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </a>
                        ) : (
                          <Link
                            to={`/insights/${blog.slug}`}
                            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#7B2CF5] group-hover:text-[#621dd1]"
                          >
                            Read Article
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Medium CTA box */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-secondary/20 border border-border/60 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground mb-2">
                Follow CloudBuild on Medium
              </h3>
              <p className="font-body text-sm sm:text-base text-muted-foreground max-w-xl">
                We regularly write about our architectural findings, AWS pricing tips, DevOps automations, and digital launch methodologies.
              </p>
            </div>
            <a
              href="https://medium.com/@cloudbuildtechnologies"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-black text-white font-semibold text-sm hover:bg-[#111] transition-all duration-200 shadow flex items-center gap-2 whitespace-nowrap"
            >
              Visit Medium Publication
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
