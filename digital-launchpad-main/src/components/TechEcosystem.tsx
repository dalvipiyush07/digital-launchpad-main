import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const technologies = [
  { name: "AWS", category: "Cloud Platform", brandColor: "group-hover:text-[#FF9900] group-hover:border-[#FF9900]/30" },
  { name: "Terraform", category: "Infrastructure as Code", brandColor: "group-hover:text-[#7B42BC] group-hover:border-[#7B42BC]/30" },
  { name: "Docker", category: "Containerization", brandColor: "group-hover:text-[#2496ED] group-hover:border-[#2496ED]/30" },
  { name: "Kubernetes", category: "Orchestration", brandColor: "group-hover:text-[#326CE5] group-hover:border-[#326CE5]/30" },
  { name: "GitHub Actions", category: "CI/CD Automation", brandColor: "group-hover:text-[#2088FF] group-hover:border-[#2088FF]/30" },
  { name: "React", category: "Frontend Library", brandColor: "group-hover:text-[#61DAFB] group-hover:border-[#61DAFB]/30" },
  { name: "Next.js", category: "Web Framework", brandColor: "group-hover:text-foreground group-hover:border-foreground/30" },
  { name: "Node.js", category: "Runtime Environment", brandColor: "group-hover:text-[#339933] group-hover:border-[#339933]/30" },
  { name: "Python", category: "AI & Scripting", brandColor: "group-hover:text-[#3776AB] group-hover:border-[#3776AB]/30" },
  { name: "PostgreSQL", category: "Relational Database", brandColor: "group-hover:text-[#4169E1] group-hover:border-[#4169E1]/30" },
  { name: "MongoDB", category: "NoSQL Database", brandColor: "group-hover:text-[#47A248] group-hover:border-[#47A248]/30" }
];

export default function TechEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      targetX: number | null = null;
      targetY: number | null = null;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5 + 0.8;
      }

      update(attractors: { x: number; y: number }[]) {
        // If there are card attractors, pull particles gently towards them
        if (attractors.length > 0) {
          // Find closest attractor
          let closest = attractors[0];
          let minDist = Infinity;
          for (const att of attractors) {
            const dx = att.x - this.x;
            const dy = att.y - this.y;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
              minDist = dist;
              closest = att;
            }
          }

          const dist = Math.sqrt(minDist);
          if (dist < 180) {
            // Apply gravitational pull towards card centers
            const pullForce = (180 - dist) / 180 * 0.12;
            const dirX = (closest.x - this.x) / dist;
            const dirY = (closest.y - this.y) / dist;
            this.vx += dirX * pullForce;
            this.vy += dirY * pullForce;
          }
        }

        // Apply velocity with speed limit
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 1.2) {
          this.vx = (this.vx / speed) * 1.2;
          this.vy = (this.vy / speed) * 1.2;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Friction / Drag
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Add minor random drift to prevent static grouping
        this.vx += (Math.random() - 0.5) * 0.08;
        this.vy += (Math.random() - 0.5) * 0.08;

        // Bounce back from boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(156, 163, 175, 0.4)"; // Light gray particles
        ctx.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 85 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Get attractor centers from tech cards
      const cards = container.querySelectorAll(".tech-card");
      const containerRect = container.getBoundingClientRect();
      
      const attractors = Array.from(cards).map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });

      // Update and draw particles
      particles.forEach((p) => {
        p.update(attractors);
        p.draw();
      });

      // Draw connection lines between nearby particles
      ctx.strokeStyle = "rgba(123, 44, 245, 0.04)"; // Soft purple lines
      ctx.lineWidth = 1.0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 75 * 75) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      width = canvasRef.current.width = containerRef.current.clientWidth;
      height = canvasRef.current.height = containerRef.current.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="tech-ecosystem" className="py-20 bg-secondary/35 border-y border-border relative overflow-hidden">
      {/* Subtle background canvas for reorganize-particles effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10" ref={containerRef}>
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7B2CF5] block mb-3">Ecosystem</span>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-black">
            Our Technology Stack
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">
            We build with industry-standard, battle-tested technologies to guarantee scalability, security, and developer efficiency.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`tech-card group p-6 rounded-2xl border border-border/80 bg-background text-center transition-all duration-300 flex flex-col justify-center items-center cursor-default ${tech.brandColor}`}
            >
              <span className="font-heading font-bold text-lg text-muted-foreground group-hover:text-inherit transition-colors block mb-1">
                {tech.name}
              </span>
              <span className="font-body text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground transition-colors uppercase tracking-wider font-semibold">
                {tech.category}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
