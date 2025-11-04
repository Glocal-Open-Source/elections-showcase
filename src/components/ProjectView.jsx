import React from "react";

const ProjectView = ({ project, onBack }) => {
  const ContentComponent = project?.component;

  return (
    <div
      className="project-view"
      style={{
        padding: "2rem",
        background: "#FAF8FF",
        color: "#333",
        fontFamily: "Inter, sans-serif",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        maxWidth: "1200px",
        margin: "2rem auto"
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          background: "linear-gradient(90deg, #5b2bff, #7b3fff)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "0.75rem 1.5rem",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "1rem",
          transition: "0.3s",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        }}
        onMouseOver={(e) => (e.target.style.opacity = 0.85)}
        onMouseOut={(e) => (e.target.style.opacity = 1)}
      >
        ← Back to Showcase
      </button>

      {/* Header Section */}
      <header style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "#4B2EFF"
          }}
        >
          {project.title}
        </h2>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: "#555" }}>
          {project.description}
        </p>
        {project.tags && project.tags.length > 0 && (
          <div style={{ marginTop: "0.75rem" }}>
            {project.tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  background: "#EDE2FA",
                  color: "#5b2bff",
                  borderRadius: "8px",
                  padding: "0.25rem 0.75rem",
                  marginRight: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 500
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content Section */}
      <section style={{ marginBottom: "2rem" }}>
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }}
          />
        )}

        {ContentComponent ? (
          <ContentComponent />
        ) : project.embed ? (
          <iframe
            src={project.embed}
            width="100%"
            height="800px"
            title={project.title}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#fafafa",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          ></iframe>
        ) : (
          <p style={{ color: "#777", fontStyle: "italic" }}>
            No additional content available for this project.
          </p>
        )}
      </section>

      {/* Optional Metadata Section */}
      <footer
        style={{
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid #E0D8F5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        <div>
          {project.type && (
            <span
              style={{
                background: "#D9C4FF",
                color: "#3C00A0",
                borderRadius: "8px",
                padding: "0.4rem 0.8rem",
                fontWeight: 600,
                marginRight: "0.75rem"
              }}
            >
              {project.type.toUpperCase()}
            </span>
          )}
        </div>

        {project.embed && (
          <a
            href={project.embed}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none"
            }}
          >
            <button
              style={{
                background: "linear-gradient(90deg, #5b2bff, #8e5fff)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "0.9rem 1.8rem",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "1rem",
                transition: "0.3s",
                boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
              }}
              onMouseOver={(e) => (e.target.style.opacity = 0.85)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
            >
              View Full Project →
            </button>
          </a>
        )}
      </footer>
    </div>
  );
};

export default ProjectView;
