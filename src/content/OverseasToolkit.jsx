import React from "react";

export default function OverseasToolkit() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Ongoing Research Projects</h3>
        <p>
          The <strong>Overseas Canadians Voting e-Toolkit</strong> is part of a
          series of ongoing research projects that strive to be curated,
          non-partisan resources for Canadians seeking to better navigate our
          political institutions. Each toolkit aims to make the electoral
          process more transparent, accessible, and meaningful—particularly for
          Canadians living abroad.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>About This Toolkit</h3>
        <p>
          This e-Toolkit provides detailed, step-by-step guidance on
          registration and voting procedures for Canadians residing outside the
          country. It includes eligibility information, timelines for ballot
          submission, and links to relevant government resources. The toolkit
          draws on official documentation and verified data sources to ensure
          accuracy and neutrality.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Read the Toolkit</h3>
        <object
          data="content/overseas.pdf" type="application/pdf" aria-label="Overseas Canadians Voting e-Toolkit PDF"
          width="100%"
          height="600px"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
  <p style={{ padding: "1rem", textAlign: "center", margin: 0 }}>
    PDF preview unavailable.{" "}
    <a href="/content/overseas.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#5b2bff", fontWeight: 600 }}>Open PDF ↗</a>
  </p>
</object>
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/overseas.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            Download PDF
          </a>
        </p>
      </section>
    </article>
  );
}
