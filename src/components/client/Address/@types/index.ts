import { PageStore } from '../../../../stores/PageStore';
import { UserStore } from '../../../../stores/UserStore';

export type TAddress = {
  staticData: any;
  pageStore: PageStore;
  userStore: UserStore;
};

export type TState = {
  isRender: boolean;
  invalidFields: Array<string>;
};
