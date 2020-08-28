import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Router from 'next/router';

import { makeApiUri, isDev } from '../utils';
import { METHOD } from '../constants';
import { URIS, URLS } from '../routes';
import { checkStatus } from './apiUtils';
import { TJSON } from '../interfaces';
import { TUserObligatory } from '../stores/@types/userStore';

export class UserApi {
  public sendUserData = async (data: TUserObligatory, urisKey: string = '') => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url: (URIS as TJSON)[`SEND_OTP${urisKey}`],
      data,
    };

    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...otpData } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) return { ...otpData };
    } catch (err) {
      console.info(err);

      return null;
    }
  };

  /* Перенесен в CommonApi */
  /* public getClientStep = async (data: any) => {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url: URIS.GET_CLIENT_STEP,
      headers: { [HEADERS.AUTHORIZATION]: `Bearer ${data}` },
      data,
    };

    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...view } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) return { ...view };
    } catch (err) {
      console.info(err);
      return null;
    }
  }; */

  public getWizardData = async (requestConfig: any) => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...view } = data;

      if (checkStatus(status)) return { ...view };
    } catch (err) {
      if (err.response.status == 401) {
        alert('errResponse - 401: ПЕРЕЛОГИНЬСЯ!!!!!');
        return Router.push(URLS['SIGN_IN']);
      }
      console.info(err);
      return null;
    }
  };

  public postWizardData = async (requestConfig: any) => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status /*error, errorDescription,  ...view */ } = data;

      if (checkStatus(status)) return { status };
    } catch (err) {
      if (err.response.status == 401) {
        alert('errResponse - 401: ПЕРЕЛОГИНЬСЯ!!!!!');
        return Router.push(URLS['SIGN_IN']);
      }

      console.info({ err });
      return null;
    }
  };
}
