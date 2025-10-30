import React from "react";

export default function LocalGovernance() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Report on Local Governance Structures in Canada</h3>
        <p>
          <strong>Local governance</strong> plays a vital role in the daily lives of Canadians,
          forming the foundation for the resilience and sustainability of Canadian democracy.
          Despite this importance, there remains a lack of reliable and comprehensive public
          data on local democracy. As a result, local governance remains poorly understood by
          both academics and the public.
        </p>
        <p>
          The <strong>GLOCAL Foundation of Canada</strong> seeks to bridge this gap by conducting
          extensive research into the complexity and diversity of local governance structures
          across the country. This initiative draws primarily from the <em>Acts and
          regulations</em> of each province and territory, supplemented with official sources such
          as provincial and municipal websites and regional associations.
        </p>
        <p>
          The report provides a comprehensive overview of Canadian local governance,
          presenting:
        </p>
        <ul style={{ marginLeft: "1.2rem" }}>
          <li>
            An overview of the significance of local governance in Canadian democracy.
          </li>
          <li>
            Identification of three main local governance models—incorporated communities,
            unincorporated communities, and Indigenous communities—and exploration of
            special arrangements unique to specific regions.
          </li>
          <li>
            A national comparison of governance systems across all provinces and territories.
          </li>
          <li>
            A detailed examination of the unique characteristics within each jurisdiction.
          </li>
        </ul>
        <p>
          Strengthening local democracy is essential for ensuring representation, equity, and
          sustainable governance in Canada’s diverse communities.
        </p>
      </section>

      {/* Embedded PDF Viewer */}
      <section style={{ marginTop: "2rem" }}>
        <iframe
          src="content/localgovernance.pdf"
          width="100%"
          height="1000px"
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            background: "#faf8ff",
          }}
          title="Local Governance Structures in Canada"
        ></iframe>
      </section>
    </article>
  );
}
