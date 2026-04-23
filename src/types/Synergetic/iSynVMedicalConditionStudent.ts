type iSynVMedicalConditionStudent = {
  MedicalConditionSeq: number;
  ID: number;
  Title: string;
  Surname: string;
  Given1: string;
  Given2: string;
  Preferred: string;
  Gender: string;
  BirthDate: Date;
  ConditionActiveFlag: boolean;
  ConditionConfidentialFlag: boolean;
  ConditionConfidentialText: string;
  ConditionTypeCode: string;
  ConditionTypeDescription: string;
  ConditionCodeActiveFlag: boolean;
  ConditionTypeSort: number;
  ConditionTypeDefaultFlag: boolean;
  ConditionSeverityCode: string;
  ConditionSeverityDescription: string;
  ConditionSeverityActiveFlag: boolean;
  ConditionSeveritySort: number;
  ConditionSeverityDisplayColour: string;
  ConditionDetails: string;
  ConditionEmergencyTreatment: string;
  ConditionOtherTreatment: string;
  ConditionNotifiedStartDate: Date | null,
  ConditionNotifiedBy: number;
  ConditionNotifiedByName: string;
  ConditionEndDate: Date | null;
  ConditionVisibility: string;
  ConditionVisibilityDescription: string;
  ConditionVisibilityActiveFlag: boolean;
  ConditionVisibilitySort: number;
  ConditionRecordNumber: string;
}

export default iSynVMedicalConditionStudent;
