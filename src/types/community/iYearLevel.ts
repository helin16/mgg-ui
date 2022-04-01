export const YEAR_LEVEL_CAMPUS_CODE_JUNIOR = 'J';
export const YEAR_LEVEL_CAMPUS_CODE_SENIOR = 'S';
export const YEAR_LEVEL_CAMPUS_CODE_ELC = 'E';

type iYearLevel = {
  Campus: string;
  Code: number;
  YearLevelSort: number;
  Description: string;
};

export default iYearLevel;
