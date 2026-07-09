import React from "react";

export default function MunicipalDataCollectionAndCompiling() {
  return (
    <article style={{ lineHeight: 1.6 }}>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Project Team</h3>
        <p>
          Akshini Nithianandan, Alireza Nouri, Andrew Kim, Angelina Chen, Denish Manogarakumar,
          Florence Daran, Michael Neil Kossuth
        </p>
        <p>Project Managed by Daniel Biel</p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Summary</h3>
        <p>
          This project compiled a comprehensive municipal dataset for Canada by collecting and
          processing publicly available Statistics Canada data. Using Python and the Pandas library,
          the team filtered and transformed large datasets containing millions of rows to extract
          key variables across demographics, cultural identity, and socio-economic indicators for
          most Canadian municipalities.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Methodology</h3>
        <p>
          All datasets were linked using the DGUID (Dissemination Geography Unique Identifier), a
          10–21 character code introduced in the 2016 Census that uniquely identifies each geographic
          area. This allowed the team to join multiple datasets across a common key. Python and Pandas
          were used to filter columns, remove duplicates, and transpose data — making it feasible to
          process data that would not be manageable manually.
        </p>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h3>Data Collected</h3>
        <p>The final compiled dataset covers the 2021 census year and includes:</p>
        <ul>
          <li><strong>Land Area</strong> — Physical size of each municipality in km²</li>
          <li><strong>Population &amp; Dwellings</strong> — Population change and dwelling counts from 2016 to 2021</li>
          <li><strong>Population by Age</strong> — Breakdown into 0–14, 15–64, and 65+ age groups</li>
          <li><strong>Immigration Status</strong> — Non-immigrants, immigrants, recent immigrants (2016–2021), and non-permanent residents</li>
          <li><strong>Visible Minorities</strong> — Population share by visible minority group per municipality</li>
          <li><strong>Language</strong> — English only, French only, both, or neither</li>
          <li><strong>Labour Force Characteristics</strong> — Average unemployment rate by municipality and province</li>
        </ul>
      </section>

    </article>
  );
}
