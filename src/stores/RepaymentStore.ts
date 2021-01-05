import { URIS } from '@routes';
import { CommonApi, fetchStaticData } from '@src/apis';
import { observable, action, runInAction } from 'mobx';
import { TCabinetDeal, TDealInfo } from './@types/loanStore';
import { TFormStatic } from './@types/repaymentStore';

export class RepaymentStore {
  @observable formStatic?: TFormStatic;
  @observable repayment = false;
  @observable cabinetDeal: TCabinetDeal = {
    dealInfo: {
      dealNo: '',
      closingDate: '',
      closingAmount: 0,
      extensionAmount: 0,
      paymentAmount: 0,
    },
  };
  @observable validForm = true;

  constructor(private commonApi: CommonApi) {}

  public async initPaymentForm(): Promise<void> {
    const formStatic = await fetchStaticData({
      block: 'repayment-form',
      path: 'form',
    });

    runInAction(() => {
      this.formStatic = formStatic;
    });
  }

  @action
  public async initCabinetDeal(): Promise<void> {
    this.cabinetDeal = {
      dealInfo: {
        dealNo: '',
        closingDate: '',
        closingAmount: 0,
        extensionAmount: 0,
        paymentAmount: 0,
      },
    };
  }

  @action
  setValidForm(state: boolean): void {
    this.validForm = state;
  }

  @action
  public updatePaymentState = (state: boolean): void => {
    this.repayment = state;
  };

  @action
  public updatePaymentAmount(value: number): void {
    this.cabinetDeal.dealInfo.paymentAmount = value;
  }

  @action
  public updateDealNo(value: string): void {
    this.cabinetDeal.dealInfo.dealNo = value;
  }

  //Сделка из сайта (страница repayment)
  public async getCabinetDeal(): Promise<boolean> {
    const url = `${URIS.deal}?dealNo=${this.cabinetDeal.dealInfo.dealNo}`;
    const requestConfig = this.commonApi.getHeaderRequestConfig(url);
    const response = await this.commonApi.processData(requestConfig);

    if (response) {
      await this.updateStore_Deal(response);
      return true;
    }
    return false;
  }

  @action
  public async updateStore_Deal(cabinetDeal: TDealInfo): Promise<void> {
    this.cabinetDeal = {
      ...this.cabinetDeal,
      ...cabinetDeal,
    };
  }
}
