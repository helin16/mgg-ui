
export const LU_GENDER_CODE_MALE = 'M';
export const LU_GENDER_CODE_FEMALE = 'F';
export const LU_GENDER_CODE_OTHER = 'X';

type iSynLuGender = {
  Code: string;
  Description: string;
  SortOrder: number;
  ActiveFlag: boolean;
  SynergyMeaning: string;
  SetCentrallyFlag: boolean | null;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
}

export default iSynLuGender;
