import React, { PureComponent, ReactElement } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import style from './Deal.module.scss';

import { TComponenProps } from '../../interfaces';
import { gt } from '../../utils';
import { Actions } from '../Actions';
import { LoanInfo } from '../LoanInfo';
import { BUTTON_TYPE } from '../../constants';

@observer
export class Deal extends PureComponent<TComponenProps> {
  public render(): ReactElement {
    const actionsState = {
      amount: '222',
      extensionAmount: 33333,
      closingAmount: 444444.44,
    };

    return (
      <div className={style.deal}>
        <div className={style.content}>
          <LoanInfo
            className={style.item}
            title={'Thông Tin về Khoản Vay'}
            tableData={[
              {
                text: 'Ngày đến hạn thanh toán',
                value: `75 000 ${gt.gettext('Currency')}`,
              },
              {
                text: 'Kỳ Hạn',
                value: '6 ngày',
              },
              {
                text: 'Khoản tiền thanh toán',
                value: `7 500 ${gt.gettext('Currency')}`,
              },
              {
                text: 'Số Tiền Gia Hạn Thêm',
                value: `17 500 ${gt.gettext('Currency')}`,
              },
              {
                text: 'Những Thỏa Thuận',
                value: 'CZ0000-T000',
                link: '#',
              },
            ]}
          />
          <div className={style.actions}>
            <Actions className={style.item} {...actionsState} />
            <button type={BUTTON_TYPE.BUTTON} className={style.button}>
              Thanh Toán
            </button>
          </div>
        </div>
      </div>
    );
  }
}
