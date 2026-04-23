type iSynLuQualificationLevel = {
  Code: string;
  Description: string;
  ExternalSystemType: string;
  ExternalSystemCode: string;
  SortOrder: number;
  ActiveFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean;
}

export default iSynLuQualificationLevel
