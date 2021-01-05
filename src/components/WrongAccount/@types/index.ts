import { LoanStore } from '@src/stores/LoanStore';
import { UserStore } from '@src/stores/UserStore';

export type TWrongAccountProps = {
  userStore: UserStore;
  loanStore: LoanStore;
  className?: string;
};
