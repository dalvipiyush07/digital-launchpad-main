import EnterpriseBackground from "./EnterpriseBackground";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-28 pb-16">
      {/* Full-screen Interactive Particle Network Background */}
      <EnterpriseBackground />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        {/* Modern Pill Badge - static, developer style */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200/80 bg-neutral-50 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7B2CF5]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Next-Gen Cloud &amp; AI Engineering
          </span>
        </div>

        {/* Static Heading */}
        <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] tracking-tight text-black mb-8">
          Cloud, AI &amp; Digital Engineering <br className="hidden md:inline" />
          <span className="text-[#7B2CF5]">Built for Scale</span>
        </h1>

        {/* Static Subheadline */}
        <p className="font-body text-base md:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-12">
          CloudBuild helps organizations build cloud infrastructure, AI solutions and modern digital products.
        </p>

        {/* Static Developer-focused Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/#contact"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-black text-white font-bold text-sm hover:bg-[#7B2CF5] transition-all duration-300 shadow-sm"
          >
            Talk To An Expert
          </a>
          <a
            href="/#services"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-neutral-200 bg-white text-black font-bold text-sm hover:bg-neutral-50 transition-all duration-300"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
