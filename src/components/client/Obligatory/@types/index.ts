import { PageStore } from '../../../../stores/PageStore';
import { UserStore } from '../../../../stores/UserStore';
import { TComponenProps } from '../../../../interfaces';

export type TObligatory = {
  staticData: any;
  pageStore: PageStore;
  userStore: UserStore;
} & TComponenProps;

export type TState = {
  isRender: boolean;
  invalidFields: Array<any>;
};

export type THandleChangeDate = {
  fieldName: string;
  date: Date;
};
