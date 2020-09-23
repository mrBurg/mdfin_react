import Router from 'next/router';
import { observable, runInAction, action, computed } from 'mobx';
import _ from 'lodash';

import { LoanApi } from '../apis';
import { URIS, URLS } from '../routes';
import { TJSON } from '../interfaces';
import {
  TLoanData,
  TProductSelectorData,
  TCabinetApplication,
  TCabinetNotify,
  TReasonId,
  TCabinetDeals,
  TAccount,
  TUpdateAccountProps,
  TCabinetPay,
  TNotificationIds,
  TProductParams,
} from './@types/loanStore';

import { OTP_ACTION, FIELD_NAME } from '../constants';
import { OtpStore } from './OtpStore';

export class LoanStore {
  /** Параметры продукта */
  @observable public currentProductParams: TProductParams = {
    id: 0,
    minTerm: 0,
    maxTerm: 0,
    termStep: 0,
    termFraction: '',
    minAmount: 0,
    maxAmount: 0,
    amountStep: 0,
    currency: '',
    defaultAmount: 0,
    defaultTerm: 0,
  };

  /** Параметры калькулятора */
  @observable public loanData: TLoanData = {
    productId: 0,
    amount: 0,
    term: 0,
  };
  @observable public cabinetApplication: TCabinetApplication = {};
  @observable public cabinetNotify: Array<TCabinetNotify> = [];
  @observable public account: TAccount = {
    [FIELD_NAME.ACCOUNT_NUMBER]: '',
  };

  public docsValid: boolean = false;
  @observable public cabinetDeals: TCabinetDeals = { dealInfos: [] };

  constructor(private loanApi: LoanApi) {}

  /** Калькулятор: изменить сумму */
  @action
  public updateAmmount(value: number) {
    this.loanData.amount = value;
  }

  //Калькулятор: изменить срок
  @action
  public updateTerm(value: number) {
    this.loanData.term = value;
  }

  @action
  public addOptionToAccountList({ account_id, accountNumber }: TAccount) {
    if (this.cabinetApplication.accountUnit) {
      this.cabinetApplication.accountUnit.accounts.push({
        accountNumber,
        account_id,
      });
    }
  }

  @action
  public resetAccount(): void {
    this.account = {
      accountNumber: '',
    };
  }

  @action
  public updateAccount({ name, value }: TUpdateAccountProps) {
    this.account = {
      ...this.account,
      [name]: value,
    };
  }

  @action
  public updatePaymentAmount(value: number) {
    this.cabinetDeals.dealInfos[0].paymentAmount = value;
  }

  public async addAccount(account: TAccount) {
    let requestConfig = this.loanApi.postHeaderRequestConfig(URIS.account, {
      account: {
        ...account,
      },
    });

    return await this.loanApi.processData(requestConfig);
  }
  public async cabinetChangeAccount(account: TAccount) {
    let requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_CHANGE_ACCOUNT,
      {
        account: {
          ...account,
        },
      }
    );

