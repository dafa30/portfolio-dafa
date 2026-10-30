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
import { profile, skills } from "../data";
import { useLanguage } from "../i18n/LanguageContext";

const BOX_W = 380;
const BOX_H = 640;
const CARD_W = 300;
const CARD_TOP = 96;
const CX = BOX_W / 2;
const CLIP_Y = CARD_TOP - 28;
const ROPE_TOP = -520;
const COMPACT_H = 520;
const TEXT_UNIT = 190; // perkiraan panjang px satu teks + pemisah
const REPEAT_BASE = 3;
const REPEAT_MAX = 12;
const COMPACT_QUERY = "(max-width: 760px)";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const backTags = ["Laravel", "Next.js", "React.js", "TypeScript", "PHP", "MySQL", "Docker", "REST API"].filter(
  (t) => skills.teknis.includes(t)
);

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

// Kait logam: pita dijepit, lalu ring menembus slot kartu (bagian bawah ring masuk ke dalam slot)
function LanyardClip() {
  return (
    <div className="idc-clip" aria-hidden="true">
      <svg width="34" height="56" viewBox="0 0 34 56" fill="none" className="idc-hook-svg">
        <defs>
          <linearGradient id="clip-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#64748b" />
            <stop offset="0.45" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <rect x="9" y="0" width="16" height="11" rx="3" fill="url(#clip-metal)" stroke="#475569" strokeWidth="0.8" />
        <rect x="9" y="4" width="16" height="1.6" fill="#334155" />
        <rect x="14.5" y="10" width="5" height="9" rx="2" fill="url(#clip-metal)" stroke="#475569" strokeWidth="0.6" />
        <ellipse cx="17" cy="34" rx="8" ry="15" stroke="url(#clip-metal)" strokeWidth="3.2" />
        <path d="M9.6 40a8 15 0 0 0 14.8 0" stroke="#0b1220" strokeOpacity="0.85" strokeWidth="3.4" strokeLinecap="round" clipPath="inset(0)" />
      </svg>
    </div>
  );
}

