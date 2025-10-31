import OverseasToolkit from "../content/OverseasToolkit";
import CivicIssuesReport from "../content/CivicIssuesReport";
import EJournal from "../content/EJournal";
import LocalGovernance from "../content/LocalGovernance";
import ElectionsData from "../content/ElectionsData";
import AskBeaver from "../content/AskBeaver";
import VoteMatch from "../content/VoteMatch";
import ElectionContributions from "../content/ElectionContributions";
import FederalResults from "../content/FederalResults";
import CandidatesData from "../content/CandidatesData";
import PostElection from "../content/PostElection";
import VoteGame from "../content/VoteGame";

const projects = [
  {
    id: 1,
    title: "Overseas Canadians Voting e-Toolkit",
    type: "report",
    description:
      "Comprehensive toolkit designed to assist Canadians living abroad with voting procedures. Includes step-by-step instructions, timelines, and downloadable resources.",
    image: "thumbnails/overseas.jpg",
    embed: "/projects/overseas-canadians-voting.pdf",
    tags: ["digital-democracy", "voter-access", "civic-tech"],
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
    tags: ["civic-insight", "data-science", "democracy-research"],
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
    tags: ["open-data", "visual-analytics", "knowledge-integration"],
    component: EJournal,
  },
  {
    id: 4,
    title: "Understanding Local Governance in Canada",
    type: "report",
    description:
      "Detailed examination of unique characteristics of local governance models within each province and territory in Canada.",
    image: "thumbnails/governance.jpg",
    embed: "/projects/governance.html",
    tags: ["governance-systems", "policy-mapping", "institutional-analysis"],
    component: LocalGovernance,
  },
  {
    id: 5,
    title: "Election Data Explorer",
    type: "dashboard",
    description:
      "A dataset and dashboard hybrid that visualizes electoral data, voter turnout, and regional voting trends across Canada.",
    image: "thumbnails/data-explorer.jpg",
    embed: "/projects/election-data-explorer.html",
    tags: ["data-visualization", "election-trends", "civic-analytics"],
    component: ElectionsData,
  },
  {
    id: 6,
    title: "Ask Eager Beaver",
    type: "interactive",
    description:
      "A civic engagement tool on YouCount.ca that allows Canadians to ask and upvote questions about government, democracy, and representation — bridging citizens and policymakers.",
    image: "thumbnails/askbeaver.jpg",
    tags: ["public-engagement", "civic-literacy", "digital-dialogue"],
    component: AskBeaver,
  },
  {
    id: 7,
    title: "VoteMatch",
    type: "interactive",
    description:
      "An interactive quiz that helps Canadians discover which party platforms align most closely with their values and priorities.",
    image: "thumbnails/votematch.jpg",
    embed: "/projects/votematch.html",
    tags: ["machine-learning", "political-alignment", "interactive-data"],
    component: VoteMatch,
  },
  {
    id: 8,
    title: "Elections Contributions and Outcomes",
    type: "report",
    tags: ["campaign-finance", "data-analysis", "evidence-based-policy"],
    description:
      "An analysis of campaign donation data in Canadian elections by Carmen Y through the Canada Summer Jobs program, exploring links between fundraising and results.",
    image: "thumbnails/contributions.jpg",
    component: ElectionContributions,
  },
  {
    id: 9,
    title: "Canadian Federal Election Results Visualization",
    type: "dashboard",
    description:
      "A visual exploration of Canadian federal election results, highlighting seat distributions, turnout rates, and historical changes.",
    image: "thumbnails/federal-results.jpg",
    embed: "https://glocalfoundation.ca/educational-resources",
    tags: ["historical-trends", "data-storytelling", "visual-history"],
    component: FederalResults,
  },
  {
    id: 10,
    title: "2025 Federal Elections Candidates Database",
    type: "data",
    description:
      "A comprehensive database of candidates running in the 2025 Canadian federal elections, including profiles, party affiliations, and electoral districts.",
    image: "thumbnails/candidates-data.jpg",
    embed: "https://www.youcount.ca/elections/ng/fed-2025",
    tags: ["representative-data", "open-governance", "civic-infrastructure"],
    component: CandidatesData,
  },
  {
    id: 11,
    title: "2025 Post-Election Analysis",
    type: "report",
    description:
      "An analytical report examining the outcomes of the 2025 Canadian federal elections, voter turnout, and implications for future political trends.",
    image: "thumbnails/post-election.jpg",
    embed: "https://glocalfoundation.ca/educational-resources",
    tags: ["post-election", "insight-report", "democracy-forecasting"],
    component: PostElection,
  },
  {
    id: 12,
    title: "VoteReady: Pre-Flight Checklist for Canadian Voters",
    type: "interactive",
    description:
      "An engaging game designed to educate Canadians about voting procedures, eligibility, and the importance of civic participation.",
    image: "thumbnails/gaming.jpg",
    embed: "https://voting-app-frontend-wheat.vercel.app/begin-journey",
    tags: ["gamified-learning", "voter-preparedness", "civic-education"],
    component: VoteGame,
  },
];


export default projects;
