import { PageStore } from '../../../../stores/PageStore';
import { UserStore } from '../../../../stores/UserStore';
import {
  TUserAddress,
  TUserContacts,
} from '../../../../stores/@types/userStore';

export type TAddress = {
  staticData: any;
  pageStore?: PageStore;
  userStore?: UserStore;
};

export type TState = {
  isRender: boolean;
  userDataAddress: TUserAddress;
  userDataContacts: Array<TUserContacts>;
};
