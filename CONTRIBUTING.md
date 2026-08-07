# Contributing to GLOCAL Showcase

Thanks for helping improve the showcase. This guide covers project submissions and code contributions.

## Add a project

The showcase has a project-adding tool, so you do not need to edit `src/data/projects.js` by hand.

### 1. Create a project package

Open the [Submit a Project tool](https://glocal-open-source.github.io/showcase/#/submit), complete the form, and click **Download project package**. The tool creates a `project-package-*.json` file containing the project details and thumbnail.

You can also run the site locally with `npm run dev` and open `http://localhost:5173/showcase/#/submit`.

The form requires:

- A title, type, category, and short card description
- At least one content section or an HTTPS project URL

Sections, links, tags, team members, contact details, and a thumbnail are supported. Thumbnails can be PNG, JPEG, WebP, or GIF files and must be under 2 MB.

If you are only submitting a project and do not maintain this repository, send the downloaded package to the GLOCAL team. Submitter contact details are used for review and are not added to the public project page by the importer.

### 2. Import the package

Repository contributors can import the downloaded file with one command:

```bash
npm run project:import -- path/to/project-package-name.json
```

The default cohort is `NYSN`. Set a different cohort when needed:

```bash
npm run project:import -- path/to/project-package-name.json --cohort "Intern"
```

Accepted cohort values are `Admin`, `NYSN`, `Intern`, and `Microgrant 20XX`.

To validate and preview a package without changing any files, add `--dry-run`:

```bash
npm run project:import -- path/to/project-package-name.json --cohort "Intern" --dry-run
```

The importer validates the package, assigns the next project ID, saves its thumbnail in `public/thumbnails/`, creates an overview component in `src/content/`, and adds a lazy import and project entry to `src/data/projects.js`. It refuses duplicate titles and IDs.

### 3. Review and verify

The package is input, not a trusted code change. Review the generated copy and links before publishing.

```bash
git status --short
git diff -- src/data/projects.js src/content
npm run lint
npm run build
```

Also open the site and confirm:

- The card title, description, type, category, cohort, tags, and thumbnail are correct
- The thumbnail file printed by the importer exists in `public/thumbnails/`
- The Overview page reads cleanly
- Every external URL uses HTTPS and points to the intended destination
- No submitter email or other private review note appears in generated public files

Do not commit the downloaded package itself. Commit the generated source changes. `public/thumbnails/` is intentionally ignored on the source branch, so keep the generated thumbnail in the deployment checkout and verify that it is included when publishing the site.

## Bulk and older export packages

The browser-based bulk tool in `tools/bulk_project_adder/` and `import_project_exports.py` support older multi-project manifests, attached PDFs, CSV entry, and export folders. Use them only when a submission needs those legacy features:

```bash
python import_project_exports.py
```

That importer reads unprocessed packages from `imports/`. See [ADDING_PROJECTS.md](ADDING_PROJECTS.md) for its package formats and limitations. New single-project submissions should use the site form and `npm run project:import`.

## Code contributions

1. Fork and clone the repository.
2. Create a focused branch.
3. Install dependencies with `npm ci`.
4. Make the change and keep unrelated generated or local files out of the commit.
5. Run `npm run lint` and `npm run build`.
6. Open a pull request explaining what changed and how you tested it.

For visual changes, include before/after screenshots. For behavior changes, include concise reproduction and verification steps.
