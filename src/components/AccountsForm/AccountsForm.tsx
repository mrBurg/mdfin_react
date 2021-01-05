import React, { PureComponent, ReactElement } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';

import style from './AccountsForm.module.scss';
import { WithTracking } from '@components/hocs';
import { ReactSelectWidget } from '@components/widgets/ReactSelectWidget';
import { TSelectData } from '@components/widgets/ReactSelectWidget/@types';
import { TOnInputChangeHandler } from '@interfaces';
import { DIRECTORIES } from '@routes';
import { FIELD_NAME, INPUT_TYPE } from '@src/constants';
import { AbstractRoles } from '@src/roles';
import { EFocusEvents, EKeyboardEvents } from '@src/trackingConstants';
import { STORE_IDS } from '@stores';
import { handleErrors, validateAccountNumber } from '@utils';
import { TAccountsFormProps, TFormattedAccount } from './@types';
import { TAccount } from '@stores-types/loanStore';
import { TDirectoryItem } from '@stores-types/pageStore';

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.LOAN_STORE, STORE_IDS.OTP_STORE)
@observer
export class AccountsForm extends PureComponent<TAccountsFormProps> {
  public componentDidMount(): void {
    const {
      editable,
      selectedAccount_id,
      accounts,
      loanStore,
      pageStore,
    } = this.props;
    const hasAccounts = !!_.size(accounts);

    if (loanStore) {
      loanStore
        .initAccountForm()
        .then(() => {
          const { accountsFormStatic } = loanStore;

          if (accountsFormStatic) {
            if (editable) {
              if (hasAccounts) {
                const { buttons } = accountsFormStatic;

                loanStore.addOptionToAccountList({
                  account_id: 0,
                  accountNumber: buttons.add,
                });

                loanStore.updateAccountState(false);
              }
            }

            if (selectedAccount_id) {
              loanStore.updateAccount({
                name: FIELD_NAME.ACCOUNT_ID,
                value: selectedAccount_id,
              });
            }
          }

          return;
        })
        .catch((err) => {
          handleErrors(err);
        });
    }

    if (pageStore) pageStore.getDirectory(DIRECTORIES.dirBank);
  }

  private accountFormatter(data: TAccount[]): TDirectoryItem[] {
    const formattedData: TFormattedAccount[] = [];

    _.map(data, (item) => {
      const { accountNumber, account_id, ...props } = item;
      formattedData.push({
        ...props,
        value: account_id,
        text: accountNumber,
      });
    });

    return formattedData;
  }

  private selectAccountHandler = (data: TSelectData) => {
    const { loanStore } = this.props;
    const { name, value } = data;

    if (loanStore && typeof value != 'undefined') {
      loanStore.updateAccountState(value == '0');
      loanStore.updateAccount({ name, value });
    }
  };

  private selectBankHandler = (data: TSelectData) => {
    const { loanStore } = this.props;
    const { name, value } = data;

    if (loanStore) loanStore.updateAccount({ name, value });
  };

  public onChangeHandler: TOnInputChangeHandler = (event): void => {
    const { loanStore } = this.props;
    const { name, value } = event.currentTarget;

    if (loanStore) {
      loanStore.updateAccount({ name, value });
      loanStore.updateAccountValidity(validateAccountNumber(value));
    }
  };

  public render(): ReactElement | null {
    const {
      title,
      editable,
      accounts,
      className,
      pageStore,
      loanStore,
      otpStore,
    } = this.props;

    if (pageStore && loanStore && otpStore) {
      const { dirBank } = pageStore;
      const {
        account: { account_id, accountNumber },
        accountsFormStatic,
        isNewAccount,
        invalidAccount,
      } = loanStore;
      const { otpReady } = otpStore;

      if (accountsFormStatic) {
        const { isPresent, notPresent, buttons } = accountsFormStatic;

        return (
          <form className={classNames(style.accountsForm, className)}>
            {title && (
              <h2 className={style.title}>
                {_.size(accounts) ? notPresent.title : isPresent.title}
              </h2>
            )}
            <div className={style.accounts}>
              {!!_.size(accounts) && (
                <ReactSelectWidget
                  name={FIELD_NAME.ACCOUNT_ID}
                  value={account_id}
                  className={style.select}
                  placeholder={notPresent.title}
                  options={this.accountFormatter(accounts)}
                  onChange={this.selectAccountHandler}
                  disabled={!!otpReady}
                />
              )}
              {isNewAccount && editable && (
                <div className={style.buttons}>
                  <ReactSelectWidget
                    name={FIELD_NAME.BANK_ID}
                    className={classNames('orange', style.bankSelect)}
                    placeholder={buttons.select}
                    options={dirBank}
                    onChange={this.selectBankHandler}
                    isSearchable
                  />
                  <WithTracking
                    id={`AccountsForm-${AbstractRoles.input}-${INPUT_TYPE.TEXT}-${FIELD_NAME.ACCOUNT_NUMBER}`}
                    events={[
                      EFocusEvents.FOCUS,
                      EFocusEvents.BLUR,
                      EKeyboardEvents.KEY_UP,
                    ]}
                  >
                    <input
                      name={FIELD_NAME.ACCOUNT_NUMBER}
                      className={classNames(style.input, {
                        [style.error]: invalidAccount,
                      })}
                      type={INPUT_TYPE.TEXT}
                      placeholder={buttons.enter}
                      value={accountNumber}
                      onChange={this.onChangeHandler}
                      role={AbstractRoles.input}
                    />
                  </WithTracking>
                </div>
              )}
            </div>
          </form>
        );
      }
    }

    return null;
  }
}
