import { URLS } from '@routes';
import {
  METHOD,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  SESSION_ID_KEY,
} from '@src/constants';
import {
  isDev,
  handleErrors,
  removeItemFromLocalStorage,
  getMD5,
} from '@utils';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Router from 'next/router';
import { CommonApi } from '.';
import { checkStatus } from './apiUtils';

export class UserApi extends CommonApi {
  public sendUserData = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, ...otpData } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) return otpData;
    } catch (err) {
      handleErrors(err);
    }
  };

  public fetchWizardData = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    const { method } = requestConfig;

    try {
      const response: AxiosResponse = await axios(requestConfig);

      if (response) {
        const {
          data: { status, ...responseData },
        } = response;

        if (checkStatus(status) && method == METHOD.GET) return responseData;
      }
    } catch (err) {
      handleErrors(err);
    }
  };

  public async logOut(requestConfig: AxiosRequestConfig): Promise<void> {
    try {
      const {
        data: { status },
      }: AxiosResponse = await axios(requestConfig);

      // clearLocalStorage();
      const userLoggedOutData = [
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        SESSION_ID_KEY,
      ];

      for (const i of userLoggedOutData) removeItemFromLocalStorage(getMD5(i));

      if (Router.route == URLS.HOME || Router.route == URLS.index) {
        Router.reload();
      } else {
        Router.push(URLS.HOME);
      }

      if (checkStatus(status)) console.info('Client has been logged out');
    } catch (err) {
      handleErrors(err);
    }
  }
}
