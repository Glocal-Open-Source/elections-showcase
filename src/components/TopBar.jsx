import React, { useEffect, useMemo, useRef, useState } from "react";
import "./TopBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faSquarePollVertical,
  faGamepad,
  faCommentDots,
  faBars,
  faXmark,
  faMagnifyingGlass,
  faHouse,
  faGrip,
  faSun,
  faMoon,
  faChevronDown,
  faPlus,
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
  interactive: <FontAwesomeIcon icon={faGamepad} />,
  events:      <FontAwesomeIcon icon={faCommentDots} />,
};

function TypePanel({ types, activeTypes, onToggleType }) {
  return (
    <div className="tpop-type-grid">
      {types.map((t) => (
        <button
          key={t}
          type="button"
          className={activeTypes.includes(t) ? "tpop-chip active" : "tpop-chip"}
          onClick={() => onToggleType(t)}
        >
          <span className="tpop-chip-icon">{typeIcons[t] || "◆"}</span>
          <span>{cap(t)}</span>
        </button>
      ))}
    </div>
  );
}

function CategoryPanel({ categories, activeCategories, onToggleCategory, catSearch, setCatSearch }) {
  return (
    <div className="tpop-cat">
      <div className="tpop-search-row">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="tpop-search-ico" />
        <input
          type="text"
          placeholder="Search categories…"
          value={catSearch}
          onChange={(e) => setCatSearch(e.target.value)}
          className="tpop-search-input"
          autoFocus
        />
        {catSearch && (
          <button type="button" className="tpop-search-clear" onClick={() => setCatSearch("")}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </div>
      <div className="tpop-cat-list">
        {categories.length > 0 ? (
          categories.map((cat) => {
            const checked = activeCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                className={checked ? "tpop-row checked" : "tpop-row"}
                onClick={() => onToggleCategory(cat)}
              >
                <span className={checked ? "tpop-tick on" : "tpop-tick"}>✓</span>
                <span className="tpop-row-text">{cat}</span>
              </button>
            );
          })
        ) : (
          <div className="tpop-empty">No matching categories.</div>
        )}
      </div>
    </div>
  );
}

function ChipPanel({ items, active, onToggle }) {
  return (
    <div className="tpop-chip-grid">
      {(items || []).map((item) => (
        <button
          key={item}
          type="button"
          className={active.includes(item) ? "tpop-chip active" : "tpop-chip"}
          onClick={() => onToggle(item)}
        >
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
}

const FILTER_DEFS = [
  { id: "type",     label: "Type",     colorClass: "fc-type" },
  { id: "category", label: "Category", colorClass: "fc-category" },
  { id: "cohort",   label: "Cohort",   colorClass: "fc-cohort" },
  { id: "province", label: "Province", colorClass: "fc-province" },
];

const TopBar = ({
  types, activeTypes, onToggleType,
  categories, activeCategories, onToggleCategory,
  cohorts, activeCohorts, onToggleCohort,
  provinces, activeProvinces, onToggleProvince,
  onClearAll, onNavHome, onNavGrid, activeNavView,
  isDark, onToggleTheme,
}) => {
  const [openPanel, setOpenPanel] = useState(null);
  const [catSearch, setCatSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef(null);

  const togglePanel = (id) => setOpenPanel((p) => (p === id ? null : id));

  useEffect(() => {
    if (!openPanel) return;
    const handleClick = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openPanel]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenPanel(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
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

  const counts = {
    type:     activeTypes.length,
    category: activeCategories.length,
    cohort:   activeCohorts.length,
    province: activeProvinces.length,
  };
  const totalActive = Object.values(counts).reduce((a, b) => a + b, 0);

  const renderPanel = (id) => {
    if (id === "type") return (
      <TypePanel types={types} activeTypes={activeTypes} onToggleType={onToggleType} />
    );
    if (id === "category") return (
      <CategoryPanel
        categories={filteredCats}
        activeCategories={activeCategories}
        onToggleCategory={onToggleCategory}
        catSearch={catSearch}
        setCatSearch={setCatSearch}
      />
    );
    if (id === "cohort") return (
      <ChipPanel items={cohorts} active={activeCohorts} onToggle={onToggleCohort} />
    );
    if (id === "province") return (
      <ChipPanel items={provinces} active={activeProvinces} onToggle={onToggleProvince} />
    );
  };

  const MobileFilterSections = (
    <>
      <div className="tb-mob-section fc-type">
        <div className="tb-mob-section-title">Content Type</div>
        <TypePanel types={types} activeTypes={activeTypes} onToggleType={onToggleType} />
      </div>
      <div className="tb-mob-section fc-category">
        <div className="tb-mob-section-title">Category</div>
        <CategoryPanel
          categories={filteredCats}
          activeCategories={activeCategories}
          onToggleCategory={onToggleCategory}
          catSearch={catSearch}
          setCatSearch={setCatSearch}
        />
      </div>
      <div className="tb-mob-section fc-cohort">
        <div className="tb-mob-section-title">Cohort</div>
        <ChipPanel items={cohorts} active={activeCohorts} onToggle={onToggleCohort} />
      </div>
      <div className="tb-mob-section fc-province">
        <div className="tb-mob-section-title">Province / Territory</div>
        <ChipPanel items={provinces} active={activeProvinces} onToggle={onToggleProvince} />
      </div>
      {totalActive > 0 && (
        <div className="tb-mob-clear-wrap">
          <button
            type="button"
            className="tb-mob-clear"
            onClick={() => { onClearAll(); setMobileOpen(false); }}
          >
            Clear all filters
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <header className="topbar" ref={barRef}>
        <div className="topbar-inner">
            {/* Nav */}
          <nav className="topbar-nav">
            <button
              type="button"
              className={activeNavView === "home" ? "tnav-btn active" : "tnav-btn"}
              onClick={onNavHome}
              aria-label="Overview"
            >
              <FontAwesomeIcon icon={faHouse} />
              <span className="tnav-label">Overview</span>
            </button>
            <button
              type="button"
              className={activeNavView === "grid" ? "tnav-btn active" : "tnav-btn"}
              onClick={onNavGrid}
              aria-label="Projects"
            >
              <FontAwesomeIcon icon={faGrip} />
              <span className="tnav-label">Projects</span>
            </button>
            <a href="#/submit" className="tnav-btn" aria-label="Submit a project">
              <FontAwesomeIcon icon={faPlus} />
              <span className="tnav-label">Submit</span>
            </a>
          </nav>

          {activeNavView !== "home" && <div className="topbar-divider" />}

          {/* Filter dropdowns — projects page only */}
          {activeNavView !== "home" && (
            <div className="topbar-filters">
              {FILTER_DEFS.map((fd) => (
                <div key={fd.id} className="tfilter-wrap">
                  <button
                    type="button"
                    className={[
                      "tfilter-btn",
                      fd.colorClass,
                      openPanel === fd.id ? "open" : "",
                      counts[fd.id] > 0 ? "active" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => togglePanel(fd.id)}
                  >
                    <span>{fd.label}</span>
                    {counts[fd.id] > 0 && (
                      <span className="tfilter-badge">{counts[fd.id]}</span>
                    )}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={openPanel === fd.id ? "tfilter-caret rotated" : "tfilter-caret"}
                    />
                  </button>
                  {openPanel === fd.id && (
                    <div className={`tpopover ${fd.colorClass}`}>
                      {renderPanel(fd.id)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Clear all — projects page only */}
          {activeNavView !== "home" && totalActive > 0 && (
            <button type="button" className="topbar-clear" onClick={onClearAll}>
              <FontAwesomeIcon icon={faXmark} />
              <span>Clear ({totalActive})</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            type="button"
            className="topbar-theme"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
          </button>

          {/* Mobile: filter open button — projects page only */}
          {activeNavView !== "home" && (
            <button
              type="button"
              className="topbar-mob-filter"
              onClick={() => setMobileOpen(true)}
              aria-label="Open filters"
            >
              <FontAwesomeIcon icon={faBars} />
              <span>Filters</span>
              {totalActive > 0 && <span className="tfilter-badge">{totalActive}</span>}
            </button>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="tb-drawer-overlay">
          <div className="tb-drawer-backdrop" onClick={() => setMobileOpen(false)} />
          <div className="tb-drawer">
            <div className="tb-drawer-head">
              <span className="tb-drawer-title">Filters</span>
              <button
                type="button"
                className="tb-drawer-close"
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="tb-drawer-body">
              {MobileFilterSections}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
