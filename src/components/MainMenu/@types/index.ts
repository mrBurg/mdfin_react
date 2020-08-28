import { NextRouter } from 'next/router';

export type TMainMenuProps = {
  router: NextRouter;
};

export type TMainMenuState = { isOpened: boolean };
