import { RepaymentStore } from '@src/stores/RepaymentStore';

export type TRepaymentProps = {
  className?: string;
  repaymentStore: RepaymentStore;
};

export type TState = {
  isRender: boolean;
};
