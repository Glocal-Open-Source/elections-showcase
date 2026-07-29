import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jobsData from "../data/jobs";
import "./JobsBoard.css";

const getEmbedParam = () => {
  const query = window.location.hash.split("?")[1] || "";
  return new URLSearchParams(query).get("embed") === "1";
};

export default function JobsBoard() {
  const embed = useMemo(getEmbedParam, []);
  const [activeSources, setActiveSources] = useState([]);

  const sourceOptions = useMemo(() => {
    const found = new Set();
    jobsData.forEach((j) => { if (j.source) found.add(j.source); });
    return Array.from(found).sort((a, b) => a.localeCompare(b));
  }, []);

  const toggleSource = (s) =>
    setActiveSources((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const filteredJobs = useMemo(() => {
    if (activeSources.length === 0) return jobsData;
    return jobsData.filter((j) => activeSources.includes(j.source));
  }, [activeSources]);

  return (
    <div className={embed ? "jb-page jb-embed" : "jb-page"}>
      {sourceOptions.length > 0 && (
        <div className="jb-chip-row" role="group" aria-label="Filter by province or source">
          <button
            type="button"
            className={activeSources.length === 0 ? "jb-chip active" : "jb-chip"}
            onClick={() => setActiveSources([])}
          >
            All
          </button>
          {sourceOptions.map((s) => (
            <button
              key={s}
              type="button"
              className={activeSources.includes(s) ? "jb-chip active" : "jb-chip"}
              onClick={() => toggleSource(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="jb-empty">
          <div className="jb-empty-title">No matches</div>
          <div className="jb-empty-sub">Try a different source, or clear the filter.</div>
          <button type="button" className="jb-empty-btn" onClick={() => setActiveSources([])}>
            Clear filter
          </button>
        </div>
      ) : (
        <div className="jb-grid">
          <AnimatePresence mode="sync">
            {filteredJobs.map((job, i) => (
              <motion.article
                key={job.id}
                className="jb-card"
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, delay: Math.min(i, 16) * 0.02, ease: [0.2, 0, 0, 1] }}
              >
                <div className="jb-card-head">
                  <span className="jb-eyebrow">{job.source}</span>
                  {job.isProgram ? (
                    <span className="jb-pill jb-pill-program">Opportunity</span>
                  ) : (
                    job.employmentType && <span className="jb-pill">{job.employmentType}</span>
                  )}
                </div>
                <h2 className="jb-card-title">{job.title}</h2>
                <div className="jb-card-dept">{job.department || " "}</div>
                <div className="jb-card-meta">
                  {[job.location, job.closingDate ? `Closes ${job.closingDate}` : job.duration, job.salary]
                    .filter(Boolean)
                    .join("  ·  ")}
                </div>
                <a
                  className="jb-card-link"
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View &amp; apply →
                </a>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
