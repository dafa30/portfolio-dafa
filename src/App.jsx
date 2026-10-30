import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "./i18n/LanguageContext";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import ProjectDetail from "./components/ProjectDetail.jsx";
import Contributions from "./components/Contributions.jsx";
import Certificates from "./components/Certificates.jsx";
import Contact from "./components/Contact.jsx";

function isCertificateRoute() {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash.toLowerCase();
  return hash === "#/sertifikat" || hash === "#/certificates";
}

function getProjectDetailId() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.toLowerCase();
  const match = hash.match(/^#\/(proyek|projects)\/([a-z0-9-]+)$/);
  return match ? match[2] : null;
}

export default function App() {
  const [isCertPage, setIsCertPage] = useState(isCertificateRoute);
  const [projectDetailId, setProjectDetailId] = useState(getProjectDetailId);

  useEffect(() => {
    const handleHashChange = () => {
      const isCert = isCertificateRoute();
      setIsCertPage(isCert);

      const pId = getProjectDetailId();
      setProjectDetailId(pId);

      if (isCert || pId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <Navbar />
        <main>
          {isCertPage ? (
            <Certificates isDedicatedPage={true} />
          ) : projectDetailId ? (
            <ProjectDetail
              projectId={projectDetailId}
              onBack={() => {
                window.location.hash = "#proyek";
              }}
            />
          ) : (
            <>
              <Hero />
              <About />
              <Skills />
              <Experience />
              <Projects />
              <Contributions />
              <Certificates isDedicatedPage={false} />
            </>
          )}
        </main>
        <Contact />
      </MotionConfig>
    </LanguageProvider>
  );
}
