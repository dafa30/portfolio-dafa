import { motion } from "framer-motion";
import IDCard from "./IDCard";
import { profile } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const ease = [0.22, 1, 0.36, 1];

const word = {
  hidden: { y: "112%" },
  show: (i) => ({ y: "0%", transition: { duration: 0.95, ease, delay: 0.15 + i * 0.12 } }),
};

const fade = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.554 4.11 1.523 5.837L0 24l6.335-1.496C8.04 23.453 9.982 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.97 0-3.797-.596-5.326-1.617l-.38-.228-3.962.936.996-3.858-.25-.397C2.023 14.993 1.455 13.56 1.455 12 1.455 6.141 6.141 1.455 12 1.455S22.545 6.141 22.545 12 17.859 22.545 12 22.545z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function Hero() {
  const words = profile.name.split(" ");
  const { t } = useLanguage();

  const socialLinks = [
    {
      href: profile.whatsapp,
      label: "WhatsApp",
      icon: <WhatsAppIcon />,
      title: t("hero.socialWhatsApp"),
      available: !!profile.whatsapp,
    },
    {
      href: profile.github,
      label: "GitHub",
      icon: <GitHubIcon />,
      title: t("hero.socialGitHub"),
      available: !!profile.github,
    },
    {
      href: profile.linkedin || "#",
      label: "LinkedIn",
      icon: <LinkedInIcon />,
      title: t("hero.socialLinkedIn"),
      available: !!profile.linkedin,
    },
  ];

  return (
    <section id="beranda" className="hero">
      <div className="hero-dots" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title" aria-label={profile.name}>
            {words.map((w, i) => (
              <span className="line" key={w} aria-hidden="true">
                <motion.span className="line-inner" variants={word} custom={i} initial="hidden" animate="show">
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Ikon media sosial tepat di bawah nama */}
          <motion.div className="hero-social" {...fade(0.6)}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.available ? "_blank" : undefined}
                rel={link.available ? "noreferrer noopener" : undefined}
                aria-label={link.label}
                aria-disabled={!link.available}
                onClick={!link.available ? (e) => e.preventDefault() : undefined}
                className={`hero-social-link${!link.available ? " is-placeholder" : ""}`}
                title={link.title}
              >
                {link.icon}
              </a>
            ))}
          </motion.div>

          <motion.p className="hero-role" {...fade(0.7)}>
            {profile.role}
          </motion.p>
          <motion.p className="hero-tagline" {...fade(0.85)}>
            {t("hero.tagline")}
          </motion.p>

          <motion.p className="hero-loc" {...fade(1.0)}>
            {profile.location}
          </motion.p>
        </div>

        <div className="hero-card">
          <IDCard />
        </div>
      </div>
    </section>
  );
}
