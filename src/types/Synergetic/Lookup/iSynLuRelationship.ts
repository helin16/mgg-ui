type iSynLuRelationship = {
  Code: string;
  Description: string;
  GenerationGap: number;
  RevRelationshipMale: string;
  RevRelationshipFemale: string;
  RelationshipSpouse: string;
  SynergyMeaning: string;
  GenerationGapSort: number;
  SetRelationsDefaultEmail: string | null;
  SetRelationsDefaultSMS: string | null;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
  SetRelationshipDefaultPortalApproval: string | null;
  RevRelationshipOther: string;
};

export default iSynLuRelationship;
