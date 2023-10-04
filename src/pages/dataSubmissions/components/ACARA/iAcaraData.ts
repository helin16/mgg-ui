type iAcaraData = {
  ID: number;
  Given1: string;
  Surname: string;
  gender: string;
  sex: string;
  fileYear: number;
  fileSemester: number;
  campusCode: string;
  entryDate: Date | string;
  leavingDate: Date | string;
  yearLevelCode: string;
  dateOfBirth: Date | string;
  isInternationalStudent: boolean;
  isPastStudent: boolean;
  ATSIStatus: string;
  isTorresStraitIslander: boolean;
  isAboriginal: boolean;

  studentHomeLanguageCode: string;
  studentHomeLanguageDescription: string;
  studentMainSLG: string;
  studentMainSLGValidFlag: boolean;

  parent1ID: number | null;
  parent1Name: string  | null;
  parent1HighestSchoolEducation: string | null;
  parent1HighestSchoolEducationCode: string | null;
  parent1HighestSchoolEducationValidFlag: boolean;
  parent1HighestNonSchoolEducation: string | null;
  parent1HighestNonSchoolEducationValidFlag: boolean;
  parent1HighestNonSchoolEducationCode: string | null;
  parent1HighestNonSchoolEducationDescription: string | null;
  parent1MainSLG: string | null;
  parent1MainSLGValidFlag: boolean;
  parent1HomeLanguageCode: string | null;
  parent1HomeLanguageDescription: string | null;
  parent1OccupationGroup: string | null;
  parent1OccupationGroupValidFlag: boolean;
  parent1OccupationGroupCode: string | null;
  parent1OccupationGroupDescription: string | null;

  parent2ID: number | null;
  parent2Name: string  | null;
  parent2HighestSchoolEducation: string | null;
  parent2HighestSchoolEducationCode: string | null;
  parent2HighestSchoolEducationValidFlag: boolean;
  parent2HighestNonSchoolEducation: string | null;
  parent2HighestNonSchoolEducationValidFlag: boolean;
  parent2HighestNonSchoolEducationCode: string | null;
  parent2HighestNonSchoolEducationDescription: string | null;
  parent2MainSLG: string | null;
  parent2MainSLGValidFlag: boolean;
  parent2HomeLanguageCode: string | null;
  parent2HomeLanguageDescription: string | null;
  parent2OccupationGroup: string | null;
  parent2OccupationGroupValidFlag: boolean;
  parent2OccupationGroupCode: string | null;
  parent2OccupationGroupDescription: string | null;

  extra?: any;
};

export default iAcaraData;
