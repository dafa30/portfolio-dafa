import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle({ inMenu = false }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      const stored = localStorage.getItem("theme");
      // Hanya ikuti perubahan OS jika pengguna belum memilih override manual
      if (!stored) {
        const next = e.matches ? "dark" : "light";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        document.documentElement.style.colorScheme = next;
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", next === "dark" ? "#0c1017" : "#f2f4f8");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const systemTheme = systemIsDark ? "dark" : "light";

    // Jika tema pilihan sama dengan tema sistem OS, hapus penyimpanan agar kembali sinkron
    if (next === systemTheme) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", next);
    }

    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", next === "dark" ? "#0c1017" : "#f2f4f8");
    }
  };

  const isDark = theme === "dark";
  const label = isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap";

  if (inMenu) {
    return (
      <button
        type="button"
        className="theme-toggle-in-menu"
        onClick={toggle}
        aria-label={label}
      >
        <span className="theme-toggle-icon-wrap" aria-hidden="true">
          {isDark ? <SunIcon /> : <MoonIcon />}
        </span>
        <span>{isDark ? "Mode terang" : "Mode gelap"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="theme-toggle-icon-wrap"
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function SunIcon() {
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
    >
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <line x1="12" y1="1.5" x2="12" y2="3.5" />
      <line x1="12" y1="20.5" x2="12" y2="22.5" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1.5" y1="12" x2="3.5" y2="12" />
      <line x1="20.5" y1="12" x2="22.5" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
