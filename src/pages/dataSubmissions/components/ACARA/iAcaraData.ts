type iAcaraData = {
  ID: number;
  Given1: string;
  Surname: string;
  gender: string;
  fileYear: number;
  fileSemester: number;
  campusCode: string;
  studentStatus: string;
  StudentStatusDescription: string;
  entryDate: Date | string;
  leavingDate: Date | string;
  yearLevelCode: string;
  dateOfBirth: Date | string;
  isInternationalStudent: boolean;
  isPastStudent: boolean;
  ATSIStatus: string;
  extra?: any;
};

export default iAcaraData;
