import { motion } from "framer-motion";

const projects = [
  {
    title: "FCT Interview",
    category: "AI-Powered Interview & Hiring Platform",
    desc: "An automated end-to-end recruitment screening system that auto-grades speech answers, tracks attendance, and generates custom remarks and certificates.",
    techStack: ["React", "Node.js", "Express", "PostgreSQL", "AWS Transcribe"],
    outcome: "Automated candidate evaluations, saving hiring managers 18+ hours per week and reducing time-to-hire by 40%.",
    url: "https://fctinterview.online/"
  },
  {
    title: "Cloud Infrastructure Deployments",
    category: "DevOps & Cloud Engineering",
    desc: "Automated cloud environments running self-healing nodes, integrated securely with continuous integration pipelines.",
    techStack: ["AWS", "Terraform", "Docker", "GitHub Actions", "Nginx"],
    outcome: "Achieved 99.99% system availability, reduced deployment time from hours to 5 minutes, and automated scaling to handle 10x traffic spikes.",
    url: "https://terraa.online/"
  },
  {
    title: "Custom SaaS Applications",
    category: "Enterprise Software Engineering",
    desc: "Multi-tenant software architectures built with secure data isolation models and responsive admin dashboard panels.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    outcome: "Onboarded 30+ enterprise accounts in the first month, reduced onboarding costs by 60%, and scaled to support 100k+ MAU."
  }
];

export default function ProjectsSection() {
  return (
    <section id="work" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-3">Portfolio</span>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground">
            Capabilities In Action
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">
            A selection of modern cloud environments, automated digital platforms, and custom software systems designed for enterprise performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.04)" }}
              className="p-8 rounded-3xl border border-border bg-background flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-2">{p.category}</span>
                <h3 className="font-heading font-bold text-xl text-foreground mb-3">{p.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed mb-6">{p.desc}</p>
                
                <div className="mb-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-foreground mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-foreground font-semibold border border-border/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border/60 mb-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-foreground mb-1">Business Impact</h4>
                  <p className="font-body text-xs text-foreground font-medium leading-relaxed">{p.outcome}</p>
                </div>
              </div>

              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2.5 rounded-full border border-border bg-secondary/50 font-semibold text-xs text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 block"
                >
                  Visit Project →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
