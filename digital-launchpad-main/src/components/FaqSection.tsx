import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How long does it take to build a website?", a: "Standard websites: 7–14 days. Complex SaaS platforms: 4–8 weeks." },
  { q: "Do you provide source code after development?", a: "Yes, full source code and documentation after final payment. You own everything." },
  { q: "What's the difference between prebuilt and custom?", a: "Prebuilt = ready-made SaaS products customized for your brand. Custom = built from scratch to your exact specs." },
  { q: "Do you support Razorpay, PayU, and PhonePe?", a: "Yes — we integrate all major Indian payment gateways: Razorpay, PayU, PhonePe, Cashfree, Paytm." },
  { q: "Do you offer maintenance after launch?", a: "Yes — flexible monthly retainer or on-demand support plans available." },
  { q: "Which technologies do you use?", a: "React, Next.js, Node.js, Python, MongoDB, PostgreSQL, Firebase, AWS, Vercel, and more." },
  { q: "Do you serve clients outside Pune and Surat?", a: "Yes — we work with clients all across India, fully remote via WhatsApp, Zoom, and email." },
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-12 lg:py-16 section-alt">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="fade-up">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="font-heading font-semibold text-left">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
