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
      <section
        style={{
          position: "relative",
          paddingBottom: "56.25%", // 16:9
          height: 0,
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          backgroundImage:
            'url("https://i.vimeocdn.com/video/1234738524-2221cda2b86c878b1e5966d97802cd2127aaf4e2cf8718e79835a3a0bc0c9de8-d?mw=1200&mh=675")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: "1.5rem",
        }}
      >
        <iframe
          src="https://player.vimeo.com/video/518882480?h=1b2b6fa91a"
          title="Canadian Federal Election Results (1867–2015)"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "12px",
          }}
        ></iframe>
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
