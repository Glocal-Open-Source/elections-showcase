import React from "react";

export default function FromPipesToPeopleAddressing() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>UWO Team — HS 3240B</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Summary</h3>
        <p>
          This project developed a health-based action toolkit to help stakeholders and the public
          understand and prevent lead contamination in drinking water. The toolkit translates research
          into accessible resources for families, youth, and decision-makers, including educational
          infographics, a cartoon PSA, youth-friendly materials, planning tools such as logic models
          and a stakeholder matrix, and compiled databases of practical resources.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Key Facts on Lead Contamination</h3>
        <ul>
          <li><strong>No safe level of exposure.</strong> Lead cannot be detected by sight, smell, or taste.</li>
          <li><strong>Primary sources</strong> include aging infrastructure — lead service lines, lead solder, and brass fixtures common in homes built before 1952.</li>
          <li><strong>Health impacts</strong> are wide-ranging: lead accumulates in bones and teeth and is linked to cognitive and behavioural issues, cardiovascular disease, and kidney dysfunction. Infants and children are especially vulnerable.</li>
          <li><strong>Testing is the only way to confirm contamination.</strong> If lead is present, use certified filters, avoid hot tap water for consumption, and consult your municipality about service line replacement.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <iframe
          src="content/frompipestopeople.pdf"
          width="100%"
          height="600px"
          title="From Pipes to People: Addressing Lead in Drinking Water"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        />
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/frompipestopeople.pdf"
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
