import {
  MouseEvent,
  ReactElement,
  Component,
  createRef,
  RefObject,
} from 'react';
import Link from 'next/link';
import { inject } from 'mobx-react';
import axios from 'axios';
import _ from 'lodash';

import style from './DeveloperMenu.module.scss';

import { makeStaticUri } from '../../../utils';
import { allRoutes, URIS } from '../../../routes';
import { LanguagesSwitcher } from '..';
import { STORE_IDS } from '../../../stores';
import { TDeveloperMenuProps } from './@types';
import { TRouter } from '../../../routes/@types';

@inject(STORE_IDS.USER_STORE)
export class DeveloperMenu extends Component<TDeveloperMenuProps> {
  public readonly state = {
    floatRight: true,
  };
  private menuRef: RefObject<HTMLDivElement> = createRef();

  private async updateStatic(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    try {
      await axios.get(makeStaticUri(URIS.CLEAR_CACHE));

      window.location.reload(false);
    } catch (err) {
      console.info(err);

      return null;
    }
  }

  private logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { userStore } = this.props;

    userStore.logOut();
  };

  render(): ReactElement {
    return (
      <div
        ref={this.menuRef}
        className={style.developerMenu}
        onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();

          this.setState((state: any) => {
            return {
              ...state,
              floatRight: !state.floatRight,
            };
          });

          if (this.menuRef.current) {
            const { floatRight } = this.state;

            this.menuRef.current.style.right = floatRight ? '0' : 'auto';
          }
        }}
      >
        <p>Developer Menu</p>
        <ul className={style.list}>
          {allRoutes.map((item: TRouter, index: number) => {
            const { href, title } = item;

            return (
              <li key={index} className={style.item}>
                <Link href={href}>
                  <a className={style.link}>{title}</a>
                </Link>
              </li>
            );
          })}
          <li className={style.item}>
            <button className={style.button} onClick={this.updateStatic}>
              Update Locales
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
