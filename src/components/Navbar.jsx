import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { profile, sections } from "../data";
import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "../i18n/LanguageContext";

const ids = ["beranda", ...sections.map((s) => s.id)];

function useActiveSection() {
  const [active, setActive] = useState("beranda");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function LangPicker({ inMenu = false }) {
  const { lang, changeLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (inMenu) {
    return (
      <div className="lang-toggle-in-menu" role="group" aria-label={t("lang.label")}>
        <button
          type="button"
          className={`lang-menu-btn ${lang === "id" ? "is-active" : ""}`}
          onClick={() => changeLang("id")}
          aria-pressed={lang === "id"}
        >
          ID
        </button>
        <span className="lang-menu-divider" aria-hidden="true">/</span>
        <button
          type="button"
          className={`lang-menu-btn ${lang === "en" ? "is-active" : ""}`}
          onClick={() => changeLang("en")}
          aria-pressed={lang === "en"}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="lang-picker" ref={ref}>
      <button
        type="button"
        className="lang-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("lang.label")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <GlobeIcon />
        <span className="lang-code">{lang.toUpperCase()}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="lang-dropdown"
            role="listbox"
            aria-label={t("lang.label")}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { code: "id", label: "ID — " + t("lang.id") },
              { code: "en", label: "EN — " + t("lang.en") },
            ].map((opt) => (
              <li key={opt.code} role="option" aria-selected={lang === opt.code}>
                <button
                  type="button"
                  className={`lang-option ${lang === opt.code ? "is-active" : ""}`}
                  onClick={() => { changeLang(opt.code); setOpen(false); }}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  const { t } = useLanguage();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    setHidden(latest > prev && latest > 240);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const circle = (r) => `circle(${r}px at 92% 5%)`;

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? "is-scrolled" : ""}`}
        initial={{ y: "-110%" }}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container nav-inner">
          <a href="#beranda" className="logo" onClick={() => setOpen(false)} aria-label="Ke beranda">
            <span className="logo-mark">D</span>
            <span className="logo-name">Dafa.</span>
          </a>

          <nav aria-label="Navigasi utama" className="nav-desktop">
            <ul className="nav-links">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={active === s.id ? "is-active" : ""}>
                    {active === s.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span>{t(s.labelKey)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <LangPicker />
            <ThemeToggle />
            <button
              className="burger"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={open}
            >
              <motion.span animate={{ y: open ? 3 : -3, rotate: open ? 45 : 0 }} />
              <motion.span animate={{ y: open ? -3 : 3, rotate: open ? -45 : 0 }} />
            </button>
          </div>
        </div>
        <motion.div className="nav-progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: circle(0) }}
            animate={{ clipPath: circle(1800) }}
            exit={{ clipPath: circle(0) }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul>
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.25 + i * 0.06, duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <a href={`#${s.id}`} onClick={() => setOpen(false)}>
                    {t(s.labelKey)}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="menu-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.65 } }}
            >
              <LangPicker inMenu />
              <ThemeToggle inMenu />
              <a className="btn btn-light" href={profile.cv} download>
                {t("nav.downloadCV")}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
