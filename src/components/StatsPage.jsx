import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CanadaMap from './CanadaMap';
import projectsData from '../data/projects';
import './StatsPage.css';

// ── Province participant data ──────────────────────────────────────────────────
const PROVINCE_DATA = {
  Ontario: 1756,
  'British Columbia': 768,
  Alberta: 445,
  Quebec: 216,
  Manitoba: 123,
  'Nova Scotia': 78,
  Saskatchewan: 49,
  Nunavut: 1289,
  'New Brunswick': 30,
  'Newfoundland and Labrador': 20,
  'Northwest Territories': 346,
  'Prince Edward Island': 7,
  Yukon: 87,
};

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { id: 'members',    label: 'Members Nationwide',        value: 5400,  suffix: '+' },
  { id: 'volunteers', label: 'Active Volunteers',         value: 1800,  suffix: '+' },
  { id: 'actions',    label: 'Community Actions',         value: 8200,  suffix: '+' },
  { id: 'projects',   label: 'Microgrant Projects',       value: 300,   suffix: '+' },
  { id: 'csj',        label: 'CSJ Participants',          value: 192,   suffix: ''  },
  { id: 'showcase',   label: 'Projects Showcased',        value: projectsData.length, suffix: '' },
];

// ── IDs of "beefier" projects to feature ──────────────────────────────────────
const FEATURED_IDS = [1, 2, 5, 6, 7, 9, 10, 21, 12, 4];

// ── Helpers ───────────────────────────────────────────────────────────────────
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const kebabToTitle = (tag) =>
  tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const getContributions = () => {
  const skip = new Set(['events', 'archive', 'outreach']);
  const seen = new Set();
  projectsData.forEach(p => (p.tags || []).forEach(t => {
    if (!skip.has(t)) seen.add(t);
  }));
  return Array.from(seen).sort();
};

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const trigger = useCallback(() => setTriggered(true), []);

  useEffect(() => {
    if (!triggered) return;
    let start = null;
    const raf = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      setValue(Math.round(eased * target));
      if (prog < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [triggered, target, duration]);

  return [value, trigger];
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ stat }) {
  const ref = useRef(null);
  const [count, trigger] = useCountUp(stat.value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { trigger(); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [trigger]);

  return (
    <div ref={ref} className="sp-stat-card">
      <div className="sp-stat-value">
        {count.toLocaleString()}<span className="sp-stat-suffix">{stat.suffix}</span>
      </div>
      <div className="sp-stat-label">{stat.label}</div>
    </div>
  );
}

// ── Featured project card ─────────────────────────────────────────────────────
function FeaturedCard({ project, onSelect }) {
  return (
    <button type="button" className="sp-feat-card" onClick={() => onSelect(project)}>
      <div className="sp-feat-img-wrap">
        {project.image
          ? <img src={project.image} alt={project.title} className="sp-feat-img" />
          : <div className="sp-feat-img-empty" />}
        <div className="sp-feat-badges">
          {project.type && <span className="sp-feat-type">{cap(project.type)}</span>}
          {project.cohort && <span className="sp-feat-type sp-feat-cohort">{project.cohort}</span>}
        </div>
      </div>
      <div className="sp-feat-body">
        <h3 className="sp-feat-title">{project.title}</h3>
        <p className="sp-feat-desc">{project.description}</p>
        {project.tags?.length > 0 && (
          <div className="sp-feat-tags">
            {project.tags.slice(0, 3).map(t => (
              <span key={t} className="sp-feat-tag">{t}</span>
            ))}
          </div>
        )}
        <div className="sp-feat-cta">
          View Project <span className="sp-feat-arrow">→</span>
        </div>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StatsPage({ onExplore, onSelectProject }) {
  const contributions = getContributions();

  // Shuffle featured pool on each page load
  const featured = useMemo(() => {
    const pool = projectsData.filter(p => FEATURED_IDS.includes(p.id));
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 4);
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.2, 0, 0, 1] },
  });

  return (
    <div className="sp-page">

      {/* ── Hero ── */}
      <motion.div className="sp-hero" {...fadeUp(0)}>
        <span className="sp-badge">The GLOCAL Foundation of Canada · 2026</span>
        <div className="sp-hero-body">
          <div className="sp-hero-text">
            <h1 className="sp-title">Civic Impact,<br />from Coast to Coast to Coast</h1>
            <p className="sp-sub">
              GLOCAL's <em>All You Can Volunteer</em> pathway makes civic participation
              accessible, flexible, and meaningful — tracked through YouCount.ca
              for any Canadian who wants to serve their community.
            </p>
            <div className="sp-hero-btns">
              <button className="sp-cta" onClick={onExplore}>
                Browse All Projects <span className="sp-cta-arrow">→</span>
              </button>
            </div>
          </div>
          <div className="sp-hero-highlights">
            <div className="sp-hero-hl">
              <span className="sp-hero-hl-val">5,400+</span>
              <span className="sp-hero-hl-label">Members Nationwide</span>
            </div>
            <div className="sp-hero-hl">
              <span className="sp-hero-hl-val">13</span>
              <span className="sp-hero-hl-label">Provinces & Territories</span>
            </div>
            <div className="sp-hero-hl">
              <span className="sp-hero-hl-val">300+</span>
              <span className="sp-hero-hl-label">Projects Completed</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Spotlight projects ── */}
      <motion.section className="sp-section" {...fadeUp(0.1)}>
        <div className="sp-section-head">
          <div>
            <h2 className="sp-section-title">Spotlight Projects</h2>
            <p className="sp-section-sub">A rotating selection of GLOCAL's most impactful work</p>
          </div>
          <button className="sp-see-all" onClick={onExplore}>
            See all {projectsData.length} projects →
          </button>
        </div>
        <div className="sp-featured-grid">
          {featured.map((project, i) => (
            <motion.div key={project.id} {...fadeUp(0.15 + i * 0.07)}>
              <FeaturedCard project={project} onSelect={onSelectProject} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Key stats ── */}
      <motion.section className="sp-section" {...fadeUp(0.18)}>
        <h2 className="sp-section-title">Impact at a Glance</h2>
        <div className="sp-stat-grid">
          {STATS.map(s => <StatCard key={s.id} stat={s} />)}
        </div>
      </motion.section>

      {/* ── Contributions ── */}
      <motion.section className="sp-section" {...fadeUp(0.24)}>
        <h2 className="sp-section-title">Contributions In</h2>
        <p className="sp-section-sub">Topic areas spanning GLOCAL's work</p>
        <div className="sp-contrib-tags">
          {contributions.map((tag, i) => (
            <motion.span
              key={tag}
              className="sp-contrib-tag"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.025, duration: 0.26, ease: [0.2, 0, 0, 1] }}
            >
              {kebabToTitle(tag)}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* ── Canada map ── */}
      <motion.section className="sp-section sp-map-section" {...fadeUp(0.3)}>
        <h2 className="sp-section-title">Participants Across Canada</h2>
        <p className="sp-section-sub">Every province and territory represented — hover for details</p>
        <CanadaMap data={PROVINCE_DATA} />
      </motion.section>

      {/* ── Bottom CTA ── */}
      <motion.div
        className="sp-bottom-cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p className="sp-bottom-text">
          Ready to explore GLOCAL's research, tools, and civic events?
        </p>
        <button className="sp-cta" onClick={onExplore}>
          Browse All Projects <span className="sp-cta-arrow">→</span>
        </button>
      </motion.div>

    </div>
  );
}
