import React from "react";
import "./Sidebar.css";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Define icons for each type
const typeIcons = {
  report: "📄",       // document
  data: "📊",         // bar chart
  dashboard: "📈",    // line chart
  interactive: "🧩",  // puzzle piece / interaction
};

const Sidebar = ({
  types,           // ["report","data","dashboard","interactive"]
  activeTypes,
  onToggleType,
  tags,            // built from data
  activeTags,
  onToggleTag,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="GLOCAL Logo" className="logo" />
        <h1 className="sidebar-title">Elections Showcase</h1>
      </div>

      <div className="sidebar-section">
        {types.map((t) => (
          <button
            key={t}
            className={
              activeTypes.includes(t) ? "sidebar-btn active" : "sidebar-btn"
            }
            onClick={() => onToggleType(t)}
            type="button"
          >
            <span className="icon">{typeIcons[t] || "💠"}</span> {cap(t)}
          </button>
        ))}
      </div>

      <div className="sidebar-filters">
        <h2 className="filter-title">Filters</h2>
        <div className="filter-list">
          {tags.map((tag) => (
            <label key={tag} className="filter-item">
              <input
                type="checkbox"
                checked={activeTags.includes(tag)}
                onChange={() => onToggleTag(tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
