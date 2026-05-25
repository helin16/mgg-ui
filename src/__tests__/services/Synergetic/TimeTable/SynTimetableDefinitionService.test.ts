import AppService from '../../../../services/AppService';
import SynTimetableDefinitionService, {
  iTimetablePeriod,
  iCurrentSemesterPeriods,
} from '../../../../services/Synergetic/TimeTable/SynTimetableDefinitionService';

jest.mock('../../../../services/AppService', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockedAppService = AppService as jest.Mocked<typeof AppService>;

describe('SynTimetableDefinitionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentSemesterPeriods', () => {
    test('returns current semester periods data', async () => {
      const mockPeriods: iTimetablePeriod[] = [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
        {
          timetableDefinitionSeq: 2,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group2',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ];

      const mockResponse: iCurrentSemesterPeriods = {
        currentSemester: {
          fileYear: 2026,
          fileSemester: 1,
        },
        periods: mockPeriods,
      };

      mockedAppService.get.mockResolvedValue({ data: mockResponse });

      const result = await SynTimetableDefinitionService.getCurrentSemesterPeriods();

      expect(result).toEqual(mockResponse);
      expect(mockedAppService.get).toHaveBeenCalledWith(
        '/syn/timetableDefinition/currentSemester/periods'
      );
      expect(mockedAppService.get).toHaveBeenCalledTimes(1);
    });

    test('returns null on error', async () => {
      const error = new Error('API Error');
      mockedAppService.get.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = await SynTimetableDefinitionService.getCurrentSemesterPeriods();

      expect(result).toBeNull();
      expect(mockedAppService.get).toHaveBeenCalledWith(
        '/syn/timetableDefinition/currentSemester/periods'
      );
      consoleSpy.mockRestore();
    });

    test('returns null when response data is null', async () => {
      mockedAppService.get.mockResolvedValue({ data: null });

      const result = await SynTimetableDefinitionService.getCurrentSemesterPeriods();

      expect(result).toBeNull();
    });
  });

  describe('getByPeriodNumber', () => {
    test('returns timetable definitions for a period number', async () => {
      const mockDefinitions: iTimetablePeriod[] = [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 2,
          dayNumber: 1,
          timeFrom: '09:40',
          timeTo: '10:30',
          description: 'Period 2',
        },
      ];

      mockedAppService.get.mockResolvedValue({ data: mockDefinitions });

      const result = await SynTimetableDefinitionService.getByPeriodNumber(2);

      expect(result).toEqual(mockDefinitions);
      expect(mockedAppService.get).toHaveBeenCalledWith('/syn/timetableDefinition/period/2', {});
    });

    test('includes fileYear parameter when provided', async () => {
      const mockDefinitions: iTimetablePeriod[] = [];
      mockedAppService.get.mockResolvedValue({ data: mockDefinitions });

      await SynTimetableDefinitionService.getByPeriodNumber(3, 2026);

      expect(mockedAppService.get).toHaveBeenCalledWith(
        '/syn/timetableDefinition/period/3',
        { fileYear: 2026 }
      );
    });

    test('includes fileSemester parameter when provided', async () => {
      const mockDefinitions: iTimetablePeriod[] = [];
      mockedAppService.get.mockResolvedValue({ data: mockDefinitions });

      await SynTimetableDefinitionService.getByPeriodNumber(3, undefined, 1);

      expect(mockedAppService.get).toHaveBeenCalledWith(
        '/syn/timetableDefinition/period/3',
        { fileSemester: 1 }
      );
    });

    test('includes both fileYear and fileSemester parameters', async () => {
      const mockDefinitions: iTimetablePeriod[] = [];
      mockedAppService.get.mockResolvedValue({ data: mockDefinitions });

      await SynTimetableDefinitionService.getByPeriodNumber(4, 2026, 1);

      expect(mockedAppService.get).toHaveBeenCalledWith(
        '/syn/timetableDefinition/period/4',
        { fileYear: 2026, fileSemester: 1 }
      );
    });

    test('returns empty array on error', async () => {
      const error = new Error('API Error');
      mockedAppService.get.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = await SynTimetableDefinitionService.getByPeriodNumber(5);

      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });

    test('returns empty array when response data is null', async () => {
      mockedAppService.get.mockResolvedValue({ data: null });

      const result = await SynTimetableDefinitionService.getByPeriodNumber(6);

      expect(result).toEqual([]);
    });
  });

  describe('getAll', () => {
    test('returns all timetable definitions without parameters', async () => {
      const mockDefinitions: iTimetablePeriod[] = [
        {
          timetableDefinitionSeq: 1,
          fileType: 'T',
          fileYear: 2026,
          fileSemester: 1,
          timetableGroup: 'Group1',
          periodNumber: 1,
          dayNumber: 1,
          timeFrom: '08:45',
          timeTo: '09:35',
          description: 'Period 1',
        },
      ];

      mockedAppService.get.mockResolvedValue({ data: mockDefinitions });

      const result = await SynTimetableDefinitionService.getAll();

      expect(result).toEqual(mockDefinitions);
      expect(mockedAppService.get).toHaveBeenCalledWith('/syn/timetableDefinition/', {});
    });

    test('returns all timetable definitions with parameters', async () => {
      const mockDefinitions: iTimetablePeriod[] = [];
      const params = { perPage: 50, page: 1 };

      mockedAppService.get.mockResolvedValue({ data: mockDefinitions });

      const result = await SynTimetableDefinitionService.getAll(params);

      expect(result).toEqual(mockDefinitions);
      expect(mockedAppService.get).toHaveBeenCalledWith('/syn/timetableDefinition/', params);
    });

    test('returns empty array on error', async () => {
      const error = new Error('API Error');
      mockedAppService.get.mockRejectedValue(error);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = await SynTimetableDefinitionService.getAll();

      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });

    test('returns empty array when response data is null', async () => {
      mockedAppService.get.mockResolvedValue({ data: null });

      const result = await SynTimetableDefinitionService.getAll();

      expect(result).toEqual([]);
    });

    test('passes where clause in parameters', async () => {
      const mockDefinitions: iTimetablePeriod[] = [];
      const params = {
        where: { periodNumber: 1 },
        perPage: 100,
      };

      mockedAppService.get.mockResolvedValue({ data: mockDefinitions });

      await SynTimetableDefinitionService.getAll(params);

      expect(mockedAppService.get).toHaveBeenCalledWith('/syn/timetableDefinition/', params);
    });
  });
});
