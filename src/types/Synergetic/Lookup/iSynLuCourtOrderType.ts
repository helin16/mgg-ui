type iSynLuCourtOrderType = {
  Code: string;
  Description: string;

  ModifiedDate: Date | null;
  ModifiedUser: string;

  SetCentrallyFlag: boolean | null;
}

export default iSynLuCourtOrderType;
