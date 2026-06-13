import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import {
  Brain,
  Zap,
  Users,
  BarChart3,
  Clock,
  Shield,
  ArrowRight,
  Linkedin,
  ExternalLink,
  Building2,
  Rocket,
  Target,
  Globe,
} from "lucide-react";

// ─── Founders ────────────────────────────────────────────────────────────────
const founders = [
  {
    initials: "PD",
    name: "Mr. Piyush Dalvi",
    role: "Founder & CEO",
    bio: "Piyush Dalvi is the Founder & CEO of CloudBuild Technologies and the creator of MockFriend. He leads company strategy, product innovation, AI initiatives, platform architecture, and overall business growth. With a strong focus on emerging technologies, cloud platforms, and artificial intelligence, he is committed to building impactful products that solve real-world business challenges.",
    linkedin: "https://www.linkedin.com/in/piyush-dalvi-5b1499382",
    gradient: "from-[#7B2CF5] to-[#4F46E5]",
    accentBg: "bg-[#7B2CF5]/10",
    accentText: "text-[#7B2CF5]",
    accentBorder: "border-[#7B2CF5]/30",
  },
  {
    initials: "MS",
    name: "Mr. Mahesh Shelke",
    role: "Co-Founder",
    bio: "Mahesh Shelke is the Co-Founder of CloudBuild Technologies and plays a key role in strategic planning, operations management, partnership development, and organizational growth. He focuses on ensuring smooth execution across projects while helping drive long-term business expansion and customer success.",
    linkedin: "https://www.linkedin.com/in/mahesh-shelke-7497a7315",
    gradient: "from-[#0EA5E9] to-[#6366F1]",
    accentBg: "bg-[#0EA5E9]/10",
    accentText: "text-[#0EA5E9]",
    accentBorder: "border-[#0EA5E9]/30",
  },
  {
    initials: "SG",
    name: "Mr. Shivam Garud",
    role: "Co-Founder",
    bio: "Shivam Garud is the Co-Founder of CloudBuild Technologies and contributes to product development, technology implementation, innovation initiatives, and execution strategy. His focus on technology excellence and product delivery helps transform ideas into scalable and reliable solutions.",
    linkedin: "https://www.linkedin.com/in/shivam-garud",
    gradient: "from-[#10B981] to-[#3B82F6]",
    accentBg: "bg-[#10B981]/10",
    accentText: "text-[#10B981]",
    accentBorder: "border-[#10B981]/30",
  },
];

// ─── MockFriend Features ──────────────────────────────────────────────────────
const mockFriendFeatures = [
  { icon: Brain, label: "AI-Powered Interviews" },
  { icon: Users, label: "Automated Candidate Screening" },
  { icon: BarChart3, label: "Intelligent Candidate Evaluation" },
  { icon: Zap, label: "Real-Time Interview Analysis" },
  { icon: Clock, label: "Recruitment Process Automation" },
  { icon: Target, label: "Faster Hiring Decisions" },
  { icon: Shield, label: "Enterprise-Ready Scalability" },
];

// ─── Company Stats ────────────────────────────────────────────────────────────
const stats = [
  { value: "3+", label: "Co-founders" },
  { value: "AI", label: "Driven Platform" },
  { value: "1", label: "Flagship Product" },
  { value: "∞", label: "Innovation" },
];

