import { motion } from "framer-motion";
import { Maximize, Lock, Cloud, Coins, Zap, LifeBuoy } from "lucide-react";

const reasons = [
  {
    icon: <Maximize className="w-5 h-5 text-primary" />,
    title: "Scalable Architecture",
    desc: "Designing applications and databases prepared to scale vertically and horizontally to match traffic increases without system failure."
  },
  {
    icon: <Lock className="w-5 h-5 text-primary" />,
    title: "Security First",
    desc: "Adhering to strict compliance standards, end-to-end encryption, regular penetration tests, and secure cloud resource structures."
  },
  {
    icon: <Cloud className="w-5 h-5 text-primary" />,
    title: "Cloud Native Expertise",
    desc: "Fully cloud-native pipelines leveraging managed services, serverless technology, and containerization to lower development overhead."
  },
  {
    icon: <Coins className="w-5 h-5 text-primary" />,
    title: "Cost Optimization",
    desc: "Eliminating computing waste and configuration errors, ensuring budgets are spent efficiently to drive ROI."
  },
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    title: "Rapid Delivery",
    desc: "Utilizing modern deployment automation, CI/CD, and IaC templates to accelerate time-to-market and release speed."
  },
  {
    icon: <LifeBuoy className="w-5 h-5 text-primary" />,
    title: "Long-Term Support",
    desc: "Offering ongoing support agreements, monitoring service levels, and updating configurations as your company expands."
  }
];

export default function WhyCloudBuild() {
  return (
    <section id="why-cloudbuild" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">Why Us</span>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground">
            The CloudBuild Advantage
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">
            We partner with businesses to build technology platforms that are robust, secure, cost-efficient, and aligned with enterprise growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-8 rounded-2xl border border-border bg-background hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-6">
                  {r.icon}
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-3">{r.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
