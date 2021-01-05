import { TRouter } from '@src/routes/@types';
import { UserStore } from '@src/stores/UserStore';

export type TDeveloperMenuProps = {
  userStore: UserStore;
};

export type TDeveloperMenuState = {
  allRoutes: TRouter[];
  float: boolean;
};
