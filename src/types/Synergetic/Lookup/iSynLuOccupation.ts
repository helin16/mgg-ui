type iSynOccupation = {
  Code: string;
  Description: string;
  ExternalSystemType: string;
  ExternalSystemCode: string;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean;
}

export default iSynOccupation
