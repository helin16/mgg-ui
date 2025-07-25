export const CAMPUS_CODE_JUNIOR = 'J';
export const CAMPUS_CODE_SENIOR = 'S';
export const CAMPUS_CODE_ELC = 'E';

type iLuCampus = {
  Campus: string;
  Code: number;
  YearLevelSort: number;
  Description: string;
  YearLevelCoordinator: string;
  NextYearCampusMale: string;
  NextYearLevelMale: number;
  NextYearCampusFemale: string;
  NextYearLevelFemale: number;
  TimetableGroup: string;
  ClearFormFlag: boolean;
  ClearHouseFlag: boolean;
  ClearTutorFlag: boolean;
  YearsUntilGraduation: number;
  CEOLanguagePolicyCode: string;
  YearLevelGroup: string;
  SubSchool: string | null;
  FormFieldName: string;
  ExternalSystemCode: string;
  ExternalSystemType: string;
  ClearLockerBookFlag: boolean;
  ClearLockerOtherFlag: boolean;
  ExportSortKey: string;
  IncludeInCensusFlag: boolean;
  CommPortalPublishFlag: boolean;
  YearLevelCoordID: number | null;
  CommPortalOverrideConfigKey5: string;
  MaxStudents: number;
  ModifiedDate: Date;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
  EducationType: string;
  ExternalSystemType2: string;
  ExternalSystemCode2: string;
  ExternalSystemType3: string;
  ExternalSystemCode3: string;
  HomeGroupDefinition: string;
  NextYearCampusOther: string | null;
  NextYearLevelOther: string | null;
};

export default iLuCampus;
