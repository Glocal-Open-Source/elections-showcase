#!/usr/bin/env python3
"""Import bulk project export packages into the GLOCAL Showcase repo.

Thumbnail auto-fetch (runs during import when a project has no thumbnail):
  1. Pexels stock photo  — set PEXELS_API_KEY env var to enable.
     Free tier: 200 requests/hour.  On 429 the script switches to placeholders.
  2. Pillow placeholder  — gradient image with title text.  Requires Pillow:
       pip install Pillow
     If Pillow is not installed, projects without thumbnails are imported with
     an empty image reference and you can add thumbnails manually later.
"""

from __future__ import annotations

import html
import base64
import io
import json
import math
import os
import re
import shutil
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


BASE = Path(__file__).resolve().parent
IMPORTS = BASE / "imports"
PROJ_JS = BASE / "src" / "data" / "projects.js"
THUMBS = BASE / "public" / "thumbnails"
CONTENT = BASE / "public" / "content"
COMPONENTS = BASE / "src" / "content"

PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY", "MrTazzupPyRWFCz7j2oAhfFiax5ufrhqtdAzXcAwZVlrexmAYVdHPF7a")

_TYPE_COLORS: dict[str, tuple[tuple[int, int, int], tuple[int, int, int]]] = {
    "interactive": ((30, 100, 220), (10, 55, 160)),
    "data":        ((20, 145, 80),  (10, 85, 45)),
    "events":      ((215, 70, 35),  (155, 35, 15)),
    "report":      ((115, 55, 200), (65, 25, 145)),
    "video":       ((25, 130, 180), (10, 80, 130)),
}
_DEFAULT_COLOR: tuple[tuple[int, int, int], tuple[int, int, int]] = (
    (70, 100, 140), (35, 60, 100)
)

_pexels_rate_limited = False


# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------

def next_id(text: str) -> int:
    ids = [int(m) for m in re.findall(r"\bid:\s*(\d+)", text)]
    return max(ids, default=0) + 1


def slugify(value: str, fallback: str = "project") -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value or fallback


def to_pascal(title: str) -> str:
    words = re.sub(r"[^a-zA-Z0-9 ]", "", title).split()
    return "".join(w.capitalize() for w in words[:5]) or "NewProject"


