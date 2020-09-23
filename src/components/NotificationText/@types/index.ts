import { UserStore } from '../../../stores/UserStore';
import { LoanStore } from '../../../stores/LoanStore';
import { TCabinetApplication } from '../../../stores/@types/loanStore';

export type TNotificationText = {
  className?: string;
  viewId?: string;
  userStore?: UserStore;
  loanStore?: LoanStore;
};

export type TState = {
  isRender: boolean;
  viewId: string;
  cabinetApplication?: TCabinetApplication;
};
