import { PageStore } from '../../../stores/PageStore';
import { LoanStore } from '../../../stores/LoanStore';

export type TProductSelectorProps = {
  pageStore?: PageStore;
  loanStore?: LoanStore;
  className?: string;
};
