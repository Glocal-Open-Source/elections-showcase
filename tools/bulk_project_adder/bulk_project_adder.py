#!/usr/bin/env python3
"""Standalone bulk project export tool for the GLOCAL Showcase."""

from __future__ import annotations

import base64
import json
import os
import re
import subprocess
import sys
import threading
import webbrowser
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


BASE = Path(__file__).resolve().parent
EXPORTS = BASE / "exports"

TAGS = [
    "elections-canada",
    "civic-tech",
    "civic-education",
    "civic-engagement",
    "governance",
    "federalism",
    "data-analysis",
    "data-visualization",
    "open-data",
    "democracy-research",
    "statistics-canada",
    "youth-engagement",
    "housing-policy",
    "indigenous-engagement",
    "events",
    "outreach",
    "archive",
]

TYPES = ["data", "report", "interactive", "events"]


def now_stamp() -> str:
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def slugify(value: str, fallback: str = "project") -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value or fallback


def safe_filename(name: str, fallback: str) -> str:
    raw = Path(name or fallback)
    stem = slugify(raw.stem, Path(fallback).stem)
    suffix = re.sub(r"[^a-zA-Z0-9.]", "", raw.suffix)[:16]
    return f"{stem}{suffix.lower()}"


def unique_path(path: Path) -> Path:
    if not path.exists():
        return path
    i = 2
    while True:
        candidate = path.with_name(f"{path.stem}-{i}{path.suffix}")
        if not candidate.exists():
            return candidate
        i += 1


def write_data_url(file_info: dict, dest_dir: Path, fallback_name: str) -> dict | None:
    data_url = (file_info or {}).get("dataUrl", "")
    name = (file_info or {}).get("name", "")
    if not data_url or "," not in data_url:
        return None

    header, encoded = data_url.split(",", 1)
    if ";base64" not in header:
        return None

    dest_dir.mkdir(parents=True, exist_ok=True)
    filename = safe_filename(name, fallback_name)
    dest = unique_path(dest_dir / filename)
    dest.write_bytes(base64.b64decode(encoded))
    return {
        "path": dest.relative_to(dest_dir.parent.parent).as_posix(),
        "originalName": name,
        "size": dest.stat().st_size,
    }


def open_folder(path: Path) -> None:
    path = path.resolve()
    if sys.platform.startswith("win"):
        os.startfile(str(path))  # type: ignore[attr-defined]
    elif sys.platform == "darwin":
        subprocess.Popen(["open", str(path)])
    else:
        subprocess.Popen(["xdg-open", str(path)])


def build_manifest(payload: dict) -> tuple[Path, dict]:
    EXPORTS.mkdir(exist_ok=True)
    package_dir = unique_path(EXPORTS / f"project-export-{now_stamp()}")
    assets_dir = package_dir / "assets"
    thumbs_dir = assets_dir / "thumbnails"
    content_dir = assets_dir / "content"
    package_dir.mkdir(parents=True)

    projects = []
    for index, item in enumerate(payload.get("projects", []), start=1):
        title = str(item.get("title", "")).strip()
        if not title:
            continue

        project_slug = slugify(title, f"project-{index}")
        thumbnail = write_data_url(
            item.get("thumbnailFile"),
            thumbs_dir,
            f"{project_slug}-thumbnail",
        )
        embed_file = write_data_url(
            item.get("embedFile"),
            content_dir,
            f"{project_slug}-content",
        )

        tags = []
        for tag in item.get("tags", []):
            clean = slugify(str(tag), "")
            if clean and clean not in tags:
                tags.append(clean)

        sections = []
        for section in item.get("sections", []):
            heading = str(section.get("heading", "")).strip()
            body = str(section.get("body", "")).strip()
            if heading or body:
                sections.append({"heading": heading, "body": body})

        projects.append(
            {
                "title": title,
                "type": item.get("type") if item.get("type") in TYPES else "data",
                "description": str(item.get("description", "")).strip(),
                "team": str(item.get("team", "")).strip(),
                "tags": tags,
                "thumbnail": thumbnail
                or {
                    "url": str(item.get("thumbnailUrl", "")).strip(),
                    "credit": str(item.get("thumbnailCredit", "")).strip(),
                },
                "embed": {
                    "kind": "file" if embed_file else "url",
                    "path": embed_file["path"] if embed_file else "",
                    "url": str(item.get("embedUrl", "")).strip() if not embed_file else "",
                    "originalName": embed_file["originalName"] if embed_file else "",
                },
                "useCustomPage": bool(item.get("useCustomPage")),
                "sections": sections,
                "notes": str(item.get("notes", "")).strip(),
            }
        )

    manifest = {
        "schemaVersion": 1,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "source": "GLOCAL bulk project adder",
        "projectCount": len(projects),
        "projects": projects,
    }

    (package_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )
    (package_dir / "README.txt").write_text(
        "This folder is a GLOCAL Showcase project export package.\n\n"
        "Keep manifest.json and the assets folder together. The showcase importer "
        "needs the complete package folder to add the projects and copy files.\n",
        encoding="utf-8",
    )
    return package_dir, manifest


