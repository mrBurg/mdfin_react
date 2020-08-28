import { PageStore } from '../../../../stores/PageStore';
import { UserStore } from '../../../../stores/UserStore';
import { TUserJob } from '../../../../stores/@types/userStore';

export type TJob = {
  staticData: any;
  pageStore?: PageStore;
  userStore?: UserStore;
};

export type TState = {
  isRender: boolean;
  userDataJob: TUserJob;
};
