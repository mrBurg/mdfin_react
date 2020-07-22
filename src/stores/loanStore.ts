import Router from 'next/router';

import { LoanApi } from '../apis';
import { URLS } from '../routes';

export default class LoanStore {
  constructor(private loanApi: LoanApi) {}

  public async redirectToSignUp(): Promise<void> {
    await this.loanApi.fetchLoanData();

    Router.push(URLS.SIGN_UP);
  }
}
