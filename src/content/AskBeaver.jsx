import React from "react";

export default function AskBeaver() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Ask Eager Beaver – Connecting Citizens and Democracy</h3>
        <p>
          <strong>Ask Eager Beaver</strong> is an interactive civic education and
          engagement platform hosted on{" "}
          <a
            href="https://www.youcount.ca/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            YouCount.ca
          </a>
          . It empowers Canadians to ask questions about how government works,
          how decisions are made, and how they can meaningfully participate in
          public life.
        </p>

        <p>
          The tool collects real questions from the public, lets users vote on
          the ones they find most relevant, and forwards these to the appropriate
          elected representatives or institutions. It helps bridge the
          communication gap between citizens and policymakers while fostering a
          culture of democratic curiosity and accountability.
        </p>

        <p>
          Common questions include topics such as the difference between MPs and
          Senators, how federal and provincial powers interact, or why Canada is
          a constitutional monarchy. Each question helps reveal where civic
          understanding can be deepened and where clearer information from
          public institutions could make a difference.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h4>How It Works</h4>
        <ul style={{ marginLeft: "1.2rem" }}>
          <li>Users submit questions about government, democracy, or elections.</li>
          <li>Other visitors can upvote the questions they find most valuable.</li>
          <li>
            High-interest questions are reviewed and forwarded to representatives or
            civic educators for response or clarification.
          </li>
          <li>
            Responses and resources are published publicly to support civic learning
            for all Canadians.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h4>Why It Matters</h4>
        <p>
          Ask Eager Beaver strengthens civic literacy by turning curiosity into
          participation. It supports the democratic objectives of Elections Canada
          and other institutions by helping Canadians understand not only{" "}
          <em>how</em> to vote, but also <em>why</em> democratic engagement matters
          beyond election day.
        </p>
      </section>

      <section style={{ textAlign: "center", marginTop: "2rem" }}>
        <a
          href="https://www.youcount.ca/ask-eager-beaver"
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
          Visit Ask Eager Beaver
        </a>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          <strong>Developed by:</strong> GLOCAL Foundation of Canada<br />
          <strong>Hosted on:</strong> YouCount.ca<br />
          <strong>Contact:</strong>{" "}
          <a
            href="mailto:info@glocalfoundation.ca"
            style={{ color: "#5b2bff", fontWeight: 600 }}
          >
            info@glocalfoundation.ca
          </a>
        </p>
      </section>
    </article>
  );
}
