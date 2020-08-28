import { PageStore } from '../../../../stores/PageStore';
import { UserStore } from '../../../../stores/UserStore';
import { TUserObligatory } from '../../../../stores/@types/userStore';

export type TObligatory = {
  staticData: any;
  pageStore?: PageStore;
  userStore?: UserStore;
};

export type TState = {
  isRender: boolean;
  userData: TUserObligatory;
};

export type THandleChangeDate = {
  fieldName: string;
  date: Date;
};
