import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { profile } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

// Teks menyala kata demi kata mengikuti scroll
function ScrollWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

function ScrollReveal({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p className="about-desc" ref={ref} aria-label={text}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <span key={i} aria-hidden="true">
            <ScrollWord progress={scrollYProgress} range={[start, end]}>{w}</ScrollWord>{" "}
          </span>
        );
      })}
    </p>
  );
}

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="tentang" className="section section-tint">
      <div className="container">
        <SectionTitle>{t("about.title")}</SectionTitle>

        <div className="about-layout">
          {/* Sisi kiri: Foto profil berbingkai lingkaran */}
          <motion.div
            className="about-photo-wrapper"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="about-photo-frame">
              <img
                src={profile.photo}
                alt={`Foto profil ${profile.name}`}
                className="about-photo-img"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Sisi kanan: Informasi deskripsi & tombol aksi */}
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <h3 className="about-name">{profile.name}</h3>
            <p className="about-role">{profile.role}</p>

            <ScrollReveal text={t("about.summary")} />

            {/* Tombol aksi: dipindahkan dari Beranda */}
            <div className="about-cta">
              <a href="#pengalaman" className="btn btn-primary">
                {t("about.seeExperience")}
              </a>
              <a href={profile.cv} download className="btn btn-ghost">
                {t("about.downloadCV")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
