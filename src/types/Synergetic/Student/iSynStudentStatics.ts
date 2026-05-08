type iSynStudentStatics = {
  ID: number;
  IntegrationFlag: boolean;
  SaleDailyCreditLimit: string;
  NewArrivalsProgramFlag: boolean;
  PriorOvernightCampsFlag: boolean;
  StudentTypeCode: string;
  ResourceLevelCode: string;
  SchoolZoneCode: string;
  InitialSchoolingDate: Date | string | null;
  FinanceAssistTypeCode: string;
  BenefitNumber: string;
  PaymentAmount: string;
  CandidateCount: number;
  ApplicationID: string;
  WithdrawnFlag: boolean;
  TertiaryReleaseFlag: boolean;
  GovernmentStudentNumber: string;
  WaiverEndDate: Date | string | null;
  AdditionalLearningNeedsFlag: boolean;
};

export default iSynStudentStatics;
