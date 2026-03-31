const steps = [
  { num: "01", title: "Discovery", desc: "We understand your business, goals, and target audience." },
  { num: "02", title: "Design", desc: "We craft modern, conversion-focused designs." },
  { num: "03", title: "Development", desc: "We build scalable, fast, and secure digital products." },
  { num: "04", title: "Launch", desc: "We go live and ensure everything works perfectly." },
  { num: "05", title: "Support", desc: "We stay with you, maintaining and growing your platform." },
];

export default function ProcessSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 fade-up">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">How We Work</span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl mt-2">Simple Process, Powerful Results</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="fade-up p-6 rounded-lg border border-border bg-background card-hover text-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span className="text-3xl font-heading font-extrabold text-primary/20">{s.num}</span>
              <h3 className="font-heading font-bold mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
