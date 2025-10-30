import React from "react";

export default function YouCount() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>YouCount.ca – Canada’s Civic Representation and Elections Data Portal</h3>
        <p>
          <strong>YouCount.ca</strong> is a comprehensive, non-partisan civic data
          platform developed by the <strong>GLOCAL Foundation of Canada</strong> to
          make information about democratic representation and election outcomes
          more accessible to Canadians. The platform serves as an all-in-one public
          interface for exploring who represents you, how electoral districts are
          structured, and how voting patterns evolve over time.
        </p>

        <p>
          Built as a lightweight, publicly available alternative to static data
          releases, YouCount transforms complex electoral datasets into intuitive
          interactive visualizations. It integrates data from Elections Canada,
          provincial legislatures, and local government sources—offering a unified
          view of federal, provincial, and municipal representation across the
          country.
        </p>

        <p>
          The goal of YouCount is to help citizens, educators, journalists, and
          policymakers alike engage with democratic data in meaningful ways. Users
          can search by postal code to identify their representatives, browse
          real-time updates on elections, and access open-source tools that visualize
          national trends in voter participation, candidate diversity, and party
          representation.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h4>Key Features and Capabilities</h4>
        <ul style={{ marginLeft: "1.2rem" }}>
          <li>
            <strong>Unified Representation Database</strong> – Search across federal,
            provincial, and municipal jurisdictions using a single interface.
          </li>
          <li>
            <strong>Elections Data Integration</strong> – Access interactive dashboards
            that visualize past and current election outcomes, including candidate and
            riding-level information.
          </li>
          <li>
            <strong>Public Accessibility</strong> – Designed to complement official
            data portals by translating raw datasets into easy-to-navigate interfaces
            for everyday users.
          </li>
          <li>
            <strong>Open Collaboration</strong> – Built with open data principles,
            encouraging partnerships with public institutions to enhance transparency,
            usability, and civic literacy.
          </li>
        </ul>
      </section>

      <section style={{ textAlign: "center", marginTop: "2rem" }}>
        <a
          href="https://www.youcount.ca/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: "#5b2bff",
            color: "#fff",
            textDecoration: "none",
            padding: "1.2rem 2.5rem",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "1.05rem",
            transition: "background-color 0.25s ease",
            boxShadow: "0 4px 10px rgba(91,43,255,0.25)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6d2d91")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5b2bff")}
        >
          Visit YouCount.ca
        </a>
      </section>
    </article>
  );
}
