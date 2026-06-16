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
 * Generate URL for a Clipboard activity
 * @param activityId - The activity ID
 * @returns The full URL to the activity
 */
export const getActivityUrl = (activityId: string | number): string => {
  return `${BASE_URL}/activity/${activityId}`;
};

/**
 * Generate URL for a Clipboard department
 * @param departmentId - The department ID
 * @returns The full URL to the department
 */
export const getDepartmentUrl = (departmentId: string | number): string => {
  return `${BASE_URL}/departments/${departmentId}`;
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
  return `${BASE_URL}/teams/${teamId}`;
};

/**
 * Generate URL for a Clipboard student
 * @param studentId - The student ID (SMS ID)
 * @returns The full URL to the student
 */
export const getStudentUrl = (studentId: string | number): string => {
  return `${BASE_URL}/students/${studentId}`;
};

/**
 * Generate URL for Clipboard attendance records
 * @param sessionId - Optional session ID to filter attendance by session
 * @returns The full URL to attendance records
 */
export const getAttendanceUrl = (sessionId?: string | number): string => {
  if (sessionId) {
    return `${BASE_URL}/attendance/session/${sessionId}`;
  }
  return `${BASE_URL}/attendance`;
};

const ClipboardUrlBuilder = {
  getIncidentUrl,
  getSessionUrl,
  getActivityUrl,
  getDepartmentUrl,
  getDepartmentDetailsUrl,
  getTeamUrl,
  getStudentUrl,
  getAttendanceUrl,
};

export default ClipboardUrlBuilder;
