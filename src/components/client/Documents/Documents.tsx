import { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import style from './Documents.module.scss';

import { ClientTabs } from '../ClientTabs';
import { BUTTON_TYPE } from '../../../constants';
import { gt } from '../../../utils';
import { TOnClickHandler } from '../../../interfaces';
import { TDocumentsProps } from './@types';
import { Attachments } from './../../Attachments';
import { TDocumentUnit } from '../../../stores/@types/loanStore';
import { Accounts } from '../../Accounts';

@observer
export class Documents extends PureComponent<TDocumentsProps> {
  public componentDidMount(): void {
    const { loanStore, userStore } = this.props;

    userStore.fetchWithAuth(() => {
      loanStore.getCabinetApplication();
    });
  }

  private onSubmitHandler: TOnClickHandler = async () => {
    const { userStore, loanStore } = this.props;

    loanStore.addAccount(loanStore.account).then(async () => {
      if (userStore) userStore.getClientNextStep();
    });
  };

  private renderDocs(): ReactElement | null {
    const {
      staticData,
      loanStore: {
        cabinetApplication: { documentUnits },
      },
    } = this.props;

    if (documentUnits) {
      return (
        <form className={style.attachments}>
          <h2 className={style.title}>{staticData.title}</h2>
          <div className={style.buttons}>
            {_.map(documentUnits, (item: TDocumentUnit, key) => {
              let { documents, full, type, type_id } = item;

              return (
                <Attachments
                  key={key}
                  title={type}
                  documents={documents}
                  type={type_id}
                  full={full}
                />
              );
            })}
          </div>
        </form>
      );
    }

    return null;
  }

  private renderAccounts(): ReactElement | null {
    const {
      loanStore: {
        cabinetApplication: { accountUnit },
      },
    } = this.props;

    console.toJS(accountUnit);

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
      <ClientTabs className={style.documents}>
        {this.renderDocs()}
        {this.renderAccounts()}
        <button
          className={style.nextStep}
          type={BUTTON_TYPE.BUTTON}
          onClick={this.onSubmitHandler}
          disabled={!loanStore.getDocsValid}
        >
          {gt.gettext('Confirm')}
        </button>
      </ClientTabs>
    );
  }
}
