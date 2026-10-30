import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { TechIcon } from "./TechIcons";
import { techStack } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease },
  },
};

function TechCard({ tech }) {
  return (
    <motion.li
      className="tech-card"
      variants={item}
      whileHover={{ y: -5, transition: { duration: 0.22, ease } }}
    >
      <div className="tech-icon-wrap">
        <TechIcon slug={tech.slug} className="tech-svg" />
      </div>
      <span className="tech-name">{tech.name}</span>
    </motion.li>
  );
}

export default function Skills() {
  const { t } = useLanguage();

  return (
    <section id="keahlian" className="section section-tint">
      <div className="container">
        <SectionTitle>{t("skills.title")}</SectionTitle>

        <motion.p
          className="skills-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          {t("skills.subtitle")}
        </motion.p>

        <motion.ul
          className="tech-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {techStack.map((tech) => (
            <TechCard key={tech.slug} tech={tech} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
