import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { profile } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const CARD_W = 300;
const COMPACT_H = 520;
const COMPACT_QUERY = "(max-width: 760px)";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

function useFitScale(enabled) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!enabled) { setScale(1); return; }
    const calc = () => setScale(clamp((window.innerWidth - 40) / CARD_W, 0.7, 1.18));
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [enabled]);
  return scale;
}

function Barcode({ text }) {
  const bars = useMemo(() => {
    const out = [];
    for (let i = 0; i < 4; i++) {
      for (const ch of text) {
        const c = ch.charCodeAt(0);
        out.push({ w: 1 + ((c + i) % 3), gap: 1 + ((c * (i + 2)) % 3) });
      }
    }
    return out.slice(0, 48);
  }, [text]);

  return (
    <div className="idc-barcode" aria-hidden="true">
      {bars.map((b, i) => (
        <span key={i} style={{ width: b.w, marginRight: b.gap }} />
      ))}
    </div>
  );
}

// Hanya glare putih, holo dihapus
function Sheen({ glare, glareOpacity }) {
  return (
    <motion.div className="idc-glare" style={{ background: glare, opacity: glareOpacity }} />
  );
}

// Motif batik mega mendung (awan bergradasi khas Cirebon) dengan bingkai emas
const CLOUD = "M-26 14 C-34 14 -34 3 -25 2 C-26 -8 -14 -12 -8 -6 C-6 -16 10 -18 14 -8 C22 -12 32 -4 26 4 C32 8 28 14 22 14 Z";
const CLOUD_LAYERS = [
  { s: 1, fill: "#1d4ed8", stroke: "#bfdbfe" },
  { s: 0.78, fill: "#2f6bea", stroke: "#dbeafe" },
  { s: 0.56, fill: "#5b92f2", stroke: "#eff6ff" },
  { s: 0.34, fill: "#9fc3fa", stroke: "#ffffff" },
];

