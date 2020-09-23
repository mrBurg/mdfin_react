import React, { PureComponent, ReactElement } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import style from './Deal.module.scss';

import { Actions } from '../Actions';
import { LoanInfo } from '../LoanInfo';
import { BUTTON_TYPE } from '../../constants';
import { TState, TDeal } from './@types';
import { Preloader } from '../Preloader';

@observer
export class Deal extends PureComponent<TDeal> {
  public readonly state: TState = {
    isRender: false,
  };

  componentDidMount() {
    const { userStore, loanStore } = this.props;

    userStore.fetchWithAuth(async () => {
      await this.refreshView();
      await loanStore.getCabinetDeals();

      this.setState({
        isRender: true,
      });
    });
  }

  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) userStore.getClientNextStep();
  }

  private renderLoanInfo(): ReactElement | null {
    const dealInfo = this.props.loanStore.cabinetDeals.dealInfos[0];

    if (dealInfo) {
      const {
        closingDate,
        lastPaymentDate,
        lastPaymentAmount,
        dealNo,
        documentUnits,
      } = dealInfo;

      const paramsData = [
        { text: 'dateTo', value: closingDate },
        {
          text: 'lastPaymentDate',
          value: lastPaymentDate,
        },
        { text: 'lastPaymentAmount', value: lastPaymentAmount },
        {
          text: 'dealNo',
          value: dealNo,
          link: !!_.size(documentUnits![0].documents)
            ? documentUnits![0].documents[0].url
            : '#',
        },
      ];

      return (
        <LoanInfo
          className={style.item}
          title={'Thông Tin về Khoản Vay'}
          params={paramsData}
        />
      );
    }

    return null;
  }

  private cabinetPay = (): void => {
    const { loanStore } = this.props;
    const dealInfo = this.props.loanStore.cabinetDeals.dealInfos[0];

    if (dealInfo) {
      const dealPay = {
        dealNo: dealInfo.dealNo,
        paymentAmount: dealInfo.paymentAmount,
        inCabinet: true,
      };

      loanStore.cabinetPay(dealPay);
    }
  };

  public render(): ReactElement | null {
    const { isRender } = this.state;

    const {
      loanStore: {
        cabinetDeals: { dealInfos },
      },
    } = this.props;

    if (isRender && !!_.size(dealInfos)) {
      const { paymentAmount, extensionAmount, closingAmount } = dealInfos[0];
      const actionProps = { paymentAmount, extensionAmount, closingAmount };

      return (
        <div className={style.deal}>
          <div className={style.content}>
            <div className={style.actions}>
              <Actions
                className={style.item}
                {...actionProps}
                isCabinet={true}
              />
              <button
                type={BUTTON_TYPE.BUTTON}
                className={style.button}
                onClick={this.cabinetPay}
              >
                Thanh Toán
              </button>
            </div>
            {this.renderLoanInfo()}
          </div>
        </div>
      );
    }

    return <Preloader />;
  }
}
