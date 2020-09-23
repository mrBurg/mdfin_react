import { PageStore } from '../../../stores/PageStore';
import { LoanStore } from '../../../stores/LoanStore';
import { UserStore } from '../../../stores/UserStore';

export type TProductSelectorProps = {
  pageStore?: PageStore;
  loanStore?: LoanStore;
  userStore?: UserStore;
  className?: string;
};
