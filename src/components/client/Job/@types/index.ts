import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';

export type TJob = {
  staticData: any;
  pageStore: PageStore;
  userStore: UserStore;
};

export type TState = {
  isRender: boolean;
  invalidFields: string[];
};
