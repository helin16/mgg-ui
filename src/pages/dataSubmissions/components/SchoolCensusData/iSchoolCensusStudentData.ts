type iSchoolCensusStudentData = {
  ID: number;
  Given1: string;
  Surname: string;
  gender: string;
  campusCode: string;
  studentStatus: string;
  StudentStatusDescription: string;
  entryDate: Date | string;
  leavingDate: Date | string;
  yearLevelCode: string;
  dateOfBirth: Date | string;
  age: string;
  studentCountryOfBirth: string;
  studentNationality: string;
  studentNationality2: string;
  visaExpiryDate: Date | string;
  visaCode: string;
  visaNumber: string;
  visaIssueDate: Date | string;
  studentPassportNo: string;
  studentPassportIssueCountry: string;
  studentPassportCountryCode: string;
  studentPassportIssuedDate: string;
  studentPassportExpiryDate: string;
  nccdStatusCategory: string;
  nccdStatusAdjustmentLevel: string;
  isInternationalStudent: boolean;
  isIndigenous: boolean;
  isPastStudent: boolean;
  extra?: any;
};

export type iStartAndEndDateString = {
  startDateStr: string;
  endDateStr: string;
}

export default iSchoolCensusStudentData;
