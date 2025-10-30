import React from "react";

export default function VoteGame() {
  return (
    <article
      style={{
        lineHeight: 1.6,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        gap: "2rem",
      }}
    >
      {/* Text Section */}
      <section style={{ flex: "1 1 400px", minWidth: "320px" }}>
        <h3>Introducing VoteReady!</h3>
        <p>
          <strong>VoteReady</strong> is a civic education e-tool designed to help
          Canadians learn about voting in a simple, interactive way. Led by a team of
          passionate Canadian youth, this initiative aims to make learning about the
          electoral process more accessible and engaging for first-time and returning
          voters alike.
        </p>
        <p>
          The e-tool functions as a <strong>pre-voting checklist</strong>—guiding users
          through key steps such as confirming registration, understanding ID
          requirements, and learning about voting options. It combines educational
          content with interactive prompts to make preparation for election day both
          informative and enjoyable.
        </p>
        <p>
          We invite you to explore <em>VoteReady</em> and share your feedback to help us
          refine its design and usability. Your support directly contributes to building
          a stronger culture of civic literacy and participation in Canada.
        </p>

        <div style={{ marginTop: "1.5rem" }}>
          <a
            href="https://voting-app-frontend-wheat.vercel.app/begin-journey"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#5b2bff",
              color: "#fff",
              textDecoration: "none",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "background-color 0.25s ease",
              boxShadow: "0 4px 10px rgba(91,43,255,0.25)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6d2d91")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5b2bff")}
          >
            Launch VoteReady
          </a>
        </div>
      </section>

      {/* Embed Preview Section */}
      <section
        style={{
          flex: "0 1 360px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "360px",
            height: "640px",
            border: "12px solid #000",
            borderRadius: "32px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            backgroundColor: "#000",
          }}
        >
          <iframe
            src="https://voting-app-frontend-wheat.vercel.app/begin-journey"
            title="VoteReady Interactive Tool"
            width="100%"
            height="100%"
            style={{
              border: "none",
              transform: "scale(1)",
              transformOrigin: "top left",
            }}
          ></iframe>
        </div>
      </section>
    </article>
  );
}
