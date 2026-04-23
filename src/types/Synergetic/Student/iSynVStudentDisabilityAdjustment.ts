export const DISABILITY_ADJUSTMENT_LEVEL_CODE_QDTP = 'QDTP';
export const DISABILITY_ADJUSTMENT_LEVEL_CODE_SUBSTANTIAL = 'Substantial';
export const DISABILITY_ADJUSTMENT_LEVEL_CODE_SUPPLEMENTARY = 'Supplementary';
export const DISABILITY_ADJUSTMENT_LEVEL_CODE_EXTENSIVE = 'Extensive';

export const DISABILITY_ADJUSTMENT_LEVEL_CODES_FOR_CENSUS_REPORT = [
  DISABILITY_ADJUSTMENT_LEVEL_CODE_QDTP,
  DISABILITY_ADJUSTMENT_LEVEL_CODE_SUBSTANTIAL,
  DISABILITY_ADJUSTMENT_LEVEL_CODE_SUPPLEMENTARY,
  DISABILITY_ADJUSTMENT_LEVEL_CODE_EXTENSIVE,
]

type iSynVStudentDisabilityAdjustment = {
  DisabilityAdjustmentSeq: number;
  ID: number;
  Surname: string | null;
  Given1: string | null;
  Given2: string | null;
  Preferred: string | null;
  BirthDate: Date | string | null;
  FileYear: number | null;
  Form: string | null;
  Tutor: string | null;
  House: string | null;
  EducationType: string | null;
  PrimaryEducationFlag: boolean | null;
  SecondaryEducationFlag: boolean | null;
  DisabilityCategoryCode: boolean | null;
  DisabilityCategory: string | null;
  DisabilityCategorySynergyMeaning: string | null;
  DisabilityAdjustmentLevelCode: string | null;
  DisabilityAdjustmentLevel: string | null;
  DisabilityAdjustmentLevelSynergyMeaning: string | null;
  DisabilityAdjustmentLevelSortOrder: number | null;
  IncludeInExportFlag: boolean | null;
  IdentifiedNeeds: string | null;
  AdjustmentsMade: string | null;
  StartDate: Date | string | null;
  ReviewDate: Date | string | null;
  EndDate: Date | string | null;
  Consultation: string | null;
  Review: string | null;
  CurrentDisabilityFlag: boolean | null;
  CreatedByID: number | null;
  CreatedDate: Date | string | null;
  ModifiedByID: number | null;
  ModifiedDate: Date | string | null;
}

export default iSynVStudentDisabilityAdjustment;
