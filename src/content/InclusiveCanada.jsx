import React from "react";

export default function InclusiveCanada() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Anjelica</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>The &quot;Inclusive Canada&quot; magazine uses memes to highlight youth perspectives on inclusivity, showcasing diverse experiences and promoting meaningful conversations. Its goal is to empower young people to actively foster a more equitable and representative society.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/polizine-issue2.pdf"
          type="application/pdf"
          aria-label="Inclusive Canada"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/polizine-issue2.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
