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
import { allRoutes, TRouter, URIS } from '../../../routes';
import { LanguagesSwitcher } from '..';
import { STORE_IDS } from '../../../stores';
import UserStore from '../../../stores/UserStore';

type TDeveloperMenuProps = {
  userStore: UserStore;
};

@inject(STORE_IDS.USER_STORE)
export class DeveloperMenu extends Component<TDeveloperMenuProps> {
  private menuRef: RefObject<HTMLDivElement> = createRef();
  private menuFloatRight: boolean = true;

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

  private setCurrentStepHendler(currentStep: string) {
    const { userStore } = this.props;

    userStore.setCurrentStep(currentStep);
  }

  private renderClientSubStep(subSteps: any) {
    return (
      <ul className={style.sublist}>
        {_.map(subSteps, (step, index) => {
          return (
            <li key={index} className={style.item}>
              <Link href='#'>
                <a
                  className={style.link}
                  onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                    event.preventDefault();

                    this.setCurrentStepHendler(step);
                  }}
                >
                  {step}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  render(): ReactElement {
    return (
      <div
        ref={this.menuRef}
        className={style.developerMenu}
        onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
          event.preventDefault();

          if (this.menuRef.current) {
            this.menuFloatRight = !this.menuFloatRight;

            this.menuRef.current.style.right = this.menuFloatRight
              ? '0'
              : 'auto';
          }
        }}
      >
        <p>Developer Menu</p>
        <ul className={style.list}>
          {allRoutes.map((item: TRouter, index: number) => {
            const { href, title, subSteps } = item;

            return (
              <li key={index} className={style.item}>
                <Link href={href}>
                  <a className={style.link}>{title}</a>
                </Link>
                {subSteps && this.renderClientSubStep(subSteps)}
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
