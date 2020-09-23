import { ReactElement, PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import moment from 'moment';

import style from './ProductSelector.module.scss';

import { LoanButton } from '../LoanButton';
import { gt, divideDigits } from '../../utils';
import { SliderWidget } from '../widgets/SliderWidget';
import { sliderAmountProps, sliderTermProps } from './props.json';
import { INPUT_TYPE } from '../../constants';
import { STORE_IDS } from '../../stores';
import { TProductSelectorProps } from './@types';
import { Preloader } from '../Preloader';

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.LOAN_STORE, STORE_IDS.USER_STORE)
@observer
export class ProductSelector extends PureComponent<TProductSelectorProps> {
  public readonly state: any = {
    isRender: false,
  };

  componentDidMount() {
    const { loanStore, userStore } = this.props;

    //console.log(toJS(sliderAmountProps));
    //надо переписать ключи продукта (которые в файле props.json) в sliderAmountProps из текущего продукта

    if (loanStore && userStore) {
      userStore.fetchWithAuth(async () => {
        await loanStore.getProduct();
        await this.calculate();
        this.setState({
          isRender: true,
        });
      });
    }
  }

  private async calculate() {
    const { loanStore } = this.props;

    if (loanStore) {
      const { productId, amount, term } = loanStore.loanData;

      await loanStore.calculate({ productId, amount, term });
    }
  }

  private handleAmountChange = async (
    amount: number,
    calc: boolean
  ): Promise<void> => {
    const { loanStore } = this.props;
    if (loanStore) {
      loanStore.updateAmmount(amount);
    }

    if (calc) this.calculate();
  };

  private handleTermChange = async (
    term: number,
    calc: boolean
  ): Promise<void> => {
    const { loanStore } = this.props;

    if (loanStore) {
      loanStore.updateTerm(term);
    }
    if (calc) this.calculate();
  };

  private renderNotification(): ReactElement | null {
    const { loanStore, userStore } = this.props;

    let isRenderNotification = false;
    if (loanStore && userStore) {
      isRenderNotification =
        !userStore.userLoggedIn &&
        (loanStore.loanData.amount >
          loanStore.currentProductParams.defaultAmount ||
          loanStore.loanData.term > loanStore.currentProductParams.defaultTerm);
    }

    if (isRenderNotification) {
      return (
        <div className={style.notification}>
          <span>
            Nếu bạn là khách hàng hiện hữu, Vui lòng đăng nhập vào Tài Khoản Cá
            Nhân
          </span>
        </div>
      );
    }
    return null;
  }

  public render(): ReactElement | null {
    const { loanStore, userStore, className } = this.props;
    const { isRender } = this.state;

    if (loanStore && userStore) {
      const { amount, term } = loanStore.loanData;
      const { totalAmount, dateTo } = loanStore.loanData;

      if (isRender && loanStore.loanData) {
        return (
          <div className={classNames(style.productSelector, className)}>
            <div className={classNames(style.item, style.calculator)}>
              <div className={style.sliderContainer}>
                <div className={style.sliderPanel}>
                  <div className={style.sliderOutput}>
                    <span>Số Tiền Cần Va"</span>
                    <input
                      name='amount'
                      value={divideDigits(amount)}
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
                    <span>Ngày</span>
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
                      {divideDigits(amount!)} {gt.gettext('Currency')}
                    </td>
                  </tr>
                  <tr>
                    <td>Tổng Tiền Cần Thanh Toán</td>
                    <td className={style.loanInfoValue}>
                      {divideDigits(totalAmount!)} {gt.gettext('Currency')}
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

              {this.renderNotification()}

              <LoanButton
                className={style.loanButton}
                label={
                  !userStore?.userLoggedIn &&
                  (loanStore?.loanData.amount! >
                    loanStore.currentProductParams.defaultAmount ||
                    loanStore?.loanData.term! >
                      loanStore.currentProductParams.defaultTerm)
                    ? gt.gettext('Sign In')
                    : gt.gettext('Register Loan')
                }
              />
            </div>
          </div>
        );
      }
    }

    return <Preloader />;
  }
}
