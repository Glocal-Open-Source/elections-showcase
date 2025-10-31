import React, { useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faSquarePollVertical,
  faGauge,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";

// Capitalize helper
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Simple fuzzy match function
const fuzzyMatch = (pattern, str) => {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  let j = 0;
  for (let i = 0; i < str.length && j < pattern.length; i++) {
    if (str[i] === pattern[j]) j++;
  }
  return j === pattern.length;
};

// Type icons
const purple = "#6D2D91";
const typeIcons = {
  report: <FontAwesomeIcon icon={faBook} style={{ color: purple }} />,
  data: <FontAwesomeIcon icon={faSquarePollVertical} style={{ color: purple }} />,
  dashboard: <FontAwesomeIcon icon={faGauge} style={{ color: purple }} />,
  interactive: <FontAwesomeIcon icon={faGamepad} style={{ color: purple }} />,
};

const Sidebar = ({
  types,           // ["report", "data", "dashboard", "interactive"]
  activeTypes,
  onToggleType,
  tags,            // all available tags from project data
  activeTags,
  onToggleTag,
}) => {
  const [tagSearch, setTagSearch] = useState("");

  // Apply fuzzy filter to tag list
  const filteredTags = tags.filter((tag) =>
    fuzzyMatch(tagSearch, tag)
  );

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <img src="logo.png" alt="GLOCAL Logo" className="logo" />
        <h1 className="sidebar-title">Elections Showcase</h1>
      </div>

      {/* Type Buttons */}
      <div className="sidebar-section">
        {types.map((t) => (
          <button
            key={t}
            className={
              activeTypes.includes(t)
                ? "sidebar-btn active"
                : "sidebar-btn"
            }
            onClick={() => onToggleType(t)}
            type="button"
          >
            <span className="icon">{typeIcons[t] || "💠"}</span> {cap(t)}
          </button>
        ))}
      </div>

      {/* Tag Filters */}
      <div className="sidebar-filters">
        <h2 className="filter-title">Filters</h2>

        {/* Search Bar */}
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="search-input"
          />
        </div>

          {/* Filtered Tag List */}
        <div className="filter-list limited-scroll">
            {filteredTags.length > 0 ? (
              filteredTags.slice(0, 100).map((tag) => (
                <label key={tag} className="filter-item">
                  <input
                    type="checkbox"
                    checked={activeTags.includes(tag)}
                    onChange={() => onToggleTag(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))
            ) : (
              <p className="no-tags">No matching tags</p>
            )}

            {filteredTags.length > 100 && (
              <div className="scroll-hint">
                + {filteredTags.length - 12} more...
              </div>
            )}
          </div>
      </div>
    </aside>
  );
};

export default Sidebar;
