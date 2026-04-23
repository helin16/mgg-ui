type iSynLuAppeal = {
  Code: string;
  Description: string;

  GeneralLedgerCode: string;
  AppealTarget: number;
  ReceiptLetter: string;
  PledgeLetter: string;

  ActiveFlag: boolean;
  ModifiedDate: Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuAppeal;
