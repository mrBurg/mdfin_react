import { LoanStore } from '@src/stores/LoanStore';
import { RepaymentStore } from '@src/stores/RepaymentStore';

export type TActionsProps = {
  className?: string;
  paymentAmount: number;
  extensionAmount: number;
  closingAmount: number;

  isCabinet: boolean;

  loanStore?: LoanStore;
  repaymentStore?: RepaymentStore;
};
