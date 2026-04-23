type iSynCreditorBPayInfo  = {
  Seq: number;
  CreditorID: number;
  CreditorId?: number;
  BPayBillerCode: string;
  BillerCode?: string;
  BPayReference: string;
  ReferenceNum?: string;
  Notes: string | null;
  Comments?: string | null;
  IsActive: boolean;
  CustomerName?: string | null;
  Date?: Date | string | null;
  CreatedBy: string | null;
  CreatedAt: Date | string;
  UpdatedBy: string | null;
  UpdatedAt: Date | string;
}

export default iSynCreditorBPayInfo;
