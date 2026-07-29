#!/usr/bin/env python3
"""
Government job scraper for the GLOCAL newsletter Canadian provincial & federal job boards.
Output CSV columns: source, title, department/ministry, location, employment_type, Duration,
Closing Date, Salary, url

"Duration" is the job's term length (e.g. "6 months", "Summer") when a source states one.
"Closing Date" is the application deadline. These are never the same thing — several sources
(Nova Scotia, Manitoba, New Brunswick, Saskatchewan, Ontario, BC, federal, Senate) only expose
a deadline, not a term length, so it belongs in its own column rather than being mislabeled
as a duration.
"""

import csv
import glob
import os
import re
import sys
import time
import argparse
from dataclasses import dataclass
from typing import Optional, List, Dict
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

# ── Config ────────────────────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-CA,en;q=0.5",
}

SESSION = requests.Session()
SESSION.headers.update(HEADERS)

OUTPUT_CSV = "scraped_jobs.csv"
DELAY = 1.5
FIELDNAMES = [
    "source", "title", "department/ministry", "location",
    "employment_type", "Duration", "Closing Date", "Salary", "url",
]

YOUTH_KEYWORDS = {
    "student", "youth", "intern", "co-op", "coop", "summer", "junior",
    "entry", "graduate", "trainee", "apprentice", "cadet",
}

PROFESSIONAL_KEYWORDS = {
    "officer", "analyst", "coordinator", "technician", "specialist", "clerk",
    "advisor", "consultant", "researcher", "planner", "engineer", "scientist",
    "developer", "designer", "communications", "policy", "program", "project",
    "assistant", "representative", "inspector", "educator", "social worker",
    "health", "environment", "data", "information", "digital", "finance",
    "accounting", "legal", "operator", "nurse", "therapist", "manager",
    "supervisor", "geographer", "biologist", "economist", "writer", "editor",
    "translator", "interpreter", "auditor", "librarian", "historian",
}

SENIOR_KEYWORDS = {
    "ceo", "chief executive officer", "vice president", "vp",
    "director general", "deputy minister", "executive director",
    "senior director", "managing director", "associate deputy",
    "assistant deputy minister", "chief audit executive",
    "chief financial officer", "chief operating officer",
}

# Word-boundary senior/executive signals that SENIOR_KEYWORDS' exact phrases miss
# (e.g. "Senior Policy Analyst", "Principal Analyst", "Director, Internal Audit").
_SENIOR_TITLE_RE = re.compile(
    r'\b(senior|principal|chief|director|executive|president|superintendent)\b', re.I
)


def _word_match(text: str, keywords) -> bool:
    """
    True if any keyword/phrase appears in text as a whole word/phrase — not as a
    substring of a longer word. Plain "in" checks would let "intern" match inside
    "International" or "coop" match inside "cooperation"; this guards against that.
    """
    for kw in keywords:
        kw = kw.strip()
        if kw and re.search(r'(?<!\w)' + re.escape(kw) + r'(?!\w)', text, re.I):
            return True
    return False

# ── Data ──────────────────────────────────────────────────────────────────────

@dataclass
class Job:
    source: str = ""
    title: str = ""
    department: str = ""
    location: str = ""
    employment_type: str = ""
    duration: str = ""
    closing_date: str = ""
    salary: str = ""
    url: str = ""

    def to_dict(self) -> Dict:
        return {
            "source": self.source,
            "title": self.title,
            "department/ministry": self.department,
            "location": self.location,
            "employment_type": self.employment_type,
            "Duration": self.duration,
            "Closing Date": self.closing_date,
            "Salary": self.salary,
            "url": self.url,
        }

# ── Utilities ─────────────────────────────────────────────────────────────────

def clean(node) -> str:
    """Normalize whitespace; accepts a BS4 tag or plain string."""
    if node is None:
        return ""
    text = node.get_text(" ") if hasattr(node, "get_text") else str(node)
    return re.sub(r'\s+', ' ', text).strip()


def fetch(url: str, *, timeout: int = 20, params: dict = None) -> Optional[BeautifulSoup]:
    try:
        r = SESSION.get(url, params=params, timeout=timeout)
        r.raise_for_status()
        return BeautifulSoup(r.text, "html.parser")
    except Exception as exc:
        print(f"  [!] {url}: {exc}", file=sys.stderr)
        return None


def clean_location(loc: str) -> str:
    """Simplify Workday location format: 'SHUBENACADIE, NS, CA, B0N 2H0' -> 'Shubenacadie, NS'."""
    parts = [p.strip() for p in loc.split(",")]
    if len(parts) >= 3 and parts[2].strip().upper() in ("CA", "US"):
        city = parts[0].title()
        prov = parts[1].strip().upper()
        return f"{city}, {prov}"
    return loc


def extract_salary(text: str) -> str:
    m = re.search(
        r'\$[\d,]+(?:\.\d+)?(?:\s*(?:to|[-–])\s*\$[\d,]+(?:\.\d+)?)?'
        r'(?:\s*(?:per|/)\s*(?:hour|hr|year|yr|annum|week|wk))?',
        text, re.I,
    )
    return m.group(0).strip() if m else ""


def _salary_figures(salary: str):
    """Return (numbers found, is_hourly) from a salary string."""
    if not salary:
        return [], False
    is_hourly = bool(re.search(r'hour|/hr|\bhr\b', salary, re.I))
    nums = [float(n.replace(",", "")) for n in re.findall(r'[\d,]+(?:\.\d+)?', salary)]
    return nums, is_hourly


