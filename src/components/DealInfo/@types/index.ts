import { LoanStore } from '../../../stores/LoanStore';
import { RepaymentStore } from '../../../stores/RepaymentStore';

export type TDealInfoProps = {
  className?: string;
  title: string;
  params: any;
  loanStore?: LoanStore;
  repaymentStore?: RepaymentStore;
}; //& TComponenProps;
