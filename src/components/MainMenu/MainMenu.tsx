import React, { ReactElement, PureComponent } from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';

import style from './MainMenu.module.scss';

import SingInIcon from './icons/sing-in-icon.svg';
import SingOutIcon from './icons/sing-out-icon.svg';
import Hamburger from './icons/hamburger.svg';
import { WithTracking } from '@components/hocs';
import { mainMenu } from '@routes';
import { BUTTON_TYPE } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { TRouter } from '@src/routes/@types';
import { EMouseEvents } from '@src/trackingConstants';
import { STORE_IDS } from '@stores';
import { TMainMenuProps, TMainMenuState } from './@types';
import { gt } from '@utils';

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

  private openMenu = () => this.setMenuState(true);
  private closeMenu = () => this.setMenuState(false);

  private renderMenuItems(item: TRouter): ReactElement {
    const { userStore } = this.props;
    const { href, title, button } = item;

    let linkContent: string | ReactElement = gt.gettext(title);

    if (button) {
      linkContent = <SingInIcon />;

      if (userStore && userStore.userLoggedIn) {
        return (
          <WithTracking
            id={`LogOut-${WidgetRoles.button}`}
            events={[EMouseEvents.CLICK]}
          >
            <button
              className={style.logout}
              type={BUTTON_TYPE.BUTTON}
              role={WidgetRoles.button}
              onClick={userStore.logOut}
            >
              <SingOutIcon />
            </button>
          </WithTracking>
        );
      }
    }

    return (
      <WithTracking
        id={`MainMenu-${WidgetRoles.link}`}
        events={[EMouseEvents.CLICK]}
      >
        <Link href={href}>
          <a role={WidgetRoles.link} href={href}>
            {linkContent}
          </a>
        </Link>
      </WithTracking>
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
              {this.renderMenuItems(item)}
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
            role={WidgetRoles.button}
            aria-hidden
          >
            {this.renderMenu(style.menu)}
          </div>
        </div>
      </>
    );
  }
}

export const MainMenuWithRouter = withRouter(MainMenu);
