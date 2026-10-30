import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const stored = localStorage.getItem("lang");
      return stored === "en" ? "en" : "id";
    } catch {
      return "id";
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("lang", lang);
    } catch {}
  }, [lang]);

  const changeLang = (next) => {
    setLang(next);
    try {
      localStorage.setItem("lang", next);
      document.documentElement.setAttribute("lang", next);
    } catch {}
  };

  // t("nav.tentang") => nilai terjemahan
  const t = (path) => {
    const keys = path.split(".");
    let val = translations[lang];
    for (const key of keys) {
      val = val?.[key];
    }
    return typeof val === "string" ? val : path;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
