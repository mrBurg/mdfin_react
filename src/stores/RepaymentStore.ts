import { observable, action, runInAction } from 'mobx';

import { RepaymentApi } from '../apis';
import { fetchStaticData } from '../apis/StaticApi';
import { TFormStatic } from './@types/repaymentStore';

export class RepaymentStore {
  @observable formStatic?: TFormStatic;
  @observable repayment: boolean = false;

  //@ts-ignore
  constructor(private repaymentApi: RepaymentApi) {}

  @action
  public async initPaymentForm(): Promise<void> {
    const formStatic = await fetchStaticData({
      block: 'repayment',
      path: 'form',
    });

    runInAction(() => {
      this.formStatic = formStatic;
    });
  }

  @action
  public updatePaymentState = (state: boolean): void => {
    this.repayment = state;
  };
}
