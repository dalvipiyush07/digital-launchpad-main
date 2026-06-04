import { motion } from "framer-motion";
import { Cloud, Brain, Infinity, Server, ShieldCheck, AppWindow } from "lucide-react";

export default function TrustSection() {
  const capabilities = [
    {
      icon: Cloud,
      title: "Cloud Engineering",
      desc: "Scalable, secure, and resilient cloud architectures using modern cloud-native design principles."
    },
    {
      icon: Brain,
      title: "AI Solutions",
      desc: "Production-ready LLM pipelines, intelligent workflows, and predictive analytics that create real business value."
    },
    {
      icon: Infinity,
      title: "DevOps Automation",
      desc: "Continuous integration, delivery pipelines, infrastructure as code, and GitOps workflows for zero-downtime shipping."
    },
    {
      icon: Server,
      title: "AWS Infrastructure",
      desc: "Advanced consulting and implementation on AWS, from multi-account landing zones to serverless backends."
    },
    {
      icon: ShieldCheck,
      title: "Managed Services",
      desc: "Proactive maintenance, site reliability engineering, 24/7 incident response, and performance tuning."
    },
    {
      icon: AppWindow,
      title: "SaaS Development",
      desc: "Custom web applications, API integrations, microservices architecture, and enterprise SaaS platforms built for scale."
    }
  ];

  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
            Capabilities
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-4 tracking-tight">
            Enterprise-Grade Digital Solutions
          </h2>
          <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">
            Accelerating digital outcomes for enterprises and fast-growing companies with robust technology consulting.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-8 rounded-2xl bg-secondary/20 border border-border/60 flex flex-col justify-between hover:border-[#7B2CF5]/40 hover:bg-background hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-[#7B2CF5] group-hover:bg-[#7B2CF5] group-hover:text-white transition-all duration-300 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
