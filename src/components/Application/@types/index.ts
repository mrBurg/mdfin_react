import { TStores } from '@stores';
import { TAccount, TReasonId } from '@stores-types/loanStore';

export type TApplication = {
  staticData?: any;
} & TStores;

export type TState = {
  isRender: boolean;
  isRefuse: boolean;
  account?: TAccount;
  userDeclineReason: TReasonId;
};
