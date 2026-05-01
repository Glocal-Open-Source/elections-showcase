# GLOCAL Showcase

A React + Vite portfolio site for GLOCAL Foundation projects — reports, datasets, interactive tools, and events.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run deploy   # push dist/ to gh-pages
```

---

## Adding a project

The easiest way is the GUI tool. You need Python 3 (standard library only — no pip installs).

```bash
python project_tool.py
```

### Tab 1 — Project Info

| Field | Notes |
|---|---|
| **Title** | Displayed on the card and project page. Required. |
| **Type** | `data`, `report`, `interactive`, or `events`. Controls the filter sidebar. |
| **Description** | 1–2 sentences shown on the card. Required. |
| **Team Members** | Names separated by commas. Auto-added to the custom page if provided. |
| **Thumbnail** | Click **Browse…** to pick a local image. It gets copied to `public/thumbnails/` automatically. |
| **Embed** | Paste a URL (external site, YouTube, Tableau) **or** click **Pick file…** to select a local PDF/HTML/video. Local files are copied to `public/content/`. |
| **Tags** | Check all that apply. Used by the tag filter. |

### Tab 2 — Custom Page (optional)

Check **Create a custom project page component** to generate a dedicated overview page that appears when someone clicks into the project.

Click **＋ Add Section** to add as many heading + body sections as you need. Each section becomes a `<h3>` with paragraphs below it on the project page.

If you leave this tab alone, the project card still appears in the grid — it just won't have a custom overview tab.

### Saving

Click **Save Project**. The tool will:

1. Copy the thumbnail to `public/thumbnails/`
2. Copy the embed file (if local) to `public/content/`
3. Write a `.jsx` component to `src/content/` (if custom page is checked)
4. Inject the new entry into `src/data/projects.js` with the next available ID

A green confirmation message appears in the bottom-left when done. You can then **Preview JS Entry** at any time before saving to see exactly what will be written to `projects.js`.

---

## Adding a project manually

If you prefer to skip the tool, add an object to the `projects` array in `src/data/projects.js`:

```js
{
  id: <next available integer>,
  title: "Your Project Title",
  type: "report",           // data | report | interactive | events
  description: "One or two sentences shown on the card.",
  image: "thumbnails/your-image.jpg",   // place file in public/thumbnails/
  embed: "content/your-file.pdf",       // place file in public/content/  (or a URL)
  tags: ["civic-education", "open-data"],
  component: YourComponent,             // optional — import from src/content/
}
```

For a custom page, create `src/content/YourComponent.jsx` and import it at the top of `projects.js`. See any existing file in `src/content/` for the expected structure.

---

## Project structure

```
public/
  thumbnails/   card images
  content/      PDFs, HTML embeds, local videos
src/
  content/      per-project JSX overview pages
  data/
    projects.js the master project list
  components/   shared UI (Sidebar, CardGrid, ProjectView, …)
project_tool.py GUI tool for adding projects (Python 3, no dependencies)
```
