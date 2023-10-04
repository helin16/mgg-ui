type iSynDebtorStudentConcession = {
  ID: number;
  FeeCode: string;
  AutoTuitionCode: string;
  EffectiveFromDate: Date | string | null;
  EffectiveToDate: Date | string | null;
  OverrideAmountFlag: boolean
  OverrideAmount: number
  OverridePercentage: number;
  Comment: string;
  ConcessionTypeCode: string;
  DebtorStudentConcessionsSeq: number;
}

export default iSynDebtorStudentConcession
