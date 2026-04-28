import React, { useEffect, useMemo, useState } from "react";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const isHttp = (s) => /^https?:\/\//i.test(s || "");
const getExt = (s) => {
  const clean = (s || "").split("?")[0].split("#")[0];
  const m = clean.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : "";
};

const tagHighlights = (tags = []) => {
  const t = new Set(tags);
  const out = [];
  if (t.has("elections-canada")) out.push("Election-focused resource (candidates, results, campaigns, or voter engagement).");
  if (t.has("statistics-canada")) out.push("Statistics Canada / survey / census-adjacent analysis or dataset.");
  if (t.has("civic-tech")) out.push("Built as a civic technology tool (interactive product, app, or platform).");
  if (t.has("civic-education")) out.push("Designed for learning: explainers, toolkits, or public-facing civic literacy.");
  if (t.has("data-analysis")) out.push("Analysis-driven output (methods, reporting, evidence synthesis).");
  if (t.has("data-visualization")) out.push("Visualization-heavy output (dashboards, maps, interactive charts).");
  if (t.has("governance")) out.push("Institutional / governance focus (structures, responsibilities, policy framing).");
  if (t.has("events")) out.push("Event / showcase / panel format (archive or outreach).");
  if (out.length === 0 && tags.length) out.push("Tagged project — use tags to understand theme and scope.");
  if (out.length === 0) out.push("No tags available — consider adding 2–5 canonical tags for discoverability.");
  return out.slice(0, 5);
};

const DataPreview = ({ url }) => {
  const [state, setState] = useState({ status: "idle", text: "", err: "" });
  const ext = getExt(url);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!url || !isHttp(url)) return;
      setState({ status: "loading", text: "", err: "" });
      try {
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const txt = await res.text();
        if (!alive) return;
        const maxChars = 120_000;
        const clipped = txt.length > maxChars ? txt.slice(0, maxChars) : txt;
        setState({
          status: "ready",
          text: clipped,
          err: txt.length > maxChars ? `Preview truncated (${maxChars.toLocaleString()} chars).` : "",
        });
      } catch {
        if (!alive) return;
        setState({ status: "error", text: "", err: "Couldn't load preview (CORS or network). Use Open project to view in a new tab." });
      }
    };
    run();
    return () => { alive = false; };
  }, [url]);

  const title =
    ext === "csv" ? "CSV preview" :
    ext === "json" ? "JSON preview" :
    ext ? `${ext.toUpperCase()} preview` : "Text preview";

  const copy = async () => {
    try { await navigator.clipboard.writeText(state.text || ""); } catch {}
  };

  return (
    <div className="pv-box">
      <div className="pv-box-head">
        <div className="pv-box-title">{title}</div>
        <div className="pv-box-actions">
          {state.status === "ready" && (
            <button type="button" className="pv-btn pv-btn-ghost" onClick={copy}>Copy</button>
          )}
          <a className="pv-btn pv-btn-primary" href={url} target="_blank" rel="noopener noreferrer">
            Open file ↗
          </a>
        </div>
      </div>
      {state.status === "loading" && <div className="pv-muted">Loading preview…</div>}
      {state.status === "error"   && <div className="pv-muted">{state.err}</div>}
      {state.status === "ready"   && (
        <>
          {state.err && <div className="pv-hint">{state.err}</div>}
          <pre className="pv-pre" aria-label="Data preview">{state.text}</pre>
        </>
      )}
    </div>
  );
};

