import React from "react";

export default function MyFamilyJourneyFromAfghanistan() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Arzo</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>My Family Journey: From Afghanistan to Canada shares my family&#x27;s experience fleeing Afghanistan to find safety in Canada, highlighting the challenges refugees face. Through partnerships with CANConnect and the GLOCAL Foundation, the project promotes kindness and community support to help newcomers start their new lives.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/from-afghanistan-to-canada-my-family-journey.pdf"
          type="application/pdf"
          aria-label="My Family Journey: From Afghanistan to Canada"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/from-afghanistan-to-canada-my-family-journey.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
