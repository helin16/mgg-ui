type iSynLuMedicalConditionType = {
  Code: string;
  Description: string;
  SynergyMeaning: string | null;
  SortOrder: number;
  DefaultFlag: boolean;
  ActiveFlag: boolean;
  SetCentrallyFlag: boolean;
  ModifiedDate: Date;
  ModifiedUser: string;
  DocumentType: string | null;
}

export default iSynLuMedicalConditionType;