def esc_js(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").strip()


def unique_path(path: Path) -> Path:
    if not path.exists():
        return path
    i = 2
    while True:
        candidate = path.with_name(f"{path.stem}-{i}{path.suffix}")
        if not candidate.exists():
            return candidate
        i += 1


def unique_component(base_name: str) -> str:
    name = base_name
    i = 2
    while (COMPONENTS / f"{name}.jsx").exists():
        name = f"{base_name}{i}"
        i += 1
    return name


def safe_filename(name: str, fallback: str) -> str:
    raw = Path(name or fallback)
    stem = slugify(raw.stem, Path(fallback).stem)
    suffix = re.sub(r"[^a-zA-Z0-9.]", "", raw.suffix)[:16]
    return f"{stem}{suffix.lower()}"


# ---------------------------------------------------------------------------
# Auto-thumbnail: Pexels fetch
# ---------------------------------------------------------------------------

def _pexels_fetch(query: str) -> bytes | None:
    global _pexels_rate_limited
    if not PEXELS_API_KEY or _pexels_rate_limited:
        return None
    url = "https://api.pexels.com/v1/search?" + urllib.parse.urlencode({
        "query": query,
        "per_page": 1,
        "orientation": "landscape",
        "size": "medium",
    })
    req = urllib.request.Request(url, headers={"Authorization": PEXELS_API_KEY})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            photos = json.loads(r.read()).get("photos", [])
        if not photos:
            return None
        with urllib.request.urlopen(photos[0]["src"]["medium"], timeout=15) as r:
            data = r.read()
        time.sleep(0.5)  # stay well under 200 req/hour
        return data
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print("  Pexels rate limit reached — using placeholders for remaining projects.")
            _pexels_rate_limited = True
        else:
            print(f"  Pexels HTTP {e.code}: {e.reason}")
        return None
    except Exception as e:
        print(f"  Pexels fetch failed: {e}")
        return None


# ---------------------------------------------------------------------------
# Auto-thumbnail: Pillow placeholder
# ---------------------------------------------------------------------------

def _load_font(size: int):
    from PIL import ImageFont
    candidates = (
        "arial.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "DejaVuSans.ttf",
    )
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def _make_placeholder(title: str, ptype: str) -> bytes | None:
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None

    W, H = 800, 450
    S = 3  # supersampling factor — drawn at 3× then scaled down with Lanczos
    SW, SH = W * S, H * S
    top_c, bot_c = _TYPE_COLORS.get(ptype, _DEFAULT_COLOR)

    # Gradient background at full supersampled size
    img = Image.new("RGBA", (SW, SH))
    draw = ImageDraw.Draw(img)
    for y in range(SH):
        t = y / SH
        r = int(top_c[0] + t * (bot_c[0] - top_c[0]))
        g = int(top_c[1] + t * (bot_c[1] - top_c[1]))
        b = int(top_c[2] + t * (bot_c[2] - top_c[2]))
        draw.line([(0, y), (SW, y)], fill=(r, g, b, 255))

    # Abstract compound waves — each path sums two sine harmonics
    # Entries: y_frac, [(amp, freq, phase), ...], line_width, alpha
    wave_layer = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    wdraw = ImageDraw.Draw(wave_layer)
    wave_defs = [
        (0.50, [(130, 0.70, 0.80), (22, 2.10, 0.30)],  9, 20),
        (0.25, [( 80, 1.00, 0.00), (18, 3.00, 1.00)],  4, 52),
        (0.75, [( 65, 1.50, 1.50), (28, 2.50, 0.50)],  3, 48),
        (0.40, [(110, 0.90, 1.20), (32, 1.80, 2.00)], 11, 14),
        (0.60, [( 75, 1.30, 0.60), (22, 2.80, 1.30)],  4, 58),
        (0.15, [( 50, 2.20, 0.30), (12, 4.00, 0.80)],  2, 30),
        (0.85, [( 55, 1.80, 2.10), (16, 3.20, 0.40)],  2, 38),
        (0.35, [( 38, 3.10, 0.10), (12, 5.00, 1.50)],  2, 24),
        (0.65, [( 92, 0.60, 0.50), (42, 1.40, 1.80)],  7, 16),
        (0.55, [( 48, 2.00, 0.90), (22, 3.50, 0.20)],  3, 32),
        (0.45, [(105, 0.80, 1.60), (28, 2.00, 0.70)],  6, 18),
        (0.80, [( 62, 1.60, 0.40), (22, 2.80, 1.20)],  3, 36),
        (0.20, [( 72, 1.10, 1.80), (16, 3.30, 0.60)],  3, 42),
        (0.30, [( 58, 1.70, 0.70), (20, 2.60, 1.90)],  4, 26),
        (0.70, [( 85, 0.95, 1.10), (18, 3.70, 0.35)],  5, 22),
    ]
    for y_frac, harmonics, lw, alpha in wave_defs:
        y_center = y_frac * SH
        pts = []
        for x in range(SW + 1):
            y_val = y_center + sum(
                a * S * math.sin(f * 2 * math.pi * x / SW + p) for a, f, p in harmonics
            )
            pts.append((x, int(y_val)))
        wdraw.line(pts, fill=(255, 255, 255, alpha), width=lw * S)

    img = Image.alpha_composite(img, wave_layer)

    # Downscale with Lanczos — this is what anti-aliases the lines
    img = img.resize((W, H), Image.LANCZOS)

    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="PNG")
    return buf.getvalue()


# ---------------------------------------------------------------------------
# Auto-thumbnail: orchestrator
# ---------------------------------------------------------------------------

