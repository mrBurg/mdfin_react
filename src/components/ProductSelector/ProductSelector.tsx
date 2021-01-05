import React, { ReactElement, PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import moment from 'moment';

import style from './ProductSelector.module.scss';
import { WithTracking } from '@components/hocs';
import { LoanButton } from '@components/LoanButton';
import { Preloader } from '@components/Preloader';
import { SliderWidget } from '@components/widgets/SliderWidget';
import { INPUT_TYPE } from '@src/constants';
import { AbstractRoles } from '@src/roles';
import { STORE_IDS } from '@stores';
import { divideDigits, gt } from '@utils';
import { TProductSelectorProps } from './@types';
import { sliderAmountProps, sliderTermProps } from './props.json';

@inject(STORE_IDS.PAGE_STORE, STORE_IDS.LOAN_STORE, STORE_IDS.USER_STORE)
@observer
export class ProductSelector extends PureComponent<TProductSelectorProps> {
  componentDidMount(): void {
    const { loanStore, userStore } = this.props;

    //надо переписать ключи продукта (которые в файле props.json) в sliderAmountProps из текущего продукта

    if (loanStore && userStore) {
      userStore.fetchWithAuth(async () => {
        await loanStore.getProduct();
        await this.calculate();
        loanStore.initProductSelectorForm();
      }, false);
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

    if (loanStore && userStore) {
      const { productSelectorFormStatic } = loanStore;

      const isRenderNotification =
        !userStore.userLoggedIn &&
        (loanStore.loanData.amount >
          loanStore.currentProductParams.defaultAmount ||
          loanStore.loanData.term > loanStore.currentProductParams.defaultTerm);

      if (isRenderNotification && productSelectorFormStatic) {
        const { notification } = productSelectorFormStatic;

        return (
          <div className={style.notification}>
            <span>{notification}</span>
          </div>
        );
      }
    }

    return null;
  }

  public render(): ReactElement | null {
    const { loanStore, userStore, className } = this.props;

    if (loanStore && userStore) {
      const { productSelectorFormStatic, loanData } = loanStore;

      if (productSelectorFormStatic && loanData) {
        const { amount, term, totalAmount, dateTo } = loanData;
        const {
          loanAmountText,
          totalAmountText,
          loanTermText,
          termsAndCondition,
          signIn,
          registerLoan,
          paymentDateText,
        } = productSelectorFormStatic;

        return (
          <div className={classNames(style.productSelector, className)}>
            <div className={classNames(style.item, style.calculator)}>
              <div className={style.sliderContainer}>
                <div className={style.sliderPanel}>
                  <div className={style.sliderOutput}>
                    <span>{loanAmountText}</span>
                    {/* <InputWidget
                      name='amount'
                      value={amount}
                      className={style.sliderInputWidget}
                      inputClassName={style.input}
                      symbolClassName={style.symbol}
                      symbol={gt.gettext('Currency')}
                      type={INPUT_TYPE.TEL}
                      transformer={divideDigits}
                      onChange={(event) => {
                        // console.info(data);
                        // console.info(event.target.value);
                        console.info(event, 'event');
                        console.info(this, 'this');
                      }}
                    /> */}

                    <WithTracking
                      id={`ProductSelector-${AbstractRoles.input}-${INPUT_TYPE.TEXT}`}
                      events={[]}
                    >
                      <input
                        name="amount"
                        value={`${divideDigits(amount)} ${gt.gettext(
                          'Currency'
                        )}`}
                        className={style.sliderInput}
                        type={INPUT_TYPE.TEXT}
                        role={AbstractRoles.input}
                        readOnly
                      />
                    </WithTracking>
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
                    <span>{loanTermText}</span>
                    <WithTracking
                      id={`ProductSelector-${AbstractRoles.input}-${INPUT_TYPE.TEXT}`}
                      events={[]}
                    >
                      <input
                        name="term"
                        value={`${term} ${gt.ngettext('Day', 'Days', term)}`}
                        className={style.sliderInput}
                        type={INPUT_TYPE.TEXT}
                        role={AbstractRoles.input}
                        readOnly
                      />
                    </WithTracking>
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
              <h2 className={style.loanTitle}>{termsAndCondition}</h2>
              <table className={style.loanInfo}>
                <tbody>
                  <tr>
                    <td>{loanAmountText}</td>
                    <td className={style.loanInfoValue}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${divideDigits(amount!)} ${gt.gettext(
                            'Currency'
                          )}`,
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>{totalAmountText}</td>
                    <td className={style.loanInfoValue}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${divideDigits(totalAmount!)} ${gt.gettext(
                            'Currency'
                          )}`,
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>{paymentDateText}</td>
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
                    ? gt.gettext(signIn)
                    : gt.gettext(registerLoan)
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
