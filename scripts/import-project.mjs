#!/usr/bin/env node
// Imports a project package (JSON exported from the #/submit page) into the site:
// generates src/content/<Name>.jsx, saves the thumbnail, and appends an entry
// to src/data/projects.js.
//
// Usage:
//   npm run project:import -- <package.json> [--cohort "NYSN"] [--id 400] [--dry-run]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "src", "content");
const PROJECTS_FILE = path.join(ROOT, "src", "data", "projects.js");
const THUMBS_DIR = path.join(ROOT, "public", "thumbnails");

const TYPES = ["report", "data", "interactive", "events"];
const COHORT_RE = /^(Admin|NYSN|Intern|Microgrant \d{4})$/;
const IMAGE_MIMES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
const USAGE = `Usage:
  npm run project:import -- <project-package.json> [options]

Options:
  --cohort <value>  Admin | NYSN | Intern | Microgrant 20XX (default: NYSN)
  --id <number>     Override the automatically assigned project ID
  --dry-run         Validate and preview without writing files
  -h, --help        Show this help`;

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = { cohort: "NYSN", id: null, dryRun: false };
let pkgPath = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "-h" || args[i] === "--help") {
    console.log(USAGE);
    process.exit(0);
  }
  if (args[i] === "--cohort") {
    if (!args[i + 1]) fail("--cohort requires a value");
    flags.cohort = args[++i];
  }
  else if (args[i] === "--id") {
    if (!args[i + 1]) fail("--id requires a number");
    flags.id = Number(args[++i]);
    if (!Number.isSafeInteger(flags.id) || flags.id < 1) fail("--id must be a positive integer");
  }
  else if (args[i] === "--dry-run") flags.dryRun = true;
  else if (args[i].startsWith("--")) fail(`Unknown option: ${args[i]}\n\n${USAGE}`);
  else if (!pkgPath) pkgPath = args[i];
  else fail(`Unexpected argument: ${args[i]}`);
}
if (!pkgPath) fail(USAGE);

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

pkgPath = path.resolve(pkgPath);
if (!fs.existsSync(pkgPath) || !fs.statSync(pkgPath).isFile()) {
  fail(`Package file not found: ${pkgPath}`);
}

// ── Load & validate package ──────────────────────────────────────────────────
let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
} catch (e) {
  fail(`Could not read package: ${e.message}`);
}
if (!pkg || typeof pkg !== "object" || Array.isArray(pkg)) {
  fail("Project package must be a JSON object");
}

const isStr = (v) => typeof v === "string";
const httpsOnly = (u) => {
  try { return new URL(u).protocol === "https:"; } catch { return false; }
};

const errors = [];
if (pkg.packageVersion !== 1) errors.push(`Unsupported packageVersion: ${pkg.packageVersion}`);
if (!isStr(pkg.title) || !pkg.title.trim()) errors.push("Missing title");
if (pkg.title?.length > 200) errors.push("Title too long (max 200 chars)");
if (!TYPES.includes(pkg.type)) errors.push(`Invalid type: ${pkg.type} (expected ${TYPES.join("|")})`);
if (!isStr(pkg.category) || !pkg.category.trim()) errors.push("Missing category");
if (!isStr(pkg.description) || !pkg.description.trim()) errors.push("Missing description");
if (pkg.description?.length > 1000) errors.push("Description too long (max 1000 chars)");
if (!Array.isArray(pkg.tags) || pkg.tags.some((t) => !isStr(t) || !/^[a-z0-9-]{1,50}$/.test(t)))
  errors.push("tags must be an array of lowercase slug strings");
if (pkg.embed && (!isStr(pkg.embed) || !httpsOnly(pkg.embed))) errors.push("embed must be an https:// URL");
if (!Array.isArray(pkg.sections)) errors.push("sections must be an array");
else pkg.sections.forEach((s, i) => {
  if (!isStr(s.heading) || !isStr(s.body) || !s.body.trim()) errors.push(`Section ${i + 1} is invalid`);
  if (s.body?.length > 20000) errors.push(`Section ${i + 1} body too long`);
});
if (!Array.isArray(pkg.links)) errors.push("links must be an array");
else pkg.links.forEach((l, i) => {
  if (!isStr(l.label) || !isStr(l.url) || !httpsOnly(l.url)) errors.push(`Link ${i + 1}: label/https URL required`);
});
if (!pkg.embed && !pkg.sections?.some((s) => s.body?.trim())) errors.push("Package has no content (no sections, no embed)");
if (!COHORT_RE.test(flags.cohort)) errors.push(`Invalid --cohort "${flags.cohort}" (Admin | NYSN | Intern | Microgrant 20XX)`);

let thumbExt = null;
let thumbBuffer = null;
if (pkg.thumbnail) {
  const m = /^data:([a-z/+.-]+);base64,(.+)$/s.exec(pkg.thumbnail.dataUrl || "");
  if (!m || !IMAGE_MIMES[m[1]]) errors.push("Thumbnail must be a base64 data URL of type png/jpeg/webp/gif");
  else {
    thumbExt = IMAGE_MIMES[m[1]];
    thumbBuffer = Buffer.from(m[2], "base64");
    if (thumbBuffer.length > 2 * 1024 * 1024) errors.push("Thumbnail exceeds 2 MB");
  }
}

if (errors.length) {
  errors.forEach((e) => console.error(`✖ ${e}`));
  process.exit(1);
}

