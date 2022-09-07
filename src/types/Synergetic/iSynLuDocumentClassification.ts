type iSynLuDocumentClassification = {
  Code: string;
  Description: string;
  SynergyMeaning: string;
  SecurityMeaning: string;
  ActiveFlag: boolean;
  DescriptionStyle: string;
  CommPortalVisibleForStudentParentFlag: boolean;
  CommPortalVisibleForStudentLivesWithFlag: boolean;
  CommPortalVisibleForStudentReportsFlag: boolean;
  CommPortalVisibleForSelfFlag: boolean;
  CommPortalVisibleForSpouseFlag: boolean;
  ModifiedDate: Date;
  ModifiedUser: string;
  SetCentrallyFlag: number | null;
};

export default iSynLuDocumentClassification;
