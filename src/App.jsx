import React, { useMemo, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import TopBar from "./components/TopBar";
import CardGrid from "./components/CardGrid";
import ProjectView from "./components/ProjectView";
import DiscoveryHub from "./components/DiscoveryHub";
import TagTool from "./components/TagTool";
import projectsData from "./data/projects";
import "./App.css";

// ── Hash routing helpers ──────────────────────────────────────────────────────
const parseHash = () => {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('/project/')) {
    const id = parseInt(hash.slice('/project/'.length), 10);
    const project = projectsData.find(p => p.id === id) ?? null;
    return { view: 'grid', selectedProject: project };
  }
  if (hash === '/overview' || hash === '') return { view: 'home', selectedProject: null };
  if (hash === '/tag-tool') return { view: 'tag-tool', selectedProject: null };
  return { view: 'grid', selectedProject: null };
};

function App() {
  const initial = parseHash();
  const [view, setView]                       = useState(initial.view);
  const [selectedProject, setSelectedProject] = useState(initial.selectedProject);
  const [activeTypes, setActiveTypes]           = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeCohorts, setActiveCohorts]       = useState([]);
  const [activeProvinces, setActiveProvinces]   = useState([]);

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
    const preload = () => {
      projectsData.forEach(p => {
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
      const { view: nextView, selectedProject: nextProject } = parseHash();
      flushSync(() => {
        setView(nextView);
        setSelectedProject(nextProject);
      });
      scrollTop();
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleSelectProject = (project) => { window.location.hash = `/project/${project.id}`; };
  const handleBack          = ()          => { window.location.hash = '/projects'; };
  const handleNavHome       = ()          => { window.location.hash = '/overview'; };
  const handleNavGrid       = ()          => { window.location.hash = '/projects'; };

  const activeNavView = selectedProject ? 'grid' : view;

  if (view === 'tag-tool') return <TagTool />;

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
