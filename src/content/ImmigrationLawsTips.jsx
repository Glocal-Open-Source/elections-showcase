import React from "react";

export default function ImmigrationLawsTips() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Enaya, Elvis, Leah, Joelle, Lauren P., Karyme, and Lauren W.</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Summary</h3>
        <p>This International Law 3201 project examined how international students in Canada navigate legal systems related to immigration, labour protections, safety regulations, and human rights. A key finding was that while these protections exist, they are often difficult to understand and apply in practice due to legal complexity and unclear distinctions between rights specific to international students and those that apply to all residents.</p>
        <p>The team focused on producing clear and accessible materials that help bridge this gap. Their deliverables included infographics and simplified resources that highlight essential legal information, supported by verified sources and additional links for further reading. The approach prioritized clarity, accuracy, and usability, ensuring that the information could be quickly understood and applied by international students.</p>
        <p>Overall, the project shows that improving access to legal information depends on how effectively it is communicated, not just on the availability of the information itself.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <iframe
          src="content/immigration laws.pdf"
          width="100%"
          height="600px"
          title="Immigration Laws & Tips"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        />
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/immigration laws.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            Download PDF
          </a>
        </p>
      </section>
    </article>
  );
}
