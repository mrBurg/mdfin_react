import { ReactElement, PureComponent } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

import style from './Repayment.module.scss';

import { TOnSubmitHandler } from '../../interfaces';
import { STORE_IDS } from '../../stores';
import { Actions } from '../Actions';
import { TRepaymentProps, TState } from './@types';
import { DealInfo } from '../DealInfo';
import { Preloader } from '../Preloader';

@inject(STORE_IDS.REPAYMENT_STORE)
@observer
export class Repayment extends PureComponent<TRepaymentProps> {
  public readonly state: TState = {
    isRender: false,
  };

  /* componentDidMount() {
    const { repaymentStore } = this.props;

    if (repaymentStore) {
      repaymentStore.getCabinetDeal().then(() => {  //эта инфа, теперь грузится уровнем выше.
        this.setState({
          isRender: true,
        });
      });
    }
  } */

  private onSubmitHandler: TOnSubmitHandler = (event): void => {
    event.preventDefault();

    const { repaymentStore } = this.props;

    if (repaymentStore) {
      repaymentStore.updatePaymentState(false);
    }
  };

  private renderDealInfo(): ReactElement | null {
    const dealInfo = this.props.repaymentStore.cabinetDeal.dealInfo;

    if (dealInfo) {
      const { dealNo, maskedName, closingDate } = dealInfo;

      const paramsData = [
        { text: 'loanAgreement', value: dealNo },
        { text: 'maskedName', value: maskedName },
        { text: 'dateTo', value: closingDate },
      ];

      return (
        <DealInfo
          className={style.item}
          title={'Về Khoản Vay'}
          params={paramsData}
        />
      );
    }

    return null;
  }

  render(): ReactElement | null {
    //const { isRender } = this.state;
    const {
      className,
      repaymentStore: {
        cabinetDeal: { dealInfo },
      },
    } = this.props;

    if (/* isRender && */ dealInfo) {
      const { paymentAmount, extensionAmount, closingAmount } = dealInfo;
      const actionProps = { paymentAmount, extensionAmount, closingAmount };

      return (
        <form
          onSubmit={this.onSubmitHandler}
          className={classNames(className, style.repayment)}
        >
          {this.renderDealInfo()}

          <Actions
            className={classNames(style.item, style.actions)}
            {...actionProps}
            isCabinet={false}
          />
        </form>
      );
    }
    return <Preloader />;
  }
}
