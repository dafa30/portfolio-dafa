import { motion } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { profile } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="tentang" className="section">
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

            <p className="about-desc">
              {t("about.summary")}
            </p>

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
