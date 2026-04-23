type iSynOccupationPosition = {
  Code: string;
  Description: string;
  ExternalSystemType: string;
  ExternalSystemCode: string;
  ActiveFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean;
}

export default iSynOccupationPosition
