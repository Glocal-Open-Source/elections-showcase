import React from "react";

export default function CDEM2019Report() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Overview</h3>
        <p>
          The <strong>Canadians and Civic Issues</strong> report draws on data from
          the <em>C-DEM 2019 Canadian Election Study</em> to analyze how Canadians
          understand and engage with political life. It investigates the social and
          behavioural factors that influence political awareness, sense of inclusion,
          and satisfaction with democratic governance.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Key Findings</h3>
        <ul>
          <li>
            Only about one in five Canadians could name the Federal Minister of
            Finance, and just one in seven could identify the Governor General. In
            contrast, most residents could name their provincial premier.
          </li>
          <li>
            Many participants found politics and government too complicated to
            understand—particularly younger adults, Generation X, individuals with
            lower education, and those who preferred not to disclose sexual
            orientation.
          </li>
          <li>
            Participants who consumed news media or volunteered regularly
            demonstrated a stronger understanding of political institutions.
          </li>
          <li>
            A majority felt excluded from or unimpactful in governmental decisions,
            though engagement was higher among young adults, educated Canadians,
            and frequent news consumers.
          </li>
          <li>
            Overall satisfaction with Canadian democracy remained high, but women
            and gender-diverse participants expressed lower satisfaction with both
            democracy and their provincial governments.
          </li>
          <li>
            Most permanent residents indicated they would vote in their first federal
            election, and most Canadians overall viewed voting as a civic duty rather
            than a personal choice.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>About the Study</h3>
        <p>
          Conducted by C-DEM, this analysis connects demographic and attitudinal
          variables to patterns of political understanding and participation. The
          findings reveal both progress and persistent disparities in civic knowledge
          and engagement across regions and groups, offering insight into how
          Canadians experience democracy in practice.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Read the Full Report</h3>
        <iframe
          src="content/cdem2019-canadians-and-civic-issues.pdf"
          width="100%"
          height="600px"
          title="Canadians and Civic Issues PDF"
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
