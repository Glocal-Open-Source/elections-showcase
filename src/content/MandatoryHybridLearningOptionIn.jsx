import React from "react";

export default function MandatoryHybridLearningOptionIn() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Michael Vento</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>Hybrid learning is when a synchronous class is conducted with participants attending both in person and/or virtually as desired. This learning style has seen continued growth within institutions throughout the COVID-19 pandemic. Hybrid learning throughout secondary institutions would enhance education options for students and give them freedom of choice over their preferred learning methods. The implementation of hybrid learning would help students by diminishing financial strain, increasing flexibility, and reducing commute times.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>About Michael</h3>
        <p>Hello! My name is Michael Vento and I am a third year student at the University of British Columbia. I have a passion for law and education. In my home state of Rhode Island (in the US) I participated in our state government&#x27;s internship program and researched educational and financial disparities that occur within Career and Technical Education facilities state-wide (these are like vocational schools). This is where I gained my passion for education reform, and how my partner and I came up with the idea of researching the possibility of mandatory hybrid learning in BC secondary schools.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/mandatory-hybrid-learning-option-in-secondary-schools.pdf"
          type="application/pdf"
          aria-label="Mandatory Hybrid Learning Option in Secondary Schools"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/mandatory-hybrid-learning-option-in-secondary-schools.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
