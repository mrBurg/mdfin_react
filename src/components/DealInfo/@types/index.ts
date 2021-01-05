import { LoanStore } from '@src/stores/LoanStore';
import { RepaymentStore } from '@src/stores/RepaymentStore';

export type TDealInfoProps = {
  className?: string;
  title: string;
  params: any;
  loanStore?: LoanStore;
  repaymentStore?: RepaymentStore;
};