def score_youth_interest(job: Job) -> int:
    """
    Higher score = more relevant to GLOCAL's youth-focused newsletter audience.
    Rewards student/entry-level titles and lower/entry pay bands; penalizes
    senior, executive, and high-salary postings that read as career-track
    professional roles rather than youth opportunities.
    """
    t = job.title.lower()
    score = 0

    if _word_match(t, YOUTH_KEYWORDS):
        score += 8
    if _word_match(t, {"youth"}) and _word_match(t, {"employment", "program", "indigenous"}):
        score += 3
    if _word_match(t, PROFESSIONAL_KEYWORDS):
        score += 1

    if _word_match(t, SENIOR_KEYWORDS):
        score -= 12
    elif _SENIOR_TITLE_RE.search(t):
        score -= 9

    nums, hourly = _salary_figures(job.salary)
    if nums:
        top = max(nums)
        if hourly:
            if top <= 24:
                score += 3
            elif top >= 40:
                score -= 3
        else:
            if top <= 65_000:
                score += 3
            elif top <= 90_000:
                pass
            elif top <= 120_000:
                score -= 4
            else:
                score -= 8

    dur = job.duration.lower()
    if any(k in dur for k in ("summer", "month", "co-op", "term", "temporary", "student")):
        score += 1

    return score


def is_interesting(job: Job) -> bool:
    t = job.title.lower()
    if _word_match(t, SENIOR_KEYWORDS):
        return False
    if not (_word_match(t, YOUTH_KEYWORDS) or _word_match(t, PROFESSIONAL_KEYWORDS)):
        return False
    # Catches senior/high-salary roles that slip past the keyword filter above
    # (e.g. "Senior Policy Analyst" at $110k — matches "analyst" but isn't youth-relevant).
    return score_youth_interest(job) > -6

# ── Generic fallback ──────────────────────────────────────────────────────────

_JOB_TITLE_WORDS = YOUTH_KEYWORDS | PROFESSIONAL_KEYWORDS | {"director", "supervisor", "driver", "guard"}
_JOB_URL_WORDS   = {"job", "career", "posting", "position", "employ", "student", "competition", "vacancy"}
_SKIP_WORDS      = {
    # English navigation
    "privacy", "terms", "contact", "help", "about", "rss", "login",
    "sitemap", "translate", "accessibility", "disclaimer", "feedback",
    "copyright", "home", "search", "browse", "view all", "see all",
    "back to", "return to", "my account", "sign in", "register",
    "unsubscribe", "newsletter", "print", "share", "subscribe",
    # French navigation (Quebec site produces these)
    "francais", "français", "accès à", "impôts", "complémentaires",
    "informations et services", "travailler au gouvernement",
    "renseignements généraux",
}


def scrape_generic(source_name: str, url: str, limit: int = 20) -> List[Job]:
    """
    Fallback for sites with no custom parser.
    Restricts to main content area and only keeps links that look like job titles
    or point to job-related URLs — avoids nav/footer noise.
    """
    soup = fetch(url)
    if not soup:
        return []

    main = soup.select_one("main, #main-content, #content, .main-content, article")
    scope = main or soup

    seen: set = set()
    jobs: List[Job] = []

    for link in scope.find_all("a", href=True):
        text = clean(link)
        if not text or len(text) < 6 or len(text) > 200:
            continue

        href = link["href"]
        if href.startswith(("#", "mailto:", "javascript:", "tel:")):
            continue
        # Skip documents — these are never job postings
        if re.search(r'\.(pdf|doc|docx|xls|xlsx|zip)(\?|$)', href, re.I):
            continue

        tl = text.lower()
        hl = href.lower()

        if any(s in tl for s in _SKIP_WORDS):
            continue
        if not any(w in tl for w in _JOB_TITLE_WORDS):
            if not any(w in hl for w in _JOB_URL_WORDS):
                continue

        job_url = urljoin(url, href)
        if job_url in seen:
            continue
        seen.add(job_url)

        jobs.append(Job(source=source_name, title=text, url=job_url))
        if len(jobs) >= limit:
            break

    return jobs

# ── Playwright helpers ────────────────────────────────────────────────────────

def _find_chromium() -> str:
    """Locate the Playwright Chromium executable on Windows."""
    pattern = os.path.expanduser(
        r"~\AppData\Local\ms-playwright\chromium-*\chrome-win\chrome.exe"
    )
    matches = sorted(glob.glob(pattern))
    if matches:
        return matches[-1]
    raise FileNotFoundError(
        "Playwright Chromium not found. Run: python -m playwright install chromium"
    )


def _new_stealth_context(browser):
    """Return a browser context that doesn't announce itself as a bot."""
    ctx = browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
        ),
        viewport={"width": 1280, "height": 800},
        locale="en-CA",
        extra_http_headers={"Accept-Language": "en-CA,en;q=0.9"},
    )
    return ctx


def _pw_page(ctx):
    pg = ctx.new_page()
    pg.add_init_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    return pg


# ── Site-specific scrapers ────────────────────────────────────────────────────

