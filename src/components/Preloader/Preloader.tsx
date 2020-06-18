import { FunctionComponent, ReactElement } from 'react';

import style from './preloader.module.scss';
import Spinner from './spinner.svg';

export const Preloader: FunctionComponent = (): ReactElement => (
  <div className={style.preloader}>
    <Spinner />
  </div>
);
