# Adding Projects

The canonical project contribution workflow now lives in [CONTRIBUTING.md](CONTRIBUTING.md#add-a-project).

For new projects:

1. Create a package with the [Submit a Project tool](https://glocal-open-source.github.io/showcase/#/submit).
2. Import it with `npm run project:import -- path/to/project-package.json`.
3. Review the generated files, then run `npm run lint` and `npm run build`.

## Legacy bulk workflow

The older bulk tool remains available for multi-project CSV entry and packages containing local PDFs, HTML, or video files.

### Standalone browser tool

Open `tools/bulk_project_adder/index.html`, add or CSV-import projects, and download the JSON export. Place the JSON file in `imports/`.

### Python server tool

The server version saves an export folder containing `manifest.json` and its assets:

```powershell
.\tools\bulk_project_adder\launch-windows.ps1
```

```bash
tools/bulk_project_adder/launch-macos.command
```

Move the complete export folder to `imports/`, then run:

```bash
python import_project_exports.py
```

The legacy importer:

- Finds unprocessed standalone JSON files and `manifest.json` export folders under `imports/`
- Copies thumbnails to `public/thumbnails/` and local content to `public/content/`
- Generates optional overview components in `src/content/`
- Appends entries to `src/data/projects.js`
- Adds a `.imported` marker to prevent processing the same package twice

Review every generated file and run `npm run lint` and `npm run build` before deploying or committing source changes. New single-project packages created by the site's Submit form use `npm run project:import`, not this legacy importer.
