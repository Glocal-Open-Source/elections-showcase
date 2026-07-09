import React from "react";

export default function FinancialLiteracyCurriculum() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Ashley</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>The project aims to bridge the financial literacy gap among Ontario youth by implementing an engaging, tailored curriculum within schools to equip students with essential money management skills. Its goal is to empower young individuals with the knowledge and confidence needed for informed financial decisions and lifelong financial success.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/financial-literacy-curriculum.pdf"
          type="application/pdf"
          aria-label="Financial Literacy Curriculum"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/financial-literacy-curriculum.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
