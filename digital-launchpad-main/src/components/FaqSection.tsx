import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { API_BASE } from "@/lib/apiBase";

interface FAQ {
  id?: string;
  q: string;
  a: string;
}

const fallbackFaqs: FAQ[] = [
  {
    q: "What services does CloudBuild offer?",
    a: "CloudBuild specializes in technology consulting, digital engineering, enterprise cloud migration (specifically AWS), production AI pipelines, custom SaaS development, and managed DevOps services."
  },
  {
    q: "How does CloudBuild ensure data security and compliance?",
    a: "We design cloud architectures using industry-standard security frameworks like the AWS Well-Architected Framework, implementing encryption at rest and in transit, VPC segmentation, IAM least privilege access, and regular security audits."
  },
  {
    q: "What is your project engagement and delivery model?",
    a: "We follow an agile consulting model. We start with a discovery phase, define clear sprint goals, hold regular progress demos, and assign a dedicated solutions architect to ensure successful delivery."
  },
  {
    q: "How do you handle post-launch application maintenance and monitoring?",
    a: "We offer 24/7 managed SRE services, proactive system monitoring, incident response SLAs, security patching, and on-demand engineering support to keep your systems running at 99.9% uptime."
  },
  {
    q: "Do you help migrate legacy infrastructure to AWS?",
    a: "Yes, we specialize in legacy migration. We conduct a migration readiness assessment, construct a secure landing zone, and migrate databases and applications with minimal to zero disruption using blue-green deployments."
  },
  {
    q: "Can you design and implement custom AI/LLM solutions?",
    a: "Yes, we engineer production AI pipelines, build custom Retrieval-Augmented Generation (RAG) models, design agents, and integrate advanced LLMs into existing SaaS systems to automate complex workflows."
  },
  {
    q: "Who owns the intellectual property and code?",
    a: "Upon project completion and final payment, you receive full ownership of the custom source code, configuration scripts, architectures, and documentation."
  },
  {
    q: "What technology stack do you specialize in?",
    a: "We build with enterprise-proven technologies including React/Next.js, Node.js, Python, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, Terraform, and a wide array of AWS services."
  },
  {
    q: "Do you integrate Indian payment gateways like Razorpay, PayU, and PhonePe?",
    a: "Yes, we have deep integration experience with Razorpay, PayU, PhonePe, and Cashfree for secure, compliant payment processing including recurring billing setups."
  },
  {
    q: "How can we initiate a consulting engagement with CloudBuild?",
    a: "You can get in touch by submitting our contact form, emailing us at cloudbuild07@gmail.com, or messaging us directly on WhatsApp. We typically arrange a free discovery call within 24 hours."
  }
];

export default function FaqSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const res = await fetch(`${API_BASE}/api/faqs`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch FAQs, using fallback questions", err);
      }
      setFaqs(fallbackFaqs);
    }
    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="py-24 bg-background border-b border-border">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
            FAQ
          </span>
          <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-base text-muted-foreground mt-4 leading-relaxed">
            Get quick answers to common questions about our technical capabilities and engagement models.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((f, i) => (
            <AccordionItem 
              key={i} 
              value={`faq-${i}`}
              className="border border-border/60 rounded-xl px-6 bg-secondary/10 hover:border-[#7B2CF5]/30 transition-all duration-200"
            >
              <AccordionTrigger className="font-heading font-bold text-base md:text-lg text-left text-foreground hover:no-underline py-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm md:text-base text-muted-foreground leading-relaxed pb-4 pt-1">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
