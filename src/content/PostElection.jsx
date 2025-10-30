import React from "react";

export default function PostElection() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>2025 Post-Election Analysis</h3>
        <p>
          <strong>Report Version:</strong> 18 June 2025
        </p>
        <p>
          This report provides a non-partisan analysis of the major outcomes and
          political shifts observed in Canada’s 2025 federal election. Authored by
          <strong> H. Driggers, C. Caruana, and J. Y. He</strong>, the paper offers
          evidence-based commentary on national voting patterns, party performance,
          and demographic trends. The contributors come from a range of academic and
          professional backgrounds, and have collectively aimed to produce a balanced
          and rigorous examination of the election results.
        </p>
        <p>
          <em>
            Any use of this report must be appropriately referenced and credited.
            The recommended citation is:
          </em>
        </p>
        <blockquote
          style={{
            background: "#f9f6ff",
            borderLeft: "4px solid #5b2bff",
            padding: "0.75rem 1rem",
            fontStyle: "italic",
          }}
        >
          Driggers, H., Caruana, C., & He, J. Y. (2025). <em>2025 Post-Election
          Analysis</em>. GLOCAL Foundation of Canada.
        </blockquote>
        <p>
          Any inaccuracies are unintentional and can be reported to{" "}
          <a
            href="mailto:michael.driggers@glocalfoundation.ca"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            michael.driggers@glocalfoundation.ca
          </a>{" "}
          for review and correction.
        </p>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          <em>
            Please do not copy. All rights reserved. Copyright Act in effect.
          </em>
        </p>
        <p>
          For active hyperlinks in the References section, please download the full
          PDF version below.
        </p>
      </section>

      {/* Embedded PDF */}
      <section style={{ marginTop: "2rem" }}>
        <iframe
          src="/content/postelection.pdf"
          width="100%"
          height="1000px"
          title="2025 Post-Election Analysis"
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            background: "#faf8ff",
          }}
        ></iframe>
      </section>
    </article>
  );
}
