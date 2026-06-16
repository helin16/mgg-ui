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

  describe('departmentIds client-side filtering', () => {
    it('filters activities by departmentIds (client-side)', async () => {
      const mockData = {
        data: [
          { id: 1, name: 'Activity 1', department: { id: 101, name: 'Dept 1' } },
          { id: 2, name: 'Activity 2', department: { id: 102, name: 'Dept 2' } },
          { id: 3, name: 'Activity 3', department: { id: 101, name: 'Dept 1' } },
        ],
        pagination: { currentPage: 1, pageLength: 200, numRecords: 3, lastPage: 1 },
      };

      mockAppService.get.mockResolvedValue({ data: mockData });

      const result = await ClipboardActivityService.getAll({
        pageLength: 200,
        page: 1,
        departmentIds: [101],
      });

      // Backend receives request WITHOUT departmentIds (since backend doesn't support it)
      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/activity',
        {
          pageLength: 200,
          page: 1,
        },
        undefined
      );

      // Result is filtered client-side to only department 101
      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe(1);
      expect(result.data[1].id).toBe(3);
    });

    it('omits departmentIds from API request (filtered client-side)', async () => {
      mockAppService.get.mockResolvedValue({ data: { data: [] } });

      await ClipboardActivityService.getAll({
        pageLength: 200,
        page: 1,
        departmentIds: [101, 102],
      });

      // departmentIds should NOT be sent to the API
      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/activity',
        expect.not.objectContaining({ departmentIds: expect.any(String) }),
        undefined
      );
    });

    it('handles multiple department IDs in client-side filter', async () => {
      const mockData = {
        data: [
          { id: 1, name: 'Activity 1', department: { id: 101, name: 'Dept 1' } },
          { id: 2, name: 'Activity 2', department: { id: 102, name: 'Dept 2' } },
          { id: 3, name: 'Activity 3', department: { id: 103, name: 'Dept 3' } },
          { id: 4, name: 'Activity 4', department: { id: 101, name: 'Dept 1' } },
        ],
      };

      mockAppService.get.mockResolvedValue({ data: mockData });

      const result = await ClipboardActivityService.getAll({
        departmentIds: [101, 103],
      });

      expect(result.data).toHaveLength(3); // Activities from departments 101 and 103
      expect(result.data.map((a) => a.id)).toEqual([1, 3, 4]);
    });

    it('returns all activities when departmentIds not specified', async () => {
      const mockData = {
        data: [
          { id: 1, name: 'Activity 1', department: { id: 101, name: 'Dept 1' } },
          { id: 2, name: 'Activity 2', department: { id: 102, name: 'Dept 2' } },
        ],
      };

      mockAppService.get.mockResolvedValue({ data: mockData });

      const result = await ClipboardActivityService.getAll();

      expect(result.data).toHaveLength(2);
    });
  });

  describe('archived filter parameter (client-side)', () => {
    it('filters activities by archived status', async () => {
      const mockData = {
        data: [
          { id: 1, name: 'Active Activity', archived: false },
          { id: 2, name: 'Archived Activity', archived: true },
          { id: 3, name: 'Another Active', archived: false },
        ],
      };

      mockAppService.get.mockResolvedValue({ data: mockData });

      const result = await ClipboardActivityService.getAll({
        archived: true,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(2);
    });

    it('filters to only non-archived activities', async () => {
      const mockData = {
        data: [
          { id: 1, name: 'Active Activity', archived: false },
          { id: 2, name: 'Archived Activity', archived: true },
          { id: 3, name: 'Another Active', archived: false },
        ],
      };

      mockAppService.get.mockResolvedValue({ data: mockData });

      const result = await ClipboardActivityService.getAll({
        archived: false,
      });

      expect(result.data).toHaveLength(2);
      expect(result.data.map((a) => a.id)).toEqual([1, 3]);
    });

    it('returns all activities when archived filter is null', async () => {
      const mockData = {
        data: [
          { id: 1, name: 'Active Activity', archived: false },
          { id: 2, name: 'Archived Activity', archived: true },
        ],
      };

      mockAppService.get.mockResolvedValue({ data: mockData });

      const result = await ClipboardActivityService.getAll({
        archived: null,
      });

      expect(result.data).toHaveLength(2);
    });
  });

  describe('combined filtering', () => {
    it('filters by both departmentIds and archived status', async () => {
      const mockData = {
        data: [
          { id: 1, name: 'Activity 1', archived: false, department: { id: 101 } },
          { id: 2, name: 'Activity 2', archived: true, department: { id: 101 } },
          { id: 3, name: 'Activity 3', archived: false, department: { id: 102 } },
          { id: 4, name: 'Activity 4', archived: false, department: { id: 101 } },
        ],
      };

      mockAppService.get.mockResolvedValue({ data: mockData });

      const result = await ClipboardActivityService.getAll({
        departmentIds: [101],
        archived: false,
      });

      // Should only get non-archived activities from department 101
      expect(result.data).toHaveLength(2);
      expect(result.data.map((a) => a.id)).toEqual([1, 4]);
    });
  });

  describe('search parameter', () => {
    it('sends search parameter to API', async () => {
      mockAppService.get.mockResolvedValue({ data: { data: [] } });

      await ClipboardActivityService.getAll({
        search: 'Swimming',
      });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/activity',
        expect.objectContaining({
          search: 'Swimming',
        }),
        undefined
      );
    });

    it('omits empty search parameter', async () => {
      mockAppService.get.mockResolvedValue({ data: { data: [] } });

      await ClipboardActivityService.getAll({
        search: '',
      });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/activity',
        expect.not.objectContaining({
          search: expect.any(String),
        }),
        undefined
      );
    });
  });

  describe('sort parameters', () => {
    it('sends sortBy and sortOrder to API', async () => {
      mockAppService.get.mockResolvedValue({ data: { data: [] } });

      await ClipboardActivityService.getAll({
        sortBy: 'name',
        sortOrder: 'asc',
      });

      expect(mockAppService.get).toHaveBeenCalledWith(
        '/clipboard/activity',
        expect.objectContaining({
          sortBy: 'name',
          sortOrder: 'asc',
        }),
        undefined
      );
    });
  });

  describe('applyClientFilters', () => {
    const mockActivities = [
      { id: 1, name: 'Activity 1', archived: false, department: { id: 101 } },
      { id: 2, name: 'Activity 2', archived: true, department: { id: 101 } },
      { id: 3, name: 'Activity 3', archived: false, department: { id: 102 } },
    ];

    it('filters by departmentIds', () => {
      const result = ClipboardActivityService.applyClientFilters(mockActivities, {
        departmentIds: [101],
      });

      expect(result).toHaveLength(2);
      expect(result.map((a) => a.id)).toEqual([1, 2]);
    });

    it('filters by archived status', () => {
      const result = ClipboardActivityService.applyClientFilters(mockActivities, {
        archived: true,
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('applies both filters', () => {
      const result = ClipboardActivityService.applyClientFilters(mockActivities, {
        departmentIds: [101],
        archived: false,
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('returns all activities when no filters provided', () => {
      const result = ClipboardActivityService.applyClientFilters(mockActivities);

      expect(result).toHaveLength(3);
    });
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
