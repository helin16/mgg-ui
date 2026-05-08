type iSynConfigUser = {
  ID: number;
  LoginName: string;
  FileType: string;
  FileYear: number;
  FileSemester: number;
  DefaultCampus: string;
  LastLoginDate: Date | string | null;
  LastPasswordChangeDate: Date | string | null;
  PasswordExpiryDate: Date | string | null;
  SynWebStartPage: string;
  TOTPEnabledFlag: boolean;
  TOTPVerifiedFlag: boolean;
  DefaultSubSchool: string;
  FileYearSemesterAutoUpdatedFlag: boolean;
};

export default iSynConfigUser;
