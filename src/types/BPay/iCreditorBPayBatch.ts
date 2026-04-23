import iBaseType from '../iBaseType';
import iCreditorBPayBatchSection from './iCreditorBPayBatchSection';

type iCreditorBPayBatch = iBaseType & {
  Id?: string;
  totalAmount: number | null;
  generatedAt: Date | string | null;
  generatedById?: string | null;
  comments: string | null;
  content: any | null;
  Sections?: iCreditorBPayBatchSection[];
}

export default iCreditorBPayBatch;
