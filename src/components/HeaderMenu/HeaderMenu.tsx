import { ReactElement } from 'react';

import style from './HeaderMenu.module.scss';

import Logo from './Logo';
import ClientMenu from './ClientMenu';
import PhoneList from './PhoneList';
import MainMenu from './MainMenu';
import CustomerMenu from './CustomerMenu';
import LanguagesSwitcher from './LanguagesSwitcher';

export function HeaderMenu(): ReactElement {
  return (
    <>
      <div className={style.header_menu}>
        {false && <div className='mobile-menu' />}
        <Logo />
        {false && <ClientMenu />}
      </div>
      <div className={style.menu_box}>
        <PhoneList />
        <MainMenu />
        <hr className={style.divider} />
        <CustomerMenu />
        <LanguagesSwitcher />
      </div>
    </>
  );
}
