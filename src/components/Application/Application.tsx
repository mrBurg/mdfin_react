import React, { PureComponent, ReactElement } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import classNames from 'classnames';

import style from './Application.module.scss';
import { AccountsForm } from '@components/AccountsForm';
import { WithTracking, WithTag, WithDangerousHTML } from '@components/hocs';
import { LoanInfo } from '@components/LoanInfo';
import { TDataRow } from '@components/LoanInfo/@types';
import { Otp } from '@components/Otp';
import { Preloader } from '@components/Preloader';
import { ReactSelectWidget } from '@components/widgets/ReactSelectWidget';
import { TSelectData } from '@components/widgets/ReactSelectWidget/@types';
import { TJSON } from '@interfaces';
import { DIRECTORIES } from '@routes';
import {
  URIS_SUFFIX,
  BUTTON_TYPE,
  FIELD_NAME,
  dynamicTagslist,
} from '@src/constants';
import { WidgetRoles } from '@src/roles';
import { EMouseEvents } from '@src/trackingConstants';
import { TApplication, TState } from './@types';
import { handleErrors } from '@utils';

@observer
export class Application extends PureComponent<TApplication> {
  public readonly state: TState = {
    isRender: false,
    isRefuse: false,
    userDeclineReason: {},
  };

  componentDidMount(): void {
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

    if (!accountUnit) return null;

    return <AccountsForm className={style.accounts} {...accountUnit} />;
  }

  // блок ОТП
  private renderOtp(): ReactElement {
    const {
      otpStore,
      loanStore: {
        cabinetApplication: { accountUnit },
      },
      pageStore: {
        pageData: { signCertificate },
      },
    } = this.props;

    if (otpStore.otpReady)
      return (
        <Otp
          className={style.otp}
          action={() => {
            otpStore.cabinetConfirm();
          }}
          page={URIS_SUFFIX.APPLICATION}
        />
      );

    return (
      <WithTracking
        id={`Application-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
        events={[EMouseEvents.CLICK]}
      >
        <button
          role={WidgetRoles.button}
          className={style.otpButton}
          type={BUTTON_TYPE.SUBMIT}
          onClick={this.cabinetSign}
          disabled={!accountUnit?.selectedAccount_id}
        >
          {signCertificate}
        </button>
      </WithTracking>
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
        <ReactSelectWidget
          name={FIELD_NAME.REASON_ID}
          className={classNames('orange', style.refuseSelect)}
          placeholder={reasonsRefuseTitle}
          options={dirDeclinedByClientReason}
          onChange={this.handleChangeSelectDecline}
        />
      );

    return (
      <WithTracking
        id={`Application-${WidgetRoles.link}-refuse`}
        events={[EMouseEvents.CLICK]}
      >
        <button
          role={WidgetRoles.button}
          className={style.refuse}
          onClick={this.setRefuse}
        >
          {refuse}
        </button>
      </WithTracking>
    );
  }

  private handleChangeSelectDecline = (data: TSelectData) => {
    if (data.value) {
      new Promise((resolve) => {
        resolve(
          this.setState(
            (state: TState): TState => {
              return {
                ...state,
                userDeclineReason: {
                  reason_id: Number(data.value),
                },
              };
            }
          )
        );
      })
        .then(() => {
          this.cabinetDecline();

          return;
        })
        .catch((err) => {
          handleErrors(err);
        });
    }
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

    const sort = [
      'amount',
      'term',
      'extensionAmount',
      'totalAmount',
      'dateTo',
      'dealNo',
      'appnum',
    ];

    if (application && pageData) {
      const { creditParams, appnum } = application;
      const { loanInfoTitle, loanInfoFields } = pageData;

      const paramsData: TDataRow[] = _.map(sort, (item) => {
        return {
          text: loanInfoFields[item],
          value: (creditParams as TJSON)[item],
        };
      });

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
          <WithTag tag={'h2'} className={style.title} tags={dynamicTagslist}>
            {cabinetApplication.notification!}
          </WithTag>

          <div className={style.content}>
            <div className={style.actions}>
              {this.renderAccounts()}
              <WithDangerousHTML className={style.links}>
                {pageData.acceptTermsNotification}
              </WithDangerousHTML>
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
