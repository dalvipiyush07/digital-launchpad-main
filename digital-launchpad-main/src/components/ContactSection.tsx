import { useState } from "react";
import { toast } from "sonner";
import { API_BASE } from "@/lib/apiBase";

const WA_LINK = "https://wa.me/917709646107?text=Hi%20CloudBuild!%20I%20visited%20your%20website%20and%20I%27m%20interested%20in%20your%20services.%20I%27d%20like%20to%20discuss%20my%20project.";
const WA_AFTER_SUBMIT = "https://wa.me/917709646107?text=Hi%20CloudBuild!%20I%20just%20submitted%20a%20contact%20form%20on%20your%20website.%20Looking%20forward%20to%20hearing%20from%20you!";

const serviceOptions = [
  "Website", "SaaS", "E-commerce", "Admin Panel", "Mobile App", "Payment Integration", "Automation", "Other",
];

const contactItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "shivam.garud2011@gmail.com",
    href: "mailto:shivam.garud2011@gmail.com",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
      </svg>
    ),
    label: "Phone",
    value: "+91 7709646107",
    href: "tel:+917709646107",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.428a.5.5 0 00.609.61l5.652-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.882 1.016 1.034-3.772-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
    label: "WhatsApp",
    value: "+91 7709646107",
    href: WA_LINK,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Location",
    value: "Pune, Maharashtra, India",
    href: null,
    color: "bg-orange-50 text-orange-600",
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/cloud_build_",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/cloudbuild-technologies/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: WA_LINK,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.428a.5.5 0 00.609.61l5.652-1.48A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.504-5.23-1.385l-.374-.22-3.882 1.016 1.034-3.772-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
    ),
  },
];

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message')
    };

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        toast.success("Message sent! Redirecting you to WhatsApp... 🚀");
        e.currentTarget.reset();
        setTimeout(() => window.open(WA_AFTER_SUBMIT, '_blank'), 2000);
      } else {
        toast.error("Something went wrong. Please WhatsApp us directly.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 lg:py-16 section-alt">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Get In Touch</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">Let's Build Something Great</h2>
        </div>

        <div className="max-w-5xl mx-auto rounded-3xl p-1"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden">

            {/* LEFT PANEL */}
            <div className="p-8 lg:p-10 space-y-4" style={{ background: "rgba(248,250,252,0.7)" }}>
              <h3 className="font-heading font-bold text-xl mb-6">Contact Info</h3>

              {contactItems.map((item, i) => (
                <div
                  key={item.label}
                  className="contact-info-card flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-white/60"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Follow us on */}
              <div className="pt-4">
                <div className="h-px bg-border mb-4" />
                <p className="text-xs text-muted-foreground font-medium mb-3">Follow us on</p>
                <div className="flex gap-3">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      className="social-circle w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center transition-all duration-300 hover:bg-primary hover:scale-110 hover:shadow-lg"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-muted-foreground italic">🇮🇳 Exclusively Available Across India</span>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="p-8 lg:p-10 bg-white/50">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-green-600">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="text-lg font-heading font-bold text-foreground">Message Sent!</p>
                  <p className="text-muted-foreground mt-2 text-sm">Redirecting you to WhatsApp... 🚀</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col justify-center">
                  <h3 className="font-heading font-bold text-xl mb-2">Send a Message</h3>
                  <input name="name" placeholder="Your Name" required className="contact-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200" />
                  <input name="phone" placeholder="Phone / WhatsApp" className="contact-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200" />
                  <input name="email" type="email" placeholder="Email Address" required className="contact-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200" />
                  <select name="service" required className="contact-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 text-muted-foreground">
                    <option value="">Select Service</option>
                    {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <textarea name="message" placeholder="Tell us about your project..." rows={4} className="contact-input w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none" />
                  <button type="submit" disabled={loading}
                    className="contact-submit w-full px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
