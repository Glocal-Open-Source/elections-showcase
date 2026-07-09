import React from "react";

export default function GreenTogether() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Bintu</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>Green Together is a community-based project aimed at empowering marginalized groups by teaching them how to grow their own food indoors using sustainable agriculture techniques. This initiative seeks to address food insecurity by enabling participants to cultivate vegetables and herbs in small spaces. The project will provide practical training through workshops and offer participants starter kits to begin their indoor gardening journey. The overall goal is to promote self-sufficiency, environmental awareness, and healthier food choices within the community.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/green-together-final-report.pdf"
          type="application/pdf"
          aria-label="Green Together"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/green-together-final-report.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
