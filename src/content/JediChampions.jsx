import React from "react";

export default function JediChampions() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Bruce</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>JEDI Champions is a youth-led initiative that empowers underrepresented students through technical training, leadership development, and community engagement to address justice, equity, decolonization, and inclusion. By providing personalized guidance, resources, and mentorship, the project enables students to design and implement grassroots civic solutions, fostering systemic change aligned with broader goals of civic engagement and knowledge mobilization.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/fcss-fesc-jedi-champions-program-report-2025-03-31.pdf"
          type="application/pdf"
          aria-label="JEDI Champions"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/fcss-fesc-jedi-champions-program-report-2025-03-31.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
