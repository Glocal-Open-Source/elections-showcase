// In-app "API" for querying project data. No server involved — this is a
// plain module that any component (or a future serverless layer) can call.
import projectsData from "../data/projects";

const slugify = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Tag slugs used in project.tags, keyed to their display name — same set
// App.jsx uses to derive province membership from tags.
export const PROVINCES = [
  { tag: "alberta", code: "ab", name: "Alberta" },
  { tag: "british-columbia", code: "bc", name: "British Columbia" },
  { tag: "manitoba", code: "mb", name: "Manitoba" },
  { tag: "new-brunswick", code: "nb", name: "New Brunswick" },
  { tag: "newfoundland", code: "nl", name: "Newfoundland & Labrador" },
  { tag: "northwest-territories", code: "nt", name: "Northwest Territories" },
  { tag: "nova-scotia", code: "ns", name: "Nova Scotia" },
  { tag: "nunavut", code: "nu", name: "Nunavut" },
  { tag: "ontario", code: "on", name: "Ontario" },
  { tag: "prince-edward-island", code: "pe", name: "Prince Edward Island" },
  { tag: "quebec", code: "qc", name: "Quebec" },
  { tag: "saskatchewan", code: "sk", name: "Saskatchewan" },
  { tag: "yukon", code: "yt", name: "Yukon" },
];

const PROVINCE_BY_CODE = new Map(PROVINCES.map((p) => [p.code, p]));
const PROVINCE_BY_TAG = new Map(PROVINCES.map((p) => [p.tag, p]));

function projectProvinces(project) {
  return (project.tags || []).map((t) => PROVINCE_BY_TAG.get(t)).filter(Boolean);
}

// A filter value can arrive as a slug ("ab"), a tag ("alberta"), or the
// display name ("Alberta") — all three resolve to the same tag.
function resolveProvinceTag(input) {
  const raw = String(input).trim().toLowerCase();
  if (PROVINCE_BY_CODE.has(raw)) return PROVINCE_BY_CODE.get(raw).tag;
  return slugify(raw);
}

function buildSlugMap(values) {
  const map = new Map();
  values.forEach((v) => {
    const key = slugify(v);
    if (v && !map.has(key)) map.set(key, v);
  });
  return map;
}

const ALL_TYPES = [...new Set(projectsData.map((p) => p.type).filter(Boolean))];
const ALL_COHORTS = [...new Set(projectsData.map((p) => p.cohort).filter(Boolean))];
const ALL_CATEGORIES = [...new Set(projectsData.map((p) => p.category).filter(Boolean))];

const TYPE_SLUGS = buildSlugMap(ALL_TYPES);
const COHORT_SLUGS = buildSlugMap(ALL_COHORTS);
const CATEGORY_SLUGS = buildSlugMap(ALL_CATEGORIES);

function resolveBySlug(slugMap, input) {
  return slugMap.get(slugify(input)) ?? input;
}

function normalizeList(value) {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  return String(value).split(",").map((s) => s.trim()).filter(Boolean);
}

/** Everything about {@link queryProjects} that isn't a plain field=value match. */
const SPECIAL_KEYS = new Set([
  "id", "ids", "type", "types", "cohort", "cohorts",
  "category", "categories", "province", "provinces",
  "tag", "tags", "q", "groupBy",
]);

/**
 * Filter the project list. Every param is optional and they combine with AND.
 * type/cohort/category/province accept either the exact value or its slug
 * (e.g. province: "ab" or "alberta" or "Alberta" all match the same tag).
 * Any other project field (title, embed, id, ...) can also be passed and is
 * matched by exact value.
 */
