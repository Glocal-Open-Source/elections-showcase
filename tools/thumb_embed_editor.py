#!/usr/bin/env python3
"""
Thumbnail & Embed Editor for GLOCAL Showcase
Run from the showcase root: python tools/thumb_embed_editor.py
"""

import http.server
import json
import os
import re
import shutil
import sys
import threading
import urllib.error
import urllib.request
import webbrowser
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse

ROOT = Path(__file__).parent.parent
PROJECTS_JS = ROOT / "src" / "data" / "projects.js"
PUBLIC_THUMBS = ROOT / "public" / "thumbnails"
PUBLIC_CONTENT = ROOT / "public" / "content"
PORT = 7171

# Pexels API key — set via env var or paste directly here
PEXELS_API_KEY = "MrTazzupPyRWFCz7j2oAhfFiax5ufrhqtdAzXcAwZVlrexmAYVdHPF7a"
_PEXELS_SEARCH = "https://api.pexels.com/v1/search"

# Common words to strip when building search queries from titles
_STOP = {
    "a","an","the","and","or","of","in","to","for","with","on","at","from",
    "by","as","is","are","was","were","be","been","being","have","has","had",
    "do","does","did","will","would","could","should","may","might","shall",
    "its","it","this","that","these","those","how","why","what","when","where",
    "canada","canadian","project","program","initiative","report","analysis",
    "glocal","youth","community","new","our","their","through","about","into",
    "using","making","building","creating","developing","engaging","promoting",
}

def pexels_query(project):
    """Generate a focused Pexels search query from project title + tags."""
    words = re.findall(r"[a-z]+", project.get("title", "").lower())
    keywords = [w for w in words if w not in _STOP and len(w) > 2][:5]
    # supplement with useful tags (skip generic ones)
    skip_tags = {"microgrants-2023","microgrants-2024","microgrants-2025",
                 "admin","nysn","civic-engagement","civic-education","research"}
    tags = [t.replace("-"," ") for t in project.get("tags", [])
            if t not in skip_tags][:2]
    parts = keywords + tags
    return " ".join(parts[:6]) if parts else project.get("title", "community")

# ── parser ──────────────────────────────────────────────────────────────────

_FIELD = re.compile(r"^\s{1,6}(\w+):\s*(.*)")

def parse_projects():
    text = PROJECTS_JS.read_text(encoding="utf-8")
    lines = text.splitlines()
    projects = []
    current = None
    depth = 0  # brace nesting inside a project block

    for i, line in enumerate(lines):
        stripped = line.strip()

        # detect start of a project object — bare "{" line (0 or 2 spaces)
        if current is None:
            if stripped == "{":
                current = {}
                depth = 1
            continue

        # track nested braces (for component references etc.)
        depth += stripped.count("{") - stripped.count("}")

        if depth <= 0:
            # end of this project block
            if "id" in current:
                projects.append(current)
            current = None
            depth = 0
            continue

        m = _FIELD.match(line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).rstrip(",").strip()

        if key == "id":
            try:
                current["id"] = int(val)
            except ValueError:
                pass
        elif key == "title":
            current["title"] = val.strip('"\'')
        elif key == "type":
            current["type"] = val.strip('"\'')
        elif key == "cohort":
            current["cohort"] = val.strip('"\'')
        elif key == "image":
            current["image"] = val.strip('"\'')
        elif key == "embed":
            current["embed"] = val.strip('"\'')
        elif key == "description" and "description" not in current:
            # grab first line of potentially multi-line description
            v = val.strip('"\'')
            if not v and i + 1 < len(lines):
                v = lines[i + 1].strip().strip('"\'').rstrip(",")
            current["description"] = v

    return projects

def thumb_status(image):
    if not image:
        return "missing"
    if image.startswith("http"):
        return "stock"
    if image.endswith("-thumbnail.png") or image.endswith("-thumb.png"):
        return "placeholder"
    return "custom"

def embed_status(embed):
    if not embed:
        return "missing"
    return "has"

def enrich(projects):
    for p in projects:
        p.setdefault("image", "")
        p.setdefault("embed", "")
        p.setdefault("cohort", "")
        p.setdefault("type", "")
        p["thumb_status"] = thumb_status(p["image"])
        p["embed_status"] = embed_status(p["embed"])
    return projects

