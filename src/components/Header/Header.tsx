import { ReactElement } from 'react';

import style from './Header.module.scss';

import HeaderMenu from '../HeaderMenu';

export function Header(): ReactElement {
  return (
    <header className={style.header}>
      <div className={style.container}>
        <HeaderMenu />
      </div>
    </header>
  );
}
