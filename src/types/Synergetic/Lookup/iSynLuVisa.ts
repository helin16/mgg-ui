type iSynLuVisa = {
  Code: string;
  Description: string;
  ExternalSystemType: string | null;
  ExternalSystemCode: string | null;
  ActiveFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
};

export default iSynLuVisa;
