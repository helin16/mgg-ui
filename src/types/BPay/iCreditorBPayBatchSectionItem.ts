import iBaseType from '../iBaseType';

type iCreditorBPayBatchSectionItem = iBaseType & {
  Id?: string;
  sectionId: number;
  creditorId: number;
  payerBankBSB?: string;
  payerBankAcc?: string;
  reference1?: string;
  reference2?: string;
  reference3?: string;
  amount: number | null;
  amt?: number;
  reference: string | null;
  billerCode: string | null;
  creditorName: string | null;
  description: string | null;
  comments?: string | null;
  dueDate: Date | string | null;
}

export default iCreditorBPayBatchSectionItem;
