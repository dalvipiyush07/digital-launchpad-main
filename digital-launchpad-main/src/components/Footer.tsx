import logoImg from "@/assets/logo.png";
import { Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const services = [
    { label: "Cloud Infrastructure", href: "/#services" },
    { label: "DevOps & Automation", href: "/#services" },
    { label: "AI Solutions", href: "/#services" },
    { label: "SaaS Development", href: "/#services" },
    { label: "Cloud Migration", href: "/#services" },
    { label: "Managed Services", href: "/#services" }
  ];

  const industries = [
    { label: "Healthcare", href: "/#industries" },
    { label: "FinTech", href: "/#industries" },
    { label: "Education", href: "/#industries" },
    { label: "E-Commerce", href: "/#industries" },
    { label: "SaaS Startups", href: "/#industries" },
    { label: "Manufacturing", href: "/#industries" }
  ];

  const caseStudies = [
    { label: "AI Interview Platform", href: "/#case-studies" },
    { label: "Cloud Infrastructure", href: "/#case-studies" },
    { label: "Custom SaaS Applications", href: "/#case-studies" }
  ];

  return (
    <footer className="bg-[#0B0C10] text-muted-foreground py-16 border-t border-white/5">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Column 1 — Brand */}
          <div className="col-span-2 lg:col-span-6 space-y-6">
            <div className="flex items-center">
              <img src={logoImg} alt="CloudBuild" className="h-12 md:h-14 w-auto object-contain" />
            </div>
            <p className="font-body text-xs text-muted-foreground/80 leading-relaxed max-w-sm">
              Helping organizations design, deploy, and manage secure cloud infrastructure, AI-powered solutions, and modern digital platforms.
            </p>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <span className="text-white">Email:</span>{" "}
                <a href="mailto:cloudbuild07@gmail.com" className="hover:text-[#7B2CF5] transition-colors text-white font-semibold">
                  cloudbuild07@gmail.com
                </a>
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/cloudbuild-technologies/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/5 text-white/70 flex items-center justify-center transition-all hover:bg-[#7B2CF5] hover:text-white"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/cloud_build_"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 text-white/70 flex items-center justify-center transition-all hover:bg-[#7B2CF5] hover:text-white"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://medium.com/@cloudbuildtechnologies"
                target="_blank"
                rel="noopener noreferrer"
                title="Medium"
                className="w-9 h-9 rounded-full bg-white/5 text-white/70 flex items-center justify-center transition-all hover:bg-[#7B2CF5] hover:text-white font-black text-xs"
              >
                M
              </a>
            </div>
          </div>

          {/* Column 2 — Services */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-xs">
              {services.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="hover:text-[#7B2CF5] transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Industries */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Industries</h4>
            <ul className="space-y-2 text-xs">
              {industries.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="hover:text-[#7B2CF5] transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Case Studies */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Case Studies</h4>
            <ul className="space-y-2 text-xs">
              {caseStudies.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="hover:text-[#7B2CF5] transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs gap-4">
          <p>© {new Date().getFullYear()} CloudBuild. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="/#about" className="hover:text-[#7B2CF5] transition-colors">About</a>
            <a href="/#contact" className="hover:text-[#7B2CF5] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
