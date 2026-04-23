export enum LU_DEBTOR_CATEGORY_CODE {
  CONSOLIDATED_CHARGES = 'CC',
  SIBLING_DISCOUNT = 'SD',
  STAFF_DISCOUNT = 'STFD',
  TUITION = 'T',
  TUITION_CONCESSION = 'TC',
}

type iSynLuDebtorFeeCategory = {
  Code: string;
  Description: string;
  ReceiptAllocationPriority: number;
  DebtorSubLedgerCode: string;
  SynergyMeaning: string;
  IncludeInCourseChargeListFlag: boolean;
  IncludeInCourseAgentCommissionCalcFlag: boolean;
  IncludeInStatementDiscountCalcFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
  OverrideCommissionRuleSeq: number | null;
}

export default iSynLuDebtorFeeCategory
