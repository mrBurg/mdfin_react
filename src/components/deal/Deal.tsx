import React, { PureComponent, ReactElement } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Deal.module.scss';

import { TComponenProps } from '../../interfaces';
import { SelectWidget } from '../widgets/SelectWidget';
import { gt } from '../../utils';

@observer
export class Deal extends PureComponent<TComponenProps> {
  public render(): ReactElement {
    return (
      <div className={style.deal}>
        <h2 className={style.title}>
          Bạn được duyệt khoản vay
          <span className={style.accent}> 75 000 {gt.gettext('Currency')}</span>
          <span> thời hạn</span>
          <span className={style.accent}> 6 ngày</span>
        </h2>
        <div className={style.content}>
          <div className={style.column}>
            <SelectWidget
              className={style.select}
              placeholder={'Chọn Tài Khoản Ngân Hàng'}
              options={_.times(5, (index) => {
                return {
                  text: String(index),
                  value: `Option ${index}`,
                };
              })}
            />
            <div className={style.links}>
              Tôi Chấp
              <a href='#'> Nhận Các Điều Kiện và Điều Khoản của Khoản Vay</a> và
              <a href='#'> Ký Hợp Đồng Vay</a>
            </div>
            <button className={style.button}>Tôi Ký Xác Nhận</button>
            <a href='#' className={style.reject}>
              Tôi Từ Chối
            </a>
          </div>
          <div className={classNames(style.column, style.info)}>
            <table className={style.datatable}>
              <thead>
                <tr>
                  <td colSpan={2}>Thông Tin về Khoản Vay</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ngày đến hạn thanh toán</td>
                  <td>75 000 {gt.gettext('Currency')}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <hr className={style.separator} />
                  </td>
                </tr>
                <tr>
                  <td>Kỳ Hạn</td>
                  <td>6 ngày</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <hr className={style.separator} />
                  </td>
                </tr>
                <tr>
                  <td>Khoản tiền thanh toán</td>
                  <td>7 500 {gt.gettext('Currency')}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <hr className={style.separator} />
                  </td>
                </tr>
                <tr>
                  <td>Số Tiền Gia Hạn Thêm</td>
                  <td>17 500 {gt.gettext('Currency')}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <hr className={style.separator} />
                  </td>
                </tr>
                <tr>
                  <td>Ngày đến hạn thanh toán</td>
                  <td>30/05/20</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <hr className={style.separator} />
                  </td>
                </tr>
                <tr>
                  <td>Những Thỏa Thuận</td>
                  <td className={style.dealNo}>
                    <a href='#'>CZ0000-T000</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
