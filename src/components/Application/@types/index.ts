import { TComponenProps } from '../../../interfaces';
import { TAccount, TReasonId } from '../../../stores/@types/loanStore';

export type TApplication = {
  staticData?: any;
} & TComponenProps;

export type TState = {
  isRender: boolean;
  isRefuse: boolean;
  account?: TAccount;
  userDeclineReason: TReasonId;
};

export type TDataRow = {
  text: string;
  value?: string | number;
  link?: string;
};
