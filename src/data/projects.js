import OverseasToolkit from "../content/OverseasToolkit";
import CivicIssuesReport from "../content/CivicIssuesReport";

const projects = [
  {
    id: 1,
    title: "Overseas Canadians Voting e-Toolkit",
    type: "report",
    description:
      "Comprehensive toolkit designed to assist Canadians living abroad with voting procedures. Includes step-by-step instructions, timelines, and downloadable resources.",
    image: "thumbnails/overseas.jpg",
    embed: "/projects/overseas-canadians-voting.pdf",
    tags: ["voting", "education"],
    component: OverseasToolkit,
  },
  {
    id: 2,
    title: "Canadians and Civic Issues: An Analysis of 2021 Canadian Election Study Data",
    type: "report",
    description:
      "A data-driven exploration of civic participation, political trust, and voting behavior in Canada based on the 2021 Canadian Election Study.",
    image: "thumbnails/civic-issues.jpg",
    embed: "/projects/canadians-civic-issues.pdf",
    tags: ["data", "civic"],
    component: CivicIssuesReport,
  },
  {
    id: 3,
    title: "E-Journal Data",
    type: "dashboard",
    description:
      "An interactive mix of PDFs and embedded dashboards offering analytical insights across Canadian electoral and civic engagement datasets.",
    image: "thumbnails/ejournal.jpg",
    embed: "https://glocalfoundation.ca/e-journal-data",
    tags: ["data", "dashboard"],
  },
  {
    id: 4,
    title: "Understanding Local Governance in Canada",
    type: "report",
    description:
      "Detailed examination of unique characteristics of local governance models within each province and territory in Canada.",
    image: "thumbnails/governance.jpg",
    embed: "/projects/governance.html",
    tags: ["governance", "report"],
  },
  {
    id: 5,
    title: "Election Data Explorer",
    type: "dashboard",
    description:
      "A dataset and dashboard hybrid that visualizes electoral data, voter turnout, and regional voting trends across Canada.",
    image: "thumbnails/data-explorer.jpg",
    embed: "/projects/election-data-explorer.html",
    tags: ["data", "dashboard"],
  },
  {
    id: 6,
    title: "Canadian Voting Trends",
    type: "report",
    description:
      "A longitudinal analysis of voting patterns in Canada, highlighting demographic, geographic, and temporal changes in electoral participation.",
    image: "thumbnails/voting-trends.jpg",
    embed: "/projects/canadian-voting-trends.html",
    tags: ["voting", "analysis"],
  },
  {
    id: 7,
    title: "VoteMatch",
    type: "interactive",
    description:
      "An interactive quiz that helps Canadians discover which party platforms align most closely with their values and priorities.",
    image: "thumbnails/votematch.jpg",
    embed: "/projects/votematch.html",
    tags: ["interactive", "voting"],
  },
  {
    id: 8,
    title: "Election Contributions and Outcomes",
    type: "data",
    description:
      "Analyzes the relationship between campaign financing and electoral outcomes, using open data on political donations and candidate performance.",
    image: "thumbnails/contributions.jpg",
    embed: "/projects/election-contributions.html",
    tags: ["finance", "analysis"],
  },
  {
    id: 9,
    title: "Canadian Federal Election Results Visualization",
    type: "dashboard",
    description:
      "A visual exploration of Canadian federal election results, highlighting seat distributions, turnout rates, and historical changes.",
    image: "thumbnails/federal-results.jpg",
    embed: "https://glocalfoundation.ca/educational-resources",
    tags: ["data", "dashboard"],
  },
  {
    id: 10,
    title: "2025 Federal Elections Candidates Database",
    type: "data",
    description:
      "A comprehensive database of candidates running in the 2025 Canadian federal elections, including profiles, party affiliations, and electoral districts.",
    image: "thumbnails/candidates-data.jpg",
    embed: "https://www.youcount.ca/elections/ng/fed-2025",
    tags: ["data", "voting"],
  },
  {
    id: 11,
    title: "2025 Post-Election Analysis",
    type: "report",
    description:
      "An analytical report examining the outcomes of the 2025 Canadian federal elections, voter turnout, and implications for future political trends.",
    image: "thumbnails/post-election.jpg",
    embed: "https://glocalfoundation.ca/educational-resources",
    tags: ["report", "analysis"],
  },
  {
    id: 12,
    title: "Voting Information Game",
    type: "interactive",
    description:
      "An engaging game designed to educate Canadians about voting procedures, eligibility, and the importance of civic participation.",
    image: "thumbnails/gaming.jpg",
    embed: "https://voting-app-frontend-wheat.vercel.app/begin-journey",
    tags: ["interactive", "education"],
  },
];

export default projects;
