import React, { useState, useEffect, useCallback, useMemo } from 'react';
import projectsData from '../data/projects';
import './TagTool.css';

const SK_TAGS    = 'tt-tags-v1';
const SK_COHORTS = 'tt-cohorts-v1';
const SK_PROV    = 'tt-prov-v1';

const ROWS = [
  { keys: ['1','2','3','4','5','6','7','8','9','0'], offset: 0 },
  { keys: ['q','w','e','r','t','y','u','i','o','p'], offset: 0.5 },
  { keys: ['a','s','d','f','g','h','j','k','l'],     offset: 0.75 },
  { keys: ['z','x','c','v','b','n','m'],             offset: 1.25 },
];
const KEY_UNIT      = 76;
const KEY_SEQUENCE  = ROWS.flatMap(r => r.keys);
const KEYS_PER_PAGE = KEY_SEQUENCE.length; // 36

// ── Static datasets ───────────────────────────────────────────────────────────
const ALL_TAGS = (() => {
  const freq = {};
  projectsData.forEach(p => (p.tags || []).forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count }));
})();

const COHORT_OPTIONS = [
  'Microgrant 2024',
  'Microgrant 2025',
  'Microgrant 2026',
  'Admin',
  'NYSN',
];

// Geographic west→east on keys 1–0 (provinces), then YT/NT/NU on Q/W/E (territories)
// 1=BC 2=AB 3=SK 4=MB 5=ON 6=QC 7=NB 8=NS 9=PE 0=NL  Q=YT W=NT E=NU
const PROVINCE_OPTIONS = [
  { value: 'BC', label: 'British Columbia' },
  { value: 'AB', label: 'Alberta' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'ON', label: 'Ontario' },
  { value: 'QC', label: 'Quebec' },
  { value: 'NB', label: 'New Brunswick' },
  { value: 'NS', label: 'Nova Scotia' },
  { value: 'PE', label: 'PEI' },
  { value: 'NL', label: 'Newfoundland' },
  { value: 'YT', label: 'Yukon' },
  { value: 'NT', label: 'NWT' },
  { value: 'NU', label: 'Nunavut' },
];

const TAG_PAGES  = Math.ceil(ALL_TAGS.length / KEYS_PER_PAGE);
const PROV_PAGES = Math.ceil(PROVINCE_OPTIONS.length / KEYS_PER_PAGE); // always 1

function loadJSON(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}