APP_HTML = r"""
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bulk Project Adder</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #111827;
      --muted: #6b7280;
      --line: #e5e7eb;
      --soft: #f9fafb;
      --panel: #ffffff;
      --accent: #2563eb;
      --accent-light: #eff6ff;
      --green: #059669;
      --danger: #dc2626;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f1f5f9; color: var(--ink); }
    button, input, textarea, select { font: inherit; }
    button {
      border: 1px solid var(--line);
      background: #fff;
      color: var(--ink);
      min-height: 36px;
      border-radius: 6px;
      padding: 0 12px;
      cursor: pointer;
      transition: border-color .12s, background .12s;
    }
    button:hover { border-color: #9ca3af; background: var(--soft); }
    button.primary { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 600; }
    button.primary:hover { background: #1d4ed8; border-color: #1d4ed8; }
    button.danger { color: var(--danger); }
    button.danger:hover { background: #fef2f2; border-color: #fca5a5; }
    .shell { display: grid; grid-template-columns: 288px minmax(0, 1fr); min-height: 100vh; }
    aside {
      border-right: 1px solid #1e293b;
      background: #0f172a;
      color: #fff;
      padding: 20px;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
    .brand { font-size: 1rem; font-weight: 700; letter-spacing: -.01em; margin-bottom: 20px; }
    .brand span { display: block; font-size: .75rem; font-weight: 400; color: #64748b; margin-top: 2px; letter-spacing: 0; }
    .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
    .metric { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09); border-radius: 8px; padding: 10px 12px; }
    .metric strong { display: block; font-size: 1.5rem; font-weight: 700; line-height: 1; }
    .metric span { color: #64748b; font-size: .72rem; margin-top: 4px; display: block; }
    .side-section { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #334155; margin: 14px 0 6px; }
    .side-list { display: grid; gap: 3px; flex: 1; overflow: auto; }
    .side-item {
      border: 1px solid transparent;
      background: transparent;
      color: #94a3b8;
      text-align: left;
      height: auto;
      padding: 8px 10px;
      border-radius: 6px;
      transition: background .1s, color .1s;
    }
    .side-item:hover { background: rgba(255,255,255,.06); color: #e2e8f0; border-color: rgba(255,255,255,.08); }
    .side-item.active { background: rgba(255,255,255,.09); color: #fff; border-color: rgba(255,255,255,.14); border-left: 2px solid #60a5fa; padding-left: 9px; }
    .side-title { display: block; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .85rem; }
    .side-meta { display: block; color: inherit; opacity: .6; font-size: .73rem; margin-top: 2px; }
    .csv-box {
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
    }
    .csv-label { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #475569; margin-bottom: 8px; }
    .csv-box button { width: 100%; margin-bottom: 6px; font-size: .82rem; }
    .csv-file-input {
      color: #94a3b8;
      border: 1px dashed rgba(255,255,255,.16);
      background: rgba(255,255,255,.03);
      border-radius: 6px;
      padding: 7px 8px;
      width: 100%;
      font-size: .78rem;
      cursor: pointer;
    }
    .csv-status { color: #64748b; font-size: .73rem; min-height: 16px; margin-top: 4px; display: block; }
    .side-actions { display: grid; gap: 6px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,.07); margin-top: 4px; }
    .side-actions button { width: 100%; font-size: .82rem; }
    .folder-input {
      color: #94a3b8;
      border: 1px dashed rgba(255,255,255,.16);
      background: rgba(255,255,255,.03);
      border-radius: 6px;
      padding: 7px 8px;
      width: 100%;
      font-size: .78rem;
      cursor: pointer;
    }
    main { padding: 24px; overflow: auto; }
    .topbar { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 16px; }
    h1 { margin: 0; font-size: 1.3rem; font-weight: 700; letter-spacing: -.02em; }
    .muted { color: var(--muted); font-size: .83rem; margin-top: 3px; }
    .panel { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 16px 18px; margin-bottom: 10px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
    .panel-head { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #9ca3af; margin-bottom: 14px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .field { display: grid; gap: 5px; min-width: 0; }
    .field.full { grid-column: 1 / -1; }
    label { font-weight: 600; font-size: .82rem; color: #374151; }
    input, textarea, select {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #fff;
      color: var(--ink);
      padding: 8px 10px;
      transition: border-color .1s, box-shadow .1s;
      font-size: .88rem;
    }
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(37,99,235,.1);
    }
    textarea { min-height: 88px; resize: vertical; line-height: 1.5; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .tag { min-height: 28px; border-radius: 999px; border: 1px solid var(--line); background: var(--soft); padding: 0 10px; font-size: .8rem; transition: all .1s; }
    .tag:hover { border-color: #bfdbfe; background: #f0f7ff; }
    .tag.active { background: var(--accent-light); border-color: #93c5fd; color: var(--accent); font-weight: 600; }
    .tag-row { display: flex; gap: 8px; align-items: center; margin-top: 10px; }
    .tag-row input { max-width: 240px; }
    .sections { display: grid; gap: 10px; }
    .section { border: 1px solid var(--line); border-radius: 8px; padding: 14px; background: var(--soft); }
    .section-head { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 10px; align-items: center; }
    .section-head strong { font-size: .88rem; }
    .fileline { display: grid; gap: 6px; border: 1.5px dashed #d1d5db; border-radius: 8px; padding: 12px; background: var(--soft); }
    .pexels-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; margin-top: 8px; }
    .pexels-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 8px; margin-top: 8px; }
    .pexels-card { height: 76px; padding: 0; overflow: hidden; border-radius: 6px; background: #e5e7eb; }
    .pexels-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .checks { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .checks input { width: auto; }
    .checks label { font-weight: 400; font-size: .88rem; color: var(--ink); }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      position: sticky;
      bottom: 0;
      background: rgba(241,245,249,.95);
      border-top: 1px solid var(--line);
      padding: 12px 0 0;
      backdrop-filter: blur(8px);
    }
    .footer-actions { display: flex; gap: 8px; align-items: center; }
    dialog { border: 1px solid var(--line); border-radius: 12px; max-width: 480px; padding: 0; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
    dialog::backdrop { background: rgba(15,23,42,.4); }
    .modal-head { padding: 20px 20px 0; }
    .modal-head h2 { margin: 0 0 4px; font-size: 1.1rem; }
    .modal-body { padding: 10px 20px 16px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid var(--line); padding: 12px 20px; background: var(--soft); border-radius: 0 0 12px 12px; }
    .toast { color: var(--green); font-weight: 600; min-height: 24px; font-size: .85rem; }
    @media (max-width: 820px) {
      .shell { grid-template-columns: 1fr; }
      aside { position: relative; height: auto; }
      .grid { grid-template-columns: 1fr; }
      .topbar, .footer { align-items: stretch; flex-direction: column; }
      .topbar button, .footer button { width: 100%; }
      .footer-actions { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <aside>
      <div class="brand">
        Bulk Project Adder
        <span>GLOCAL Showcase</span>
      </div>

      <div class="summary">
        <div class="metric"><strong id="count">0</strong><span>projects</span></div>
        <div class="metric"><strong id="tagCount">0</strong><span>unique tags</span></div>
      </div>

      <button id="addProjectBtn" class="primary">+ New project</button>

      <div class="side-section">CSV import</div>
      <div class="csv-box">
        <div class="csv-label">Bulk import</div>
        <button id="downloadTemplateBtn">Download template</button>
        <input id="csvFile" class="csv-file-input" type="file" accept=".csv,text/csv" />
        <span id="csvStatus" class="csv-status"></span>
      </div>

      <div class="side-section">Projects</div>
      <div id="projectList" class="side-list"></div>

      <div class="side-section">Import previous export</div>
      <div class="side-actions">
        <input id="exportFolder" class="folder-input" type="file" webkitdirectory directory multiple />
        <button id="openLastBtn" disabled>Open export folder</button>
        <button id="clearDraftBtn">Clear draft</button>
      </div>
    </aside>

    <main>
      <div class="topbar">
        <div>
          <h1 id="formTitle">Project</h1>
          <div class="muted" id="saveState">Draft saves in this browser.</div>
        </div>
        <button id="duplicateBtn">Duplicate</button>
      </div>

      <form id="projectForm">
        <section class="panel">
          <div class="panel-head">Core info</div>
          <div class="grid">
            <div class="field">
              <label for="title">Title *</label>
              <input id="title" required placeholder="Project name" />
            </div>
            <div class="field">
              <label for="type">Type *</label>
              <select id="type"></select>
            </div>
            <div class="field full">
              <label for="description">Description *</label>
              <textarea id="description" required placeholder="One or two sentences describing the project."></textarea>
            </div>
            <div class="field">
              <label for="team">Team members</label>
              <input id="team" placeholder="First Last | Second Last" />
            </div>
            <div class="field">
              <label for="embedUrl">Embed URL</label>
              <input id="embedUrl" placeholder="https://..." />
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">Files</div>
          <div class="grid">
            <div class="field">
              <label for="thumbnailFile">Thumbnail image</label>
              <div class="fileline">
                <input id="thumbnailFile" type="file" accept="image/*" />
                <span class="muted" id="thumbnailName">No file selected</span>
                <div class="pexels-row">
                  <input id="pexelsKey" type="password" placeholder="Pexels API key" />
                  <input id="pexelsQuery" placeholder="Search thumbnails" />
                  <button id="pexelsSearchBtn" type="button">Find on Pexels</button>
                </div>
                <a class="muted" href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Photo search by Pexels</a>
                <div id="pexelsResults" class="pexels-results"></div>
              </div>
            </div>
            <div class="field">
              <label for="embedFile">PDF, video, HTML, or other</label>
              <div class="fileline">
                <input id="embedFile" type="file" />
                <span class="muted" id="embedName">No file selected</span>
              </div>
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">Tags</div>
          <div id="tags" class="tags"></div>
          <div class="tag-row">
            <input id="customTag" placeholder="custom-tag" />
            <button type="button" id="addTagBtn">Add tag</button>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">Overview page</div>
          <div class="checks">
            <label><input id="useCustomPage" type="checkbox" /> Create overview page</label>
            <button type="button" id="addSectionBtn">+ Add section</button>
          </div>
          <div id="sections" class="sections" style="margin-top: 12px;"></div>
        </section>

        <section class="panel">
          <div class="panel-head">Notes</div>
          <div class="field">
            <label for="notes">Internal notes</label>
            <textarea id="notes" placeholder="Notes for Daniel (not shown publicly)."></textarea>
          </div>
        </section>
      </form>

      <div class="footer">
        <div class="toast" id="toast"></div>
        <div class="footer-actions">
          <button id="deleteBtn" class="danger">Delete project</button>
          <button id="exportBtn" class="primary">Create export package</button>
        </div>
      </div>
    </main>
  </div>

  <dialog id="doneDialog">
    <div class="modal-head">
      <h2>Export package created</h2>
    </div>
    <div class="modal-body">
      <p id="doneText" style="margin:0 0 8px;"></p>
      <p class="muted" style="margin:0;">Keep the complete folder together. It contains the project list and any selected files.</p>
    </div>
    <div class="modal-actions">
      <button id="modalClose">Close</button>
      <button id="modalOpen" class="primary">Open package folder</button>
    </div>
  </dialog>

  <script>
    const PRESET_TAGS = __TAGS__;
    const TYPES = __TYPES__;
    const CSV_COLUMNS = [
      "title", "type", "description", "team", "embedUrl", "thumbnailUrl", "tags", "useCustomPage",
      "section1Heading", "section1Body", "section2Heading", "section2Body",
      "section3Heading", "section3Body", "notes"
    ];
    const STORAGE_KEY = "glocal-bulk-projects-v1";

    let state = loadDraft();
    let activeId = state.projects[0]?.id || null;
    let lastExportPath = "";

    const $ = (id) => document.getElementById(id);
    const fields = ["title", "type", "description", "team", "embedUrl", "useCustomPage", "notes"];

    function freshProject() {
      return {
        id: crypto.randomUUID(),
        title: "",
        type: "data",
        description: "",
        team: "",
        embedUrl: "",
        thumbnailUrl: "",
        thumbnailCredit: "",
        tags: [],
        sections: [],
        useCustomPage: false,
        notes: "",
        thumbnailFile: null,
        embedFile: null
      };
    }

    function isBlankProject(project) {
      return !project.title && !project.description && !project.team && !project.embedUrl &&
        !project.thumbnailUrl && !project.notes && project.tags.length === 0 && project.sections.length === 0 &&
        !project.thumbnailFile && !project.embedFile;
    }

    function loadDraft() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (saved?.projects?.length) return saved;
      } catch (_) {}
      return { projects: [freshProject()] };
    }

    function saveDraft() {
      const copy = {
        projects: state.projects.map(({ thumbnailFile, embedFile, ...rest }) => rest)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
      $("saveState").textContent = "Draft saved locally.";
    }

    function activeProject() {
      return state.projects.find((p) => p.id === activeId) || state.projects[0];
    }

    function slugify(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    function allTags() {
      const set = new Set(PRESET_TAGS);
      state.projects.forEach((p) => (p.tags || []).forEach((tag) => set.add(tag)));
      return [...set].sort((a, b) => a.localeCompare(b));
    }

    function render() {
      const project = activeProject();
      $("count").textContent = state.projects.length;
      $("tagCount").textContent = new Set(state.projects.flatMap((p) => p.tags)).size;
      $("formTitle").textContent = project.title || "Untitled project";

      $("projectList").innerHTML = "";
      state.projects.forEach((p, index) => {
        const btn = document.createElement("button");
        btn.className = "side-item" + (p.id === activeId ? " active" : "");
        btn.type = "button";
        btn.innerHTML = `<span class="side-title">${escapeHtml(p.title || `Project ${index + 1}`)}</span><span class="side-meta">${escapeHtml(p.type || "data")} &middot; ${(p.tags || []).length} tags</span>`;
        btn.onclick = () => { activeId = p.id; render(); };
        $("projectList").appendChild(btn);
      });

      fields.forEach((id) => {
        const el = $(id);
        if (el.type === "checkbox") el.checked = Boolean(project[id]);
        else el.value = project[id] || "";
      });
      $("thumbnailName").textContent = project.thumbnailFile?.name || project.thumbnailCredit || (project.thumbnailUrl ? "Pexels thumbnail selected" : "No file selected");
      $("embedName").textContent = project.embedFile?.name || "No file selected";

      $("tags").innerHTML = "";
      allTags().forEach((tag) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tag" + (project.tags.includes(tag) ? " active" : "");
        btn.textContent = tag;
        btn.onclick = () => toggleTag(tag);
        $("tags").appendChild(btn);
      });

      $("sections").innerHTML = "";
      project.sections.forEach((section, index) => {
        const wrap = document.createElement("div");
        wrap.className = "section";
        wrap.innerHTML = `
          <div class="section-head">
            <strong>Section ${index + 1}</strong>
            <button type="button" class="danger">Remove</button>
          </div>
          <div class="grid">
            <div class="field full">
              <label>Heading</label>
              <input data-section="${index}" data-key="heading" value="${escapeAttr(section.heading || "")}" />
            </div>
            <div class="field full">
              <label>Content</label>
              <textarea data-section="${index}" data-key="body">${escapeHtml(section.body || "")}</textarea>
            </div>
          </div>
        `;
        wrap.querySelector("button").onclick = () => {
          project.sections.splice(index, 1);
          saveDraft();
          render();
        };
        wrap.querySelectorAll("[data-section]").forEach((input) => {
          input.oninput = () => {
            project.sections[index][input.dataset.key] = input.value;
            saveDraft();
          };
        });
        $("sections").appendChild(wrap);
      });
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[ch]));
    }

    function escapeAttr(value) {
      return escapeHtml(value).replace(/`/g, "&#96;");
    }

    function bind() {
      TYPES.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        $("type").appendChild(option);
      });

      fields.forEach((id) => {
        $(id).addEventListener("input", () => {
          const p = activeProject();
          p[id] = $(id).type === "checkbox" ? $(id).checked : $(id).value;
          saveDraft();
          if (id === "title" || id === "type") render();
        });
      });

      $("thumbnailFile").onchange = () => {
        const project = activeProject();
        project.thumbnailFile = $("thumbnailFile").files[0] || null;
        if (project.thumbnailFile) {
          project.thumbnailUrl = "";
          project.thumbnailCredit = "";
        }
        render();
      };
      $("embedFile").onchange = () => {
        activeProject().embedFile = $("embedFile").files[0] || null;
        render();
      };
      $("addProjectBtn").onclick = () => {
        const p = freshProject();
        state.projects.push(p);
        activeId = p.id;
        saveDraft();
        render();
      };
      $("duplicateBtn").onclick = () => {
        const source = activeProject();
        const copy = JSON.parse(JSON.stringify({ ...source, thumbnailFile: null, embedFile: null }));
        copy.id = crypto.randomUUID();
        copy.title = copy.title ? `${copy.title} copy` : "";
        state.projects.push(copy);
        activeId = copy.id;
        saveDraft();
        render();
      };
      $("deleteBtn").onclick = () => {
        if (state.projects.length === 1) {
          state.projects = [freshProject()];
        } else {
          state.projects = state.projects.filter((p) => p.id !== activeId);
        }
        activeId = state.projects[0].id;
        saveDraft();
        render();
      };
      $("addSectionBtn").onclick = () => {
        const p = activeProject();
        p.useCustomPage = true;
        p.sections.push({ heading: "", body: "" });
        saveDraft();
        render();
      };
      $("addTagBtn").onclick = addCustomTag;
      $("downloadTemplateBtn").onclick = downloadCsvTemplate;
      $("csvFile").onchange = importCsvFile;
      $("exportFolder").onchange = importExportFolder;
      $("pexelsSearchBtn").onclick = searchPexels;
      $("pexelsKey").value = localStorage.getItem("glocal-pexels-key") || "";
      $("pexelsKey").oninput = () => localStorage.setItem("glocal-pexels-key", $("pexelsKey").value.trim());
      $("customTag").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          addCustomTag();
        }
      });
      $("clearDraftBtn").onclick = () => {
        localStorage.removeItem(STORAGE_KEY);
        state = { projects: [freshProject()] };
        activeId = state.projects[0].id;
        render();
      };
      $("exportBtn").onclick = exportPackage;
      $("openLastBtn").onclick = () => openPath(lastExportPath);
      $("modalOpen").onclick = () => openPath(lastExportPath);
      $("modalClose").onclick = () => $("doneDialog").close();
    }

    function toggleTag(tag) {
      const p = activeProject();
      p.tags = p.tags.includes(tag) ? p.tags.filter((t) => t !== tag) : [...p.tags, tag];
      saveDraft();
      render();
    }

    function addCustomTag() {
      const tag = slugify($("customTag").value);
      if (!tag) return;
      if (!activeProject().tags.includes(tag)) activeProject().tags.push(tag);
      $("customTag").value = "";
      saveDraft();
      render();
    }

    function csvEscape(value) {
      const text = String(value ?? "");
      return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    }

    function downloadCsvTemplate() {
      const rows = [
        CSV_COLUMNS,
        [
          "Electoral Map 2024",
          "data",
          "Interactive map of federal electoral districts with 2024 results and demographic overlays.",
          "Sarah Chen|Marcus Webb",
          "https://example.com/map",
          "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
          "elections-canada|data-visualization|open-data",
          "no",
          "", "", "", "", "", "",
          ""
        ],
        [
          "Youth Civic Engagement Report",
          "report",
          "Annual study examining political participation among Canadians aged 18-30, covering voting rates and civic knowledge.",
          "Priya Nair",
          "",
          "",
          "youth-engagement|democracy-research|civic-education",
          "yes",
          "Key Findings",
          "Participation rates rose 12% in the 18-24 age group compared to the previous election cycle.",
          "Methodology",
          "Online survey of 2,400 respondents stratified by province and age group.",
          "", "",
          "PDF will be attached separately."
        ],
        [
          "Vote Match Quiz",
          "interactive",
          "Policy matching tool that helps voters compare their views with federal party platforms.",
          "Daniel Biel",
          "https://example.com/votematch",
          "",
          "civic-engagement|elections-canada",
          "no",
          "", "", "", "", "", "",
          ""
        ]
      ];
      const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n") + "\n";
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "glocal-project-template.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function parseCsv(text) {
      const rows = [];
      let row = [];
      let cell = "";
      let quoted = false;
      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];
        const next = text[i + 1];
        if (quoted) {
          if (ch === '"' && next === '"') {
            cell += '"';
            i += 1;
          } else if (ch === '"') {
            quoted = false;
          } else {
            cell += ch;
          }
        } else if (ch === '"') {
          quoted = true;
        } else if (ch === ",") {
          row.push(cell);
          cell = "";
        } else if (ch === "\n") {
          row.push(cell);
          rows.push(row);
          row = [];
          cell = "";
        } else if (ch !== "\r") {
          cell += ch;
        }
      }
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      return rows;
    }

    function csvProjectFromRow(headers, row) {
      const get = (name) => {
        const idx = headers.indexOf(name.toLowerCase());
        return idx >= 0 ? String(row[idx] || "").trim() : "";
      };
      const title = get("title");
      if (!title) return null;
      const tags = get("tags")
        .split(/[|;]/)
        .map(slugify)
        .filter(Boolean);
      const sections = [];
      for (let i = 1; i <= 3; i += 1) {
        const heading = get(`section${i}heading`);
        const body = get(`section${i}body`);
        if (heading || body) sections.push({ heading, body });
      }
      const type = TYPES.includes(get("type")) ? get("type") : "data";
      return {
        ...freshProject(),
        title,
        type,
        description: get("description"),
        team: get("team"),
        embedUrl: get("embedurl"),
        thumbnailUrl: get("thumbnailurl"),
        thumbnailCredit: get("thumbnailurl") ? "CSV thumbnail URL" : "",
        tags: [...new Set(tags)],
        sections,
        useCustomPage: /^(1|true|yes|y)$/i.test(get("usecustompage")) || sections.length > 0,
        notes: get("notes")
      };
    }

    async function importCsvFile() {
      const file = $("csvFile").files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const rows = parseCsv(text);
        if (rows.length < 2) {
          $("csvStatus").textContent = "No project rows found.";
          return;
        }
        const headers = rows[0].map((header) => header.trim().toLowerCase());
        const imported = rows.slice(1)
          .map((row) => csvProjectFromRow(headers, row))
          .filter(Boolean);
        if (!imported.length) {
          $("csvStatus").textContent = "No rows had a title.";
          return;
        }
        if (state.projects.length === 1 && isBlankProject(state.projects[0])) {
          state.projects = imported;
        } else {
          state.projects.push(...imported);
        }
        activeId = imported[0].id;
        saveDraft();
        render();
        $("csvStatus").textContent = `Imported ${imported.length} row${imported.length === 1 ? "" : "s"}.`;
      } catch (error) {
        $("csvStatus").textContent = "Could not read that CSV file.";
      } finally {
        $("csvFile").value = "";
      }
    }

    function normalizePath(path) {
      return String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
    }

    function fileMapFromList(files, basePrefix = "") {
      const map = new Map();
      files.forEach((file) => {
        const rel = normalizePath(file.webkitRelativePath || file.name);
        const clean = basePrefix && rel.startsWith(basePrefix) ? rel.slice(basePrefix.length) : rel;
        map.set(clean, file);
      });
      return map;
    }

    function dataUrlToFile(fileInfo, fallbackName) {
      if (!fileInfo?.dataUrl) return null;
      const [header, encoded] = fileInfo.dataUrl.split(",");
      const mime = /data:([^;]+)/.exec(header)?.[1] || "application/octet-stream";
      const bytes = atob(encoded);
      const buffer = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i += 1) buffer[i] = bytes.charCodeAt(i);
      return new File([buffer], fileInfo.name || fallbackName, { type: mime });
    }

    function projectFromManifestProject(project, fileMap) {
      const out = {
        ...freshProject(),
        title: project.title || "",
        type: TYPES.includes(project.type) ? project.type : "data",
        description: project.description || "",
        team: project.team || "",
        tags: [...new Set((project.tags || []).map(slugify).filter(Boolean))],
        sections: Array.isArray(project.sections) ? project.sections : [],
        useCustomPage: Boolean(project.useCustomPage || project.sections?.length),
        notes: project.notes || ""
      };
      const thumb = project.thumbnail || {};
      if (thumb.dataUrl) out.thumbnailFile = dataUrlToFile(thumb, "thumbnail");
      else if (thumb.path) out.thumbnailFile = fileMap.get(normalizePath(thumb.path)) || null;
      else if (thumb.url) {
        out.thumbnailUrl = thumb.url;
        out.thumbnailCredit = thumb.credit || "Imported thumbnail URL";
      }
      const embed = project.embed || {};
      if (embed.kind === "file" && embed.file?.dataUrl) out.embedFile = dataUrlToFile(embed.file, "content-file");
      else if (embed.kind === "file" && embed.path) out.embedFile = fileMap.get(normalizePath(embed.path)) || null;
      else out.embedUrl = embed.url || "";
      return out;
    }

    async function importExportFolder() {
      const files = Array.from($("exportFolder").files || []);
      if (!files.length) return;
      const manifestFile = files.find((file) => normalizePath(file.webkitRelativePath || file.name).endsWith("manifest.json"));
      if (!manifestFile) {
        $("toast").textContent = "No manifest.json found in that folder.";
        $("exportFolder").value = "";
        return;
      }
      try {
        const manifestPath = normalizePath(manifestFile.webkitRelativePath || manifestFile.name);
        const basePrefix = manifestPath.slice(0, manifestPath.length - "manifest.json".length);
        const fileMap = fileMapFromList(files, basePrefix);
        const manifest = JSON.parse(await manifestFile.text());
        const imported = (manifest.projects || []).map((project) => projectFromManifestProject(project, fileMap));
        if (!imported.length) {
          $("toast").textContent = "That manifest did not contain projects.";
          return;
        }
        if (state.projects.length === 1 && isBlankProject(state.projects[0])) state.projects = imported;
        else state.projects.push(...imported);
        activeId = imported[0].id;
        saveDraft();
        render();
        $("toast").textContent = `Imported ${imported.length} project${imported.length === 1 ? "" : "s"} from folder.`;
      } catch (error) {
        $("toast").textContent = "Could not import that export folder.";
      } finally {
        $("exportFolder").value = "";
      }
    }

    async function searchPexels() {
      const key = $("pexelsKey").value.trim();
      const query = $("pexelsQuery").value.trim() || activeProject().title || activeProject().tags.join(" ");
      if (!key || !query) {
        $("toast").textContent = "Pexels key and search text are required.";
        return;
      }
      $("pexelsResults").innerHTML = "";
      $("toast").textContent = "Searching Pexels...";
      try {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape`;
        const res = await fetch(url, { headers: { Authorization: key } });
        if (!res.ok) throw new Error("Pexels search failed");
        const data = await res.json();
        const photos = data.photos || [];
        if (!photos.length) {
          $("toast").textContent = "No Pexels results found.";
          return;
        }
        photos.forEach((photo) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "pexels-card";
          btn.title = `Use photo by ${photo.photographer}`;
          btn.innerHTML = `<img src="${escapeAttr(photo.src.tiny || photo.src.small)}" alt="">`;
          btn.onclick = () => {
            const project = activeProject();
            project.thumbnailUrl = photo.src.landscape || photo.src.large || photo.src.original;
            project.thumbnailCredit = `Photo by ${photo.photographer} on Pexels`;
            project.thumbnailFile = null;
            saveDraft();
            render();
            $("toast").textContent = "Pexels thumbnail selected.";
          };
          $("pexelsResults").appendChild(btn);
        });
        $("toast").textContent = "Choose a Pexels thumbnail.";
      } catch (error) {
        $("toast").textContent = "Pexels search failed. Check the API key.";
      }
    }

    function validate() {
      const bad = state.projects.find((p) => !p.title.trim() || !p.description.trim());
      if (bad) {
        activeId = bad.id;
        render();
        $("toast").textContent = "Title and description are required.";
        return false;
      }
      return true;
    }

    async function fileToPayload(file) {
      if (!file) return null;
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return { name: file.name, type: file.type, size: file.size, dataUrl };
    }

    async function exportPackage() {
      if (!validate()) return;
      $("toast").textContent = "Creating package...";
      const projects = [];
      for (const p of state.projects) {
        const thumbnailFile = await fileToPayload(p.thumbnailFile);
        projects.push({
          ...p,
          thumbnailFile,
          embedFile: await fileToPayload(p.embedFile)
        });
      }
      const res = await fetch("/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects })
      });
      const out = await res.json();
      if (!res.ok) {
        $("toast").textContent = out.error || "Export failed.";
        return;
      }
      lastExportPath = out.path;
      $("openLastBtn").disabled = false;
      $("toast").textContent = `Created ${out.projectCount} project export.`;
      $("doneText").textContent = `Package folder: ${out.name}`;
      $("doneDialog").showModal();
    }

    async function openPath(path) {
      if (!path) return;
      await fetch("/open-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path })
      });
    }

    bind();
    render();
  </script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    server_version = "BulkProjectAdder/1.0"

    def log_message(self, fmt: str, *args: object) -> None:
        return

    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        return json.loads(raw.decode("utf-8")) if raw else {}

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/":
            html = APP_HTML.replace("__TAGS__", json.dumps(TAGS)).replace(
                "__TYPES__", json.dumps(TYPES)
            )
            body = html.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if parsed.path == "/open-exports":
            open_folder(EXPORTS)
            self.send_json(200, {"ok": True})
            return

        self.send_error(404)

    def do_POST(self) -> None:
        try:
            if self.path == "/export":
                package_dir, manifest = build_manifest(self.read_json())
                self.send_json(
                    200,
                    {
                        "ok": True,
                        "path": str(package_dir),
                        "name": package_dir.name,
                        "projectCount": manifest["projectCount"],
                    },
                )
                return

            if self.path == "/open-folder":
                payload = self.read_json()
                requested = Path(str(payload.get("path", ""))).resolve()
                exports_root = EXPORTS.resolve()
                if exports_root != requested and exports_root not in requested.parents:
                    self.send_json(400, {"error": "Folder is outside the exports directory."})
                    return
                if not requested.exists():
                    self.send_json(404, {"error": "Folder does not exist."})
                    return
                open_folder(requested)
                self.send_json(200, {"ok": True})
                return

            self.send_error(404)
        except Exception as exc:  # noqa: BLE001
            self.send_json(500, {"error": str(exc)})


def main() -> None:
    EXPORTS.mkdir(exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    host, port = server.server_address
    url = f"http://{host}:{port}/"
    print(f"Bulk Project Adder running at {url}")
    print("Close this window when you are done.")
    threading.Timer(0.4, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
