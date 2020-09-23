import { UserStore } from '../../../stores/UserStore';
import { LoanStore } from '../../../stores/LoanStore';

export type TWrongAccountProps = {
  userStore: UserStore;
  loanStore: LoanStore;
  className?: string;
};
