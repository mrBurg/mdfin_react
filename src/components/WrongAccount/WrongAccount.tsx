import React, { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';

import style from './WrongAccount.module.scss';
import { AccountsForm } from '@components/AccountsForm';
import { WithDangerousHTML } from '@components/hocs';
import { TOnClickHandler } from '@interfaces';
import { BUTTON_TYPE } from '@src/constants';
import { TWrongAccountProps } from './@types';
import { gt, handleErrors } from '@utils';

@observer
export class WrongAccount extends PureComponent<TWrongAccountProps> {
  componentDidMount(): void {
    const { loanStore } = this.props;

    loanStore.getCabinetApplication();
  }

  private onSubmitHandler: TOnClickHandler = async () => {
    const { userStore, loanStore } = this.props;

    loanStore
      .cabinetChangeAccount(loanStore.account)
      .then(async () => {
        if (userStore) userStore.getClientNextStep();

        return;
      })
      .catch((err) => {
        handleErrors(err);
      });
  };

  private renderAccounts(): ReactElement | null {
    const {
      loanStore: {
        cabinetApplication: { accountUnit },
      },
    } = this.props;

    if (!accountUnit) return null;

    return (
      <AccountsForm title={true} className={style.accounts} {...accountUnit} />
    );
  }

  render(): ReactElement {
    const { loanStore } = this.props;

    return (
      <>
        <WithDangerousHTML tag={'h2'} className={style.title}>
          {loanStore.cabinetApplication?.notification!}
        </WithDangerousHTML>
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
