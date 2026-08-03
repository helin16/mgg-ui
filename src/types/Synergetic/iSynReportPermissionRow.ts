type iSynReportPermissionRow = {
  UserGroupCode: string;
  UserGroupDescription: string;
  Module: string;
  ModuleDescription: string;
  ResourceType: string;
  Resource1: string;
  Resource2: string;
  Resource3: string;
  ID: number;
  User: string;
  LoginName: string;
  ActiveStaff: boolean;
  UserGroupRowSpan?: number;
  ResourceRowSpan?: number;
};

export default iSynReportPermissionRow;
