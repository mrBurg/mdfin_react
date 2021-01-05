import { UserStore } from '@src/stores/UserStore';
import { NextRouter } from 'next/router';

export type TMainMenuProps = {
  router: NextRouter;
  userStore?: UserStore;
};

export type TMainMenuState = { isOpened: boolean };
