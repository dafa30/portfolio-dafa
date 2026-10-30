import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { certificates } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

function ZoomIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Certificates({ isDedicatedPage = false }) {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState(null);

  // Kunci scroll saat modal terbuka
  useEffect(() => {
    if (selectedCert) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") setSelectedCert(null);
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [selectedCert]);

  return (
    <section id="sertifikat" className={`section ${isDedicatedPage ? "cert-dedicated-page" : ""}`}>
      <div className="container">
        {isDedicatedPage ? (
          <div className="cert-page-header">
            <a href="#beranda" className="cert-back-link">
              ← {t("certificates.backHome")}
            </a>
            <h1 className="cert-page-title">{t("certificates.title")}</h1>
            <p className="cert-page-subtitle">{t("certificates.subtitle")}</p>
          </div>
        ) : (
          <div className="cert-section-header">
            <SectionTitle>{t("certificates.title")}</SectionTitle>
            <p className="cert-section-subtitle">{t("certificates.subtitle")}</p>
          </div>
        )}

        {certificates.length === 0 ? (
          <p className="cert-empty">{t("certificates.empty")}</p>
        ) : (
          <motion.div
            className="cert-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {certificates.map((cert) => (
              <motion.article
                key={cert.id || cert.title}
                className="cert-card"
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.28, ease }}
                onClick={() => setSelectedCert(cert)}
                tabIndex={0}
                role="button"
                aria-haspopup="dialog"
                aria-label={`${cert.title} - ${cert.issuer}. ${t("certificates.clickToEnlarge")}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedCert(cert);
                  }
                }}
              >
                {/* Frame Gambar Sertifikat Proporsional */}
                <div className="cert-card-media">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="cert-card-img"
                    loading="lazy"
                  />
                  <div className="cert-card-overlay" aria-hidden="true">
                    <span className="cert-zoom-btn">
                      <ZoomIcon />
                      <span>{t("certificates.clickToEnlarge")}</span>
                    </span>
                  </div>
                  <span className="cert-badge-year">{cert.year}</span>
                </div>

                {/* Konten Kartu */}
                <div className="cert-card-body">
                  <h3 className="cert-card-title">{cert.title}</h3>
                  <p className="cert-card-issuer">{cert.issuer}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modal Lightbox untuk Memperbesar Sertifikat */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="cert-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={() => setSelectedCert(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selectedCert.title}
          >
            <motion.div
              className="cert-lightbox-dialog"
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="cert-lightbox-header">
                <div>
                  <span className="cert-lightbox-year">{selectedCert.year}</span>
                  <h2 className="cert-lightbox-title">{selectedCert.title}</h2>
                  <p className="cert-lightbox-issuer">{selectedCert.issuer}</p>
                </div>
                <button
                  type="button"
                  className="cert-lightbox-close"
                  onClick={() => setSelectedCert(null)}
                  aria-label={t("certificates.close")}
                  autoFocus
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Area Gambar Penuh Proporsional */}
              <div className="cert-lightbox-figure">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="cert-lightbox-img"
                />
              </div>

              {/* Detail Keterangan */}
              {selectedCert.detail && (
                <div className="cert-lightbox-footer">
                  <p className="cert-lightbox-detail">{selectedCert.detail}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
