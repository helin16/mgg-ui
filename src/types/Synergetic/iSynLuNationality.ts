export const SYN_NATIONALITY_CODE_AUSTRALIA = 'AU'

type iSynLuNationality = {
  Code: string;
  Description: string;
  ModifiedDate: Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuNationality;
