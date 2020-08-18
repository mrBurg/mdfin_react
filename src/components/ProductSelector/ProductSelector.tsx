import { ReactElement, /* ChangeEvent, */ PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import moment from 'moment';

import style from './ProductSelector.module.scss';

import LoanButton from '../LoanButton';
import { gt } from '../../utils';

import SliderWidget from '../widgets/SliderWidget';

import { sliderAmountProps, sliderTermProps } from './props.json';
import { INPUT_TYPE } from '../../constants';
import PageStore from '../../stores/PageStore';
import LoanStore, { TFormData } from '../../stores/LoanStore';
import { STORE_IDS } from '../../stores';

type TProductSelectorProps = {
  pageStore?: PageStore;
  loanStore?: LoanStore;
  className?: string;
};

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.LOAN_STORE)
@observer
export class ProductSelector extends PureComponent<TProductSelectorProps> {
  public readonly state: TFormData = {
    productId: 1,
    amount: 2000000,
    term: 20,
  };

  componentDidMount() {
    const { loanStore } = this.props;

    if (loanStore) loanStore.calculate(this.state);
  }

  private calculate() {
    const { loanStore } = this.props;

    if (loanStore) loanStore.calculate(this.state);
  }

  private handleAmountChange = async (
    amount: number,
    calc: boolean
  ): Promise<void> => {
    this.setState(
      (state: TFormData): TFormData => {
        return {
          ...state,
          amount: amount,
        };
      }
    );

    if (calc) this.calculate();
  };

  private handleTermChange = async (
    term: number,
    calc: boolean
  ): Promise<void> => {
    await this.setState(
      (state: TFormData): TFormData => {
        return {
          ...state,
          term: term,
        };
      }
    );
    if (calc) this.calculate();
  };

  public render(): ReactElement | null {
    const { amount, term } = this.state;
    const { loanStore, className } = this.props;

    if (loanStore) {
      const { totalAmount, dateTo } = loanStore.loanData;

      if (loanStore.loanData) {
        return (
          <div className={classNames(style.productSelector, className)}>
            <div className={classNames(style.item, style.calculator)}>
              <div className={style.sliderContainer}>
                <div className={style.sliderPanel}>
                  <div className={style.sliderOutput}>
                    <span>"Số Tiền Cần Vay"</span>
                    <input
                      name='amount'
                      value={amount?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                      className={style.sliderInput}
                      type={INPUT_TYPE.TEXT}
                      readOnly={true}
                    />
                  </div>
                  <SliderWidget
                    sliderValue={amount}
                    sliderProps={sliderAmountProps}
                    onValueSliderChange={this.handleAmountChange}
                    onAfterChange={this.handleAmountChange}
                  />
                </div>

                <div className={style.sliderPanel}>
                  <div className={style.sliderOutput}>
                    <span>"Ngày"</span>
                    <input
                      name='term'
                      value={term}
                      className={style.sliderInput}
                      type={INPUT_TYPE.TEXT}
                      readOnly={true}
                    />
                  </div>
                  <SliderWidget
                    sliderValue={term}
                    sliderProps={sliderTermProps}
                    onValueSliderChange={this.handleTermChange}
                    onAfterChange={this.handleTermChange}
                  />
                </div>
              </div>
            </div>
            <div className={classNames(style.item, style.loanData)}>
              <h2 className={style.loanTitle}>Điều Khoản và Điều Kiện</h2>
              <table className={style.loanInfo}>
                <tbody>
                  <tr>
                    <td>Số Tiền Cần Vay</td>
                    <td className={style.loanInfoValue}>
                      {amount} {gt.gettext('Currency')}
                    </td>
                  </tr>
                  <tr>
                    <td>Tổng Tiền Cần Thanh Toán</td>
                    <td className={style.loanInfoValue}>
                      {totalAmount?.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}{' '}
                      {gt.gettext('Currency')}
                    </td>
                  </tr>
                  <tr>
                    <td>Ngày đến hạn thanh toán</td>
                    <td className={style.loanInfoValue}>
                      {moment(dateTo).format('DD.MM.YYYY')}
                    </td>
                  </tr>
                </tbody>
              </table>

              <LoanButton className={style.loanButton} />
            </div>
          </div>
        );
      }
    }

    return null;
  }
}
