import { TJSON } from '@interfaces';
import { URIS, URLS } from '@routes';
import {
  SESSION_ID_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  FINGER_PRINT_KEY,
  METHOD,
  HEADERS,
} from '@src/constants';
import { TGetCookies, TGetFromStorage } from '@src/utils/@types';
import {
  getFromLocalStorage,
  getMD5,
  setToLocalStorage,
  clearLocalStorage,
  handleErrors,
  isDev,
  makeApiUri,
  getCookie,
} from '@utils';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Router from 'next/router';
import { checkStatus } from './apiUtils';

export class CommonApi {
  public get getSessionId(): TGetCookies {
    return getCookie(SESSION_ID_KEY);
  }

  public get getAccessToken(): TGetFromStorage {
    return getFromLocalStorage(getMD5(ACCESS_TOKEN_KEY));
  }

  public get getRefreshToken(): TGetFromStorage {
    return getFromLocalStorage(getMD5(REFRESH_TOKEN_KEY));
  }

  public get getFingerPrint(): TGetFromStorage {
    return getFromLocalStorage(getMD5(FINGER_PRINT_KEY));
  }

  public get getScreen(): string {
    return `${screen.width}x${screen.height}x${screen.colorDepth}`;
  }

  public async refreshToken(): Promise<void> {
    try {
      if (!this.getRefreshToken) throw new Error('NO refreshToken');

      const requestConfig = this.postHeaderRequestConfig(URIS.REFRESH_TOKEN, {
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
      if (Router.route != URLS.SIGN_IN) {
        console.info(`Redirect to ${URLS.SIGN_IN}`);
        Router.push(URLS.SIGN_IN);
      }
    }
  }

  // Получить данные из сервиса "любого"
  public processData = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, ...resData } = data;

      if (checkStatus(status)) return resData;
    } catch (err) {
      return handleErrors(err);
    }
  };

  public getClientNextStep = async (data?: any): Promise<any> => {
    const requestConfig = this.getHeaderRequestConfig(
      URIS.GET_CLIENT_STEP,
      data
    );
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, ...view } = data;

      if (isDev) console.info(data);

      if (checkStatus(status)) return view;
    } catch (err) {
      return handleErrors(err);
    }
  };

  private headerRequestConfig(
    method: METHOD,
    url: string,
    data?: TJSON
  ): AxiosRequestConfig {
    const accessToken = this.getAccessToken;
    let headers: TJSON = {
      [HEADERS.SESSIONID]: this.getSessionId,
      [HEADERS.REFERER]: window.location.href,
    };

    if (accessToken) {
      headers = {
        ...headers,
        [HEADERS.AUTHORIZATION]: `Bearer ${accessToken}`,
      };
    }

    const requestConfig: AxiosRequestConfig = {
      baseURL: makeApiUri(),
      method,
      url,
      headers,
      data,
    };

    return requestConfig;
  }

  public postHeaderRequestConfig(
    url: string,
    data?: TJSON
  ): AxiosRequestConfig {
    return this.headerRequestConfig(METHOD.POST, url, data);
  }

  public getHeaderRequestConfig(url: string, data?: TJSON): AxiosRequestConfig {
    return this.headerRequestConfig(METHOD.GET, url, data);
  }

  /* Взять Справочник. Сервис /directory/{directoryName} */
  public getDirectory = async (
    requestConfig: AxiosRequestConfig
  ): Promise<any> => {
    try {
      const { data }: AxiosResponse = await axios(requestConfig);
      const { status, ...values } = data;
      const newData = values.values;

      if (checkStatus(status)) return newData;

      return data;
    } catch (err) {
      handleErrors(err);
    }
  };
}
