import { LoanStore } from '../../../stores/LoanStore';
import { TCabinetNotify } from '../../../stores/@types/loanStore';
import { UserStore } from '../../../stores/UserStore';

export type TNotify = {
  //notifications: Array<string> | string;
  className?: string;
  loanStore: LoanStore;
  userStore: UserStore;
};

export type TState = {
  isRender: boolean;
  cabinetNotify?: Array<TCabinetNotify>;
};

export type TNotifyItem = {
  id: number;
  text: string;
  displayConfirmation: boolean;
  closable: boolean;
};
