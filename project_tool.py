#!/usr/bin/env python3
"""GLOCAL Showcase — Project Manager"""

import re
import shutil
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk
from pathlib import Path

BASE       = Path(__file__).parent
PROJ_JS    = BASE / "src" / "data" / "projects.js"
THUMBS     = BASE / "public" / "thumbnails"
CONTENT    = BASE / "public" / "content"
COMPONENTS = BASE / "src" / "content"

TAGS = [
    "elections-canada",      "civic-tech",          "civic-education",
    "civic-engagement",      "governance",           "federalism",
    "data-analysis",         "data-visualization",   "open-data",
    "democracy-research",    "statistics-canada",    "youth-engagement",
    "housing-policy",        "indigenous-engagement","events",
    "outreach",              "archive",
]
TYPES = ["data", "report", "interactive", "events"]


# ── Helpers ──────────────────────────────────────────────────────────────────

def next_id() -> int:
    text = PROJ_JS.read_text(encoding="utf-8")
    ids = [int(m) for m in re.findall(r"\bid:\s*(\d+)", text)]
    return max(ids, default=0) + 1


def to_pascal(title: str) -> str:
    words = re.sub(r"[^a-zA-Z0-9 ]", "", title).split()
    return "".join(w.capitalize() for w in words[:5]) or "NewProject"


def esc(s: str) -> str:
    """Escape a string for embedding in a JS double-quoted literal."""
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").strip()


# ── Code builders ─────────────────────────────────────────────────────────────

def build_js_entry(pid, title, ptype, desc, image_ref, embed_ref, tags, comp_name):
    tags_js = ", ".join(f'"{t}"' for t in tags)
    lines = [
        "{",
        f"  id: {pid},",
        f'  title: "{esc(title)}",',
        f'  type: "{ptype}",',
        "  description:",
        f'    "{esc(desc)}",',
        f'  image: "{image_ref}",',
    ]
    if embed_ref:
        lines.append(f'  embed: "{embed_ref}",')
    lines.append(f"  tags: [{tags_js}],")
    if comp_name:
        lines.append(f"  component: {comp_name},")
    lines.append("}")
    return "\n".join(lines)


def build_jsx(comp_name, sections, embed_ref, title):
    out = []

    def ln(s=""):
        out.append(s)

    ln('import React from "react";')
    ln()
    ln(f"export default function {comp_name}() {{")
    ln("  return (")
    ln("    <article style={{ lineHeight: 1.6 }}>")

    for heading, body in sections:
        heading = heading.strip()
        body = body.strip()
        if not heading and not body:
            continue
        ln()
        ln('      <section style={{ marginBottom: "1.5rem" }}>')
        if heading:
            ln(f"        <h3>{heading}</h3>")
        for para in body.split("\n\n"):
            para = " ".join(para.split())
            if para:
                ln(f"        <p>{para}</p>")
        ln("      </section>")

    if embed_ref:
        ext = Path(embed_ref).suffix.lower()
        ln()
        ln('      <section style={{ marginBottom: "2rem" }}>')
        if ext == ".pdf":
            ln('        <h3>Full Document</h3>')
            ln("        <iframe")
            ln(f'          src="{embed_ref}"')
            ln('          width="100%"')
            ln('          height="600px"')
            ln(f'          title="{title}"')
            ln("          style={{")
            ln('            border: "1px solid #ddd",')
            ln('            borderRadius: "8px",')
            ln('            background: "#fafafa",')
            ln("          }}")
            ln("        />")
            ln('        <p style={{ marginTop: "0.5rem" }}>')
            ln("          <a")
            ln(f'            href="/{embed_ref}"')
            ln('            target="_blank"')
            ln('            rel="noopener noreferrer"')
            ln('            style={{ color: "#5b2bff", fontWeight: 600 }}')
            ln("          >")
            ln("            Download PDF")
            ln("          </a>")
            ln("        </p>")
        elif ext in (".mp4", ".webm"):
            ln('        <h3>Video</h3>')
            ln("        <video")
            ln("          controls")
            ln('          width="100%"')
            ln("          style={{")
            ln('            borderRadius: "8px",')
            ln('            border: "1px solid #ddd",')
            ln('            background: "#000",')
            ln("          }}")
            ln("        >")
            ln(f'          <source src="{embed_ref}" type="video/mp4" />')
            ln("        </video>")
        elif ext == ".html":
            ln('        <h3>Interactive Tool</h3>')
            ln("        <iframe")
            ln(f'          src="{embed_ref}"')
            ln('          width="100%"')
            ln('          height="600px"')
            ln(f'          title="{title}"')
            ln("          style={{")
            ln('            border: "1px solid #ddd",')
            ln('            borderRadius: "8px",')
            ln("          }}")
            ln("        />")
        ln("      </section>")

    ln("    </article>")
    ln("  );")
    ln("}")
    ln()
    return "\n".join(out)


