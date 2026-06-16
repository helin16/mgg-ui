import AppService from '../../../services/AppService';
import ClipboardTeamService, { iClipboardTeamQueryParams } from '../../../services/Clipboard/ClipboardTeamService';

jest.mock('../../../services/AppService');

describe('ClipboardTeamService', () => {
  const mockAppService = AppService as jest.Mocked<typeof AppService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('calls API with correct endpoint', async () => {
      mockAppService.get.mockResolvedValue({ data: { data: [] } });

      await ClipboardTeamService.getAll();

      expect(mockAppService.get).toHaveBeenCalledWith('/clipboard/team', {}, undefined);
    });

    it('translates team query params for API', async () => {
      mockAppService.get.mockResolvedValue({ data: { data: [] } });

      const params: iClipboardTeamQueryParams = {
        includeStudents: true,
        includeMembers: true,
        includeStudentDetails: false,
        includeLeaveDates: true,
        pageLength: 100,
        page: 2,
      };

      await ClipboardTeamService.getAll(params);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/team',
        {
          includeStudents: true,
          includeMembers: true,
          includeStudentDetails: false,
          includeLeaveDates: true,
          pageLength: 100,
          page: 2,
        },
        undefined
      );
    });

    it('does not include extra props in final query string', async () => {
      mockAppService.get.mockResolvedValue({ data: { data: [] } });

      await ClipboardTeamService.getAll({ pageLength: 50 });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/team',
        expect.not.objectContaining({ perPage: expect.any(Number) }),
        undefined
      );
    });
  });

  describe('get', () => {
    it('calls API with correct endpoint and ID', async () => {
      mockAppService.get.mockResolvedValue({ data: { id: 1, name: 'Team A' } });

      await ClipboardTeamService.get(1);

      expect(mockAppService.get).toHaveBeenCalledWith('/clipboard/team/1', {}, undefined);
    });

    it('passes translated query params to singular endpoint', async () => {
      mockAppService.get.mockResolvedValue({ data: { id: 1, name: 'Team A' } });

      await ClipboardTeamService.get(1, { includeStudents: true, pageLength: 25, page: 3 });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/team/1',
        {
          includeStudents: true,
          pageLength: 25,
          page: 3,
        },
        undefined
      );
    });
  });

  describe('getAllRecords', () => {
    it('fetches all teams across multiple pages', async () => {
      const page1Response = {
        data: {
          data: [
            { id: 1, name: 'Year 10 PE A', classCode: 'Y10PEA' },
            { id: 2, name: 'Year 10 PE B', classCode: 'Y10PEB' },
          ],
          pagination: {
            numRecords: 3,
            lastPage: 2,
            currentPage: 1,
            pageLength: 200,
          },
        },
      };

      const page2Response = {
        data: {
          data: [{ id: 3, name: 'Year 11 PE A', classCode: 'Y11PEA' }],
          pagination: {
            numRecords: 3,
            lastPage: 2,
            currentPage: 2,
            pageLength: 200,
          },
        },
      };

      mockAppService.get
        .mockResolvedValueOnce(page1Response)
        .mockResolvedValueOnce(page2Response);

      const result = await ClipboardTeamService.getAllRecords();

      expect(result).toEqual([
        { id: 1, name: 'Year 10 PE A', classCode: 'Y10PEA' },
        { id: 2, name: 'Year 10 PE B', classCode: 'Y10PEB' },
        { id: 3, name: 'Year 11 PE A', classCode: 'Y11PEA' },
      ]);

      expect(mockAppService.get).toHaveBeenCalledTimes(2);
    });

    it('returns all teams when data fits on one page', async () => {
      const singlePageResponse = {
        data: {
          data: [
            { id: 1, name: 'Year 10 PE A', classCode: 'Y10PEA' },
            { id: 2, name: 'Year 10 PE B', classCode: 'Y10PEB' },
          ],
          pagination: {
            numRecords: 2,
            lastPage: 1,
            currentPage: 1,
            pageLength: 200,
          },
        },
      };

      mockAppService.get.mockResolvedValueOnce(singlePageResponse);

      const result = await ClipboardTeamService.getAllRecords();

      expect(result).toEqual([
        { id: 1, name: 'Year 10 PE A', classCode: 'Y10PEA' },
        { id: 2, name: 'Year 10 PE B', classCode: 'Y10PEB' },
      ]);

      expect(mockAppService.get).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no teams exist', async () => {
      const emptyResponse = {
        data: {
          data: [],
          pagination: {
            numRecords: 0,
            lastPage: 1,
            currentPage: 1,
            pageLength: 200,
          },
        },
      };

      mockAppService.get.mockResolvedValueOnce(emptyResponse);

      const result = await ClipboardTeamService.getAllRecords();

      expect(result).toEqual([]);
    });

    it('passes optional params to getAll', async () => {
      const singlePageResponse = {
        data: {
          data: [{ id: 1, name: 'Team A', classCode: 'A1' }],
          pagination: {
            numRecords: 1,
            lastPage: 1,
            currentPage: 1,
            pageLength: 200,
          },
        },
      };

      mockAppService.get.mockResolvedValueOnce(singlePageResponse);

      await ClipboardTeamService.getAllRecords({ includeStudents: true });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/team',
        expect.objectContaining({
          includeStudents: true,
          pageLength: 200,
          page: 1,
        }),
        undefined
      );
    });
  });
});
