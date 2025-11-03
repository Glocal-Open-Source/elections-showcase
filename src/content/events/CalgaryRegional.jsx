import React from "react";

export default function CalgaryRegional() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginTop: "2rem" }}>
        <h3>Calgary Regional Showcase</h3>
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
          <source src="content/calgary-regional.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Agenda</h3>
        <ul>
          <li>
            <strong>10:00 AM |</strong> <strong>Welcoming Remarks</strong> by Faye Ying, Executive Director, GLOCAL Foundation of Canada
          </li>
          <li>
            <strong>10:05 AM |</strong> <strong>Keynote Address</strong> delivered by a Member of Parliament
          </li>
          <li>
            <strong>10:15 AM |</strong> <strong>Panel Discussion:</strong> “Why Youth Civic Participation Matters – Local Voices, Global Impact”<br />
            Facilitated by Ms. Robina Hamdard, Community Outreach Manager, GLOCAL Foundation of Canada
          </li>
          <li>
            <strong>11:30 AM |</strong> Lunch & Networking Break
          </li>
          <li>
            <strong>12:15 PM |</strong> <strong>Project Showcase:</strong> Youth Civic Initiatives in Action — presentations by Canada Summer Jobs staff, Microgrant recipients, and GLOCAL volunteers
          </li>
          <li>
            <strong>1:45 – 2:00 PM |</strong> <strong>Closing Reflections & Community Dialogue</strong><br />
            Open discussion for participants, parents, and community members to share feedback and next steps.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>About the Showcase</h3>
        <p>
          The <strong>Calgary Regional Showcase</strong> celebrates youth civic leadership across Alberta and Western Canada.
          The event convenes policymakers, educators, and emerging leaders to discuss youth-driven approaches to civic engagement,
          policy innovation, and community development.
        </p>
        <p>
          Participants explore themes such as <strong>public trust, environmental action, digital literacy,</strong> and <strong>inclusive governance</strong>.
          The showcase emphasizes collaboration between youth and elected officials in strengthening democratic institutions.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Program Highlights</h3>
        <ul>
          <li>
            Keynotes and addresses from Members of Parliament and community leaders focused on civic inclusion and leadership.
          </li>
          <li>
            Youth-led panels and presentations demonstrating innovative policy and outreach projects supported by GLOCAL’s
            <strong> CANConnect Microgrant</strong> and <strong>Canada Summer Jobs</strong> initiatives.
          </li>
          <li>
            Networking opportunities fostering mentorship between policymakers and young changemakers.
          </li>
        </ul>
      </section>

      <blockquote style={{ background: "#f8f8f8", padding: "1rem", borderLeft: "4px solid #5b2bff" }}>
        <strong>
          “Empowering youth to lead civic change is not just about representation — it’s about
          reshaping Canada’s democratic culture for the next generation.”
        </strong>
        <br />
        <em>— GLOCAL Foundation of Canada</em>
      </blockquote>

      <figure style={{ marginTop: "2rem" }}>
        <img
          src="thumbnails/events/calgary-showcase.jpg"
          alt="2025 Calgary Regional Showcase"
          style={{
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa"
          }}
        />
        <figcaption style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
          2025 Calgary Regional Showcase – Celebrating Youth-Led Civic Leadership
        </figcaption>
      </figure>

    </article>
  );
}
