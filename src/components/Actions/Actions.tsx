import React, { PureComponent, ReactElement } from 'react';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';

import style from './Actions.module.scss';
import { WithTracking } from '@components/hocs';
import { TOnInputChangeHandler, TOnClickHandler } from '@interfaces';
import { INPUT_TYPE, FIELD_NAME, BUTTON_TYPE } from '@src/constants';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import {
  EFocusEvents,
  EKeyboardEvents,
  EMouseEvents,
} from '@src/trackingConstants';
import { STORE_IDS } from '@stores';
import { divideDigits, gt } from '@utils';
import { TActionsProps } from './@types';

@inject(STORE_IDS.LOAN_STORE, STORE_IDS.REPAYMENT_STORE)
@observer
export class Actions extends PureComponent<TActionsProps> {
  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { value },
  }) => {
    /* const { loanStore, repaymentStore, isCabinet } = this.props;

    if (loanStore && repaymentStore) {
      if (isCabinet) {
        loanStore.updatePaymentAmount(Number(value));
      } else {
        repaymentStore.updatePaymentAmount(Number(value));
      }
    } */
    this.updatePaymentAmount(Number(value));
  };

  private onClickHandler: TOnClickHandler = ({
    currentTarget: {
      dataset: { amount },
    },
  }) => {
    /* const { loanStore } = this.props;
    if (loanStore) {
      loanStore.updatePaymentAmount(Number(amount));
    } */
    this.updatePaymentAmount(Number(amount));
  };

  private async updatePaymentAmount(value: number) {
    const { loanStore, repaymentStore, isCabinet } = this.props;
    if (loanStore && repaymentStore) {
      if (isCabinet) {
        loanStore.updatePaymentAmount(Number(value));
      } else {
        repaymentStore.updatePaymentAmount(Number(value));
      }
    }
  }

  render(): ReactElement {
    const { className } = this.props;
    const { paymentAmount, extensionAmount, closingAmount } = this.props;

    return (
      <div className={classNames(style.actions, className)}>
        <label className={style.amount}>
          <p className={style.amountText}>Thanh Toán</p>
          <WithTracking
            id={`Actions-${AbstractRoles.input}-${INPUT_TYPE.NUMBER}-${FIELD_NAME.PAYMENT_AMOUNT}`}
            events={[
              EFocusEvents.FOCUS,
              EFocusEvents.BLUR,
              EKeyboardEvents.KEY_UP,
            ]}
          >
            <input
              required
              name={FIELD_NAME.PAYMENT_AMOUNT}
              type={INPUT_TYPE.NUMBER}
              className={style.input}
              value={paymentAmount}
              onChange={this.onChangeHandler}
              placeholder={'Thanh Toán'}
              role={AbstractRoles.input}
            />
          </WithTracking>
        </label>
        <WithTracking
          id={`Actions-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
          events={[EMouseEvents.CLICK]}
        >
          <button
            data-amount={extensionAmount}
            type={BUTTON_TYPE.BUTTON}
            className={style.button}
            onClick={this.onClickHandler}
            disabled={!extensionAmount}
            role={WidgetRoles.button}
          >
            <p className={style.buttonText}>Số Tiền Gia Hạn Thêm</p>
            <p className={style.buttonAmount}>
              {divideDigits(extensionAmount)} {gt.gettext('Currency')}
            </p>
          </button>
        </WithTracking>
        <WithTracking
          id={`Actions-${WidgetRoles.button}-${BUTTON_TYPE.BUTTON}`}
          events={[EMouseEvents.CLICK]}
        >
          <button
            data-amount={closingAmount}
            type={BUTTON_TYPE.BUTTON}
            className={style.button}
            onClick={this.onClickHandler}
            role={WidgetRoles.button}
          >
            <p className={style.buttonText}>
              {gt.gettext('totalAmountActions')}
            </p>
            <p className={style.buttonAmount}>
              {divideDigits(closingAmount)} {gt.gettext('Currency')}
            </p>
          </button>
        </WithTracking>
      </div>
    );
  }
}
