import React, { PureComponent, ReactElement } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import style from './Application.module.scss';

import { SelectWidget } from '../widgets/SelectWidget';
import { LoanInfo } from '../LoanInfo';
import { Otp } from '../Otp';
import { URIS_SUFFIX, FIELD_NAME } from '../../constants';
import { TState, TApplication } from './@types';
import { DIRECTORIES } from '../../routes';
import { Preloader } from '../Preloader';
import { Accounts } from '../Accounts';

@observer
export class Application extends PureComponent<TApplication> {
  public readonly state: TState = {
    isRender: false,
    isRefuse: false,
    userDeclineReason: {},
  };

  componentDidMount() {
    const { pageStore, loanStore } = this.props;

    if (loanStore && pageStore) {
      Promise.all([
        loanStore.getCabinetApplication(),
        pageStore.getDirectory(DIRECTORIES.dirDeclinedByClientReason),
      ]).then(() => {
        this.setState({
          isRender: true,
        });
      });
    }
  }

  // блок банковских счетов
  private renderAccounts(): ReactElement | null {
    const {
      loanStore: {
        cabinetApplication: { accountUnit },
      },
    } = this.props;

    if (accountUnit)
      return <Accounts className={style.accounts} {...accountUnit} />;

    return null;
  }

  // блок ОТП
  private renderOtp(): ReactElement {
    const { otpStore } = this.props;

    if (otpStore.otpReady)
      return (
        <Otp
          className={style.otp}
          action={() => {
            otpStore.cabinetConfirm();
          }}
          page={URIS_SUFFIX.APPLICATION}
          {...this.props}
        />
      );

    return (
      <button className={style.otpButton} onClick={this.cabinetSign}>
        Tôi Ký Xác Nhận
      </button>
    );
  }

  private cabinetSign = (): void => {
    const { loanStore, otpStore } = this.props;
    const account = { account: { ...loanStore.account } };

    loanStore.cabinetSign(account, otpStore);
  };

  //Клиент нажал линк "отказаться"
  private renderRefuse(): ReactElement {
    const { pageStore } = this.props;
    const { isRefuse } = this.state;

    if (isRefuse && pageStore)
      return (
        <SelectWidget
          name={FIELD_NAME.REASON_ID}
          className={style.refuseSelect}
          placeholder={'Lý Do Từ Chối'}
          options={pageStore.dirDeclinedByClientReason}
          onChange={this.handleChangeSelectDecline}
        />
      );

    return (
      <a className={style.refuse} onClick={this.setRefuse}>
        Tôi Từ Chối
      </a>
    );
  }

  private handleChangeSelectDecline = (_event: any, data: any) => {
    new Promise((resolve) => {
      resolve(
        this.setState(
          (state: TState): TState => {
            return {
              ...state,
              userDeclineReason: {
                reason_id: data.value,
              },
            };
          }
        )
      );
    }).then(() => {
      this.cabinetDecline();
    });
  };

  private async cabinetDecline() {
    const { loanStore, userStore } = this.props;

    if (loanStore && userStore) {
      const userDeclineReason = this.state.userDeclineReason;

      await loanStore.cabinetDecline(userDeclineReason);
      userStore.getClientNextStep();
    }
  }

  private setRefuse = (): void => {
    this.setState((state: TState) => {
      return {
        ...state,
        isRefuse: true,
      };
    });
  };

  private renderLoanInfo(): ReactElement | null {
    const {
      loanStore: {
        cabinetApplication,
        cabinetApplication: { application },
      },
    } = this.props;

    if (application) {
      const {
        creditParams: { amount, term, totalAmount, extensionAmount, dateTo },
        appnum,
      } = application;

      const paramsData = [
        { text: 'amount', value: amount },
        { text: 'term', value: term },
        { text: 'totalAmount', value: totalAmount },
        { text: 'extensionAmount', value: extensionAmount },
        {
          text: 'dateTo',
          value: dateTo,
        },
        {
          text: 'appnum',
          value: appnum,
          link: cabinetApplication.documentUnits![0].documents![0].url,
        },
      ];

      return (
        <LoanInfo
          className={style.info}
          title={'Thông Tin về Khoản Vay'}
          params={paramsData}
        />
      );
    }

    return null;
  }

  public render(): ReactElement | null {
    const {
      loanStore: { cabinetApplication },
    } = this.props;
    const { isRender } = this.state;

    if (isRender && cabinetApplication) {
      return (
        <div className={style.application}>
          <h2
            className={style.title}
            dangerouslySetInnerHTML={{
              __html: cabinetApplication.notification || '',
            }}
          />

          <div className={style.content}>
            <div className={style.actions}>
              {this.renderAccounts()}
              <div className={style.links}>
                Tôi Chấp Nhận Các Điều Kiện và Điều Khoản của Khoản Vay và Ký
                Hợp Đồng Vay
              </div>
              {this.renderOtp()}
              {this.renderRefuse()}
            </div>
            {this.renderLoanInfo()}
          </div>
        </div>
      );
    }

    return <Preloader />;
  }
}
