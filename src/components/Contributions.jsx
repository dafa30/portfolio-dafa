import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../i18n/LanguageContext";
import { profile } from "../data";
import { getGitHubContributions } from "../services/github";

const ease = [0.22, 1, 0.36, 1];

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function RefreshIcon({ spinning }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spinning ? "spin-icon" : ""}
      aria-hidden="true"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

// Format tanggal lokal (ID / EN)
function formatDate(dateStr, lang) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const monthsId = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const mName = lang === "en" ? monthsEn[monthIdx] : monthsId[monthIdx];
  return `${day} ${mName} ${year}`;
}

export default function Contributions() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const graphContainerRef = useRef(null);

  const username = "dafa30";

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await getGitHubContributions(username);
      setData(res);
    } catch {
      // getGitHubContributions sudah menangani error dengan aman
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Hitung penempatan label bulan di atas kolom minggu
  const monthLabels = [];
  if (data && data.weeks && data.weeks.length > 0) {
    let lastMonth = -1;
    data.weeks.forEach((week, wIdx) => {
      const firstDay = week.days[0];
      if (firstDay && firstDay.date) {
        const m = parseInt(firstDay.date.split("-")[1], 10) - 1;
        if (m !== lastMonth) {
          lastMonth = m;
          monthLabels.push({
            weekIndex: wIdx,
            label: t(`contributions.months.${m}`),
          });
        }
      }
    });
  }

  // Interaksi tooltip
  const handleCellHover = (e, day) => {
    if (!day) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = graphContainerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    setTooltipPos({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
    setHoveredCell(day);
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  return (
    <section id="kontribusi" className="section section-tint section-contributions">
      <div className="container">
        <SectionTitle>{t("contributions.title")}</SectionTitle>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          {t("contributions.subtitle")}
        </motion.p>

        {/* Kontainer Utama Grafik Kontribusi */}
        <motion.div
          className="contrib-box"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease }}
        >
          {/* Header Card Kontribusi */}
          <div className="contrib-header">
            <div className="contrib-profile-wrap">
              <div className="contrib-avatar" aria-hidden="true">
                <GitHubIcon />
              </div>
              <div className="contrib-user-info">
                <div className="contrib-user-row">
                  <a
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="contrib-username"
                    title={t("contributions.profileLink")}
                  >
                    <span>@{username}</span>
                  </a>
                  <span
                    className={`contrib-status-pill ${
                      data?.isLive ? "is-live" : "is-fallback"
                    }`}
                  >
                    <span className="status-indicator-dot" />
                    {data?.isLive
                      ? t("contributions.liveBadge")
                      : t("contributions.offlineBadge")}
                  </span>
                </div>
                <p className="contrib-timerange">
                  {data?.total !== undefined ? (
                    <strong>{data.total} {t("contributions.totalLabel").toLowerCase()}</strong>
                  ) : null}{" "}
                  <span>({t("contributions.inLastYear")})</span>
                </p>
              </div>
            </div>

            {/* Tombol Refresh / Sinkronisasi */}
            <div className="contrib-actions">
              <button
                type="button"
                className="btn btn-refresh-contrib"
                onClick={() => loadData(true)}
                disabled={refreshing || loading}
                aria-label={t("contributions.refresh")}
              >
                <RefreshIcon spinning={refreshing} />
                <span>{t("contributions.refresh")}</span>
              </button>

              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-profile-github"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Banner Pemberitahuan jika offline / API fallback */}
          {data && !data.isLive && (
            <div className="contrib-notice-banner" role="status">
              <span className="notice-icon" aria-hidden="true">ℹ</span>
              <span>{t("contributions.errorNotice")}</span>
            </div>
          )}

          {/* Area Kalender Grid GitHub */}
          <div className="contrib-graph-wrapper" ref={graphContainerRef}>
            {loading ? (
              <div className="contrib-loading-skeleton" role="status">
                <div className="skeleton-spinner" aria-hidden="true" />
                <p>{t("contributions.loading")}</p>
              </div>
            ) : (
              <div className="contrib-scroll-area">
                <div className="contrib-graph-layout">
                  {/* Sisi Kiri: Label Hari */}
                  <div className="contrib-days-col" aria-hidden="true">
                    <span className="day-label spacer" />
                    <span className="day-label">{t("contributions.days.mon")}</span>
                    <span className="day-label spacer" />
                    <span className="day-label">{t("contributions.days.wed")}</span>
                    <span className="day-label spacer" />
                    <span className="day-label">{t("contributions.days.fri")}</span>
                    <span className="day-label spacer" />
                  </div>

                  {/* Kalender Utama */}
                  <div className="contrib-calendar-core">
                    {/* Header Bulan */}
                    <div className="contrib-months-row" aria-hidden="true">
                      {monthLabels.map((m, i) => (
                        <span
                          key={i}
                          className="month-label"
                          style={{
                            gridColumnStart: m.weekIndex + 1,
                          }}
                        >
                          {m.label}
                        </span>
                      ))}
                    </div>

                    {/* Grid Kotak-Kotak Hijau (Weeks Columns) */}
                    <div
                      className="contrib-weeks-grid"
                      role="img"
                      aria-label={`Kalender kontribusi GitHub ${username} selama 12 bulan terakhir`}
                    >
                      {data?.weeks.map((week, wIdx) => (
                        <div key={wIdx} className="contrib-week-col">
                          {week.days.map((day, dIdx) => {
                            const level = day.level || 0;
                            const isSelected = hoveredCell?.date === day.date;

                            return (
                              <button
                                key={dIdx}
                                type="button"
                                className={`contrib-cell level-${level} ${
                                  isSelected ? "is-selected" : ""
                                }`}
                                onMouseEnter={(e) => handleCellHover(e, day)}
                                onMouseLeave={handleCellLeave}
                                onFocus={(e) => handleCellHover(e, day)}
                                onBlur={handleCellLeave}
                                onClick={(e) => handleCellHover(e, day)}
                                aria-label={
                                  day.count > 0
                                    ? `${day.count} ${t(
                                        "contributions.tooltipContributions"
                                      )} ${formatDate(day.date, lang)}`
                                    : `${t(
                                        "contributions.tooltipNoContributions"
                                      )} ${formatDate(day.date, lang)}`
                                }
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Interactive Tooltip */}
                <AnimatePresence>
                  {hoveredCell && (
                    <motion.div
                      className="contrib-tooltip"
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y,
                      }}
                      role="tooltip"
                    >
                      <span className="tooltip-count">
                        {hoveredCell.count > 0
                          ? `${hoveredCell.count} ${t(
                              "contributions.tooltipContributions"
                            )}`
                          : t("contributions.tooltipNoContributions")}
                      </span>
                      <span className="tooltip-date">
                        {formatDate(hoveredCell.date, lang)}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer Card: Legenda Hijau & Panduan Scroll Mobile */}
          <div className="contrib-footer">
            <span className="contrib-scroll-hint">
              <span className="hint-arrow" aria-hidden="true">⇄</span>
              <span>{t("contributions.scrollHint")}</span>
            </span>

            <div className="contrib-legend" aria-label={t("contributions.legendLabel")}>
              <span className="legend-text">{t("contributions.legendLess")}</span>
              <div className="legend-cells" aria-hidden="true">
                <span className="contrib-cell level-0" />
                <span className="contrib-cell level-1" />
                <span className="contrib-cell level-2" />
                <span className="contrib-cell level-3" />
                <span className="contrib-cell level-4" />
              </div>
              <span className="legend-text">{t("contributions.legendMore")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
