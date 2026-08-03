type iSynDocumentClassificationPermissionRow = {
  ClassificationCode: string;
  ClassificationDescription: string;
  UserGroupCode: string;
  UserGroupDescription: string;
  LoginName: string;
  Preferred: string;
  Surname: string;
  ID: number;
  ActiveStaff: boolean;
  ResourceType: string;
  Resource1: string;
  Resource2: string;
  Resource3: string;
  CanRead: boolean;
  CanUpdate: boolean;
  CanInsert: boolean;
  CanDelete: boolean;
  UserGroupRowSpan?: number;
  ResourceRowSpan?: number;
};

export default iSynDocumentClassificationPermissionRow;
