import React, { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import CardGrid from "./components/CardGrid";
import ProjectView from "./components/ProjectView";
import projectsData from "./data/projects";
import "./App.css";

function App() {
  const [activeTypes, setActiveTypes] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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

  const clearAllFilters = () => {
    setActiveTypes([]);
    setActiveTags([]);
  };

  const filteredProjects = useMemo(() => {
    return projectsData.filter((p) => {
      const typeMatch = activeTypes.length === 0 || activeTypes.includes(p.type);
      const projTags = p.tags || [];
      const tagMatch = activeTags.length === 0 || projTags.some((tag) => activeTags.includes(tag));
      return typeMatch && tagMatch;
    });
  }, [activeTypes, activeTags]);

  // Scroll to top synchronously before state update so mobile browsers
  // don't fight us with scroll restoration after re-render.
  const handleSelectProject = (project) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedProject(project);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedProject(null);
  };

  return (
    <div className="app">
      <Sidebar
        types={typeOptions}
        activeTypes={activeTypes}
        onToggleType={toggleType}
        tags={tagOptions}
        activeTags={activeTags}
        onToggleTag={toggleTag}
      />

      <main className="content">
        {selectedProject ? (
          <ProjectView
            project={selectedProject}
            onBack={handleBack}
            allProjects={projectsData}
            onSelectProject={handleSelectProject}
          />
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