// ─── About Page ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us | CloudBuild Technologies";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Learn more about CloudBuild Technologies, our leadership team, and MockFriend, our AI-powered recruitment automation platform."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-border">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#7B2CF5]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#0EA5E9]/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-4 py-1.5 rounded-full mb-6 border border-[#7B2CF5]/20">
              <Building2 className="w-3.5 h-3.5" />
              Meet The Founders
            </span>

            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-foreground tracking-tight leading-[1.05] mb-6">
              Meet the{" "}
              <span className="bg-gradient-to-r from-[#7B2CF5] via-[#9F57FF] to-[#0EA5E9] bg-clip-text text-transparent">
                Leadership Team
              </span>
              <br className="hidden sm:block" /> Behind CloudBuild &amp; MockFriend
            </h1>

            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Building the future of AI-powered recruitment, intelligent automation, and scalable technology solutions.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl bg-secondary/15 border border-border/60 hover:border-[#7B2CF5]/30 transition-all duration-300"
              >
                <div className="font-heading font-black text-3xl md:text-4xl text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="font-body text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── About CloudBuild ── */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
                Who We Are
              </span>
              <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-5 mb-6 tracking-tight leading-tight">
                About CloudBuild Technologies
              </h2>
              <div className="space-y-4 font-body text-base text-muted-foreground leading-relaxed">
                <p>
                  CloudBuild Technologies is a forward-thinking technology company specializing in custom software development, AI-powered applications, cloud infrastructure, and business automation solutions.
                </p>
                <p>
                  We help startups and enterprises accelerate digital transformation through modern engineering practices, scalable architectures, and innovative technology platforms. Our mission is to build products that solve real-world business challenges while enabling organizations to operate faster, smarter, and more efficiently.
                </p>
                <p>
                  From cloud-native applications to AI-driven platforms, CloudBuild focuses on delivering secure, scalable, and high-performance technology solutions that create measurable business impact.
                </p>
              </div>
            </motion.div>

            {/* Visual card panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Rocket, title: "Custom Software", desc: "Tailored solutions built for your unique business needs" },
                { icon: Brain, title: "AI-Powered", desc: "Intelligent systems that learn and adapt to your processes" },
                { icon: Globe, title: "Cloud Infrastructure", desc: "Scalable and secure cloud-native architectures" },
                { icon: Zap, title: "Automation", desc: "Streamline operations with intelligent workflow automation" },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-secondary/10 border border-border/60 hover:border-[#7B2CF5]/40 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#7B2CF5]/10 flex items-center justify-center mb-4 group-hover:bg-[#7B2CF5]/20 transition-colors">
                    <card.icon className="w-5 h-5 text-[#7B2CF5]" />
                  </div>
                  <h3 className="font-heading font-bold text-sm text-foreground mb-1">{card.title}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MockFriend Product ── */}
      <section className="py-24 bg-secondary/10 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#7B2CF5]/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#0EA5E9]/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-4 py-1.5 rounded-full border border-[#7B2CF5]/20 mb-5">
              <Rocket className="w-3.5 h-3.5" />
              Flagship Product
            </span>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground tracking-tight mb-4">
              Our Flagship Product:{" "}
              <span className="bg-gradient-to-r from-[#7B2CF5] to-[#0EA5E9] bg-clip-text text-transparent">
                MockFriend
              </span>
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              MockFriend is a flagship product developed and owned by CloudBuild Technologies.
            </p>
          </motion.div>

          {/* Main showcase card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden border border-[#7B2CF5]/20 bg-background shadow-xl mb-12"
          >
            {/* Top gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#7B2CF5] via-[#9F57FF] to-[#0EA5E9]" />

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B2CF5]/10 border border-[#7B2CF5]/20 mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#7B2CF5] animate-pulse" />
                    <span className="text-xs font-bold text-[#7B2CF5] uppercase tracking-wider">AI-Powered Platform</span>
                  </div>

                  <h3 className="font-heading font-black text-2xl md:text-3xl text-foreground mb-4 leading-tight">
                    Transforming Recruitment with Artificial Intelligence
                  </h3>

                  <p className="font-body text-muted-foreground leading-relaxed mb-6 text-base">
                    MockFriend is an AI-powered interview and candidate screening platform designed to help organizations streamline recruitment, automate candidate evaluation, and make smarter hiring decisions.
                  </p>
                  <p className="font-body text-muted-foreground leading-relaxed text-base">
                    The platform conducts AI-driven interviews, evaluates candidate responses, generates detailed assessments, and provides recruiters with actionable insights.
                  </p>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 gap-3">
                  {mockFriendFeatures.map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-secondary/10 border border-border/50 hover:border-[#7B2CF5]/30 hover:bg-[#7B2CF5]/5 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#7B2CF5]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7B2CF5]/20 transition-colors">
                        <feat.icon className="w-4 h-4 text-[#7B2CF5]" />
                      </div>
                      <span className="font-body text-sm font-semibold text-foreground">{feat.label}</span>
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7B2CF5]/30 group-hover:bg-[#7B2CF5] transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
              Our Leadership
            </span>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-5 mb-4 tracking-tight">
              The Minds Driving Innovation
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The minds driving innovation, product development, and business growth at CloudBuild Technologies.
            </p>
          </motion.div>

          {/* Founder cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative flex flex-col rounded-3xl bg-background border border-border/60 overflow-hidden hover:border-[#7B2CF5]/40 hover:shadow-2xl transition-all duration-500"
              >
                {/* Top gradient accent */}
                <div className={`h-1 w-full bg-gradient-to-r ${founder.gradient}`} />

                {/* Card body */}
                <div className="p-8 flex flex-col flex-grow">
                  {/* Avatar */}
                  <div className="mb-6">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${founder.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      <span className="font-heading font-black text-2xl text-white">
                        {founder.initials}
                      </span>
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div className="mb-5">
                    <h3 className="font-heading font-black text-xl text-foreground mb-1.5 leading-tight">
                      {founder.name}
                    </h3>
                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${founder.accentBg} ${founder.accentText} border ${founder.accentBorder}`}
                    >
                      {founder.role}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="font-body text-sm text-muted-foreground leading-relaxed flex-grow mb-8">
                    {founder.bio}
                  </p>

                  {/* LinkedIn Button */}
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`linkedin-${founder.initials.toLowerCase()}`}
                    className={`group/btn flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl border ${founder.accentBorder} ${founder.accentBg} ${founder.accentText} font-bold text-xs uppercase tracking-wider hover:shadow-md transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <Linkedin className="w-4 h-4" />
                    View LinkedIn Profile
                    <ExternalLink className="w-3 h-3 ml-auto opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                  </a>
                </div>

                {/* Hover shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#7B2CF5]/0 to-[#7B2CF5]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#7B2CF5]/8 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center p-10 md:p-16 rounded-3xl bg-secondary/10 border border-border/60 hover:border-[#7B2CF5]/30 transition-all duration-300"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B2CF5] bg-[#7B2CF5]/10 px-3 py-1 rounded-full">
              Get In Touch
            </span>
            <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mt-5 mb-4 tracking-tight">
              Let's Build Something{" "}
              <span className="bg-gradient-to-r from-[#7B2CF5] to-[#0EA5E9] bg-clip-text text-transparent">
                Amazing Together
              </span>
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
              Whether you're looking to streamline hiring with MockFriend or build your next technology platform, CloudBuild is ready to help you scale and innovate.
            </p>
            <Link
              to="/contact"
              id="about-cta-contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#7B2CF5] text-white font-bold text-sm hover:bg-[#621dd1] hover:shadow-xl hover:shadow-[#7B2CF5]/25 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
