import React from "react";

export default function CandidatesData() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Canadian Federal Candidate Data Project</h3>
        <p>
          The <strong>Candidates Data Project</strong> is part of GLOCAL’s
          open-source data infrastructure initiative. It was developed to collect,
          unify, and standardize candidate information across federal electoral
          districts in Canada, supporting transparent, data-driven analysis of
          elections. Using an automated Python-based scraping framework, the system
          pulls candidate details directly from official sources including
          Elections Canada, political party websites, and regional candidate
          registries.
        </p>

        <p>
          Each entry is cleaned, cross-referenced, and geocoded using postal code
          injection to ensure consistency with Canada’s official list of 343
          electoral districts. The resulting dataset powers both internal dashboards
          and external visualizations, helping researchers, journalists, and civic
          organizations explore patterns in candidate demographics, regional
          representation, and election trends.
        </p>

        <p>
          The public-facing component of this work is hosted on{" "}
          <strong>YouCount.ca</strong>, an interactive data portal that enables users
          to visualize and filter federal election data in real time.
        </p>
      </section>

      <section
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <a
          href="https://www.youcount.ca/elections/ng/fed-2025"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#5b2bff",
            color: "#fff",
            textDecoration: "none",
            padding: "1.2rem 2.5rem",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "1.05rem",
            transition: "background-color 0.25s ease",
            boxShadow: "0 4px 10px rgba(91,43,255,0.25)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6d2d91")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5b2bff")}
        >
          View 2025 Federal Election Dashboard
        </a>
      </section>
    </article>
  );
}
