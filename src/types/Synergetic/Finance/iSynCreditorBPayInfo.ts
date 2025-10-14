type iSynCreditorBPayInfo  = {
  Seq: number;
  CreditorID: number;
  BPayBillerCode: string;
  BPayReference: string;
  Notes: string | null;
  IsActive: boolean;
  CreatedBy: string | null;
  CreatedAt: Date | string;
  UpdatedBy: string | null;
  UpdatedAt: Date | string;
}

export default iSynCreditorBPayInfo;
