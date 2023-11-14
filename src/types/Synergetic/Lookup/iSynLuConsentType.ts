export const SYN_CONSENT_CODE_PARACETAMOL = 'PARACETAMOL';

type iSynLuConsentType = {
  Code: string;
  Description: string;
  SortOrder: number;
  DefaultFlag: boolean;
  ActiveFlag: boolean;
  DefaultConsentExpiryDate: Date | string | null;
  ModifiedDate: Date;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuConsentType;
