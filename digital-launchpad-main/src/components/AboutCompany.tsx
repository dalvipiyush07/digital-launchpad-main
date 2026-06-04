import { motion } from "framer-motion";

export default function AboutCompany() {
  return (
    <section id="about" className="py-24 bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column — Title */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#7B2CF5] block mb-3">About Us</span>
              <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.15]">
                About CloudBuild
              </h2>
            </motion.div>
          </div>

          {/* Right Column — Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed">
                CloudBuild is a cloud engineering and digital transformation company helping businesses accelerate innovation through cloud, AI and software solutions.
              </p>
              
              <div className="h-px bg-border" />
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">Our Mission</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Our mission is to enable organizations to build reliable, scalable and future-ready digital platforms.
                </p>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
