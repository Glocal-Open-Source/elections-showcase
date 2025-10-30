import React from "react";

export default function EJournal() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>About the E-Journal Data Project</h3>
        <p>
          The <strong>E-Journal Data</strong> project curates analytical,
          data-driven insights across Canadian electoral and civic engagement
          studies. It serves as a central hub where interactive dashboards,
          published analyses, and collaborative research pieces come together to
          make democratic participation more transparent and accessible.
        </p>
        <p>
          Visitors can explore formal <em>GLOCAL Publications</em>—peer-reviewed
          data narratives that focus on elections, civic participation, and
          public trust—or browse the <em>Community Showcase</em>, where
          community-led and student projects share creative approaches to
          interpreting democratic data.
        </p>
      </section>

      <section
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <a
          href="https://glocalfoundation.ca/glocal-publications"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#5b2bff",
            color: "#fff",
            textDecoration: "none",
            padding: "1rem 2rem",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6d2d91")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5b2bff")}
        >
          View GLOCAL Publications
        </a>

        <a
          href="https://glocalfoundation.ca/community-showcase-1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#fff",
            color: "#5b2bff",
            border: "2px solid #5b2bff",
            textDecoration: "none",
            padding: "1rem 2rem",
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "1rem",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#5b2bff";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.color = "#5b2bff";
          }}
        >
          Visit Community Showcase
        </a>
      </section>
    </article>
  );
}
