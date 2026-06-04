import { motion } from "framer-motion";
import { Cloud, GitBranch, Cpu, AppWindow, ArrowRightLeft, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: <Cloud className="w-6 h-6 text-[#7B2CF5]" />,
    title: "Cloud Infrastructure",
    desc: "Design scalable and secure AWS environments."
  },
  {
    icon: <GitBranch className="w-6 h-6 text-[#7B2CF5]" />,
    title: "DevOps & Automation",
    desc: "CI/CD pipelines and deployment automation."
  },
  {
    icon: <Cpu className="w-6 h-6 text-[#7B2CF5]" />,
    title: "AI Solutions",
    desc: "Custom AI applications and integrations."
  },
  {
    icon: <AppWindow className="w-6 h-6 text-[#7B2CF5]" />,
    title: "SaaS Development",
    desc: "Modern web platforms and software products."
  },
  {
    icon: <ArrowRightLeft className="w-6 h-6 text-[#7B2CF5]" />,
    title: "Cloud Migration",
    desc: "Migrate workloads securely to the cloud."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#7B2CF5]" />,
    title: "Managed Services",
    desc: "Ongoing monitoring and support."
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7B2CF5] block mb-3">Our Services</span>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground">
            Capabilities Built for Digital Transformation
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">
            We provide deep expertise across cloud, DevOps, custom software engineering, and AI integrations to accelerate your technology roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}
              className="p-8 rounded-2xl border border-border bg-background transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-6">
                {s.icon}
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-3">{s.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
