import { PageStore } from '../../../stores/PageStore';

import { TComponenProps } from '../../../interfaces';
import { TAccount, TReasonId } from '../../../stores/@types/loanStore';

export type TApplication = {
  staticData?: any;
  pageStore?: PageStore;
} & TComponenProps;

export type TState = {
  isRender: boolean;
  isRefuse: boolean;
  account?: TAccount;
  userDeclineReason: TReasonId;
};
