import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { API_BASE } from "@/lib/apiBase";

const IMG_BASE = API_BASE;

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  photo: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "fallback-1",
    name: "Rajesh Sekhar",
    role: "CTO, Finova Solutions",
    text: "CloudBuild rebuilt our entire AWS infrastructure from scratch, cutting our monthly bills by 42% while introducing self-healing auto-scaling. Their cloud engineering expertise is world-class.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "fallback-2",
    name: "Sarah Jenkins",
    role: "VP of Product, IntellectSaaS",
    text: "The production-ready AI agent pipeline they deployed has automated 65% of our customer onboarding workflows with extreme precision. Outstanding engineering and professional execution.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "fallback-3",
    name: "Aditya Roy",
    role: "Director of Engineering, HealthNet Group",
    text: "Migrating legacy core workloads to a distributed microservices platform is complex, but CloudBuild did it with zero downtime. They are our go-to technology consulting partner.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "fallback-4",
    name: "Michael Chang",
    role: "VP Engineering, Logistics Express",
    text: "DevOps automation by CloudBuild reduced our pipeline delivery time from 45 minutes to under 3 minutes. Zero-downtime shipping is now a standard operational reality for us.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "fallback-5",
    name: "Nikhil Mehta",
    role: "COO, Apex Retail",
    text: "Their managed SRE services give us total peace of mind. Proactive serverless infrastructure monitoring and dedicated support around the clock.",
    rating: 5,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=150&auto=format&fit=crop"
  }
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/clients');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load client testimonials, using fallback reviews", e);
      }
      setTestimonials(fallbackTestimonials);
    }
    fetchTestimonials();
  }, []);

  // Set up auto-rotation interval
  useEffect(() => {
    if (testimonials.length === 0) return;

    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials, activeIndex]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    resetTimer();
  };

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    resetTimer();
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[activeIndex];
  const photo = current.photo?.startsWith('/uploads')
    ? `${IMG_BASE}${current.photo}`
    : current.photo;

  // Slide transition variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0
    })
  };

  return (
    <section className="py-24 bg-secondary/15 border-b border-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
            Client Love
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-4 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">
            Leading enterprises and scale-ups trust CloudBuild to architect their mission-critical applications.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative px-4 sm:px-12">
          {/* Controls - Left Desktop */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-[#7B2CF5] hover:border-[#7B2CF5] hover:shadow-sm transition-all duration-200 z-10 hidden sm:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Testimonial Card Slider */}
          <div className="overflow-hidden min-h-[300px] sm:min-h-[260px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full bg-background border border-border/60 p-8 sm:p-12 rounded-3xl shadow-sm flex flex-col items-center text-center relative"
              >
                {/* Large Quotation Mark Accent */}
                <span className="absolute top-4 left-6 text-8xl font-serif text-[#7B2CF5]/5 select-none leading-none">“</span>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: current.rating || 5 }).map((_, s) => (
                    <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="font-body text-lg sm:text-xl text-foreground italic leading-relaxed max-w-2xl mb-8">
                  "{current.text}"
                </blockquote>

                {/* Profile Detail */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow bg-muted flex-shrink-0">
                    <img
                      src={photo}
                      alt={current.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(current.name)}&background=7B2CF5&color=fff&size=96`;
                      }}
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <cite className="font-heading font-bold text-base text-foreground not-italic block leading-snug">
                      {current.name}
                    </cite>
                    <span className="font-body text-xs text-muted-foreground block">
                      {current.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls - Right Desktop */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-[#7B2CF5] hover:border-[#7B2CF5] hover:shadow-sm transition-all duration-200 z-10 hidden sm:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Mobile Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-6 sm:hidden">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-[#7B2CF5]"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-[#7B2CF5]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Indicators Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "bg-[#7B2CF5] w-6" : "bg-border w-2 hover:bg-[#7B2CF5]/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
