import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// Judul section: teks naik dari balik "mask" saat masuk layar.
export default function SectionTitle({ children, light = false }) {
  return (
    <h2 className={`sec-title ${light ? "is-light" : ""}`}>
      <motion.span
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease }}
      >
        {children}
      </motion.span>
    </h2>
  );
}
