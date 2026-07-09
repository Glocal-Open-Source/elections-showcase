import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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

const normalizeEmbed = (url) => {
  if (!url || !url.startsWith("https://")) return url;
  if (/\/(preview|embed|pubhtml|viewform)/.test(url) || url.includes("embedded=true")) return url;

  // Drive folders can't be embedded — leave unchanged so embedMode can detect them
  if (/drive\.google\.com\/drive\/folders\//.test(url)) return url;

  let m;
  m = url.match(/https:\/\/docs\.google\.com\/document\/d\/([^/?#]+)/);
  if (m) return `https://docs.google.com/document/d/${m[1]}/preview`;

  m = url.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/([^/?#]+)/);
  if (m) return `https://docs.google.com/spreadsheets/d/${m[1]}/pubhtml?widget=true&headers=false`;

  m = url.match(/https:\/\/docs\.google\.com\/presentation\/d\/([^/?#]+)/);
  if (m) return `https://docs.google.com/presentation/d/${m[1]}/embed?start=false&loop=false&delayms=3000`;

  m = url.match(/https:\/\/docs\.google\.com\/forms\/d\/([^/?#]+)/);
  if (m) return `https://docs.google.com/forms/d/${m[1]}/viewform?embedded=true`;

  m = url.match(/https:\/\/drive\.google\.com\/file\/d\/([^/?#]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;

  m = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;

  m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;

  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;

  return url;
};

// URLs that look external but can't be iframed
const isNotEmbeddable = (url) =>
  /drive\.google\.com\/drive\/folders\//.test(url);

// After normalizeEmbed, only these origins reliably allow iframing
const isKnownEmbeddable = (url) => {
  if (!url || !isHttp(url)) return true; // local/relative paths are fine
  const ext = getExt(url);
  if (ext === 'pdf') return true;
  return (
    /\.google\.com\/.+(preview|pubhtml|embed|viewform)/.test(url) ||
    /drive\.google\.com\/file\/d\//.test(url) ||
    /youtube\.com\/embed\//.test(url) ||
    /player\.vimeo\.com\/video\//.test(url)
  );
};

const EmbedViewer = ({ src, title, ext }) => (
  <div className="pv-iframe-wrap">
    {ext === "pdf" ? (
      <object data={src} type="application/pdf" className="pv-iframe" aria-label={title}>
        <div style={{ padding: "1.5rem", textAlign: "center" }}>
          <p style={{ marginBottom: "0.75rem" }}>PDF preview not available in this browser.</p>
          <a className="pv-btn pv-btn-primary" href={src} target="_blank" rel="noopener noreferrer">
            Open PDF ↗
          </a>
        </div>
      </object>
    ) : (
      <iframe src={src} title={title} className="pv-iframe" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
    )}
  </div>
);

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

const SimpleProjectView = ({ project, onBack, onSelectProject, highlights, related, embed: rawEmbed, progress, copied, copyLink }) => {
  const embed = normalizeEmbed(rawEmbed || "");
  const isLinkable = embed && (isHttp(embed) || embed.startsWith("/"));
  const ext = getExt(embed);
  const embedMode = (() => {
    if (!embed) return "none";
    if (["csv", "json", "txt"].includes(ext)) return "data";
    if (isNotEmbeddable(embed)) return "link";
    if (!isHttp(embed) && !embed.startsWith("/") && !ext) return "link";
    if (!isKnownEmbeddable(embed)) return "link";
    return "iframe";
  })();

  return (
    <div className="pv" tabIndex={-1}>
      <div className="pv-progress" aria-hidden="true">
        <div className="pv-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="pv-topbar">
        <button type="button" className="pv-back" onClick={onBack}><FontAwesomeIcon icon={faArrowLeft} /><span>Back</span></button>
        <div className="pv-topbar-right">
          <button
            type="button"
            className={`pv-copy-btn${copied ? ' copied' : ''}`}
            onClick={copyLink}
            aria-label="Copy link to this project"
          >
            {copied ? '✓ Copied' : 'Copy link'}
          </button>
          {project.type && <span className="pv-pill">{cap(project.type)}</span>}
          {project.cohort && <span className="pv-pill pv-pill-cohort">{project.cohort}</span>}
        </div>
      </div>

      <header className="pv-head pv-head-simple">
        <div className="pv-header-body">
          <h1 className="pv-title">{project.title}</h1>
          {project.description && <p className="pv-desc">{project.description}</p>}
          {project.tags?.length > 0 && (
            <div className="pv-tags">
              {project.tags.map((tag) => <span key={tag} className="pv-tag">{tag}</span>)}
            </div>
          )}
        </div>
      </header>

      <div className="pv-grid">
        <section className="pv-main">
          {project.image && (
            <div className="pv-box pv-banner-box">
              <img src={project.image} alt={project.title} className="pv-banner-full" />
            </div>
          )}

          <div className="pv-box">
            <div className="pv-box-head">
              <div className="pv-box-title">About this project</div>
            </div>
            <ul className="pv-bullets">
              {highlights.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
            {embedMode === "iframe" && <EmbedViewer src={embed} title={project.title} ext={ext} />}
            {embedMode === "data" && <DataPreview url={embed} />}
            {embedMode === "link" && embed && (
              <div className="pv-visit-block">
                <span className="pv-visit-label">This project lives on an external website.</span>
                <a className="pv-btn-visit" href={embed} target="_blank" rel="noopener noreferrer">
                  Visit Website ↗
                </a>
              </div>
            )}
            {embedMode !== "link" && isLinkable && (
              <a className="pv-btn pv-btn-cta" href={embed} target="_blank" rel="noopener noreferrer">
                Open project ↗
              </a>
            )}
          </div>

          <div className="pv-box">
            <div className="pv-box-head"><div className="pv-box-title">Details</div></div>
            <div className="pv-kv">
              <div className="pv-k">Type</div>
              <div className="pv-v">{project.type ? cap(project.type) : "—"}</div>
            </div>
            {project.cohort && (
              <div className="pv-kv">
                <div className="pv-k">Cohort</div>
                <div className="pv-v"><span className="pv-pill pv-pill-cohort">{project.cohort}</span></div>
              </div>
            )}
            <div className="pv-kv">
              <div className="pv-k">Tags</div>
              <div className="pv-v pv-v-tags">
                {project.tags?.length ? project.tags.map((t) => (
                  <span key={t} className="pv-tag">{t}</span>
                )) : "—"}
              </div>
            </div>
            {isLinkable && (
              <div className="pv-kv pv-kv-col">
                <div className="pv-k">Link</div>
                <a className="pv-code" href={embed} target="_blank" rel="noopener noreferrer">{embed}</a>
              </div>
            )}
          </div>
        </section>

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

const ProjectView = ({ project, onBack, allProjects = null, onSelectProject = null }) => {
  const ContentComponent = project?.component;
  const [tab, setTab] = useState("overview");
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [project?.id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

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

  const embed = normalizeEmbed(project?.embed || "");
  const ext = getExt(embed);

  const embedMode = useMemo(() => {
    if (!embed) return "none";
    if (["csv", "json", "txt"].includes(ext)) return "data";
    if (isNotEmbeddable(embed)) return "link";
    if (!isHttp(embed) && !embed.startsWith("/") && !ext) return "link";
    if (!isKnownEmbeddable(embed)) return "link";
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

  if (!ContentComponent) {
    return (
      <SimpleProjectView
        project={project}
        onBack={onBack}
        onSelectProject={onSelectProject}
        highlights={highlights}
        related={related}
        embed={embed}
        progress={progress}
        copied={copied}
        copyLink={copyLink}
      />
    );
  }

  const hasPreview = embedMode === "iframe" || embedMode === "data";

  return (
    <div className="pv" tabIndex={-1}>
      {/* ── Reading progress ── */}
      <div className="pv-progress" aria-hidden="true">
        <div className="pv-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* ── Sticky nav bar ── */}
      <div className="pv-topbar">
        <button type="button" className="pv-back" onClick={onBack}>
          ← Back
        </button>
        <div className="pv-topbar-right">
          <button
            type="button"
            className={`pv-copy-btn${copied ? ' copied' : ''}`}
            onClick={copyLink}
            aria-label="Copy link to this project"
          >
            {copied ? '✓ Copied' : 'Copy link'}
          </button>
          {project.type && <span className="pv-pill">{cap(project.type)}</span>}
          {project.cohort && <span className="pv-pill pv-pill-cohort">{project.cohort}</span>}
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
              </div>
              <ul className="pv-bullets">
                {highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
              {ContentComponent && (
                <div className="pv-content-inner">
                  <ContentComponent />
                </div>
              )}
              {embedMode === "iframe" && <EmbedViewer src={embed} title={project.title} ext={ext} />}
              {embedMode === "data" && <DataPreview url={embed} />}
              {embedMode === "link" && embed && (
                <div className="pv-visit-block">
                  <span className="pv-visit-label">This project lives on an external website.</span>
                  <a className="pv-btn-visit" href={embed} target="_blank" rel="noopener noreferrer">
                    Visit Website ↗
                  </a>
                </div>
              )}
              {embedMode !== "link" && embed && (
                <a className="pv-btn pv-btn-cta" href={embed} target="_blank" rel="noopener noreferrer">
                  Open project ↗
                </a>
              )}
            </div>
          )}

          {/* Preview tab */}
          {tab === "preview" && hasPreview && (
            <>
              {embedMode === "data" ? (
                <DataPreview url={embed} />
              ) : embedMode === "iframe" ? (
                <div className="pv-box">
                  <div className="pv-box-head">
                    <div className="pv-box-title">{ext === "pdf" ? "Document" : "Embedded preview"}</div>
                    <a className="pv-btn pv-btn-primary" href={embed} target="_blank" rel="noopener noreferrer">
                      Open ↗
                    </a>
                  </div>
                  <EmbedViewer src={embed} title={project.title} ext={ext} />
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
