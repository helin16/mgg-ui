import iBaseType from '../iBaseType';

type iCreditorBPayBatch = iBaseType & {
  creditorId: number;
  totalAmount: number | null;
  generatedAt: Date | null;
  generatedById?: string | null;
  comments: string | null;
  content: any | null;
}

export default iCreditorBPayBatch;
