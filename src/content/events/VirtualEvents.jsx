import React from "react";

export default function VirtualEvents() {
  return (
    <article style={{ lineHeight: 1.6 }}>
      <section style={{ marginBottom: "2rem" }}>
        <h2>GLOCAL Virtual Events</h2>
        <p>
          Discover GLOCAL’s lineup of engaging workshops and insightful panel sessions! 
          Every event is designed to empower participants with practical takeaways and 
          new perspectives from accomplished speakers. Our events proudly feature 
          government officials, leading researchers, and influential community leaders 
          who inspire civic action and dialogue across Canada.
        </p>
        <p>
          Whether you’re joining a fireside chat, a youth roundtable, or a policy innovation workshop, 
          you’ll gain first-hand insights into Canada’s civic landscape — and connect with 
          like-minded changemakers from coast to coast.
        </p>
      </section>

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <a
          href="https://glocalfoundation.ca/our-events"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            style={{
              background: "linear-gradient(90deg, #5b2bff, #7b3fff)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "1rem 2rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "0.3s"
            }}
            onMouseOver={(e) => (e.target.style.opacity = 0.85)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            View All Events →
          </button>
        </a>
      </div>
    </article>
  );
}