    return await this.loanApi.processData(requestConfig);
  }

  /** Получить продукт */
  public async getProduct(): Promise<void> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.GET_PRODUCTS
    );

    const response = await this.loanApi.getProducts(requestConfig);

    if (response) {
      const productParams: TProductParams = response.products[0];

      runInAction(() => {
        this.currentProductParams = {
          ...this.currentProductParams,
          ...productParams,
        };

        this.loanData.productId = productParams.id;
        this.loanData.amount = productParams.defaultAmount;
        this.loanData.term = productParams.defaultTerm;
      });
    }
  }

  public async calculate(loanData: TProductSelectorData): Promise<void> {
    const requestConfig = this.loanApi.postRequestConfig(
      URIS.CALCULATE,
      loanData
    );

    const response = await this.loanApi.calculate(requestConfig);

    if (response) {
      const { creditParams } = response;

      runInAction(() => {
        this.loanData = {
          ...loanData,
          ...creditParams,
        };
      });
    }
  }

  public async getLoan(): Promise<void | boolean> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.WIZARD_START,
      this.loanData
    );

    const response = await this.loanApi.wizardStart(requestConfig);

    if (response && response.view) {
      let { view } = response;

      return Router.push((URLS as TJSON)[view]);
    }
  }

  //После визарда, берем либо документы, либо заявку, либо статус заявки (текстовку нотификации), либо...
  public async getCabinetApplication(): Promise<void | boolean> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.application,
      this.loanData
    );

    const response = await this.loanApi.processData(requestConfig);
    if (response) this.updateStore_Application(response);
  }

  @action
  public updateStore_Application(cabinetApplication: TCabinetApplication) {
    this.cabinetApplication = {
      ...this.cabinetApplication,
      ...cabinetApplication,
    };
  }

  //Сделка из ЛК
  public async getCabinetDeals(): Promise<void | boolean> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.deals,
      this.loanData
    );

    const response = await this.loanApi.processData(requestConfig);
    if (response) this.updateStore_Deals(response);
  }

  @action
  public async updateStore_Deals(cabinetDeals: TCabinetDeals) {
    this.cabinetDeals = {
      ...this.cabinetDeals,
      ...cabinetDeals,
    };
  }

  public async uploadAttachment(files: FileList, type: string) {
    const formData = new FormData();

    _.map(files, (item) => {
      formData.append('file', item);
      formData.append('type_id', type);
    });

    let requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.UPLOAD_ATTACHMENT,
      formData
    );

    const response = await this.loanApi.uploadAttachment(requestConfig);

    if (response) {
      runInAction(() => {
        this.updateStore_Application({
          ...this.cabinetApplication,
          ...response,
        });
      });
    }
  }

  public async getNotify(): Promise<void> {
    const requestConfig = this.loanApi.getHeaderRequestConfig(
      URIS.notify,
      this.loanData
    );

    const response = await this.loanApi.processData(requestConfig);
    if (response) {
      const { notifications } = response;
      this.updateStore_Notify(notifications);
    }
  }

  @action
  public updateStore_Notify(cabinetNotify?: Array<TCabinetNotify>) {
    this.cabinetNotify = cabinetNotify!;
  }

  //Подтвердить показ нотификации клиенту
  public async confirmDisplay(notificationIds: TNotificationIds) {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.notify_Confirm_Display,
      notificationIds
    );

    this.loanApi.processData(requestConfig);
  }

  //погашение из ЛК (и сайта?)
  public async cabinetPay(dealPay: TCabinetPay) {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_PAY,
      dealPay
    );

    const response = await this.loanApi.cabinetPay(requestConfig);

    if (response) {
      const { redirectUrl } = response;

      if (redirectUrl) {
        return window.location.replace(redirectUrl);
      }
    }
  }

  // Подписываем заявку
  public async cabinetSign(account: any, otpStore: OtpStore) {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_SIGN,
      account
    );

    const otpData = await this.loanApi.cabinetSign(requestConfig);

    const { otpId } = otpData;
    console.log(otpId);

    if (!!~otpId) {
      //const { phoneNumber } = userData;
      const action = OTP_ACTION.SIGN;

      otpStore.updateOtpState({ action, otpId /* phoneNumber, */ });
    }
  }

  // Отказ Клиента от заявки
  public async cabinetDecline(userDeclineReason: TReasonId) {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_DECLINE,
      userDeclineReason
    );

    const status = await this.loanApi.cabinetDecline(requestConfig);

    console.log(status);
  }

  @computed
  public get getDocsValid(): boolean {
    const { documentUnits } = this.cabinetApplication;

    if (!documentUnits) return this.docsValid;

    this.docsValid = true;

    _.map(documentUnits, (item) => {
      if (!item.valid) return (this.docsValid = false);
    });

    return this.docsValid;
  }
}
