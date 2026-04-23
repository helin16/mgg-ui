type iSynLuFund = {
  Code: string;
  Description: string;

  FoundationBasisFactorPledge: number;
  FoundationBasisFactorReceipt: number;
  TaxDeductableFlag: boolean;

  ActiveFlag: boolean;
  ModifiedDate: Date | null;
  ModifiedUser: string;
  SetCentrallyFlag: boolean | null;
}

export default iSynLuFund;