def scrape_nova_scotia(limit: int = 30) -> List[Job]:
    """jobs.novascotia.ca — Drupal Views table: Title | Department | Location | Closing Date."""
    base = "https://jobs.novascotia.ca"
    jobs: List[Job] = []

    for path in ["/search/", "/"]:
        soup = fetch(base + path)
        if not soup:
            continue

        for row in soup.select("table tbody tr, .views-row"):
            link = row.find("a", href=True)
            if not link:
                continue
            title = clean(link)
            if not title or len(title) < 4:
                continue

            href = link["href"]
            job_url = urljoin(base, href) if href.startswith("/") else href

            cells = row.find_all("td")
            # NS Jobs table: [0]=Title, [1]=Department, [2]=Location, [3]=Closing Date
            dept     = clean(cells[1]) if len(cells) > 1 else ""
            raw_loc  = clean(cells[2]) if len(cells) > 2 else ""
            location = clean_location(raw_loc)
            closing  = clean(cells[3]) if len(cells) > 3 else ""
            salary   = extract_salary(clean(cells[4])) if len(cells) > 4 else ""

            jobs.append(Job(
                source="Nova Scotia",
                title=title, department=dept, location=location,
                closing_date=closing, salary=salary,
                url=job_url,
            ))

        if jobs:
            break

    return jobs[:limit]


def _gojobs_field(text: str, label: str) -> str:
    """Extract value after a label line like 'Organization:' in GoJobs text."""
    m = re.search(rf'{re.escape(label)}:\s*\n\s*(.+?)(?:\n|$)', text, re.M)
    return m.group(1).strip() if m else ""


def scrape_ontario(limit: int = 30) -> List[Job]:
    """gojobs.gov.on.ca — uses Playwright to bypass Radware bot check and render jobs."""
    base = "https://www.gojobs.gov.on.ca"
    jobs: List[Job] = []

    try:
        from playwright.sync_api import sync_playwright
        exe = _find_chromium()

        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path=exe, headless=True,
                args=["--disable-blink-features=AutomationControlled"],
            )
            ctx = _new_stealth_context(browser)
            pg = _pw_page(ctx)

            pg.goto(f"{base}/Search.aspx", timeout=30000)
            time.sleep(2)
            pg.click("#ctl00_MainContent_btnSearch")
            time.sleep(6)

            for link in pg.query_selector_all("a.job-link"):
                title = re.sub(r'\s*\(\d+\)\s*$', '', link.inner_text()).strip()
                href = link.get_attribute("href") or ""
                job_url = urljoin(base, href)

                container = link.evaluate_handle(
                    "el => { let p = el;"
                    " while (p && !(p.tagName === 'DIV' && p.className &&"
                    "  p.className.includes('ontario-column ontario-medium-11')))"
                    "  p = p.parentElement;"
                    " return p; }"
                )
                raw = container.evaluate("el => el.innerText")

                jobs.append(Job(
                    source="Government of Ontario",
                    title=title,
                    department=_gojobs_field(raw, "Organization"),
                    location=_gojobs_field(raw, "Location"),
                    closing_date=_gojobs_field(raw, "Closing Date"),
                    salary=_gojobs_field(raw, "Salary"),
                    url=job_url,
                ))

            browser.close()

    except Exception as exc:
        print(f"  [!] Playwright error (ontario): {exc}", file=sys.stderr)

    return jobs[:limit]


def scrape_manitoba(limit: int = 30) -> List[Job]:
    """jobsearch.gov.mb.ca — public 'All Positions' RSS feed (no browser needed).
    Each <item> description packs labeled fields as '<strong>Label</strong>: value<br/>'."""
    feed_url = "https://jobsearch.gov.mb.ca/rss/newJobPostingsFeed.rss"
    jobs: List[Job] = []

    try:
        r = SESSION.get(feed_url, timeout=20)
        r.raise_for_status()
        soup = BeautifulSoup(r.content, "xml")
    except Exception as exc:
        print(f"  [!] {feed_url}: {exc}", file=sys.stderr)
        return jobs

    for item in soup.find_all("item"):
        title = clean(item.find("title"))
        link = clean(item.find("link"))
        if not title or not link:
            continue

        desc_node = item.find("description")
        desc_text = desc_node.text if desc_node else ""
        fields = {
            k.strip(): re.sub(r'\s+', ' ', v).strip()
            for k, v in re.findall(r'<strong>(.*?)</strong>:\s*(.*?)<br\s*/?>', desc_text, re.S)
        }

        jobs.append(Job(
            source="Manitoba",
            title=title,
            department=fields.get("Department", ""),
            location=fields.get("Location(s)", ""),
            employment_type=fields.get("Job Type(s)", ""),
            closing_date=fields.get("Closing Date", ""),
            salary=extract_salary(fields.get("Salary(s)", "")),
            url=link,
        ))

        if len(jobs) >= limit:
            break

    return jobs


_NB_DEPT_CODES = {
    "DTI": "Transportation and Infrastructure",
    "PETL": "Post-Secondary Education, Training and Labour",
    "DOH": "Health",
    "JPS": "Justice and Public Safety",
    "FIN": "Finance and Treasury Board",
    "ENV": "Environment and Local Government",
    "AGR": "Agriculture, Aquaculture and Fisheries",
    "TCA": "Tourism, Heritage and Culture",
    "SD": "Social Development",
    "GNB": "Service New Brunswick",
    "ECE": "Education and Early Childhood Development",
    "NBCC": "New Brunswick Community College",
    "NB": "Government of New Brunswick",
}


