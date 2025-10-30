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
          Canada’s open contribution datasets, the research explores whether
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

      {/* Embedded PDF */}
      <section style={{ marginTop: "2rem" }}>
        <iframe
          src="/content/electionscontributions.pdf"
          width="100%"
          height="1000px"
          title="Elections Contributions Report"
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
