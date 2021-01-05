import Router from 'next/router';
import { observable, runInAction, action } from 'mobx';
import _ from 'lodash';
import { TJSON } from '@interfaces';
import { URIS, URLS } from '@routes';
import { LoanApi, fetchStaticData } from '@src/apis';
import { FIELD_NAME, OTP_ACTION } from '@src/constants';
import {
  TAccountsFormStatic,
  TAttachmentsFormStatic,
  TProductSelectorFormStatic,
  TProductParams,
  TLoanData,
  TCabinetApplication,
  TCabinetNotify,
  TAccount,
  TCabinetDeals,
  TUpdateAccountProps,
  TProductSelectorData,
  TNotificationIds,
  TCabinetPay,
  TReasonId,
} from './@types/loanStore';
import { OtpStore } from './OtpStore';

export class LoanStore {
  @observable accountsFormStatic?: TAccountsFormStatic;
  @observable attachmentsFormStatic?: TAttachmentsFormStatic;
  @observable productSelectorFormStatic?: TProductSelectorFormStatic;
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
  @observable public cabinetNotify: TCabinetNotify[] = [];
  @observable public account: TAccount = {
    [FIELD_NAME.ACCOUNT_NUMBER]: '',
  };
  @observable public cabinetDeals: TCabinetDeals = { dealInfos: [] };
  @observable public isNewAccount = true;
  @observable public invalidAccount = false;

  private docsInvalid = true;

  constructor(private loanApi: LoanApi) {}

  /**
   * @description Обновить состояние счета
   * @param isValid true - счёт не действителен, fasle - счёт действителен
   */
  @action
  public updateAccountValidity(isValid: boolean): void {
    this.invalidAccount = !isValid;
  }

  /**
   * @description Обновить состояние счета
   * @param isNew true - Новый, false - Существующий
   */
  @action
  public updateAccountState(isNew: boolean): void {
    if (!isNew) {
      this.resetAccount();
    }

    this.isNewAccount = isNew;
  }

  /** Калькулятор: изменить сумму */
  @action
  public updateAmmount(value: number): void {
    this.loanData.amount = value;
  }

  //Калькулятор: изменить срок
  @action
  public updateTerm(value: number): void {
    this.loanData.term = value;
  }

  @action
  public addOptionToAccountList({ account_id, accountNumber }: TAccount): void {
    if (this.cabinetApplication.accountUnit) {
      const accounts = this.cabinetApplication.accountUnit.accounts;

      const optionHasAdded = accounts.some(
        (account) => account.account_id == account_id
      );

      if (!optionHasAdded) {
        accounts.push({
          account_id,
          accountNumber,
        });
      }

      this.cabinetApplication.accountUnit.accounts = accounts;
    }
  }

  @action
  public resetAccount(): void {
    this.account = {
      accountNumber: '',
    };
  }

  @action
  public updateAccount({ name, value }: TUpdateAccountProps): void {
    this.account = {
      ...this.account,
      [name]: value,
    };
  }

  @action
  public updatePaymentAmount(value: number): void {
    this.cabinetDeals.dealInfos[0].paymentAmount = value;
  }

  public async initAttachmentsForm(): Promise<void> {
    const attachmentsFormStatic = await fetchStaticData({
      block: 'attachments-form',
      path: 'form',
    });

    runInAction(() => {
      this.attachmentsFormStatic = attachmentsFormStatic;
    });
  }

  public async initAccountForm(): Promise<void> {
    const accountsFormStatic = await fetchStaticData({
      block: 'accounts-form',
      path: 'form',
    });

    runInAction(() => {
      this.accountsFormStatic = accountsFormStatic;
    });
  }

  public async initProductSelectorForm(): Promise<void> {
    const productSelectorFormStatic = await fetchStaticData({
      block: 'product-selector-form',
      path: 'form',
    });

    runInAction(() => {
      this.productSelectorFormStatic = productSelectorFormStatic;
    });
  }

  public async addAccount(account: TAccount): Promise<any> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(URIS.account, {
      account: {
        ...account,
      },
    });

    return await this.loanApi.processData(requestConfig);
  }

  public async cabinetChangeAccount(account: TAccount): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
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
    const requestConfig = this.loanApi.postHeaderRequestConfig(
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
      const { view } = response;

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
  public updateStore_Application(
    cabinetApplication: TCabinetApplication
  ): void {
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
  public async updateStore_Deals(cabinetDeals: TCabinetDeals): Promise<void> {
    this.cabinetDeals = {
      ...this.cabinetDeals,
      ...cabinetDeals,
    };
  }

  public async uploadAttachment(files: FileList, type: string): Promise<void> {
    const formData = new FormData();

    _.map(files, (item) => {
      /*var reader = new FileReader();
      reader.readAsArrayBuffer(item);
      reader.onload = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
          console.info(evt.target, 'evt.target');
        }

        var arrayBuffer = reader.result;
        console.info(arrayBuffer, 'arrayBuffer');
        var bytes = new Uint8Array(arrayBuffer as ArrayBuffer);
        console.info(bytes, 'bytes');
        var blob = new Blob(bytes as BlobPart[], { type: item.type });

        console.info(blob, 'blob');

        var file = new File([blob], encodeURI(item.name), { type: item.type });
        console.info(file);
      };*/

      formData.append('file', item);
      formData.append('type_id', type);
      formData.append('filename', encodeURI(item.name));
    });

    const requestConfig = this.loanApi.postHeaderRequestConfig(
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
  public updateStore_Notify(cabinetNotify?: TCabinetNotify[]): void {
    this.cabinetNotify = cabinetNotify!;
  }

  //Подтвердить показ нотификации клиенту
  public async confirmDisplay(
    notificationIds: TNotificationIds
  ): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.notify_Confirm_Display,
      notificationIds
    );

    this.loanApi.processData(requestConfig);
  }

  //погашение из ЛК (и сайта?)
  public async cabinetPay(dealPay: TCabinetPay): Promise<void> {
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
  public async cabinetSign(account: any, otpStore: OtpStore): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_SIGN,
      account
    );

    const otpData = await this.loanApi.cabinetSign(requestConfig);

    const { otpId } = otpData;
    console.log(otpId);

    if (~otpId) {
      //const { phoneNumber } = userData;
      const action = OTP_ACTION.SIGN;

      otpStore.updateOtpState({ action, otpId /* phoneNumber, */ });
    }
  }

  // Отказ Клиента от заявки
  public async cabinetDecline(userDeclineReason: TReasonId): Promise<void> {
    const requestConfig = this.loanApi.postHeaderRequestConfig(
      URIS.CABINET_DECLINE,
      userDeclineReason
    );

    const status = await this.loanApi.cabinetDecline(requestConfig);

    console.log(status);
  }

  @action
  private checkDocs(): void {
    const { documentUnits } = this.cabinetApplication;

    if (!documentUnits) {
      this.docsInvalid = true;
      return;
    }

    _.each(documentUnits, (item) => {
      if (!item.valid) {
        this.docsInvalid = true;

        return item.valid;
      }

      this.docsInvalid = false;
    });
  }

  public get getInvalidDocs(): boolean {
    this.checkDocs();

    /* return (
      this.docsInvalid ||
      (this.isNewAccount && Boolean(!this.account.accountNumber.length))
    ); */

    return this.docsInvalid;
  }
}
