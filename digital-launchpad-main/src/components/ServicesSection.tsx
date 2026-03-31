const services = [
  { icon: "🌐", title: "Business Website", desc: "Modern, fast, mobile-ready websites that convert visitors into customers." },
  { icon: "⚙️", title: "SaaS Development", desc: "End-to-end SaaS platforms with dashboards, user management, and billing." },
  { icon: "🛒", title: "E-commerce Solutions", desc: "Full-featured online stores with cart, payments, and inventory management." },
  { icon: "📊", title: "Admin Dashboards", desc: "Powerful admin panels that give you full control over your digital products." },
  { icon: "💳", title: "Payment Integration", desc: "Razorpay, PayU, PhonePe, and all major Indian payment gateways." },
  { icon: "🤖", title: "Business Automation", desc: "Automate workflows, WhatsApp bots, CRM, and repetitive tasks." },
  { icon: "📱", title: "Mobile Apps", desc: "Cross-platform iOS and Android apps that scale with your business." },
  { icon: "🔧", title: "Maintenance & Support", desc: "Ongoing technical support, updates, and performance monitoring." },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">What We Do</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">
            Everything Your Business Needs to Go Online
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            From idea to launch — we build complete digital systems that work for your business.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="fade-up service-card p-6 rounded-lg border border-border bg-background"
              style={{ 
                boxShadow: "var(--shadow-card)",
                transitionDelay: `${i * 0.08}s`
              }}
            >
              <div className="service-icon w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl mb-4">
                {s.icon}
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
