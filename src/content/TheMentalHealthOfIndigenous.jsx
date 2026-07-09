import React from "react";

export default function TheMentalHealthOfIndigenous() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Sara Saadat</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>The mental health of Indigenous children in Residential Schools in Canada and what Canadian Social workers did for this Situation.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>About Sara</h3>
        <p>My name is Sara Saadat. I&#x27;m 23 years old, and I&#x27;m from Afghanistan. I came to Canada with my family in 2021. Currently, I&#x27;m an undergraduate student studying commerce. I recently discovered GLOCAL and its projects, which I find very useful as a newcomer in Canada. They help me develop my skills in various areas and be active in the community. Right now.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/sara-saadat-final-project.pdf"
          type="application/pdf"
          aria-label="The mental health of Indigenous children in Residential Schools in Canada and what Canadian Social workers did for this Situation."
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/sara-saadat-final-project.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
