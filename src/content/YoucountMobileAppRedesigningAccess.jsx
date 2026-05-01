import React from "react";

export default function YoucountMobileAppRedesigningAccess() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Sooa Lee, Jaden Seaforth, and Areeb Mohsin</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Summary</h3>
        <p>This DIG100 Mobile Product Design project, completed by Sooa Lee, Jaden Seaforth, and Areeb Mohsin, focused on improving access to volunteer opportunities through the YouCount platform. The project identified that while the platform was functional, users experienced friction in navigation, terminology, and access to key features, which limited usability across different user groups such as students, professionals, retirees, and administrators.</p>
        <p>Key findings showed that users struggled with locating the dashboard, interpreting unclear terminology such as “My Cart,” and accessing official volunteer hour records. These issues created confusion, reduced trust, and made it harder for users to complete tasks efficiently. The research process included heuristic evaluation, persona development, and affinity mapping to systematically identify these usability gaps.</p>
        <p>The team developed a mobile application prototype that addressed these issues by restructuring navigation, simplifying language, and centralizing key functions. Changes included placing the dashboard in the main navigation, renaming features using familiar terms, and enabling direct access to records from expected locations. The solution also introduced a unified dashboard combining tasks, submissions, analytics, and resources, along with improved system feedback for tracking progress and approvals.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <iframe
          src="content/YouCount Mobile Design Project Group Presentation.pdf"
          width="100%"
          height="600px"
          title="Youcount Mobile App: Redesigning Access to Opportunity"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        />
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/YouCount Mobile Design Project Group Presentation.pdf"
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
