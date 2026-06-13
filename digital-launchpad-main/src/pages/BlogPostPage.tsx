import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { ArrowLeft, Calendar, User, ExternalLink, Clock } from "lucide-react";
import { API_BASE } from "@/lib/apiBase";

interface Blog {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
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
    content: `Building a SaaS product is often perceived as a multi-month or multi-year endeavor. However, using modern frameworks and agile paradigms, we successfully shipped a fully functional enterprise SaaS platform in exactly 30 days. Here is the framework we used to make it happen.

### Phase 1: Scope Hard & Define the Core (Days 1–5)
The absolute biggest threat to speed is scope creep. In the first 5 days, we stripped the product down to its core value proposition. Any feature that did not directly serve this core was deferred to post-launch milestones.

### Phase 2: Tech Stack Selection (Days 6–8)
We chose technologies that optimize for developer speed, type safety, and automatic scaling:
- **Frontend:** React with Vite & TailwindCSS for ultra-fast UI rendering and clean styling.
- **Backend:** Node.js with Express and TypeScript for robust type checking.
- **Database:** PostgreSQL for structured data integrity.
- **Hosting:** AWS Serverless & Vercel for instant deployments and zero server management overhead.

### Phase 3: The Build Sprint (Days 9–25)
Using a 2-week intensive development sprint, we developed the client interface, API schemas, and transactional databases. Daily stand-ups kept the engineering team aligned.

### Phase 4: Integration & Gateway Setup (Days 26–28)
We integrated payment processing via Razorpay API, configured custom domain routing, and set up automatic SSL certificates on AWS.

### Phase 5: Verification & Launch (Days 29–30)
After running end-to-end user tests, we launched the initial version, immediately onboarding our first batch of client accounts. By adopting a strict MVP mindset, we saved thousands in development costs and proved our market fit on day 30.`,
    coverImage: "/placeholder.svg",
    publishedDate: "Feb 15, 2026",
    category: "SaaS Development",
    isMedium: false
  },
  {
    id: "fallback-2",
    slug: "why-indian-business-needs-website",
    title: "Why Every Indian Business Needs a Website in 2026",
    summary: "The digital transformation imperative for Indian enterprises and startups in the era of digital payments and AI-driven workflows.",
    content: `The business ecosystem in India is transforming at an unprecedented pace. Driven by digital payments (UPI) and a hyper-connected consumer base, traditional modes of operation are no longer sufficient. Having a professional, fast, and search-optimized website is no longer optional; it is a critical requirement.

### 1. Establish Enterprise Credibility
Modern customers do not look at business cards; they look at search engines. An enterprise-grade website immediately establishes your authority and signals to local and international clients that you are a legitimate corporate entity.

### 2. Streamline Transactions & Integrations
With direct integrations like Razorpay, PhonePe, and WhatsApp APIs, your website becomes an automated sales tool. Client leads can book consulting sessions or pay invoices instantly without manual paperwork.

### 3. Harness organic Search Traffic (SEO)
SEO is the most cost-effective lead generation source. A fast website optimized for keywords like "enterprise IT consulting Surat" or "cloud solutions Pune" connects you with active searchers at the exact moment they need your services.

### Conclusion
As we navigate 2026, businesses without a central digital anchor will be out-competed by tech-enabled rivals. Building a premium corporate website is the single highest-return digital asset you can create.`,
    coverImage: "/placeholder.svg",
    publishedDate: "Jan 28, 2026",
    category: "Digital Growth",
    isMedium: false
  },
  {
    id: "fallback-3",
    slug: "payment-gateway-comparison-india",
    title: "Razorpay vs PayU vs PhonePe: Which Gateway to Choose?",
    summary: "A comprehensive developer-centric comparison of the leading Indian payment gateways, covering integration, fees, and uptime.",
    content: `Choosing the right payment processor is critical for any Indian web application or SaaS platform. Today, we break down Razorpay, PayU, and PhonePe across three critical dimensions: integration complexity, transaction success rates, and support.

### Razorpay: The Developer Choice
- **Uptime & Routing:** Excellent. Their smart routing system automatically shifts transactions to secondary rails in case of bank outages.
- **Integration:** Best-in-class developer documentation, clear SDKs, and prebuilt UI checkout overlays.
- **Suitability:** Best overall for SaaS billing, custom subscription plans, and modern apps.

### PayU: The Enterprise Leader
- **Uptime & Routing:** Highly stable. Used by some of India's largest e-commerce websites.
- **Integration:** Documentation can be slightly complex compared to Razorpay, but highly robust for high-volume transactions.
- **Suitability:** Excellent for established enterprise businesses processing large ticket sizes.

### PhonePe PG: The Agile Challenger
- **Uptime & Routing:** Fast and reliable, leveraging their massive consumer app infrastructure.
- **Integration:** Clear, standard APIs.
- **Suitability:** Great for mobile-first apps and businesses prioritizing consumer-direct payments.

### Recommendation
If you are launching a new SaaS or web app, start with **Razorpay** due to their developer friendly ecosystem. For enterprise operations processing millions in monthly invoices, look at **PayU** alongside Razorpay for redundancy.`,
    coverImage: "/placeholder.svg",
    publishedDate: "Dec 10, 2025",
    category: "Dev Integration",
    isMedium: false
  }
];

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBlog() {
      setLoading(true);
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const matched = data.find((b: Blog) => b.slug === slug);
            if (matched) {
              setBlog(matched);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching blog details", err);
      }
      
      // Fallback matching
      const matchedFallback = fallbackBlogs.find(b => b.slug === slug);
      if (matchedFallback) {
        setBlog(matchedFallback);
      } else {
        setBlog(null);
      }
      setLoading(false);
    }
    getBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  // Format content body helper
  const renderFormattedContent = (contentString: string) => {
    return contentString.split("\n\n").map((block, index) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h3 key={index} className="font-heading font-bold text-2xl text-foreground mt-8 mb-4">
            {trimmed.replace("###", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h2 key={index} className="font-heading font-black text-3xl text-foreground mt-10 mb-6 border-b border-border pb-2">
            {trimmed.replace("##", "").trim()}
          </h2>
        );
      }
      if (trimmed.startsWith("- ")) {
        return (
          <ul key={index} className="list-disc pl-6 space-y-2 my-4 text-muted-foreground font-body text-base">
            {trimmed.split("\n").map((li, lIdx) => (
              <li key={lIdx}>{li.replace("- ", "").trim()}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-20">
          <p className="text-muted-foreground font-semibold">Loading article details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center pt-20 px-6 text-center">
          <h1 className="font-heading font-black text-3xl text-foreground mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you are trying to view does not exist or has been removed.</p>
          <Link to="/insights" className="px-6 py-2.5 rounded-full bg-[#7B2CF5] text-white font-semibold hover:bg-[#621dd1]">
            Back to Insights
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Link
            to="/insights"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-[#7B2CF5] mb-8 group transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Insights
          </Link>

          {/* Article Header */}
          <header className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
              {blog.category}
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-foreground mt-6 mb-6 tracking-tight leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border/60 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#7B2CF5]" />
                <span>CloudBuild Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7B2CF5]" />
                <span>{blog.publishedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7B2CF5]" />
                <span>5 min read</span>
              </div>
            </div>
          </header>

          {/* Cover image */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border/60 mb-12 shadow-sm">
            <img
              src={blog.coverImage.startsWith("/uploads") ? `${API_BASE}${blog.coverImage}` : blog.coverImage}
              alt={blog.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop";
              }}
            />
          </div>

          {/* Article Body */}
          <article className="prose prose-[#7B2CF5] max-w-none mb-16">
            {blog.isMedium ? (
              <div className="text-center py-12 px-6 bg-secondary/20 border border-border/60 rounded-3xl">
                <p className="font-body text-base text-muted-foreground mb-6 max-w-md mx-auto">
                  This article is published on our official Medium channel. Read the full post directly on Medium for the full rich-text layout.
                </p>
                <a
                  href={blog.url || "https://medium.com/@cloudbuildtechnologies"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white font-semibold text-sm hover:bg-[#111] transition-all duration-200 shadow gap-2"
                >
                  Read full article on Medium
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              renderFormattedContent(blog.content || blog.summary)
            )}
          </article>

          {/* Author Callout */}
          <div className="p-8 rounded-2xl bg-secondary/15 border border-border/60 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#7B2CF5]/10 text-[#7B2CF5] flex items-center justify-center font-heading font-black text-lg flex-shrink-0">
              CB
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-foreground mb-1">
                Written by CloudBuild Engineering
              </h4>
              <p className="font-body text-xs sm:text-sm text-muted-foreground leading-relaxed">
                CloudBuild is a premium technology consulting company specializing in AWS Cloud, SRE, custom SaaS engineering, and enterprise AI enablement. Contact us to design and scale your digital platforms.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
