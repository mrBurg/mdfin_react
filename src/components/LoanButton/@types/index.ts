import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TLoanButtonProps = {
  className?: string;
  label: string;
  loanStore?: LoanStore;
  userStore?: UserStore;
};
