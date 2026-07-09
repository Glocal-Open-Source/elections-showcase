import React from "react";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const truncate = (str, max) => {
  if (!str) return null;
  const clean = str.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).replace(/\s\S*$/, "") + "…" : clean;
};

const ProjectCard = ({ project, onSelect }) => {
  const desc = truncate(project.description, 160);

  return (
    <div className="card" onClick={() => onSelect(project)}>
      <div className="card-img-wrap">
        {project.image
          ? <img src={project.image} alt={project.title} className="card-img" />
          : <div className="card-img-placeholder" aria-hidden="true" />
        }
      </div>

      <div className="card-info">
        {project.category && (
          <span className="card-eyebrow">{project.category}</span>
        )}
        <h3 className="card-title">{project.title}</h3>
        {desc && <p className="card-description">{desc}</p>}
        <div className="card-footer">
          {project.type && (
            <span className="card-badge card-badge-type">{cap(project.type)}</span>
          )}
          {project.cohort && (
            <span className="card-badge card-badge-cohort">{project.cohort}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