def _auto_thumbnail(title: str, ptype: str, tags: list[str], slug: str) -> str:
    query = " ".join([title] + tags[:2])
    img_bytes = _pexels_fetch(query)
    source = "pexels"
    if img_bytes is None:
        img_bytes = _make_placeholder(title, ptype)
        source = "placeholder"
    if not img_bytes:
        return ""
    THUMBS.mkdir(parents=True, exist_ok=True)
    ext = "jpg" if img_bytes[:2] == b"\xff\xd8" else "png"
    dest = unique_path(THUMBS / f"{slug}-thumbnail.{ext}")
    dest.write_bytes(img_bytes)
    print(f"  Thumbnail ({source}): {dest.name}")
    return f"thumbnails/{dest.name}"


# ---------------------------------------------------------------------------
# Google embed URL normalizer
# ---------------------------------------------------------------------------

def _normalize_embed(url: str) -> str:
    """Convert Google Docs/Drive share links to their embeddable equivalents."""
    if not url or not url.startswith("https://"):
        return url

    # Already an embed URL — leave it alone
    if any(s in url for s in ("/preview", "/embed", "/pubhtml", "embedded=true")):
        return url

    # Drive folders can't be embedded — pass through as an external link
    if re.search(r"drive\.google\.com/drive/folders/", url):
        return url

    m = re.match(r"https://docs\.google\.com/document/d/([^/?#]+)", url)
    if m:
        return f"https://docs.google.com/document/d/{m.group(1)}/preview"

    m = re.match(r"https://docs\.google\.com/spreadsheets/d/([^/?#]+)", url)
    if m:
        return f"https://docs.google.com/spreadsheets/d/{m.group(1)}/pubhtml?widget=true&headers=false"

    m = re.match(r"https://docs\.google\.com/presentation/d/([^/?#]+)", url)
    if m:
        return f"https://docs.google.com/presentation/d/{m.group(1)}/embed?start=false&loop=false&delayms=3000"

    m = re.match(r"https://docs\.google\.com/forms/d/([^/?#]+)", url)
    if m:
        return f"https://docs.google.com/forms/d/{m.group(1)}/viewform?embedded=true"

    m = re.match(r"https://drive\.google\.com/file/d/([^/?#]+)", url)
    if m:
        return f"https://drive.google.com/file/d/{m.group(1)}/preview"

    m = re.search(r"drive\.google\.com/open\?id=([^&]+)", url)
    if m:
        return f"https://drive.google.com/file/d/{m.group(1)}/preview"

    return url


# ---------------------------------------------------------------------------
# JS / JSX builders
# ---------------------------------------------------------------------------

def build_js_entry(pid, title, ptype, desc, image_ref, embed_ref, tags, comp_name):
    tags_js = ", ".join(f'"{esc_js(t)}"' for t in tags)
    lines = [
        "{",
        f"  id: {pid},",
        f'  title: "{esc_js(title)}",',
        f'  type: "{esc_js(ptype)}",',
        "  description:",
        f'    "{esc_js(desc)}",',
        f'  image: "{esc_js(image_ref)}",',
    ]
    if embed_ref:
        lines.append(f'  embed: "{esc_js(embed_ref)}",')
    lines.append(f"  tags: [{tags_js}],")
    if comp_name:
        lines.append(f"  component: {comp_name},")
    lines.append("}")
    return "\n".join(lines)


