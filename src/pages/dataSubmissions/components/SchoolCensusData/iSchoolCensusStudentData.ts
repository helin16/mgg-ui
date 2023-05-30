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
  visaExpiryDate: Date | string;
  visaCode: string;
  visaNumber: string;
  nccdStatusAdjustmentLevel: string;
  isInternationalStudent: boolean;
  isIndigenous: boolean;
  isPastStudent: boolean;
};

export default iSchoolCensusStudentData;
