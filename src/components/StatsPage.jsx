import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CanadaMap from './CanadaMap';
import projectsData from '../data/projects';
import './StatsPage.css';

// ── Province participant data ─────────────────────────────────────────────────
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

// ── Key stats ─────────────────────────────────────────────────────────────────
const STATS = [
  { id: 'members',      label: 'Members Nationwide',            value: 5200, suffix: '+' },
  { id: 'volunteers',   label: 'Active Volunteers',             value: 1500, suffix: '+' },
  { id: 'tasks',        label: 'Community Actions',             value: 7100, suffix: '+' },
  { id: 'projects',     label: 'Microgrant Projects Completed', value: 300,  suffix: '+' },
  { id: 'csj',          label: 'CSJ Participants',              value: 181,  suffix: '' },
  { id: 'showcase',     label: 'Spotlighted Projects',           value: 28,   suffix: '' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Animated counter hook ─────────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────────
export default function StatsPage({ onExplore }) {
  const contributions = getContributions();

  const fadeUp = {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: [0.2, 0, 0, 1] },
  };

  return (
    <div className="sp-page">
      {/* ── Hero ── */}
      <motion.div className="sp-hero" {...fadeUp}>
        <span className="sp-badge">The GLOCAL Foundation of Canada · April 2026</span>
        <div className="sp-hero-body">
          <div className="sp-hero-text">
            <h1 className="sp-title">Learn, Serve, Belong<br />Across Every Province</h1>
            <p className="sp-sub">
              GLOCAL's <em>All You Can Volunteer</em> pathway makes civic participation
              accessible, flexible, and meaningful — tracked and recognized through YouCount.ca,
              for any Canadian who wants to serve.
            </p>
            <button className="sp-cta" onClick={onExplore}>
              Explore GLOCAL Projects <span className="sp-cta-arrow">→</span>
            </button>
          </div>
          <div className="sp-hero-highlights">
            <div className="sp-hero-hl">
              <span className="sp-hero-hl-val">5,200+</span>
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

      {/* ── Key stats ── */}
      <motion.section
        className="sp-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.55, ease: [0.2, 0, 0, 1] }}
      >
        <h2 className="sp-section-title">Impact at a Glance</h2>
        <div className="sp-stat-grid">
          {STATS.map(s => <StatCard key={s.id} stat={s} />)}
        </div>
      </motion.section>

      {/* ── Contributions in ── */}
      <motion.section
        className="sp-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.55, ease: [0.2, 0, 0, 1] }}
      >
        <h2 className="sp-section-title">Contributions In</h2>
        <p className="sp-section-sub">Topic areas spanning GLOCAL's work</p>
        <div className="sp-contrib-tags">
          {contributions.map((tag, i) => (
            <motion.span
              key={tag}
              className="sp-contrib-tag"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28 + i * 0.028, duration: 0.28, ease: [0.2, 0, 0, 1] }}
            >
              {kebabToTitle(tag)}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* ── Canada map ── */}
      <motion.section
        className="sp-section sp-map-section"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.55, ease: [0.2, 0, 0, 1] }}
      >
        <h2 className="sp-section-title">Participants Across Canada</h2>
        <p className="sp-section-sub">Every province and territory represented — hover for details</p>
        <CanadaMap data={PROVINCE_DATA} />
      </motion.section>

      {/* ── Bottom CTA ── */}
      <motion.div
        className="sp-bottom-cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
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
