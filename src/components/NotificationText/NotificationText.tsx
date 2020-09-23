import { ReactElement, PureComponent } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';

import style from './NotificationText.module.scss';

import { TState, TNotificationText } from './@types';
import { Preloader } from '../Preloader';
import { refreshViewTime } from './../../config.json';

@observer
export class NotificationText extends PureComponent<TNotificationText> {
  public readonly state: TState = {
    isRender: false,
    viewId: '',
    cabinetApplication: {},
  };

  componentDidMount() {
    const { loanStore, viewId } = this.props;

    if (loanStore) {
      Promise.all([loanStore.getCabinetApplication()]).then(() => {
        this.setState({
          isRender: true,
          cabinetApplication: { ...loanStore.cabinetApplication },
        });
      });
    }
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
