import React, { useMemo, useState, useEffect } from "react";
import { flushSync } from "react-dom";
import Sidebar from "./components/Sidebar";
import CardGrid from "./components/CardGrid";
import ProjectView from "./components/ProjectView";
import StatsPage from "./components/StatsPage";
import projectsData from "./data/projects";
import "./App.css";

// ── Feature flags ─────────────────────────────────────────────────────────────
const SHOW_HOME = false;

// ── Hash routing helpers ──────────────────────────────────────────────────────
const parseHash = () => {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('/project/')) {
    const id = parseInt(hash.slice('/project/'.length), 10);
    const project = projectsData.find(p => p.id === id) ?? null;
    return { view: 'grid', selectedProject: project };
  }
  if (hash === '/projects') return { view: 'grid', selectedProject: null };
  return { view: SHOW_HOME ? 'home' : 'grid', selectedProject: null };
};

function App() {
  const initial = parseHash();
  const [view, setView]                       = useState(initial.view);
  const [selectedProject, setSelectedProject] = useState(initial.selectedProject);
  const [activeTypes, setActiveTypes]         = useState([]);
  const [activeTags, setActiveTags]           = useState([]);

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
  const typeOptions = ["report", "data", "interactive", "events"];

  const tagOptions = useMemo(() => {
    const tags = new Set();
    projectsData.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, []);

  const toggleType = (t) =>
    setActiveTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const toggleTag = (t) =>
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const clearAllFilters = () => { setActiveTypes([]); setActiveTags([]); };

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const typeMatch = activeTypes.length === 0 || activeTypes.includes(p.type);
      const projTags = p.tags || [];
      const tagMatch = activeTags.length === 0 || projTags.some((tag) => activeTags.includes(tag));
      return typeMatch && tagMatch;
    });
  }, [activeTypes, activeTags]);

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
  const handleNavHome       = ()          => { window.location.hash = '/'; };
  const handleNavGrid       = ()          => { window.location.hash = '/projects'; };

  const activeNavView = selectedProject ? 'grid' : view;

  return (
    <div className="app">
      <Sidebar
        types={typeOptions}
        activeTypes={activeTypes}
        onToggleType={toggleType}
        tags={tagOptions}
        activeTags={activeTags}
        onToggleTag={toggleTag}
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
        ) : view === 'home' && SHOW_HOME ? (
          <StatsPage onExplore={handleNavGrid} />
        ) : (
          <>
            {(activeTypes.length > 0 || activeTags.length > 0) && (
              <div className="content-toolbar">
                <div className="content-toolbar-left">
                  Showing <strong>{filteredProjects.length}</strong> projects
                </div>
                <button className="content-toolbar-btn" type="button" onClick={clearAllFilters}>
                  Clear all filters
                </button>
              </div>
            )}
            <CardGrid projects={filteredProjects} onSelect={handleSelectProject} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
