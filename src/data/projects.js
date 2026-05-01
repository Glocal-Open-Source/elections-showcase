import CanadianParties from "../content/CanadianParties";
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
import FederalismReport from "../content/FederalismReport";
import CDEM2019Report from "../content/CDEM2019Report";
import VancouverRegional from "../content/events/VancouverRegional";
import CalgaryRegional from "../content/events/CalgaryRegional";
import ChloeApp from "../content/ChloeApp";
import VirtualEvents from "../content/events/VirtualEvents";
import FromPipesToPeopleAddressing from "../content/FromPipesToPeopleAddressing";
import MentalHealthAndDisability from "../content/MentalHealthAndDisability";
import ImmigrationLawsTips from "../content/ImmigrationLawsTips";
import YoucountMobileAppRedesigningAccess from "../content/YoucountMobileAppRedesigningAccess";


const projects = [
  {
    id: 1,
    title: "VoteReady: Digital Checklist for Canadian Voters",
    type: "interactive",
    description:
      "An engaging game designed to educate Canadians about voting procedures, eligibility, and the importance of civic participation.",
    image: "thumbnails/gaming.jpg",
    embed: "https://voting-app-frontend-wheat.vercel.app/begin-journey",
    tags: ["elections-canada", "civic-education", "civic-tech"],
    component: VoteGame,
  },
  {
    id: 6,
    title: "Ask Eager Beaver",
    type: "interactive",
    description:
      "A civic engagement tool on YouCount.ca that allows Canadians to ask and upvote questions about government, democracy, and representation — bridging citizens and policymakers.",
    image: "thumbnails/askbeaver.jpg",
    tags: ["civic-tech", "civic-education", "civic-engagement"],
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
    tags: ["elections-canada", "civic-tech", "data-analysis"],
    component: VoteMatch,
  },
  {
    id: 21,
    title: "CivicEngage Mobile App",
    type: "interactive",
    description: "An innovative civic technology project by Chloe Sepulveda that integrates a live candidate dashboard and an iOS app designed to make political information more engaging and accessible. The platform combines personalized quizzes, live civic updates, and gamified learning tools to enhance democratic participation and awareness among Canadians.",
    image: "thumbnails/chloe.jpg",
    embed: "",
    tags: ["elections-canada", "civic-tech", "civic-education"],
    component: ChloeApp
  },
  {
    id: 2,
    title: "Canadians and Civic Issues: An Analysis of 2021 Canadian Election Study Data",
    type: "report",
    description:
      "A data-driven exploration of civic participation, political trust, and voting behavior in Canada based on the 2021 Canadian Election Study.",
    image: "thumbnails/cdem2021.jpg",
    embed: "/projects/canadians-civic-issues.pdf",
    tags: ["elections-canada", "data-analysis", "democracy-research"],
    component: CivicIssuesReport,
  },
  {
    id: 3,
    title: "E-Journal Data",
    type: "data",
    description:
      "An interactive mix of PDFs and embedded dashboards offering analytical insights across Canadian electoral and civic engagement datasets.",
    image: "thumbnails/ejournal.jpg",
    embed: "https://glocalfoundation.ca/e-journal-data",
    tags: ["data-analysis", "open-data", "civic-education"],
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
    tags: ["governance", "civic-education"],
    component: LocalGovernance,
  },
  {
    id: 5,
    title: "Election Data Explorer",
    type: "data",
    description:
      "A dataset and dashboard hybrid that visualizes electoral data, voter turnout, and regional voting trends across Canada.",
    image: "thumbnails/data-explorer.jpg",
    embed: "/projects/election-data-explorer.html",
    tags: ["elections-canada", "data-analysis", "data-visualization"],
    component: ElectionsData,
  },


  {
    id: 8,
    title: "Elections Contributions and Outcomes",
    type: "report",
    tags: ["elections-canada", "data-analysis"],
    description:
      "An analysis of campaign donation data in Canadian elections by Carmen Y through the Canada Summer Jobs program, exploring links between fundraising and results.",
    image: "thumbnails/contributions.jpg",
    component: ElectionContributions,
  },
  {
    id: 9,
    title: "Canadian Federal Election Results Visualization",
    type: "data",
    description:
      "A visual exploration of Canadian federal election results, highlighting seat distributions, turnout rates, and historical changes.",
    image: "thumbnails/federal-results.jpg",
    embed: "https://glocalfoundation.ca/educational-resources",
    tags: ["elections-canada", "data-visualization", "data-analysis"],
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
    tags: ["elections-canada", "open-data", "civic-tech"],
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
    tags: ["elections-canada", "data-analysis", "democracy-research"],
    component: PostElection,
  },

  {
    id: 12,
    title: "Overseas Canadians Voting e-Toolkit",
    type: "report",
    description:
      "Comprehensive toolkit designed to assist Canadians living abroad with voting procedures. Includes step-by-step instructions, timelines, and downloadable resources.",
    image: "thumbnails/overseas.jpg",
    embed: "/projects/overseas-canadians-voting.pdf",
    tags: ["elections-canada", "civic-education"],
    component: OverseasToolkit,
  },

  {
    id: 13,
    title: "Understanding Federalism in Canada",
    type: "report",
    description: "A comprehensive analysis of Canadian federalism, exploring the constitutional division of powers between federal and provincial governments.",
    image: "thumbnails/federalism.jpg",
    embed: "https://glocalfoundation.ca/projects/federalism-division-of-powers.pdf",
    tags: ["governance", "civic-education"],
    component: FederalismReport
  },
  {
  id: 14,
  title: "Canadians and Civic Issues: An Analysis of 2019 Canadian Election Study Data",
  type: "report",
  description: "An analytical report examining civic engagement and political awareness among Canadians using C-DEM’s 2019 Canadian Election Study data.",
  image: "thumbnails/cdem2019.jpg",
  embed: "https://glocalfoundation.ca/projects/cdem2019-canadians-and-civic-issues.pdf",
  tags: ["elections-canada", "data-analysis", "democracy-research"],
  component: CDEM2019Report
},
{
  id: 15,
  title: "Vancouver Regional Showcase",
  type: "events",
  description: "An in-person civic engagement showcase held in Vancouver, featuring MPs, MPPs, researchers, and community leaders discussing electoral participation, youth engagement, and civic literacy in Western Canada.",
  image: "thumbnails/events/vancouver.jpg",
  embed: "",
  tags: ["events", "elections-canada", "civic-engagement"],
  component: VancouverRegional
},
{
  id: 16,
  title: "Calgary Regional Showcase",
  type: "events",
  description: "A live regional event in Calgary spotlighting civic dialogue between policymakers, academics, and youth. The showcase emphasized federal–provincial collaboration, representation, and accessible participation in democratic processes.",
  image: "thumbnails/events/calgary-regional.jpg",
  embed: "thumbnails/events/calgary-meet.jpg",
  tags: ["events", "elections-canada", "civic-engagement"],
  component: CalgaryRegional
},
{
  id: 17,
  title: "Winnipeg Regional Showcase",
  type: "events",
  description: "An in-person showcase in Winnipeg convening MPs, MPPs, community advocates, and emerging scholars to discuss the evolution of Canada’s electoral landscape and civic education initiatives across the Prairies.",
  image: "thumbnails/events/winnipeg-regional.jpg",
  embed: "",
  tags: ["events", "elections-canada", "civic-engagement"]
},
{
  id: 18,
  title: "Voices from Arctic Communities",
  type: "events",
  description: "A virtual panel featuring Arctic community leaders discussing the unique challenges and opportunities for civic engagement and electoral participation in Northern Canada.",
  image: "thumbnails/events/nunavut.jpg",
  embed: "thumbnails/events/arctic.jpg",
  tags: ["events", "elections-canada", "outreach"]
},
{
  id: 19,
  title: "Education and Community in the North: Lessons from Fort Resolution",
  type: "events",
  description: "A virtual discussion with Deninu School Principal Simone Degannes-Lange, exploring the intersection of education, culture, and electoral participation in Northern Indigenous communities.",
  image: "thumbnails/events/deninu.jpg",
  embed: "thumbnails/events/fort-resolution-poster.jpg",
  tags: ["events", "elections-canada", "indigenous-engagement"]
},
{
  id: 20,
  title: "Understanding Economic Voting in Canadian Elections",
  type: "events",
  description: "Dr. Cameron Anderson, Professor of Political Science at Western University, presents his research on economic voting behaviour in Canadian federal elections.",
  image: "thumbnails/events/camand.jpg",
  embed: "thumbnails/events/cameron-anderson.jpg",
  tags: ["events", "elections-canada", "civic-education"]
},

{
  id: 22,
  title: "GLOCAL Virtual Events",
  type: "events",
  description: "All of GLOCAL's upcoming and past events in one place, including regional showcases, virtual panels, and infographic poster series aimed at promoting civic engagement and electoral participation across Canada.",
  image: "thumbnails/events/virtual-meeting.jpg",
  embed: "",
  tags: ["events", "elections-canada", "archive"],
  component: VirtualEvents
},

{
  id: 23,
  title: "Disconnected and Distrustful: Analysis of Youth Mental Health, Political Trust, and Voter Participation in Canada",
  type: "data",
  description: "A comprehensive analysis of youth mental health trends in Canada and their correlation with political trust and voter participation, utilizing data from national surveys and electoral studies.",
  image: "thumbnails/youth-mental-health.jpg",
  embed: "content/aidan-health.pdf",
  tags: ["statistics-canada", "data-analysis", "youth-engagement"]
},

{
  id: 24,
  title: "Youth Data Explorer",
  type: "interactive",
  description: "A website that allows users to explore various datasets from the Canada Elections Study related to youth political engagement, mental health, and voting behavior through interactive visualizations and dashboards.",
  image: "thumbnails/youth-data-explorer.jpg",
  embed: "https://jackychen8173.github.io/glocalproject/#/",
  tags: ["statistics-canada", "data-visualization", "civic-tech"]
},

{
  id: 25,
  title: "Canadian Housing Data Hub",
  type: "data",
  description: "An interactive platform that consolidates and visualizes housing market data across Canada, providing insights into affordability, availability, and regional trends to inform policy-making and public understanding.",
  image: "thumbnails/housing.jpg",
  embed: "https://www.youtube.com/watch?v=kX_uR_e5pIU",
  tags: ["statistics-canada", "data-visualization", "housing-policy"]
},

{
  id: 26,
  title: "Canada's Housing Affordability Crisis: Analyzing Trends and Impacts",
  type: "data",
  description: "A comprehensive analysis of housing affordability trends in Canada, examining factors such as income levels, housing prices, and demographic shifts to understand the challenges faced by Canadians in accessing affordable housing.",
  image: "thumbnails/zoning.jpg",
  embed: "https://public.tableau.com/shared/FWQQPH29P?:display_count=y&:origin=viz_share_link&:embed=y",
  tags: ["statistics-canada", "data-analysis", "housing-policy"]
},

{
  id: 27,
  title: "Post-Covid E-Commerce Trends in Canada",
  type: "data",
  description: "How has e-commerce in Canada evolved since the onset of the Covid-19 pandemic? This project analyzes shifts in consumer behavior, market growth, and regional variations in online shopping across Canada.",
  image: "thumbnails/ecommerce.jpg",
  embed: "https://vlevner.github.io/Post-COVID-E-commerce-Trends/#home",
  tags: ["statistics-canada", "data-analysis"]
},

{
  id: 29,
  title: "Canadian Political Parties Database",
  type: "data",
  description:
    "Lillian Pianosi, Elias Titian, Joey Lee, Ethan Gallipeau, and Tim Guan compiled a national dataset of 358 Canadian political parties (340 active) over five weeks using Python/Pandas, addressing data quality challenges and identifying opportunities for automation and improved workflow design.",
  image: "thumbnails/parties.png",
  embed: "content/politicalparties.pdf",
  tags: ["open-data", "data-analysis", "governance"],
  component: CanadianParties,
},

{
  id: 28,
  title: "Debt Burden of Young Canadians: A Data-Driven Analysis",
  type: "data",
  description: "An in-depth analysis of the debt burden faced by young Canadians, exploring factors such as student loans, credit card debt, and housing costs, and their implications for financial stability and future economic prospects.",
  image: "thumbnails/debt.jpg",
  embed: "content/debt.pdf",
  tags: ["statistics-canada", "data-analysis", "youth-engagement"]
},

{
  id: 30,
  title: "Awesome GLOCAL: Open Source Scripts",
  type: "data",
  description:
    "A curated list of useful, accessible scripts built by members of the GLOCAL community. Focused on simplifying workflows, improving usability, and supporting users across different technical skill levels.",
  image: "thumbnails/github.png",
  tags: ["civic-tech", "open-data"],
},


{
  id: 31,
  title: "Understanding Refugees in Canada",
  type: "report",
  description:
    "An accessible overview of Canada's refugee system, tracing the journey from initial application and eligibility determination through to arrival, integration, and long-term settlement — with a focus on the policies and supports that shape each stage.",
  image: "thumbnails/20260430-170052.jpg",
  tags: ["democracy-research", "youth-engagement"],
},


{
  id: 32,
  title: "Ontario Housing Affordability Dashboard",
  type: "data",
  description:
    "An interactive dashboard visualizing rental affordability trends across Ontario cities, comparing rent and income data to surface regional cost pressures and housing accessibility gaps.",
  image: "",
  embed: "https://edwardhe10.github.io/housing-affordability-analysis-dashboard/",
  tags: ["data-analysis", "open-data", "housing-policy"],
},


{
  id: 33,
  title: "From Pipes to People: Addressing Lead in Drinking Water",
  type: "report",
  description:
    "A health-based action toolkit for stakeholders and the public on lead contamination in drinking water, covering risks, prevention strategies, and practical resources for families and decision-makers.",
  image: "thumbnails/ocean-water.jpg",
  tags: ["civic-education", "open-data"],
  component: FromPipesToPeopleAddressing,
},


{
  id: 34,
  title: "Mental Health and Disability",
  type: "report",
  description:
    "A research-driven project translating mental health and disability policy insights into accessible public tools — including infographics, interactive quizzes, and a resource website — to bridge the gap between academic findings and everyday understanding.",
  image: "thumbnails/mental-health.jpg",
  embed: "content/Placement Presentation.pdf",
  tags: ["open-data", "youth-engagement"],
  component: MentalHealthAndDisability,
},


{
  id: 35,
  title: "Immigration Laws & Tips",
  type: "report",
  description:
    "An International Law 3201 project that identified gaps in how international students access legal protections in Canada, addressing them through simplified, actionable resources covering immigration, labour, safety, and human rights.",
  image: "thumbnails/poznan-poland-february-26-2025-600nw-2597914809.webp",
  embed: "content/immigration laws.pdf",
  tags: ["civic-education", "open-data", "democracy-research"],
  component: ImmigrationLawsTips,
},


{
  id: 36,
  title: "From Pandemic to Paycheque: How COVID-19 Changed Canadian Gen Z's First Job Age, Financial Literacy and Investment Habits",
  type: "report",
  description:
    "COVID-19 reduced youth employment and delayed early work experience for Gen Z, while economic pressures and increased digital engagement shaped their financial behaviour and learning.",
  image: "thumbnails/making-a-budget-tracking-finances.jpg",
  embed: "content/GLOCAL Final Report.pdf",
  tags: ["civic-education", "data-analysis", "open-data"],
},


{
  id: 37,
  title: "Youcount Mobile App: Redesigning Access to Opportunity",
  type: "interactive",
  description:
    "A project by Sooa Lee, Jaden Seaforth, and Areeb Mohsin that identified usability issues in the YouCount platform and developed a mobile solution with simplified navigation, clearer terminology, and centralized user features.",
  image: "thumbnails/Screenshot 2026-05-01 141747.png",
  embed: "content/YouCount Mobile Design Project Group Presentation.pdf",
  tags: ["civic-tech", "open-data", "youth-engagement"],
  component: YoucountMobileAppRedesigningAccess,
},

];


export default projects;
