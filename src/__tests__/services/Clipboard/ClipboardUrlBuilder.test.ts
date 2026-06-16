import ClipboardUrlBuilder, {
  getIncidentUrl,
  getSessionUrl,
  getActivityDetailsUrl,
  getDepartmentDetailsUrl,
  getTeamUrl,
} from '../../../services/Clipboard/ClipboardUrlBuilder';

describe('ClipboardUrlBuilder', () => {
  const baseUrl = 'https://go.clipboard.app';

  describe('getIncidentUrl', () => {
    it('generates correct URL for incident with numeric ID', () => {
      const url = getIncidentUrl(12345);
      expect(url).toBe(`${baseUrl}/incidents/12345`);
    });

    it('generates correct URL for incident with string ID', () => {
      const url = getIncidentUrl('ABC123');
      expect(url).toBe(`${baseUrl}/incidents/ABC123`);
    });
  });

  describe('getSessionUrl', () => {
    it('generates correct URL for session with numeric ID', () => {
      const url = getSessionUrl(54321);
      expect(url).toBe(`${baseUrl}/schedule/session/54321`);
    });

    it('generates correct URL for session with string ID', () => {
      const url = getSessionUrl('SESSION-001');
      expect(url).toBe(`${baseUrl}/schedule/session/SESSION-001`);
    });
  });

  describe('getActivityDetailsUrl', () => {
    it('generates correct details URL for activity with numeric ID', () => {
      const url = getActivityDetailsUrl(30861);
      expect(url).toBe(
        `${baseUrl}/settings/environment/activities/30861/basic-details`
      );
    });

    it('generates correct details URL for activity with string ID', () => {
      const url = getActivityDetailsUrl('ACT-001');
      expect(url).toBe(
        `${baseUrl}/settings/environment/activities/ACT-001/basic-details`
      );
    });

    it('includes full path to basic-details settings page', () => {
      const url = getActivityDetailsUrl(1);
      expect(url).toContain('/settings/environment/activities/');
      expect(url).toContain('/basic-details');
    });
  });

  describe('getDepartmentDetailsUrl', () => {
    it('generates correct details URL for department with numeric ID', () => {
      const url = getDepartmentDetailsUrl(3033);
      expect(url).toBe(
        `${baseUrl}/settings/environment/departments/3033/basic-details`
      );
    });

    it('generates correct details URL for department with string ID', () => {
      const url = getDepartmentDetailsUrl('DEPT-001');
      expect(url).toBe(
        `${baseUrl}/settings/environment/departments/DEPT-001/basic-details`
      );
    });

    it('includes full path to basic-details settings page', () => {
      const url = getDepartmentDetailsUrl(1);
      expect(url).toContain('/settings/environment/departments/');
      expect(url).toContain('/basic-details');
    });
  });

  describe('getTeamUrl', () => {
    it('generates correct URL for team with numeric ID', () => {
      const url = getTeamUrl(42);
      expect(url).toBe(`${baseUrl}/teams/team/42`);
    });

    it('generates correct URL for team with string ID', () => {
      const url = getTeamUrl('TEAM-A1');
      expect(url).toBe(`${baseUrl}/teams/team/TEAM-A1`);
    });
  });

  describe('default export', () => {
    it('exports all functions in default object', () => {
      expect(ClipboardUrlBuilder).toHaveProperty('getIncidentUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getSessionUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getActivityDetailsUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getDepartmentDetailsUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getTeamUrl');
    });

    it('exported functions return correct URLs', () => {
      expect(ClipboardUrlBuilder.getIncidentUrl(123)).toBe(
        `${baseUrl}/incidents/123`
      );
      expect(ClipboardUrlBuilder.getSessionUrl(456)).toBe(
        `${baseUrl}/schedule/session/456`
      );
      expect(ClipboardUrlBuilder.getActivityDetailsUrl(789)).toBe(
        `${baseUrl}/settings/environment/activities/789/basic-details`
      );
      expect(ClipboardUrlBuilder.getDepartmentDetailsUrl(789)).toBe(
        `${baseUrl}/settings/environment/departments/789/basic-details`
      );
    });
  });

  describe('URL format consistency', () => {
    it('all URLs use https protocol', () => {
      expect(getIncidentUrl(1)).toMatch(/^https:\/\//);
      expect(getSessionUrl(1)).toMatch(/^https:\/\//);
      expect(getActivityDetailsUrl(1)).toMatch(/^https:\/\//);;
      expect(getDepartmentDetailsUrl(1)).toMatch(/^https:\/\//);;
      expect(getTeamUrl(1)).toMatch(/^https:\/\//);;
    });

    it('all URLs use go.clipboard.app domain', () => {
      expect(getIncidentUrl(1)).toContain('go.clipboard.app');
      expect(getSessionUrl(1)).toContain('go.clipboard.app');
      expect(getActivityDetailsUrl(1)).toContain('go.clipboard.app');
      expect(getDepartmentDetailsUrl(1)).toContain('go.clipboard.app');
      expect(getTeamUrl(1)).toContain('go.clipboard.app');
    });

    it('all URLs start with base URL', () => {
      expect(getIncidentUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getSessionUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getActivityDetailsUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getDepartmentDetailsUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getTeamUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
    });
  });

  describe('edge cases', () => {
    it('handles zero IDs', () => {
      expect(getIncidentUrl(0)).toBe(`${baseUrl}/incidents/0`);
      expect(getActivityDetailsUrl(0)).toBe(`${baseUrl}/settings/environment/activities/0/basic-details`);
    });

    it('handles special characters in string IDs', () => {
      expect(getIncidentUrl('ID-123-ABC')).toBe(
        `${baseUrl}/incidents/ID-123-ABC`
      );
      expect(getSessionUrl('SESSION_001_V2')).toBe(
        `${baseUrl}/schedule/session/SESSION_001_V2`
      );
      expect(getActivityDetailsUrl('ACT-456-XYZ')).toBe(
        `${baseUrl}/settings/environment/activities/ACT-456-XYZ/basic-details`
      );
    });

    it('handles large numeric IDs', () => {
      const largeId = 999999999999;
      expect(getIncidentUrl(largeId)).toBe(
        `${baseUrl}/incidents/${largeId}`
      );
      expect(getActivityDetailsUrl(largeId)).toBe(
        `${baseUrl}/settings/environment/activities/${largeId}/basic-details`
      );
    });
  });
});