# ── writer ───────────────────────────────────────────────────────────────────

def update_project(pid, new_image=None, new_embed=None):
    text = PROJECTS_JS.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)

    in_block = False
    id_found = False
    img_replaced = False
    embed_replaced = False
    depth = 0
    block_indent = "  "  # will detect actual indent

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not in_block:
            if stripped == "{":
                in_block = True
                id_found = False
                img_replaced = False
                embed_replaced = False
                depth = 1
                # figure out indent of fields (line starts with "  {" or "{")
                block_indent = "  " if line.startswith("  {") else ""
            i += 1
            continue

        depth += stripped.count("{") - stripped.count("}")

        if depth <= 0:
            if id_found:
                if new_embed is not None and not embed_replaced:
                    field_indent = block_indent + "  "
                    embed_line = f'{field_indent}embed: "{new_embed}",\n'
                    lines.insert(i, embed_line)
                    i += 1
            in_block = False
            depth = 0
            i += 1
            continue

        if not id_found:
            m = re.match(r"\s*id:\s*(\d+)", line)
            if m and int(m.group(1)) == pid:
                id_found = True
            i += 1
            continue

        # inside our target block — apply replacements
        if new_image is not None and not img_replaced:
            m = re.match(r"(\s*image:\s*)", line)
            if m:
                indent_part = m.group(1)
                lines[i] = f'{indent_part}"{new_image}",\n'
                img_replaced = True

        if new_embed is not None and not embed_replaced:
            m = re.match(r"(\s*embed:\s*)", line)
            if m:
                indent_part = m.group(1)
                lines[i] = f'{indent_part}"{new_embed}",\n'
                embed_replaced = True

        i += 1

    PROJECTS_JS.write_text("".join(lines), encoding="utf-8")

# ── HTTP handler ──────────────────────────────────────────────────────────────

HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Showcase — Thumb & Embed Editor</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0f0f13;--surface:#1a1a23;--surface2:#22222e;--border:#2e2e3e;
  --accent:#6d28d9;--accent2:#7c3aed;--text:#e2e8f0;--muted:#6b7280;
  --green:#16a34a;--orange:#d97706;--red:#dc2626;--blue:#2563eb;
}
html,body{height:100%;background:var(--bg);color:var(--text);font:14px/1.5 system-ui,sans-serif}
body{display:flex;flex-direction:column}
header{padding:12px 20px;background:var(--surface);border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:16px;flex-shrink:0}
header h1{font-size:16px;font-weight:600;color:#fff}
header small{color:var(--muted);font-size:12px}
.toolbar{display:flex;align-items:center;gap:8px;padding:10px 20px;
  background:var(--surface);border-bottom:1px solid var(--border);flex-shrink:0;flex-wrap:wrap}
.search{flex:1;min-width:180px;padding:6px 10px;background:var(--surface2);border:1px solid var(--border);
  border-radius:6px;color:var(--text);font-size:13px;outline:none}
.search:focus{border-color:var(--accent)}
.pills{display:flex;gap:4px}
.pill{padding:4px 10px;border-radius:20px;border:1px solid var(--border);background:transparent;
  color:var(--muted);font-size:12px;cursor:pointer;white-space:nowrap;transition:.15s}
.pill:hover{border-color:var(--accent);color:var(--text)}
.pill.active{background:var(--accent);border-color:var(--accent);color:#fff}
.count{color:var(--muted);font-size:12px;margin-left:auto}
.main{display:flex;flex:1;overflow:hidden;min-height:0}

/* list */
.list{width:420px;flex-shrink:0;overflow-y:auto;border-right:1px solid var(--border)}
.row{display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;
  border-bottom:1px solid var(--border);transition:.1s}
.row:hover{background:var(--surface)}
.row.selected{background:var(--surface2);border-left:3px solid var(--accent)}
.row:not(.selected){border-left:3px solid transparent}
.thumb{width:52px;height:36px;border-radius:4px;object-fit:cover;flex-shrink:0;background:var(--surface2)}
.thumb-placeholder{width:52px;height:36px;border-radius:4px;flex-shrink:0;
  background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:18px}
.row-info{flex:1;min-width:0}
.row-title{font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row-meta{display:flex;gap:6px;align-items:center;margin-top:2px}
.badge{font-size:10px;padding:1px 5px;border-radius:10px;font-weight:600;text-transform:uppercase}
.badge-missing{background:#3f0000;color:var(--red)}
.badge-placeholder{background:#3a2000;color:var(--orange)}
.badge-stock{background:#1a2a3a;color:var(--blue)}
.badge-custom{background:#0a2a0a;color:var(--green)}
.badge-has{background:#0a2a0a;color:var(--green)}
.badge-cohort{background:#2e1a4a;color:#a78bfa;font-size:9px}

/* detail */
.detail{flex:1;overflow-y:auto;padding:24px}
.empty-state{display:flex;align-items:center;justify-content:center;height:100%;
  color:var(--muted);flex-direction:column;gap:8px}
.empty-state span{font-size:40px}
.detail h2{font-size:17px;font-weight:600;margin-bottom:4px}
.detail .meta{color:var(--muted);font-size:12px;margin-bottom:20px;display:flex;gap:8px;align-items:center}

.section{margin-bottom:28px}
.section h3{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;
  color:var(--muted);margin-bottom:10px}

/* dropzone */
.dropzone{border:2px dashed var(--border);border-radius:8px;padding:20px;text-align:center;
  cursor:pointer;transition:.15s;position:relative}
.dropzone:hover,.dropzone.over{border-color:var(--accent);background:rgba(109,40,217,.08)}
.dropzone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer}
.dropzone p{color:var(--muted);font-size:13px;pointer-events:none}
.dropzone p strong{color:var(--text)}
.thumb-preview{width:100%;max-height:200px;object-fit:cover;border-radius:6px;margin-bottom:10px}
.thumb-current{width:100%;border-radius:6px;overflow:hidden;margin-bottom:12px;background:var(--surface2)}
.thumb-current img{width:100%;max-height:160px;object-fit:cover;display:block}
.thumb-current-url{font-size:11px;color:var(--muted);padding:6px 8px;word-break:break-all}

.input-row{display:flex;gap:8px;margin-bottom:8px}
.input-row input{flex:1;padding:7px 10px;background:var(--surface2);border:1px solid var(--border);
  border-radius:6px;color:var(--text);font-size:13px;outline:none}
.input-row input:focus{border-color:var(--accent)}
.input-row input::placeholder{color:var(--muted)}

.btn{padding:7px 14px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-weight:500;transition:.15s}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover{background:var(--accent2)}
.btn-ghost{background:var(--surface2);color:var(--text);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
.btn:disabled{opacity:.4;cursor:not-allowed}

/* toast */
.toast-wrap{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:8px;z-index:999;pointer-events:none}
.toast{padding:10px 16px;border-radius:8px;font-size:13px;font-weight:500;
  animation:slidein .2s ease;pointer-events:auto}
.toast-ok{background:#14532d;color:#86efac;border:1px solid #16a34a}
.toast-err{background:#450a0a;color:#fca5a5;border:1px solid var(--red)}
@keyframes slidein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* paste hint */
.paste-hint{font-size:11px;color:var(--muted);margin-top:4px;text-align:center}
.divider{text-align:center;color:var(--muted);font-size:12px;margin:8px 0;position:relative}
.divider::before,.divider::after{content:'';position:absolute;top:50%;width:42%;height:1px;background:var(--border)}
.divider::before{left:0}.divider::after{right:0}

/* pexels suggestions */
.pexels-bar{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.pexels-bar h3{margin-bottom:0;flex-shrink:0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.pexels-search-input{flex:1;padding:5px 8px;background:var(--surface2);border:1px solid var(--border);
  border-radius:6px;color:var(--text);font-size:12px;outline:none}
.pexels-search-input:focus{border-color:var(--accent)}
.pexels-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px}
.pexels-thumb{position:relative;border-radius:6px;overflow:hidden;aspect-ratio:16/9;
  cursor:pointer;border:2px solid transparent;transition:.15s;background:var(--surface2)}
.pexels-thumb:hover{border-color:var(--accent);transform:scale(1.02)}
.pexels-thumb img{width:100%;height:100%;object-fit:cover;display:block}
.pexels-thumb .overlay{position:absolute;inset:0;background:rgba(0,0,0,.55);
  display:flex;align-items:center;justify-content:center;opacity:0;transition:.15s;font-size:22px}
.pexels-thumb:hover .overlay{opacity:1}
.pexels-attr{font-size:10px;color:var(--muted);text-align:right;margin-bottom:8px}
.pexels-attr a{color:var(--muted);text-decoration:none}.pexels-attr a:hover{color:var(--text)}
.pexels-status{font-size:12px;color:var(--muted);padding:8px 0;min-height:20px}
.pexels-more{font-size:12px;color:var(--accent);cursor:pointer;display:inline-block;margin-top:2px}
.pexels-more:hover{text-decoration:underline}
</style>
</head>
<body>
<header>
  <h1>Thumb &amp; Embed Editor</h1>
  <small id="proj-count"></small>
</header>
<div class="toolbar">
  <input class="search" id="search" placeholder="Search projects…" autocomplete="off">
  <div class="pills" id="pills">
    <button class="pill active" data-filter="all">All</button>
    <button class="pill" data-filter="needs-thumb">Needs Thumb</button>
    <button class="pill" data-filter="needs-embed">Needs Embed</button>
    <button class="pill" data-filter="needs-both">Needs Both</button>
    <button class="pill" data-filter="placeholder">Placeholder</button>
    <button class="pill" data-filter="stock">Stock Photo</button>
  </div>
  <span class="count" id="vis-count"></span>
</div>
<div class="main">
  <div class="list" id="list"></div>
  <div class="detail" id="detail">
    <div class="empty-state"><span>🖼</span><p>Select a project to edit</p></div>
  </div>
</div>
<div class="toast-wrap" id="toasts"></div>

<script>
let projects = [];
let selected = null;
let filter = "all";
let query = "";
let pendingThumbFile = null;
let pendingThumbDataUrl = null;
let pexelsKey = "";

async function load() {
  const [projRes, cfgRes] = await Promise.all([fetch("/api/projects"), fetch("/api/config")]);
  projects = await projRes.json();
  const cfg = await cfgRes.json();
  pexelsKey = cfg.pexels_key || "";
  document.getElementById("proj-count").textContent = projects.length + " projects";
  render();
}

function filtered() {
  let list = projects;
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || String(p.id).includes(q));
  }
  if (filter === "needs-thumb") list = list.filter(p => p.thumb_status === "missing" || p.thumb_status === "placeholder");
  if (filter === "needs-embed") list = list.filter(p => p.embed_status === "missing");
  if (filter === "needs-both") list = list.filter(p => (p.thumb_status === "missing" || p.thumb_status === "placeholder") && p.embed_status === "missing");
  if (filter === "placeholder") list = list.filter(p => p.thumb_status === "placeholder");
  if (filter === "stock") list = list.filter(p => p.thumb_status === "stock");
  return list;
}

function thumbIcon(ts) {
  if (ts === "missing") return "❌";
  if (ts === "placeholder") return "🟡";
  if (ts === "stock") return "🔵";
  return "✅";
}

function render() {
  const list = filtered();
  document.getElementById("vis-count").textContent = list.length + " shown";
  const el = document.getElementById("list");
  el.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.className = "row" + (selected && selected.id === p.id ? " selected" : "");
    div.dataset.id = p.id;
    const thumbEl = p.image && !p.image.startsWith("http")
      ? `<img class="thumb" src="/pub/${p.image}" onerror="this.style.display='none';this.nextSibling.style.display='flex'" loading="lazy"><div class="thumb-placeholder" style="display:none">${thumbIcon(p.thumb_status)}</div>`
      : p.image
        ? `<img class="thumb" src="${p.image}" onerror="this.style.display='none';this.nextSibling.style.display='flex'" loading="lazy"><div class="thumb-placeholder" style="display:none">${thumbIcon(p.thumb_status)}</div>`
        : `<div class="thumb-placeholder">${thumbIcon(p.thumb_status)}</div>`;
    div.innerHTML = `
      ${thumbEl}
      <div class="row-info">
        <div class="row-title">${p.title}</div>
        <div class="row-meta">
          <span class="badge badge-${p.thumb_status}">T:${p.thumb_status}</span>
          <span class="badge badge-${p.embed_status}">E:${p.embed_status}</span>
          ${p.cohort ? `<span class="badge badge-cohort">${p.cohort}</span>` : ""}
        </div>
      </div>`;
    div.addEventListener("click", () => selectProject(p.id));
    el.appendChild(div);
  });
  if (selected) renderDetail();
}

function selectProject(id) {
  selected = projects.find(p => p.id === id);
  pendingThumbFile = null;
  pendingThumbDataUrl = null;
  document.querySelectorAll(".row").forEach(r =>
    r.classList.toggle("selected", +r.dataset.id === id));
  renderDetail();
  _afterRender();
  // scroll into view
  const row = document.querySelector(`.row[data-id="${id}"]`);
  if (row) row.scrollIntoView({block:"nearest"});
}

function renderDetail() {
  if (!selected) return;
  const p = selected;
  const imgSrc = p.image
    ? (p.image.startsWith("http") ? p.image : `/pub/${p.image}`)
    : null;

  document.getElementById("detail").innerHTML = `
    <h2>${p.title}</h2>
    <div class="meta">
      <span>#${p.id}</span>
      <span>${p.type}</span>
      ${p.cohort ? `<span class="badge badge-cohort">${p.cohort}</span>` : ""}
    </div>

    <div class="section">
      <h3>Thumbnail</h3>
      ${imgSrc ? `
        <div class="thumb-current">
          <img src="${imgSrc}" onerror="this.parentElement.style.display='none'">
          <div class="thumb-current-url">${p.image}</div>
        </div>` : `<p style="color:var(--muted);font-size:13px;margin-bottom:12px">No thumbnail set</p>`}

      <div class="dropzone" id="dropzone">
        <input type="file" id="thumb-file" accept="image/*">
        ${pendingThumbDataUrl ? `<img class="thumb-preview" src="${pendingThumbDataUrl}" id="thumb-preview">` : ""}
        <p><strong>Drop image here</strong> or click to browse</p>
        <p style="margin-top:4px;font-size:12px">PNG, JPG, WebP</p>
      </div>
      <p class="paste-hint">Or press <kbd>Ctrl+V</kbd> to paste from clipboard</p>

      <div class="divider">or use URL</div>
      <div class="input-row">
        <input type="text" id="thumb-url" placeholder="https://images.pexels.com/…" value="${p.image && p.image.startsWith('http') ? p.image : ''}">
      </div>

      <div style="display:flex;gap:8px;margin-top:4px">
        <button class="btn btn-primary" onclick="saveThumb()">Save Thumbnail</button>
        <button class="btn btn-ghost" onclick="clearThumb()">Clear</button>
      </div>
    </div>

    <div class="section" id="pexels-section">
      <div class="pexels-bar">
        <h3>Pexels Suggestions</h3>
        <input class="pexels-search-input" id="pexels-query" placeholder="Search Pexels…">
        <button class="btn btn-ghost" style="padding:4px 10px;font-size:12px" onclick="pexelsSearch()">Search</button>
      </div>
      <div class="pexels-status" id="pexels-status">Loading suggestions…</div>
      <div class="pexels-grid" id="pexels-grid"></div>
      <div class="pexels-attr" id="pexels-attr"></div>
    </div>

    <div class="section">
      <h3>Embed</h3>
      ${p.embed ? `<p style="font-size:12px;color:var(--muted);margin-bottom:10px;word-break:break-all">${p.embed}</p>` : ""}
      <div class="input-row">
        <input type="text" id="embed-url" placeholder="URL or /content/file.pdf" value="${p.embed || ''}">
      </div>
      <div style="margin-bottom:8px">
        <label style="font-size:12px;color:var(--muted);display:block;margin-bottom:4px">Or upload file (PDF, HTML, video)</label>
        <input type="file" id="embed-file" style="font-size:12px;color:var(--muted)" accept=".pdf,.html,.htm,.mp4,.webm">
      </div>
      <button class="btn btn-primary" onclick="saveEmbed()">Save Embed</button>
    </div>`;

  // drag & drop
  const dz = document.getElementById("dropzone");
  dz.addEventListener("dragover", e => { e.preventDefault(); dz.classList.add("over"); });
  dz.addEventListener("dragleave", () => dz.classList.remove("over"));
  dz.addEventListener("drop", e => {
    e.preventDefault(); dz.classList.remove("over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) loadThumbFile(file);
  });
  document.getElementById("thumb-file").addEventListener("change", e => {
    if (e.target.files[0]) loadThumbFile(e.target.files[0]);
  });
  document.getElementById("embed-file").addEventListener("change", e => {
    if (e.target.files[0]) pendingEmbedFile = e.target.files[0];
  });
}

let pendingEmbedFile = null;
let pexelsPage = 1;
let pexelsCurrentQuery = "";
let pexelsDebounce = null;

const _afterRender = () => {
  if (!selected || !document.getElementById("pexels-query")) return;
  pexelsPage = 1;
  pexelsCurrentQuery = "";
  pexelsAutoSearch();
};

function pexelsAutoSearch() {
  const input = document.getElementById("pexels-query");
  if (!input) return;
  // use server-computed query suggestion
  fetch(`/api/pexels-query?id=${selected.id}`)
    .then(r => r.json())
    .then(j => {
      input.value = j.query || selected.title;
      pexelsCurrentQuery = input.value;
      pexelsPage = 1;
      _pexelsFetch(pexelsCurrentQuery, 1);
    })
    .catch(() => {
      input.value = selected.title;
      pexelsCurrentQuery = input.value;
      _pexelsFetch(pexelsCurrentQuery, 1);
    });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") pexelsSearch();
  });
  input.addEventListener("input", () => {
    clearTimeout(pexelsDebounce);
    pexelsDebounce = setTimeout(pexelsSearch, 600);
  });
}

async function pexelsSearch() {
  const input = document.getElementById("pexels-query");
  if (!input) return;
  pexelsPage = 1;
  pexelsCurrentQuery = input.value.trim() || selected.title;
  await _pexelsFetch(pexelsCurrentQuery, 1);
}

async function _pexelsFetch(q, page) {
  const status = document.getElementById("pexels-status");
  const grid = document.getElementById("pexels-grid");
  const attr = document.getElementById("pexels-attr");
  if (!status || !grid) return;
  if (!pexelsKey) {
    status.innerHTML = `No API key — set <kbd>PEXELS_API_KEY</kbd> in the tool file`;
    return;
  }
  status.textContent = "Searching…";
  grid.innerHTML = "";
  if (attr) attr.innerHTML = "";
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=12&page=${page}&orientation=landscape`;
    const r = await fetch(url, {headers: {"Authorization": pexelsKey}});
    if (!r.ok) { status.textContent = `Pexels error ${r.status} — check API key`; return; }
    const j = await r.json();
    if (!j.photos || !j.photos.length) { status.textContent = "No results — try different keywords"; return; }
    status.textContent = "";
    j.photos.forEach(photo => {
      const div = document.createElement("div");
      div.className = "pexels-thumb";
      div.title = photo.alt || photo.photographer;
      div.innerHTML = `<img src="${photo.src.medium}" loading="lazy"><div class="overlay">✓ Use</div>`;
      div.addEventListener("click", () => applyPexels(photo));
      grid.appendChild(div);
    });
    if (attr) {
      const total = j.total_results || "?";
      const more = j.next_page ? `<span class="pexels-more" onclick="pexelsNextPage()">Load more →</span>` : "";
      attr.innerHTML = `${total} results · Photos by <a href="https://www.pexels.com" target="_blank">Pexels</a> ${more}`;
    }
  } catch(e) {
    status.textContent = "Pexels search failed: " + e.message;
  }
}

function pexelsNextPage() {
  pexelsPage++;
  _pexelsFetch(pexelsCurrentQuery, pexelsPage);
}

async function applyPexels(photo) {
  const url = photo.src.large2x || photo.src.large;
  // fill the URL input and mark the thumb selected
  const urlInput = document.getElementById("thumb-url");
  if (urlInput) urlInput.value = url;
  // highlight which one was picked
  document.querySelectorAll(".pexels-thumb").forEach(el => el.classList.remove("applying"));
  event.currentTarget.classList.add("applying");
  // save immediately
  const r = await fetch("/api/update", {method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({id: selected.id, image: url})});
  const j = await r.json();
  if (j.ok) { toast("Pexels photo applied ✓"); await load(); selectProject(selected.id); }
  else toast(j.error, true);
}

function loadThumbFile(file) {
  pendingThumbFile = file;
  const reader = new FileReader();
  reader.onload = e => {
    pendingThumbDataUrl = e.target.result;
    renderDetail();
  };
  reader.readAsDataURL(file);
}

document.addEventListener("paste", e => {
  if (!selected) return;
  const item = [...e.clipboardData.items].find(i => i.type.startsWith("image/"));
  if (item) loadThumbFile(item.getAsFile());
});

document.addEventListener("keydown", e => {
  if (document.activeElement.tagName === "INPUT") return;
  const list = filtered();
  if (!list.length) return;
  const idx = selected ? list.findIndex(p => p.id === selected.id) : -1;
  if (e.key === "ArrowDown") selectProject(list[Math.min(idx + 1, list.length - 1)].id);
  if (e.key === "ArrowUp") selectProject(list[Math.max(idx - 1, 0)].id);
});

async function saveThumb() {
  const urlInput = document.getElementById("thumb-url").value.trim();

  if (pendingThumbFile) {
    const form = new FormData();
    form.append("id", selected.id);
    form.append("file", pendingThumbFile);
    const r = await fetch("/api/upload-thumb", {method:"POST", body: form});
    const j = await r.json();
    if (j.ok) { toast("Thumbnail saved ✓"); await load(); selectProject(selected.id); pendingThumbFile = null; pendingThumbDataUrl = null; }
    else toast(j.error, true);
  } else if (urlInput) {
    const r = await fetch("/api/update", {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({id: selected.id, image: urlInput})});
    const j = await r.json();
    if (j.ok) { toast("Thumbnail URL saved ✓"); await load(); selectProject(selected.id); }
    else toast(j.error, true);
  } else {
    toast("No thumbnail selected", true);
  }
}

function clearThumb() {
  pendingThumbFile = null;
  pendingThumbDataUrl = null;
  document.getElementById("thumb-url").value = "";
  renderDetail();
}

async function saveEmbed() {
  const urlInput = document.getElementById("embed-url").value.trim();
  const fileInput = document.getElementById("embed-file").files[0];

  if (fileInput) {
    const form = new FormData();
    form.append("id", selected.id);
    form.append("file", fileInput);
    const r = await fetch("/api/upload-embed", {method:"POST", body: form});
    const j = await r.json();
    if (j.ok) { toast("Embed uploaded ✓"); await load(); selectProject(selected.id); }
    else toast(j.error, true);
  } else if (urlInput !== undefined) {
    const r = await fetch("/api/update", {method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({id: selected.id, embed: urlInput})});
    const j = await r.json();
    if (j.ok) { toast("Embed saved ✓"); await load(); selectProject(selected.id); }
    else toast(j.error, true);
  }
}

function toast(msg, err=false) {
  const wrap = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = "toast " + (err ? "toast-err" : "toast-ok");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// pill filter
document.getElementById("pills").addEventListener("click", e => {
  if (!e.target.matches(".pill")) return;
  document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
  e.target.classList.add("active");
  filter = e.target.dataset.filter;
  render();
});

// search
document.getElementById("search").addEventListener("input", e => {
  query = e.target.value;
  render();
});

load();
</script>
</body>
</html>
"""

class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # silence default logging

    def send_json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/" or path == "":
            body = HTML.encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", len(body))
            self.end_headers()
            self.wfile.write(body)

        elif path == "/api/projects":
            projects = enrich(parse_projects())
            self.send_json(projects)

        elif path == "/api/pexels-query":
            qs = parse_qs(urlparse(self.path).query)
            pid = int(qs.get("id", ["0"])[0])
            projects = parse_projects()
            project = next((p for p in projects if p.get("id") == pid), {})
            self.send_json({"query": pexels_query(project)})

        elif path == "/api/config":
            self.send_json({"pexels_key": PEXELS_API_KEY})

        elif path.startswith("/pub/"):
            rel = path[5:]  # strip /pub/
            file_path = PUBLIC_THUMBS.parent / rel
            if file_path.exists() and file_path.is_file():
                ext = file_path.suffix.lower()
                ctype = {
                    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                    ".webp": "image/webp", ".gif": "image/gif",
                    ".pdf": "application/pdf", ".html": "text/html",
                }.get(ext, "application/octet-stream")
                body = file_path.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Length", len(body))
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send_response(404)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length", 0))

        if path == "/api/update":
            body = self.rfile.read(length)
            data = json.loads(body)
            pid = int(data["id"])
            new_image = data.get("image")
            new_embed = data.get("embed")
            try:
                update_project(pid, new_image=new_image, new_embed=new_embed)
                self.send_json({"ok": True})
            except Exception as e:
                self.send_json({"ok": False, "error": str(e)}, 500)

        elif path == "/api/upload-thumb":
            try:
                data, filename = self._parse_multipart(length)
                pid = int(data.get("id", [b"0"])[0])
                project = next((p for p in parse_projects() if p.get("id") == pid), None)
                if not project:
                    raise ValueError(f"Project {pid} not found")
                ext = Path(filename).suffix or ".png"
                slug = re.sub(r"[^a-z0-9]+", "-", project["title"].lower()).strip("-")[:60]
                dest_name = f"{slug}-thumbnail{ext}"
                dest = PUBLIC_THUMBS / dest_name
                dest.write_bytes(data["file"][0])
                rel = f"thumbnails/{dest_name}"
                update_project(pid, new_image=rel)
                self.send_json({"ok": True, "image": rel})
            except Exception as e:
                self.send_json({"ok": False, "error": str(e)}, 500)

        elif path == "/api/upload-embed":
            try:
                data, filename = self._parse_multipart(length)
                pid = int(data.get("id", [b"0"])[0])
                project = next((p for p in parse_projects() if p.get("id") == pid), None)
                if not project:
                    raise ValueError(f"Project {pid} not found")
                PUBLIC_CONTENT.mkdir(exist_ok=True)
                ext = Path(filename).suffix or ".pdf"
                slug = re.sub(r"[^a-z0-9]+", "-", project["title"].lower()).strip("-")[:60]
                dest_name = f"{slug}{ext}"
                dest = PUBLIC_CONTENT / dest_name
                dest.write_bytes(data["file"][0])
                rel = f"content/{dest_name}"
                update_project(pid, new_embed=rel)
                self.send_json({"ok": True, "embed": rel})
            except Exception as e:
                self.send_json({"ok": False, "error": str(e)}, 500)

        else:
            self.send_response(404)
            self.end_headers()

    def _parse_multipart(self, length):
        """Minimal multipart/form-data parser. Returns (fields_dict, first_filename)."""
        ctype = self.headers.get("Content-Type", "")
        boundary_match = re.search(r"boundary=(.+)", ctype)
        if not boundary_match:
            raise ValueError("No boundary in Content-Type")
        boundary = ("--" + boundary_match.group(1).strip()).encode()

        raw = self.rfile.read(length)
        parts = raw.split(boundary)
        fields = {}
        filename = "upload"

        for part in parts[1:]:
            if part in (b"--\r\n", b"--", b"\r\n"):
                continue
            # split headers from body
            header_end = part.find(b"\r\n\r\n")
            if header_end == -1:
                continue
            header_block = part[:header_end].decode("utf-8", errors="replace")
            body = part[header_end + 4:]
            if body.endswith(b"\r\n"):
                body = body[:-2]

            name_m = re.search(r'name="([^"]+)"', header_block)
            fname_m = re.search(r'filename="([^"]+)"', header_block)
            if not name_m:
                continue
            name = name_m.group(1)
            if fname_m:
                filename = fname_m.group(1)
            fields.setdefault(name, []).append(body)

        return fields, filename


def main():
    PUBLIC_THUMBS.mkdir(parents=True, exist_ok=True)
    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
    url = f"http://localhost:{PORT}"
    print(f"  Thumb & Embed Editor → {url}")
    print("  Press Ctrl+C to stop\n")
    threading.Timer(0.4, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped.")

if __name__ == "__main__":
    main()
