import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

function CountingNumber({ value, suffix = "", isFloat = false }: { value: number | string; suffix?: string; isFloat?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const isNumeric = typeof value === "number";

  useEffect(() => {
    if (!isInView || !isNumeric) return;
    
    const start = 0;
    const end = value as number;
    const duration = 1500;
    const startTime = performance.now();
    
    let frameId: number;
    
    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress); // Easing out quad
      const currentVal = easeProgress * (end - start) + start;
      
      if (isFloat) {
        setCount(parseFloat(currentVal.toFixed(1)) as any);
      } else {
        setCount(Math.floor(currentVal));
      }
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value, isNumeric, isFloat]);

  if (!isNumeric) {
    return <span ref={ref}>{value}{suffix}</span>;
  }

  return (
    <span ref={ref}>
      {isFloat ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

export default function TrustMetrics() {
  const items = [
    { value: 50, suffix: "+", label: "Deployments", desc: "Enterprise cloud integrations successfully delivered." },
    { value: 99.9, suffix: "%", isFloat: true, label: "Infrastructure Uptime", desc: "Reliable, self-healing setups running on AWS." },
    { value: "24/7", label: "", desc: "Proactive infrastructure monitoring and maintenance." },
    { value: "Cloud", label: "", desc: "Architectures designed by certified experts." }
  ];

  // Specific mapping to matching titles requested in spec
  const displayItems = [
    { value: 50, suffix: "+", label: "Deployments", desc: "Enterprise cloud integrations successfully delivered." },
    { value: 99.9, suffix: "%", isFloat: true, label: "Infrastructure Uptime", desc: "Reliable, self-healing setups running on AWS." },
    { value: "24/7", label: "Support", desc: "Proactive monitoring and dedicated incident response." },
    { value: "Cloud", label: "Certified Solutions", desc: "Architectures designed by certified professionals." }
  ];

  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-secondary/30 border border-border/60 flex flex-col justify-between hover:border-primary/20 hover:bg-background hover:shadow-sm transition-all duration-300"
            >
              <div>
                <span className="font-heading font-black text-4xl sm:text-5xl text-foreground block mb-2">
                  <CountingNumber value={item.value} suffix={item.suffix} isFloat={item.isFloat} />
                </span>
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">{item.label}</h3>
              </div>
              <p className="font-body text-xs text-muted-foreground leading-relaxed mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
