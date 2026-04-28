import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faSquarePollVertical,
  faGauge,
  faGamepad,
  faCommentDots,
  faBars,
  faXmark,
  faMagnifyingGlass,
  faTrash,
  faSortAlphaDown,
  faCheckDouble,
  faHouse,
  faGrip,
} from "@fortawesome/free-solid-svg-icons";

// Capitalize helper
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// Simple fuzzy match function
const fuzzyMatch = (pattern, str) => {
  pattern = (pattern || "").toLowerCase().trim();
  str = (str || "").toLowerCase();
  if (!pattern) return true;
  let j = 0;
  for (let i = 0; i < str.length && j < pattern.length; i++) {
    if (str[i] === pattern[j]) j++;
  }
  return j === pattern.length;
};

const typeIcons = {
  report: <FontAwesomeIcon icon={faBook} />,
  data: <FontAwesomeIcon icon={faSquarePollVertical} />,
  dashboard: <FontAwesomeIcon icon={faGauge} />,
  interactive: <FontAwesomeIcon icon={faGamepad} />,
  events: <FontAwesomeIcon icon={faCommentDots} />,
};

const Sidebar = ({
  types,
  activeTypes,
  onToggleType,
  tags,
  activeTags,
  onToggleTag,
  onNavHome,
  onNavGrid,
  activeNavView,
}) => {
  const [tagSearch, setTagSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [typesOpen, setTypesOpen] = useState(true);
  const [tagSort, setTagSort] = useState("selected"); // "selected" | "az"

  const asideRef = useRef(null);
  const searchRef = useRef(null);

  // Close on Escape, trap focus-lite on mobile
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
      if (!mobileOpen) return;
      if (e.key === "Tab" && asideRef.current) {
        const focusables = asideRef.current.querySelectorAll(
          'a, button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
      document.body.classList.add("sidebar-lock-scroll");
    } else {
      document.body.classList.remove("sidebar-lock-scroll");
    }
    return () => document.body.classList.remove("sidebar-lock-scroll");
  }, [mobileOpen]);

  const filteredTags = useMemo(() => {
    const base = (tags || []).filter((t) => fuzzyMatch(tagSearch, t));
    if (tagSort === "az") {
      return base.slice().sort((a, b) => a.localeCompare(b));
    }
    // selected first, then A-Z
    return base.slice().sort((a, b) => {
      const as = activeTags.includes(a) ? 0 : 1;
      const bs = activeTags.includes(b) ? 0 : 1;
      if (as !== bs) return as - bs;
      return a.localeCompare(b);
    });
  }, [tags, tagSearch, tagSort, activeTags]);

  const selectedTagCount = activeTags.length;
  const selectedTypeCount = activeTypes.length;

  const clearTags = () => {
    // toggle off each selected tag
    activeTags.forEach((t) => onToggleTag(t));
  };

  const clearTypes = () => {
    activeTypes.forEach((t) => onToggleType(t));
  };

  const selectAllFiltered = () => {
    filteredTags.forEach((t) => {
      if (!activeTags.includes(t)) onToggleTag(t);
    });
  };

  const clearSearch = () => setTagSearch("");

  const SidebarBody = (
    <div className="sidebar-body">
      {/* Header */}
      <div className="sidebar-header">
        <a
          href="https://www.glocalfoundation.ca"
          rel="noopener noreferrer"
        >
          <img src="logo.png" alt="GLOCAL Logo" className="logo" />
        </a>
        <div className="sidebar-sub">
          {(selectedTypeCount + selectedTagCount) > 0 && (
            <span className="pill pill-strong">
              {selectedTypeCount + selectedTagCount} active
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        <button
          type="button"
          className={activeNavView === 'home' ? 'snav-btn active' : 'snav-btn'}
          onClick={onNavHome}
          aria-label="Go to overview"
        >
          <FontAwesomeIcon icon={faHouse} />
          <span>Overview</span>
        </button>
        <button
          type="button"
          className={activeNavView === 'grid' ? 'snav-btn active' : 'snav-btn'}
          onClick={onNavGrid}
          aria-label="Browse projects"
        >
          <FontAwesomeIcon icon={faGrip} />
          <span>Projects</span>
        </button>
      </div>

      {/* Types */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            Content Types
            {selectedTypeCount > 0 && <span className="badge">{selectedTypeCount}</span>}
          </div>
          <div className="panel-actions">
            {selectedTypeCount > 0 && (
              <button
                type="button"
                className="icon-btn"
                onClick={clearTypes}
                aria-label="Clear type filters"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
        {typesOpen && (
          <div className="panel-content">
            <div className="type-grid">
              {types.map((t) => (
                <button
                  key={t}
                  className={activeTypes.includes(t) ? "type-chip active" : "type-chip"}
                  onClick={() => onToggleType(t)}
                  type="button"
                >
                  <span className="icon">{typeIcons[t] || "💠"}</span>
                  <span className="label">{cap(t)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-title">
            Filter by Tag
            {selectedTagCount > 0 && <span className="badge">{selectedTagCount}</span>}
          </div>
          <div className="panel-actions">
            {selectedTagCount > 0 && (
              <button
                type="button"
                className="icon-btn"
                onClick={clearTags}
                aria-label="Clear tag filters"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>


        {tagsOpen && (
          <div className="panel-content">
            {/* Search */}
            <div className="search-row">
              <div className="search">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-ico" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search tags…"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  className="search-input"
                />
                {tagSearch && (
                  <button type="button" className="icon-btn" onClick={clearSearch} aria-label="Clear search">
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="icon-btn"
                onClick={() => setTagSort((s) => (s === "selected" ? "az" : "selected"))}
                aria-label="Toggle tag sort"
                title={tagSort === "selected" ? "Sort A–Z" : "Sort by selected"}
              >
                <FontAwesomeIcon icon={faSortAlphaDown} />
              </button>
            </div>

            {/* Selected chips */}
            {activeTags.length > 0 && (
              <div className="selected-chips" aria-label="Selected tags">
                {activeTags.slice(0, 10).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="sel-chip"
                    onClick={() => onToggleTag(t)}
                    title="Remove tag"
                  >
                    {t} <span className="x">×</span>
                  </button>
                ))}
                {activeTags.length > 10 && (
                  <span className="muted">+{activeTags.length - 10} more</span>
                )}
              </div>
            )}

            {/* Bulk actions */}
            <div className="bulk-row">
              <button
                type="button"
                className="ghost-btn"
                onClick={selectAllFiltered}
                disabled={filteredTags.length === 0}
              >
                <FontAwesomeIcon icon={faCheckDouble} /> Select filtered
              </button>
              <span className="muted">
                {filteredTags.length} shown
              </span>
            </div>

            {/* Tag list */}
            <div className="tag-list" role="list">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => {
                  const checked = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      role="listitem"
                      className={checked ? "tag-row checked" : "tag-row"}
                      onClick={() => onToggleTag(tag)}
                    >
                      <span className={checked ? "tick on" : "tick"} aria-hidden="true">
                        ✓
                      </span>
                      <span className="tag-text">{tag}</span>
                    </button>
                  );
                })
              ) : (
                <div className="empty">
                  No matching tags.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile close button area spacer */}
      <div className="sidebar-footer" />
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <a
          className="mobile-brand"
          href="https://glocal-open-source.github.io/elections-showcase/"
          rel="noopener noreferrer"
        >
          <img src="logo.png" alt="GLOCAL" />
        </a>

        <button
          type="button"
          className="mobile-filter-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open filters"
        >
          <FontAwesomeIcon icon={faBars} />
          <span>Filters</span>
          {(selectedTypeCount + selectedTagCount) > 0 && (
            <span className="badge badge-dot">{selectedTypeCount + selectedTagCount}</span>
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="sidebar desktop" aria-label="Sidebar filters">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      <div className={mobileOpen ? "drawer open" : "drawer"} aria-hidden={!mobileOpen}>
        <div className="backdrop" onClick={() => setMobileOpen(false)} />
        <aside
          ref={asideRef}
          className="sidebar mobile"
          aria-label="Mobile filters"
        >
          <div className="mobile-drawer-head">
            <div className="mobile-drawer-title">Filters</div>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {SidebarBody}
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