export default function IDCard() {
  const dragRef = useRef(null);
  const strapDefRef = useRef(null); // ref untuk path di dalam <defs>
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

  // Titik kontrol tali tertinggal dari kartu (pegas) sehingga tali melengkung & bergoyang natural
  const lagX = useSpring(x, { stiffness: 70, damping: 6, mass: 0.9 });
  const lagY = useSpring(y, { stiffness: 90, damping: 9, mass: 0.9 });
  const [repeats, setRepeats] = useState(REPEAT_BASE);

  const strap = useTransform([x, y, lagX, lagY], ([lx, ly, cx, cy]) => {
    const ex = CX + lx;
    const ey = CLIP_Y + ly;
    const midY = (ey + ROPE_TOP) / 2;
    const slack = Math.max(0, 1 - Math.max(0, ly) / 160) * 14;
    const c1x = CX + cx * 0.55 + slack * Math.sign(lx - cx || 1);
    const c1y = midY + (cy - ly) * 0.5;
    return `M ${CX} ${ROPE_TOP} Q ${c1x} ${c1y} ${ex} ${ey}`;
  });

  // Update path di <defs> & jumlah teks sesuai panjang tali saat ditarik
  useEffect(() => {
    const update = (d) => {
      if (strapDefRef.current) strapDefRef.current.setAttribute("d", d);
      const len = strapDefRef.current?.getTotalLength?.() ?? 0;
      const next = clamp(Math.floor(len / TEXT_UNIT) , REPEAT_BASE, REPEAT_MAX);
      setRepeats((p) => (p === next ? p : next));
    };
    update(strap.get());
    return strap.on("change", update);
  }, [strap]);

  const strapLabel = useMemo(
    () => Array.from({ length: repeats }, () => "FULLSTACK DEVELOPER").join("  •  ") + "  •  ",
    [repeats]
  );

  useEffect(() => {
    if (reduce || compact) { y.set(0); return; }
    y.set(-620);
    const c = animate(y, 0, { type: "spring", stiffness: 58, damping: 8, mass: 1.2, delay: 0.45 });
    return () => c.stop();
  }, [y, reduce, compact]);

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
  const stop = (e) => e.stopPropagation();

  const hint = coarse ? t("idcard.hintCoarse") : t("idcard.hintDesktop");

  return (
    <div
      className={`idc-fit ${compact ? "is-compact" : ""}`}
      style={compact ? { height: COMPACT_H * scale + 16 } : undefined}
    >
      <div className="idc-scaler" style={compact ? { transform: `scale(${scale})` } : undefined}>
        <motion.div
          className="idc-stage"
          initial={compact ? { opacity: 0, y: 48, scale: 0.9 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.4 }}
        >
          {!compact && (
            <svg className="idc-strap" viewBox={`0 0 ${BOX_W} ${BOX_H}`} aria-hidden="true">
              <defs>
                {/* Path duplikat di defs untuk textPath — diupdate imperatively */}
                <path id="strap-text-path" ref={strapDefRef} />
              </defs>
              {/* Garis jahitan tepi pita lanyard */}
              <motion.path d={strap} className="idc-strap-border" />
              {/* Strap pita lanyard hitam pekat */}
              <motion.path d={strap} className="idc-strap-base" />
              {/* Teks FULLSTACK DEVELOPER di sepanjang tali lanyard */}
              <text className="idc-strap-text" aria-hidden="true">
                <textPath href="#strap-text-path" startOffset="97%" textAnchor="end" xmlSpace="preserve">
                  {strapLabel}
                </textPath>
              </text>
            </svg>
          )}

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
              {!compact && <LanyardClip />}

              <motion.div className="idc-tilt" style={{ rotateX, rotateY, transformPerspective: 1100 }}>
                <motion.div
                  className="idc-flip"
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 130, damping: 16 }}
                >
                  {/* ---- sisi depan ---- */}
                  <div className="idc-face idc-front">
                    <span className="idc-slot" aria-hidden="true" />
                    <div className="idc-front-inner">
                      <div className="idc-top">
                        <span className="idc-brand">
                          dafa<i />
                        </span>
                        <span className="idc-chip">Web Developer</span>
                      </div>

                      <div className="idc-mid">
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
                        <dl className="idc-facts">
                          <div>
                            <dt>{t("idcard.degree")}</dt>
                            <dd>{profile.degree}</dd>
                          </div>
                          <div>
                            <dt>{t("idcard.major")}</dt>
                            <dd>{t("idcard.majorVal")}</dd>
                          </div>
                          <div>
                            <dt>{t("idcard.university")}</dt>
                            <dd>Universitas Pamulang</dd>
                          </div>
                          <div>
                            <dt>{t("idcard.graduated")}</dt>
                            <dd>2026</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="idc-name">
                        <h3>{profile.name}</h3>
                        <p>{profile.role}</p>
                      </div>

                      <div className="idc-bottom">
                        <Barcode text={profile.name} />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                    <Sheen {...sheen} />
                  </div>

                  {/* ---- sisi belakang ---- */}
                  <div className="idc-face idc-back">
                    <div className="idc-back-stripe">
                      <span className="idc-slot" aria-hidden="true" />
                    </div>
                    <div className="idc-back-inner">
                      <h4>{t("idcard.backSkills")}</h4>
                      <ul className="idc-tags">
                        {backTags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>

                      <h4>{t("idcard.backCerts")}</h4>
                      <p className="idc-back-text">
                        {t("idcard.cert1")}
                        <br />
                        {t("idcard.cert2")}
                        <br />
                        <small>{t("idcard.certIssuer")}</small>
                      </p>

                      <h4>{t("idcard.backPortfolio")}</h4>
                      <a
                        className="idc-link"
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        onPointerDown={stop}
                      >
                        {profile.githubLabel}
                      </a>

                      <div className="idc-back-bottom">
                        <Barcode text={profile.githubLabel} />
                        <span>{profile.email}</span>
                      </div>
                    </div>
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
