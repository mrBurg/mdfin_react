import { observable, action, runInAction } from 'mobx';

import { PaymentApi } from '../apis';
import { fetchStaticData } from '../apis/StaticApi';

type TFormStatic = {
  title: string;
  buttonText: string;
};

export default class PaymentStore {
  @observable formStatic?: TFormStatic;

  //@ts-ignore
  constructor(private paymentApi: PaymentApi) {}

  @action
  public async initPaymentForm(): Promise<void> {
    const formStatic = await fetchStaticData({
      block: 'payment',
      path: 'form',
    });

    runInAction(() => {
      this.formStatic = formStatic;
    });
  }
}
