import { LoanStore } from '../../../stores/LoanStore';
import { RepaymentStore } from '../../../stores/RepaymentStore';

export type TActionsProps = {
  className?: string;
  paymentAmount: number;
  extensionAmount: number;
  closingAmount: number;

  isCabinet: boolean;

  loanStore?: LoanStore;
  repaymentStore?: RepaymentStore;
};
