import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Router from 'next/router';

import {
  getFromLocalStorage,
  makeApiUri,
  getMD5,
  isDev,
  setToLocalStorage,
  handleErrors,
  clearLocalStorage,
} from '../utils';
import {
  ACCESS_TOKEN_KEY,
  METHOD,
  HEADERS,
  REFRESH_TOKEN_KEY,
  SESSION_ID_KEY,
  FINGER_PRINT_KEY,
} from '../constants';
import { URIS, URLS } from '../routes';
import { TJSON } from '../interfaces';
import { checkStatus } from './apiUtils';

export class CommonApi {
  public get getSessionId() {
    return getFromLocalStorage(getMD5(SESSION_ID_KEY));
  }

  public get getAccessToken() {
    return getFromLocalStorage(getMD5(ACCESS_TOKEN_KEY));
  }

  public get getRefreshToken() {
    return getFromLocalStorage(getMD5(REFRESH_TOKEN_KEY));
  }

  public get getFingerPrint() {
    return getFromLocalStorage(getMD5(FINGER_PRINT_KEY));
  }

  public async refreshToken(): Promise<void> {
    try {
      if (!this.getRefreshToken) throw new Error('NO refreshToken');

      let requestConfig = this.postHeaderRequestConfig(URIS.REFRESH_TOKEN, {
        refreshToken: this.getRefreshToken,
        fingerprint: this.getFingerPrint,
      });

      const response: AxiosResponse = await axios(requestConfig);

      if (response) {
        const {
          data: { status, accessToken, refreshToken },
        } = response;

        if (checkStatus(status)) {
          setToLocalStorage(getMD5(ACCESS_TOKEN_KEY), accessToken);
          setToLocalStorage(getMD5(REFRESH_TOKEN_KEY), refreshToken);
        }
      }
    } catch (err) {
      clearLocalStorage();

      Router.push(URLS.SIGN_IN);
    }
  }

  // Получить данные из сервиса "любого"
  public processData = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...resData } = data;

      if (checkStatus(status)) return resData;
    } catch (err) {
      handleErrors(err);
    }
  };

  public getClientNextStep = async (data?: any): Promise<any> => {
    const requestConfig = this.getHeaderRequestConfig(
      URIS.GET_CLIENT_STEP,
      data
    );
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...view } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) return view;
    } catch (err) {
      handleErrors(err);
    }
  };

  public postRequestConfig(url: string, data?: TJSON) {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url,
      headers: {
        [HEADERS.SESSIONID]: this.getSessionId,
      },
      data,
    };
    return requestConfig;
  }

  public postHeaderRequestConfig(url: string, data?: TJSON) {
    const accessToken = this.getAccessToken;

    if (!accessToken) return this.postRequestConfig(url, data);

    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.POST,
      url,
      headers: {
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HEADERS.SESSIONID]: this.getSessionId,
      },
      data,
    };
    return requestConfig;
  }

  public getRequestConfig(url: string, data?: TJSON) {
    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url,
      headers: {
        [HEADERS.SESSIONID]: this.getSessionId,
      },
      data,
    };
    return requestConfig;
  }

  public getHeaderRequestConfig(url: string, data?: TJSON) {
    const accessToken = this.getAccessToken;

    if (!accessToken) {
      return this.getRequestConfig(url, data);
    }

    let requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method: METHOD.GET,
      url,
      headers: {
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
        [HEADERS.SESSIONID]: this.getSessionId,
      },
      data,
    };
    return requestConfig;
  }

  /* Взять Справочник. Сервис /directory/{directoryName} */
  public getDirectory = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, error, errorDescription, ...values } = data;
      const newData = values.values;

      if (checkStatus(status)) return newData;

      return data;
    } catch (err) {
      handleErrors(err);
    }
  };
}
