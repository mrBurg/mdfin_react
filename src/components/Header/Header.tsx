import { ReactElement } from 'react';
import Link from 'next/link';

import style from './Header.module.scss';

import { mainMenu, testPages, URLS } from './../../routes';

import LogoDark from './../Logo/logo-dark.svg';
import LogoWhite from './../Logo/logo-white.svg';

export function Header(props: any): ReactElement {
  let Logo = props.router.route == URLS.HOME ? LogoWhite : LogoDark;
  let bgc =
    props.router.route == URLS.HOME ? style.header_blue : style.header_white;

  return (
    <header className={`${style.header} ${bgc}`}>
      <Link href={URLS.HOME} as={URLS.HOME}>
        <a>
          <Logo />
        </a>
      </Link>
      <ul className={style['main-menu']}>
        {mainMenu.map((item, i) => {
          let { href, alias, title } = item;

          return (
            <li key={i}>
              <Link href={href} as={alias}>
                <a>{title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
      {testPages.map((item, i) => {
        let { href, alias, title } = item;

        return (
          <Link key={i} href={href} as={alias}>
            <a>{title}</a>
          </Link>
        );
      })}
    </header>
  );
}

/* import { ReactElement, Component } from 'react';
import { observer, inject } from 'mobx-react';

import style from './header.scss';

import { IAuthStore } from '../../stores/AuthStore';
import { STORE_IDS } from '../../stores';
import Logo from './../Logo';
import Search from './../Search';
import Nav from './../Nav';
import Router from 'next/router';
import { URLS } from '../Routes';

@inject(STORE_IDS.AUTH)
@observer
export class Header extends Component<IAuthStore> {
  public render(): ReactElement {
    let {
      authStore: { hasToken }
    } = this.props;

    return (
      <header className={style.header}>
        <div className={style.content}>
          <div className={style.side}>
            <Logo />
          </div>
          {hasToken && Router.route == URLS.HOME && (
            <div className={style.center}>
              <Search />
            </div>
          )}
          <div className={`${style.side} ${style.right}`}>
            <Nav {...this.props} />
          </div>
        </div>
      </header>
    );
  }
}
 */
