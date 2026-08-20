import React, { Suspense, lazy, useMemo, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import TopBar from "./components/TopBar";
import CardGrid from "./components/CardGrid";
import ProjectView from "./components/ProjectView";
import DiscoveryHub from "./components/DiscoveryHub";
import projectsData from "./data/projects";
import { getFilterOptions, parseFilterParams } from "./api/projects";
import "./App.css";

const TagTool       = lazy(() => import("./components/TagTool"));
const SecretRepo    = lazy(() => import("./components/SecretRepo"));
const SubmitProject = lazy(() => import("./components/SubmitProject"));
const JobsBoard     = lazy(() => import("./components/JobsBoard"));

const PROVINCE_TAGS = {
  "british-columbia":   "British Columbia",
  "ontario":            "Ontario",
  "alberta":            "Alberta",
  "manitoba":           "Manitoba",
  "quebec":             "Quebec",
  "nova-scotia":        "Nova Scotia",
  "nunavut":            "Nunavut",
  "northwest-territories": "Northwest Territories",
  "new-brunswick":      "New Brunswick",
  "saskatchewan":       "Saskatchewan",
  "prince-edward-island": "Prince Edward Island",
  "newfoundland":       "Newfoundland & Labrador",
  "yukon":              "Yukon",
};

const typeOptions = ["report", "data", "interactive", "events"];

// ── URL filter sync (?type=&cohort=&category=&province=, slug or exact value) ─
const FILTER_OPTIONS = getFilterOptions();

function resolveFilterValues(options, rawValues) {
  return rawValues
    .map((raw) => options.find((o) => o.slug === raw.toLowerCase() || o.value === raw || o.tag === raw))
    .filter(Boolean)
    .map((o) => o.value);
}

function filtersFromQuery(query) {
  const parsed = parseFilterParams(query);
  return {
    types: resolveFilterValues(FILTER_OPTIONS.types, parsed.types),
    cohorts: resolveFilterValues(FILTER_OPTIONS.cohorts, parsed.cohorts),
    categories: resolveFilterValues(FILTER_OPTIONS.categories, parsed.categories),
    provinces: resolveFilterValues(FILTER_OPTIONS.provinces, parsed.provinces),
  };
}

function slugFor(options, value) {
  return options.find((o) => o.value === value)?.slug ?? value;
}

// ── Hash routing helpers ──────────────────────────────────────────────────────
const parseHash = () => {
  const rawHash = window.location.hash.slice(1);
  const [path, query] = rawHash.split('?');
  if (path.startsWith('/project/')) {
    const id = parseInt(path.slice('/project/'.length), 10);
    const project = projectsData.find(p => p.id === id) ?? null;
    return { view: 'grid', selectedProject: project, filters: null };
  }
  if (path === '/overview' || path === '') return { view: 'home', selectedProject: null, filters: null };
  if (path === '/tag-tool') return { view: 'tag-tool', selectedProject: null, filters: null };
  if (path === '/submit') return { view: 'submit', selectedProject: null, filters: null };
  if (path === '/super-secret-repo') return { view: 'super-secret-repo', selectedProject: null, filters: null };
  if (path.startsWith('/jobs-board')) return { view: 'jobs-board', selectedProject: null, filters: null };
  return { view: 'grid', selectedProject: null, filters: query ? filtersFromQuery(query) : null };
};

function App() {
  const initial = parseHash();
  const [view, setView]                       = useState(initial.view);
  const [selectedProject, setSelectedProject] = useState(initial.selectedProject);
  const [activeTypes, setActiveTypes]           = useState(initial.filters?.types ?? []);
  const [activeCategories, setActiveCategories] = useState(initial.filters?.categories ?? []);
  const [activeCohorts, setActiveCohorts]       = useState(initial.filters?.cohorts ?? []);
  const [activeProvinces, setActiveProvinces]   = useState(initial.filters?.provinces ?? []);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(d => !d);

  // ── Document title ────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = selectedProject
      ? `${selectedProject.title} — GLOCAL`
      : 'GLOCAL • Open Source Projects';
  }, [selectedProject]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape' && selectedProject) handleBack();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  // ── Filters ───────────────────────────────────────────────────────────────
  const categoryOptions = useMemo(() => {
    const cats = new Set();
    projectsData.forEach((p) => { if (p.category) cats.add(p.category); });
    return Array.from(cats).sort((a, b) => a.localeCompare(b));
  }, []);

  const cohortOptions = useMemo(() => {
    const cs = new Set();
    projectsData.forEach((p) => { if (p.cohort) cs.add(p.cohort); });
    return Array.from(cs).sort((a, b) => a.localeCompare(b));
  }, []);

  const toggleType = (t) =>
    setActiveTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const toggleCategory = (c) =>
    setActiveCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const provinceOptions = useMemo(() => {
    const found = new Set();
    projectsData.forEach((p) => {
      (p.tags || []).forEach((t) => { if (PROVINCE_TAGS[t]) found.add(PROVINCE_TAGS[t]); });
    });
    return Array.from(found).sort((a, b) => a.localeCompare(b));
  }, []);

  const toggleCohort = (c) =>
    setActiveCohorts((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const toggleProvince = (p) =>
    setActiveProvinces((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const clearAllFilters = () => { setActiveTypes([]); setActiveCategories([]); setActiveCohorts([]); setActiveProvinces([]); };

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const typeMatch     = activeTypes.length === 0     || activeTypes.includes(p.type);
      const catMatch      = activeCategories.length === 0 || activeCategories.includes(p.category);
      const cohortMatch   = activeCohorts.length === 0   || activeCohorts.includes(p.cohort);
      const projProvinces = (p.tags || []).map((t) => PROVINCE_TAGS[t]).filter(Boolean);
      const provMatch     = activeProvinces.length === 0 || projProvinces.some((pv) => activeProvinces.includes(pv));
      return typeMatch && catMatch && cohortMatch && provMatch;
    });
  }, [activeTypes, activeCategories, activeCohorts, activeProvinces]);

  // ── Image preload while on StatsPage ──────────────────────────────────────
  useEffect(() => {
    if (view !== 'home' || selectedProject) return;
    // Cap preloading to roughly the first screenful — grid images below the
    // fold are lazy-loaded, so warming all ~350 wastes bandwidth on mobile.
    const preload = () => {
      projectsData.slice(0, 24).forEach(p => {
        if (!p.image) return;
        const img = new Image();
        img.src = p.image;
      });
    };
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(preload, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 1500);
    return () => clearTimeout(id);
  }, [view, selectedProject]);

  // ── Hash routing sync ─────────────────────────────────────────────────────
  const scrollTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useEffect(() => {
    const onHashChange = () => {
      const { view: nextView, selectedProject: nextProject, filters } = parseHash();
      flushSync(() => {
        setView(nextView);
        setSelectedProject(nextProject);
        if (filters) {
          setActiveTypes(filters.types);
          setActiveCohorts(filters.cohorts);
          setActiveCategories(filters.categories);
          setActiveProvinces(filters.provinces);
        }
      });
      scrollTop();
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Keep the URL's query string in sync with active filters (shareable links,
  // e.g. #/projects?province=ab) without polluting browser history.
  useEffect(() => {
    if (view !== 'grid' || selectedProject) return;
    const params = new URLSearchParams();
    activeTypes.forEach((v) => params.append('type', slugFor(FILTER_OPTIONS.types, v)));
    activeCohorts.forEach((v) => params.append('cohort', slugFor(FILTER_OPTIONS.cohorts, v)));
    activeCategories.forEach((v) => params.append('category', slugFor(FILTER_OPTIONS.categories, v)));
    activeProvinces.forEach((v) => params.append('province', slugFor(FILTER_OPTIONS.provinces, v)));
    const query = params.toString();
    const newHash = `#/projects${query ? `?${query}` : ''}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [view, selectedProject, activeTypes, activeCohorts, activeCategories, activeProvinces]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleSelectProject = (project) => { window.location.hash = `/project/${project.id}`; };
  const handleBack          = ()          => { window.location.hash = '/projects'; };
  const handleNavHome       = ()          => { window.location.hash = '/overview'; };
  const handleNavGrid       = ()          => { window.location.hash = '/projects'; };

  const activeNavView = selectedProject ? 'grid' : view;

  if (view === 'tag-tool') return <Suspense fallback={null}><TagTool /></Suspense>;
  if (view === 'submit') return <Suspense fallback={null}><SubmitProject /></Suspense>;
  if (view === 'super-secret-repo') return <Suspense fallback={null}><SecretRepo /></Suspense>;
  if (view === 'jobs-board') return <Suspense fallback={null}><JobsBoard /></Suspense>;

  return (
    <div className="app">
      <TopBar
        types={typeOptions}
        activeTypes={activeTypes}
        onToggleType={toggleType}
        categories={categoryOptions}
        activeCategories={activeCategories}
        onToggleCategory={toggleCategory}
        cohorts={cohortOptions}
        provinces={provinceOptions}
        activeProvinces={activeProvinces}
        onToggleProvince={toggleProvince}
        activeCohorts={activeCohorts}
        onToggleCohort={toggleCohort}
        onClearAll={clearAllFilters}
        onNavHome={handleNavHome}
        onNavGrid={handleNavGrid}
        activeNavView={activeNavView}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="content">
        {selectedProject ? (
          <ProjectView
            project={selectedProject}
            onBack={handleBack}
            allProjects={projectsData}
            onSelectProject={handleSelectProject}
          />
        ) : view === 'home' ? (
          <DiscoveryHub
            onSelectProject={handleSelectProject}
            onNavGrid={handleNavGrid}
          />
        ) : (
          <CardGrid projects={filteredProjects} onSelect={handleSelectProject} />
        )}
      </main>
    </div>
  );
}

export default App;
