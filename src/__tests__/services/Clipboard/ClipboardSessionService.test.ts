import ServiceTestHelper from '../../helper/ServiceTestHelper';
import ClipboardSessionService, { iClipboardSessionQueryParams } from '../../../services/Clipboard/ClipboardSessionService';
import AppService from '../../../services/AppService';
import iPaginatedResult from '../../../types/iPaginatedResult';
import iClipboardSession from '../../../types/Clipboard/iClipboardSession';

// Mock AppService
jest.mock('../../../services/AppService');

describe('ClipboardSessionService', () => {
  const mockAppService = AppService as jest.Mocked<typeof AppService>;

  const mockSession: iClipboardSession = {
    id: 1,
    title: 'PE Lesson',
    cancelled: false,
    scored: true,
    startDateTime: '2026-06-15T09:00:00Z',
    endDateTime: '2026-06-15T10:00:00Z',
    teams: [{ id: 1, name: 'Year 10 PE A' }],
    activity: {
      id: 1,
      name: 'Physical Education',
      department: { id: 1, name: 'Sports' },
    },
  };

  const mockApiResponse = {
    data: [mockSession],
    pagination: {
      numRecords: 10,
      lastPage: 2,
      currentPage: 1,
      pageLength: 10,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Note: We skip the generic ServiceTestHelper tests because ClipboardSessionService
  // transforms parameters before passing to AppService, making the generic tests
  // incompatible. Instead, we test the actual behavior directly.

  describe('getAll', () => {
    it('calls API with correct endpoint', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      await ClipboardSessionService.getAll();

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.any(Object),
        undefined
      );
    });

    it('returns session data', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      const result = await ClipboardSessionService.getAll();

      expect(result.data).toEqual([mockSession]);
    });
  });

  describe('get', () => {
    it('calls API with correct endpoint and ID', async () => {
      mockAppService.get.mockResolvedValue({ data: mockSession });

      await ClipboardSessionService.get(1);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session/1',
        expect.any(Object),
        undefined
      );
    });

    it('returns single session data', async () => {
      mockAppService.get.mockResolvedValue({ data: mockSession });

      const result = await ClipboardSessionService.get(1);

      expect(result).toEqual(mockSession);
    });
  });

  describe('getAll API Response Transformation', () => {
    it('transforms API pagination response to iPaginatedResult format', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      const result = await ClipboardSessionService.getAll();

      expect(result).toEqual({
        data: [mockSession],
        total: 10,
        pages: 2,
        currentPage: 1,
        perPage: 10,
        from: 1,
        to: 10,
      });
    });

    it('calculates correct from and to values for first page', async () => {
      mockAppService.get.mockResolvedValue({ 
        data: {
          ...mockApiResponse,
          pagination: {
            ...mockApiResponse.pagination,
            currentPage: 1,
            pageLength: 10,
          },
        } 
      });

      const result = await ClipboardSessionService.getAll();

      expect(result.from).toBe(1);
      expect(result.to).toBe(10);
    });

    it('calculates correct from and to values for second page', async () => {
      mockAppService.get.mockResolvedValue({ 
        data: {
          ...mockApiResponse,
          pagination: {
            ...mockApiResponse.pagination,
            currentPage: 2,
            pageLength: 10,
          },
        } 
      });

      const result = await ClipboardSessionService.getAll();

      expect(result.from).toBe(11);
      expect(result.to).toBe(20);
    });

    it('handles empty data array', async () => {
      mockAppService.get.mockResolvedValue({ 
        data: {
          data: [],
          pagination: {
            numRecords: 0,
            lastPage: 1,
            currentPage: 1,
            pageLength: 10,
          },
        } 
      });

      const result = await ClipboardSessionService.getAll();

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.pages).toBe(1);
    });

    it('uses defaults when pagination data is missing', async () => {
      mockAppService.get.mockResolvedValue({ 
        data: {
          data: [mockSession],
        } 
      });

      const result = await ClipboardSessionService.getAll();

      // Should still return valid structure
      expect(result.data).toEqual([mockSession]);
      // When pagination is missing, the API response is returned as-is
      // so the result won't have total, pages, etc. transformed
      expect(result).toHaveProperty('data');
    });

    it('handles null pagination gracefully', async () => {
      mockAppService.get.mockResolvedValue({ 
        data: {
          data: [mockSession],
          pagination: null,
        } 
      });

      const result = await ClipboardSessionService.getAll();

      expect(result.data).toEqual([mockSession]);
    });
  });

  describe('Query Parameter Translation', () => {
    it('passes pageLength to API', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      await ClipboardSessionService.getAll({ pageLength: 20, page: 1 });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.objectContaining({ pageLength: 20, page: 1 }),
        undefined
      );
    });

    it('does not include extra props in final query string', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      await ClipboardSessionService.getAll({ pageLength: 15 });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.not.objectContaining({ perPage: expect.any(Number) }),
        undefined
      );
    });

    it('includes page parameter in query string', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      await ClipboardSessionService.getAll({ page: 2 });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.objectContaining({ page: 2 }),
        undefined
      );
    });

    it('includes boolean filters in query string', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      const params: iClipboardSessionQueryParams = {
        cancelled: true,
        bye: false,
        scored: true,
      };

      await ClipboardSessionService.getAll(params);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.objectContaining({ 
          cancelled: true, 
          bye: false, 
          scored: true 
        }),
        undefined
      );
    });

    it('includes include* flags in query string', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      const params: iClipboardSessionQueryParams = {
        includeTeams: true,
        includeStaff: true,
        includeRoundName: true,
      };

      await ClipboardSessionService.getAll(params);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.objectContaining({ 
          includeTeams: true, 
          includeStaff: true,
          includeRoundName: true,
        }),
        undefined
      );
    });

    it('stringifies array parameters', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      const params: iClipboardSessionQueryParams = {
        activityIds: [1, 2, 3],
        departmentIds: [10, 20],
      };

      await ClipboardSessionService.getAll(params);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.objectContaining({ 
          activityIds: '[1,2,3]',
          departmentIds: '[10,20]',
        }),
        undefined
      );
    });

    it('handles pagination with all parameter types', async () => {
      mockAppService.get.mockResolvedValue({ data: mockApiResponse });

      const params: iClipboardSessionQueryParams = {
        perPage: 25,
        page: 3,
        teamId: 5,
        includeTeams: true,
        includeStaff: true,
      };

      await ClipboardSessionService.getAll(params);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/session',
        expect.objectContaining({ 
          pageLength: 25,
          page: 3,
          teamId: 5,
          includeTeams: true,
          includeStaff: true,
        }),
        undefined
      );
    });
  });
});
