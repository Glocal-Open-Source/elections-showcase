import React, { useState } from "react";

const GITHUB_URL = "https://github.com/Glocal-Open-Source/showcase";
const BASE       = import.meta.env.BASE_URL;

export default function SecretRepo() {
  const [copied, setCopied] = useState(null);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg, #f8f9fa)",
      color: "var(--text, #1a1a2e)",
      fontFamily: "system-ui, sans-serif",
      display: "flex",
      justifyContent: "center",
      padding: "4rem 1.5rem",
    }}>
      <div style={{ maxWidth: 680, width: "100%" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", opacity: 0.4, marginBottom: "0.5rem", textTransform: "uppercase" }}>
          For future developers
        </p>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
          GLOCAL Showcase — Source Code
        </h1>
        <p style={{ opacity: 0.6, marginBottom: "2.5rem", lineHeight: 1.6 }}>
          Run one command to clone the repo, install dependencies, and restore all assets.
          You'll need <a href="https://nodejs.org" target="_blank" rel="noreferrer" style={linkStyle}>Node.js 18+</a>, <a href="https://git-scm.com" target="_blank" rel="noreferrer" style={linkStyle}>Git</a>, and <a href="https://curl.se" target="_blank" rel="noreferrer" style={linkStyle}>curl</a>.
        </p>

        {/* Mac / Linux */}
        <section style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h2 style={labelStyle}>Mac / Linux</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => copy('curl -fsSL https://glocal-open-source.github.io/showcase/setup.sh | bash', 'mac-cmd')} style={ghostBtn}>
                {copied === 'mac-cmd' ? "Copied!" : "Copy"}
              </button>
              <a href={`${BASE}setup.sh`} download style={ghostBtn}>Download</a>
            </div>
          </div>
          <pre style={preStyle}><code>curl -fsSL https://glocal-open-source.github.io/showcase/setup.sh | bash</code></pre>
        </section>

        {/* Windows */}
        <section style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <h2 style={labelStyle}>Windows (PowerShell)</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => copy('irm https://glocal-open-source.github.io/showcase/setup.ps1 | iex', 'win-cmd')} style={ghostBtn}>
                {copied === 'win-cmd' ? "Copied!" : "Copy"}
              </button>
              <a href={`${BASE}setup.ps1`} download style={ghostBtn}>Download</a>
            </div>
          </div>
          <pre style={preStyle}><code>irm https://glocal-open-source.github.io/showcase/setup.ps1 | iex</code></pre>
        </section>

        {/* What it does */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={labelStyle}>What the script does</h2>
          <ol style={{ paddingLeft: "1.25rem", lineHeight: 2.2, margin: 0 }}>
            <li>Clones the source code from GitHub</li>
            <li>Runs <code style={codeStyle}>npm install</code></li>
            <li>Downloads all PDFs, thumbnails, and media from the deployed site</li>
            <li>Places them into <code style={codeStyle}>public/content/</code> and <code style={codeStyle}>public/thumbnails/</code></li>
          </ol>
          <p style={{ marginTop: "1rem", lineHeight: 1.6 }}>
            Then run <code style={codeStyle}>npm run dev</code> to start the local dev server.
            To deploy changes, run <code style={codeStyle}>npm run deploy</code> — you'll need push access to the repo
            (<a href={`${GITHUB_URL}/settings/access`} target="_blank" rel="noreferrer" style={linkStyle}>request access here</a>).
          </p>
        </section>

        {/* Links */}
        <section>
          <h2 style={labelStyle}>Links</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={btnStyle}>GitHub Repository</a>
            <a href={`${GITHUB_URL}/archive/refs/heads/master.zip`} style={btnStyle}>Download ZIP</a>
          </div>
        </section>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  opacity: 0.45,
  margin: 0,
};

const preStyle = {
  background: "rgba(0,0,0,0.06)",
  borderRadius: "8px",
  padding: "1rem 1.25rem",
  overflowX: "auto",
  margin: 0,
  fontSize: "0.85rem",
  fontFamily: "monospace",
  lineHeight: 1.5,
};

const codeStyle = {
  background: "rgba(0,0,0,0.07)",
  borderRadius: "4px",
  padding: "0.1em 0.4em",
  fontFamily: "monospace",
  fontSize: "0.875em",
};

const linkStyle = { color: "inherit" };

const ghostBtn = {
  fontSize: "0.75rem",
  padding: "0.3rem 0.7rem",
  borderRadius: "5px",
  border: "1.5px solid currentColor",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  opacity: 0.55,
  textDecoration: "none",
  display: "inline-block",
};

const btnStyle = {
  display: "inline-block",
  padding: "0.6rem 1.25rem",
  borderRadius: "6px",
  fontSize: "0.875rem",
  fontWeight: 600,
  textDecoration: "none",
  background: "var(--text, #1a1a2e)",
  color: "var(--bg, #f8f9fa)",
  border: "none",
};
