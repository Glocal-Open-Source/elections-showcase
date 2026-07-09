import React from "react";

export default function HowToCopeWithSocial() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Ngoc Bao Khanh Duong</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>The &quot;How to Cope with Social Anxiety Disorder&quot; project is a critical initiative designed to provide support, resources, and coping strategies for individuals grappling with social anxiety. With a focus on mental health, the project aims to empower individuals to manage and overcome the challenges posed by social anxiety disorder. The significance of this project lies in its potential to improve the well-being and quality of life for those affected by social anxiety, fostering a sense of community, and understanding. By offering practical guidance and promoting mental health awareness, the project aligns with GLOCAL Foundation. It addresses the holistic well-being of Canadians, contributing to a more inclusive, transparent, and accessible society by recognizing and supporting those with mental health concerns.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/social-anxiety-disorder-glocal-foundation-docx.pdf"
          type="application/pdf"
          aria-label="How to Cope with Social Anxiety Disorder"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/social-anxiety-disorder-glocal-foundation-docx.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
