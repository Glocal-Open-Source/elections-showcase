// Snapshots src/data/projects.js as plain JSON for consumers that can't (or
// shouldn't) pull in React and the ~300 lazy-loaded project page components
// — namely the Cloudflare Worker in worker/. Regenerate after editing
// project data (the build and worker:deploy scripts do this automatically).
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import projectsData from "../src/data/projects.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "data");
const outFile = join(outDir, "projects.json");

const serializable = projectsData.map(({ component, ...rest }) => rest);

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(serializable));

console.log(`Wrote ${serializable.length} projects to ${outFile}`);
