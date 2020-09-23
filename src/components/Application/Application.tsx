import React, { PureComponent, ReactElement } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import style from './Application.module.scss';

import { SelectWidget } from '../widgets/SelectWidget';
import { LoanInfo } from '../LoanInfo';
import { Otp } from '../Otp';
import { URIS_SUFFIX, FIELD_NAME } from '../../constants';
import { TState, TApplication, TDataRow } from './@types';
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
    const { userStore, pageStore, loanStore } = this.props;

    userStore.fetchWithAuth(async () => {
      await loanStore.getCabinetApplication();

      pageStore.getDirectory(DIRECTORIES.dirDeclinedByClientReason);
      this.setState({
        isRender: true,
      });
    });
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
    const {
      pageStore: {
        dirDeclinedByClientReason,
        pageData: { reasonsRefuseTitle, refuse },
      },
    } = this.props;
    const { isRefuse } = this.state;

    if (isRefuse)
      return (
        <SelectWidget
          name={FIELD_NAME.REASON_ID}
          className={style.refuseSelect}
          placeholder={reasonsRefuseTitle}
          options={dirDeclinedByClientReason}
          onChange={this.handleChangeSelectDecline}
        />
      );

    return (
      <a className={style.refuse} onClick={this.setRefuse}>
        {refuse}
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
      pageStore: { pageData },
    } = this.props;

    if (application && pageData) {
      const { creditParams, appnum } = application;
      const { loanInfoTitle, loanInfoFields } = pageData;

      const paramsData: Array<TDataRow> = _.map(creditParams, (item, key) => {
        return {
          text: loanInfoFields[key],
          value: item,
        };
      }).filter((item) => item.text);

      paramsData.push({
        text: loanInfoFields.appnum,
        value: appnum,
        link: cabinetApplication.documentUnits![0].documents![0].url,
      });

      return (
        <LoanInfo
          className={style.info}
          title={loanInfoTitle}
          params={paramsData}
        />
      );
    }

    return null;
  }

  public render(): ReactElement | null {
    const {
      loanStore: { cabinetApplication },
      pageStore: { pageData },
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
                <span
                  dangerouslySetInnerHTML={{
                    __html: pageData.acceptTermsNotification,
                  }}
                />
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
