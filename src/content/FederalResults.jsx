import React from "react";

export default function FederalResults() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Data Visualization: Canadian Federal Election Results (1867–2015)</h3>
        <p>
          This animated data visualization, created by <strong>Sakib Mohammed</strong>,
          illustrates the shifting landscape of political party popularity in Canada
          from Confederation through 2015. Drawing on official data from{" "}
          <a
            href="https://www.elections.ca"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            Elections Canada
          </a>
          , the project highlights over a century of electoral trends, party dominance,
          and historical turning points that have shaped Canadian democracy.
        </p>
        <p>
          The visualization uses motion and comparative ranking to help viewers see how
          regional and national preferences evolved across decades, providing an
          accessible overview of Canada’s federal election history in a single,
          data-driven animation.
        </p>
      </section>

      {/* Video Embed */}
      <section style={{ marginTop: "2rem" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#000",
            marginTop: "1rem"
          }}
        >
          <source src="content/sakib.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <section>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          <strong>Research and Video Production:</strong> Sakib Mohammed<br />
          <strong>Source:</strong> Elections Canada
        </p>
      </section>
    </article>
  );
}
