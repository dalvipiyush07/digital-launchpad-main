const items = [
  "Website Development",
  "SaaS Products",
  "Admin Panels",
  "E-commerce",
  "Payment Integration",
  "Business Automation",
  "Landing Pages",
  "Mobile Apps",
  "CRM Systems",
  "WhatsApp Bots",
];

export default function MarqueeSection() {
  const text = items.map((i) => `${i} ✦`).join(" ");
  return (
    <div className="bg-foreground text-background py-4 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="font-heading font-semibold text-sm md:text-base tracking-wide px-4">
          {text} {text}
        </span>
        <span className="font-heading font-semibold text-sm md:text-base tracking-wide px-4">
          {text} {text}
        </span>
      </div>
    </div>
  );
}