const ProjectView = ({ project, onBack, allProjects = null, onSelectProject = null }) => {
  const ContentComponent = project?.component;
  const [tab, setTab] = useState("overview");

  // Double-rAF: first frame commits layout, second ensures Safari has settled.
  useEffect(() => {
    let id2;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    });
    return () => { cancelAnimationFrame(id1); cancelAnimationFrame(id2); };
  }, [project?.id]);

  // Reset tab when switching projects
  useEffect(() => { setTab("overview"); }, [project?.id]);

  const embed = project?.embed || "";
  const ext = getExt(embed);

  const embedMode = useMemo(() => {
    if (!embed) return "none";
    if (!isHttp(embed) && embed.startsWith("/")) return "iframe";
    if (!isHttp(embed)) return "link";
    if (["pdf", "html", "htm"].includes(ext)) return "iframe";
    if (["csv", "json", "txt"].includes(ext)) return "data";
    return "iframe";
  }, [embed, ext]);

  const highlights = useMemo(() => tagHighlights(project?.tags || []), [project]);

  const related = useMemo(() => {
    if (!allProjects || !onSelectProject) return [];
    const baseTags = new Set(project?.tags || []);
    return allProjects
      .filter((p) => p.id !== project.id)
      .map((p) => {
        const overlap = (p.tags || []).reduce((acc, x) => acc + (baseTags.has(x) ? 1 : 0), 0);
        const sameType = p.type === project.type ? 1 : 0;
        return { p, score: overlap * 3 + sameType };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((x) => x.p);
  }, [allProjects, onSelectProject, project]);

  if (!project) return null;

  const hasPreview = embedMode !== "none";

  return (
    <div className="pv" tabIndex={-1}>
      {/* ── Sticky nav bar ── */}
      <div className="pv-topbar">
        <button type="button" className="pv-back" onClick={onBack}>
          ← Back
        </button>
        <div className="pv-topbar-right">
          {project.type && <span className="pv-pill">{cap(project.type)}</span>}
        </div>
      </div>

      {/* ── Hero header ── */}
      <header className="pv-head">
        {project.image && (
          <div className="pv-hero">
            <img src={project.image} alt="" className="pv-hero-img" />
          </div>
        )}

        <div className="pv-header-body">
          <h1 className="pv-title">{project.title}</h1>
          {project.description && <p className="pv-desc">{project.description}</p>}
          {project.tags?.length > 0 && (
            <div className="pv-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="pv-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="pv-tabs" role="tablist" aria-label="Project sections">
          <button
            type="button"
            className={tab === "overview" ? "pv-tab active" : "pv-tab"}
            onClick={() => setTab("overview")}
            role="tab" aria-selected={tab === "overview"}
          >
            Overview
          </button>
          {hasPreview && (
            <button
              type="button"
              className={tab === "preview" ? "pv-tab active" : "pv-tab"}
              onClick={() => setTab("preview")}
              role="tab" aria-selected={tab === "preview"}
            >
              Preview
            </button>
          )}
          <button
            type="button"
            className={tab === "details" ? "pv-tab active" : "pv-tab"}
            onClick={() => setTab("details")}
            role="tab" aria-selected={tab === "details"}
          >
            Details
          </button>
        </div>
      </header>

      {/* ── Body grid ── */}
      <div className="pv-grid">
        <section className="pv-main">

          {/* Overview tab */}
          {tab === "overview" && (
            <div className="pv-box">
              <div className="pv-box-head">
                <div className="pv-box-title">What this is</div>
                {embed && (
                  <a className="pv-btn pv-btn-primary" href={embed} target="_blank" rel="noopener noreferrer">
                    Open project ↗
                  </a>
                )}
              </div>
              <ul className="pv-bullets">
                {highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
              {ContentComponent && (
                <div className="pv-content-inner">
                  <ContentComponent />
                </div>
              )}
            </div>
          )}

          {/* Preview tab */}
          {tab === "preview" && hasPreview && (
            <>
              {ContentComponent ? (
                <div className="pv-box">
                  <div className="pv-box-head">
                    <div className="pv-box-title">Interactive preview</div>
                    {embed && (
                      <a className="pv-btn pv-btn-primary" href={embed} target="_blank" rel="noopener noreferrer">
                        Open project ↗
                      </a>
                    )}
                  </div>
                  <div className="pv-content-inner"><ContentComponent /></div>
                </div>
              ) : embedMode === "data" ? (
                <DataPreview url={embed} />
              ) : embedMode === "iframe" ? (
                <div className="pv-box">
                  <div className="pv-box-head">
                    <div className="pv-box-title">Embedded preview</div>
                    <a className="pv-btn pv-btn-primary" href={embed} target="_blank" rel="noopener noreferrer">
                      Open project ↗
                    </a>
                  </div>
                  <div className="pv-iframe-wrap">
                    <iframe src={embed} title={project.title} className="pv-iframe" loading="lazy" referrerPolicy="no-referrer" />
                  </div>
                </div>
              ) : (
                <div className="pv-box">
                  <div className="pv-box-head"><div className="pv-box-title">Link</div></div>
                  <div className="pv-muted">This project can't be embedded. Use Open project to view it.</div>
                  <div style={{ padding: "0 16px 16px" }}>
                    <a className="pv-btn pv-btn-primary" href={embed} target="_blank" rel="noopener noreferrer">
                      Open project ↗
                    </a>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Details tab */}
          {tab === "details" && (
            <div className="pv-box">
              <div className="pv-box-head"><div className="pv-box-title">Metadata</div></div>
              <div className="pv-kv">
                <div className="pv-k">Type</div>
                <div className="pv-v">{project.type ? cap(project.type) : "—"}</div>
              </div>
              <div className="pv-kv">
                <div className="pv-k">Tags</div>
                <div className="pv-v pv-v-tags">
                  {project.tags?.length ? project.tags.map((t) => (
                    <span key={t} className="pv-tag">{t}</span>
                  )) : "—"}
                </div>
              </div>
              {embed && (
                <div className="pv-kv pv-kv-col">
                  <div className="pv-k">Link</div>
                  <a className="pv-code" href={embed} target="_blank" rel="noopener noreferrer">{embed}</a>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Related sidebar ── */}
        {related.length > 0 && (
          <aside className="pv-side">
            <div className="pv-card">
              <div className="pv-card-title">Related projects</div>
              <div className="pv-related">
                {related.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="pv-related-row"
                    onClick={() => onSelectProject(p)}
                  >
                    {p.image && <img src={p.image} alt="" className="pv-related-img" />}
                    <div className="pv-related-text">
                      <div className="pv-related-title">{p.title}</div>
                      <div className="pv-related-sub">{cap(p.type || "")}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
