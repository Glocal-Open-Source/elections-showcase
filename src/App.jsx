import React, { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import CardGrid from "./components/CardGrid";
import ProjectView from "./components/ProjectView";
import projectsData from "./data/projects";
import "./App.css";

function App() {
  const [activeTypes, setActiveTypes] = useState([]);   // report/data/dashboard/interactive
  const [activeTags, setActiveTags] = useState([]);     // Article/Toolkit/etc.
  const [selectedProject, setSelectedProject] = useState(null);

  const typeOptions = ["report", "data", "dashboard", "interactive"];

  // Build unique, sorted tags from data
  const tagOptions = useMemo(() => {
    const tags = new Set();
    projectsData.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, []);

  const toggleType = (t) =>
    setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleTag = (t) =>
    setActiveTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  // Filter logic:
  // - If no type selected => match all types
  // - If no tag selected  => match all tags
  // - If multiple tags selected => ANY match (OR). Change to .every(...) for AND behavior.
  const filteredProjects = useMemo(() => {
    return projectsData.filter(p => {
      const typeMatch = activeTypes.length === 0 || activeTypes.includes(p.type);
      const projTags = p.tags || [];
      const tagMatch =
        activeTags.length === 0 ||
        projTags.some(tag => activeTags.includes(tag)); // OR across tags
      return typeMatch && tagMatch;
    });
  }, [activeTypes, activeTags]);

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
          <ProjectView project={selectedProject} onBack={() => setSelectedProject(null)} />
        ) : (
          <CardGrid projects={filteredProjects} onSelect={setSelectedProject} />
        )}
      </main>
    </div>
  );
}

export default App;