def scrape_new_brunswick(limit: int = 30) -> List[Job]:
    """ere.gnb.ca — New Brunswick ASP.NET competition listings.
    Table columns: [0]=Title(link), [1]=CompetitionNo, [2]=DeptCode, [3]=Location, [4]=ClosingDate
    """
    base = "https://www.ere.gnb.ca"
    jobs: List[Job] = []

    soup = fetch(f"{base}/competition.aspx")
    if not soup:
        return jobs

    for row in soup.select("table tr, .GridViewRow"):
        cells = row.find_all("td")
        link = row.find("a", href=True)
        if not link or len(cells) < 2:
            continue
        title = clean(link)
        if not title or len(title) < 4:
            continue
        if title.lower() in ("competition", "position", "title", "status", "type"):
            continue

        href = link["href"]
        # NB uses __doPostBack — build a direct URL from competition number instead
        competition_no = clean(cells[1]) if len(cells) > 1 else ""
        if competition_no:
            job_url = f"{base}/competition.aspx?ID={competition_no}"
        elif not href.startswith("javascript:"):
            job_url = urljoin(base, href)
        else:
            job_url = f"{base}/competition.aspx"

        dept_code = clean(cells[2]) if len(cells) > 2 else ""
        dept = _NB_DEPT_CODES.get(dept_code, dept_code)
        location = clean(cells[3]) if len(cells) > 3 else ""
        closing = clean(cells[4]) if len(cells) > 4 else ""

        jobs.append(Job(
            source="New Brunswick",
            title=title,
            department=dept,
            location=location,
            closing_date=closing,
            url=job_url,
        ))

    return jobs[:limit]


def scrape_nunavut(limit: int = 20) -> List[Job]:
    """
    gov.nu.ca/en/careers/jobs is gated by a Cloudflare Turnstile "managed challenge" —
    not a plain 403. It doesn't clear even with a stealth Playwright browser (other
    pages on the same site, e.g. /human-resources, load fine — only the jobs listing
    path is protected this way). Solving that challenge would mean defeating a CAPTCHA,
    which we don't attempt. We detect the block and back off cleanly so the curated
    Nunavut posting in DIRECT_JOBS is what represents this source instead.
    """
    url = "https://www.gov.nu.ca/en/careers/jobs"
    try:
        r = SESSION.get(url, timeout=15)
        if r.status_code == 403 or "Just a moment" in r.text[:2000]:
            print(f"  [!] Nunavut jobs page is behind a Cloudflare challenge (blocked) — "
                  f"relying on curated DIRECT_JOBS entry instead", file=sys.stderr)
            return []
        r.raise_for_status()
    except Exception as exc:
        print(f"  [!] {url}: {exc}", file=sys.stderr)
        return []

    soup = BeautifulSoup(r.text, "html.parser")
    main = soup.select_one("main, #main-content, #content") or soup
    jobs: List[Job] = []
    seen: set = set()

    for link in main.find_all("a", href=True):
        href = link["href"]
        if href.startswith(("#", "mailto:", "javascript:", "tel:")):
            continue
        text = clean(link)
        if not text or len(text) < 6 or len(text) > 200:
            continue
        job_url = urljoin(url, href)
        if job_url in seen:
            continue
        seen.add(job_url)
        jobs.append(Job(source="Nunavut", title=text, url=job_url))
        if len(jobs) >= limit:
            break

    return jobs


def _parse_nwt_title(text: str):
    """NWT link text format: '{Title} $Xk - $Yk {City} Closes: {date}'
    Returns (title, salary, location, closing_date). The trailing "Closes: {date}"
    (or "Open until filled") is an application deadline, not a job term length.
    """
    m = re.search(r'\$(\d+k?)\s*[-–]\s*\$(\d+k?)', text, re.I)
    if not m:
        return text, "", "", ""

    title = text[:m.start()].strip()
    sal_min = m.group(1).upper().replace("K", ",000")
    sal_max = m.group(2).upper().replace("K", ",000")
    salary = f"${sal_min} - ${sal_max}"

    remainder = text[m.end():].strip()
    closes_m = re.search(r'Closes?:?\s*(.+)$', remainder, re.I)
    open_m = re.search(r'Open until filled', remainder, re.I)

    if closes_m:
        location = remainder[:closes_m.start()].strip()
        closing_date = closes_m.group(1).strip()
    elif open_m:
        location = remainder[:open_m.start()].strip()
        closing_date = "Open until filled"
    else:
        location = remainder
        closing_date = ""

    return title, salary, location, closing_date


def scrape_nwt(limit: int = 20) -> List[Job]:
    """gov.nt.ca — NWT careers page; salary/location are embedded in each link's text."""
    url = "https://www.gov.nt.ca/careers/en"
    soup = fetch(url)
    if not soup:
        return []

    main = soup.select_one("main, #main-content, #content") or soup
    jobs: List[Job] = []
    seen: set = set()

    for link in main.find_all("a", href=True):
        href = link["href"]
        if "/job/" not in href and "careers" not in href:
            continue
        if href.startswith(("#", "mailto:", "javascript:")):
            continue

        text = clean(link)
        if not text or len(text) < 6:
            continue

        job_url = urljoin(url, href)
        if job_url in seen:
            continue
        seen.add(job_url)

        title, salary, location, closing_date = _parse_nwt_title(text)

        jobs.append(Job(
            source="Northwest Territories",
            title=title, salary=salary, location=location, closing_date=closing_date,
            url=job_url,
        ))
        if len(jobs) >= limit:
            break

    return jobs

