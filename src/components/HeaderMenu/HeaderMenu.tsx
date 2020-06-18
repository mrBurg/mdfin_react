import { ReactElement } from 'react';
import Link from 'next/link';

// import style from './Header.module.scss';

import LogoDark from './Logo/logo-dark.svg';
import LogoWhite from './Logo/logo-white.svg';

import { URLS } from './../../routes';
import ClientMenu from './ClientMenu';
import PhoneList from './PhoneList';
import MainMenu from './MainMenu';
import CustomerMenu from './CustomerMenu';
import LanguagesSwitcher from './LanguagesSwitcher';

type THeaderMenu = {
  mainPage: boolean;
};

export function HeaderMenu({ mainPage }: THeaderMenu): ReactElement {
  const Logo: string = mainPage ? LogoWhite : LogoDark;

  return (
    <>
      <div className='menu-header'>
        {false && <div className='mobile-menu' />}
        <div className='logo'>
          <Link href={URLS.HOME} as={URLS.HOME}>
            <a>
              <Logo />
            </a>
          </Link>
        </div>
        {false && <ClientMenu />}
      </div>
      <div className='menu-box'>
        <PhoneList />
        <MainMenu />
        <hr className='divider' />
        <CustomerMenu />
        <LanguagesSwitcher />
      </div>
    </>
  );
}