export function queryProjects(filters = {}) {
  const idList = normalizeList(filters.ids ?? filters.id).map(Number);
  const typeList = normalizeList(filters.types ?? filters.type).map((v) => resolveBySlug(TYPE_SLUGS, v));
  const cohortList = normalizeList(filters.cohorts ?? filters.cohort).map((v) => resolveBySlug(COHORT_SLUGS, v));
  const categoryList = normalizeList(filters.categories ?? filters.category).map((v) => resolveBySlug(CATEGORY_SLUGS, v));
  const provinceList = normalizeList(filters.provinces ?? filters.province).map(resolveProvinceTag);
  const tagList = normalizeList(filters.tags ?? filters.tag).map((v) => v.toLowerCase());
  const query = filters.q ? String(filters.q).trim().toLowerCase() : "";

  const genericFilters = Object.entries(filters).filter(
    ([key, value]) => !SPECIAL_KEYS.has(key) && value !== undefined && value !== null && value !== ""
  );

  return projectsData.filter((p) => {
    if (idList.length && !idList.includes(p.id)) return false;
    if (typeList.length && !typeList.includes(p.type)) return false;
    if (cohortList.length && !cohortList.includes(p.cohort)) return false;
    if (categoryList.length && !categoryList.includes(p.category)) return false;

    if (tagList.length) {
      const pTags = (p.tags || []).map((t) => t.toLowerCase());
      if (!tagList.some((t) => pTags.includes(t))) return false;
    }

    if (provinceList.length) {
      const pProvinceTags = (p.tags || []).filter((t) => PROVINCE_BY_TAG.has(t));
      if (!provinceList.some((t) => pProvinceTags.includes(t))) return false;
    }

    if (query) {
      const haystack = `${p.title} ${p.description || ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    for (const [key, value] of genericFilters) {
      const wanted = normalizeList(value).map(String);
      if (!wanted.includes(String(p[key]))) return false;
    }

    return true;
  });
}

export function getProject(id) {
  return projectsData.find((p) => p.id === Number(id)) ?? null;
}

/** Parses a query string, URLSearchParams, or hash search into a filters object for queryProjects. */
export function parseFilterParams(input) {
  const sp =
    input instanceof URLSearchParams
      ? input
      : new URLSearchParams(typeof input === "string" ? input.replace(/^[?#]/, "") : input || {});

  const multi = (key) => {
    const all = sp.getAll(key);
    if (all.length > 1) return all;
    if (all.length === 1) return all[0].split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  };

  const filters = {
    ids: multi("id"),
    types: multi("type"),
    cohorts: multi("cohort"),
    categories: multi("category"),
    provinces: multi("province"),
    tags: multi("tag"),
  };
  const q = sp.get("q");
  if (q) filters.q = q;
  return filters;
}

/** Available values for each filterable attribute, paired with their slug. */
export function getFilterOptions() {
  return {
    types: ALL_TYPES.map((value) => ({ value, slug: slugify(value) })),
    cohorts: ALL_COHORTS.map((value) => ({ value, slug: slugify(value) })),
    categories: ALL_CATEGORIES.map((value) => ({ value, slug: slugify(value) })),
    provinces: PROVINCES.map(({ name, code, tag }) => ({ value: name, slug: code, tag })),
  };
}

function countBy(list, field) {
  const counts = {};
  const bump = (key) => { counts[key] = (counts[key] || 0) + 1; };

  list.forEach((p) => {
    if (field === "province") {
      const provs = projectProvinces(p);
      if (provs.length === 0) bump("none");
      else provs.forEach((pv) => bump(pv.name));
      return;
    }
    if (field === "tags" || field === "tag") {
      (p.tags || []).forEach(bump);
      return;
    }
    const value = p[field];
    bump(value === undefined || value === null || value === "" ? "unspecified" : value);
  });

  return counts;
}

/**
 * Count projects matching `filters` (same shape as queryProjects), optionally
 * broken down by one or more fields via groupBy (e.g. "cohort" or
 * ["cohort", "province"]). Returns { total, [field]: { value: count } }.
 */
export function getProjectStats(filters = {}) {
  const { groupBy, ...restFilters } = filters;
  const matched = queryProjects(restFilters);
  const stats = { total: matched.length };

  normalizeList(groupBy).forEach((field) => {
    stats[field] = countBy(matched, field);
  });

  return stats;
}
