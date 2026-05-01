import React from "react";

export default function MentalHealthAndDisability() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>Team Members: Diya Advani, Alyssa Christou, Keeley McFadden, Zoe Oliver, and Arianna Persaud-Harper</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Summary</h3>
        <p>This project examined mental health and disability in Canada with a focus on how policy, systems, and social factors shape access to care. A central finding was that barriers are not only clinical but structural—policy gaps, legal frameworks, stigma, and social determinants all influence outcomes. The research highlighted the importance of civic literacy, showing that individuals are often limited not just by services themselves, but by their ability to understand and navigate them. It also underscored the need to translate complex legal and policy information into formats the public can actually use.</p>
        <p>To address this, the team produced a set of practical, public-facing deliverables designed for accessibility and engagement. These included infographics to simplify key concepts, interactive quizzes to reinforce learning, a centralized website to host resources, and supporting research outputs such as literature reviews, annotated bibliographies, and policy analyses. Together, these deliverables function as both educational tools and a structured knowledge base, bridging the gap between academic research and public understanding.</p>
        <p>Overall, the work demonstrates that effective impact in this space depends less on generating new information and more on how clearly and accessibly existing knowledge is communicated.</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Full Document</h3>
        <iframe
          src="content/Placement Presentation.pdf"
          width="100%"
          height="600px"
          title="Mental Health and Disability"
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        />
        <p style={{ marginTop: "0.5rem" }}>
          <a
            href="/content/Placement Presentation.pdf"
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