def scrape_yukon(limit: int = 20) -> List[Job]:
    return scrape_generic("Yukon", "https://yukon.ca/en/employment", limit)

def scrape_pei(limit: int = 20) -> List[Job]:
    return scrape_generic("Prince Edward Island", "https://www.princeedwardisland.ca/en/topic/jobs", limit)

def scrape_nl(limit: int = 20) -> List[Job]:
    return scrape_generic("Newfoundland and Labrador", "https://www.gov.nl.ca/exec/tbs/working-with-us/", limit)

def scrape_saskatchewan(limit: int = 30) -> List[Job]:
    """careers.saskatchewan.ca — Oracle Recruiting Cloud public JSON API (no browser needed).
    Old Taleo career-section URLs (govskpsc.taleo.net) are dead; the province migrated to Oracle."""
    api_url = (
        "https://fa-evgd-saasfaprod1.fa.ocs.oraclecloud.com/hcmRestApi/resources/latest/"
        "recruitingCEJobRequisitions?onlyData=true&expand=requisitionList.secondaryLocations"
        f"&finder=findReqs;siteNumber=CX_1,facetsList=NONE,limit={max(limit, 25)},sortBy=POSTING_DATES_DESC"
    )
    jobs: List[Job] = []

    try:
        r = SESSION.get(api_url, timeout=20)
        r.raise_for_status()
        data = r.json()
    except Exception as exc:
        print(f"  [!] {api_url}: {exc}", file=sys.stderr)
        return jobs

    reqs = (data.get("items") or [{}])[0].get("requisitionList", [])
    for req in reqs:
        dept = re.sub(r'^\d+\s*', '', req.get("BusinessUnit") or "")
        jobs.append(Job(
            source="Saskatchewan",
            title=req.get("Title", ""),
            department=dept,
            location=req.get("PrimaryLocation", ""),
            closing_date=req.get("PostingEndDate", ""),
            url=f"https://careers.saskatchewan.ca/en/sites/CX_1/job/{req.get('Id')}",
        ))
        if len(jobs) >= limit:
            break

    return jobs


def scrape_bc(limit: int = 30) -> List[Job]:
    """bcpublicservice.hua.hrsmart.com — HRSmart ATS. The results table only appears
    after the Search button fires client-side, so this uses Playwright to click it,
    then parses the rendered table like a normal HTML scrape."""
    base = "https://bcpublicservice.hua.hrsmart.com"
    jobs: List[Job] = []
    html = None

    try:
        from playwright.sync_api import sync_playwright
        exe = _find_chromium()

        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path=exe, headless=True,
                args=["--disable-blink-features=AutomationControlled"],
            )
            ctx = _new_stealth_context(browser)
            pg = _pw_page(ctx)

            pg.goto(f"{base}/hr/ats/JobSearch/index", timeout=30000)
            time.sleep(2)
            pg.click("#field_search_jobs")
            time.sleep(6)
            html = pg.content()

            browser.close()

    except Exception as exc:
        print(f"  [!] Playwright error (bc): {exc}", file=sys.stderr)
        return jobs

    if not html:
        return jobs

    soup = BeautifulSoup(html, "html.parser")
    table = soup.select_one("#jobSearchResultsGrid_table")
    if not table:
        return jobs

    seen: set = set()
    for row in table.select("tbody tr"):
        cells = row.find_all("td")
        if len(cells) < 8:
            continue
        link = cells[2].find("a", href=True)
        title = clean(link)
        if not link or not title:
            continue

        job_url = urljoin(base, link["href"])
        if job_url in seen:
            continue
        seen.add(job_url)

        location = ", ".join(cells[5].stripped_strings)

        jobs.append(Job(
            source="British Columbia",
            title=title,
            department=clean(cells[0]),
            location=location,
            employment_type=clean(cells[4]),
            # Column 7 in this HRSmart grid is "Close Date", not a job term length.
            closing_date=clean(cells[7]),
            url=job_url,
        ))
        if len(jobs) >= limit:
            break

    return jobs


def scrape_alberta(limit: int = 20) -> List[Job]:
    # Alberta uses Taleo for actual listings (JS-rendered). The main resource page
    # and student opportunities page are accessible as plain HTML.
    for url in [
        "https://www.alberta.ca/internships-and-student-employment",
        "https://www.alberta.ca/government-of-alberta-jobs",
    ]:
        jobs = scrape_generic("Alberta", url, limit)
        if jobs:
            return jobs
    return []


def scrape_quebec(limit: int = 20) -> List[Job]:
    for url in [
        "https://www.carrieres.gouv.qc.ca/chercher-un-emploi",
        "https://www.carrieres.gouv.qc.ca/emplois",
        "https://www.carrieres.gouv.qc.ca/",
    ]:
        jobs = scrape_generic("Quebec", url, limit)
        if jobs:
            return jobs
    return []


