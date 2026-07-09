import React from "react";

export default function YouthInnovatingForChange() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Adib</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>This documentary, “Youth Innovating for Change: Transforming Global Challenges with Digital Tools,” focuses on how young leaders harness digital platforms to address critical social issues such as inequality, food insecurity, mental health, and homelessness. The project aims to showcase innovative youth-led initiatives that demonstrate the power of technology in driving community change.</p>
        <p>In addition to highlighting inspiring stories, the documentary will educate viewers on the root causes of these challenges, equipping them with the understanding necessary to engage meaningfully in social activism. By illustrating practical ways to leverage digital tools for civic engagement, the project empowers youth to become active participants in shaping a more equitable future.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/youth-innovating-for-change-main-project-report-youth-innovating-for-change.pdf"
          type="application/pdf"
          aria-label="Youth Innovating for Change"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/youth-innovating-for-change-main-project-report-youth-innovating-for-change.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
