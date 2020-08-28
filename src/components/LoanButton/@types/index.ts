import { LoanStore } from '../../../stores/LoanStore';
import { UserStore } from '../../../stores/UserStore';

export type TLoanButtonProps = {
  className?: string;
  loanStore?: LoanStore;
  userStore?: UserStore;
};
