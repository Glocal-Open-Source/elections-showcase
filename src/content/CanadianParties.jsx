import React from "react";

export default function CanadianParties() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>About This Project</h3>
        <p>
          The project team collected and organized data for federal, provincial, and municipal political parties across Canada to create a comprehensive, centralized resource. The final dataset includes information on <strong>358 parties</strong>, 340 of which are currently registered. Data points collected include party names, leaders, websites, social media, years founded, and vote totals, with additional data on logos and seated MPs for federal and provincial levels.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Data Breakdown</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginTop: "0.75rem" }}>
          {[
            { label: "Federal", count: 15, note: "Registered parties covering national issues" },
            { label: "Provincial / Territorial", count: 100, note: "Regional parties; Nunavut and NWT use consensus government" },
            { label: "Municipal", count: 225, note: "Parties existing in only three provinces" },
          ].map(({ label, count, note }) => (
            <div
              key={label}
              style={{
                background: "var(--accent-light, rgba(109,40,217,0.07))",
                borderRadius: 10,
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent, #6d28d9)" }}>{count}</div>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{label}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted, #666)" }}>{note}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Work Process &amp; Skills</h3>
        <p>
          The project was completed over a <strong>five-week period</strong> by a team of five students. Work involved data gathering, cleaning, and compilation. The team utilized <strong>Python</strong> and the <strong>Pandas</strong> library to organize data, though formatting issues with messy source data sometimes limited the use of Pandas. Participants gained experience in research, communication, and project coordination.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Challenges &amp; Future Improvements</h3>
        <p>
          The team addressed challenges related to task division, data organization, and missing information. Potential optimizations for future iterations include using automated scraping and Pandas earlier in the process, as well as conducting preliminary research on which provinces recognize municipal parties to improve workflow efficiency.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <ul style={{ listStyleType: "none", paddingLeft: 0, marginTop: 0 }}>
          <li><strong>Team Members:</strong> Lillian Pianosi, Elias Titian, Joey Lee, Ethan Gallipeau, Tim Guan</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Project Slides</h3>
        <iframe
          src="content/politicalparties.pdf"
          width="100%"
          height="600px"
          title="Canadian Political Parties Database Slides"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        />
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/politicalparties.pdf"
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
