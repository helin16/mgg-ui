import AppService from '../../../services/AppService';
import ClipboardActivityService from '../../../services/Clipboard/ClipboardActivityService';

jest.mock('../../../services/AppService');

describe('ClipboardActivityService', () => {
  const mockAppService = AppService as jest.Mocked<typeof AppService>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getAll with pagination params', async () => {
    mockAppService.get.mockResolvedValue({ data: { data: [] } });

    await ClipboardActivityService.getAll({ pageLength: 25, page: 2 });

    expect(mockAppService.get).toHaveBeenCalledWith(
      '/clipboard/activity',
      {
        pageLength: 25,
        page: 2,
      },
      undefined
    );
  });

  it('does not include extra props in final query string', async () => {
    mockAppService.get.mockResolvedValue({ data: { data: [] } });

    await ClipboardActivityService.getAll({ pageLength: 25 });

    expect(mockAppService.get).toHaveBeenCalledWith(
      '/clipboard/activity',
      expect.not.objectContaining({ perPage: expect.any(Number) }),
      undefined
    );
  });

  it('calls get with correct endpoint and query params', async () => {
    mockAppService.get.mockResolvedValue({ data: { id: 10, name: 'Orchestra' } });

    await ClipboardActivityService.get(10, { pageLength: 10, page: 1 });

    expect(mockAppService.get).toHaveBeenCalledWith(
      '/clipboard/activity/10',
      {
        pageLength: 10,
        page: 1,
      },
      undefined
    );
  });

  describe('getAllRecords', () => {
    it('fetches all activities across multiple pages', async () => {
      const page1Response = {
        data: {
          data: [
            { id: 1, name: 'Basketball', code: 'BASK' },
            { id: 2, name: 'Tennis', code: 'TENN' },
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
          data: [{ id: 3, name: 'Soccer', code: 'SOCC' }],
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

      const result = await ClipboardActivityService.getAllRecords();

      expect(result).toEqual([
        { id: 1, name: 'Basketball', code: 'BASK' },
        { id: 2, name: 'Tennis', code: 'TENN' },
        { id: 3, name: 'Soccer', code: 'SOCC' },
      ]);

      expect(mockAppService.get).toHaveBeenCalledTimes(2);
    });

    it('returns all activities when data fits on one page', async () => {
      const singlePageResponse = {
        data: {
          data: [
            { id: 1, name: 'Basketball', code: 'BASK' },
            { id: 2, name: 'Tennis', code: 'TENN' },
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

      const result = await ClipboardActivityService.getAllRecords();

      expect(result).toEqual([
        { id: 1, name: 'Basketball', code: 'BASK' },
        { id: 2, name: 'Tennis', code: 'TENN' },
      ]);

      expect(mockAppService.get).toHaveBeenCalledTimes(1);
    });

    it('returns empty array when no activities exist', async () => {
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

      const result = await ClipboardActivityService.getAllRecords();

      expect(result).toEqual([]);
    });
  });
});
