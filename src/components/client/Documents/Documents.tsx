import React, { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';

import style from './Documents.module.scss';
import { AccountsForm } from '@components/AccountsForm';
import { AttachmentsForm } from '@components/AttachmentsForm';
import { WithTracking } from '@components/hocs';
import { TOnClickHandler } from '@interfaces';
import { BUTTON_TYPE } from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { gt, handleErrors, isDev } from '@utils';
import { ClientTabs } from '../ClientTabs';
import { TDocumentsProps } from './@types';

@observer
export class Documents extends PureComponent<TDocumentsProps> {
  public componentDidMount(): void {
    const { loanStore, userStore } = this.props;

    userStore.fetchWithAuth(async () => {
      if (!isDev) {
        await this.refreshView();
      }

      loanStore.getCabinetApplication();
    });
  }

  /** Берем следующий / проверяем текущий шаг визарда */
  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) userStore.getClientNextStep();
  }

  private onSubmitHandler: TOnClickHandler = async () => {
    const { userStore, loanStore } = this.props;

    loanStore
      .addAccount(loanStore.account)
      .then((data) => {
        loanStore.updateAccountValidity(data);
        userStore.getClientNextStep();

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
    const {
      loanStore: { getInvalidDocs },
      staticData: { confirm },
    } = this.props;

    return (
      <ClientTabs className={style.documents}>
        <AttachmentsForm />
        {this.renderAccounts()}
        <WithTracking
          id={`Documents-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
          events={[EMouseEvents.CLICK]}
        >
          <button
            className={style.nextStep}
            type={BUTTON_TYPE.SUBMIT}
            onClick={this.onSubmitHandler}
            disabled={getInvalidDocs}
            role={WidgetRoles.button}
          >
            {gt.gettext(confirm)}
          </button>
        </WithTracking>
      </ClientTabs>
    );
  }
}
