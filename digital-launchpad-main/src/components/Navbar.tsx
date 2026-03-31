import { useState, useEffect } from "react";
import logoImg from "@/assets/logo.jpg";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Clients", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/95 backdrop-blur shadow-md" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <img src={logoImg} alt="Cloud Build" className="h-12 w-auto rounded" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#contact"
            className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
            Get Started
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 z-[60] relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Full screen mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col"
          style={{
            background: "#ffffff",
            animation: "slideInPanel 0.3s cubic-bezier(0.32,0.72,0,1) forwards",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 flex-shrink-0">
            <a href="#" onClick={() => setMenuOpen(false)}>
              <img src={logoImg} alt="Cloud Build" className="h-10 w-auto rounded" />
            </a>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-gray-600">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Nav Cards */}
          <div className="flex-1 px-5 py-6 space-y-3 overflow-y-auto">
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="nav-menu-card relative flex items-center justify-between px-5 py-5 rounded-2xl overflow-hidden active:scale-95 transition-transform duration-150"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #f1f5f9",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  animation: `cardSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${60 + i * 60}ms both`,
                }}
              >
                {/* Ribbon shimmer */}
                <span className="nav-ribbon" />

                <span className="text-base font-bold text-gray-900 relative z-10">{l.label}</span>
                <span
                  className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-gray-500">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </a>
            ))}
          </div>

          {/* Get Started */}
          <div
            className="px-5 pb-8 flex-shrink-0"
            style={{ animation: `cardSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${60 + navLinks.length * 60}ms both` }}
          >
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="relative flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold text-white overflow-hidden active:scale-95 transition-transform duration-150"
              style={{ background: "#0f172a", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
            >
              <span className="nav-ribbon-dark" />
              <span className="relative z-10">Get Started →</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