// ── Derived names ─────────────────────────────────────────────────────────────
const slug = pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const words = pkg.title.replace(/[^a-zA-Z0-9 ]+/g, " ").trim().split(/\s+/).slice(0, 5);
let baseName = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
if (!/^[A-Za-z]/.test(baseName)) baseName = `Project${baseName}`;
if (!baseName) baseName = "UntitledProject";

const projectsSrc = fs.readFileSync(PROJECTS_FILE, "utf8");
const titleLiteral = JSON.stringify(pkg.title.trim());
if (projectsSrc.includes(`title: ${titleLiteral},`)) {
  fail(`A project titled ${titleLiteral} already exists. This package may already have been imported.`);
}

let componentName = baseName;
for (let n = 2; fs.existsSync(path.join(CONTENT_DIR, `${componentName}.jsx`)) ||
                projectsSrc.includes(`const ${componentName} `); n++) {
  componentName = `${baseName}${n}`;
}

const usedIds = [...projectsSrc.matchAll(/^\s*id:\s*(\d+)\s*,/gm)].map((m) => parseInt(m[1], 10));
const id = flags.id ?? Math.max(0, ...usedIds) + 1;
if (usedIds.includes(id)) fail(`id ${id} is already in use`);

// ── Generate content component ────────────────────────────────────────────────
const escJsx = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");

const paragraphs = (body) =>
  body.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean)
    .map((p) => `        <p>${escJsx(p).replace(/\r?\n/g, "<br />")}</p>`).join("\n");

const sectionsJsx = [];
if (pkg.teamMembers?.trim()) {
  sectionsJsx.push(
`      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: ${escJsx(pkg.teamMembers.trim())}</p>
      </section>`);
}
for (const s of pkg.sections) {
  const heading = s.heading.trim() ? `        <h3>${escJsx(s.heading.trim())}</h3>\n` : "";
  sectionsJsx.push(
`      <section style={{ marginBottom: "1.5rem" }}>
${heading}${paragraphs(s.body)}
      </section>`);
}
if (pkg.links.length) {
  const items = pkg.links.map((l) =>
    `          <li><a href=${JSON.stringify(l.url)} target="_blank" rel="noopener noreferrer">${escJsx(l.label)}</a></li>`
  ).join("\n");
  sectionsJsx.push(
`      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Links</h3>
        <ul>
${items}
        </ul>
      </section>`);
}

const componentSrc = `import React from "react";

export default function ${componentName}() {
  return (
    <article style={{ lineHeight: 1.6 }}>

${sectionsJsx.join("\n\n")}
    </article>
  );
}
`;

// ── Thumbnail & entry ─────────────────────────────────────────────────────────
let imagePath = "";
let thumbFile = null;
if (thumbBuffer) {
  const baseThumbFile = `${slug}-thumbnail`;
  thumbFile = `${baseThumbFile}.${thumbExt}`;
  for (let n = 2; fs.existsSync(path.join(THUMBS_DIR, thumbFile)); n++) {
    thumbFile = `${baseThumbFile}-${n}.${thumbExt}`;
  }
  imagePath = `thumbnails/${thumbFile}`;
}

const entry = `
{
  id: ${id},
  title: ${JSON.stringify(pkg.title.trim())},
  type: ${JSON.stringify(pkg.type)},
  cohort: ${JSON.stringify(flags.cohort)},
  description:
    ${JSON.stringify(pkg.description.trim())},
  image: ${JSON.stringify(imagePath)},
  embed: ${JSON.stringify(pkg.embed || "")},
  tags: ${JSON.stringify(pkg.tags)},
  component: ${componentName},
  category: ${JSON.stringify(pkg.category.trim())},
},
`;

// ── Patch projects.js ─────────────────────────────────────────────────────────
const lazyLine = `const ${componentName} = lazy(() => import("../content/${componentName}"));`;
const lazyRe = /const \w+ = lazy\(\(\) => import\("\.\.\/content\/[\w/]+"\)\);/g;
let lastLazyEnd = -1;
for (const m of projectsSrc.matchAll(lazyRe)) lastLazyEnd = m.index + m[0].length;
if (lastLazyEnd === -1) fail("Could not find lazy import block in projects.js");

const arrayEnd = projectsSrc.lastIndexOf("\n];");
if (arrayEnd === -1) fail("Could not find end of projects array in projects.js");

const patched =
  projectsSrc.slice(0, lastLazyEnd) + "\n" + lazyLine +
  projectsSrc.slice(lastLazyEnd, arrayEnd) + entry +
  projectsSrc.slice(arrayEnd);

// ── Write ─────────────────────────────────────────────────────────────────────
console.log(`Project:   ${pkg.title.trim()}`);
console.log(`Component: src/content/${componentName}.jsx`);
console.log(`Entry:     id ${id}, cohort ${flags.cohort}, type ${pkg.type}`);
console.log(`Thumbnail: ${thumbFile ? `public/thumbnails/${thumbFile}` : "(none — set image manually)"}`);
if (pkg.submitterName || pkg.submitterEmail) console.log(`Submitter: ${pkg.submitterName} ${pkg.submitterEmail}`.trim());

if (flags.dryRun) {
  console.log("\n--dry-run: no files written. Generated component:\n");
  console.log(componentSrc);
  process.exit(0);
}

fs.writeFileSync(path.join(CONTENT_DIR, `${componentName}.jsx`), componentSrc);
if (thumbBuffer) {
  fs.mkdirSync(THUMBS_DIR, { recursive: true });
  fs.writeFileSync(path.join(THUMBS_DIR, thumbFile), thumbBuffer);
}
fs.writeFileSync(PROJECTS_FILE, patched);

console.log("\n✔ Imported. Next: review the diff, then run npm run lint and npm run build.");
