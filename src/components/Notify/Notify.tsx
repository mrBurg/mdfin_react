import { ReactElement, PureComponent } from 'react';
import _ from 'lodash';

import style from './Notify.module.scss';

import { TState, TNotify, TNotifyItem } from './@types';
import { observer } from 'mobx-react';
import { Preloader } from '../Preloader';
import { TCabinetNotify } from '../../stores/@types/loanStore';

import { refreshViewTime } from './../../config.json';

@observer
export class Notify extends PureComponent<TNotify> {
  public readonly state: TState = {
    isRender: false,
    cabinetNotify: [],
  };

  componentDidMount() {
    const { loanStore } = this.props;

    this.refreshView();

    if (loanStore) {
      loanStore.getNotify().then(() => {
        new Promise((resolve) => {
          this.setState({
            isRender: true,
          });
          resolve();
        }).then(() => {
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
        });
      });
    }
  }

  //выбрать id-шки нотификаций, которые нужно "деактивировать"
  private getDisplayConfirmationItems(
    cabinetNotify: TCabinetNotify[]
  ): Array<number> {
    const isArrayNotify =
      Array.isArray(cabinetNotify) && !!_.size(cabinetNotify);

    let displayConfirmationItems: any[] = [];

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
