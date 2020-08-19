import Router from 'next/router';
import { observable, runInAction } from 'mobx';

import { LoanApi, CommonApi, UserApi } from '../apis';
import { URLS } from '../routes';
import { TJSON } from '../interfaces';

export type TFormData = {
  productId?: number;
  amount?: number;
  term?: number;
};

type TLoanData = {
  totalAmount?: number;
  dateTo?: string;
} & TFormData;

export default class LoanStore {
  @observable public loanData: TLoanData = {};

  constructor(
    private loanApi: LoanApi,
    private userApi: UserApi,
    private commonApi: CommonApi
  ) {}

  public async calculate(loanData: TFormData): Promise<void> {
    let requestConfig = this.commonApi.postRequestConfig('CALCULATE', loanData);

    console.info(requestConfig);

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

  public async getLoan(userStore: any): Promise<void | boolean> {
    let requestConfig = this.commonApi.postHeaderRequestConfig(
      'WIZARD_START',
      this.loanData
    );

    //const { view } = await this.loanApi.wizardStart(requestConfig);
    const response = await this.loanApi.wizardStart(requestConfig);
    console.log(response);
    if (response) {
      const { view } = response;

      if (view == 'obligatory') {
        let requestConfigWizard = this.commonApi.getHeaderRequestConfig(
          'OBLIGATORY',
          this.loanData
        );

        const { obligatory } = await this.userApi.getWizardObligatory(
          requestConfigWizard
        );
        userStore.updateStore(obligatory);
      }

      //return null;
      return Router.push((URLS as TJSON)[view]);
    }

    // await this.loanApi.fetchLoanData();
    // Router.push(URLS.SIGN_UP);
  }
}
