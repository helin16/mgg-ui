import AppService from '../../../services/AppService';
import ClipboardDepartmentService from '../../../services/Clipboard/ClipboardDepartmentService';

jest.mock('../../../services/AppService');

describe('ClipboardDepartmentService', () => {
  const mockAppService = AppService as jest.Mocked<typeof AppService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getAll with pagination params', async () => {
    mockAppService.get.mockResolvedValue({ data: { data: [] } });

    await ClipboardDepartmentService.getAll({ pageLength: 25, page: 2 });

    expect(mockAppService.get).toHaveBeenCalledWith(
      '/clipboard/department',
      {
        pageLength: 25,
        page: 2,
      },
      undefined
    );
  });

  it('does not include extra props in final query string', async () => {
    mockAppService.get.mockResolvedValue({ data: { data: [] } });

    await ClipboardDepartmentService.getAll({ pageLength: 25 });

    expect(mockAppService.get).toHaveBeenCalledWith(
      '/clipboard/department',
      expect.not.objectContaining({ perPage: expect.any(Number) }),
      undefined
    );
  });

  it('calls get with correct endpoint and query params', async () => {
    mockAppService.get.mockResolvedValue({ data: { id: 10, name: 'Music' } });

    await ClipboardDepartmentService.get(10, { pageLength: 10, page: 1 });

    expect(mockAppService.get).toHaveBeenCalledWith(
      '/clipboard/department/10',
      {
        pageLength: 10,
        page: 1,
      },
      undefined
    );
  });

  describe('getAllRecords', () => {
    it('fetches all departments across multiple pages', async () => {
      const page1Response = {
        data: {
          data: [
            { id: 1, name: 'Mathematics' },
            { id: 2, name: 'Science' },
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
          data: [{ id: 3, name: 'English' }],
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

      const result = await ClipboardDepartmentService.getAllRecords();

      expect(result).toEqual([
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Science' },
        { id: 3, name: 'English' },
      ]);

      expect(mockAppService.get).toHaveBeenCalledTimes(2);
      expect(mockAppService.get).toHaveBeenNthCalledWith(
        1,
        '/clipboard/department',
        { pageLength: 200, page: 1 },
        undefined
      );
      expect(mockAppService.get).toHaveBeenNthCalledWith(
        2,
        '/clipboard/department',
        { pageLength: 200, page: 2 },
        undefined
      );
    });

    it('returns all departments when data fits on one page', async () => {
      const singlePageResponse = {
        data: {
          data: [
            { id: 1, name: 'Mathematics' },
            { id: 2, name: 'Science' },
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

      const result = await ClipboardDepartmentService.getAllRecords();

      expect(result).toEqual([
        { id: 1, name: 'Mathematics' },
        { id: 2, name: 'Science' },
      ]);

      expect(mockAppService.get).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no departments exist', async () => {
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

      const result = await ClipboardDepartmentService.getAllRecords();

      expect(result).toEqual([]);
    });
  });
});
