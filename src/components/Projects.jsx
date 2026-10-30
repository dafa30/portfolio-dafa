import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { projects } from "../data";
import { useLanguage } from "../i18n/LanguageContext";
import { TechIcon } from "./TechIcons";

const ease = [0.22, 1, 0.36, 1];

const listVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Projects() {
  const { lang, t } = useLanguage();

  const handleSelect = (id) => {
    window.location.hash = `#/proyek/${id}`;
  };

  return (
    <section id="proyek" className="section section-projects">
      <div className="container">
        <SectionTitle>{t("projects.title")}</SectionTitle>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          {t("projects.subtitle")}
        </motion.p>

        {/* Petunjuk interaksi grayscale */}
        <motion.div
          className="project-hint-banner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="project-hint-dot" aria-hidden="true" />
          <span>{t("projects.grayscaleHint")}</span>
        </motion.div>

        {/* DAFTAR KARTU PROYEK */}
        <motion.div
          className="projects-grid"
          variants={listVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
        >
          {projects.map((proj, idx) => {
            const displayName = lang === "en" ? proj.nameEn : proj.name;
            const desc = t(proj.descKey);

            return (
              <motion.article
                key={proj.id}
                className="project-card"
                variants={cardItemVariants}
                onClick={() => handleSelect(proj.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(proj.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${displayName}. ${t("projects.clickToDetail")}`}
              >
                {/* Frame Gambar dengan Efek Grayscale -> Warna Halus */}
                <div className="project-media-wrap">
                  <div className="project-media">
                    <img
                      src={proj.image}
                      alt={`Dokumentasi tampilan antarmuka ${displayName}`}
                      className="project-img project-grayscale-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="project-badge-overlay">
                    <span className="project-category-badge">{proj.category}</span>
                  </div>
                  <div className="project-hover-action">
                    <span className="project-hover-btn">
                      {t("projects.clickToDetail")}
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>

                {/* Informasi Singkat Kartu */}
                <div className="project-card-content">
                  <div className="project-card-header">
                    <span className="project-number">0{idx + 1}</span>
                    <h3 className="project-card-title">{displayName}</h3>
                  </div>
                  <p className="project-card-desc">{desc}</p>

                  {/* Tech stack badges */}
                  <div className="project-card-tech">
                    {proj.tech.slice(0, 4).map((slug) => (
                      <span key={slug} className="project-tech-pill" title={slug}>
                        <TechIcon slug={slug} className="project-tech-svg" />
                        <span className="project-tech-name">
                          {slug === "nextdotjs"
                            ? "Next.js"
                            : slug === "restapi"
                            ? "REST API"
                            : slug === "tailwindcss"
                            ? "Tailwind"
                            : slug.charAt(0).toUpperCase() + slug.slice(1)}
                        </span>
                      </span>
                    ))}
                    {proj.tech.length > 4 && (
                      <span className="project-tech-more">+{proj.tech.length - 4}</span>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
