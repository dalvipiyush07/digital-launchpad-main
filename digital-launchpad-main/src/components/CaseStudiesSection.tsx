import { motion } from "framer-motion";

const caseStudies = [
  {
    title: "FCT Interview",
    category: "AI-Powered Interview & Hiring Platform",
    desc: "An automated end-to-end recruitment screening system that auto-grades speech answers, tracks attendance, and generates custom remarks and certificates.",
    challenge: "Traditional recruitment screening processes were highly manual, time-consuming, and prone to evaluator bias, slowing down the hiring timeline significantly.",
    solution: "Built FCT Interview, an automated end-to-end live video interview and evaluation platform that evaluates candidate speech, auto-grades responses, tracks attendance, and generates instant performance feedback.",
    techStack: ["React", "Node.js", "Express", "PostgreSQL", "AWS Transcribe"],
    outcome: "Automated candidate evaluations, saving hiring managers 18+ hours per week and reducing time-to-hire by 40%.",
    url: "https://fctinterview.online/"
  },
  {
    title: "Cloud Infrastructure Deployments",
    category: "DevOps & Cloud Engineering",
    desc: "Automated cloud environments running self-healing nodes, integrated securely with continuous integration pipelines.",
    challenge: "A rapidly growing digital service relied on manual server configurations, leading to frequent downtime, security vulnerabilities, and slow release cycles.",
    solution: "Re-architected the entire cloud platform on AWS using Infrastructure as Code (IaC) with Terraform, Docker containers, and built fully automated GitHub Actions CI/CD pipelines.",
    techStack: ["AWS", "Terraform", "Docker", "GitHub Actions", "Nginx"],
    outcome: "Achieved 99.99% system availability, reduced deployment time from hours to 5 minutes, and automated scaling to handle 10x traffic spikes.",
    url: "https://terraa.online/"
  },
  {
    title: "Custom SaaS Applications",
    category: "Enterprise Software Engineering",
    desc: "Multi-tenant software architectures built with secure data isolation models and responsive admin dashboard panels.",
    challenge: "Legacy enterprise management software was slow, rigid, and lacked secure multi-tenant capabilities, making client onboarding complex and expensive.",
    solution: "Built a modular SaaS platform with a multi-tenant database schema, role-based access control (RBAC), custom dashboard builders, and payment integrations.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    outcome: "Onboarded 30+ enterprise accounts in the first month, reduced onboarding costs by 60%, and scaled to support 100k+ MAU."
  }
];

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7B2CF5] block mb-3">Case Studies</span>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground">
            Proven Outcomes, Engineered for Trust
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed">
            Real engineering projects delivering measurable business results. Explore our work in cloud architecture, AI integrations, and custom SaaS platforms.
          </p>
        </div>

        <div className="space-y-12 max-w-5xl mx-auto">
          {caseStudies.map((cs) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.45 }}
              className="p-8 md:p-10 rounded-3xl border border-border bg-background hover:shadow-sm hover:border-[#7B2CF5]/20 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CF5]">{cs.category}</span>
                  <h3 className="font-heading font-black text-2xl md:text-3xl text-foreground mt-1">{cs.title}</h3>
                </div>
                {cs.url && (
                  <a
                    href={cs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 md:mt-0 px-5 py-2.5 rounded-full border border-border bg-secondary/50 font-semibold text-xs text-foreground hover:bg-[#7B2CF5] hover:text-white hover:border-[#7B2CF5] transition-all duration-300 inline-block text-center"
                  >
                    Visit Project →
                  </a>
                )}
              </div>

              <p className="font-body text-sm text-foreground/80 leading-relaxed mb-6 font-medium">
                {cs.desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Challenge & Solution */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Challenge</h4>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Solution</h4>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{cs.solution}</p>
                  </div>
                </div>

                {/* Tech Stack & Outcome */}
                <div className="space-y-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {cs.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs text-foreground font-semibold"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-secondary/30 border border-border/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Business Impact</h4>
                    <p className="font-body text-sm text-foreground font-semibold leading-relaxed">{cs.outcome}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
