import { NextRouter } from 'next/router';
import { UserStore } from '../../../stores/UserStore';

export type TMainMenuProps = {
  router: NextRouter;
  userStore?: UserStore;
};

export type TMainMenuState = { isOpened: boolean };
