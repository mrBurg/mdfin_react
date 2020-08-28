import { ReactElement, PureComponent } from 'react';
import { observer, inject } from 'mobx-react';
import classNames from 'classnames';

import style from './Repayment.module.scss';

import { TOnSubmitHandler } from '../../interfaces';
import { STORE_IDS } from '../../stores';
import { Actions } from '../Actions';
import { TRepaymentProps } from './@types';
import { DealInfo } from '../DealInfo';

@inject(STORE_IDS.REPAYMENT_STORE)
@observer
export class Repayment extends PureComponent<TRepaymentProps> {
  private onSubmitHandler: TOnSubmitHandler = (event): void => {
    event.preventDefault();

    const { repaymentStore } = this.props;

    if (repaymentStore) {
      repaymentStore.updatePaymentState(false);
      console.info('Repayment form submitted');
    }
  };

  render(): ReactElement {
    const { className } = this.props;
    const actionsState = {
      amount: '111',
      extensionAmount: 11111,
      closingAmount: 222222.22,
    };

    return (
      <form
        onSubmit={this.onSubmitHandler}
        className={classNames(className, style.repayment)}
      >
        <DealInfo className={style.item} />
        <Actions
          className={classNames(style.item, style.actions)}
          {...actionsState}
        />
      </form>
    );
  }
}
