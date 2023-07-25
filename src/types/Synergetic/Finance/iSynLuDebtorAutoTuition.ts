export const AUTO_TUITION_CODE_TUITION = 'T';
export const AUTO_TUITION_CODE_CONSOLIDATED_CHARGES = 'CC';
export const AUTO_TUITION_CODE_TUITION_CONCESSION = 'TC';

type iSynLuDebtorAutoTuition = {
  Code: string;
  Description: string;
  SynergyMeaning: string;
  AutoTuitionSeq: number;
  ModifiedDate: Date | string | null;
  ModifiedUser: string | null;
  SetCentrallyFlag: boolean | null;
};

export default iSynLuDebtorAutoTuition
