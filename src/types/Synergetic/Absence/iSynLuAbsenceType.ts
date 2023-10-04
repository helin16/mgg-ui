type iSynLuAbsenceType = {
  Code: string;
  Description: string;
  SortSeq: number;
  SynergyMeaning: string;
  AttendanceColumn: string;
  CountAsAbsenceFlag: boolean;
  ReportCode: string | null;
  ExternalSystemType: string;
  ExternalSystemCode: string;
  SingleDisplayValue: string | null;
  ActiveFlag: boolean;
  SubmitPossibleAsActualFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuAbsenceType;
