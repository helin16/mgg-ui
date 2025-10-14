type iSynLuConstituency = {
  Code: string;
  Description: string;
  NextConstituencyCode: string;
  ActiveFlag: boolean;
  PriorityDirectoryIntegration: string;
  ObjectTasksEmailFlag: boolean;
  SecurityMeaning: string;
  ModifiedDate: string | Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuConstituency
