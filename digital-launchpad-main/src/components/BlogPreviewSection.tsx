import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

export default function BlogPreviewSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function getBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data.slice(0, 3));
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch homepage blog previews, using fallback data", err);
      }
      setBlogs(fallbackBlogs);
    }
    getBlogs();
  }, []);

  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
              Latest Insights
            </span>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-4 tracking-tight">
              Thought Leadership & Insights
            </h2>
            <p className="font-body text-base text-muted-foreground mt-3 leading-relaxed max-w-xl">
              Deep dives into AI, Cloud Infrastructure, and SaaS architectures written by our senior engineering consultants.
            </p>
          </div>
          <Link
            to="/insights"
            className="inline-flex items-center text-sm font-semibold text-[#7B2CF5] hover:text-[#621dd1] group mt-6 md:mt-0 transition-colors duration-200"
          >
            Explore all insights
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => {
            const isMedium = blog.isMedium || false;
            const linkProps = isMedium
              ? { href: blog.url || "https://medium.com/@cloudbuildtechnologies", target: "_blank", rel: "noopener noreferrer" }
              : { href: `/insights/${blog.slug}` };

            const CardWrapper = isMedium ? "a" : Link;

            return (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex flex-col h-full rounded-2xl bg-secondary/10 border border-border/60 overflow-hidden hover:border-[#7B2CF5]/40 hover:shadow-md transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/40">
                  <img
                    src={blog.coverImage.startsWith("/uploads") ? `http://localhost:8081${blog.coverImage}` : blog.coverImage}
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

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="font-body text-xs text-muted-foreground mb-2 block">
                    {blog.publishedDate}
                  </span>
                  
                  {isMedium ? (
                    <a {...linkProps} className="block group-hover:text-[#7B2CF5] transition-colors duration-200">
                      <h3 className="font-heading font-bold text-lg md:text-xl text-foreground line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>
                    </a>
                  ) : (
                    <Link to={`/insights/${blog.slug}`} className="block group-hover:text-[#7B2CF5] transition-colors duration-200">
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
                        {...linkProps}
                        className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#7B2CF5] group-hover:text-[#621dd1]"
                      >
                        Read on Medium
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-200" />
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
      </div>
    </section>
  );
}
