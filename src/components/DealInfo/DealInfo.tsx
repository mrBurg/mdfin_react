import { FC } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

import style from './DealInfo.module.scss';

import { BUTTON_TYPE } from '../../constants';
import { gt } from '../../utils';
import { TDealInfoProps } from './@types';

export const DealInfo: FC<TDealInfoProps> = ({ className }) => {
  return (
    <div className={classNames(className, style.dealInfo)}>
      <table className={style.datatable}>
        <thead>
          <tr>
            <th colSpan={2}>Về Khoản Vay</th>
          </tr>
        </thead>
        <tbody>
          {_.map(
            [
              { text: 'Ngày đến hạn thanh toán', value: moment().format('L') },
              { text: 'Ngày thanh toán gần nhất', value: moment().format('L') },
              {
                text: 'Số tiền thanh toán lần gần nhất',
                value: `4800.0 ${gt.gettext('Currency')}`,
              },
            ],
            (item, key) => {
              const { text, value } = item;

              return (
                <tr key={key}>
                  <td>{text}</td>
                  <td>{value}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <div className={style.agreement}>
        <span>Hợp đồng Vay</span>
        <span>CZ0000-T0000</span>
      </div>
      <button type={BUTTON_TYPE.SUBMIT} className={style.button}>
        Thanh Toán
      </button>
    </div>
  );
};
