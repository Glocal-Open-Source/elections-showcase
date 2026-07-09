import React from "react";

export default function CanadasMediaMonitor() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Keven Pi</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>This project is a comprehensive system designed to collect and analyze a wide array of local public news and social media posts. Its primary aim is to convert large volumes of raw news data into usable and meaningful analytics. This project is driven by the necessity to interpret and quantify the changing stories and opinions found in our vast online media landscape, a task that is increasingly important for understanding political events and social trends that influence public conversations and policy-making. A feature of this project is the use of Large Language Models (LLMs), specifically OpenAI&#x27;s GPT. The integration of LLMs is a response to their growing prominence and enhanced capabilities in recent years. In this project, LLMs serve a crucial role beyond just assisting with tasks; they revolutionize the process of extracting complex data, a challenge that was difficult to address with traditional techniques. With LLMs, efficiently mining detailed insights from extensive text data is now more feasible. Alongside, &quot;Political Insights&quot; employs web scraping techniques, utilizes a Flask-Python framework for backend development, incorporates a user-friendly frontend interface, and applies various data analytics algorithms. Additionally, it manages data storage and retrieval through effective database management, all of which work together to transform diverse news data into insightful and actionable information.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <object
          data="content/canada-s-media-monitor-keven-pi.pdf"
          type="application/pdf"
          aria-label="Canada&#x27;s Media Monitor"
          style={{ width: "100%", height: "700px", border: "1px solid #ddd", borderRadius: "8px" }}
        >
          <a href="content/canada-s-media-monitor-keven-pi.pdf" target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
        </object>
      </section>
    </article>
  );
}
