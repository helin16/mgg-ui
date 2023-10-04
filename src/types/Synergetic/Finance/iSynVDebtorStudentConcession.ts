type iSynVDebtorStudentConcession = {
  DebtorID: number;
  StudentID: number;
  StudentNameInternal: string;
  StudentNameExternal: string;
  StudentLegalFullName: string;
  StudentSurname: string;
  StudentPreferred: string;
  StudentPreferredFormal: string;
  StudentCampus: string;
  StudentYearLevel: string;
  StudentStatus: string;
  StudentBoarder: string;
  StudentFullFeeFlag: boolean;
  FeeCode: string;
  FeeDescription: string;
  OverrideFlag: boolean;
  FeeAmount: string;
  DiscountPercentage: number;
  DefaultFeeAmount: number;
  DefaultDiscountPercentage: number;
  EffectiveFromDate: Date | string | null;
  EffectiveToDate: Date | string | null;
  FileSemester: number;
  FileYear: number;
  CurrentSemesterOnlyFlag: boolean;
  ConcessionTypeCode: string;
}

export default iSynVDebtorStudentConcession
