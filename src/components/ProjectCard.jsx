import React from "react";

const ProjectCard = ({ project, onSelect }) => {
  return (
    <div className="card" onClick={() => onSelect(project)}>
      <img src={project.image} alt={project.title} className="card-img" />

      <div className="card-info">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-description">{project.description}</p>

        <div className="card-tags">
          {project.tags?.map((tag, index) => (
            <span key={index} className="card-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="card-arrow">
          <span className="arrow">➜</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
