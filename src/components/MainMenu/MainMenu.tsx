import { ReactElement, Component } from 'react';
import { withRouter, NextRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';
import _ from 'lodash';

import style from './MainMenu.module.scss';

import SingInIcon from './icons/sing-in-icon.svg';
import Hamburger from './icons/hamburger.svg';

import { mainMenu, TRouter } from '../../routes';
import { gt } from '../../utils';
import { BUTTON_TYPE } from '../../constants';

type TMainMenuProps = {
  router: NextRouter;
};

type TMainMenuState = { isOpened: boolean };

class MainMenu extends Component<TMainMenuProps> {
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

  render(): ReactElement {
    const { router } = this.props;
    const { isOpened } = this.state;

    return (
      <>
        <menu className={style.desktopMenu}>
          {_.map(mainMenu, (item: TRouter, index: number) => {
            const { href, title, button } = item;
            const linkContent = button ? <SingInIcon /> : gt.gettext(title);

            return (
              <li
                key={index}
                className={classNames({ [style.active]: router.route == href })}
              >
                <Link href={href}>
                  <a>{linkContent}</a>
                </Link>
              </li>
            );
          })}
        </menu>
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
            <menu className={style.menu}>
              {_.map(mainMenu, (item: TRouter, index: number) => {
                const { href, title } = item;

                return (
                  <li key={index}>
                    <Link href={href}>
                      <a
                        className={classNames({
                          [style.active]: router.route == href,
                        })}
                      >
                        {gt.gettext(title)}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </menu>
          </div>
        </div>
      </>
    );
  }
}

export const MainMenuWithRouter = withRouter(MainMenu);
