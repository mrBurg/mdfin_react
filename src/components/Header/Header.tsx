import { ReactElement } from 'react';

import style from './Header.module.scss';

import { URLS } from './../../routes';
import HeaderMenu from '../HeaderMenu';

type THeadProps = {
  currentRoute: string;
};

export function Header({ currentRoute }: THeadProps): ReactElement {
  const mainPage: boolean = currentRoute == URLS.HOME;
  const backgroundStyle: string = mainPage
    ? style.header_blue
    : style.header_white;

  return (
    <header className={`${style.header} ${backgroundStyle}`}>
      <div className={style.container}>
        <HeaderMenu mainPage={mainPage} />
      </div>
    </header>
  );
}
