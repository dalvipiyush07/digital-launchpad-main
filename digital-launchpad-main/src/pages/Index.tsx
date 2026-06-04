import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import TrustMetrics from "@/components/TrustMetrics";
import ServicesSection from "@/components/ServicesSection";
import IndustriesSection from "@/components/IndustriesSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TechEcosystem from "@/components/TechEcosystem";
import WhyCloudBuild from "@/components/WhyCloudBuild";
import BlogPreviewSection from "@/components/BlogPreviewSection";
import AboutCompany from "@/components/AboutCompany";
import FaqSection from "@/components/FaqSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <TrustMetrics />
      <ServicesSection />
      <IndustriesSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <TechEcosystem />
      <WhyCloudBuild />
      <BlogPreviewSection />
      <AboutCompany />
      <FaqSection />
      <FinalCTA />
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