function Cloud({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {CLOUD_LAYERS.map((l) => (
        <path
          key={l.s}
          d={CLOUD}
          transform={`scale(${l.s})`}
          fill={l.fill}
          stroke={l.stroke}
          strokeWidth={1.1 / l.s}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function BatikPattern() {
  return (
    <svg className="idc-batik" viewBox="0 0 300 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="batik-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6d98b" />
          <stop offset="0.5" stopColor="#c8923a" />
          <stop offset="1" stopColor="#f0cf7e" />
        </linearGradient>
        <linearGradient id="batik-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f1d2c" />
          <stop offset="1" stopColor="#5a0f1b" />
        </linearGradient>
        <pattern id="batik-mega" width="120" height="70" patternUnits="userSpaceOnUse" patternTransform="scale(1.35) rotate(0)">
          <Cloud x="30" y="18" />
          <Cloud x="90" y="53" />
          <g fill="#f6d98b" opacity="0.55">
            <circle cx="60" cy="35" r="1.6" />
            <circle cx="0" cy="0" r="1.6" />
            <circle cx="120" cy="70" r="1.6" />
            <circle cx="0" cy="70" r="1.6" />
            <circle cx="120" cy="0" r="1.6" />
          </g>
        </pattern>
      </defs>
      <rect width="300" height="450" fill="url(#batik-bg)" />
      <rect width="300" height="450" fill="url(#batik-mega)" />
      <g fill="none" stroke="url(#batik-gold)">
        <rect x="12" y="12" width="276" height="426" rx="16" strokeWidth="2.5" />
        <rect x="20" y="20" width="260" height="410" rx="11" strokeWidth="1" strokeDasharray="2 4" />
      </g>
    </svg>
  );
}

export default function IDCard() {
  const dragRef = useRef(null);
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);
  const { t } = useLanguage();

  const compact = useMediaQuery(COMPACT_QUERY);
  const coarse = useMediaQuery("(pointer: coarse)");
  const scale = useFitScale(compact);
  const ambient = (compact || coarse) && !reduce;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const swing = useTransform(x, [-220, 220], [-14, 14]);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const spring = { stiffness: 220, damping: 20, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sh = useSpring(hover, { stiffness: 120, damping: 18 });

  const rotateY = useTransform(sx, [0, 1], [-20, 20]);
  const rotateX = useTransform(sy, [0, 1], [20, -20]);
  const gx = useTransform(sx, [0, 1], [0, 100]);
  const gy = useTransform(sy, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.72), rgba(255,255,255,0) 58%)`;
  const glareOpacity = useTransform(sh, [0, 1], [0, 0.48]);
  const photoX = useTransform(sx, [0, 1], [7, -7]);
  const photoY = useTransform(sy, [0, 1], [6, -6]);
  const floorX = useTransform(sx, [0, 1], [18, -18]);
  const floorScale = useTransform(sy, [0, 1], [1.1, 0.88]);

  const sheen = { glare, glareOpacity };

  const idleRef = useRef([]);
  const resumeRef = useRef(null);
  const gyroOn = useRef(false);

  const stopIdle = useCallback(() => { idleRef.current.forEach((a) => a.stop()); idleRef.current = []; }, []);
  const startIdle = useCallback(() => {
    stopIdle();
    hover.set(0.7);
    idleRef.current = [
      animate(px, [0.5, 0.74, 0.5, 0.26, 0.5], { duration: 7, repeat: Infinity, ease: "easeInOut" }),
      animate(py, [0.5, 0.32, 0.5, 0.68, 0.5], { duration: 5.5, repeat: Infinity, ease: "easeInOut" }),
    ];
  }, [hover, px, py, stopIdle]);

  useEffect(() => {
    if (!ambient) return;
    startIdle();
    return () => { stopIdle(); clearTimeout(resumeRef.current); hover.set(0); px.set(0.5); py.set(0.5); };
  }, [ambient, startIdle, stopIdle, hover, px, py]);

  const base = useRef(null);
  const onOrient = useCallback((e) => {
    if (e.gamma == null || e.beta == null) return;
    if (!base.current) base.current = { g: e.gamma, b: e.beta };
    if (!gyroOn.current) { gyroOn.current = true; stopIdle(); clearTimeout(resumeRef.current); }
    hover.set(1);
    px.set(0.5 + clamp(e.gamma - base.current.g, -20, 20) / 40);
    py.set(0.5 + clamp(e.beta - base.current.b, -20, 20) / 40);
  }, [hover, px, py, stopIdle]);

  useEffect(() => {
    if (!coarse || reduce) return;
    const D = window.DeviceOrientationEvent;
    if (!D || typeof D.requestPermission === "function") return;
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [coarse, reduce, onOrient]);

  useEffect(() => () => window.removeEventListener("deviceorientation", onOrient), [onOrient]);

  const askedGyro = useRef(false);
  const enableGyro = async () => {
    const D = window.DeviceOrientationEvent;
    if (!coarse || reduce || askedGyro.current || !D || typeof D.requestPermission !== "function") return;
    askedGyro.current = true;
    try {
      if ((await D.requestPermission()) === "granted") {
        window.addEventListener("deviceorientation", onOrient);
      }
    } catch { /* pengguna menolak */ }
  };

  const setFromPointer = (e) => {
    if (!dragRef.current) return;
    const r = dragRef.current.getBoundingClientRect();
    px.set(clamp((e.clientX - r.left) / r.width, 0, 1));
    py.set(clamp((e.clientY - r.top) / r.height, 0, 1));
  };
  const onDown = (e) => { if (e.pointerType !== "touch") return; stopIdle(); clearTimeout(resumeRef.current); hover.set(1); setFromPointer(e); };
  const onMove = (e) => { if (e.pointerType === "touch" && !ambient) return; setFromPointer(e); };
  const onEnter = (e) => { if (e.pointerType !== "touch") hover.set(1); };
  const onLeave = () => { hover.set(0); px.set(0.5); py.set(0.5); };
  const onUp = (e) => {
    if (e.pointerType !== "touch") return;
    px.set(0.5); py.set(0.5);
    if (ambient && !gyroOn.current) { clearTimeout(resumeRef.current); resumeRef.current = setTimeout(startIdle, 1400); }
  };
  const toggle = () => { setFlipped((f) => !f); enableGyro(); };
  const onKey = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } };

  const hint = coarse ? t("idcard.hintCoarse") : t("idcard.hintDesktop");

  return (
    <div
      className={`idc-fit ${compact ? "is-compact" : ""}`}
      style={compact ? { height: COMPACT_H * scale + 16 } : undefined}
    >
      <div className="idc-scaler" style={compact ? { transform: `scale(${scale})` } : undefined}>
        <motion.div
          className="idc-stage"
          initial={{ opacity: 0, scale: 0.6, rotateY: -100, transformPerspective: 1200 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, transformPerspective: 1200 }}
          transition={{ type: "spring", stiffness: 70, damping: 13, delay: 0.4 }}
        >
          {compact && <motion.div className="idc-floor" style={{ x: floorX, scaleX: floorScale }} aria-hidden="true" />}

          <motion.div
            className="idc-bob"
            animate={ambient && compact ? { y: [0, -9, 0] } : { y: 0 }}
            transition={ambient && compact ? { duration: 4.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
          >
            <motion.div
              ref={dragRef}
              className="idc-drag"
              style={{ x, y, rotate: swing, originX: 0.5, originY: 0 }}
              drag={!coarse}
              dragSnapToOrigin
              dragMomentum={false}
              dragElastic={0.22}
              dragTransition={{ bounceStiffness: 170, bounceDamping: 9 }}
              whileDrag={{ scale: 1.03 }}
              onTap={toggle}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerEnter={onEnter}
              onPointerLeave={onLeave}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onKeyDown={onKey}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={t("idcard.ariaLabel")}
            >
              <motion.div className="idc-tilt" style={{ rotateX, rotateY, transformPerspective: 1100 }}>
                <motion.div
                  className="idc-flip"
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 130, damping: 16 }}
                >
                  {/* ---- sisi depan ---- */}
                  <div className="idc-face idc-front">
                    <div className="idc-front-inner">
                      <div className="idc-photo">
                        {photoOk ? (
                          <motion.img
                            src={profile.photo}
                            alt={`Foto ${profile.name}`}
                            draggable={false}
                            onError={() => setPhotoOk(false)}
                            style={{ x: photoX, y: photoY, scale: 1.14 }}
                          />
                        ) : (
                          <span className="idc-initials">DAR</span>
                        )}
                      </div>

                      <div className="idc-name">
                        <h3>{profile.name}</h3>
                        <p>Web Developer</p>
                      </div>

                      <div className="idc-bottom">
                        <Barcode text={profile.name} />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                    <Sheen {...sheen} />
                  </div>

                  {/* ---- sisi belakang: motif batik ---- */}
                  <div className="idc-face idc-back">
                    <BatikPattern />
                    <Sheen {...sheen} />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.p
            className="idc-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
          >
            {hint}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
