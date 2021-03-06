import React, { ReactElement, Fragment, PureComponent } from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './DealInfo.module.scss';
import { FieldDataConverter } from '@components/hocs';
import { BUTTON_TYPE } from '@src/constants';
import { STORE_IDS } from '@stores';
import { TDealInfoProps } from './@types';
import { gt } from '@utils';

@inject(STORE_IDS.LOAN_STORE, STORE_IDS.REPAYMENT_STORE)
@observer
export class DealInfo extends PureComponent<TDealInfoProps> {
  private cabinetPay = (): void => {
    const { loanStore, repaymentStore } = this.props;

    if (loanStore && repaymentStore) {
      const dealInfo = repaymentStore.cabinetDeal.dealInfo;

      if (dealInfo) {
        const dealPay = {
          dealNo: dealInfo.dealNo,
          paymentAmount: dealInfo.paymentAmount,
          inCabinet: false,
        };

        loanStore.cabinetPay(dealPay);
      }
    }
  };

  public render(): ReactElement {
    const { className, title, params } = this.props;

    return (
      <div className={classNames(style.dealInfo, className)}>
        <table className={style.datatable}>
          <thead>
            <tr>
              <th colSpan={2}>{title}</th>
            </tr>
          </thead>
          <tbody>
            {_.map(params, (item, key) => {
              const { text, value, link } = item;
              if (!value) return;

              return (
                <Fragment key={key}>
                  <tr>
                    <td>{gt.gettext(text)}</td>
                    <td>
                      {link ? (
                        <a href={link} className={style.link}>
                          {value}
                        </a>
                      ) : (
                        <FieldDataConverter type={text} value={value} />
                      )}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>

        <button
          type={BUTTON_TYPE.BUTTON}
          className={style.button}
          onClick={this.cabinetPay}
        >
          Thanh Toán
        </button>
      </div>
    );
  }
}
