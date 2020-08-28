import Router from 'next/router';
import { observable, runInAction } from 'mobx';

import { LoanApi, CommonApi, UserApi } from '../apis';
import { URIS, URLS } from '../routes';
import { TJSON } from '../interfaces';
import { TLoanData, TProductSelectorData } from './@types/loanStore';

export class LoanStore {
  @observable public loanData: TLoanData = {};

  constructor(
    private loanApi: LoanApi,
    private userApi: UserApi,
    private commonApi: CommonApi
  ) {}

  public async calculate(loanData: TProductSelectorData): Promise<void> {
    let requestConfig = this.commonApi.postRequestConfig(
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

  public async getLoan(userStore: any): Promise<void | boolean> {
    let requestConfig = this.commonApi.postHeaderRequestConfig(
      URIS.WIZARD_START,
      this.loanData
    );

    const response = await this.loanApi.wizardStart(requestConfig);

    if (response && response.view) {
      let { view } = response;

      //временная затычка, пока нет нормального "роутинга"
      /* if (view == 'address' || view == 'job' || view == 'documents') {
        view = 'obligatory';
      } */

      if (view == 'obligatory') {
        let requestConfigWizard = this.commonApi.getHeaderRequestConfig(
          URIS.obligatory,
          this.loanData
        );

        const { obligatory } = await this.userApi.getWizardData(
          requestConfigWizard
        );
        userStore.updateStore(obligatory);
      }

      //ПЕРЕПИСАТЬ, чтобы пробрасывало клиента на нужную страницу/шаг.
      return Router.push((URLS as TJSON)[view]);
    }

    // await this.loanApi.fetchLoanData();
    // Router.push(URLS.SIGN_UP);
  }
}
