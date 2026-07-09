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
  faHouse,
  faGrip,
  faSun,
  faMoon,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

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
  report:      <FontAwesomeIcon icon={faBook} />,
  data:        <FontAwesomeIcon icon={faSquarePollVertical} />,
  dashboard:   <FontAwesomeIcon icon={faGauge} />,
  interactive: <FontAwesomeIcon icon={faGamepad} />,
  events:      <FontAwesomeIcon icon={faCommentDots} />,
};

const Sidebar = ({
  types,
  activeTypes,
  onToggleType,
  categories,
  activeCategories,
  onToggleCategory,
  cohorts,
  activeCohorts,
  onToggleCohort,
  provinces,
  activeProvinces,
  onToggleProvince,
  onClearAll,
  onNavHome,
  onNavGrid,
  activeNavView,
  isDark,
  onToggleTheme,
}) => {
  const [catSearch, setCatSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const asideRef  = useRef(null);
  const searchRef = useRef(null);

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
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
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

  const filteredCats = useMemo(() => {
    const base = categories || [];
    if (!catSearch.trim()) return base;
    return base.filter((c) => fuzzyMatch(catSearch, c));
  }, [categories, catSearch]);

  const activeTypeCount     = activeTypes.length;
  const activeCatCount      = activeCategories.length;
  const activeCohortCount   = activeCohorts.length;
  const activeProvinceCount = activeProvinces.length;
  const totalActive         = activeTypeCount + activeCatCount + activeCohortCount + activeProvinceCount;

  const SidebarBody = (
    <div className="sidebar-body">
      {/* Header */}
      <div className="sidebar-header">
        <a href="https://www.glocalfoundation.ca" rel="noopener noreferrer">
          <img src="logo.png" alt="GLOCAL Logo" className="logo" />
        </a>
        <div className="sidebar-sub">
          {totalActive > 0 ? (
            <>
              <span className="pill pill-strong">
                <FontAwesomeIcon icon={faSliders} style={{ opacity: 0.8 }} />
                {totalActive} active
              </span>
              <button type="button" className="clear-all-btn" onClick={onClearAll}>
                Clear all
              </button>
            </>
          ) : (
            <span className="pill">All projects</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        <button
          type="button"
          className={activeNavView === "home" ? "snav-btn active" : "snav-btn"}
          onClick={onNavHome}
          aria-label="Go to overview"
        >
          <FontAwesomeIcon icon={faHouse} />
          <span>Overview</span>
        </button>
        <button
          type="button"
          className={activeNavView === "grid" ? "snav-btn active" : "snav-btn"}
          onClick={onNavGrid}
          aria-label="Browse projects"
        >
          <FontAwesomeIcon icon={faGrip} />
          <span>Projects</span>
        </button>
      </div>

      {/* Content Type */}
      <div className="panel panel-type">
        <div className="panel-head">
          <div className="panel-title">
            Content Type
            {activeTypeCount > 0 && <span className="badge">{activeTypeCount}</span>}
          </div>
          <div className="panel-actions">
            {activeTypeCount > 0 && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => activeTypes.forEach((t) => onToggleType(t))}
                aria-label="Clear type filters"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
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
      </div>

      {/* Category */}
      <div className="panel panel-category">
        <div className="panel-head">
          <div className="panel-title">
            Category
            {activeCatCount > 0 && <span className="badge">{activeCatCount}</span>}
          </div>
          <div className="panel-actions">
            {activeCatCount > 0 && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => activeCategories.forEach((c) => onToggleCategory(c))}
                aria-label="Clear category filters"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
        <div className="panel-content">
          <div className="search-row">
            <div className="search">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="search-ico" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search categories…"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                className="search-input"
              />
              {catSearch && (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setCatSearch("")}
                  aria-label="Clear search"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
          </div>
          <div className="cat-list" role="list">
            {filteredCats.length > 0 ? (
              filteredCats.map((cat) => {
                const checked = activeCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    role="listitem"
                    className={checked ? "filter-row checked" : "filter-row"}
                    onClick={() => onToggleCategory(cat)}
                  >
                    <span className={checked ? "tick on" : "tick"} aria-hidden="true">✓</span>
                    <span className="filter-text">{cat}</span>
                  </button>
                );
              })
            ) : (
              <div className="empty">No matching categories.</div>
            )}
          </div>
        </div>
      </div>

      {/* Cohort */}
      <div className="panel panel-cohort">
        <div className="panel-head">
          <div className="panel-title">
            Cohort
            {activeCohortCount > 0 && <span className="badge">{activeCohortCount}</span>}
          </div>
          <div className="panel-actions">
            {activeCohortCount > 0 && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => activeCohorts.forEach((c) => onToggleCohort(c))}
                aria-label="Clear cohort filters"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
        <div className="panel-content">
          <div className="cohort-grid">
            {(cohorts || []).map((c) => (
              <button
                key={c}
                type="button"
                className={activeCohorts.includes(c) ? "type-chip active" : "type-chip"}
                onClick={() => onToggleCohort(c)}
              >
                <span className="label">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Province */}
      <div className="panel panel-province">
        <div className="panel-head">
          <div className="panel-title">
            Province / Territory
            {activeProvinceCount > 0 && <span className="badge">{activeProvinceCount}</span>}
          </div>
          <div className="panel-actions">
            {activeProvinceCount > 0 && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => activeProvinces.forEach((p) => onToggleProvince(p))}
                aria-label="Clear province filters"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
        <div className="panel-content">
          <div className="cohort-grid">
            {(provinces || []).map((p) => (
              <button
                key={p}
                type="button"
                className={activeProvinces.includes(p) ? "type-chip active" : "type-chip"}
                onClick={() => onToggleProvince(p)}
              >
                <span className="label">{p}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Theme toggle */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
          <span>{isDark ? "Light mode" : "Dark mode"}</span>
        </button>
      </div>
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

        <div className="mobile-nav-btns">
          <button
            type="button"
            className={activeNavView === "home" ? "mobile-nav-btn active" : "mobile-nav-btn"}
            onClick={onNavHome}
            aria-label="Go to overview"
          >
            <FontAwesomeIcon icon={faHouse} />
          </button>
          <button
            type="button"
            className={activeNavView === "grid" ? "mobile-nav-btn active" : "mobile-nav-btn"}
            onClick={onNavGrid}
            aria-label="Browse projects"
          >
            <FontAwesomeIcon icon={faGrip} />
          </button>
        </div>

        <button
          type="button"
          className="mobile-theme-btn"
          onClick={onToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
        </button>

        <button
          type="button"
          className="mobile-filter-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open filters"
        >
          <FontAwesomeIcon icon={faBars} />
          <span>Filters</span>
          {totalActive > 0 && (
            <span className="badge badge-dot">{totalActive}</span>
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
