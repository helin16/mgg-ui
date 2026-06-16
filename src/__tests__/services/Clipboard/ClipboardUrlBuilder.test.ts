import ClipboardUrlBuilder, {
  getIncidentUrl,
  getSessionUrl,
  getActivityUrl,
  getDepartmentUrl,
  getDepartmentDetailsUrl,
  getTeamUrl,
  getStudentUrl,
  getAttendanceUrl,
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

  describe('getActivityUrl', () => {
    it('generates correct URL for activity with numeric ID', () => {
      const url = getActivityUrl(100);
      expect(url).toBe(`${baseUrl}/activity/100`);
    });

    it('generates correct URL for activity with string ID', () => {
      const url = getActivityUrl('MATH-101');
      expect(url).toBe(`${baseUrl}/activity/MATH-101`);
    });
  });

  describe('getDepartmentUrl', () => {
    it('generates correct URL for department with numeric ID', () => {
      const url = getDepartmentUrl(3033);
      expect(url).toBe(`${baseUrl}/departments/3033`);
    });

    it('generates correct URL for department with string ID', () => {
      const url = getDepartmentUrl('DEPT-001');
      expect(url).toBe(`${baseUrl}/departments/DEPT-001`);
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
      expect(url).toBe(`${baseUrl}/teams/42`);
    });

    it('generates correct URL for team with string ID', () => {
      const url = getTeamUrl('TEAM-A1');
      expect(url).toBe(`${baseUrl}/teams/TEAM-A1`);
    });
  });

  describe('getStudentUrl', () => {
    it('generates correct URL for student with numeric SMS ID', () => {
      const url = getStudentUrl(1001);
      expect(url).toBe(`${baseUrl}/students/1001`);
    });

    it('generates correct URL for student with string SMS ID', () => {
      const url = getStudentUrl('SMS-12345');
      expect(url).toBe(`${baseUrl}/students/SMS-12345`);
    });
  });

  describe('getAttendanceUrl', () => {
    it('generates base attendance URL when no session ID provided', () => {
      const url = getAttendanceUrl();
      expect(url).toBe(`${baseUrl}/attendance`);
    });

    it('generates attendance URL without argument', () => {
      const url = getAttendanceUrl(undefined);
      expect(url).toBe(`${baseUrl}/attendance`);
    });

    it('generates session-specific attendance URL with numeric session ID', () => {
      const url = getAttendanceUrl(98765);
      expect(url).toBe(`${baseUrl}/attendance/session/98765`);
    });

    it('generates session-specific attendance URL with string session ID', () => {
      const url = getAttendanceUrl('SESSION-001');
      expect(url).toBe(`${baseUrl}/attendance/session/SESSION-001`);
    });
  });

  describe('default export', () => {
    it('exports all functions in default object', () => {
      expect(ClipboardUrlBuilder).toHaveProperty('getIncidentUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getSessionUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getActivityUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getDepartmentUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getDepartmentDetailsUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getTeamUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getStudentUrl');
      expect(ClipboardUrlBuilder).toHaveProperty('getAttendanceUrl');
    });

    it('exported functions return correct URLs', () => {
      expect(ClipboardUrlBuilder.getIncidentUrl(123)).toBe(
        `${baseUrl}/incidents/123`
      );
      expect(ClipboardUrlBuilder.getSessionUrl(456)).toBe(
        `${baseUrl}/schedule/session/456`
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
      expect(getActivityUrl(1)).toMatch(/^https:\/\//);
      expect(getDepartmentUrl(1)).toMatch(/^https:\/\//);
      expect(getDepartmentDetailsUrl(1)).toMatch(/^https:\/\//);
      expect(getTeamUrl(1)).toMatch(/^https:\/\//);
      expect(getStudentUrl(1)).toMatch(/^https:\/\//);
      expect(getAttendanceUrl(1)).toMatch(/^https:\/\//);
    });

    it('all URLs use go.clipboard.app domain', () => {
      expect(getIncidentUrl(1)).toContain('go.clipboard.app');
      expect(getSessionUrl(1)).toContain('go.clipboard.app');
      expect(getActivityUrl(1)).toContain('go.clipboard.app');
      expect(getDepartmentUrl(1)).toContain('go.clipboard.app');
      expect(getDepartmentDetailsUrl(1)).toContain('go.clipboard.app');
      expect(getTeamUrl(1)).toContain('go.clipboard.app');
      expect(getStudentUrl(1)).toContain('go.clipboard.app');
      expect(getAttendanceUrl(1)).toContain('go.clipboard.app');
    });

    it('all URLs start with base URL', () => {
      expect(getIncidentUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getSessionUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getActivityUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getDepartmentUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getDepartmentDetailsUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getTeamUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getStudentUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
      expect(getAttendanceUrl(1)).toMatch(new RegExp(`^${baseUrl}`));
    });
  });

  describe('edge cases', () => {
    it('handles zero IDs', () => {
      expect(getIncidentUrl(0)).toBe(`${baseUrl}/incidents/0`);
      expect(getDepartmentUrl(0)).toBe(`${baseUrl}/departments/0`);
    });

    it('handles special characters in string IDs', () => {
      expect(getIncidentUrl('ID-123-ABC')).toBe(
        `${baseUrl}/incidents/ID-123-ABC`
      );
      expect(getSessionUrl('SESSION_001_V2')).toBe(
        `${baseUrl}/schedule/session/SESSION_001_V2`
      );
    });

    it('handles large numeric IDs', () => {
      const largeId = 999999999999;
      expect(getIncidentUrl(largeId)).toBe(
        `${baseUrl}/incidents/${largeId}`
      );
      expect(getDepartmentUrl(largeId)).toBe(
        `${baseUrl}/departments/${largeId}`
      );
    });
  });
});
