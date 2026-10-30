import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { experience } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

function ExpCard({ item }) {
  const { t } = useLanguage();
  const [imgOk, setImgOk] = useState(true);

  // i18n description: use translated key if available, fallback to static
  const desc = item.descKey ? t(item.descKey) : item.description;
  // If translation key returned the key itself (missing), fall back
  const displayDesc = (desc && desc !== item.descKey) ? desc : item.description;

  return (
    <motion.article className="exp-card" variants={cardAnim}>
      {/* ── Photo Frame ── */}
      <div className="exp-media">
        {imgOk && item.image ? (
          <img
            src={item.image}
            alt={`Dokumentasi pengalaman di ${item.company}`}
            className="exp-img"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="exp-img-fallback" aria-hidden="true">
            <span>{item.company.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="exp-body">
        <h3 className="exp-company">{item.company}</h3>
        <p className="exp-role">{item.role}</p>
        <p className="exp-desc">{displayDesc}</p>
      </div>
    </motion.article>
  );
}

export default function Experience() {
  const { t } = useLanguage();

  return (
    <section id="pengalaman" className="section section-tint">
      <div className="container">
        <SectionTitle>{t("experience.title")}</SectionTitle>

        <motion.p
          className="exp-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          {t("experience.subtitle")}
        </motion.p>

        <motion.div
          className="exp-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {experience.map((item) => (
            <ExpCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
