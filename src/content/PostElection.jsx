import React from "react";

export default function PostElection() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>2025 Post-Election Analysis</h3>
        <p>
          This report provides a non-partisan analysis of the major outcomes and
          political shifts observed in Canada's 2025 federal election. The paper
          offers evidence-based commentary on national voting patterns, party
          performance, and demographic trends.
        </p>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          <em>
            Please do not copy. All rights reserved. Copyright Act in effect.
            For active hyperlinks in the References section, please download the full PDF below.
          </em>
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Citation</h3>
        <blockquote
          style={{
            background: "var(--accent-light, rgba(109,40,217,0.07))",
            borderLeft: "4px solid #5b2bff",
            padding: "0.75rem 1rem",
            fontStyle: "italic",
            borderRadius: "0 8px 8px 0",
            margin: 0,
          }}
        >
          Driggers, H., Caruana, C., &amp; He, J. Y. (2025). <em>2025 Post-Election
          Analysis</em>. GLOCAL Foundation of Canada.
        </blockquote>
        <p style={{ marginTop: "0.75rem" }}>
          Any inaccuracies can be reported to{" "}
          <a
            href="mailto:michael.driggers@glocalfoundation.ca"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            michael.driggers@glocalfoundation.ca
          </a>{" "}
          for review and correction.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop: 0 }}>
          <li><strong>Authors:</strong> H. Driggers, C. Caruana, J. Y. He</li>
          <li><strong>Version:</strong> 18 June 2025</li>
          <li><strong>Publisher:</strong> GLOCAL Foundation of Canada</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Read the Full Report</h3>
        <object
          data="content/postelection.pdf" type="application/pdf" aria-label="2025 Post-Election Analysis"
          width="100%"
          height="1000px"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
  <p style={{ padding: "1rem", textAlign: "center", margin: 0 }}>
    PDF preview unavailable.{" "}
    <a href="/content/postelection.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#5b2bff", fontWeight: 600 }}>Open PDF ↗</a>
  </p>
</object>
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/postelection.pdf"
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
