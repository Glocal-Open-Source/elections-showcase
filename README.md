# GLOCAL Showcase

A React + Vite portfolio site for GLOCAL Foundation projects: reports, datasets, interactive tools, and events.

## Getting started

```bash
npm ci
npm run dev      # local development server
npm run lint     # lint the codebase
npm run build    # production build -> dist/
```

## Add a project

Use the showcase's [Submit a Project tool](https://glocal-open-source.github.io/showcase/#/submit) to create a project package, then import it with:

```bash
npm run project:import -- path/to/project-package-name.json
```

The importer validates the package, generates the project page, saves its thumbnail, assigns the next ID, and updates the project list. Use `--dry-run` to preview an import without changing files.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete submission, review, cohort, bulk-import, and pull-request workflows.

## Project structure

```text
public/
  thumbnails/   Project card images
  content/      PDFs, HTML embeds, and local videos
src/
  components/   Shared interface components
  content/      Per-project React overview pages
  data/
    projects.js Master project list
scripts/
  import-project.mjs  Project-package importer
```

## Deployment

```bash
npm run deploy
```

This builds the site and publishes `dist/` to the `gh-pages` branch.
