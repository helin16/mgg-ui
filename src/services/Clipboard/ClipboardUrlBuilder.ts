/**
 * ClipboardUrlBuilder
 * 
 * Provides helper functions to generate URLs for Clipboard app resources.
 * All URLs use the base domain: https://go.clipboard.app
 */

const BASE_URL = 'https://go.clipboard.app';

/**
 * Generate URL for a Clipboard incident
 * @param incidentId - The incident ID
 * @returns The full URL to the incident
 */
export const getIncidentUrl = (incidentId: string | number): string => {
  return `${BASE_URL}/incidents/${incidentId}`;
};

/**
 * Generate URL for a Clipboard session
 * @param sessionId - The session ID
 * @returns The full URL to the session schedule
 */
export const getSessionUrl = (sessionId: string | number): string => {
  return `${BASE_URL}/schedule/session/${sessionId}`;
};

/**
 * Generate URL for Clipboard activity details/settings page
 * @param activityId - The activity ID
 * @returns The full URL to the activity details settings page
 */
export const getActivityDetailsUrl = (activityId: string | number): string => {
  return `${BASE_URL}/settings/environment/activities/${activityId}/basic-details`;
};

/**
 * Generate URL for Clipboard department details/settings page
 * @param departmentId - The department ID
 * @returns The full URL to the department details settings page
 */
export const getDepartmentDetailsUrl = (departmentId: string | number): string => {
  return `${BASE_URL}/settings/environment/departments/${departmentId}/basic-details`;
};

/**
 * Generate URL for a Clipboard team
 * @param teamId - The team ID
 * @returns The full URL to the team
 */
export const getTeamUrl = (teamId: string | number): string => {
  return `${BASE_URL}/teams/team/${teamId}`;
};

const ClipboardUrlBuilder = {
  getIncidentUrl,
  getSessionUrl,
  getActivityDetailsUrl,
  getDepartmentDetailsUrl,
  getTeamUrl,
};

export default ClipboardUrlBuilder;
