const blogs = [
  { title: "How We Built a SaaS Product in 30 Days", cat: "SaaS", date: "Feb 2025", desc: "A behind-the-scenes look at rapid SaaS development.", url: "https://medium.com" },
  { title: "Why Every Indian Business Needs a Website in 2025", cat: "Growth", date: "Jan 2025", desc: "The digital transformation imperative for Indian businesses.", url: "https://medium.com" },
  { title: "Razorpay vs PayU vs PhonePe: Which Gateway to Choose?", cat: "Dev", date: "Dec 2024", desc: "A comprehensive comparison of Indian payment gateways.", url: "https://medium.com" },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">From Our Blog</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">Insights & Ideas on Medium</h2>
          <p className="text-muted-foreground mt-3">We share what we learn — tech, startups, digital growth tips.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <a
              key={b.title}
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-up p-6 rounded-lg border border-border bg-background card-hover block"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span className="inline-block px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase mb-3">
                {b.cat}
              </span>
              <h3 className="font-heading font-bold text-lg mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{b.desc}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{b.date}</span>
                <span className="font-semibold text-primary">Medium ↗</span>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-10 fade-up">
          <a
            href="https://medium.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-full border border-foreground font-semibold text-sm hover:bg-foreground hover:text-background transition-colors"
          >
            Read More on Medium ↗
          </a>
        </div>
      </div>
    </section>
  );
}
