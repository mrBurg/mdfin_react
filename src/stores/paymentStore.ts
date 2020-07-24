import { observable, action, runInAction } from 'mobx';

import { PaymentApi } from '../apis';

type TFormStatic = {
  title: string;
  buttonText: string;
};

export default class PaymentStore {
  @observable formData?: TFormStatic;

  constructor(private paymentApi: PaymentApi) {}

  @action
  public async initPaymentForm(): Promise<void> {
    const formData = await this.paymentApi.fetchFormStatic();

    runInAction(() => {
      this.formData = formData;
    });
  }
}
