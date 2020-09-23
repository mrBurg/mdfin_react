import { UserStore } from '../../../stores/UserStore';
import { LoanStore } from '../../../stores/LoanStore';

export type TInprocessProps = {
  userStore: UserStore;
  loanStore: LoanStore;
  className?: string;
};
