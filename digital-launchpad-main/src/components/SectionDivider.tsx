import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="w-full h-[1.5px] bg-border/30 relative overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="absolute inset-y-0 left-0 right-0 bg-[#7B2CF5] origin-left"
      />
    </div>
  );
}