def scrape_house_of_commons(limit: int = 30) -> List[Job]:
    """House of Commons — postings live in SmartRecruiters, which exposes a public
    JSON API (no Playwright needed). Each posting is published twice (EN + FR);
    keep English only. Salary isn't in the list API, so it stays blank unless
    --enrich fills it from the public posting page.
    """
    api = ("https://api.smartrecruiters.com/v1/companies/"
           "HouseOfCommonsCanadaChambreDesCommunesCanada/postings")
    public_base = ("https://jobs.smartrecruiters.com/"
                   "HouseOfCommonsCanadaChambreDesCommunesCanada")
    jobs: List[Job] = []

    try:
        r = SESSION.get(api, timeout=20)
        r.raise_for_status()
        postings = r.json().get("content", [])
    except Exception as exc:
        print(f"  [!] {api}: {exc}", file=sys.stderr)
        return jobs

    for p in postings:
        lang = (p.get("language") or {}).get("code", "en")
        if not lang.startswith("en"):
            continue

        loc = p.get("location") or {}
        location = ", ".join(x for x in (loc.get("city"), loc.get("region")) if x)
        if loc.get("hybrid"):
            location = f"{location} (Hybrid)" if location else "Hybrid"

        dept = (p.get("department") or {}).get("label", "")
        emp_type = (p.get("typeOfEmployment") or {}).get("label", "")

        jobs.append(Job(
            source="House of Commons",
            title=clean(p.get("name", "")),
            department=dept,
            location=location,
            employment_type=emp_type,
            url=f"{public_base}/{p['id']}",
        ))
        if len(jobs) >= limit:
            break

    return jobs


def scrape_senate(limit: int = 30) -> List[Job]:
    """Senate of Canada — sencanada.hiringplatform.ca renders plain HTML.
    Each posting is a link to /processes/{uuid}; its surrounding card carries
    'Closing Date: ...'. The detail page is fetched for salary/division since
    there are only a handful of postings at a time.
    """
    base = "https://sencanada.hiringplatform.ca"
    listing = f"{base}/list/CurrentOpportunities?page=joblisting&clid=21004&lang=1"
    jobs: List[Job] = []
    seen: set = set()

    soup = fetch(listing)
    if not soup:
        return jobs

    for link in soup.find_all("a", href=re.compile(r"/processes/")):
        title = clean(link)
        if not title or len(title) < 4:
            continue
        job_url = urljoin(base, link["href"])
        if job_url in seen:
            continue
        seen.add(job_url)

        job = Job(source="Senate of Canada", title=title, location="Ottawa, ON", url=job_url)

        # Detail page carries labeled fields in sequence:
        #   Directorate: X Classification: SEN n: $lo - $hi Job Type: Y
        #   Location: L Closing Date: Day, Month D, YYYY
        detail = fetch(job_url, timeout=15)
        if detail:
            text = clean(detail.select_one("main, #content, .content") or detail)

            def _field(label, stop):
                m = re.search(rf'{label}:\s*(.+?)\s*(?:{stop}):', text)
                return m.group(1).strip() if m else ""

            job.department       = _field("Directorate", "Classification|Job Type")
            job.employment_type  = _field("Job Type", "Location|Closing Date")
            job.salary           = extract_salary(_field("Classification", "Job Type|Location"))
            m = re.search(r'Closing Date:\s*(\w+, \w+ \d{1,2}, \d{4})', text)
            if m:
                job.closing_date = m.group(1)
            loc = _field("Location", "Closing Date")
            if loc:
                job.location = re.sub(r',\s*Canada$', '', loc).replace(", Ontario", ", ON")
        time.sleep(DELAY)

        jobs.append(job)
        if len(jobs) >= limit:
            break

    return jobs


def _parse_gc_result(text: str) -> dict:
    """
    Parse the innerText of a li.searchResult. Format per entry:
        {Title}
        [Optional: Program stream name]
        Closing date: YYYY-MM-DD
        {Department} [- sub-unit]
        {City (Province)}\t{Language}
        [{Salary}]
    """
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]
    closing = dept = location = salary = ""

    for i, line in enumerate(lines):
        if line.startswith("Closing date:"):
            closing = line[len("Closing date:"):].strip()
            if i + 1 < len(lines):
                dept = lines[i + 1]
            if i + 2 < len(lines):
                loc_raw = lines[i + 2].split("\t")[0].strip()
                # Keep only "City (Province)" part, drop parenthetical duplicates
                location = re.sub(r'\(International\)\s*\(International\)', '(International)', loc_raw)
        elif line.startswith("$") or re.search(r'\d+\s*(per hour|to \$)', line, re.I):
            # Grab only the dollar-amount part, drop long parenthetical notes
            sal_raw = line.split("\t")[0].strip()
            sal_m = re.match(r'(\$[\d,.]+(?: to \$[\d,.]+)?(?:\s*per hour|\s*per year)?)', sal_raw, re.I)
            salary = sal_m.group(1).strip() if sal_m else sal_raw[:80]

    return {"closing": closing, "dept": dept, "location": location, "salary": salary}


