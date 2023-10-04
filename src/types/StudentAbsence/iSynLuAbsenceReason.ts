type iSynLuAbsenceReason = {
  Code: string;
  Description: string;
  AbsenceTypeCode: string;
  ActiveFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean;
}

export default iSynLuAbsenceReason;
