import React from "react";

export default function ChloeApp() {
  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      {/* Main Project Content (70%) */}
      <article style={{ flex: "0 0 60%", lineHeight: 1.6 }}>

        <section style={{ marginBottom: "2rem" }}>
          <h3>The Problem</h3>
          <p>
            Many Canadians remain disconnected from civic processes due to fragmented and inaccessible data sources. 
            Even as interest in governance grows, platforms that communicate key civic updates in real time are limited. 
            According to a 2024 Nortal Survey, <strong>70% of Canadian respondents want the government to deliver a fully 
            digital suite of public services</strong> — demonstrating an urgent demand for better civic information infrastructure.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3>The Solution: CivicEngage iOS App</h3>
          <p>
            The <strong>CivicEngage App</strong> is an iOS-based solution designed to make local politics, elections, and 
            governance updates more accessible. By combining personalization, gamification, and real-time data, the app helps 
            users stay informed and engaged with civic developments in their community.
          </p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3>Core Features</h3>
          <ul>
            <li>
              <strong>Personalized Interactive Quiz:</strong> Engages users through region-specific questions that build 
              civic literacy and tailor insights to personal interests.
            </li>
            <li>
              <strong>Live Civic News Feed:</strong> Provides a continuously updated dashboard showing local events, 
              elections, and policy developments.
            </li>
            <li>
              <strong>Civic Events Feed:</strong> Highlights upcoming community activities, election dates, and 
              opportunities for involvement.
            </li>
            <li>
              <strong>App Demo Features:</strong>
              <ul>
                <li>Personal Stats Tracker – Gamifies civic learning through streaks and accuracy tracking.</li>
                <li>Leaderboard – Ranks users to encourage ongoing engagement and friendly competition.</li>
                <li>Live Civic Feed – Real-time updates on regional politics and governance.</li>
                <li>Personalized Civic Updates – Region-specific election and government announcements.</li>
                <li>Quick Access to Key Issues – Filters allow users to focus on topics that impact their community.</li>
                <li>Engagement Through Timeliness – Frequent updates keep users connected to ongoing decisions.</li>
              </ul>
            </li>
          </ul>
        </section>
      </article>

      {/* Side Video Panel (30%) */}
      <aside style={{ flex: "0 0 30%", position: "sticky", top: "1rem", borderRadius: "25%" }}>
        <h3>Watch Demo</h3>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#000",
            marginTop: "1rem",
            height: "80vh",
            objectFit: "cover"
          }}
        >
          <source src="content/chloe.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
          App demonstration showcasing user flow, personalization, and live civic updates.
        </p>
      </aside>
    </div>

  );
}
