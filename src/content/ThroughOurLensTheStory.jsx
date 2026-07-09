import React from "react";

export default function ThroughOurLensTheStory() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Deninu School staff</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>The Rhythm &amp; Roots: Regent Park Women’s Dance Collective is a youth-led initiative designed to empower Afro-Indigenous and Caribbean girls, aged 13-18, in the Regent Park community. This project uses dance as a tool for cultural expression, leadership development, and civic engagement. Our goal is to connect participants with their heritage while equipping them with essential life skills, such as teamwork, confidence, and social responsibility, through their participation in weekly dance workshops and community events.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/final-report-through-our-lens-the-story-of-fort-resolution-docx.pdf"
          type="application/pdf"
          aria-label="Through Our Lens – The Story of Fort Resolution"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/final-report-through-our-lens-the-story-of-fort-resolution-docx.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
