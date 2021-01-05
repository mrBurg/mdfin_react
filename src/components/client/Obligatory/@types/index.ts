import { PageStore } from '@src/stores/PageStore';
import { UserStore } from '@src/stores/UserStore';
import { TStores } from '@stores';

export type TObligatory = {
  staticData: any;
  pageStore: PageStore;
  userStore: UserStore;
} & TStores;

export type TState = {
  isRender: boolean;
  invalidFields: any[];
};

export type THandleChangeDate = {
  fieldName: string;
  date: Date;
};
