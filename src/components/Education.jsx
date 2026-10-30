import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { education as edu } from "../data";

const ease = [0.22, 1, 0.36, 1];

function CountUp({ to, decimals = 2, duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, duration]);

  return <span ref={ref}>{val.toFixed(decimals).replace(".", ",")}</span>;
}

export default function Education() {
  return (
    <section id="pendidikan" className="section">
      <div className="container">
        <SectionTitle>Pendidikan</SectionTitle>

        <div className="edu-grid">
          <motion.div
            className="edu-info"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
          >
            <h3>{edu.degree}</h3>
            <p className="edu-school">
              {edu.school}, {edu.period}
            </p>
            <ul className="edu-list">
              <li>
                <span>Gelar</span>
                {edu.title}
              </li>
              <li>
                <span>Peminatan</span>
                {edu.specialization}
              </li>
              <li>
                <span>Kelulusan</span>
                {edu.graduated}
              </li>
              <li>
                <span>Predikat</span>
                {edu.predicate}
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="gpa"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <p className="gpa-label">Indeks prestasi kumulatif</p>
            <p className="gpa-value">
              <CountUp to={edu.gpa} />
              <small> / {String(edu.gpaMax).replace(".", ",")},00</small>
            </p>
            <div className="gpa-track" role="img" aria-label={`IPK ${edu.gpa} dari ${edu.gpaMax}`}>
              <motion.div
                className="gpa-fill"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: edu.gpa / edu.gpaMax }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.8, ease, delay: 0.2 }}
              />
            </div>
            <div className="gpa-scale" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="thesis">
          <motion.span
            className="thesis-bar"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <h4>Skripsi</h4>
            <p>{edu.thesisTitle}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
