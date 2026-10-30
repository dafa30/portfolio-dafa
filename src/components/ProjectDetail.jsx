import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "../data";
import { useLanguage } from "../i18n/LanguageContext";
import { TechIcon } from "./TechIcons";
import { translations } from "../i18n/translations.js";

const ease = [0.22, 1, 0.36, 1];

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="project-feature-check">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function ProjectDetail({ projectId, onBack }) {
  const { lang, t } = useLanguage();
  const [isZoomed, setIsZoomed] = useState(false);

  // Cari data proyek berdasarkan id
  const project = projects.find((p) => p.id === projectId) || projects[0];
  const currentIndex = projects.findIndex((p) => p.id === project.id);

  // Pastikan saat halaman terbuka, layar langsung di posisi paling atas
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [projectId]);

  // Handler keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          handleBack();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.hash = "#proyek";
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevId = projects[currentIndex - 1].id;
      window.location.hash = `#/proyek/${prevId}`;
    }
  };

  const handleNext = () => {
    if (currentIndex < projects.length - 1) {
      const nextId = projects[currentIndex + 1].id;
      window.location.hash = `#/proyek/${nextId}`;
    }
  };

  const displayName = lang === "en" ? project.nameEn : project.name;

  // Fitur-fitur dari terjemahan
  const projectKey =
    project.id === "helpdesk"
      ? "helpdesk"
      : project.id === "persuratan"
      ? "persuratan"
      : project.id === "perpustakaan"
      ? "perpustakaan"
      : project.id === "undangan-digital"
      ? "undangan"
      : "tiket";

  const featuresList = translations[lang]?.projects?.[projectKey]?.features || [];

  return (
    <section className="section project-detail-page">
      <div className="container">
        {/* Navigasi & Toolbar Atas */}
        <motion.div
          className="project-page-toolbar"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <button
            type="button"
            className="btn btn-detail-back"
            onClick={handleBack}
            aria-label={t("projects.backToList")}
          >
            <ArrowLeftIcon />
            <span>{t("projects.backToList")}</span>
          </button>

          <div className="project-detail-pager" role="group" aria-label="Navigasi Proyek">
            <button
              type="button"
              className="btn btn-pager"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label={t("projects.prevProject")}
              title={currentIndex > 0 ? projects[currentIndex - 1].name : ""}
            >
              <ArrowLeftIcon />
              <span className="pager-text">{t("projects.prevProject")}</span>
            </button>
            <span className="pager-counter" aria-live="polite">
              {currentIndex + 1} / {projects.length}
            </span>
            <button
              type="button"
              className="btn btn-pager"
              onClick={handleNext}
              disabled={currentIndex === projects.length - 1}
              aria-label={t("projects.nextProject")}
              title={currentIndex < projects.length - 1 ? projects[currentIndex + 1].name : ""}
            >
              <span className="pager-text">{t("projects.nextProject")}</span>
              <ArrowRightIcon />
            </button>
          </div>
        </motion.div>

        {/* Header Proyek */}
        <motion.div
          className="project-page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.08 }}
        >
          <div className="project-meta-badges">
            <span className="project-detail-badge">{project.category}</span>
            <span className="project-index-pill">0{currentIndex + 1} of 0{projects.length}</span>
          </div>
          <h1 className="project-page-title">{displayName}</h1>
          <p className="project-page-subtitle">{t(project.descKey)}</p>
        </motion.div>

        {/* ════════════ 1. GAMBAR DIPERBESAR (PROMINENT PREVIEW) ════════════ */}
        <motion.div
          className="project-enlarged-showcase"
          initial={{ opacity: 0, scale: 0.98, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
        >
          <div className="enlarged-window-frame">
            {/* Window title bar mockup */}
            <div className="window-frame-bar">
              <div className="window-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="window-url-bar">
                <span>https://dafa-portfolio.local/{project.id}</span>
              </div>
              <button
                type="button"
                className="btn-zoom-trigger"
                onClick={() => setIsZoomed(true)}
                title="Perbesar gambar tampilan penuh"
                aria-label="Perbesar gambar tampilan penuh"
              >
                <ZoomInIcon />
                <span>Zoom</span>
              </button>
            </div>

            {/* Gambar yang Diperbesar */}
            <div className="enlarged-image-wrap" onClick={() => setIsZoomed(true)} role="button" tabIndex={0}>
              <img
                src={project.image}
                alt={`Tampilan antarmuka ${displayName} - diperbesar`}
                className="enlarged-project-img"
              />
              <div className="enlarged-hover-overlay">
                <span className="enlarged-zoom-badge">
                  <ZoomInIcon /> Klik untuk tampilan penuh (Full View)
                </span>
              </div>
            </div>

            {/* Keterangan Gambar di Bawah Frame */}
            <div className="enlarged-caption-bar">
              <div className="caption-verified">
                <span className="caption-dot" aria-hidden="true" />
                <span className="caption-source">{project.verifiedSource}</span>
              </div>
              <span className="caption-status">Dokumentasi Terverifikasi</span>
            </div>
          </div>
        </motion.div>

        {/* ════════════ 2. PENJELASAN TENTANG PROYEK (DI BAWAH GAMBAR) ════════════ */}
        <motion.div
          className="project-explanation-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.25 }}
        >
          <div className="project-detail-body">
            {/* Bagian Deskripsi & Masalah yang Diselesaikan */}
            <div className="project-detail-card">
              <h2 className="detail-section-title">{t("projects.overview")}</h2>
              <p className="detail-desc-text">{t(project.descKey)}</p>

              <h3 className="detail-subhead">{t("projects.goalTitle")}</h3>
              <p className="detail-goal-text">{t(project.goalKey)}</p>
            </div>

            {/* Bagian Fitur Utama */}
            <div className="project-detail-card">
              <h2 className="detail-section-title">{t("projects.featuresTitle")}</h2>
              <ul className="project-features-list">
                {featuresList.map((feat, fIdx) => (
                  <li key={fIdx} className="feature-item">
                    <CheckIcon />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bagian Tech Stack & Tools */}
            <div className="project-detail-card">
              <h2 className="detail-section-title">{t("projects.techTitle")}</h2>
              <div className="project-tech-grid">
                {project.tech.map((slug) => {
                  const label =
                    slug === "nextdotjs"
                      ? "Next.js"
                      : slug === "restapi"
                      ? "RESTful API"
                      : slug === "tailwindcss"
                      ? "Tailwind CSS"
                      : slug === "html5"
                      ? "HTML5"
                      : slug === "css3"
                      ? "CSS3"
                      : slug.charAt(0).toUpperCase() + slug.slice(1);

                  return (
                    <div key={slug} className="tech-badge-detail">
                      <TechIcon slug={slug} className="tech-icon-detail" />
                      <span className="tech-label-detail">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bagian Tautan & Status Repository */}
            <div className="project-detail-card project-access-card">
              <h2 className="detail-section-title">{t("projects.linksTitle")}</h2>

              {project.link.isPrivate ? (
                <div className="project-access-notice">
                  <div className="access-notice-icon">
                    <LockIcon />
                  </div>
                  <div className="access-notice-text">
                    <p className="access-notice-title">{t(project.link.noteKey)}</p>
                    <p className="access-notice-sub">
                      {lang === "en"
                        ? "Source code is protected by organizational NDA / institutional license."
                        : "Source code dilindungi oleh kebijakan internal organisasi / instansi terkait."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="project-links-wrap">
                  <div className="access-notice-configurable">
                    <span className="configurable-dot" aria-hidden="true" />
                    <p className="configurable-text">{t(project.link.noteKey)}</p>
                  </div>
                </div>
              )}

              {/* Konteks Verifikasi */}
              <div className="project-verified-footer">
                <span className="verified-label">{t("projects.sourceContext")}:</span>
                <span className="verified-val">{project.verifiedSource}</span>
              </div>
            </div>
          </div>

          {/* Tombol Balik di Bagian Bawah Halaman */}
          <div className="project-page-bottom-action">
            <button
              type="button"
              className="btn btn-detail-back"
              onClick={handleBack}
            >
              <ArrowLeftIcon />
              <span>{t("projects.backToList")}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ════════════ MODAL FULLSCREEN ZOOM ════════════ */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="project-modal-content"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="project-modal-header">
                <span className="modal-project-title">{displayName}</span>
                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setIsZoomed(false)}
                  aria-label="Tutup tampilan penuh"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="project-modal-img-wrap">
                <img
                  src={project.image}
                  alt={`Tampilan penuh ${displayName}`}
                  className="project-modal-img"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
