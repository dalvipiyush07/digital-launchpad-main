import { useState, useEffect } from "react";
import founder1 from "@/assets/founder1.jpg";
import founder2 from "@/assets/founder2.jpg";

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        setHasAnimated(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [target, hasAnimated]);

  return <span>{(count / 1000).toFixed(1)}k+</span>;
}

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Grid background */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-background mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            Websites • SaaS Platforms • Automation
          </span>
        </div>

        {/* Compact Founder photos - profile card style */}
        <div className="hero-photos flex gap-2 mb-6">
          <div className="w-32 h-40 md:w-36 md:h-44 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={founder1}
              alt="Cloud Build Founder"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-32 h-40 md:w-36 md:h-44 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={founder2}
              alt="Cloud Build Co-Founder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="hero-headline font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight max-w-4xl mb-3">
          <span className="word-reveal">Turning</span>{" "}
          <span className="word-reveal">Visions</span>{" "}
          <span className="word-reveal">Into</span>{" "}
          <span className="text-gradient word-reveal">Digital</span>{" "}
          <span className="word-reveal">Reality</span>
        </h1>

        <p className="hero-subtext max-w-2xl text-muted-foreground text-sm mb-5">
          We help startups, local businesses, and growing brands launch websites, SaaS platforms, and digital systems designed to grow faster and work smarter — across India.
        </p>

        <div className="hero-buttons flex flex-row flex-wrap gap-3 mb-4 justify-center">
          <a
            href="#services"
            className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Explore Services →
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-full border border-foreground font-semibold hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Contact Us
          </a>
        </div>

        {/* Counter + Instagram inline */}
        <div className="hero-counter flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">Community of <AnimatedCounter target={44800} /> People</span>
          <span className="hidden sm:inline text-border">|</span>
          <a href="https://www.instagram.com/cloud_build_" target="_blank" rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            @cloud_build_ ↗
          </a>
        </div>
      </div>
    </section>
  );
}
