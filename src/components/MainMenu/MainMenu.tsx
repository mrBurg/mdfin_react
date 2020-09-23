import { ReactElement, PureComponent } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';

import style from './MainMenu.module.scss';

import SingInIcon from './icons/sing-in-icon.svg';
import SingOutIcon from './icons/sing-out-icon.svg';
import Hamburger from './icons/hamburger.svg';

import { mainMenu } from '../../routes';
import { gt, isProd } from '../../utils';
import { BUTTON_TYPE } from '../../constants';
import { TMainMenuProps, TMainMenuState } from './@types';
import { TRouter } from '../../routes/@types';
import { STORE_IDS } from '../../stores';

@inject(STORE_IDS.USER_STORE)
@observer
class MainMenu extends PureComponent<TMainMenuProps> {
  public readonly state: TMainMenuState = {
    isOpened: false,
  };

  private setMenuState(isOpened: boolean) {
    this.setState((state: TMainMenuState) => {
      return {
        ...state,
        isOpened,
      };
    });
  }

  private openMenu = () => {
    this.setMenuState(true);
  };

  private closeMenu = () => {
    this.setMenuState(false);
  };

  private renderMenuList(item: TRouter): ReactElement {
    const { userStore } = this.props;
    const { href, title, button } = item;

    let linkContent: string | ReactElement = gt.gettext(title);

    if (button) {
      linkContent = <SingInIcon />;

      if (userStore && userStore.userLoggedIn) {
        return (
          <button
            className={style.logout}
            type={BUTTON_TYPE.BUTTON}
            onClick={userStore.logOut}
          >
            <SingOutIcon />
          </button>
        );
      }
    }

    return (
      <Link href={href}>
        <a className={classNames({ disabled: isProd && button })}>
          {linkContent}
        </a>
      </Link>
    );
  }

  private renderMenu(className: string): ReactElement {
    const { router } = this.props;

    return (
      <menu className={className}>
        {_.map(mainMenu, (item: TRouter, key: number) => {
          const { href, button } = item;

          return (
            <li
              key={key}
              className={classNames({
                [style.button]: button,
                [style.active]: router.route == href,
              })}
            >
              {this.renderMenuList(item)}
            </li>
          );
        })}
      </menu>
    );
  }

  render(): ReactElement {
    const { isOpened } = this.state;

    return (
      <>
        {this.renderMenu(style.desktopMenu)}
        <div className={style.mobileMenu}>
          <button
            type={BUTTON_TYPE.BUTTON}
            className={style.hamburger}
            onClick={this.openMenu}
          >
            <Hamburger />
          </button>
          <div
            className={classNames(style.menuContainer, {
              [style.menuContainerOpened]: isOpened,
            })}
            onClick={this.closeMenu}
          >
            {this.renderMenu(style.menu)}
          </div>
        </div>
      </>
    );
  }
}

export const MainMenuWithRouter = withRouter(MainMenu);
