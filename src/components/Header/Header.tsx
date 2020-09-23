import { ReactElement, FC } from 'react';
import classNames from 'classnames';

import style from './Header.module.scss';

import { MainMenu } from '../MainMenu';
import { Logo } from '../Logo';
import { THeaderProps } from './@types';

export const Header: FC<THeaderProps> = ({ less }): ReactElement => (
  <header className={style.header}>
    <div className={classNames(style.container, { [style.less]: less })}>
      <Logo />
      {!less && <MainMenu />}
    </div>
  </header>
);
