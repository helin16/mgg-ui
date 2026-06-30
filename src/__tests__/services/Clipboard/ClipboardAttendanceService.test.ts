import AppService from '../../../services/AppService';
import ClipboardAttendanceService from '../../../services/Clipboard/ClipboardAttendanceService';

jest.mock('../../../services/AppService');

describe('ClipboardAttendanceService', () => {
  const mockAppService = AppService as jest.Mocked<typeof AppService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('calls API with correct endpoint and default parameters', async () => {
      mockAppService.get.mockResolvedValue({
        data: {
          data: [],
          pagination: { numRecords: 0, lastPage: 1, currentPage: 1, pageLength: 200 },
        },
      });

      await ClipboardAttendanceService.getAll();

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/attendance',
        {},
        undefined
      );
    });

    it('passes query parameters to API', async () => {
      mockAppService.get.mockResolvedValue({
        data: {
          data: [],
          pagination: { numRecords: 0, lastPage: 1, currentPage: 1, pageLength: 200 },
        },
      });

      const params = {
        studentSisIds: ['SMS001', 'SMS002'],
        absent: false,
        pageLength: 50,
        page: 1,
      };

      await ClipboardAttendanceService.getAll(params);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/attendance',
        {
          ...params,
          studentSisIds: JSON.stringify(params.studentSisIds),
        },
        undefined
      );
    });

    it('returns transformed response with pagination metadata', async () => {
      const mockAttendance = {
        id: 'ATT001',
        student: { id: 54610, smsId: 'SMS001', firstName: 'John' },
        session: { id: 'SESSION001', title: 'Basketball' },
        attended: true,
        absent: false,
      };

      mockAppService.get.mockResolvedValue({
        data: {
          data: [mockAttendance],
          pagination: {
            numRecords: 100,
            lastPage: 2,
            currentPage: 1,
            pageLength: 50,
          },
        },
      });

      const result = await ClipboardAttendanceService.getAll({ pageLength: 50, page: 1 });

      expect(result).toEqual({
        data: [mockAttendance],
        pagination: {
          numRecords: 100,
          lastPage: 2,
          currentPage: 1,
          pageLength: 50,
        },
      });
    });
  });

  describe('get', () => {
    it('calls API with correct endpoint and ID', async () => {
      mockAppService.get.mockResolvedValue({ data: { id: 'ATT001', attended: true } });

      await ClipboardAttendanceService.get('ATT001');

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/attendance/ATT001',
        {},
        undefined
      );
    });

    it('passes optional parameters', async () => {
      mockAppService.get.mockResolvedValue({ data: { id: 'ATT001' } });

      const params = { includeSession: true, includeStudent: true };

      await ClipboardAttendanceService.get('ATT001', params);

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/attendance/ATT001',
        params,
        undefined
      );
    });
  });

  describe('getAllRecords', () => {
    it('fetches all attendance records across multiple pages', async () => {
      const page1Response = {
        data: {
          data: [
            { id: 'ATT001', student: { smsId: 'SMS001' }, attended: true },
            { id: 'ATT002', student: { smsId: 'SMS002' }, attended: true },
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
          data: [{ id: 'ATT003', student: { smsId: 'SMS003' }, attended: false }],
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

      const result = await ClipboardAttendanceService.getAllRecords();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('ATT001');
      expect(result[2].id).toBe('ATT003');
      expect(mockAppService.get).toHaveBeenCalledTimes(2);
    });

    it('returns all records when data fits on one page', async () => {
      const singlePageResponse = {
        data: {
          data: [
            { id: 'ATT001', attended: true },
            { id: 'ATT002', attended: true },
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

      const result = await ClipboardAttendanceService.getAllRecords();

      expect(result).toHaveLength(2);
      expect(mockAppService.get).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no records exist', async () => {
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

      const result = await ClipboardAttendanceService.getAllRecords();

      expect(result).toEqual([]);
    });

    it('passes optional parameters to getAllRecords', async () => {
      const singlePageResponse = {
        data: {
          data: [{ id: 'ATT001', attended: false }],
          pagination: {
            numRecords: 1,
            lastPage: 1,
            currentPage: 1,
            pageLength: 200,
          },
        },
      };

      mockAppService.get.mockResolvedValueOnce(singlePageResponse);

      await ClipboardAttendanceService.getAllRecords({ absent: true });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/attendance',
        expect.objectContaining({
          absent: true,
          pageLength: 200,
          page: 1,
        }),
        undefined
      );
    });
  });
});