def scrape_federal(limit: int = 30) -> List[Job]:
    """Government of Canada public service jobs — uses Playwright to search GC Jobs."""
    base = "https://emploisfp-psjobs.cfp-psc.gc.ca"
    search_url = f"{base}/psrs-srfp/applicant/page2440"
    jobs: List[Job] = []
    seen: set = set()

    try:
        from playwright.sync_api import sync_playwright
        exe = _find_chromium()

        with sync_playwright() as p:
            browser = p.chromium.launch(
                executable_path=exe, headless=True,
                args=["--disable-blink-features=AutomationControlled"],
            )
            ctx = _new_stealth_context(browser)
            pg = _pw_page(ctx)

            for keyword in ["student", "youth", "intern", "co-op", "junior", "new graduate"]:
                pg.goto(search_url, timeout=30000)
                time.sleep(2)
                pg.fill("#title", keyword)
                pg.click("#search")
                time.sleep(5)

                for result in pg.query_selector_all("li.searchResult"):
                    link = result.query_selector("a[href*=page1800], a[href*=page01]")
                    if not link:
                        continue
                    href = link.get_attribute("href") or ""
                    job_url = urljoin(base, href)
                    if job_url in seen:
                        continue
                    seen.add(job_url)

                    title = link.inner_text().strip()
                    fields = _parse_gc_result(result.inner_text())

                    jobs.append(Job(
                        source="Government of Canada",
                        title=title,
                        department=fields["dept"],
                        location=fields["location"],
                        closing_date=fields["closing"],
                        salary=fields["salary"],
                        url=job_url,
                    ))

                time.sleep(DELAY)
                if len(jobs) >= limit:
                    break

            browser.close()

    except Exception as exc:
        print(f"  [!] Playwright error (federal): {exc}", file=sys.stderr)

    return jobs[:limit]


# ── Job detail enrichment ─────────────────────────────────────────────────────

_DEPT_RE     = re.compile(r'(?:ministry|department|division|branch|organization|employer)\s*[:\-]\s*([^\n|<]{3,80})', re.I)
_LOCATION_RE = re.compile(r'(?:location|city|region|work location|workplace)\s*[:\-]\s*([^\n|<]{3,80})', re.I)
_TYPE_RE     = re.compile(r'(?:employment type|job type|appointment type|type of employment)\s*[:\-]\s*([^\n|<]{3,60})', re.I)
_DURATION_RE = re.compile(r'(?:duration|term length|contract length|assignment length)\s*[:\-]\s*([^\n|<]{3,60})', re.I)
_CLOSING_DATE_RE = re.compile(r'(?:closing date|close date|deadline|apply by|application deadline)\s*[:\-]\s*([^\n|<]{3,60})', re.I)
_SALARY_RE   = re.compile(
    r'\$[\d,]+(?:\.\d+)?(?:\s*(?:to|[-–])\s*\$[\d,]+(?:\.\d+)?)?'
    r'(?:\s*(?:per|/)\s*(?:hour|hr|year|yr|annum|week|wk))?', re.I,
)


def enrich_job(job: Job) -> Job:
    """Fetch the job detail page and fill in any blank fields."""
    if not job.url:
        return job
    soup = fetch(job.url, timeout=15)
    if not soup:
        return job

    main = soup.select_one("main, #content, #main-content, .job-details, article")
    text = clean(main or soup)

    def _find(pattern):
        m = pattern.search(text)
        return m.group(1).strip()[:120] if m else ""

    if not job.department:    job.department    = _find(_DEPT_RE)
    if not job.location:      job.location      = _find(_LOCATION_RE)
    if not job.duration:      job.duration      = _find(_DURATION_RE)
    if not job.closing_date:  job.closing_date  = _find(_CLOSING_DATE_RE)
    if not job.salary:
        m = _SALARY_RE.search(text)
        job.salary = m.group(0).strip() if m else ""
    if not job.employment_type:
        job.employment_type = _find(_TYPE_RE)
        if not job.employment_type:
            if re.search(r'\bfull[- ]time\b', text, re.I):          job.employment_type = "Full-time"
            elif re.search(r'\bpart[- ]time\b', text, re.I):        job.employment_type = "Part-time"
            elif re.search(r'\bseasonal\b|\bsummer\b', text, re.I): job.employment_type = "Seasonal"
            elif re.search(r'\bcontract\b|\bterm\b', text, re.I):   job.employment_type = "Contract"

    return job


# ── Curated jobs from notes.txt ───────────────────────────────────────────────

DIRECT_JOBS: List[Job] = [
    Job(source="Alberta",
        title="2026 Summer Student Opportunities",
        department="Government of Alberta",
        location="Various, Alberta",
        employment_type="Full time - Temporary",
        duration="2-4 Months",
        salary="Starting at $21.27/hour",
        url="https://jobpostings.alberta.ca/job/Various-2026-Summer-Student-Opportunities/599010717/"),
    Job(source="British Columbia",
        title="Customer Service Representative",
        department="Service BC",
        location="Courtenay, BC",
        employment_type="Full time",
        salary="$57,700 - $65,135.00",
        url="https://bcpublicservice.hua.hrsmart.com/hr/ats/Posting/view/122938"),
    Job(source="Government of Ontario",
        title="Court and Client Representative",
        department="Ministry of the Attorney General",
        location="Brampton, ON",
        employment_type="Full time - Temporary",
        duration="6 months",
        salary="$29.53 - $34.75/hr",
        url="https://www.gojobs.gov.on.ca/Preview.aspx?Language=English&JobID=243492"),
    Job(source="Government of Ontario",
        title="Student Summer Jobs at Ontario Parks",
        department="Ministry of the Environment, Conservation and Parks",
        location="Various, Ontario",
        employment_type="Various",
        duration="Summer",
        salary="$17.60 - $18.45/hr",
        url="https://www.gojobs.gov.on.ca/Preview.aspx?Language=English&JobID=239417"),
    Job(source="Government of Ontario",
        title="2026 Summer Law Student",
        department="Ministry of the Attorney General",
        location="Toronto, Ontario",
        employment_type="Various",
        duration="4 Months",
        salary="$1,078.44/week",
        url="https://www.gojobs.gov.on.ca/Preview.aspx?Language=English&JobID=243452"),
    Job(source="Defence Construction Canada",
        title="Technical Specialist, Project Management",
        department="Defence Construction Canada",
        location="Bagotville, Quebec",
        employment_type="Full Time",
        salary="$79,067 - $102,788",
        url="https://phh.tbe.taleo.net/phh04/ats/careers/v2/viewRequisition?org=DEFENCECONSTRUCTIONCANADA&cws=47&rid=7607"),
    Job(source="Government of Nunavut",
        title="2026 Tuglirijavut Student Employment Program",
        department="All departments",
        location="Kitikmeot Region, Kivalliq Region, Qikiqtaaluk, Iqaluit",
        employment_type="Various",
        duration="Various",
        salary="Varies",
        url="https://www.gov.nu.ca/en/jobs/new-2026-tuglirijavut-student-employment-program-iqaluit/604"),
]


