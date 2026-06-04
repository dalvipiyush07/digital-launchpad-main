import { motion } from "framer-motion";
import { HeartPulse, CreditCard, GraduationCap, ShoppingBag, Zap, Factory } from "lucide-react";

const industries = [
  {
    icon: <HeartPulse className="w-5 h-5 text-primary" />,
    name: "Healthcare",
    desc: "HIPAA-compliant patient portals, clinic management software, and telehealth integration platforms."
  },
  {
    icon: <CreditCard className="w-5 h-5 text-primary" />,
    name: "FinTech",
    desc: "Secure payment architectures, custom accounting systems, and investment tracking dashboards."
  },
  {
    icon: <GraduationCap className="w-5 h-5 text-primary" />,
    name: "Education",
    desc: "Scalable Learning Management Systems (LMS), virtual classrooms, and automated examination platforms."
  },
  {
    icon: <ShoppingBag className="w-5 h-5 text-primary" />,
    name: "E-Commerce",
    desc: "High-performance digital storefronts, customized cart systems, and integrated inventory workflows."
  },
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    name: "SaaS Startups",
    desc: "Multi-tenant cloud backends, subscription billing systems, and responsive admin dashboard panels."
  },
  {
    icon: <Factory className="w-5 h-5 text-primary" />,
    name: "Manufacturing",
    desc: "Process tracking solutions, supply chain dashboards, and custom resource planning tools."
  }
];

export default function IndustriesSection() {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="industries" className="py-20 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">Industries</span>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground">
            Tailored Industry Expertise
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">
            We build specialized digital engineering systems that address unique regulatory, security, and performance needs across different sectors.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {industries.map((ind) => (
            <motion.div
              key={ind.name}
              variants={itemVariants}
              whileHover={{ y: -4, border: "1px solid rgba(161, 0, 255, 0.2)" }}
              className="p-8 rounded-2xl border border-border bg-background transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-6">
                {ind.icon}
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-3">{ind.name}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{ind.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
