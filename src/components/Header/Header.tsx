import React, { ReactElement } from 'react';
import classNames from 'classnames';

import style from './Header.module.scss';

import { Logo } from '@components/Logo';
import { MainMenu } from '@components/MainMenu';
import { THeaderProps } from './@types';

export const Header = ({ less }: THeaderProps): ReactElement => (
  <header className={style.header}>
    <div className={classNames(style.container, { [style.less]: less })}>
      <Logo />
      {!less && <MainMenu />}
    </div>
  </header>
);
