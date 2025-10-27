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
        <iframe
          src="/content/overseas.pdf"
          width="100%"
          height="600px"
          title="Overseas Canadians Voting e-Toolkit PDF"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        ></iframe>
      </section>

      <section>
        <h3>Community Feedback</h3>
        <p>
          Your suggestions and support are very much appreciated in helping us
          improve our understanding of the matters explored in these
          e-Toolkits. If you have recommendations, corrections, or new sources
          to include, please reach out through our{" "}
          <a
            href="https://glocalfoundation.ca/contact"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            contact page
          </a>
          .
        </p>
      </section>
    </article>
  );
}
