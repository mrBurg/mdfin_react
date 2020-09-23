import { TStores } from '../../../stores';
import { TCabinetApplication } from '../../../stores/@types/loanStore';

export type TNotificationText = {
  className?: string;
  viewId?: string;
} & TStores;

export type TState = {
  isRender: boolean;
  viewId: string;
  cabinetApplication?: TCabinetApplication;
};
