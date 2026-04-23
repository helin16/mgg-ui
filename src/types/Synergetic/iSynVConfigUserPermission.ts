export const PERMISSION_MODULE_TIME_TABLE_MAINTENANCE = 'TIM';

type iSynVConfigUserPermission = {
  SynSuperUserFlag: boolean;
  ID: number;
  LoginName: string;
  SynDatabaseCode: string;
  ResourceType: string;
  Module: string;
  Resource1: string;
  Resource2: string;
  Resource3: string;
  SelectFlag: boolean;
  UpdateFlag: boolean;
  InsertFlag: boolean;
  DeleteFlag: boolean;
  HelpContext: boolean;
  HelpTopic: string | null;
  ConfigResourcesSeq: number | null;
  Resource123: string | null;
};

export default iSynVConfigUserPermission;
