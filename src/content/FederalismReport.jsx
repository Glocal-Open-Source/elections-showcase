import React from "react";

export default function FederalismReport() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Overview</h3>
        <p>
          The <strong>Understanding Federalism in Canada</strong> report explores how power is divided
          between the federal and provincial governments under the Canadian Constitution.
          It provides a foundational explanation of federalism’s role in shaping national and
          regional governance, emphasizing its relevance to the everyday functioning of
          political and administrative systems.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Scope and Focus</h3>
        <p>
          This publication defines federalism as a system that allocates authority across two
          constitutionally distinct levels of government. It highlights the respective
          jurisdictions of federal and provincial administrations—covering areas such as
          defense, immigration, healthcare, and environmental regulation—while addressing
          zones of overlap and shared responsibility.
        </p>
        <p>
          The report also examines how ministries and departments implement these policies,
          illustrating key differences in governance structures and intergovernmental
          cooperation mechanisms.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Case Studies</h3>
        <p>
          Drawing from real-world examples, the report analyzes how federalism shapes
          Canada’s approach to major national challenges—including the COVID-19 pandemic,
          climate action, healthcare delivery, immigration frameworks, and public safety
          coordination. Each case highlights both the strengths and tensions inherent in
          a federated model of governance.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Read the Full Report</h3>
        <iframe
          src="content/federalism-division-of-powers.pdf"
          width="100%"
          height="600px"
          title="Understanding Federalism in Canada PDF"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        ></iframe>
      </section>
    </article>
  );
}
