import iSynVDebtorFee from './iSynVDebtorFee';
import iSynVDebtor from './iSynVDebtor';

type iSynDebtorTransaction = {
  TransactionSeq: number;
  DebtorID: number;
  DebtorStudentID: number;
  StudentID: number;
  PostingNumber: number;
  PostingSource: string;
  InstalmentSeq: number;
  InstalmentsRemaining: number;
  StatementNumber: number;
  ReceiptNumber: number;
  FeeCode: string;
  TransactionDate: Date | string;
  TransactionAmount: number;
  TransactionDescription: string;
  AllocatedAmount: number;
  FeeUnits: number;
  FeeRate: number;
  SaleInvoiceNumber: number;
  CreditorPostingNumber: number | null;
  CreditorTransactionSeq: number | null;
  CreditorGLJournalSeq: number | null;
  StudentCourseChargesSeq: number | null;
  CreatedDate: Date | string | null;
  CreatedByID: number | null;
  ModifiedDate: Date | string | null;
  ModifiedByID: number | null;
  ObjectLoansSeqOverdueCharge: number | null;
  ObjectLoansSeqOverdueReversal: number | null;
  SynVDebtorFee?: iSynVDebtorFee | null;
  SynVDebtor?: iSynVDebtor | null;
}

export default iSynDebtorTransaction;
