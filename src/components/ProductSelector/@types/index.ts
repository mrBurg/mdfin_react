import { LoanStore } from '@src/stores/LoanStore';
import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';

export type TProductSelectorProps = {
  pageStore?: PageStore;
  loanStore?: LoanStore;
  userStore?: UserStore;
  className?: string;
};
