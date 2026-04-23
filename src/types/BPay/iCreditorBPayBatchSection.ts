import iBaseType from '../iBaseType';
import iCreditorBPayBatchSectionItem from './iCreditorBPayBatchSectionItem';

export type iCreditorBPayBatchSectionCreditor = {
  id: number;
  name: string;
};

type iCreditorBPayBatchSection = iBaseType & {
  Id?: string;
  batchId: number;
  totalAmt?: number | null;
  customerName?: string | null;
  date?: Date | string | null;
  title: string;
  totalAmount: number | null;
  itemCount: number | null;
  Creditor?: iCreditorBPayBatchSectionCreditor | null;
  Items?: iCreditorBPayBatchSectionItem[];
}

export default iCreditorBPayBatchSection;
