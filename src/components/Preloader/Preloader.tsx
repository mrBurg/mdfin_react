import { FC, ReactElement } from 'react';

import style from './preloader.module.scss';
import Spinner from './spinner.svg';

export const Preloader: FC = (): ReactElement => (
  <div className={style.preloader}>
    <Spinner />
  </div>
);
