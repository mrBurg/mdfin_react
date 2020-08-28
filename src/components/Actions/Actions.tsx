import { Component, ReactElement } from 'react';
import classNames from 'classnames';

import style from './Actions.module.scss';

import { BUTTON_TYPE, INPUT_TYPE, FIELD_NAME } from '../../constants';
import { gt, divideDigits } from '../../utils';
import { TOnInputChangeHandler, TOnClickHandler } from '../../interfaces';
import { TActionsProps, TActionsState } from './@types';

export class Actions extends Component<TActionsProps> {
  public readonly state: TActionsState = {
    amount: '',
    extensionAmount: 0,
    closingAmount: 0,
  };

  static getDerivedStateFromProps(
    props: TActionsProps,
    state: TActionsState
  ): TActionsState | null {
    if (
      props.extensionAmount !== state.extensionAmount ||
      state.closingAmount !== state.closingAmount
    ) {
      return {
        amount: props.amount,
        extensionAmount: props.extensionAmount,
        closingAmount: props.closingAmount,
      };
    }

    return null;
  }

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { name, value },
  }): void => {
    this.setState((state: TActionsState) => {
      return {
        ...state,
        [name]: value,
      };
    });
  };

  private onClickHandler: TOnClickHandler = ({
    currentTarget: {
      dataset: { amount },
    },
  }) => {
    this.setState((state: TActionsState) => {
      return {
        ...state,
        [FIELD_NAME.AMOUNT]: amount,
      };
    });
  };

  render(): ReactElement {
    const { className } = this.props;
    const { amount, extensionAmount, closingAmount } = this.state;

    return (
      <div className={classNames(className, style.actions)}>
        <div className={style.label}>
          <span>Thanh Toán</span>
          <input
            required
            name={FIELD_NAME.AMOUNT}
            type={INPUT_TYPE.TEL}
            className={style.input}
            value={amount}
            onChange={this.onChangeHandler}
            placeholder={'placeholder'}
          />
        </div>
        <button
          data-amount={extensionAmount}
          type={BUTTON_TYPE.BUTTON}
          className={style.button}
          onClick={this.onClickHandler}
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
