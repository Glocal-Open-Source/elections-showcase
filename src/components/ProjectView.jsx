import React from "react";

const ProjectView = ({ project, onBack }) => {
  // Check if this project has a custom component assigned (e.g. OverseasToolkit)
  const ContentComponent = project?.component;

  return (
    <div className="project-view">
      <button className="back-btn" onClick={onBack}>
        ← Back to Showcase
      </button>

      <h2>{project.title}</h2>
      <p>{project.description}</p>

      {/* If a custom component exists, render it */}
      {ContentComponent ? (
        <ContentComponent />
      ) : project.embed ? (
        <iframe
          src={project.embed}
          width="100%"
          height="1000px"
          style={{ border: "none", marginTop: "1rem" }}
          title={project.title}
        ></iframe>
      ) : (
        <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
          This project does not have additional content available yet.
        </p>
      )}
    </div>
  );
};

export default ProjectView;
