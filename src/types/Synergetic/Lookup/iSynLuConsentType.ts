type iSynLuConsentType = {
  Code: string;
  Description: string;
  SortOrder: number;
  DefaultFlag: boolean;
  ActiveFlag: boolean;
  DefaultConsentExpiryDate: Date | string | null;
  ModifiedDate: Date | string;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
};

export default iSynLuConsentType;
