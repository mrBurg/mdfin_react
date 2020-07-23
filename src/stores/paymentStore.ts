import { observable, computed, toJS } from 'mobx';

import { PaymentApi } from '../apis';

type TFormData =
  | {
      title: string;
      buttonText: string;
    }
  | undefined;

export default class PaymentStore {
  @observable formData: TFormData;

  constructor(private paymentApi: PaymentApi) {}

  public async initPaymentForm(): Promise<void> {
    this.formData = await this.paymentApi.fetchFormData();
  }

  @computed
  public get formDataJSON(): TFormData {
    return toJS(this.formData);
  }
}
