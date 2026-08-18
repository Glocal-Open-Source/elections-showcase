import React, { useMemo, useState } from "react";
import projectsData from "../data/projects";
import "./SubmitProject.css";

const PACKAGE_VERSION = 1;
const TYPE_OPTIONS = ["report", "data", "interactive", "events"];
const MAX_THUMB_BYTES = 2 * 1024 * 1024;
const THUMBNAIL_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isHttpsUrl = (s) => {
  try {
    return new URL(s).protocol === "https:";
  } catch {
    return false;
  }
};

const emptySection = () => ({ heading: "", body: "" });
const emptyLink = () => ({ label: "", url: "" });

export default function SubmitProject() {
  const categoryOptions = useMemo(() => {
    const cats = new Set();
    projectsData.forEach((p) => { if (p.category) cats.add(p.category); });
    return Array.from(cats).sort((a, b) => a.localeCompare(b));
  }, []);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("report");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [embed, setEmbed] = useState("");
  const [sections, setSections] = useState([{ heading: "About the Project", body: "" }]);
  const [links, setLinks] = useState([]);
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [errors, setErrors] = useState([]);
  const [exported, setExported] = useState(false);

  const updateSection = (i, field, value) =>
    setSections((prev) => prev.map((s, j) => (j === i ? { ...s, [field]: value } : s)));

  const updateLink = (i, field, value) =>
    setLinks((prev) => prev.map((l, j) => (j === i ? { ...l, [field]: value } : l)));

  const onThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) { setThumbnail(null); return; }
    if (!THUMBNAIL_TYPES.includes(file.type)) {
      setErrors(["Thumbnail must be a PNG, JPEG, WebP, or GIF image."]);
      e.target.value = "";
      return;
    }
    if (file.size > MAX_THUMB_BYTES) {
      setErrors(["Thumbnail must be smaller than 2 MB."]);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setThumbnail({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = [];
    if (!title.trim()) errs.push("Project title is required.");
    if (!description.trim()) errs.push("Short description is required.");
    if (!category.trim()) errs.push("Category is required.");
    if (embed.trim() && !isHttpsUrl(embed.trim()))
      errs.push("Embed / project URL must start with https://");
    links.forEach((l, i) => {
      if ((l.label.trim() || l.url.trim()) && !isHttpsUrl(l.url.trim()))
        errs.push(`Link ${i + 1}: URL must start with https://`);
    });
    const hasContent =
      embed.trim() || sections.some((s) => s.body.trim());
    if (!hasContent)
      errs.push("Add at least one content section (or a project URL).");
    return errs;
  };

  const handleExport = () => {
    const errs = validate();
    setErrors(errs);
    setExported(false);
    if (errs.length > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const pkg = {
      packageVersion: PACKAGE_VERSION,
      createdAt: new Date().toISOString(),
      title: title.trim(),
      type,
      category: category.trim(),
      description: description.trim(),
      tags: tagsText
        .split(",")
        .map((t) => slugify(t.trim()))
        .filter(Boolean),
      teamMembers: teamMembers.trim(),
      embed: embed.trim(),
      sections: sections
        .filter((s) => s.body.trim())
        .map((s) => ({ heading: s.heading.trim(), body: s.body.trim() })),
      links: links
        .filter((l) => l.url.trim())
        .map((l) => ({ label: l.label.trim() || l.url.trim(), url: l.url.trim() })),
      submitterName: submitterName.trim(),
      submitterEmail: submitterEmail.trim(),
      thumbnail,
    };

    const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `project-package-${slugify(title) || "untitled"}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setExported(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="sp-page">
      <header className="sp-header">
        <a href="#/projects" className="sp-back">← Back to projects</a>
        <h1>Create Project Package</h1>
        <p className="sp-intro">
          Staff only. Create a JSON package, validate it, then import it into the showcase.
        </p>
      </header>

      {errors.length > 0 && (
        <div className="sp-alert sp-alert-error" role="alert">
          <strong>Fix these fields:</strong>
          <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
      {exported && errors.length === 0 && (
        <div className="sp-alert sp-alert-ok" role="status">
          Package downloaded. Import the JSON file with the project importer.
        </div>
      )}

      <div className="sp-form">
        <section className="sp-card sp-workflow">
          <h2>Import workflow</h2>
          <ol>
            <li>
              <strong>Complete the form.</strong>
              <p>
                Enter the title, type, category, and card description. Add at least
                one content section or an HTTPS project URL. Check all copy, tags,
                names, links, and the thumbnail before continuing.
              </p>
            </li>
            <li>
              <strong>Download the package.</strong>
              <p>
                Click <strong>Download JSON package</strong> at the bottom of this page. Keep
                the downloaded <code>project-package-*.json</code> file outside the
                repository. It is import input and should not be committed.
              </p>
            </li>
            <li>
              <strong>Open a terminal in the repository root.</strong>
              <p>Install dependencies if this checkout has not been set up:</p>
              <pre><code>npm ci</code></pre>
            </li>
            <li>
              <strong>Validate the package without changing files.</strong>
              <pre><code>{`npm run project:import -- "path/to/project-package.json" --cohort "Intern" --dry-run`}</code></pre>
              <p>
                Use <code>Admin</code>, <code>NYSN</code>, <code>Intern</code>, or
                <code>Microgrant 20XX</code> as the cohort. The cohort defaults to
                <code>NYSN</code> when the option is omitted. Read the validation
                output and correct this form if any field is rejected.
              </p>
            </li>
            <li>
              <strong>Import the package.</strong>
              <p>Run the same command without <code>--dry-run</code>:</p>
              <pre><code>{`npm run project:import -- "path/to/project-package.json" --cohort "Intern"`}</code></pre>
              <p>
                The importer assigns the next project ID, creates the overview
                component, saves the thumbnail, and updates the project list. Do not
                run the same package twice.
              </p>
            </li>
            <li>
              <strong>Review every generated change.</strong>
              <pre><code>git status --short</code></pre>
              <pre><code>git diff -- src/data/projects.js src/content</code></pre>
              <p>
                Confirm the assigned ID, cohort, category, type, description, tags,
                embed URL, component import, and generated content. Confirm that the
                thumbnail path printed by the importer exists under
                <code> public/thumbnails/</code>. Submitter contact details must not
                appear in public files.
              </p>
            </li>
            <li>
              <strong>Run the checks and inspect the project.</strong>
              <pre><code>npm run lint</code></pre>
              <pre><code>npm run build</code></pre>
              <pre><code>npm run dev</code></pre>
              <p>
                Open the local site. Check the project card, thumbnail, filters,
                Overview page, links, and embedded content. Fix all errors before
                committing or deploying. Press <code>Ctrl+C</code> to stop the local server.
              </p>
            </li>
          </ol>
        </section>

        <section className="sp-card">
          <h2>Basics</h2>
          <label className="sp-field">
            <span>Project title *</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          </label>
          <div className="sp-row">
            <label className="sp-field">
              <span>Type *</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </label>
            <label className="sp-field">
              <span>Category *</span>
              <input
                list="sp-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select or enter a category"
                maxLength={80}
              />
              <datalist id="sp-categories">
                {categoryOptions.map((c) => <option key={c} value={c} />)}
              </datalist>
            </label>
          </div>
          <label className="sp-field">
            <span>Short description * <em>(shown on the project card)</em></span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </label>
          <label className="sp-field">
            <span>Tags <em>(comma separated, e.g. civic-education, ontario)</em></span>
            <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} />
          </label>
          <label className="sp-field">
            <span>Team members <em>(names, comma separated)</em></span>
            <input value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} maxLength={300} />
          </label>
        </section>

        <section className="sp-card">
          <h2>Content</h2>
          <label className="sp-field">
            <span>Live project / embed URL <em>(https only, optional)</em></span>
            <input
              value={embed}
              onChange={(e) => setEmbed(e.target.value)}
              placeholder="https://…"
              inputMode="url"
            />
          </label>

          {sections.map((s, i) => (
            <div className="sp-section-block" key={i}>
              <div className="sp-section-head">
                <input
                  className="sp-section-title"
                  value={s.heading}
                  onChange={(e) => updateSection(i, "heading", e.target.value)}
                  placeholder="Section heading"
                  maxLength={100}
                />
                {sections.length > 1 && (
                  <button
                    type="button"
                    className="sp-remove"
                    onClick={() => setSections((prev) => prev.filter((_, j) => j !== i))}
                    aria-label={`Remove section ${i + 1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
              <textarea
                value={s.body}
                onChange={(e) => updateSection(i, "body", e.target.value)}
                rows={5}
                placeholder="Section text. Separate paragraphs with a blank line."
              />
            </div>
          ))}
          <button
            type="button"
            className="sp-add"
            onClick={() => setSections((prev) => [...prev, emptySection()])}
          >
            + Add section
          </button>
        </section>

        <section className="sp-card">
          <h2>Links</h2>
          {links.map((l, i) => (
            <div className="sp-link-row" key={i}>
              <input
                value={l.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                placeholder="Label (e.g. GitHub repo)"
                maxLength={80}
              />
              <input
                value={l.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://…"
                inputMode="url"
              />
              <button
                type="button"
                className="sp-remove"
                onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}
                aria-label={`Remove link ${i + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="sp-add" onClick={() => setLinks((prev) => [...prev, emptyLink()])}>
            + Add link
          </button>
        </section>

        <section className="sp-card">
          <h2>Thumbnail &amp; Submitter</h2>
          <label className="sp-field">
            <span>Thumbnail image <em>(optional, under 2 MB)</em></span>
            <input type="file" accept={THUMBNAIL_TYPES.join(",")} onChange={onThumbnailChange} />
          </label>
          {thumbnail && (
            <div className="sp-thumb-preview">
              <img src={thumbnail.dataUrl} alt="Thumbnail preview" />
              <button type="button" className="sp-remove" onClick={() => setThumbnail(null)}>
                Remove
              </button>
            </div>
          )}
          <div className="sp-row">
            <label className="sp-field">
              <span>Submitter name</span>
              <input value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} maxLength={100} />
            </label>
            <label className="sp-field">
              <span>Submitter email</span>
              <input
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                inputMode="email"
                maxLength={200}
              />
            </label>
          </div>
        </section>

        <div className="sp-actions">
          <button type="button" className="sp-export" onClick={handleExport}>
            Download JSON package
          </button>
        </div>
      </div>
    </div>
  );
}
