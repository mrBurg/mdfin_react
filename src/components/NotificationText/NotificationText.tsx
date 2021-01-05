import React, { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';

import style from './NotificationText.module.scss';

import { refreshViewTime } from '@src/config.json';
import { Preloader } from '@components/Preloader';
import { TNotificationText, TState } from './@types';

@observer
export class NotificationText extends PureComponent<TNotificationText> {
  public readonly state: TState = {
    isRender: false,
    viewId: '',
    cabinetApplication: {},
  };

  componentDidMount(): void {
    const { userStore, loanStore, viewId } = this.props;

    userStore.fetchWithAuth(async () => {
      await loanStore.getCabinetApplication();

      this.setState({
        isRender: true,
        cabinetApplication: { ...loanStore.cabinetApplication },
      });
    });

    if (viewId == 'sendmoney') {
      this.refreshView();

      setInterval(async () => {
        this.refreshView();
      }, refreshViewTime);
    }
  }

  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) userStore.getClientNextStep();
  }

  render(): ReactElement {
    if (this.state.isRender) {
      //&& notification) {
      return (
        <div className={style.notification}>
          {this.state.cabinetApplication?.notification}
        </div>
      );
    }
    return <Preloader />;
  }
}