def build_jsx(comp_name: str, project: dict, embed_ref: str) -> str:
    sections = list(project.get("sections", []))
    team = project.get("team", "").strip()
    if team and not any("team" in s.get("heading", "").lower() for s in sections):
        sections.insert(0, {"heading": "Project Team", "body": f"Team Members: {team}"})

    out = [
        'import React from "react";',
        "",
        f"export default function {comp_name}() {{",
        "  return (",
        "    <article style={{ lineHeight: 1.6 }}>",
    ]

    for section in sections:
        heading = section.get("heading", "").strip()
        body = section.get("body", "").strip()
        if not heading and not body:
            continue
        out.extend(["", '      <section style={{ marginBottom: "1.5rem" }}>'])
        if heading:
            out.append(f"        <h3>{html.escape(heading)}</h3>")
        for para in body.split("\n\n"):
            para = " ".join(para.split())
            if para:
                out.append(f"        <p>{html.escape(para)}</p>")
        out.append("      </section>")

    if embed_ref and not embed_ref.startswith("http"):
        # Only inline local file embeds; URL embeds are handled by ProjectView
        suffix = Path(embed_ref).suffix.lower()
        embed_block: list[str] = []
        if suffix == ".pdf":
            embed_block = [
                "        <h3>Full Document</h3>",
                "        <object",
                f'          data="{html.escape(embed_ref)}"',
                '          type="application/pdf"',
                f'          aria-label="{html.escape(project.get("title", "Project"))}"',
                '          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}',
                "        >",
                f'          <a href="{html.escape(embed_ref)}" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>',
                "        </object>",
            ]
        elif suffix in (".mp4", ".webm"):
            embed_block = [
                "        <h3>Video</h3>",
                '        <video controls width="100%" style={{ borderRadius: "8px", border: "1px solid #ddd", background: "#000" }}>',
                f'          <source src="{html.escape(embed_ref)}" />',
                "        </video>",
            ]
        elif suffix == ".html":
            embed_block = [
                "        <h3>Interactive Tool</h3>",
                "        <iframe",
                f'          src="{html.escape(embed_ref)}"',
                '          width="100%"',
                '          height="600px"',
                f'          title="{html.escape(project.get("title", "Project"))}"',
                '          style={{ border: "1px solid #ddd", borderRadius: "8px" }}',
                "        />",
            ]
        if embed_block:
            out.extend(["", '      <section style={{ marginBottom: "2rem" }}>'])
            out.extend(embed_block)
            out.append("      </section>")

    out.extend(["    </article>", "  );", "}", ""])
    return "\n".join(out)


# ---------------------------------------------------------------------------
# Manifest discovery and asset helpers
# ---------------------------------------------------------------------------

def package_manifests() -> list[Path]:
    IMPORTS.mkdir(exist_ok=True)
    found = []
    for manifest in IMPORTS.rglob("manifest.json"):
        if not (manifest.parent / ".imported").exists():
            found.append(manifest)
    for manifest in IMPORTS.glob("*.json"):
        marker = manifest.with_suffix(manifest.suffix + ".imported")
        if manifest.name != "manifest.json" and not marker.exists():
            found.append(manifest)
    return sorted(set(found))


def copy_asset(package_dir: Path, rel_path: str, dest_root: Path, public_prefix: str) -> str:
    if not rel_path:
        return ""
    src = (package_dir / rel_path).resolve()
    if not src.exists():
        raise FileNotFoundError(f"Missing asset: {src}")
    dest_root.mkdir(parents=True, exist_ok=True)
    dest = unique_path(dest_root / src.name)
    shutil.copy2(src, dest)
    return f"{public_prefix}/{dest.name}"


def write_embedded_file(file_info: dict, dest_root: Path, public_prefix: str, fallback_name: str) -> str:
    data_url = (file_info or {}).get("dataUrl", "")
    if not data_url or "," not in data_url:
        return ""

    header, encoded = data_url.split(",", 1)
    if ";base64" not in header:
        return ""

    dest_root.mkdir(parents=True, exist_ok=True)
    filename = safe_filename(file_info.get("name", ""), fallback_name)
    dest = unique_path(dest_root / filename)
    dest.write_bytes(base64.b64decode(encoded))
    return f"{public_prefix}/{dest.name}"


# ---------------------------------------------------------------------------
# Main import
# ---------------------------------------------------------------------------

