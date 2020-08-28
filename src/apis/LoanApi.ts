import axios, { AxiosResponse } from 'axios';
import Router from 'next/router';

import { checkStatus } from './apiUtils';
import { URLS } from '../routes';
import { getMD5, setToLocalStorage } from '../utils';
import { SESSIONID_KEY } from '../constants';

export class LoanApi {
  public fetchLoanData = async () => {};

  public calculate = async (requestConfig: any) => {
    try {
      const { data, headers }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...creditParams } = data;

      if (checkStatus(status)) {
        setToLocalStorage(getMD5(SESSIONID_KEY), headers['sessionid']);
        return { ...creditParams };
      }
    } catch (err) {
      console.info(err);
      return null;
    }
  };

  public wizardStart = async (requestConfig: any) => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...view } = data;

      if (checkStatus(status)) {
        return { ...view };
      }
    } catch (err) {
      if (err.response.status == 401) {
        alert('wizardStart: errResponse - 401: ПЕРЕЛОГИНЬСЯ!!!!!');
        //this.commonApi.refreshToken();
        return Router.push(URLS.SIGN_IN);
      }

      console.info(err);
      return null;
    }
  };
}
