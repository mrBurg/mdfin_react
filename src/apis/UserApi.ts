import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Router from 'next/router';

import { makeApiUri, isDev } from '../utils';
import { METHOD, HEADERS } from '../constants';
import { URIS, URLS } from '../routes';
import { checkStatus } from './apiUtils';
import { TFormData } from '../stores/UserStore';
import { TJSON } from '../interfaces';

export class UserApi {
  public sendUserData = async (data: TFormData, urisKey: string = '') => {
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

  public getClientStep = async (data: any) => {
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
  };

  public getWizardObligatory = async (requestConfig: any) => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...view } = data;

      if (checkStatus(status)) {
        return { ...view };
      }
    } catch (err) {
      if (err.response.status == 401) {
        alert('errResponse - 401: ПЕРЕЛОГИНЬСЯ!!!!!');
        return Router.push((URLS as TJSON)['SIGN_IN']);
        //return Router.push(URLS.SIGN_IN);
      }

      console.info(err);
      return null;
    }
  };

  public postWizardData = async (requestConfig: any) => {
    try {
      const { data, headers }: AxiosResponse = await axios(requestConfig);
      console.log(headers);
      const { status /*error, errorDescription,  ...view */ } = data;

      if (checkStatus(status)) {
        return { status };
      } /* else {
        console.info(error, errorDescription);
        return { status };
      } */
    } catch (err) {
      console.log(err.response);

      if (err.response.status == 401) {
        alert('errResponse - 401: ПЕРЕЛОГИНЬСЯ ЧУВАК!!!!!');
        return Router.push((URLS as TJSON)['SIGN_IN']);
        //return Router.push(URLS.SIGN_IN);
      }

      console.info({ err });
      return null;
    }
  };
}
