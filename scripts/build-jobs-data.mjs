#!/usr/bin/env node
// Converts scripts/scraped_jobs.csv (written by scripts/scrape_jobs.py) into
// src/data/jobs.js so the #/jobs-board page can render it as static data.
//
// Usage:
//   node scripts/build-jobs-data.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSV_PATH = path.join(ROOT, "scripts", "scraped_jobs.csv");
const OUT_PATH = path.join(ROOT, "src", "data", "jobs.js");

// ── Minimal RFC4180 CSV parser (handles quoted fields, embedded commas,
//    embedded newlines, and "" escaped quotes) ───────────────────────────────
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') { inQuotes = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\r") continue;
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }

  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
}

if (!fs.existsSync(CSV_PATH)) {
  console.error(`✖ Not found: ${CSV_PATH}`);
  process.exit(1);
}

// ── Date normalization ────────────────────────────────────────────────────
// Different government sources hand back closing dates in wildly different
// shapes: ISO ("2026-07-31"), "29-Jul-26", "August 28, 2026", "8/4/2026", or
// embedded in a longer string like "Friday, August 7, 2026 11:59 pm EDT".
// Everything funnels through here so the UI only ever sees one format.
const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseLooseDate(raw) {
  const s = (raw || "").trim();
  if (!s || /^n\/a$/i.test(s)) return null;

  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/); // ISO: 2026-07-31
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));

  m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/); // 29-Jul-26
  if (m && MONTHS[m[2].toLowerCase()] !== undefined) {
    return new Date(2000 + Number(m[3]), MONTHS[m[2].toLowerCase()], Number(m[1]));
  }

  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // 8/4/2026 (M/D/YYYY)
  if (m) return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));

  // "August 28, 2026" — also matches embedded inside longer strings like
  // "Friday, August 7, 2026 11:59 pm EDT" since this isn't anchored.
  m = s.match(/([A-Za-z]{3,9})\s+(\d{1,2}),\s*(\d{4})/);
  if (m) {
    const mon = MONTHS[m[1].slice(0, 3).toLowerCase()];
    if (mon !== undefined) return new Date(Number(m[3]), mon, Number(m[2]));
  }

  return null;
}

function looksLikeDate(raw) {
  return /^open until filled$/i.test((raw || "").trim()) || parseLooseDate(raw) !== null;
}

function formatClosingDate(raw) {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/^open until filled$/i.test(s)) return "Open until filled";
  const d = parseLooseDate(s);
  if (!d || Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

// ── "Opportunity" vs single job listing ───────────────────────────────────
// Some postings are really a pooled program/hiring stream (e.g. "2026 Summer
// Student Opportunities", "Talent Pool - Analyst", "Student Employment
// Program") rather than one specific role — flag these so the UI can show
// them differently instead of implying there's exactly one job to apply to.
const PROGRAM_TITLE_RE = /\b(programs?|opportunit(?:y|ies)|various positions|talent pool|recruitment)\b|-\s*inventory\b/i;

function isProgramPosting({ title, department, location, duration }) {
  if (PROGRAM_TITLE_RE.test(title)) return true;
  if (/all departments/i.test(department)) return true;
  if (/\bvarious\b/i.test(location) || /multiple location/i.test(location)) return true;
  if (/\bvarious\b/i.test(duration)) return true;
  return false;
}

const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
const [header, ...dataRows] = rows;

const jobs = dataRows.map((r, i) => {
  const byCol = {};
  header.forEach((h, idx) => { byCol[h] = (r[idx] ?? "").trim(); });

  // Prefer an explicit "Closing Date" column; older CSVs (pre-fix) packed the
  // deadline into "Duration" instead, so fall back to detecting that case.
  let duration = byCol["Duration"] || "";
  let closingRaw = byCol["Closing Date"] || "";
  if (!closingRaw && looksLikeDate(duration)) {
    closingRaw = duration;
    duration = "";
  }
  if (/^n\/a$/i.test(duration.trim())) duration = "";

  const department = byCol["department/ministry"] || "";
  const location = byCol["location"] || "";

  return {
    id: i + 1,
    source: byCol["source"] || "",
    title: byCol["title"] || "",
    department,
    location,
    employmentType: byCol["employment_type"] || "",
    duration,
    closingDate: formatClosingDate(closingRaw),
    salary: byCol["Salary"] || "",
    url: byCol["url"] || "",
    isProgram: isProgramPosting({ title: byCol["title"] || "", department, location, duration }),
  };
});

const output = `// Auto-generated by scripts/build-jobs-data.mjs from scripts/scraped_jobs.csv
// Do not edit by hand — regenerate with: node scripts/build-jobs-data.mjs
export const generatedAt = ${JSON.stringify(new Date().toISOString())};

const jobs = ${JSON.stringify(jobs, null, 2)};

export default jobs;
`;

fs.writeFileSync(OUT_PATH, output);
console.log(`✔ Wrote ${jobs.length} jobs to src/data/jobs.js`);
