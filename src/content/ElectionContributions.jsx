import React from "react";

export default function ElectionContributions() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Analysis on Elections Contributions Data</h3>
        <p>
          This project, created by <strong>Carmen Y</strong> through the{" "}
          <strong>Canada Summer Jobs (CSJ)</strong> program, examines how campaign
          donations may influence election outcomes in Canada. Using Elections
          Canada's open contribution datasets, the research explores whether
          fundraising patterns—such as total donations, donation size, and district
          concentration—can serve as indicators of candidate performance.
        </p>
        <p>
          The study applied machine learning methods, including Gradient-Boosted
          Random Forest models and SHAP value analysis, to identify which factors
          had the greatest influence on electoral results. While the models were not
          designed for perfect prediction, they revealed that campaign fundraising
          remains a meaningful signal of community engagement and momentum.
        </p>
        <p>
          The accompanying report summarizes the findings and provides detailed
          visualizations of how political financing interacts with democratic
          participation.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop: 0 }}>
          <li><strong>Author:</strong> Carmen Y</li>
          <li><strong>Program:</strong> Canada Summer Jobs</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Read the Full Report</h3>
        <iframe
          src="content/electionscontributions.pdf"
          width="100%"
          height="1000px"
          title="Elections Contributions Report"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        />
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/electionscontributions.pdf"
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