# ── Scrollable frame helper ───────────────────────────────────────────────────

class ScrollFrame(tk.Frame):
    """A frame with a vertical scrollbar."""

    def __init__(self, parent, **kw):
        super().__init__(parent, **kw)
        self.canvas = tk.Canvas(self, highlightthickness=0, bg=self["bg"] if "bg" in kw else "white")
        self.sb = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.sb.set)
        self.sb.pack(side="right", fill="y")
        self.canvas.pack(side="left", fill="both", expand=True)
        self.inner = tk.Frame(self.canvas, bg=self.canvas["bg"])
        self._win = self.canvas.create_window((0, 0), window=self.inner, anchor="nw")
        self.inner.bind("<Configure>", self._on_inner_resize)
        self.canvas.bind("<Configure>", self._on_canvas_resize)
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)

    def _on_inner_resize(self, _e):
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def _on_canvas_resize(self, e):
        self.canvas.itemconfig(self._win, width=e.width)

    def _on_mousewheel(self, e):
        self.canvas.yview_scroll(int(-1 * (e.delta / 120)), "units")


# ── Main App ──────────────────────────────────────────────────────────────────

class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("GLOCAL — Project Manager")
        self.geometry("860x700")
        self.minsize(700, 520)

        self._image_src = None   # Path | None
        self._embed_src = None   # Path | None
        self._sections  = []     # list of (StringVar, Text, Frame)

        self._style()
        self._build()

    def _style(self):
        s = ttk.Style(self)
        s.theme_use("clam")
        # Slightly friendlier notebook tab appearance
        s.configure("TNotebook.Tab", padding=[12, 5])

    # ── Build top-level layout ────────────────────────────────────────────────

    def _build(self):
        self.nb = ttk.Notebook(self)
        self.nb.pack(fill="both", expand=True, padx=10, pady=(10, 0))

        self._build_info_tab()
        self._build_page_tab()

        # Bottom action bar
        bar = tk.Frame(self, pady=8, padx=10)
        bar.pack(fill="x", side="bottom")
        ttk.Button(bar, text="Preview JS Entry", command=self._preview).pack(side="right", padx=(6, 0))
        ttk.Button(bar, text="  Save Project  ", command=self._save).pack(side="right")
        self.status = tk.Label(bar, text="", fg="green", anchor="w")
        self.status.pack(side="left")

    # ── Tab 1 – Project Info ──────────────────────────────────────────────────

    def _build_info_tab(self):
        tab = ttk.Frame(self.nb)
        self.nb.add(tab, text=" Project Info ")

        sf = ScrollFrame(tab, bg="#fafafa")
        sf.pack(fill="both", expand=True)
        c = sf.inner
        c.columnconfigure(1, weight=1)

        pad = {"pady": 6, "padx": (0, 10)}

        r = 0

        # ── Title
        self._lbl(c, "Title *", r)
        self.v_title = tk.StringVar()
        ttk.Entry(c, textvariable=self.v_title, font=("TkDefaultFont", 11)).grid(
            row=r, column=1, sticky="ew", **pad)
        r += 1

        # ── Type
        self._lbl(c, "Type *", r)
        self.v_type = tk.StringVar(value="data")
        ttk.Combobox(c, textvariable=self.v_type, values=TYPES, state="readonly", width=18).grid(
            row=r, column=1, sticky="w", **pad)
        r += 1

        # ── Description
        self._lbl(c, "Description *", r, top=True)
        self.w_desc = tk.Text(c, height=5, wrap="word", font=("TkDefaultFont", 10),
                              relief="solid", bd=1)
        self.w_desc.grid(row=r, column=1, sticky="ew", **pad)
        r += 1

        # ── Team Members
        self._lbl(c, "Team Members", r)
        self.v_team = tk.StringVar()
        ttk.Entry(c, textvariable=self.v_team).grid(row=r, column=1, sticky="ew", **pad)
        r += 1

        # ── Thumbnail
        self._lbl(c, "Thumbnail", r)
        row_img = tk.Frame(c)
        row_img.grid(row=r, column=1, sticky="w", **pad)
        self.lbl_image = tk.Label(row_img, text="No file selected", fg="gray")
        self.lbl_image.pack(side="left")
        ttk.Button(row_img, text="Browse…", command=self._pick_image).pack(side="left", padx=8)
        r += 1

        # ── Embed
        self._lbl(c, "Embed", r)
        row_emb = tk.Frame(c)
        row_emb.grid(row=r, column=1, sticky="ew", **pad)
        self.v_embed = tk.StringVar()
        ttk.Entry(row_emb, textvariable=self.v_embed, width=36).pack(side="left")
        tk.Label(row_emb, text="  or  ", fg="gray").pack(side="left")
        ttk.Button(row_emb, text="Pick file…", command=self._pick_embed).pack(side="left")
        r += 1

        # ── Tags
        self._lbl(c, "Tags", r, top=True)
        tag_frame = tk.Frame(c)
        tag_frame.grid(row=r, column=1, sticky="ew", **pad)
        self.tag_vars = {}
        cols = 3
        for i, tag in enumerate(TAGS):
            v = tk.BooleanVar()
            self.tag_vars[tag] = v
            ttk.Checkbutton(tag_frame, text=tag, variable=v).grid(
                row=i // cols, column=i % cols, sticky="w", padx=4, pady=2)

    def _lbl(self, parent, text, row, top=False):
        anchor = "nw" if top else "w"
        tk.Label(parent, text=text, font=("TkDefaultFont", 10), anchor=anchor).grid(
            row=row, column=0, sticky=anchor, padx=(12, 16), pady=6)

    # ── Tab 2 – Custom Page ───────────────────────────────────────────────────

    def _build_page_tab(self):
        tab = ttk.Frame(self.nb)
        self.nb.add(tab, text=" Custom Page ")

        # Header controls (not scrollable)
        hdr = tk.Frame(tab, pady=10, padx=14)
        hdr.pack(fill="x")

        self.v_custom = tk.BooleanVar(value=False)
        ttk.Checkbutton(
            hdr, text="Create a custom project page component",
            variable=self.v_custom
        ).pack(anchor="w")
        tk.Label(
            hdr,
            text="Each section becomes a heading + paragraphs in the project's Overview tab.",
            fg="gray", font=("TkDefaultFont", 9)
        ).pack(anchor="w", pady=(2, 8))
        ttk.Button(hdr, text="＋  Add Section", command=self._add_section).pack(anchor="w")

        sep = ttk.Separator(tab, orient="horizontal")
        sep.pack(fill="x", padx=14, pady=(4, 0))

        # Scrollable sections area
        self._sec_scroll = ScrollFrame(tab, bg="#fafafa")
        self._sec_scroll.pack(fill="both", expand=True, padx=14, pady=8)
        self._sec_inner = self._sec_scroll.inner

        self._empty_label = tk.Label(
            self._sec_inner,
            text="No sections yet. Click '＋ Add Section' above to get started.",
            fg="gray", font=("TkDefaultFont", 10)
        )
        self._empty_label.pack(pady=20)

    def _add_section(self):
        # Hide the empty-state label once first section added
        if not self._sections:
            self._empty_label.pack_forget()

        idx = len(self._sections) + 1
        frame = tk.LabelFrame(
            self._sec_inner, text=f"  Section {idx}  ",
            font=("TkDefaultFont", 10, "bold"),
            padx=10, pady=8, relief="groove", bd=1
        )
        frame.pack(fill="x", pady=(0, 10))
        frame.columnconfigure(1, weight=1)

        # Heading row
        tk.Label(frame, text="Heading", width=9, anchor="w").grid(row=0, column=0, sticky="w")
        v = tk.StringVar()
        ttk.Entry(frame, textvariable=v).grid(row=0, column=1, sticky="ew", padx=(6, 6))
        ttk.Button(
            frame, text="Remove",
            command=lambda f=frame: self._remove_section(f)
        ).grid(row=0, column=2)

        # Body text
        tk.Label(frame, text="Content", width=9, anchor="nw").grid(
            row=1, column=0, sticky="nw", pady=(8, 0))
        body = tk.Text(frame, height=6, wrap="word", font=("TkDefaultFont", 10),
                       relief="solid", bd=1)
        body.grid(row=1, column=1, columnspan=2, sticky="ew", pady=(8, 0))

        self._sections.append((v, body, frame))

    def _remove_section(self, frame):
        self._sections = [(v, b, f) for v, b, f in self._sections if f is not frame]
        frame.destroy()
        if not self._sections:
            self._empty_label.pack(pady=20)

    # ── File pickers ──────────────────────────────────────────────────────────

    def _pick_image(self):
        p = filedialog.askopenfilename(
            title="Select Thumbnail Image",
            filetypes=[("Images", "*.jpg *.jpeg *.png *.gif *.webp *.svg"), ("All files", "*.*")],
        )
        if p:
            self._image_src = Path(p)
            self.lbl_image.config(text=self._image_src.name, fg="black")

    def _pick_embed(self):
        p = filedialog.askopenfilename(
            title="Select Embed File",
            filetypes=[
                ("Media & Documents", "*.pdf *.mp4 *.webm *.html"),
                ("All files", "*.*"),
            ],
        )
        if p:
            self._embed_src = Path(p)
            self.v_embed.set(self._embed_src.name)

    # ── Collect helpers ───────────────────────────────────────────────────────

    def _image_ref(self):
        return f"thumbnails/{self._image_src.name}" if self._image_src else ""

    def _embed_ref(self):
        if self._embed_src:
            return f"content/{self._embed_src.name}"
        return self.v_embed.get().strip()

    def _collect(self):
        return {
            "title":      self.v_title.get().strip(),
            "ptype":      self.v_type.get(),
            "desc":       self.w_desc.get("1.0", "end").strip(),
            "team":       self.v_team.get().strip(),
            "tags":       [t for t, v in self.tag_vars.items() if v.get()],
            "use_custom": self.v_custom.get(),
            "sections":   [(v.get(), b.get("1.0", "end")) for v, b, _ in self._sections],
        }

    # ── Preview ───────────────────────────────────────────────────────────────

    def _preview(self):
        d = self._collect()
        if not d["title"]:
            messagebox.showwarning("Missing", "Enter a title first.")
            return
        comp = to_pascal(d["title"]) if d["use_custom"] else None
        entry = build_js_entry(
            next_id(), d["title"], d["ptype"], d["desc"],
            self._image_ref(), self._embed_ref(), d["tags"], comp,
        )
        win = tk.Toplevel(self)
        win.title("JS Entry Preview")
        win.geometry("580x340")
        txt = scrolledtext.ScrolledText(win, font=("Courier New", 10), wrap="none")
        txt.pack(fill="both", expand=True, padx=8, pady=8)
        txt.insert("1.0", entry)
        txt.configure(state="disabled")

    # ── Save ──────────────────────────────────────────────────────────────────

    def _save(self):
        d = self._collect()

        if not d["title"]:
            messagebox.showerror("Required", "Title is required.")
            return
        if not d["desc"]:
            messagebox.showerror("Required", "Description is required.")
            return

        pid = next_id()
        comp = to_pascal(d["title"]) if d["use_custom"] else None

        # Build sections list; auto-prepend team if provided and not already covered
        sections = d["sections"]
        if d["team"] and d["use_custom"]:
            headings_lower = [s[0].lower() for s in sections]
            if not any("team" in h or "member" in h for h in headings_lower):
                sections = [("Project Team", f"Team Members: {d['team']}")] + sections

        # ── Copy files ──
        for src, dst_dir in [(self._image_src, THUMBS), (self._embed_src, CONTENT)]:
            if src and src.exists():
                dst = dst_dir / src.name
                if not dst.exists():
                    shutil.copy2(src, dst)

        # ── Write JSX component ──
        if comp:
            jsx = build_jsx(comp, sections, self._embed_ref(), d["title"])
            (COMPONENTS / f"{comp}.jsx").write_text(jsx, encoding="utf-8")

        # ── Patch projects.js ──
        js_text = PROJ_JS.read_text(encoding="utf-8")

        # Add import if using a component
        if comp:
            import_line = f'import {comp} from "../content/{comp}";\n'
            if import_line not in js_text:
                last = list(re.finditer(r"^import .+;\n", js_text, re.MULTILINE))
                pos = last[-1].end() if last else 0
                js_text = js_text[:pos] + import_line + js_text[pos:]

        # Insert new entry before closing ];
        entry = build_js_entry(
            pid, d["title"], d["ptype"], d["desc"],
            self._image_ref(), self._embed_ref(), d["tags"], comp,
        )
        insert_at = js_text.rfind("];")
        js_text = js_text[:insert_at] + f"\n{entry},\n\n" + js_text[insert_at:]
        PROJ_JS.write_text(js_text, encoding="utf-8")

        self.status.config(text=f"✓  Saved '{d['title']}' (ID {pid})")
        self._reset()

    # ── Reset form ────────────────────────────────────────────────────────────

    def _reset(self):
        self.v_title.set("")
        self.v_type.set("data")
        self.w_desc.delete("1.0", "end")
        self.v_team.set("")
        self.v_embed.set("")
        self._image_src = None
        self._embed_src = None
        self.lbl_image.config(text="No file selected", fg="gray")
        for v in self.tag_vars.values():
            v.set(False)
        for _, _, f in self._sections:
            f.destroy()
        self._sections.clear()
        self.v_custom.set(False)
        if not self._sections:
            self._empty_label.pack(pady=20)


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    App().mainloop()
