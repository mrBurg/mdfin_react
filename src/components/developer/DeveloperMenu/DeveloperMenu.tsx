import React, {
  MouseEvent,
  ReactElement,
  PureComponent,
  createRef,
  RefObject,
} from 'react';
import Link from 'next/link';
import { inject } from 'mobx-react';
import axios from 'axios';
import _ from 'lodash';

import style from './DeveloperMenu.module.scss';
import { allRoutes, URIS } from '@routes';
import { TRouter } from '@src/routes/@types';
import { STORE_IDS } from '@stores';
import { makeStaticUri, handleErrors } from '@utils';
import { LanguagesSwitcher } from '..';
import { TDeveloperMenuProps, TDeveloperMenuState } from './@types';

@inject(STORE_IDS.USER_STORE)
export class DeveloperMenu extends PureComponent<TDeveloperMenuProps> {
  public readonly state: TDeveloperMenuState = {
    allRoutes: [],
    float: true,
  };

  public componentDidMount(): void {
    allRoutes.sort((prev, next) => {
      return Number(prev.title > next.title);
    });

    this.setState((state: TDeveloperMenuState) => {
      return {
        ...state,
        allRoutes,
      };
    });
  }

  private menuRef: RefObject<HTMLDivElement> = createRef();

  private async updateStatic(
    event: MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    event.preventDefault();

    try {
      await axios.get(makeStaticUri(URIS.CLEAR_CACHE));

      window.location.reload();
    } catch (err) {
      handleErrors(err);
    }
  }

  private logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    this.props.userStore.logOut();
  };

  render(): ReactElement {
    return (
      <div
        ref={this.menuRef}
        className={style.developerMenu}
        onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();

          this.setState((state: TDeveloperMenuState) => {
            return {
              ...state,
              float: !state.float,
            };
          });

          if (this.menuRef.current) {
            const { float } = this.state;

            this.menuRef.current.style.right = float ? '0' : 'auto';
          }
        }}
      >
        <p>Developer Menu</p>
        <ul className={style.list}>
          {_.map(allRoutes, (item: TRouter, index: number) => {
            const { href, title } = item;

            return (
              <li key={index} className={style.item}>
                <Link href={href}>
                  <a className={style.link} href={href}>
                    {title}
                  </a>
                </Link>
              </li>
            );
          })}
          <li className={style.item}>
            <button className={style.button} onClick={this.updateStatic}>
              Clear Cache
            </button>
          </li>
          <li className={style.item}>
            <LanguagesSwitcher />
          </li>
          <li className={style.item}>
            <button className={style.button} onClick={this.logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
