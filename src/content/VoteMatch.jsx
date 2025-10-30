import React from "react";

export default function VoteMatch() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>VoteMatch: Exploring Voter Profiles and Party Preference</h3>
        <p>
          <strong>VoteMatch</strong> is an interactive civic data tool created by{" "}
          <strong>Ran Shi</strong>, a Canada Summer Jobs (CSJ) Data Analytical
          Specialist at the GLOCAL Foundation of Canada. Using the{" "}
          <a
            href="https://cces.ca/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            2021 Canadian Election Study (CES)
          </a>
          , the tool estimates how closely an individual’s views align with
          Canadian political parties based on demographic and attitudinal data.
        </p>
        <p>
          The project’s goal is to make political data approachable and
          personalized—helping Canadians better understand their place in the
          political landscape. VoteMatch allows users to answer 16 short
          questions about their perspectives and then shows how similar profiles
          voted in the past federal election.
        </p>
        <p>
          Behind the scenes, the system uses machine learning techniques—
          including correlation tests, feature selection, and XGBoost modeling—
          to predict probabilities for each major Canadian party. The underlying
          work balances accessibility and rigor, demonstrating how civic
          education and data science can work together.
        </p>
      </section>

      {/* Interactive App Embed */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h4 style={{ marginBottom: "1rem" }}>Try the Interactive Tool</h4>
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            height: "700px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <iframe
            src="https://riie134340.shinyapps.io/shiny/"
            title="VoteMatch Interactive Tool"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </div>
      </section>

      {/* PDFs Section */}
      <section style={{ marginTop: "2rem" }}>
        <h4>Related Files</h4>
        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "1rem" }}>
          <li style={{ marginBottom: "1rem" }}>
            <a
              href="/content/votematch.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#5b2bff",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              📘 VoteMatch Presentation Slides
            </a>
          </li>
          <li>
            <a
              href="/content/votematchtechnical.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#5b2bff",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              📊 Technical Report: Modeling & Methodology
            </a>
          </li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          <strong>Research and Development:</strong> Ran Shi<br />
          <strong>Program:</strong> Canada Summer Jobs – Data Analytical Specialist<br />
          <strong>Contact:</strong>{" "}
          <a
            href="mailto:ran@glocalfoundation.ca"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            ran@glocalfoundation.ca
          </a>
        </p>
      </section>
    </article>
  );
}