def import_packages() -> int:
    manifests = package_manifests()
    if not manifests:
        print("No export packages found in imports/.")
        return 0

    if PEXELS_API_KEY:
        print("Thumbnails: Pexels API + placeholder fallback (free tier: 200 req/hour).")
    else:
        print("Thumbnails: placeholder mode  |  set PEXELS_API_KEY env var for stock photos.")

    js_text = PROJ_JS.read_text(encoding="utf-8")
    pid = next_id(js_text)
    entries = []
    import_lines = []
    imported_projects = 0

    for manifest_path in manifests:
        package_dir = manifest_path.parent
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        for project in manifest.get("projects", []):
            title = project.get("title", "").strip()
            desc = project.get("description", "").strip()
            if not title or not desc:
                print(f"Skipping incomplete project in {manifest_path}")
                continue

            project_slug = slugify(title)

            # --- Thumbnail ---
            thumb = project.get("thumbnail") or {}
            if thumb.get("dataUrl"):
                image_ref = write_embedded_file(
                    thumb, THUMBS, "thumbnails", f"{project_slug}-thumbnail"
                )
            elif thumb.get("url"):
                image_ref = thumb.get("url", "").strip()
            else:
                image_ref = copy_asset(package_dir, thumb.get("path", ""), THUMBS, "thumbnails")

            # --- Embed ---
            embed_ref = ""
            embed = project.get("embed") or {}
            if embed.get("kind") == "file" and embed.get("file", {}).get("dataUrl"):
                embed_ref = write_embedded_file(
                    embed.get("file"), CONTENT, "content", f"{project_slug}-content"
                )
            elif embed.get("kind") == "file":
                embed_ref = copy_asset(package_dir, embed.get("path", ""), CONTENT, "content")
            else:
                embed_ref = _normalize_embed(embed.get("url", "").strip())

            # --- Tags ---
            tags = []
            for tag in project.get("tags", []):
                clean = slugify(str(tag), "")
                if clean and clean not in tags:
                    tags.append(clean)

            # --- Auto-thumbnail if none was provided ---
            if not image_ref:
                image_ref = _auto_thumbnail(title, project.get("type", "data"), tags, project_slug)

            # --- Component ---
            comp = None
            if project.get("useCustomPage") or project.get("sections"):
                comp = unique_component(to_pascal(title))
                jsx = build_jsx(comp, project, embed_ref)
                (COMPONENTS / f"{comp}.jsx").write_text(jsx, encoding="utf-8")
                import_lines.append(f'import {comp} from "../content/{comp}";\n')

            entries.append(
                build_js_entry(
                    pid,
                    title,
                    project.get("type", "data"),
                    desc,
                    image_ref,
                    embed_ref,
                    tags,
                    comp,
                )
            )
            print(f"Prepared {title} as project ID {pid}")
            pid += 1
            imported_projects += 1

        if manifest_path.name == "manifest.json":
            (package_dir / ".imported").write_text(
                "Imported by import_project_exports.py\n", encoding="utf-8"
            )
        else:
            manifest_path.with_suffix(manifest_path.suffix + ".imported").write_text(
                "Imported by import_project_exports.py\n", encoding="utf-8"
            )

    if not entries:
        print("No complete projects were imported.")
        return 0

    for import_line in import_lines:
        if import_line not in js_text:
            last = list(re.finditer(r"^import .+;\n", js_text, re.MULTILINE))
            pos = last[-1].end() if last else 0
            js_text = js_text[:pos] + import_line + js_text[pos:]

    insert_at = js_text.rfind("];")
    if insert_at == -1:
        raise RuntimeError("Could not find the projects array closing marker in src/data/projects.js")

    js_text = js_text[:insert_at] + "\n" + ",\n\n".join(entries) + ",\n\n" + js_text[insert_at:]
    PROJ_JS.write_text(js_text, encoding="utf-8")
    print(f"Imported {imported_projects} project(s).")
    return imported_projects


if __name__ == "__main__":
    import_packages()
