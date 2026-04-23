export const SYN_COUNTRY_NAME_AUSTRALIA = 'Australia';
export const SYN_COUNTRY_CODE_AUSTRALIA = '1100';

type iSynLuCountry = {
  Code: string;
  Description: string;
  ExternalSystemType: string;
  ExternalSystemCode: string;
  ActiveFlag: boolean;
  StudentVisaProgramAssessmentLevel: string;
  ModifiedDate: Date;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
  ISOCode: string;
}

export default iSynLuCountry;