export default function TagTool() {
  const [tagAssign,    setTagAssign]    = useState(() => loadJSON(SK_TAGS));
  const [cohortAssign, setCohortAssign] = useState(() => loadJSON(SK_COHORTS));
  const [provAssign,   setProvAssign]   = useState(() => loadJSON(SK_PROV));

  const [index,      setIndex]      = useState(0);
  const [page,       setPage]       = useState(0);
  const [modKey,     setModKey]     = useState(null); // null | 'ctrl' | 'shift'
  const [showExport, setShowExport] = useState(false);
  const [copied,     setCopied]     = useState(null);
  const [zoom,       setZoom]       = useState(() => parseFloat(localStorage.getItem('tt-zoom') || '1'));

  const project = projectsData[index] ?? null;
  const total   = projectsData.length;
  const pct     = Math.round((index / total) * 100);
  const id      = project ? String(project.id) : null;

  const curTags   = id ? (tagAssign[id] || []) : [];
  const curCohort = id ? cohortAssign[id]       : null;
  const curProv   = id ? provAssign[id]         : null;

  const totalTagged = Object.values(tagAssign).filter(v => v.length > 0).length;

  // ── Effective key→label map based on current mod ─────────────────────────
  const keyMap = useMemo(() => {
    const map = {};
    if (modKey === 'ctrl') {
      COHORT_OPTIONS.forEach((opt, i) => {
        if (KEY_SEQUENCE[i]) map[KEY_SEQUENCE[i]] = { label: opt, value: opt };
      });
    } else if (modKey === 'shift') {
      PROVINCE_OPTIONS.forEach((p, i) => {
        if (KEY_SEQUENCE[i]) map[KEY_SEQUENCE[i]] = { label: p.label, value: p.value };
      });
    } else {
      KEY_SEQUENCE.forEach((k, i) => {
        const idx = page * KEYS_PER_PAGE + i;
        if (idx < ALL_TAGS.length)
          map[k] = { label: ALL_TAGS[idx].tag, value: ALL_TAGS[idx].tag, count: ALL_TAGS[idx].count };
      });
    }
    return map;
  }, [modKey, page]);

  const totalPages = modKey === 'shift' ? PROV_PAGES : TAG_PAGES;

  const assign = useCallback((value) => {
    if (!project) return;
    const pid = String(project.id);
    if (modKey === 'ctrl') {
      const next = { ...cohortAssign, [pid]: value };
      setCohortAssign(next);
      localStorage.setItem(SK_COHORTS, JSON.stringify(next));
    } else if (modKey === 'shift') {
      const next = { ...provAssign, [pid]: value };
      setProvAssign(next);
      localStorage.setItem(SK_PROV, JSON.stringify(next));
    } else {
      const existing = tagAssign[pid] || [];
      const next = {
        ...tagAssign,
        [pid]: existing.includes(value)
          ? existing.filter(t => t !== value)
          : [...existing, value],
      };
      setTagAssign(next);
      localStorage.setItem(SK_TAGS, JSON.stringify(next));
    }
  }, [project, modKey, tagAssign, cohortAssign, provAssign]);

  const skip = useCallback(() => setIndex(i => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), []);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e) => {
      if (showExport) return;
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'Control') { setModKey('ctrl');  return; }
      if (e.key === 'Shift')   { setModKey('shift'); return; }

      if (e.key === 'Tab') {
        e.preventDefault();
        setPage(p => (p + 1) % totalPages);
        return;
      }
      if (e.key === ' ')          { e.preventDefault(); skip(); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); skip(); return; }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); return; }

      const k = e.key.toLowerCase();
      if (keyMap[k]) {
        e.preventDefault();
        assign(keyMap[k].value);
      }
    };
    const onUp = (e) => {
      if (e.key === 'Control' || e.key === 'Shift') setModKey(null);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup',   onUp);
    };
  }, [keyMap, assign, skip, prev, showExport, totalPages]);

  const handleZoom = (v) => { setZoom(v); localStorage.setItem('tt-zoom', v); };

  // ── Export ────────────────────────────────────────────────────────────────
  const allIds = useMemo(() => {
    const ids = new Set([
      ...Object.keys(tagAssign),
      ...Object.keys(cohortAssign),
      ...Object.keys(provAssign),
    ]);
    return Array.from(ids).sort((a, b) => Number(a) - Number(b));
  }, [tagAssign, cohortAssign, provAssign]);

  const exportReadable = useMemo(() => {
    if (!allIds.length) return 'No assignments yet.';
    return allIds.map(pid => {
      const p    = projectsData.find(p => String(p.id) === pid);
      const tags = (tagAssign[pid] || []).join(', ') || '—';
      const coh  = cohortAssign[pid] || '—';
      const prov = provAssign[pid]   || '—';
      return `${pid.padStart(4)}  tags:${tags.padEnd(36)} cohort:${coh.padEnd(18)} province:${prov.padEnd(4)} ${p?.title ?? ''}`;
    }).join('\n');
  }, [allIds, tagAssign, cohortAssign, provAssign]);

  const exportJson = useMemo(() => JSON.stringify(
    Object.fromEntries(allIds.map(pid => [pid, {
      ...((tagAssign[pid]?.length) ? { addTags: tagAssign[pid] }   : {}),
      ...(cohortAssign[pid]        ? { cohort: cohortAssign[pid] } : {}),
      ...(provAssign[pid]          ? { province: provAssign[pid] } : {}),
    }])),
    null, 2
  ), [allIds, tagAssign, cohortAssign, provAssign]);

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); }
    catch {}
  };
  const download = () => {
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'assignments.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const resetAll = () => {
    if (!confirm('Clear all assignments?')) return;
    setTagAssign({}); setCohortAssign({}); setProvAssign({});
    [SK_TAGS, SK_COHORTS, SK_PROV].forEach(k => localStorage.removeItem(k));
  };

  // ── Export screen ─────────────────────────────────────────────────────────
  if (showExport) return (
    <div className="tt-wrap">
      <div className="tt-topbar">
        <button className="tt-btn" onClick={() => setShowExport(false)}>← Back</button>
        <div style={{ flex: 1 }} />
      </div>
      <div className="tt-export-wrap">
        <h2 className="tt-export-title">Assignments</h2>
        <p className="tt-export-meta">
          {Object.values(tagAssign).filter(v => v.length > 0).length} tagged · {Object.keys(cohortAssign).length} cohorts · {Object.keys(provAssign).length} provinces
        </p>
        <div className="tt-export-actions">
          <button className="tt-btn tt-btn-primary" onClick={() => copy(exportJson, 'json')}>
            {copied === 'json' ? '✓ Copied' : 'Copy JSON'}
          </button>
          <button className="tt-btn tt-btn-primary" onClick={() => copy(exportReadable, 'txt')}>
            {copied === 'txt' ? '✓ Copied' : 'Copy readable'}
          </button>
          <button className="tt-btn" onClick={download}>Download JSON</button>
          {allIds.length > 0 && <button className="tt-btn tt-btn-danger" onClick={resetAll}>Reset all</button>}
        </div>
        <pre className="tt-export-pre">{exportReadable}</pre>
      </div>
    </div>
  );

  if (!project) return <div className="tt-wrap"><p style={{ padding: 32 }}>No projects.</p></div>;

  return (
    <div className="tt-wrap">
      {/* Top bar */}
      <div className="tt-topbar">
        <a href="#/projects" className="tt-back">← Exit</a>
        <div className="tt-progress-group">
          <span className="tt-counter">{index + 1} / {total}</span>
          <div className="tt-bar"><div className="tt-bar-fill" style={{ width: `${pct}%` }} /></div>
          <span className="tt-pct">{pct}%</span>
        </div>
        <div className="tt-topbar-right">
          <div className="tt-zoom-group">
            <span className="tt-zoom-a tt-zoom-a-sm">A</span>
            <input type="range" min="0.65" max="1.5" step="0.05" value={zoom}
              className="tt-zoom-slider"
              onChange={e => handleZoom(parseFloat(e.target.value))} />
            <span className="tt-zoom-a tt-zoom-a-lg">A</span>
          </div>
          <span className="tt-tagged-count">{totalTagged} tagged</span>
          <button className="tt-btn" onClick={() => setShowExport(true)}>Export</button>
        </div>
      </div>

      {/* Project details */}
      <div className="tt-project">
        <div className="tt-project-inner">
          <div className="tt-project-meta">
            {project.type   && <span className="tt-pill">{project.type}</span>}
            {project.cohort && <span className="tt-pill tt-pill-cohort">{project.cohort}</span>}
            {curTags.map(t => <span key={t} className="tt-badge tt-badge-tag">🏷 {t}</span>)}
            {curCohort && <span className="tt-badge tt-badge-cohort">◎ {curCohort}</span>}
            {curProv   && <span className="tt-badge tt-badge-cat">📍 {curProv}</span>}
          </div>
          <h1 className="tt-title">{project.title}</h1>
          {project.description && <p className="tt-desc">{project.description}</p>}
          {project.tags?.length > 0 && (
            <div className="tt-existing-tags">
              {project.tags.map(t => <span key={t} className="tt-tag">{t}</span>)}
            </div>
          )}
          <div className="tt-nav">
            <button className="tt-btn-nav" onClick={prev} disabled={index === 0}>← Prev</button>
            <button className="tt-btn-skip" onClick={skip}>Skip →</button>
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className="tt-keyboard-panel">
        {/* Mode bar */}
        <div className="tt-mode-bar">
          <span className={`tt-mode-chip ${!modKey ? 'tt-mode-active' : ''}`}>
            tags
          </span>
          <span className="tt-mode-sep">·</span>
          <span className={`tt-mode-chip tt-mode-chip-ctrl ${modKey === 'ctrl' ? 'tt-mode-active tt-mode-active-ctrl' : ''}`}>
            <kbd>ctrl</kbd> cohort
          </span>
          <span className="tt-mode-sep">·</span>
          <span className={`tt-mode-chip tt-mode-chip-shift ${modKey === 'shift' ? 'tt-mode-active tt-mode-active-shift' : ''}`}>
            <kbd>shift</kbd> province
          </span>
        </div>

        <div style={{ zoom }}>
          <div className="tt-keyboard">
            {ROWS.map(({ keys, offset }, rowIdx) => (
              <div key={rowIdx} className="tt-row" style={{ marginLeft: offset * KEY_UNIT }}>
                {keys.map(k => {
                  const item       = keyMap[k];
                  const alreadyHas = item && (
                    modKey === 'ctrl'  ? project.cohort === item.value :
                    modKey === 'shift' ? false :
                    project.tags?.includes(item.value)
                  );
                  const isAssigned = item && (
                    modKey === 'ctrl'  ? curCohort === item.value :
                    modKey === 'shift' ? curProv   === item.value :
                    curTags.includes(item.value)
                  );
                  return (
                    <button
                      key={k}
                      className={[
                        'tt-key',
                        modKey === 'ctrl'  ? 'tt-key-ctrl-mode'  : '',
                        modKey === 'shift' ? 'tt-key-shift-mode' : '',
                        !item       ? 'tt-key-empty'   : '',
                        alreadyHas  ? 'tt-key-has'     : '',
                        isAssigned  ? 'tt-key-assigned' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => item && assign(item.value)}
                      title={item?.label}
                    >
                      <span className="tt-key-char">{k.toUpperCase()}</span>
                      {item && <span className="tt-key-label">{item.label}</span>}
                      {item?.count != null && <span className="tt-key-count">{item.count}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Page + hints */}
        <div className="tt-page-bar">
          {Array.from({ length: totalPages }, (_, i) => (
            <div key={i}
              className={`tt-page-dot${i === page ? ' tt-page-dot-active' : ''}`}
              onClick={() => setPage(i)} title={`Page ${i + 1}`} />
          ))}
          <span>p{page + 1}/{totalPages}</span>
          <span className="tt-hint">Tab flip · Space/← → nav</span>
        </div>
      </div>
    </div>
  );
}
