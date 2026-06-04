import Navbar from "@/components/Navbar";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <CaseStudiesSection />
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
