import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { API_BASE } from "@/lib/apiBase";

const WA_LINK = "https://wa.me/917709646107?text=Hi%20CloudBuild!%20I%27m%20interested%20in%20your%20enterprise%20consulting%20services.%20I%27d%20like%20to%20discuss%20our%20project.";
const WA_AFTER_SUBMIT = "https://wa.me/917709646107?text=Hi%20CloudBuild!%20I%20just%20submitted%20a%20consultation%20request%20on%20your%20website.%20Looking%20forward%20to%20our%20discussion!";

const serviceOptions = [
  "Cloud Infrastructure", "DevOps & Automation", "AI Solutions", "SaaS Development", "Cloud Migration", "Managed Services", "Other"
];

export default function FinalCTA() {
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
        toast.success("Consultation request received! Connecting to WhatsApp... 🚀");
        e.currentTarget.reset();
        setTimeout(() => window.open(WA_AFTER_SUBMIT, '_blank'), 2000);
      } else {
        toast.error("An error occurred. Please connect with our team directly via WhatsApp.");
      }
    } catch (error) {
      toast.error("An error occurred. Please connect with our team directly via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Banner Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-heading font-black text-3xl md:text-5xl text-foreground mb-4"
          >
            Need a Reliable Technology Partner?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-body text-base md:text-lg text-muted-foreground mb-8"
          >
            Let's discuss your cloud, AI and software goals.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-sm"
            >
              Schedule Consultation
            </a>
            <a
              href="#contact-form"
              className="px-6 py-3 rounded-full border border-border bg-secondary/80 font-bold text-xs uppercase tracking-wider hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Contact Us
            </a>
          </motion.div>
        </div>

        {/* Contact Form Section */}
        <div 
          id="contact-form"
          className="rounded-3xl border border-border overflow-hidden grid lg:grid-cols-2 shadow-sm bg-background scroll-margin-top"
          style={{ scrollMarginTop: "100px" }}
        >
          {/* Left panel info */}
          <div className="p-8 lg:p-12 bg-secondary/30 border-r border-border space-y-8">
            <h3 className="font-heading font-bold text-xl text-foreground">Corporate Channels</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</h4>
                  <a href="mailto:cloudbuild07@gmail.com" className="font-body text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    cloudbuild07@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone</h4>
                  <a href="tel:+917709646107" className="font-body text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    +91 7709646107
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">WhatsApp Support</h4>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="font-body text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    Message Us Online
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Instagram</h4>
                  <a href="https://www.instagram.com/cloud_build_" target="_blank" rel="noopener noreferrer" className="font-body text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    @cloud_build_
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary flex-shrink-0 font-black text-xs">
                  M
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Medium</h4>
                  <a href="https://medium.com/@cloudbuildtechnologies" target="_blank" rel="noopener noreferrer" className="font-body text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    @cloudbuildtechnologies
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location</h4>
                  <p className="font-body text-sm text-foreground font-semibold">
                    Pune, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel form */}
          <div className="p-8 lg:p-12">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="font-heading font-bold text-lg text-foreground">Message Sent</p>
                <p className="font-body text-xs text-muted-foreground mt-2">Connecting you directly to WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">Send a Message</h3>
                
                <input 
                  name="name" 
                  placeholder="Your Name / Organization" 
                  required 
                  className="w-full px-4 py-3 rounded-xl text-sm border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
                <input 
                  name="phone" 
                  placeholder="Phone / WhatsApp Number" 
                  className="w-full px-4 py-3 rounded-xl text-sm border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  className="w-full px-4 py-3 rounded-xl text-sm border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                />
                <select 
                  name="service" 
                  required 
                  className="w-full px-4 py-3 rounded-xl text-sm border border-border bg-background text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="">Select Service Area</option>
                  {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <textarea 
                  name="message" 
                  placeholder="Describe your goals or project requirements..." 
                  rows={4} 
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" 
                />
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full px-6 py-3 rounded-full bg-foreground text-background font-bold text-xs uppercase tracking-wider transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
