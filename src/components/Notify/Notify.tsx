import React, { ReactElement, PureComponent } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';

import style from './Notify.module.scss';

import { refreshViewTime } from '@src/config.json';
import { Preloader } from '@components/Preloader';
import { TNotify, TNotifyItem, TState } from './@types';
import { TCabinetNotify } from '@stores-types/loanStore';
import { handleErrors } from '@utils';

@observer
export class Notify extends PureComponent<TNotify> {
  public readonly state: TState = {
    isRender: false,
    cabinetNotify: [],
  };

  componentDidMount(): void {
    const { loanStore } = this.props;

    this.refreshView();

    if (loanStore) {
      loanStore
        .getNotify()
        .then(() => {
          this.setState({
            isRender: true,
          });

          return;
        })
        .then(() => {
          //отправляем запрос, что показали нотификацию.
          const notificationIds = {
            notificationIds: this.getDisplayConfirmationItems(
              loanStore.cabinetNotify
            ),
          };
          loanStore.confirmDisplay(notificationIds);

          setInterval(async () => {
            this.refreshView();
          }, refreshViewTime);

          return;
        })
        .catch((err) => {
          handleErrors(err);
        });
    }
  }

  //выбрать id-шки нотификаций, которые нужно "деактивировать"
  private getDisplayConfirmationItems(
    cabinetNotify: TCabinetNotify[]
  ): number[] {
    const isArrayNotify =
      Array.isArray(cabinetNotify) && !!_.size(cabinetNotify);

    const displayConfirmationItems: any[] = [];

    if (isArrayNotify) {
      _.map(cabinetNotify, (item: TNotifyItem) => {
        if (item.displayConfirmation) {
          displayConfirmationItems.push(item.id);
        }
      });
    }

    return displayConfirmationItems;
  }

  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) userStore.getClientNextStep();
  }

  public render(): ReactElement | null {
    const { loanStore } = this.props;
    const cabinetNotify = loanStore.cabinetNotify;

    const isArrayNotify =
      Array.isArray(cabinetNotify) && !!_.size(cabinetNotify); //true;

    if (this.state.isRender && loanStore && isArrayNotify) {
      return (
        <>
          {_.map(cabinetNotify, (item: TNotifyItem, index: number) => {
            const { text } = item;

            return (
              <section key={index} className={style.section}>
                <div key={index} className={style.notification}>
                  {text}
                </div>
              </section>
            );
          })}
        </>
      );
    }
    return <Preloader />;
  }
}
