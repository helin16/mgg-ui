type iSynDebtorPaymentMethod = {
  PaymentMethodSeq: number;
  DebtorID: number;
  DebtorStudentID: number;
  PaymentType: string;
  ChequeBankCode: string;
  ChequeBankBranch: string;
  Drawer: string;
  CreditCardType: string;
  CreditCardNumber: string;
  CreditCardExpiryMonth: number;
  CreditCardExpiryYear: number;
  EFTAccountBSB: string | null;
  EFTAccountNumber: string;
  AllowAutoPaymentFlag: boolean;
  AutoPaymentSplitPercent: number;
  AutoPaymentSplitAmount: number;
  CRN: string;
  DebtorPaymentMethodsOnlineSeq: number;
  DebtorPaymentMethodsSeq: number;
}

export default iSynDebtorPaymentMethod;
