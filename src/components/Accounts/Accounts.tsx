import { PureComponent, ReactElement } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';

import style from './Accounts.module.scss';

import { SelectWidget } from '../widgets/SelectWidget';
import { FIELD_NAME, INPUT_TYPE } from '../../constants';
import {
  TAccountsProps,
  TOnSelectHandler,
  TAccountsState,
  TFormattedAccount,
} from './@types';
import { STORE_IDS } from '../../stores';
import { DIRECTORIES } from '../../routes';
import { TOnInputChangeHandler } from '../../interfaces';
import { TAccount } from '../../stores/@types/loanStore';

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.LOAN_STORE, STORE_IDS.OTP_STORE)
@observer
export class Accounts extends PureComponent<TAccountsProps> {
  public readonly state: TAccountsState = {
    addNewAccount: false,
  };

  public componentDidMount(): void {
    const {
      editable,
      selectedAccount_id,
      accounts,
      loanStore,
      pageStore,
    } = this.props;
    const hasAccounts: boolean = !!_.size(accounts);

    if (loanStore && editable && hasAccounts) {
      loanStore.addOptionToAccountList({
        account_id: 0,
        accountNumber: 'Tài khoản ngân hàng mới',
      });
    }

    if (editable && !hasAccounts) {
      this.setState((state) => {
        return {
          ...state,
          addNewAccount: true,
        };
      });
    }

    if (loanStore && selectedAccount_id) {
      loanStore.updateAccount({
        name: FIELD_NAME.ACCOUNT_ID,
        value: selectedAccount_id,
      });
    }

    if (pageStore) pageStore.getDirectory(DIRECTORIES.dirBank);
  }

  private accountFormatter(data: Array<TAccount>): Array<TFormattedAccount> {
    const formattedData: Array<TFormattedAccount> = [];

    _.map(data, (item) => {
      const { accountNumber, account_id, ...props } = item;

      formattedData.push({
        value: account_id,
        text: accountNumber,
        ...props,
      });
    });

    return formattedData;
  }

  private selectAccountHandler: TOnSelectHandler = (_event, data) => {
    const { loanStore } = this.props;
    const { name, value } = data;

    if (loanStore && typeof value != 'undefined') {
      const isNewAccount: boolean = value == 0;

      this.setState((state) => {
        return {
          ...state,
          addNewAccount: isNewAccount,
        };
      });

      if (!isNewAccount) loanStore.resetAccount();

      loanStore.updateAccount({ name, value });
    }
  };

  private selectBankHandler: TOnSelectHandler = (_event, data) => {
    const { loanStore } = this.props;
    const { name, value } = data;

    if (loanStore) loanStore.updateAccount({ name, value });
  };

  public onChangeHandler: TOnInputChangeHandler = (event): void => {
    const { loanStore } = this.props;
    const { name, value } = event.currentTarget;

    if (loanStore) loanStore.updateAccount({ name, value });
  };

  public render(): ReactElement | null {
    const {
      editable,
      selectedAccount_id,
      accounts,
      className,
      pageStore,
      loanStore,
      otpStore,
    } = this.props;
    const { addNewAccount } = this.state;

    if (pageStore && loanStore) {
      const { dirBank } = pageStore;
      const { account } = loanStore;
      const { otpReady } = otpStore!;

      return (
        <div className={classNames(className, style.accounts)}>
          {!!_.size(accounts) && (
            <SelectWidget
              name={FIELD_NAME.ACCOUNT_ID}
              className={style.select}
              placeholder={'Chọn Tài Khoản Ngân Hàng'}
              options={this.accountFormatter(accounts)}
              onChange={this.selectAccountHandler}
              defaultValue={selectedAccount_id}
              disabled={!!otpReady}
            />
          )}
          {addNewAccount && editable && (
            <div className={style.buttons}>
              <SelectWidget
                name={FIELD_NAME.BANK_ID}
                className={style.bankSelect}
                placeholder={'Chọn Ngân Hàng'}
                options={dirBank}
                onChange={this.selectBankHandler}
                scrolling
              />
              <input
                name={FIELD_NAME.ACCOUNT_NUMBER}
                className={style.input}
                type={INPUT_TYPE.TEXT}
                placeholder='Số Tài Khoản Ngân Hàng'
                value={account.accountNumber}
                onChange={this.onChangeHandler}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  }
}