# ── Orchestration ─────────────────────────────────────────────────────────────

SCRAPERS: Dict = {
    "federal":       scrape_federal,
    "house_of_commons": scrape_house_of_commons,
    "senate":        scrape_senate,
    "nova_scotia":   scrape_nova_scotia,
    "ontario":       scrape_ontario,
    "manitoba":      scrape_manitoba,
    "new_brunswick": scrape_new_brunswick,
    "nunavut":       scrape_nunavut,
    "nwt":           scrape_nwt,
    "yukon":         scrape_yukon,
    "pei":           scrape_pei,
    "nl":            scrape_nl,
    "saskatchewan":  scrape_saskatchewan,
    "bc":            scrape_bc,
    "alberta":       scrape_alberta,
    "quebec":        scrape_quebec,
}

PROVINCE_ALIASES: Dict = {
    "house of commons": "house_of_commons",
    "hoc": "house_of_commons",
    "commons": "house_of_commons",
    "senate of canada": "senate",
    "british columbia": "bc",
    "new brunswick": "new_brunswick",
    "nova scotia": "nova_scotia",
    "northwest territories": "nwt",
    "newfoundland": "nl",
    "newfoundland and labrador": "nl",
    "prince edward island": "pei",
}


def write_csv(jobs: List[Job], path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        for job in jobs:
            writer.writerow(job.to_dict())
    print(f"Wrote {len(jobs)} jobs to {path}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Scrape Canadian government jobs for GLOCAL newsletter",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"Available province keys: {', '.join(SCRAPERS)}",
    )
    parser.add_argument("--province", action="append", dest="provinces",
                        help="Province(s) to scrape — repeat for multiple")
    parser.add_argument("--output",    default=OUTPUT_CSV)
    parser.add_argument("--limit",     type=int, default=25, help="Max jobs per source (default 25)")
    parser.add_argument("--enrich",    action="store_true",
                        help="Fetch each job's detail page to fill missing fields (slower)")
    parser.add_argument("--all",       action="store_true",
                        help="Skip the youth/entry-level interest filter")
    parser.add_argument("--no-direct", action="store_true",
                        help="Skip the curated direct job list from notes")
    args = parser.parse_args()

    selected = SCRAPERS.copy()
    if args.provinces:
        selected = {}
        for p in args.provinces:
            key = PROVINCE_ALIASES.get(p.lower().strip(),
                                       p.lower().replace(" ", "_").replace("-", "_"))
            if key in SCRAPERS:
                selected[key] = SCRAPERS[key]
            else:
                print(f"[!] Unknown province '{p}'. Available: {', '.join(SCRAPERS)}")

    direct_jobs: List[Job] = list(DIRECT_JOBS) if not args.no_direct else []
    if direct_jobs:
        print(f"Loaded {len(direct_jobs)} curated jobs from notes")

    scraped_jobs: List[Job] = []

    for name, fn in selected.items():
        print(f"Scraping {name}...")
        try:
            jobs = fn(limit=args.limit)
        except Exception as exc:
            print(f"  [!] {exc}", file=sys.stderr)
            jobs = []

        if not args.all:
            before = len(jobs)
            jobs = [j for j in jobs if is_interesting(j)]
            print(f"  {len(jobs)} interesting jobs ({before - len(jobs)} skipped)")
        else:
            print(f"  {len(jobs)} found")

        if args.enrich and jobs:
            print(f"  Enriching {len(jobs)} jobs...")
            for i, job in enumerate(jobs):
                jobs[i] = enrich_job(job)
                time.sleep(DELAY)

        scraped_jobs.extend(jobs)
        time.sleep(DELAY)

    # Rank scraped jobs by youth relevance so the most interesting postings lead each
    # newsletter; curated picks from notes.txt stay pinned at the top since they're
    # hand-vetted already.
    scraped_jobs.sort(key=score_youth_interest, reverse=True)
    all_jobs = direct_jobs + scraped_jobs

    print(f"\nTotal: {len(all_jobs)} jobs")
    write_csv(all_jobs, args.output)


if __name__ == "__main__":
    main()
