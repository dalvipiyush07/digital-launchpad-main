import { useState, useEffect, useRef } from "react";

const IMG_BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
  ? '' 
  : 'http://localhost:8081';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  // scroll state refs — no re-renders needed
  const pos = useRef(0);          // current scroll position
  const vel = useRef(0);          // velocity for momentum
  const touching = useRef(false);
  const hovered = useRef(false);
  const touchX = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/clients');
      setTestimonials(await res.json());
    } catch (e) { console.error(e); }
  };

  // 120fps rAF loop
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || testimonials.length === 0) return;

    const loop = () => {
      const max = slider.scrollWidth - slider.clientWidth;
      if (max <= 0) { rafId.current = requestAnimationFrame(loop); return; }

      if (!touching.current) {
        if (hovered.current) {
          // momentum decay on hover
          vel.current *= 0.92;
          pos.current += vel.current;
        } else {
          // auto-scroll + momentum blend
          vel.current *= 0.95;
          pos.current += vel.current + 0.8; // 0.8px per frame = smooth auto
        }

        // seamless loop
        if (pos.current >= max) pos.current = 0;
        if (pos.current < 0) pos.current = max;

        slider.scrollLeft = pos.current;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [testimonials]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touching.current = true;
    touchX.current = e.touches[0].clientX;
    lastX.current = e.touches[0].clientX;
    lastT.current = Date.now();
    vel.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const slider = sliderRef.current;
    if (!slider) return;

    const now = Date.now();
    const dx = touchX.current - e.touches[0].clientX;

    // velocity tracking for momentum
    const dt = now - lastT.current;
    if (dt > 0) vel.current = (lastX.current - e.touches[0].clientX) / dt * 16;

    lastX.current = e.touches[0].clientX;
    lastT.current = now;

    pos.current = Math.max(0, Math.min(
      slider.scrollWidth - slider.clientWidth,
      pos.current + (e.touches[0].clientX - (touchX.current - dx + e.touches[0].clientX - e.touches[0].clientX))
    ));

    // direct drag
    pos.current += (touchX.current - e.touches[0].clientX);
    touchX.current = e.touches[0].clientX;
    slider.scrollLeft = pos.current;
  };

  const onTouchEnd = () => {
    touching.current = false;
    // momentum continues via vel.current in rAF loop
    setTimeout(() => { vel.current = 0; }, 800);
  };

  if (testimonials.length === 0) return null;

  const items = testimonials.length < 3
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Client Love</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">Happy Clients, Real Results</h2>
          <p className="text-muted-foreground mt-3">Don't just take our word for it.</p>
        </div>

        <div
          ref={sliderRef}
          className="overflow-x-hidden select-none"
          style={{ cursor: "grab", touchAction: "pan-x" }}
          onMouseEnter={() => { hovered.current = true; }}
          onMouseLeave={() => { hovered.current = false; }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex gap-5 pb-2">
            {items.map((t, idx) => {
              const photo = t.photo?.startsWith('/uploads')
                ? `${IMG_BASE}${t.photo}`
                : t.photo;

              return (
                <div
                  key={`${t.id}-${idx}`}
                  className="flex-shrink-0 p-6 rounded-2xl border border-border bg-background"
                  style={{
                    width: "min(320px, 78vw)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  }}
                >
                  {/* Profile row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-white shadow">
                      <img
                        src={photo}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=e0e7ff&color=4f46e5&size=96`;
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-sm leading-tight truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, s) => (
                      <svg key={s} viewBox="0 0 24 24" fill="#facc15" className="w-4 h-4">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm italic text-muted-foreground leading-relaxed line-clamp-4">"{t.text}"</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile swipe hint */}
        <div className="flex items-center justify-center gap-2 mt-5 md:hidden">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-muted-foreground">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="text-xs text-muted-foreground">swipe to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-muted-foreground">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
