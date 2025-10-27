import React from "react";

export default function CivicIssues() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Consortium on Electoral Democracy (C-Dem)</h3>
        <p>
          We are an official partner of the{" "}
          <strong>
            Consortium on Electoral Democracy / Consortium de la démocratie
            électorale (C-Dem)
          </strong>
          . C-Dem is reimagining election research in Canada by developing a
          pioneering consortium model for researchers, electoral management
          boards, policymakers, and civil society organizations to build upon
          mutual interests and pool resources and knowledge to investigate the
          health of democracy across the country and over time.
        </p>
        <p>
          C-Dem is a dynamic research network spanning Canada that addresses
          urgent questions about political engagement, underrepresentation,
          levels of government, the evolution of public opinion between and
          across elections, and data collection practices. It takes an
          evidence-based, cooperative approach to studying electoral democracy
          — during federal elections as well as subnationally and between
          election cycles.
        </p>
        <p>
          To learn more, visit{" "}
          <a
            href="https://c-dem.ca"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            c-dem.ca
          </a>
          .
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>About This Project</h3>
        <p>
          The <strong>GLOCAL Data Team</strong> prepared the following report
          using data from the 2021 Canadian Election Study administered by
          C-Dem. This analysis explores civic participation, political trust,
          and voting behavior in Canada, drawing on large-scale, empirical data
          to better understand the evolving dynamics of Canadian democracy.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Research Team</h3>
        <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop: 0 }}>
          <li>
            <strong>Project Leaders:</strong> Faye Ying, Laurie Gao
          </li>
          <li>
            <strong>Project Manager:</strong> Vicky Huang
          </li>
          <li>
            <strong>Key Contributors:</strong> Laurie Gao, Minyu Kim, Kouyu
            Yang, Rainer Zhang
          </li>
          <li>
            <strong>Other Contributors:</strong> Kathyayini Valluru, Vikas
            Anappally, Ismail Mostafa, Eshanye Purakan, Amit Ramdiall, Tushar
            Rawat
          </li>
          <li>
            <strong>Lead Editor:</strong> Jia Yue He
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>An Analysis of 2021 Canadian Election Study Data</h3>
        <iframe
          src="/content/civicissues.pdf"
          width="100%"
          height="600px"
          title="Civic Issues PDF"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        ></iframe>
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/civicissues.pdf"
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
