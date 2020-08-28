import React, { PureComponent, ReactElement } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import style from './Application.module.scss';

import { TComponenProps } from '../../interfaces';
import { SelectWidget } from '../widgets/SelectWidget';
import { gt } from '../../utils';
import { LoanInfo } from '../LoanInfo';
import { Otp } from '../Otp';
import { URIS_SUFFIX, BUTTON_TYPE, FIELD_NAME } from '../../constants';
import { TApplicationState } from './@types';

@observer
export class Application extends PureComponent<TComponenProps> {
  public readonly state: TApplicationState = {
    isRefuse: false,
    hasAccounts: false,
  };

  private renderAccounts(): ReactElement {
    const { hasAccounts } = this.state;

    if (hasAccounts)
      return (
        <SelectWidget
          name={FIELD_NAME.ACCOUNT_ID}
          placeholder={'Chọn Tài Khoản Ngân Hàng'}
          options={_.times(5, (index) => {
            return {
              text: String(index),
              value: `Option ${index}`,
            };
          })}
        />
      );
    return (
      <button
        type={BUTTON_TYPE.BUTTON}
        className={style.accountsButton}
        onClick={this.setAccounts}
      >
        Thanh Toán
      </button>
    );
  }

  private renderOtp(): ReactElement {
    const { otpStore } = this.props;

    if (otpStore.otpReady)
      return (
        <Otp className={style.otp} page={URIS_SUFFIX.SIGN_IN} {...this.props} />
      );

    return (
      <button className={style.otpButton} onClick={this.validateOtp}>
        Tôi Ký Xác Nhận
      </button>
    );
  }

  private renderRefuse(): ReactElement {
    const { isRefuse } = this.state;

    if (isRefuse)
      return (
        <SelectWidget
          name={FIELD_NAME.REASON_ID}
          className={style.refuseSelect}
          placeholder={'Chọn Tài Khoản Ngân Hàng'}
          options={[
            {
              text: 'Đã Vay được từ công ty khác',
              value: 0,
            },
            {
              text: 'Không thỏa mãn với số tiền được duyệt',
              value: 1,
            },
            {
              text: 'Không thích kỳ hạn vay',
              value: 2,
            },
            {
              text: 'Không thỏa mãn với lãi suất',
              value: 3,
            },
            {
              text: 'Đổi Ý không muốn vay',
              value: 4,
            },
            {
              text: 'Khác',
              value: -1,
            },
          ]}
        />
      );

    return (
      <a className={style.refuse} onClick={this.setRefuse}>
        Tôi Từ Chối
      </a>
    );
  }

  private setRefuse = (): void => {
    this.setState((state: TApplicationState) => {
      return {
        ...state,
        isRefuse: true,
      };
    });
  };

  private setAccounts = (): void => {
    this.setState((state: TApplicationState) => {
      return {
        ...state,
        hasAccounts: true,
      };
    });
  };

  private validateOtp = (): void => {
    const { otpStore } = this.props;

    otpStore.setOptReady(true);

    // otpStore.validateOtp()
  };

  public render(): ReactElement {
    return (
      <div className={style.application}>
        <h2 className={style.title}>
          Bạn được duyệt khoản vay
          <span className={style.accent}> 75 000 {gt.gettext('Currency')}</span>
          <span> thời hạn</span>
          <span className={style.accent}> 6 ngày</span>
        </h2>
        <div className={style.content}>
          <div className={style.actions}>
            {this.renderAccounts()}
            <div className={style.links}>
              <span>Tôi Chấp</span>
              <a href='#'> Nhận Các Điều Kiện và Điều Khoản của Khoản Vay</a> và
              <a href='#'> Ký Hợp Đồng Vay</a>
            </div>
            {this.renderOtp()}
            {this.renderRefuse()}
          </div>
          <LoanInfo
            className={classNames(style.info)}
            title={'Thông Tin về Khoản Vay'}
            tableData={[
              {
                text: 'Số Tiền Vay',
                value: `75 000 ${gt.gettext('Currency')}`,
              },
              {
                text: 'Kỳ Hạn',
                value: '6 ngày',
              },
              {
                text: 'Số Tiền Gia Hạn Thêm',
                value: `7 500 ${gt.gettext('Currency')}`,
              },
              {
                text: 'Khoản tiền thanh toán',
                value: `17 500 ${gt.gettext('Currency')}`,
              },
              {
                text: 'Ngày đến hạn thanh toán',
                value: moment().format('L'),
              },
              {
                text: 'Những Thỏa Thuận',
                value: 'CZ0000-T000',
                link: '/#',
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
