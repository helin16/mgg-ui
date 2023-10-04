export const SYN_NATIONALITY_CODE_AUSTRALIA = 'AU'
export const SYN_NATIONALITY_DESCRIPTION_AUSTRALIA = 'AUSTRALIAN'

type iSynLuNationality = {
  Code: string;
  Description: string;
  ModifiedDate: Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuNationality;
