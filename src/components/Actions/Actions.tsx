import { PureComponent, ReactElement } from 'react';
import classNames from 'classnames';
import { observer, inject } from 'mobx-react';

import style from './Actions.module.scss';

import { BUTTON_TYPE, INPUT_TYPE, FIELD_NAME } from '../../constants';
import { gt, divideDigits } from '../../utils';
import { TOnInputChangeHandler, TOnClickHandler } from '../../interfaces';
import { TActionsProps } from './@types';
import { STORE_IDS } from '../../stores';

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
      <div className={classNames(className, style.actions)}>
        <label className={style.amount}>
          <p className={style.amountText}>Thanh Toán</p>
          <input
            required
            name={FIELD_NAME.PAYMENT_AMOUNT}
            type={INPUT_TYPE.NUMBER}
            className={style.input}
            value={paymentAmount}
            onChange={this.onChangeHandler}
            placeholder={'Thanh Toán'}
          />
        </label>
        <button
          data-amount={extensionAmount}
          type={BUTTON_TYPE.BUTTON}
          className={style.button}
          onClick={this.onClickHandler}
          disabled={!extensionAmount}
        >
          <p className={style.buttonText}>Số Tiền Gia Hạn Thêm</p>
          <p className={style.buttonAmount}>
            {divideDigits(extensionAmount)} {gt.gettext('Currency')}
          </p>
        </button>
        <button
          data-amount={closingAmount}
          type={BUTTON_TYPE.BUTTON}
          className={style.button}
          onClick={this.onClickHandler}
        >
          <p className={style.buttonText}>Tổng Số Tiền</p>
          <p className={style.buttonAmount}>
            {divideDigits(closingAmount)} {gt.gettext('Currency')}
          </p>
        </button>
      </div>
    );
  }
}
