// Cloudflare Worker exposing the GLOCAL Showcase project data over HTTP so
// it can be queried from other projects, not just this app's own bundle.
// Data comes from public/data/projects.json (see scripts/generate-projects-json.mjs),
// filtering/stats logic from ../src/api/query.js — the same code the in-app
// module src/api/projects.js uses, just bound to a JSON snapshot instead of
// the React-bundled project list.
import projectsData from "../public/data/projects.json";
import { createProjectsApi } from "../src/api/query.js";

const api = createProjectsApi(projectsData);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS, ...(init.headers || {}) },
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
    if (request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405 });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    const projectIdMatch = path.match(/^\/projects\/(\d+)$/);
    if (projectIdMatch) {
      const project = api.getProject(projectIdMatch[1]);
      return project ? json(project) : json({ error: "Project not found" }, { status: 404 });
    }

    if (path === "/projects") {
      const filters = api.parseFilterParams(url.searchParams);
      const results = api.queryProjects(filters);
      return json({ total: results.length, results });
    }

    if (path === "/stats") {
      const filters = api.parseFilterParams(url.searchParams);
      filters.groupBy = url.searchParams.getAll("groupBy").flatMap((v) => v.split(","));
      return json(api.getProjectStats(filters));
    }

    if (path === "/") {
      return json({
        name: "GLOCAL Showcase projects API",
        endpoints: {
          "GET /projects": "Query projects. Filter with type, cohort, category, province, tag, id, q as query params (comma-separated or repeated for OR-within-field).",
          "GET /projects/:id": "Get a single project by id.",
          "GET /stats": "Count projects matching the same filters as /projects. Add ?groupBy=cohort (repeatable, or comma-separated) for a breakdown.",
        },
      });
    }

    return json({ error: "Not found" }, { status: 404 });
  },
};
