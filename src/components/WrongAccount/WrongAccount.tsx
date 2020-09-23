import { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import style from './WrongAccount.module.scss';

import { Accounts } from '../Accounts';
import { BUTTON_TYPE } from '../../constants';
import { gt } from '../../utils';
import { TOnClickHandler } from '../../interfaces';
import { TWrongAccountProps } from './@types';

@observer
export class WrongAccount extends PureComponent<TWrongAccountProps> {
  componentDidMount(): void {
    const { loanStore } = this.props;

    loanStore.getCabinetApplication();
  }

  private onSubmitHandler: TOnClickHandler = async () => {
    const { userStore, loanStore } = this.props;

    loanStore.cabinetChangeAccount(loanStore.account).then(async () => {
      if (userStore) userStore.getClientNextStep();
    });
  };

  private renderAccounts(): ReactElement | null {
    const {
      loanStore: {
        cabinetApplication: { accountUnit },
      },
    } = this.props;

    if (accountUnit) {
      const { accounts } = accountUnit;

      return (
        <form className={style.bankAccount}>
          <h2 className={style.title}>
            {!!_.size(accounts)
              ? 'Chọn Tài Khoản Ngân Hàng'
              : 'Thêm Tài Khoản Ngân Hàng'}
          </h2>
          <Accounts className={style.accounts} {...accountUnit} />
        </form>
      );
    }

    return null;
  }

  render(): ReactElement {
    const { loanStore } = this.props;

    return (
      <>
        <h2
          className={style.title}
          dangerouslySetInnerHTML={{
            __html: loanStore.cabinetApplication?.notification || '',
          }}
        />

        {this.renderAccounts()}
        <button
          className={style.submitButton}
          type={BUTTON_TYPE.BUTTON}
          onClick={this.onSubmitHandler}
        >
          {gt.gettext('Confirm')}
        </button>
      </>
    );
  }
}
