// In-app "API" for querying project data. No server involved — this binds
// the shared query logic in ./query.js to the app's live project list.
import projectsData from "../data/projects";
import { createProjectsApi, parseFilterParams, PROVINCES } from "./query";

const api = createProjectsApi(projectsData);

export const queryProjects = api.queryProjects;
export const getProject = api.getProject;
export const getFilterOptions = api.getFilterOptions;
export const getProjectStats = api.getProjectStats;
export { parseFilterParams, PROVINCES };
