export const AUTO_TUITION_VARIATION_TYPE_FULL_FEE = 'F';


type iSynVDebtorFee = {
  FeeCode: string;
  AutoTuitionCode: string;
  Campus: string;
  YearLevel: number;
  YearLevelTo: number | null;
  SiblingCount: number;
  FamilyPosition: number;
  Boarder: string;
  TuitionVariationType: string;
  Description: string;
  Amount: number;
  TaxAmount: number;
  AmountExTax: number;
  AnnualAmount: number;
  AnnualTaxAmount: number;
  AnnualAmountExTax: number;
  NormallyCreditFlag: boolean;
  DiscountPercentage: number;
  DiscountBasedOn: string;
  DiscountAltersNettBaseFlag: boolean;
  InstalmentFlag: boolean;
  AutoTuitionPeriodNumber: number;
  AutoTuitionPeriodIncludeFlag: boolean;
  DescriptionStyle: string;
  AllowZeroAmountFlag: boolean;
  FeeUnits: number;
  FeeRate: number;
  PrintStudentNameFlag: boolean;
  BoarderType: string;
  FeeCategoryCode: string;
  FeeCategoryDescription: string;
  FeeCategoryCEOMeaning: string;
  FeeCategorySynergyMeaning: string;
  FeeCategorySynergyMeaningCategory: string;
  ActiveFlag: boolean;
}

export default iSynVDebtorFee;
