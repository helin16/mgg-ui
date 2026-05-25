import AppService from '../../AppService';

export type iTimetablePeriod = {
  timetableDefinitionSeq: number;
  fileType: string | null;
  fileYear: number;
  fileSemester: number;
  timetableGroup: string;
  periodNumber: number;
  dayNumber: number;
  timeFrom: string;
  timeTo: string;
  description: string | null;
};

export type iCurrentSemesterPeriods = {
  currentSemester: {
    fileYear: number;
    fileSemester: number;
  };
  periods: iTimetablePeriod[];
};

class SynTimetableDefinitionService {
  /**
   * Get all time periods for the current semester
   */
  static async getCurrentSemesterPeriods(): Promise<iCurrentSemesterPeriods | null> {
    try {
      const response = await AppService.get(
        '/syn/timetableDefinition/currentSemester/periods'
      );
      return response.data || null;
    } catch (err) {
      console.error('Error fetching current semester periods:', err);
      return null;
    }
  }

  /**
   * Get timetable definition by period number
   */
  static async getByPeriodNumber(
    periodNumber: number,
    fileYear?: number,
    fileSemester?: number
  ) {
    try {
      let url = `/syn/timetableDefinition/period/${periodNumber}`;
      const params: any = {};
      
      if (fileYear !== undefined) {
        params.fileYear = fileYear;
      }
      if (fileSemester !== undefined) {
        params.fileSemester = fileSemester;
      }

      const response = await AppService.get(url, params);
      return response.data || [];
    } catch (err) {
      console.error(`Error fetching timetable definition for period ${periodNumber}:`, err);
      return [];
    }
  }

  /**
   * Get all timetable definitions with optional filters
   */
  static async getAll(params?: {
    where?: any;
    perPage?: number;
    page?: number;
  }) {
    try {
      const response = await AppService.get('/syn/timetableDefinition/', params || {});
      return response.data || [];
    } catch (err) {
      console.error('Error fetching timetable definitions:', err);
      return [];
    }
  }
}

export default SynTimetableDefinitionService;
