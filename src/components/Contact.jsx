import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { profile } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

export default function Contact() {
  const { t } = useLanguage();

  // State Form
  const [formData, setFormData] = useState({ name: "", email: "", message: "", _gotcha: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = t("contact.valNameEmpty");
    }
    if (!formData.email.trim()) {
      errors.email = t("contact.valEmailInvalid");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = t("contact.valEmailInvalid");
    }
    if (!formData.message.trim()) {
      errors.message = t("contact.valMsgEmpty");
    } else if (formData.message.trim().length < 5) {
      errors.message = t("contact.valMsgTooShort");
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setStatus("success");
        // Kosongkan form setelah sukses
        setFormData({ name: "", email: "", message: "", _gotcha: "" });
        setValidationErrors({});
      } else {
        setStatus("error");
        setErrorMessage(result.error || t("contact.errorGeneric"));
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(t("contact.errorGeneric"));
    }
  };

  return (
    <footer id="kontak" className="section section-dark contact-section">
      <div className="container">
        <SectionTitle light>{t("contact.title")}</SectionTitle>

        <motion.p
          className="contact-lead"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          {t("contact.lead")}
        </motion.p>

        {/* Layout Kontak: Form di Kiri & Info Kontak Ringkas di Kanan */}
        <div className="contact-main-grid">
          {/* ════════════ FORM KONTAK ════════════ */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease }}
          >
            <form onSubmit={handleSubmit} noValidate className="contact-form">
              {/* Honeypot field (anti-spam) */}
              <input
                type="text"
                name="_gotcha"
                value={formData._gotcha}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Status Alert Notification */}
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    className="form-alert form-alert-success"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    role="alert"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>{t("contact.successMsg")}</span>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    className="form-alert form-alert-error"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    role="alert"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errorMessage || t("contact.errorGeneric")}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Nama */}
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">
                  {t("contact.nameLabel")} <span className="req-star">*</span>
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("contact.namePlaceholder")}
                  disabled={status === "loading"}
                  className={`form-input ${validationErrors.name ? "is-invalid" : ""}`}
                  autoComplete="name"
                />
                {validationErrors.name && (
                  <span className="form-error-hint">{validationErrors.name}</span>
                )}
              </div>

              {/* Input Email */}
              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">
                  {t("contact.emailLabel")} <span className="req-star">*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("contact.emailPlaceholder")}
                  disabled={status === "loading"}
                  className={`form-input ${validationErrors.email ? "is-invalid" : ""}`}
                  autoComplete="email"
                />
                {validationErrors.email && (
                  <span className="form-error-hint">{validationErrors.email}</span>
                )}
              </div>

              {/* Input Pesan */}
              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">
                  {t("contact.messageLabel")} <span className="req-star">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contact.messagePlaceholder")}
                  disabled={status === "loading"}
                  className={`form-input form-textarea ${validationErrors.message ? "is-invalid" : ""}`}
                />
                {validationErrors.message && (
                  <span className="form-error-hint">{validationErrors.message}</span>
                )}
              </div>

              {/* Tombol Kirim Pesan */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-submit-contact"
              >
                {status === "loading" ? (
                  <>
                    <SpinnerIcon />
                    <span>{t("contact.sendingBtn")}</span>
                  </>
                ) : (
                  <>
                    <SendIcon />
                    <span>{t("contact.sendBtn")}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* ════════════ INFORMASI KONTAK RINGKAS ════════════ */}
          <motion.div
            className="contact-info-panel"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease, delay: 0.1 }}
          >
            {/* Minimalist Email Icon Action */}
            <div className="contact-quick-actions">
              <a
                href={`mailto:${profile.email}`}
                className="quick-action-card"
                title={t("contact.emailIconLabel")}
                aria-label={t("contact.emailIconLabel")}
              >
                <div className="quick-action-icon email-icon-circle">
                  <MailIcon />
                </div>
                <div className="quick-action-text">
                  <span className="quick-action-label">Email</span>
                  <span className="quick-action-value">{profile.email}</span>
                </div>
              </a>

              {/* Tombol Salin Email */}
              <button
                type="button"
                className="btn btn-copy-small"
                onClick={copyEmail}
                aria-label={t("contact.copyEmail")}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "idle"}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {copied ? t("contact.emailCopied") : t("contact.copyEmail")}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            {/* Social & Channel Buttons */}
            <div className="contact-social-buttons">
              {profile.whatsapp && (
                <a
                  className="btn btn-contact-channel"
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon />
                  <span>WhatsApp</span>
                </a>
              )}

              {profile.github && (
                <a
                  className="btn btn-contact-channel"
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GitHubIcon />
                  <span>GitHub</span>
                </a>
              )}

              {profile.linkedin && (
                <a
                  className="btn btn-contact-channel"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>

            {/* Data Detail Kontak */}
            <dl className="contact-info-list">
              <div className="info-item">
                <dt>{t("contact.phoneLabel")}</dt>
                <dd>{profile.phone}</dd>
              </div>
              <div className="info-item">
                <dt>{t("contact.locationLabel")}</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className="info-item">
                <dt>{t("contact.portfolioLabel")}</dt>
                <dd>{profile.githubLabel}</dd>
              </div>
            </dl>
          </motion.div>
        </div>

        {/* Footer Bar */}
        <div className="footer-bar">
          <span>{t("contact.copyright")} {profile.name}</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t("contact.backToTop")}
          </button>
        </div>
      </div>
    </footer>
  );
}
