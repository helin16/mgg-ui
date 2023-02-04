type iSynLuMedicalConditionSeverity= {
  Code: string;
  Description: string;
  SortOrder: number;
  DisplayColour: string | null;
  ActiveFlag: boolean;
  SetCentrallyFlag: boolean;
  ModifiedDate: Date;
  ModifiedUser: string;
}

export default iSynLuMedicalConditionSeverity;
