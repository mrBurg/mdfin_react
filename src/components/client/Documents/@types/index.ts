import { UserStore } from '../../../../stores/UserStore';
import { LoanStore } from '../../../../stores/LoanStore';
import { TJSON } from '../../../../interfaces';

export type TDocumentsProps = {
  staticData: TJSON;
  userStore: UserStore;
  loanStore: LoanStore;
};
