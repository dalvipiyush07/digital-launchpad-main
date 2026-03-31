import { useEffect, useRef, useState } from "react";

const floatingWords = [
  "Design", "Build", "Launch", "Grow", "Create", "Dream", 
  "Innovate", "Transform", "Elevate", "Inspire"
];

export default function CalligraphicSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Animated floating words background */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingWords.map((word, i) => (
          <div
            key={i}
            className="calligraphic-word absolute text-6xl md:text-8xl font-heading opacity-5 text-white pointer-events-none"
            style={{
              left: `${(i * 23) % 100}%`,
              top: `${(i * 37) % 100}%`,
              transform: `translate(${mousePos.x * (i % 2 === 0 ? 20 : -20)}px, ${mousePos.y * (i % 2 === 0 ? 20 : -20)}px)`,
              transition: 'transform 0.3s ease-out',
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Decorative SVG strokes */}
      <svg className="absolute top-10 left-10 w-32 h-32 opacity-10" viewBox="0 0 100 100">
        <path 
          d="M10,50 Q30,20 50,50 T90,50" 
          stroke="white" 
          strokeWidth="2" 
          fill="none"
          className="brush-stroke"
        />
      </svg>
      <svg className="absolute bottom-10 right-10 w-32 h-32 opacity-10" viewBox="0 0 100 100">
        <path 
          d="M10,50 Q30,80 50,50 T90,50" 
          stroke="white" 
          strokeWidth="2" 
          fill="none"
          className="brush-stroke"
        />
      </svg>

      {/* Center content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Every Great Product Starts With a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Single Vision
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 font-light italic">
            "We don't just build websites. We craft digital experiences that transform businesses."
          </p>
        </div>
      </div>

      {/* Parallax layers */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/50 pointer-events-none"
        style={{
          transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />
    </section>
  );
}
